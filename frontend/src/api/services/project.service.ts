import api from "../api";
import type { ApiResponse, Project, ProjectForm } from "../../interfaces";

export const projectService = {
  /**
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<ApiResponse<Project[]>>("/projects");
    return response.data.data || [];
  },

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data!;
  },

  /**
   * Create new project
   */
  async createProject(data: ProjectForm): Promise<Project> {
    const response = await api.post<ApiResponse<Project>>("/projects", data);
    return response.data.data!;
  },

  /**
   * Update project
   */
  async updateProject(
    id: string,
    data: Partial<ProjectForm>
  ): Promise<Project> {
    const response = await api.put<ApiResponse<Project>>(
      `/projects/${id}`,
      data
    );
    return response.data.data!;
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    await api.delete<ApiResponse>(`/projects/${id}`);
  },

  /**
   * Add member to project
   */
  async addMember(projectId: string, userId: string): Promise<Project> {
    const response = await api.post<ApiResponse<Project>>(
      `/projects/${projectId}/members`,
      { userId }
    );
    return response.data.data!;
  },

  /**
   * Remove member from project
   */
  async removeMember(projectId: string, userId: string): Promise<Project> {
    const response = await api.delete<ApiResponse<Project>>(
      `/projects/${projectId}/members/${userId}`
    );
    return response.data.data!;
  },
};
