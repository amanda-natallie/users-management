import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import useUsersTable from './use-users-table';

const UsersTable = () => {
  const { columns, table, isLoading, hasRows } = useUsersTable();

  return (
    <div>
      <div className="p-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-purple-800/50 hover:bg-muted/50"
              >
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="font-semibold text-card-foreground pb-1">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="border-purple-200 dark:border-purple-800/50 hover:bg-muted/30 transition-colors"
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-4 text-muted-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="md:h-[53vh] text-center text-muted-foreground"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-4 w-4 animate-spin" data-testid="loading-spinner" />
                    </div>
                  ) : (
                    'No users found.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasRows && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-purple-200/80 dark:border-purple-800/50">
          <div className="text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="focus-ring bg-transparent"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount().toLocaleString()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="focus-ring bg-transparent"
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
