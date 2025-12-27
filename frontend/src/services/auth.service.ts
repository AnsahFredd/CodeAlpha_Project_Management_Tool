import api from "./api";
import type { ApiResponse, User, LoginForm, RegisterForm } from "../interfaces";
import { STORAGE_KEYS } from "../utils/contants";
import { secureStorage } from "../utils/storage";

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/login",
      credentials
    );
    if (response.data.data) {
      secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
      secureStorage.setItem(STORAGE_KEYS.USER, response.data.data.user);
    }
    return response.data.data!;
  },

  /**
   * Register new user
   */
  async register(data: RegisterForm): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/register",
      data
    );
    if (response.data.data) {
      secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
      secureStorage.setItem(STORAGE_KEYS.USER, response.data.data.user);
    }
    return response.data.data!;
  },

  /**
   * Logout user
   */
  logout(): void {
    secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    secureStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return secureStorage.getItem<User>(STORAGE_KEYS.USER) as User | null;
  },

  /**
   * Get auth token
   */
  getToken(): string | null {
    return secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) as string | null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post<ApiResponse>("/auth/forgot-password", { email });
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await api.post<ApiResponse>("/auth/reset-password", { token, password });
  },

  /**
   * Get current user from API
   */
  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data!;
  },
};
