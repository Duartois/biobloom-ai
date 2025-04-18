
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBioPageEditor } from './useBioPageEditor';
import { ActionsHeader } from './components/ActionsHeader';
import { ProfileTab } from './components/ProfileTab';
import { AppearanceTab } from './components/AppearanceTab';
import { PreviewCard } from './components/PreviewCard';
import { supabase } from "@/integrations/supabase/client";

const BioLinkEditor = () => {
  const {
    user,
    formData,
    activeTab,
    setActiveTab,
    isSaving,
    previewProfile,
    usernameError,
    handleInputChange,
    handleSelectChange,
    handleBackgroundTypeChange,
    handleBackgroundSelection,
    handleColorSelection,
    handleOpacityChange,
    handleGrayscaleChange,
    handleSubmit
  } = useBioPageEditor();

  return (
    <DashboardLayout>
      <ActionsHeader 
        username={formData.username || user?.username} 
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
            </TabsList>
            
            <form id="bio-form" onSubmit={handleSubmit}>
              <TabsContent value="profile" className="p-4 border rounded-md mt-2">
                <ProfileTab
                  name={formData.name}
                  bio={formData.bio}
                  username={formData.username}
                  usernameError={usernameError}
                  onInputChange={handleInputChange}
                />
              </TabsContent>
              
              <TabsContent value="appearance" className="p-4 border rounded-md mt-2">
                <AppearanceTab
                  theme={formData.theme}
                  backgroundType={formData.background_type}
                  backgroundImage={formData.backgroundImage}
                  themeColor={formData.themeColor}
                  opacity={formData.opacity}
                  grayscale={formData.grayscale}
                  onSelectChange={handleSelectChange}
                  onBackgroundTypeChange={handleBackgroundTypeChange}
                  onBackgroundSelection={handleBackgroundSelection}
                  onColorSelection={handleColorSelection}
                  onOpacityChange={handleOpacityChange}
                  onGrayscaleChange={handleGrayscaleChange}
                />
              </TabsContent>
            </form>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <PreviewCard 
            profile={previewProfile}
            username={formData.username || user?.username}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BioLinkEditor;
