import api from "../api";
import type { ApiResponse, Task, TaskForm } from "../../interfaces";

export const taskService = {
  /**
   * Get all tasks
   */
  async getAllTasks(projectId?: string): Promise<Task[]> {
    const url = projectId ? `/tasks?projectId=${projectId}` : "/tasks";
    const response = await api.get<ApiResponse<Task[]>>(url);
    return response.data.data || [];
  },

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  },

  /**
   * Create new task
   */
  async createTask(data: TaskForm): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>("/tasks", data);
    return response.data.data!;
  },

  /**
   * Update task
   */
  async updateTask(id: string, data: Partial<TaskForm>): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete<ApiResponse>(`/tasks/${id}`);
  },

  /**
   * Update task status
   */
  async updateTaskStatus(id: string, status: Task["status"]): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, {
      status,
    });
    return response.data.data!;
  },

  /**
   * Assign task to user
   */
  async assignTask(taskId: string, userId: string): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>(
      `/tasks/${taskId}/assign`,
      { userId }
    );
    return response.data.data!;
  },

  /**
   * Unassign task from user
   */
  async unassignTask(taskId: string, userId: string): Promise<Task> {
    const response = await api.delete<ApiResponse<Task>>(
      `/tasks/${taskId}/assign/${userId}`
    );
    return response.data.data!;
  },
};
