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
   * Add member to team (Directly)
   */
  async addMember(
    teamId: string,
    data: { email: string; role?: string }
  ): Promise<Team> {
    const response = await api.post<ApiResponse<Team>>(
      `/teams/${teamId}/members`,
      data
    );
    return response.data.data!;
  },

  /**
   * Invite member to team (Email)
   */
  async inviteMember(
    teamId: string,
    data: { email: string; role?: string }
  ): Promise<void> {
    await api.post<ApiResponse>(`/teams/${teamId}/invite`, data);
  },

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, userId: string): Promise<void> {
    await api.delete<ApiResponse>(`/teams/${teamId}/members/${userId}`);
  },

  /**
   * Update member role
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    role: string
  ): Promise<Team> {
    const response = await api.patch<ApiResponse<Team>>(
      `/teams/${teamId}/members/${userId}`,
      { role }
    );
    return response.data.data!;
  },
};
