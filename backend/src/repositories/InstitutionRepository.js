import pool from "../config/db.js";

class InstitutionRepository {
  static async findNearbyEducationalInstitutions(
    longitude,
    latitude,
    raio = 4000
  ) {
    const query = `
      WITH todas_instituicoes_ensino AS (
        SELECT nome, geom FROM public.creches_conveniadas
        UNION ALL
        SELECT nome, geom FROM public.ensino_superior
        UNION ALL
        SELECT nome, geom FROM public.escolas_estaduais
        UNION ALL
        SELECT nome, geom FROM public.escolas_federais
        UNION ALL
        SELECT nome, geom FROM public.escolas_municipais_educacao_infantil
        UNION ALL
        SELECT nome, geom FROM public.escolas_municipais_ensino_fundamental
        UNION ALL
        SELECT nome, geom FROM public.escolas_particulares
      )
      SELECT 
          nome,
          ST_Distance(
              geom, 
              ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983) -- Converte entrada (WGS84) para UTM 23S
          ) AS distancia,
          ST_AsGeoJSON(ST_Transform(geom, 4326)) AS coordenadas
      FROM todas_instituicoes_ensino
      WHERE ST_DWithin(
          geom,
          ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983),
          $3
      )
      ORDER BY distancia;
      `;

    const { rows } = await pool.query(query, [longitude, latitude, raio]);
    return rows;
  }

  static async findNearbyHealthcareInstitutions(
    longitude,
    latitude,
    raio = 4000
  ) {
    const query = `
      WITH todas_instituicoes_saude AS (
        SELECT nome, geom FROM public.centro_saude
        UNION ALL
        SELECT nome, geom FROM public.hospitais
        UNION ALL
        SELECT nome, geom FROM public.unidade_pronto_atendimento
      )
      SELECT 
          nome,
          ST_Distance(
              geom, 
              ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983) -- Converte entrada (WGS84) para UTM 23S
          ) AS distancia,
          ST_AsGeoJSON(ST_Transform(geom, 4326)) AS coordenadas
      FROM todas_instituicoes_saude
      WHERE ST_DWithin(
          geom,
          ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 31983),
          $3
      )
      ORDER BY distancia;
      `;

    const { rows } = await pool.query(query, [longitude, latitude, raio]);
    return rows;
  }
}

export default InstitutionRepository;
