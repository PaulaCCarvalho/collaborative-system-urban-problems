import pool from "../config/db.js";

class NotificationRepository {
  static async create({ tipo, assunto, ocorrencia_id, usuario_id }) {
    const query = `
      INSERT INTO notificacao (tipo, assunto, ocorrencia_id, usuario_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [tipo, assunto, ocorrencia_id, usuario_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUser(usuario_id) {
    const query = `
      SELECT * FROM notificacao
      WHERE usuario_id = $1
      ORDER BY timestamp DESC;
    `;

    const { rows } = await pool.query(query, [usuario_id]);
    return rows;
  }

  static async markAsRead(id) {
    const query = `
      UPDATE notificacao
      SET lida = TRUE
      WHERE id = $1
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default NotificationRepository;
