import useToast from '@/hooks/use-toast/use-toast';
import { UsersService, type CreateUserPayload, type UpdateUserPayload } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number) => [...userKeys.lists(), page] as const,
};

export const useUsers = () => {
  const [page, setPage] = useState(1);
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const query = useQuery({
    queryKey: userKeys.list(page),
    queryFn: () => UsersService.getUsers(page),
    staleTime: 5 * 60 * 1000,
  });
  return { query, handlePageChange };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const promise = UsersService.createUser(payload);

      toast.promise(promise, {
        loading: 'Creating user...',
        success: data => `User ${data.name} created successfully!`,
        error: 'Failed to create user. Please try again.',
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateUserPayload }) => {
      const promise = UsersService.updateUser(id, payload);

      toast.promise(promise, {
        loading: 'Updating user...',
        success: data => `User ${data.name} updated successfully!`,
        error: 'Failed to update user. Please try again.',
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const promise = UsersService.deleteUser(id);

      toast.promise(promise, {
        loading: 'Deleting user...',
        success: 'User deleted successfully!',
        error: 'Failed to delete user. Please try again.',
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
