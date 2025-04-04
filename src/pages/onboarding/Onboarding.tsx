
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useLinks } from '@/contexts/LinksContext';

// Mock background image suggestions
const mockBackgroundImages = [
  { id: 1, url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500&auto=format&fit=crop" },
  { id: 2, url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop" },
  { id: 3, url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop" },
  { id: 4, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile } = useLinks();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Form state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: '',
    interests: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // In a real app, here we would send profile.interests to an AI service
      // to get background suggestions based on interests
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 1500);
    } else if (step === 2 && selectedImage) {
      // Final step completion - save everything and go to dashboard
      updateProfile({
        name: profile.name,
        bio: profile.bio,
        backgroundImage: selectedImage,
      });
      
      navigate('/dashboard');
    }
  };

  return (
    <MainLayout hideFooter>
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <div className="flex justify-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-biobloom-100 text-biobloom-700 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Let's set up your BioBloom page</h1>
          <p className="text-muted-foreground">We'll help you create a beautiful page that reflects your brand</p>
        </div>

        <div className="bg-background p-6 rounded-lg border shadow-sm">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step >= 1 ? 'border-biobloom-600 bg-biobloom-600 text-white' : 'border-muted'
              }`}>
                1
              </div>
              <div className={`h-1 w-12 ${step >= 2 ? 'bg-biobloom-600' : 'bg-muted'}`}></div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step >= 2 ? 'border-biobloom-600 bg-biobloom-600 text-white' : 'border-muted'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Basic info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name or brand name"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="A short description about you or your brand"
                  rows={3}
                  value={profile.bio}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">
                  What are your interests or the focus of your content?
                </Label>
                <Textarea
                  id="interests"
                  name="interests"
                  placeholder="E.g., photography, fitness, tech reviews, fashion, coaching..."
                  rows={3}
                  value={profile.interests}
                  onChange={handleProfileChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll use this to suggest the perfect background for your page
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Background selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="block mb-3">Choose a background for your page</Label>
                <div className="grid grid-cols-2 gap-4">
                  {mockBackgroundImages.map(image => (
                    <div 
                      key={image.id}
                      className={`relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage === image.url 
                          ? 'border-biobloom-600 ring-2 ring-biobloom-300' 
                          : 'border-transparent hover:border-muted'
                      }`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt="Background option" 
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute top-2 right-2 bg-biobloom-600 text-white rounded-full p-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  className="text-sm"
                >
                  See more backgrounds
                </Button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-end mt-8">
            {step === 2 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="mr-2"
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
              className="bg-biobloom-600 hover:bg-biobloom-700"
              disabled={
                (step === 1 && (!profile.name || !profile.interests)) || 
                (step === 2 && !selectedImage) ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : step === 2 ? (
                'Complete Setup'
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Onboarding;
