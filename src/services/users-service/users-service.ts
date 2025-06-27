import api from '@/services/api/api';
import { AxiosError } from 'axios';
import {
  CreateUserPayload,
  CreateUserResponse,
  GetUsersResponse,
  UpdateUserPayload,
  UpdateUserResponse,
} from './types';

const UsersService = {
  async getUsers(page: number = 1): Promise<GetUsersResponse> {
    try {
      const response = await api.get<GetUsersResponse>(`/users?page=${page}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.error || 'Failed to fetch users');
      }
      throw error;
    }
  },
  async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    try {
      const response = await api.post<CreateUserResponse>('/users', payload);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.error || 'Failed to create user');
      }
      throw error;
    }
  },
  async updateUser(id: string, payload: UpdateUserPayload): Promise<UpdateUserResponse> {
    try {
      const response = await api.put<UpdateUserResponse>(`/users/${id}`, payload);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.error || 'Failed to update user');
      }
      throw error;
    }
  },
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.error || 'Failed to delete user');
      }
      throw error;
    }
  },
};

export default UsersService;
