import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks';
import { UserItem } from '@/services';
import { ModalType, useModalStore } from '@/stores';
import {
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const useUsersTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const {
    query: { data, isFetching, isLoading },
    handlePageChange,
  } = useUsers();
  const { openModal, setModalData } = useModalStore();

  const handleEdit = (user: UserItem) => {
    setModalData(user);
    openModal(ModalType.UPDATE);
  };

  const handleDelete = (user: UserItem) => {
    setModalData(user);
    openModal(ModalType.DELETE);
  };

  const columns: ColumnDef<UserItem>[] = [
    {
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar || '/placeholder.svg'}
              alt={`${user.first_name} ${user.last_name}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'User ID',
      cell: ({ row }) => <div>#{row.getValue('id')}</div>,
    },

    {
      accessorKey: 'name',
      header: 'User Name',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1">
            <div className="text-muted-foreground">
              {user.first_name} {user.last_name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            variant="link"
            className="p-0 text-sm text-muted-foreground hover:text-muted-foreground"
            onClick={() => window.open(`mailto:${user.email}`, '_blank', 'noopener,noreferrer')}
          >
            {user.email}
          </Button>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(user)}
              className="h-8 w-8 p-0 focus-ring hover:bg-blue-50 border-blue-600/70 dark:border-blue-400/70 hover:border-blue-200 dark:hover:bg-blue-950/20"
              aria-label={`Edit ${user.first_name} ${user.last_name}`}
            >
              <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(user)}
              className="h-8 w-8 p-0 focus-ring hover:bg-red-50 border-red-600/70 dark:border-red-400/70 hover:border-red-200 dark:hover:bg-red-950/20"
              aria-label={`Delete ${user.first_name} ${user.last_name}`}
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" strokeWidth={1.5} />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    debugTable: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: data?.total_pages || 0,
    rowCount: data?.total || 0,
    state: {
      pagination,
    },
  });

  useEffect(() => {
    if (!data) return;
    handlePageChange(pagination.pageIndex + 1);
  }, [data, pagination.pageIndex, handlePageChange]);

  const hasRows = table.getRowModel().rows?.length > 0;
  return {
    columns,
    users: data,
    table,
    isLoading: isLoading || isFetching,
    hasRows,
  };
};
export default useUsersTable;
