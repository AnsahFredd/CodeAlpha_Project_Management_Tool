import api from "../api";
import type { ApiResponse, Team, TeamForm } from "../../interfaces";

export const teamService = {
  /**
   * Get all teams
   */
  async getAllTeams(): Promise<Team[]> {
    const response = await api.get<ApiResponse<Team[]>>("/teams");
    return response.data.data || [];
  },

  /**
   * Get team by ID
   */
  async getTeamById(id: string): Promise<Team> {
    const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data.data!;
  },

  /**
   * Create new team
   */
  async createTeam(data: TeamForm): Promise<Team> {
    const response = await api.post<ApiResponse<Team>>("/teams", data);
    return response.data.data!;
  },

  /**
   * Update team
   */
  async updateTeam(id: string, data: Partial<TeamForm>): Promise<Team> {
    const response = await api.put<ApiResponse<Team>>(`/teams/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete team
   */
  async deleteTeam(id: string): Promise<void> {
    await api.delete<ApiResponse>(`/teams/${id}`);
  },

  /**
   * Add member to team
   */
  async addMember(teamId: string, userId: string): Promise<Team> {
    const response = await api.post<ApiResponse<Team>>(
      `/teams/${teamId}/members`,
      { userId }
    );
    return response.data.data!;
  },

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, userId: string): Promise<Team> {
    const response = await api.delete<ApiResponse<Team>>(
      `/teams/${teamId}/members/${userId}`
    );
    return response.data.data!;
  },
};
