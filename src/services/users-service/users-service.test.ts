import api from '@/services/api/api';
import { AxiosError } from 'axios';
import UsersService from './users-service';

jest.mock('@/services/api/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('UsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should successfully fetch users with default page', async () => {
      const mockResponse = {
        data: {
          data: [],
          total: 0,
          page: 1,
          total_pages: 1,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UsersService.getUsers();

      expect(api.get).toHaveBeenCalledWith('/users?page=1');
      expect(result).toEqual(mockResponse.data);
    });

    it('should successfully fetch users with custom page', async () => {
      const mockResponse = {
        data: {
          data: [],
          total: 0,
          page: 2,
          total_pages: 1,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UsersService.getUsers(2);

      expect(api.get).toHaveBeenCalledWith('/users?page=2');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getUsers error with response data', async () => {
      const mockError = new AxiosError('Failed to fetch users', '500', undefined, undefined, {
        status: 500,
        data: { error: 'Failed to fetch users' },
      } as AxiosError['response']);

      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.getUsers()).rejects.toThrow('Failed to fetch users');
    });

    it('should handle getUsers error without response data', async () => {
      const mockError = new AxiosError('Failed to fetch users', '500', undefined, undefined, {
        status: 500,
        data: {},
      } as AxiosError['response']);

      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.getUsers()).rejects.toThrow('Failed to fetch users');
    });

    it('should handle non-AxiosError in getUsers', async () => {
      const mockError = new Error('Network error');

      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.getUsers()).rejects.toThrow('Network error');
    });

    it('should handle error with response.data as string', async () => {
      const mockError = new AxiosError('Simple error message', '500', undefined, undefined, {
        status: 500,
        data: { error: 'Simple error message' },
      } as AxiosError['response']);

      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.getUsers()).rejects.toThrow('Simple error message');
    });

    it('should handle error with response.data as number', async () => {
      const mockError = new AxiosError('500', '500', undefined, undefined, {
        status: 500,
        data: { error: '500' },
      } as AxiosError['response']);

      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.getUsers()).rejects.toThrow('500');
    });
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const payload = { first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
      const mockResponse = { data: { id: 1, ...payload } };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UsersService.createUser(payload);

      expect(api.post).toHaveBeenCalledWith('/users', payload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle createUser error with response data', async () => {
      const payload = { first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
      const mockError = new AxiosError('Email already exists', '400', undefined, undefined, {
        status: 400,
        data: { error: 'Email already exists' },
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.createUser(payload)).rejects.toThrow('Email already exists');
    });

    it('should handle createUser error without response data', async () => {
      const payload = { first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
      const mockError = new AxiosError('Failed to create user', '500', undefined, undefined, {
        status: 500,
        data: {},
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.createUser(payload)).rejects.toThrow('Failed to create user');
    });

    it('should handle non-AxiosError in createUser', async () => {
      const payload = { first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
      const mockError = new Error('Network error');

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.createUser(payload)).rejects.toThrow('Network error');
    });
  });

  describe('updateUser', () => {
    it('should successfully update a user', async () => {
      const id = 1;
      const payload = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' };
      const mockResponse = { data: { id, ...payload } };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UsersService.updateUser(id, payload);

      expect(api.put).toHaveBeenCalledWith('/users/1', payload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle updateUser error with response data', async () => {
      const id = 1;
      const payload = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' };
      const mockError = new AxiosError('User not found', '404', undefined, undefined, {
        status: 404,
        data: { error: 'User not found' },
      } as AxiosError['response']);

      (api.put as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.updateUser(id, payload)).rejects.toThrow('User not found');
    });

    it('should handle updateUser error without response data', async () => {
      const id = 1;
      const payload = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' };
      const mockError = new AxiosError('Failed to update user', '500', undefined, undefined, {
        status: 500,
        data: {},
      } as AxiosError['response']);

      (api.put as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.updateUser(id, payload)).rejects.toThrow('Failed to update user');
    });

    it('should handle non-AxiosError in updateUser', async () => {
      const id = 1;
      const payload = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' };
      const mockError = new Error('Network error');

      (api.put as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.updateUser(id, payload)).rejects.toThrow('Network error');
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      const id = 1;

      (api.delete as jest.Mock).mockResolvedValue({});

      await UsersService.deleteUser(id);

      expect(api.delete).toHaveBeenCalledWith('/users/1');
    });

    it('should handle deleteUser error with response data', async () => {
      const id = 1;
      const mockError = new AxiosError('User not found', '404', undefined, undefined, {
        status: 404,
        data: { error: 'User not found' },
      } as AxiosError['response']);

      (api.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.deleteUser(id)).rejects.toThrow('User not found');
    });

    it('should handle deleteUser error without response data', async () => {
      const id = 1;
      const mockError = new AxiosError('Failed to delete user', '500', undefined, undefined, {
        status: 500,
        data: {},
      } as AxiosError['response']);

      (api.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.deleteUser(id)).rejects.toThrow('Failed to delete user');
    });

    it('should handle non-AxiosError in deleteUser', async () => {
      const id = 1;
      const mockError = new Error('Network error');

      (api.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.deleteUser(id)).rejects.toThrow('Network error');
    });
  });

  describe('Service Integration', () => {
    it('should export all methods', () => {
      expect(UsersService.getUsers).toBeDefined();
      expect(UsersService.createUser).toBeDefined();
      expect(UsersService.updateUser).toBeDefined();
      expect(UsersService.deleteUser).toBeDefined();
    });

    it('should have correct method types', () => {
      expect(typeof UsersService.getUsers).toBe('function');
      expect(typeof UsersService.createUser).toBe('function');
      expect(typeof UsersService.updateUser).toBe('function');
      expect(typeof UsersService.deleteUser).toBe('function');
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle API response with unexpected structure', async () => {
      const mockResponse = { data: null };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UsersService.getUsers();

      expect(result).toBeNull();
    });

    it('should handle error with response but no data', async () => {
      const mockError = new AxiosError('Failed to fetch users', '500', undefined, undefined, {
        status: 500,
      } as AxiosError['response']);

      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersService.getUsers()).rejects.toThrow('Failed to fetch users');
    });
  });
});
