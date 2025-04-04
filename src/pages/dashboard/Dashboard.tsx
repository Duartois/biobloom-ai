
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { Link2, Calendar, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useLinks();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.links.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">{user?.plan || 'Free'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Posts Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0/20</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Bio-page Preview</CardTitle>
              <CardDescription>See how your bio-page looks</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6 border-t border-b">
              <div className="w-56 h-96 border rounded-xl overflow-hidden relative shadow-lg">
                {profile.backgroundImage ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img src={profile.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-biobloom-100 to-biobloom-300 dark:from-biobloom-900 dark:to-biobloom-700"></div>
                )}
                <div className="absolute inset-0 p-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-white mb-2 mt-6"></div>
                  <h3 className="text-lg font-bold text-white mb-1">{profile.name || user?.name || 'Your Name'}</h3>
                  <p className="text-xs text-white/80 mb-6 text-center">{profile.bio || 'Your bio goes here'}</p>
                  <div className="w-full space-y-2">
                    {profile.links.slice(0, 3).map((link, index) => (
                      <div key={index} className="bg-white/80 dark:bg-black/50 rounded-lg py-2 px-3 text-center text-sm">
                        {link.title}
                      </div>
                    ))}
                    {profile.links.length === 0 && (
                      <div className="bg-white/80 dark:bg-black/50 rounded-lg py-2 px-3 text-center text-sm">
                        Add your first link
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard/bio">
                  <Link2 className="mr-2 h-4 w-4" />
                  Edit Bio-page
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link to={`/${user?.username || 'preview'}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Content Scheduling</CardTitle>
              <CardDescription>Create and schedule your social media posts</CardDescription>
            </CardHeader>
            <CardContent className="border-t border-b h-[340px] flex flex-col items-center justify-center text-center p-6">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No scheduled posts</h3>
              <p className="text-muted-foreground mb-4">
                Create and schedule content for your social media with AI assistance.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-4">
              <Button asChild className="bg-biobloom-600 hover:bg-biobloom-700">
                <Link to="/dashboard/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Content
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild className="justify-start">
                <Link to="/dashboard/links/new">
                  <Link2 className="mr-2 h-4 w-4" />
                  Add new link
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link to="/dashboard/schedule/new">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create post
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link to="/dashboard/settings">
                  <Link2 className="mr-2 h-4 w-4" />
                  Account settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
