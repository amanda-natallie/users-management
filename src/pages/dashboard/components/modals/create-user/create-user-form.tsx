import { ControlledFormField, FormWrapper } from '@/components/forms';
import { UserLayout } from '@/components/layout';
import { useCreateUser } from '@/hooks';
import { createUserSchema, type CreateUserFormData } from '@/schemas';
import { useModalStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const CreateUserForm = () => {
  const { closeModal } = useModalStore();
  const createUserMutation = useCreateUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUserMutation.mutateAsync(data);
      closeModal();
    } catch (error) {
      console.error('Create user error:', error);
    }
  };

  return (
    <UserLayout title="Create User" subtitle="Enter user's information to create a new user">
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        submitText="Create User"
        isValid={isValid}
        loading={createUserMutation.isPending}
        loadingText="Creating user..."
      >
        <ControlledFormField
          name="first_name"
          control={control}
          id="create-user-first-name"
          label="First Name"
          type="text"
          placeholder="Enter user's name"
          error={errors.first_name?.message}
        />

        <ControlledFormField
          name="last_name"
          control={control}
          id="create-user-last-name"
          label="Last Name"
          type="text"
          placeholder="Enter user's last name"
          error={errors.last_name?.message}
        />

        <ControlledFormField
          name="email"
          control={control}
          id="create-user-email"
          label="Email"
          type="email"
          placeholder="Enter user's email"
          error={errors.email?.message}
        />
      </FormWrapper>
    </UserLayout>
  );
};

export default CreateUserForm;
