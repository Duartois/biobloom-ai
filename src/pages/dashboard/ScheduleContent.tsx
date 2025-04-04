
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar as CalendarIcon, Clock, Plus, Sparkles, Loader2, Instagram, Twitter, Linkedin } from 'lucide-react';
import { toast } from "sonner";

// Mock scheduled posts for demonstration
const mockPosts = [
  {
    id: '1',
    content: 'Check out my latest blog post on how to create engaging content for your audience.',
    scheduledFor: new Date(2025, 4, 10, 12, 0),
    platform: 'instagram',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: '2',
    content: 'Just launched my new portfolio website! So excited to share my work with all of you.',
    scheduledFor: new Date(2025, 4, 15, 15, 30),
    platform: 'twitter',
  }
];

const ScheduleContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const [newPost, setNewPost] = useState({
    content: '',
    scheduledDate: new Date(),
    scheduledTime: '12:00',
    platform: 'instagram',
    image: '',
  });

  const handleAiGenerate = () => {
    if (!aiPrompt) {
      toast.error("Please enter a topic for the AI to generate content about");
      return;
    }
    
    setIsGenerating(true);
    // Mock AI generation
    setTimeout(() => {
      setAiSuggestions([
        `📸 New content alert! I just updated my portfolio with fresh ${aiPrompt} work. Check out the link in my bio to see the full collection. #CreativeWork #Portfolio`,
        `Excited to share my latest ${aiPrompt} project! What do you think of this style? Would love to hear your feedback in the comments below! ✨ #CreativeProcess`,
        `Just completed an amazing ${aiPrompt} session today! Here's a sneak peek of what's coming to my feed next week. Stay tuned for the full reveal! 🚀`
      ]);
      setIsGenerating(false);
      toast.success("AI suggestions generated!");
    }, 2000);
  };

  const handleUseAiSuggestion = (suggestion: string) => {
    setNewPost(prev => ({ ...prev, content: suggestion }));
    setShowAiAssistant(false);
    toast.success("Added to your post!");
  };

  const handleSchedulePost = () => {
    // In a real app, this would send the post data to the server
    toast.success("Post scheduled successfully!");
    // Reset form
    setNewPost({
      content: '',
      scheduledDate: new Date(),
      scheduledTime: '12:00',
      platform: 'instagram',
      image: '',
    });
  };

  // Helper function to format date for display
  const formatScheduleDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <Instagram className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Scheduling</h1>
        <Button className="bg-biobloom-600 hover:bg-biobloom-700">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Schedule new post */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Post</CardTitle>
              <CardDescription>
                Create and schedule your content for social media
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newPost.platform === 'instagram' ? 'default' : 'outline'}
                      className={newPost.platform === 'instagram' ? 'bg-biobloom-600 hover:bg-biobloom-700' : ''}
                      onClick={() => setNewPost(prev => ({ ...prev, platform: 'instagram' }))}
                    >
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Button>
                    <Button
                      type="button"
                      variant={newPost.platform === 'twitter' ? 'default' : 'outline'}
                      className={newPost.platform === 'twitter' ? 'bg-biobloom-600 hover:bg-biobloom-700' : ''}
                      onClick={() => setNewPost(prev => ({ ...prev, platform: 'twitter' }))}
                    >
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                    <Button
                      type="button"
                      variant={newPost.platform === 'linkedin' ? 'default' : 'outline'}
                      className={newPost.platform === 'linkedin' ? 'bg-biobloom-600 hover:bg-biobloom-700' : ''}
                      onClick={() => setNewPost(prev => ({ ...prev, platform: 'linkedin' }))}
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content">Post Content</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-biobloom-600"
                      onClick={() => setShowAiAssistant(!showAiAssistant)}
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      AI Assistant
                    </Button>
                  </div>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="What do you want to share?"
                    rows={4}
                  />
                </div>
                
                {showAiAssistant && (
                  <div className="space-y-3 bg-muted/30 p-3 rounded-md">
                    <div className="flex gap-2">
                      <Input
                        placeholder="What topic should the AI write about?"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        type="button" 
                        disabled={isGenerating}
                        onClick={handleAiGenerate}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {aiSuggestions.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-auto">
                        <p className="text-sm font-medium">Suggestions:</p>
                        {aiSuggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className="p-2 border rounded-md bg-background cursor-pointer hover:bg-accent"
                            onClick={() => handleUseAiSuggestion(suggestion)}
                          >
                            <p className="text-sm">{suggestion}</p>
                            <p className="text-xs text-right text-biobloom-600 mt-1">
                              Use this suggestion
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Schedule Date</Label>
                    <div className="border rounded-md overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={newPost.scheduledDate}
                        onSelect={(date) => date && setNewPost(prev => ({ ...prev, scheduledDate: date }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Schedule Time</Label>
                    <div className="flex gap-2 items-center">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        value={newPost.scheduledTime}
                        onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      />
                    </div>
                    
                    <div className="pt-6 space-y-2">
                      <Label htmlFor="image">Image (Optional)</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          // In a real app, this would handle file upload
                          console.log("Image selected", e.target.files?.[0]);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload an image to include with your post
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        className="w-full bg-biobloom-600 hover:bg-biobloom-700"
                        disabled={!newPost.content}
                        onClick={handleSchedulePost}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Schedule Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Scheduled posts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="upcoming" className="h-[500px] overflow-auto">
                <div className="space-y-3">
                  {mockPosts.length > 0 ? 
                    mockPosts.map(post => (
                      <div key={post.id} className="border rounded-md p-3 relative">
                        <div className="absolute top-3 right-3 flex gap-1 items-center">
                          {getPlatformIcon(post.platform)}
                        </div>
                        <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                        {post.image && (
                          <div className="w-full h-24 mb-2 rounded-md overflow-hidden">
                            <img src={post.image} alt="Post visual" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatScheduleDate(post.scheduledFor)}
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                            Edit
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No scheduled posts</h3>
                        <p className="text-muted-foreground text-sm max-w-[200px] mt-1 mb-4">
                          Use the form to create and schedule your first post
                        </p>
                      </div>
                    )
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="published" className="h-[500px] overflow-auto">
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No published posts yet</h3>
                  <p className="text-muted-foreground text-sm max-w-[200px] mt-1">
                    Your published posts will appear here
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleContent;
