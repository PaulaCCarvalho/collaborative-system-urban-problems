import pool from "../config/db.js";

class ReportRepository {
  static async create(reportData) {
    const query = `
            INSERT INTO ocorrencia (
                titulo, geom, problema_id, usuario_id, criticidade_id
            ) VALUES (
                $1, 
                ST_Transform(ST_SetSRID(ST_MakePoint($2, $3), 4326), 31983),
                $4, $5, $6
            )
            RETURNING id, timestamp, status, problema_id, criticidade_id, titulo; 
        `;

    const values = [
      reportData.titulo,
      reportData.longitude,
      reportData.latitude,
      reportData.problema_id,
      reportData.usuario_id,
      reportData.criticidade_id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  }

  static async getReportById(id) {
    const query = `
      SELECT o.*, p.tipo 
      FROM ocorrencia o
      JOIN problema p ON o.problema_id = p.id
      WHERE o.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getReportsByNeighborhood(neighborhoodId) {
    const query = `
      WITH bairro AS (
        SELECT geom 
        FROM bairro_popular 
        WHERE id = $1
      )
      SELECT 
        o.id,
        o.titulo,
        p.tipo,
        ST_AsGeoJSON(ST_Transform(o.geom, 4326)) as geom,
        c.nivel as criticidade
      FROM ocorrencia o
      JOIN problema p ON o.problema_id = p.id
      LEFT JOIN area_critica c ON o.criticidade_id = c.id
      JOIN bairro b ON ST_Intersects(o.geom, b.geom)
    `;

    const { rows } = await pool.query(query, [neighborhoodId]);
    return rows.map((row) => ({
      ...row,
      geom: JSON.parse(row.geom),
    }));
  }

  static async getReportDensityByNeighborhood() {
    const query = `
     SELECT 
      b.id AS bairro_id,
      b.nome AS bairro_nome,
      b.area_km2,
      COUNT(o.id) AS total_ocorrencias,
      ROUND(
        COUNT(o.id) / GREATEST(b.area_km2, 0.01),
        2
      ) AS densidade_km2,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', o.id,
            'geom', ST_AsGeoJSON(ST_Transform(o.geom, 4326))
          )
        ) FILTER (WHERE o.id IS NOT NULL), 
        '[]'
      ) AS ocorrencias
    FROM bairro_popular b
    LEFT JOIN ocorrencia o 
      ON ST_Intersects(o.geom, b.geom)
    GROUP BY b.id, b.nome, b.area_km2
    ORDER BY densidade_km2 DESC;
  `;

    const { rows } = await pool.query(query);
    return rows.map((row) => ({
      bairro: {
        id: row.id,
        nome: row.nome,
        area_km2: row.area_km2,
      },
      metricas: {
        total_ocorrencias: row.total_ocorrencias,
        densidade_km2: row.densidade_km2,
      },
      ocorrencias: row.ocorrencias.map((ocorrencia) => ({
        id: ocorrencia.id,
        geom: JSON.parse(ocorrencia.geom),
      })),
    }));
  }

  static async getNearestReports({ longitude, latitude, limit }) {
    const query = `
    SELECT 
      o.id,
      o.titulo,
      p.tipo,
      ST_AsGeoJSON(ST_Transform(o.geom, 4326)) AS geom,
      ST_Distance(
        ST_Transform(o.geom, 4326)::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) AS distancia_metros
    FROM ocorrencia o
    JOIN problema p ON o.problema_id = p.id
    WHERE ST_DWithin(
      ST_Transform(o.geom, 4326)::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      10000
    )
    ORDER BY ST_Distance(
      ST_Transform(o.geom, 4326)::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
    )
    LIMIT $3;
  `;

    const { rows } = await pool.query(query, [longitude, latitude, limit]);
    return rows.map((row) => ({
      ...row,
      geom: JSON.parse(row.geom),
      distancia_metros: Math.round(row.distancia_metros),
    }));
  }

  static async getReportDensityByRegion() {
    const query = `
    SELECT 
      r.id_reg AS id,
      r.sigla,
      r.nome,
      r.area_km2,
      COUNT(o.id) AS total_ocorrencias,
      ROUND(
        COUNT(o.id) / GREATEST(r.area_km2, 0.01), 2
      ) AS densidade_km2,
      ST_AsGeoJSON(ST_Transform(r.geom, 4326)) AS geom
    FROM regional r
    LEFT JOIN ocorrencia o 
      ON ST_Intersects(o.geom, r.geom)
    GROUP BY r.id_reg, r.sigla, r.nome, r.area_km2, r.geom
    ORDER BY densidade_km2 DESC;
  `;

    const { rows } = await pool.query(query);
    return rows.map((row) => ({
      regiao: {
        id: row.id,
        sigla: row.sigla,
        nome: row.nome,
        area_km2: row.area_km2,
        geom: JSON.parse(row.geom),
      },
      metricas: {
        total: row.total_ocorrencias,
        densidade: row.densidade_km2,
      },
    }));
  }

  static async getNeighborhoodsWithReports({ longitude, latitude, raio, min }) {
    const query = `
    WITH ponto_referencia AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography AS geom
    ),
    buffer AS (
      SELECT ST_Buffer(geom, $3) AS area
      FROM ponto_referencia
    ),
    ocorrencias_no_raio AS (
      SELECT 
        o.id,
        ST_Transform(o.geom, 4326)::geography AS geom
      FROM ocorrencia o
      JOIN buffer b ON ST_Intersects(
        ST_Transform(o.geom, 4326)::geography,
        b.area
      )
    ),
    bairros_afetados AS (
      SELECT 
        bp.id,
        bp.nome,
        COUNT(oc.id) AS total_ocorrencias,
        ST_AsGeoJSON(ST_Transform(bp.geom, 4326)) AS geom
      FROM bairro_popular bp
      JOIN ocorrencias_no_raio oc 
        ON ST_Intersects(
          ST_Transform(bp.geom, 4326)::geography,
          oc.geom
        )
      GROUP BY bp.id, bp.nome, bp.geom
      HAVING COUNT(oc.id) >= $4
    )
    SELECT * FROM bairros_afetados
    ORDER BY total_ocorrencias DESC;
  `;
    console.log(longitude, latitude, raio, min);
    const { rows } = await pool.query(query, [longitude, latitude, raio, min]);

    return rows.map((row) => ({
      bairro: {
        id: row.id,
        nome: row.nome,
        geom: JSON.parse(row.geom),
      },
      metricas: {
        ocorrencias: row.total_ocorrencias,
      },
    }));
  }

  static async getAverageDistanceByType() {
    const query = `
    WITH pares_ocorrencias AS (
      SELECT 
        p1.tipo,
        ST_Distance(
          ST_Transform(o1.geom, 4326)::geography,
          ST_Transform(o2.geom, 4326)::geography
        ) AS distancia
      FROM ocorrencia o1
      JOIN problema p1 ON o1.problema_id = p1.id
      JOIN ocorrencia o2 ON o1.id < o2.id
      JOIN problema p2 ON o2.problema_id = p2.id AND p2.tipo = p1.tipo
      WHERE ST_DWithin(
        ST_Transform(o1.geom, 4326)::geography,
        ST_Transform(o2.geom, 4326)::geography,
        100000
      )
    )
    SELECT 
      tipo,
      ROUND(AVG(distancia::NUMERIC), 0) AS media_distancia,
      COUNT(*) AS total_pares
    FROM pares_ocorrencias
    GROUP BY tipo;
  `;

    const { rows } = await pool.query(query);

    return rows.map((row) => ({
      tipo: row.tipo,
      media_distancia: row.media_distancia,
      total_pares_analisados: row.total_pares,
    }));
  }

  static async countByType() {
    const query = `
    SELECT 
      p.tipo,
      COUNT(*) AS total
    FROM ocorrencia o
    JOIN problema p ON o.problema_id = p.id
    GROUP BY p.tipo
    ORDER BY total DESC;
  `;

    const { rows } = await pool.query(query);
    return rows;
  }

  static async findByFilters(filters) {
    let whereClauses = [];
    let params = [];
    let paramIndex = 1;

    if (filters.status) {
      whereClauses.push(`o.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.days) {
      whereClauses.push(
        `o.timestamp >= CURRENT_DATE - (INTERVAL '1 day' * $${paramIndex})`
      );
      params.push(filters.days);
      paramIndex++;
    }

    const where =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
    SELECT 
      o.id,
      o.timestamp,
      o.status,
      ST_AsGeoJSON(ST_Transform(o.geom, 4326)) AS geom,
      o.titulo,
      p.tipo,
      p.descricao,
      c.nivel,
      o.usuario_id AS autor
    FROM ocorrencia o
    JOIN problema p ON o.problema_id = p.id
    JOIN area_critica c ON o.criticidade_id = c.id
    ${where}
    ORDER BY o.timestamp DESC
  `;

    const { rows } = await pool.query(query, params);
    return rows.map((row) => ({ ...row, geom: JSON.parse(row.geom) }));
  }

  static async updateOccurrence(id, updateData) {
    const { titulo, status } = updateData;

    const query = `
    UPDATE ocorrencia
    SET 
      titulo = COALESCE($1, titulo),
      status = COALESCE($2, status)
    WHERE id = $3
    RETURNING *;
  `;

    const values = [titulo, status, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = `
    SELECT 
      o.id,
      o.titulo,
      o.status,
      o.usuario_id,
      o.problema_id,
      p.tipo
    FROM ocorrencia o
    JOIN problema p ON o.problema_id = p.id
    WHERE o.id = $1;
  `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateOccurrenceStatus(id, status) {
    const query = `
    UPDATE ocorrencia
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;

    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
  }
}

export default ReportRepository;
