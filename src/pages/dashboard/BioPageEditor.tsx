
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { Laptop, Save, Sparkles } from 'lucide-react';

// Mock background images
const mockBackgrounds = [
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=500&auto=format&fit=crop",
];

const BioPageEditor = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState({
    name: profile.name || user?.name || '',
    bio: profile.bio || '',
    theme: profile.theme || 'default',
    themeColor: profile.themeColor || '#893bf2',
    backgroundImage: profile.backgroundImage || mockBackgrounds[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackgroundSelection = (url: string) => {
    setFormData(prev => ({ ...prev, backgroundImage: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      bio: formData.bio,
      theme: formData.theme as any,
      themeColor: formData.themeColor,
      backgroundImage: formData.backgroundImage,
    });
  };

  // Get styles for the preview based on theme selection
  const getPreviewStyles = () => {
    switch(formData.theme) {
      case 'minimal':
        return 'border border-gray-200 dark:border-gray-800';
      case 'neobrutal':
        return 'neo-card border-2 border-black dark:border-white';
      case 'glass':
        return 'glass-card';
      case 'default':
      default:
        return 'bg-white dark:bg-black shadow-lg';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Bio-Page</h1>
        <Button 
          type="submit"
          form="bio-form"
          className="bg-biobloom-600 hover:bg-biobloom-700"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <form id="bio-form" onSubmit={handleSubmit}>
              <TabsContent value="profile" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name or brand name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="A short description about you or your brand"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      Your bio-page URL
                    </span>
                    <div className="flex items-center bg-muted/50 px-3 py-1 rounded-md">
                      <span className="text-sm text-muted-foreground mr-1">biobloom.com/</span>
                      <span className="text-sm font-medium">{user?.username || 'username'}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-4 border rounded-md mt-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Page Theme</Label>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) => handleSelectChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="neobrutal">Neo-brutal</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="themeColor">Theme Color</Label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        id="themeColor"
                        name="themeColor"
                        value={formData.themeColor}
                        onChange={handleInputChange}
                        className="w-10 h-10 rounded border overflow-hidden"
                      />
                      <Input
                        value={formData.themeColor}
                        onChange={handleInputChange}
                        name="themeColor"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {mockBackgrounds.map((bg, index) => (
                        <div 
                          key={index}
                          className={`relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                            formData.backgroundImage === bg 
                              ? 'border-biobloom-600 ring-2 ring-biobloom-300' 
                              : 'border-transparent hover:border-muted'
                          }`}
                          onClick={() => handleBackgroundSelection(bg)}
                        >
                          <img 
                            src={bg} 
                            alt={`Background ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Get AI background suggestions
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base font-medium">
                <Laptop className="mr-2 h-4 w-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <div className="w-56 h-[460px] overflow-hidden rounded-xl relative">
                {/* Background */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={formData.backgroundImage} 
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center p-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-white mt-6 mb-3"></div>
                  
                  {/* Name & Bio */}
                  <h3 className="text-lg font-bold text-white mb-1">{formData.name || 'Your Name'}</h3>
                  <p className="text-xs text-white/80 mb-6 text-center">{formData.bio || 'Your bio description will appear here'}</p>
                  
                  {/* Links */}
                  <div className="w-full space-y-2">
                    {profile.links.slice(0, 4).map((link, index) => (
                      <div 
                        key={index} 
                        className={`link-card ${getPreviewStyles()}`}
                        style={{
                          backgroundColor: link.style === 'default' ? formData.themeColor : 'transparent',
                          borderColor: link.style === 'outline' ? formData.themeColor : 'transparent',
                        }}
                      >
                        <span className="text-sm">{link.title}</span>
                      </div>
                    ))}
                    
                    {profile.links.length === 0 && (
                      <>
                        <div className={`link-card ${getPreviewStyles()}`}>
                          <span className="text-sm">Your First Link</span>
                        </div>
                        <div className={`link-card ${getPreviewStyles()}`}>
                          <span className="text-sm">Second Link</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BioPageEditor;
