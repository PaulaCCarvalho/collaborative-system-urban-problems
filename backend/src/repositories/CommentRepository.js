import pool from "../config/db.js";

class CommentRepository {
  static async create({ texto, usuario_id, ocorrencia_id }) {
    const query = `
      INSERT INTO comentario (texto, usuario_id, ocorrencia_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [texto, usuario_id, ocorrencia_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getRecent(ocorrencia_id) {
    const query = `
     SELECT 
        c.id, 
        c.texto, 
        c.timestamp, 
        c.ocorrencia_id,
        c.usuario_id,
        u.nome as "usuario_nome"
      FROM comentario c
      INNER JOIN usuario u ON c.usuario_id = u.id
      WHERE c.ocorrencia_id = $1
      ORDER BY c.timestamp DESC
    `;

    const { rows } = await pool.query(query, [ocorrencia_id]);
    return rows;
  }

  static async update(id, texto) {
    const query = `
      UPDATE comentario
      SET texto = $1
      WHERE id = $2
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [texto, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM comentario
      WHERE id = $1
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT * FROM comentario
      WHERE id = $1;
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default CommentRepository;
