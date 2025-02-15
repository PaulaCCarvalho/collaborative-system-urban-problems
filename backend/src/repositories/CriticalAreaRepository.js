import pool from "../config/db.js";

class CriticalAreaRepository {
  static async createCriticality({ nivel, longitude, latitude }) {
    const query = `
      INSERT INTO area_critica (nivel, geom)
      VALUES (
        $1,
        ST_Transform(
          ST_SetSRID(ST_MakePoint($2, $3), 4326),
          31983
        )
      )
      RETURNING id, nivel;
    `;

    try {
      const { rows } = await pool.query(query, [nivel, longitude, latitude]);

      return rows[0];
    } catch (error) {
      throw new Error("Falha ao registrar área crítica");
    }
  }
}

export default CriticalAreaRepository;
