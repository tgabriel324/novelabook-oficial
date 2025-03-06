
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Upload, User } from "lucide-react";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao.silva@example.com",
    bio: "Leitor ávido de novelas e fã de fantasia medieval. Sempre em busca de novas histórias emocionantes!",
    avatar: "",
    notifyNewChapters: true,
    notifyComments: false,
    notifyUpdates: true,
    publicProfile: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex items-center">
        <Link to="/perfil" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Perfil</h1>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e como você aparece para outros usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar || ""} alt={formData.name} />
                      <AvatarFallback className="bg-novel-lilac-400 text-white text-xl">
                        <User size={36} />
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Upload size={14} className="mr-2" />
                      Alterar foto
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Sobre mim</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={formData.bio}
                        onChange={handleChange}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Link to="/perfil">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit" className="bg-novel-lilac-500 hover:bg-novel-lilac-600">
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações e Privacidade</CardTitle>
              <CardDescription>
                Gerencie suas preferências de notificações e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Notificações</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-chapters">Novos capítulos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando novos capítulos forem lançados
                    </p>
                  </div>
                  <Switch 
                    id="notify-chapters" 
                    checked={formData.notifyNewChapters}
                    onCheckedChange={(checked) => handleSwitchChange("notifyNewChapters", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-comments">Comentários</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações sobre comentários em suas avaliações
                    </p>
                  </div>
                  <Switch 
                    id="notify-comments" 
                    checked={formData.notifyComments}
                    onCheckedChange={(checked) => handleSwitchChange("notifyComments", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-updates">Atualizações da plataforma</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações sobre novidades e melhorias na plataforma
                    </p>
                  </div>
                  <Switch 
                    id="notify-updates" 
                    checked={formData.notifyUpdates}
                    onCheckedChange={(checked) => handleSwitchChange("notifyUpdates", checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <h3 className="text-md font-medium">Privacidade</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Perfil Público</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros usuários vejam seu perfil e progresso de leitura
                    </p>
                  </div>
                  <Switch 
                    id="public-profile" 
                    checked={formData.publicProfile}
                    onCheckedChange={(checked) => handleSwitchChange("publicProfile", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link to="/perfil">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button 
                className="bg-novel-lilac-500 hover:bg-novel-lilac-600"
                onClick={() => {
                  toast.success("Preferências atualizadas com sucesso!");
                }}
              >
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProfile;
