import { cn } from '@/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn(
        'container flex max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8 m-auto',
        className,
      )}
    >
      {children}
    </div>
  );
};
export default Container;
