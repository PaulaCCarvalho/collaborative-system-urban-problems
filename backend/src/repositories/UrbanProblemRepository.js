import pool from "../config/db.js";

class UrbanProblemRepository {
  static async registerPotholeProblem({
    longitude,
    latitude,
    largura,
    comprimento,
    profundidade,
    descricao,
  }) {
    const query = `
            WITH inserir_buraco AS (
                INSERT INTO buraco (geom, largura, comprimento, profundidade)
                VALUES (
                    ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983),
                    $3, 
                    $4,
                    $5
                )
                RETURNING id
            )
            INSERT INTO problema (tipo, descricao, geom, buraco_id)
            SELECT 
                'buraco',
                $6, 
                ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983),
                id 
            FROM inserir_buraco
            RETURNING id;
        `;

    const values = [
      longitude,
      latitude,
      largura ?? null,
      comprimento ?? null,
      profundidade ?? null,
      descricao,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0].id;
  }

  static async registerPublicLightingProblem({
    longitude,
    latitude,
    status,
    descricao,
  }) {
    const query = `
        WITH poste_proximo AS (
            SELECT id_poste_i 
            FROM postes
            ORDER BY geom <-> ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983)
            LIMIT 1
        ),
        novo_status AS (
            INSERT INTO iluminacao_publica (poste_id, status)
            SELECT id_poste_i, $3
            FROM poste_proximo
            RETURNING id, poste_id
        )
        INSERT INTO problema (tipo, descricao, geom, iluminacao_publica_id)
        SELECT 
            'iluminacao_publica',
            $4,
            (SELECT geom FROM postes WHERE id_poste_i = n.poste_id),
            n.id
        FROM novo_status n
        RETURNING id;
    `;

    const values = [longitude, latitude, status, descricao];

    const { rows } = await pool.query(query, values);
    return rows[0].id;
  }

  static async getPotholeDetails(id) {
    const query = `
      SELECT 
        o.*,
        p.descricao as problema_descricao,
        b.largura,
        b.comprimento,
        b.profundidade,
        c.nivel as criticidade,
        ST_AsGeoJSON(ST_Transform(o.geom, 4326)) as geom_4326,
        ST_AsGeoJSON(o.geom) as geom_31983
      FROM ocorrencia o
      JOIN problema p ON o.problema_id = p.id
      JOIN buraco b ON p.buraco_id = b.id
      LEFT JOIN area_critica c ON o.criticidade_id = c.id
      WHERE o.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return this.mapPotholeResult(rows[0]);
  }

  static async getLightingDetails(id) {
    const query = `
      SELECT 
        o.*,
        p.descricao as problema_descricao,
        ip.status AS problema_status,
        ip.data_registro,
        pt.id_poste_i,
        pt.iluminacao,
        c.nivel as criticidade,
        ST_AsGeoJSON(ST_Transform(o.geom, 4326)) as geom_4326,
        ST_AsGeoJSON(pt.geom) as poste_geom_31983
      FROM ocorrencia o
      JOIN problema p ON o.problema_id = p.id
      JOIN iluminacao_publica ip ON p.iluminacao_publica_id = ip.id
      JOIN postes pt ON ip.poste_id = pt.id_poste_i
      LEFT JOIN area_critica c ON o.criticidade_id = c.id
      WHERE o.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return this.mapLightingResult(rows[0]);
  }

  static mapPotholeResult(row) {
    return {
      id: row.id,
      titulo: row.titulo,
      timestamp: row.timestamp,
      status: row.status,
      geom: JSON.parse(row.geom_4326),
      autor: row.usuario_id,
      criticidade: row.criticidade,
      problema: {
        tipo: "buraco",
        descricao: row.problema_descricao,
        largura: row.largura,
        comprimento: row.comprimento,
        profundidade: row.profundidade,
      },
    };
  }

  static mapLightingResult(row) {
    return {
      id: row.id,
      titulo: row.titulo,
      geom: JSON.parse(row.geom_4326),
      timestamp: row.timestamp,
      status: row.status,
      autor: row.usuario_id,
      criticidade: row.criticidade,
      problema: {
        tipo: "iluminacao_publica",
        descricao: row.problema_descricao,
        status: row.problema_status,
        data_registro: row.data_registro,
        poste: {
          id: row.id_poste_i,
          iluminacao: row.iluminacao,
        },
      },
    };
  }

  static async getRegionsByProblemType() {
    const query = `
    SELECT 
      r.id_reg AS id,
      r.sigla,
      r.nome,
      r.area_km2,
      COUNT(CASE WHEN p.tipo = 'buraco' THEN 1 END) AS total_buracos,
      COUNT(CASE WHEN p.tipo = 'iluminacao_publica' THEN 1 END) AS total_iluminacao,
      ST_AsGeoJSON(ST_Transform(r.geom, 4326)) AS geom,
      (COUNT(CASE WHEN p.tipo = 'buraco' THEN 1 END) + 
       COUNT(CASE WHEN p.tipo = 'iluminacao_publica' THEN 1 END)) AS total_ocorrencias
    FROM regional r
    LEFT JOIN ocorrencia o 
      ON ST_Intersects(o.geom, r.geom)
    LEFT JOIN problema p 
      ON o.problema_id = p.id
    GROUP BY r.id_reg, r.sigla, r.nome, r.area_km2, r.geom
    ORDER BY total_ocorrencias DESC;
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
      ocorrencias: {
        buracos: parseInt(row.total_buracos),
        iluminacao_publica: parseInt(row.total_iluminacao),
        total: parseInt(row.total_ocorrencias),
      },
    }));
  }

  static async updateProblem(id, updateData) {
    const { descricao, largura, comprimento, profundidade, status } =
      updateData;

    const problemaQuery = `
    UPDATE problema
    SET descricao = COALESCE($1, descricao)
    WHERE id = $2
    RETURNING *;
  `;
    await pool.query(problemaQuery, [descricao, id]);

    const problema = await this.findProblemById(id);
    if (problema.tipo === "buraco") {
      const buracoQuery = `
      UPDATE buraco
      SET 
        largura = COALESCE($1, largura),
        comprimento = COALESCE($2, comprimento),
        profundidade = COALESCE($3, profundidade)
      WHERE id = $4;
    `;
      await pool.query(buracoQuery, [
        largura,
        comprimento,
        profundidade,
        problema.buraco_id,
      ]);
    } else if (problema.tipo === "iluminacao_publica") {
      const iluminacaoQuery = `
      UPDATE iluminacao_publica
      SET status = COALESCE($1, status)
      WHERE id = $2;
    `;
      await pool.query(iluminacaoQuery, [
        status,
        problema.iluminacao_publica_id,
      ]);
    }
  }

  static async findProblemById(id) {
    const query = `
    SELECT 
      p.id,
      p.tipo,
      p.buraco_id,
      p.iluminacao_publica_id
    FROM problema p
    WHERE p.id = $1;
  `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default UrbanProblemRepository;
