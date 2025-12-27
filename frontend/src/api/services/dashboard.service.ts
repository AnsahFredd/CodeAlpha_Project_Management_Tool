import api from "../api";
import type { DashboardStats } from "../../interfaces";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data.data;
  },
};
