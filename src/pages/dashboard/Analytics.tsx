import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth/AuthContext";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, ArrowUpRight, Users, MousePointerClick, Clock, BarChart3, Link, LinkIcon, Download, Lock } from 'lucide-react';

const mockData = {
  visits: [
    { name: 'Seg', visits: 240 },
    { name: 'Ter', visits: 139 },
    { name: 'Qua', visits: 380 },
    { name: 'Qui', visits: 281 },
    { name: 'Sex', visits: 256 },
    { name: 'Sáb', visits: 305 },
    { name: 'Dom', visits: 298 },
  ],
  clicksPerLink: [
    { name: 'Instagram', clicks: 45 },
    { name: 'Portfolio', clicks: 35 },
    { name: 'YouTube', clicks: 27 },
    { name: 'Loja', clicks: 18 },
    { name: 'Blog', clicks: 15 },
    { name: 'Contato', clicks: 11 },
  ],
  referrers: [
    { name: 'Instagram', value: 45 },
    { name: 'TikTok', value: 28 },
    { name: 'Direto', value: 17 },
    { name: 'Outros', value: 10 },
  ],
  devices: [
    { name: 'Mobile', value: 75 },
    { name: 'Desktop', value: 20 },
    { name: 'Tablet', value: 5 },
  ],
};

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const isPremium = user?.plan === 'premium';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold">Análises</h1>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24 horas</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" disabled={!isPremium}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {!isPremium && (
          <Card className="mb-6 border-secondary">
            <CardHeader className="bg-secondary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-secondary flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Recurso Premium
                </CardTitle>
                <Button asChild>
                  <a href="/pricing">Fazer Upgrade</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p>
                As análises avançadas estão disponíveis apenas para assinantes do plano Premium. Faça upgrade para ter acesso completo a relatórios detalhados, exportação de dados e mais.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className={isPremium ? "" : "opacity-75 pointer-events-none"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1.892</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3" /> 12%
                </span>
                vs. período anterior
              </p>
            </CardContent>
          </Card>

          <Card className={isPremium ? "" : "opacity-75 pointer-events-none"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cliques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">756</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3" /> 8%
                </span>
                vs. período anterior
              </p>
            </CardContent>
          </Card>

          <Card className={isPremium ? "" : "opacity-75 pointer-events-none"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Clique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">39.9%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-red-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 rotate-90" /> 2%
                </span>
                vs. período anterior
              </p>
            </CardContent>
          </Card>

          <Card className={isPremium ? "" : "opacity-75 pointer-events-none"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Visitantes Únicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1.481</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3" /> 15%
                </span>
                vs. período anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className={`${isPremium ? "" : "opacity-75 pointer-events-none"}`}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="traffic">Tráfego</TabsTrigger>
            <TabsTrigger value="audience">Audiência</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Visitas ao Perfil</CardTitle>
                  <CardDescription>Total de visitas nos últimos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.visits}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="visits"
                          stroke="#FFAA00"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cliques por Link</CardTitle>
                  <CardDescription>Desempenho dos seus links principais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={mockData.clicksPerLink}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="clicks" fill="#D8C4B6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horários mais Ativos</CardTitle>
                  <CardDescription>Quando seus visitantes acessam seu perfil</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[300px]">
                  <Clock className="h-16 w-16 text-muted mb-4" />
                  <p className="text-center text-muted-foreground">
                    Disponível em breve para assinantes Premium
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="links">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho dos Links</CardTitle>
                  <CardDescription>Taxa de clique e engajamento dos seus links</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-6 py-3">Link</th>
                          <th className="px-6 py-3">Cliques</th>
                          <th className="px-6 py-3">CTR</th>
                          <th className="px-6 py-3">Média de Tempo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Instagram</td>
                          <td className="px-6 py-4">45</td>
                          <td className="px-6 py-4">12.4%</td>
                          <td className="px-6 py-4">00:32</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Portfolio</td>
                          <td className="px-6 py-4">35</td>
                          <td className="px-6 py-4">9.6%</td>
                          <td className="px-6 py-4">01:48</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">YouTube</td>
                          <td className="px-6 py-4">27</td>
                          <td className="px-6 py-4">7.4%</td>
                          <td className="px-6 py-4">03:21</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Loja</td>
                          <td className="px-6 py-4">18</td>
                          <td className="px-6 py-4">4.9%</td>
                          <td className="px-6 py-4">02:17</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">Blog</td>
                          <td className="px-6 py-4">15</td>
                          <td className="px-6 py-4">4.1%</td>
                          <td className="px-6 py-4">01:52</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="traffic">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Fontes de Tráfego</CardTitle>
                  <CardDescription>De onde seus visitantes estão vindo</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[300px]">
                  <p className="text-center text-muted-foreground mb-4">
                    Dados detalhados de tráfego disponíveis em breve
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Dispositivos</CardTitle>
                  <CardDescription>Dispositivos usados para acessar seu perfil</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[300px]">
                  <p className="text-center text-muted-foreground mb-4">
                    Dados detalhados de dispositivos disponíveis em breve
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Demografia</CardTitle>
                  <CardDescription>Idade e gênero dos seus visitantes</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[300px]">
                  <Users className="h-16 w-16 text-muted mb-4" />
                  <p className="text-center text-muted-foreground">
                    Dados demográficos disponíveis em breve para assinantes Premium
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Localização</CardTitle>
                  <CardDescription>De onde seus visitantes estão acessando</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[300px]">
                  <p className="text-center text-muted-foreground mb-4">
                    Dados de localização disponíveis em breve
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
