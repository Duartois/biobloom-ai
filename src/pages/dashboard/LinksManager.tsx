import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLinks, Link as LinkType } from '@/contexts/LinksContext';
import { Link, PlusCircle, Pencil, Trash2, MoveUp, MoveDown, GripVertical } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';

const LinksManager = () => {
  const { user } = useAuth();
  const { profile, addLink, updateLink, removeLink } = useLinks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<LinkType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    style: 'default',
  });

  const isLinkLimitReached = () => {
    if (!user) return true;
    
    const linkCount = profile.links.length;
    
    switch (user.plan) {
      case 'free':
        return linkCount >= 2; // Free users get 2 links
      case 'starter':
      case 'pro':
      case 'premium':
      case 'trial':
        return false; // Paid plans get unlimited links
      default:
        return true;
    }
  };

  const openNewLinkDialog = () => {
    if (isLinkLimitReached() && !currentLink) {
      alert("Você atingiu o limite de links para seu plano atual. Faça upgrade para adicionar mais links.");
      return;
    }
    
    setCurrentLink(null);
    setFormData({
      title: '',
      url: '',
      style: 'default',
    });
    setIsDialogOpen(true);
  };

  const openEditLinkDialog = (link: LinkType) => {
    setCurrentLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      style: link.style || 'default',
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStyleChange = (value: string) => {
    setFormData(prev => ({ ...prev, style: value as LinkType['style'] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentLink) {
      await updateLink(currentLink.id, {
        title: formData.title,
        url: formData.url,
        style: formData.style as LinkType['style'],
      });
    } else {
      await addLink({
        title: formData.title,
        url: formData.url,
        style: formData.style as LinkType['style'],
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteLink = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este link?")) {
      await removeLink(id);
    }
  };

  const ensureProtocol = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Links</h1>
        <Button 
          onClick={openNewLinkDialog} 
          className="bg-biobloom-600 hover:bg-biobloom-700"
          disabled={isLinkLimitReached()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Link
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Seus Links</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.links.length === 0 ? (
            <div className="text-center py-12">
              <Link className="h-12 w-12 text-muted-foreground mb-3 mx-auto" />
              <h3 className="text-lg font-medium mb-1">Nenhum link adicionado ainda</h3>
              <p className="text-muted-foreground mb-4">Adicione seu primeiro link à sua bio-page</p>
              <Button onClick={openNewLinkDialog} className="bg-biobloom-600 hover:bg-biobloom-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar seu primeiro link
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center p-3 rounded-md border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex-none pr-3 cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium truncate">{link.title}</h3>
                    <a 
                      href={ensureProtocol(link.url)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-muted-foreground truncate hover:text-biobloom-600"
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="flex-none flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditLinkDialog(link)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentLink ? 'Editar Link' : 'Adicionar Novo Link'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Link</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Meu Website"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">Estilo do Link</Label>
                <Select
                  value={formData.style}
                  onValueChange={handleStyleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="outline">Contorno</SelectItem>
                    <SelectItem value="ghost">Transparente</SelectItem>
                    <SelectItem value="neobrutal">Neo-brutal</SelectItem>
                    <SelectItem value="glass">Vidro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-biobloom-600 hover:bg-biobloom-700">
                {currentLink ? 'Salvar Alterações' : 'Adicionar Link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LinksManager;
