import { ControlledFormField, FormWrapper } from '@/components/forms';
import { UserLayout } from '@/components/layout';
import { useUpdateUser } from '@/hooks';
import { type UpdateUserFormData, updateUserSchema } from '@/schemas';
import { useModalStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const UpdateUserForm = () => {
  const { closeModal, modalData } = useModalStore();
  const updateUserMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: modalData?.first_name,
      last_name: modalData?.last_name,
      email: modalData?.email,
    },
  });

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({ id: modalData?.id as number, payload: data });
      closeModal();
    } catch (error) {
      console.error('Create user error:', error);
    }
  };

  return (
    <UserLayout title="Update User" subtitle="Enter user's information to update the user">
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        submitText="Update User"
        isValid={isValid}
        loading={updateUserMutation.isPending}
        loadingText="Updating user..."
      >
        <ControlledFormField
          name="first_name"
          control={control}
          id="update-user-first-name"
          label="First Name"
          type="text"
          placeholder="Enter user's name"
          error={errors.first_name?.message}
        />

        <ControlledFormField
          name="last_name"
          control={control}
          id="update-user-last-name"
          label="Last Name"
          type="text"
          placeholder="Enter user's last name"
          error={errors.last_name?.message}
        />

        <ControlledFormField
          name="email"
          control={control}
          id="update-user-email"
          label="Email"
          type="email"
          placeholder="Enter user's email"
          error={errors.email?.message}
        />
      </FormWrapper>
    </UserLayout>
  );
};

export default UpdateUserForm;
