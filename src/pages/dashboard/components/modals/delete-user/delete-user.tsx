import { UserLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useDeleteUser } from '@/hooks';
import { useModalStore } from '@/stores';

const DeleteUserView = () => {
  const { closeModal, modalData } = useModalStore();
  const deleteUserMutation = useDeleteUser();

  const onSubmit = async () => {
    await deleteUserMutation.mutateAsync(modalData?.id as number);
    closeModal();
  };

  return (
    <UserLayout
      title={`Delete ${modalData?.first_name} ${modalData?.last_name}`}
      subtitle="Are you sure you want to delete this user? This action cannot be undone."
    >
      <div className="flex justify-end gap-2 w-full">
        <Button
          onClick={closeModal}
          variant="outline"
          className="flex-1"
          disabled={deleteUserMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1"
          variant="destructive"
          disabled={deleteUserMutation.isPending}
        >
          Delete User
        </Button>
      </div>
    </UserLayout>
  );
};
export default DeleteUserView;
