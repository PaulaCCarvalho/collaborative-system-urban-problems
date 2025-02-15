import pool from "../config/db.js";

class PopulationRepository {
  static async getPopulationByCoordinatesOrderByDensity(longitude, latitude) {
    const query = `
            SELECT * 
            FROM populacao_bairro_2010
            WHERE ST_Intersects(
                geom,
                ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983)
            )
            ORDER BY populacao DESC;
        `;

    const { rows } = await pool.query(query, [longitude, latitude]);

    return rows;
  }
}

export default PopulationRepository;
