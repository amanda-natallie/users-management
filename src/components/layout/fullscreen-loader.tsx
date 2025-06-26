import { Loader2 } from 'lucide-react';

interface FullscreenLoaderProps {
  message?: string;
}

const FullscreenLoader = ({ message = 'Loading...' }: FullscreenLoaderProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-background z-50"
      data-testid="fullscreen-loader"
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default FullscreenLoader;
