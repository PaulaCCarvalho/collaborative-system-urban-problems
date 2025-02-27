import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

const listReports = async (filters) => {
  const params = {
    status: filters.status || undefined,
    days: filters.days || undefined,
    tipo:
      filters?.tipos && filters.tipos.length > 0
        ? filters.tipos.join(",")
        : undefined,
  };

  return await api.get("/ocorrencias", {
    params,
  });
};

const login = async (credentials) => {
  const response = await api.post("/usuarios/login", credentials);
  return response.data;
};

const addReport = async (occurrenceData) => {
  return await api.post("/ocorrencias", occurrenceData);
};

const getDensityRegions = async () => {
  return await api.get("/ocorrencias/densidade/regioes");
};

const getDensityNeighborhoods = async () => {
  return await api.get("/ocorrencias/densidade/bairros");
};

const getRegionsRanking = async () => {
  return await api.get("/ocorrencias/regioes/ranking");
}

const getOccurrenceCountByType = async () => {
  return await api.get("/ocorrencias/contagem-por-tipo");
}

const getNeighborhoodsWithReports = async (params) => {
  return await api.get(`/ocorrencias/bairros/raio?${params}`)
}

const getNearestReports = async(params) => {
  return await api.get(`/ocorrencias/proximas?${params}`)
}

const getOccurrenceDetails = async (id) => {
  return await api.get(`/ocorrencias/${id}`)
}

const getComments = async (id) => {
  return await api.get(`/comentarios/ocorrencias/${id}`);
};


const addComment = async (data) => {
  return await api.post("/comentarios", data );
 
};

const editComment = async ({ commentId, texto }) => {
  const response = await api.put(`/comentarios/${commentId}`, { texto });
  return response.data;
};

const editOccurrence = async ( occurrenceId, updatedData ) => {
  const response = await api.put(`/ocorrencias/${occurrenceId}`, 
    updatedData,
  );
  return response.data;
};

const deleteComment = async (id) => {
  return await api.delete(`/comentarios/${id}`);
};

const getNearbyInstitutions = async (params) => {
  return await api.get(`/instituicoes/proximas?${params}`);
}

const getNotifications = async () => {
  return await api.get(`/notificacoes`);
}

const markNotificationAsRead = async (notificationId) => {
  return await api.put(`/notificacoes/${notificationId}/marcar-como-lida`)
}

const userSignUp = async (userData) => {
  return await api.post('/usuarios/cadastrar', userData)
}

const getAverageDistance = async () => {
  return await api.get("/ocorrencias/media-distancia");
}

export {
  listReports,
  login,
  addReport,
  getDensityRegions,
  getDensityNeighborhoods,
  getRegionsRanking,
  getOccurrenceCountByType,
  getNeighborhoodsWithReports,
  getNearestReports,
  getOccurrenceDetails,
  getComments,
  addComment,
  editComment,
  deleteComment,
  editOccurrence,
  getNearbyInstitutions,
  getNotifications,
  markNotificationAsRead,
  userSignUp,
  getAverageDistance,
};
