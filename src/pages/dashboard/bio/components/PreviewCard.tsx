
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BioLinkPreview from '@/components/profile/BioLinkPreview';
import { ProfileData } from '@/contexts/LinksContext';

interface PreviewCardProps {
  profile: Partial<ProfileData>;
  username?: string;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ profile, username }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Pré-visualização do Bio Link
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center pt-2">
        <BioLinkPreview 
          profile={profile} 
          username={username || ''}
          aria-label="Pré-visualização do seu Bio Link"
        />
      </CardContent>
    </Card>
  );
};
