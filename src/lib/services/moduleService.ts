import api from "../api";

export interface ModuleRequest {
  titre: string;
  description: string;
  duree: string;
  niveauId: number;
  enseignantId: number;
}

export interface ModuleResponse {
  id: number;
  titre: string;
  description: string;
  duree: string;
  // Support for both nested and flat structures
  niveau?: { id: number; nom: string };
  enseignant?: { id: number; nom: string; prenom?: string };
  niveauId?: number;
  niveauNom?: string;
  enseignantId?: number;
  enseignantNom?: string;
  enseignantPrenom?: string;
}

const moduleService = {
  getAll: async () => {
    const response = await api.get<ModuleResponse[]>("modules");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ModuleResponse>(`modules/${id}`);
    return response.data;
  },

  getByNiveau: async (niveauId: number) => {
    const response = await api.get<ModuleResponse[]>(`modules/niveau/${niveauId}`);
    return response.data;
  },

  getByEnseignant: async (enseignantId: number) => {
    const response = await api.get<ModuleResponse[]>(`modules/enseignant/${enseignantId}`);
    return response.data;
  },

  getMesModules: async () => {
    const response = await api.get<ModuleResponse[]>("modules/mes-modules");
    return response.data;
  },

  create: async (data: ModuleRequest) => {
    const response = await api.post<ModuleResponse>("modules", data);
    return response.data;
  },

  update: async (id: number, data: ModuleRequest) => {
    const response = await api.put<ModuleResponse>(`modules/${id}`, data);
    return response.data;
  },

  patch: async (id: number, data: Partial<ModuleRequest>) => {
    const response = await api.patch<ModuleResponse>(`modules/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`modules/${id}`);
    return response.data;
  },
};

export default moduleService;
