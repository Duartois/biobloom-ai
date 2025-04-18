
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BioLinkPreview from '@/components/profile/BioLinkPreview';

interface PreviewCardProps {
  profile: any;
  username?: string;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ profile, username }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Pré-visualização
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center pt-2">
        <BioLinkPreview 
          profile={profile} 
          username={username}
        />
      </CardContent>
    </Card>
  );
};
