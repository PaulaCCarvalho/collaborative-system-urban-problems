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
}

export default ReportRepository;
