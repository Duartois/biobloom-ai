import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { Link2, Calendar, ExternalLink } from 'lucide-react';
import BioLinkPreview from '@/components/profile/BioLinkPreview';

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
              <CardTitle className="text-sm font-medium text-muted-foreground">Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">{user?.plan || 'Free'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Posts Agendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0/20</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Bio Link Preview</CardTitle>
              <CardDescription>Veja como seu bio link está</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6 border-t border-b">
              <BioLinkPreview 
                profile={profile}
                username={user?.username}
              />
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard/bio">
                  <Link2 className="mr-2 h-4 w-4" />
                  Editar Bio Link
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link to={`/${user?.username || 'preview'}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Página
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
