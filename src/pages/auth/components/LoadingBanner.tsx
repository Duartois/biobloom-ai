
import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingBannerProps = {
  message: string;
};

export const LoadingBanner = ({ message }: LoadingBannerProps) => (
  <div className="bg-success/10 border border-success text-success text-sm p-3 rounded-md mb-4 flex items-center justify-center">
    <Loader2 className="h-4 w-4 animate-spin mr-2" />
    {message}
  </div>
);
