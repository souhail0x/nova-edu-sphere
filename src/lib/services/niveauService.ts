import api from "../api";

export interface Niveau {
  id?: number;
  nom: string;
  filiere: string;
  annee: string;
}

const niveauService = {
  getAll: async () => {
    const response = await api.get<Niveau[]>("niveaux");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Niveau>(`niveaux/${id}`);
    return response.data;
  },

  create: async (data: Niveau) => {
    const response = await api.post<Niveau>("niveaux", data);
    return response.data;
  },

  update: async (id: number, data: Niveau) => {
    const response = await api.put<Niveau>(`niveaux/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`niveaux/${id}`);
    return response.data;
  },
};

export default niveauService;
