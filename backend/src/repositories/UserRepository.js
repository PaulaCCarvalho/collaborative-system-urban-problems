import pool from "../config/db.js";

class UserRepository {
  static async createUser({ nome, email, tipo, senha }) {
    const query = `
            INSERT INTO public.usuario (nome, email, tipo, senha)
            VALUES ($1, $2, $3, $4);
        `;
    const { rows } = await pool.query(query, [nome, email, tipo, senha]);
    return rows[0];
  }

  static async findUserByEmail(email) {
    const query = `
        SELECT * FROM public.usuario WHERE email = $1;
      `;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
}

export default UserRepository;
