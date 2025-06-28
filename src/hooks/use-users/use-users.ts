import { allApiUsers } from '@/__mocks__/users';
import useToast from '@/hooks/use-toast/use-toast';
import {
  UsersService,
  type CreateUserPayload,
  type GetUsersResponse,
  type UpdateUserPayload,
  type UserItem,
} from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number) => [...userKeys.lists(), page] as const,
  optimistic: () => [...userKeys.all, 'optimistic'] as const,
};

// Estado local para simular mutações
interface OptimisticState {
  createdUsers: UserItem[];
  updatedUsers: Map<number, UserItem>;
  deletedUserIds: Set<number>;
}

export const useUsers = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Reset do estado otimista quando a página é recarregada
  useEffect(() => {
    const handleBeforeUnload = () => {
      queryClient.setQueryData(userKeys.optimistic(), {
        createdUsers: [],
        updatedUsers: new Map(),
        deletedUserIds: new Set(),
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [queryClient]);

  // Função para obter o estado otimista atual
  const getOptimisticState = useCallback((): OptimisticState => {
    return (
      queryClient.getQueryData(userKeys.optimistic()) || {
        createdUsers: [],
        updatedUsers: new Map(),
        deletedUserIds: new Set(),
      }
    );
  }, [queryClient]);

  // Função para atualizar o estado otimista
  const updateOptimisticState = useCallback(
    (updater: (state: OptimisticState) => OptimisticState) => {
      const currentState = getOptimisticState();
      const newState = updater(currentState);
      queryClient.setQueryData(userKeys.optimistic(), newState);
    },
    [queryClient, getOptimisticState],
  );

  // Função para aplicar transformações otimistas aos dados da API
  const applyOptimisticTransformations = useCallback(
    (apiData: GetUsersResponse): GetUsersResponse => {
      const optimisticState = getOptimisticState();

      if (!apiData?.data) return apiData;

      const itemsPerPage = 6;

      // 1. Preparar todos os usuários criados (com atualizações aplicadas)
      const createdUsers = optimisticState.createdUsers
        .map(user => {
          const updatedUser = optimisticState.updatedUsers.get(user.id);
          return updatedUser || user;
        })
        .filter(user => !optimisticState.deletedUserIds.has(user.id));

      // 3. Aplicar atualizações e remover deletados de todos os usuários da API
      const apiUsers = allApiUsers
        .map(user => {
          const updatedUser = optimisticState.updatedUsers.get(user.id);
          return updatedUser || user;
        })
        .filter(user => !optimisticState.deletedUserIds.has(user.id));

      // 4. Combinar todos os usuários (criados primeiro, depois da API)
      const allUsers = [...createdUsers, ...apiUsers];

      // 5. Calcular quais itens devem aparecer na página atual
      const startIndex = (apiData.page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageUsers = allUsers.slice(startIndex, endIndex);

      // 6. Calcular total e páginas
      const totalCreated = createdUsers.length;
      const totalDeleted = optimisticState.deletedUserIds.size;
      const newTotal = Math.max(0, 12 + totalCreated - totalDeleted); // 12 é o total original da API
      const newTotalPages = Math.ceil(newTotal / itemsPerPage);

      return {
        ...apiData,
        data: pageUsers,
        total: newTotal,
        total_pages: newTotalPages,
      };
    },
    [getOptimisticState],
  );

  const query = useQuery({
    queryKey: userKeys.list(page),
    queryFn: async () => {
      const apiData = await UsersService.getUsers(page);
      return applyOptimisticTransformations(apiData);
    },
    staleTime: 5 * 60 * 1000,
  });

  return { query, handlePageChange, getOptimisticState, updateOptimisticState };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const promise = UsersService.createUser(payload);

      toast.promise(promise, {
        loading: 'Creating user...',
        success: data => `User ${data.first_name} created successfully!`,
        error: 'Failed to create user. Please try again.',
      });

      return promise;
    },
    onSuccess: data => {
      // Criar um novo usuário com ID único baseado no timestamp
      const newUser: UserItem = {
        id: Date.now(), // ID temporário único
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        avatar: `https://reqres.in/img/faces/${Math.floor(Math.random() * 12) + 1}-image.jpg`,
      };

      // Adicionar ao estado otimista
      queryClient.setQueryData(userKeys.optimistic(), (oldState: OptimisticState | undefined) => {
        const currentState = oldState || {
          createdUsers: [],
          updatedUsers: new Map(),
          deletedUserIds: new Set(),
        };

        return {
          ...currentState,
          createdUsers: [newUser, ...currentState.createdUsers],
        };
      });

      // Invalidar queries para refazer o fetch com as transformações
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateUserPayload }) => {
      const promise = UsersService.updateUser(id, payload);

      toast.promise(promise, {
        loading: 'Updating user...',
        success: data => `User ${data.first_name} updated successfully!`,
        error: 'Failed to update user. Please try again.',
      });

      return promise;
    },
    onSuccess: (data, variables) => {
      // Atualizar o usuário no estado otimista
      const updatedUser: UserItem = {
        id: variables.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        avatar: `https://reqres.in/img/faces/${Math.floor(Math.random() * 12) + 1}-image.jpg`,
      };

      queryClient.setQueryData(userKeys.optimistic(), (oldState: OptimisticState | undefined) => {
        const currentState = oldState || {
          createdUsers: [],
          updatedUsers: new Map(),
          deletedUserIds: new Set(),
        };

        const newUpdatedUsers = new Map(currentState.updatedUsers);
        newUpdatedUsers.set(variables.id, updatedUser);

        return {
          ...currentState,
          updatedUsers: newUpdatedUsers,
        };
      });

      // Invalidar queries para refazer o fetch com as transformações
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const promise = UsersService.deleteUser(id);

      toast.promise(promise, {
        loading: 'Deleting user...',
        success: 'User deleted successfully!',
        error: 'Failed to delete user. Please try again.',
      });

      return promise;
    },
    onSuccess: (_, id) => {
      // Adicionar o ID à lista de usuários deletados
      queryClient.setQueryData(userKeys.optimistic(), (oldState: OptimisticState | undefined) => {
        const currentState = oldState || {
          createdUsers: [],
          updatedUsers: new Map(),
          deletedUserIds: new Set(),
        };

        const newDeletedIds = new Set(currentState.deletedUserIds);
        newDeletedIds.add(id);

        return {
          ...currentState,
          deletedUserIds: newDeletedIds,
        };
      });

      // Invalidar queries para refazer o fetch com as transformações
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Hook para resetar o estado otimista (útil para testes ou reset manual)
export const useResetOptimisticState = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.setQueryData(userKeys.optimistic(), {
      createdUsers: [],
      updatedUsers: new Map(),
      deletedUserIds: new Set(),
    });
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  }, [queryClient]);
};
