
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  MessageSquare, 
  Mail, 
  BellRing, 
  Send, 
  Clock, 
  Users, 
  Check, 
  Eye, 
  PlusCircle, 
  Calendar,
  Search,
  Filter,
  Trash,
  Edit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUsers } from "@/hooks/useAdminData";

// Mock data for emails
const mockEmails = [
  {
    id: "1",
    subject: "Bem-vindo à NovelBook!",
    recipients: "Novos Usuários",
    sent: 128,
    opened: 98,
    clicked: 45,
    date: "2023-09-15T10:30:00Z",
    status: "sent"
  },
  {
    id: "2",
    subject: "Descubra novas novelas esta semana",
    recipients: "Todos os Usuários",
    sent: 1542,
    opened: 876,
    clicked: 320,
    date: "2023-09-10T14:45:00Z",
    status: "sent"
  },
  {
    id: "3",
    subject: "50% de desconto em novelas de fantasia",
    recipients: "Fãs de Fantasia",
    sent: 745,
    opened: 523,
    clicked: 210,
    date: "2023-09-05T09:15:00Z",
    status: "sent"
  },
  {
    id: "4",
    subject: "Atualizações na plataforma",
    recipients: "Todos os Usuários",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "2023-09-20T00:00:00Z",
    status: "draft"
  },
  {
    id: "5",
    subject: "Sua novela favorita tem um novo capítulo",
    recipients: "Seguidores Ativos",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "2023-09-18T00:00:00Z",
    status: "scheduled",
    scheduledDate: "2023-09-25T10:00:00Z"
  }
];

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    title: "Novo capítulo disponível",
    content: "O capítulo 15 de 'A Jornada do Herói' está disponível para leitura!",
    target: "Leitores Ativos",
    sent: 1254,
    viewed: 876,
    date: "2023-09-12T08:30:00Z",
    status: "sent"
  },
  {
    id: "2",
    title: "Manutenção programada",
    content: "O sistema ficará indisponível por 30 minutos para manutenção em 25/09.",
    target: "Todos os Usuários",
    sent: 2541,
    viewed: 1876,
    date: "2023-09-10T14:45:00Z",
    status: "sent"
  },
  {
    id: "3",
    title: "Nova funcionalidade: Marcadores",
    content: "Agora você pode usar marcadores para salvar seus trechos favoritos!",
    target: "Usuários Premium",
    sent: 0,
    viewed: 0,
    date: "2023-09-20T00:00:00Z",
    status: "draft"
  },
  {
    id: "4",
    title: "Promoção de fim de semana",
    content: "Aproveite 30% de desconto em todas as novelas este final de semana!",
    target: "Todos os Usuários",
    sent: 0,
    viewed: 0,
    date: "2023-09-18T00:00:00Z",
    status: "scheduled",
    scheduledDate: "2023-09-22T10:00:00Z"
  }
];

const Communications = () => {
  const { users } = useUsers();
  const [activeTab, setActiveTab] = useState("emails");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [emails, setEmails] = useState(mockEmails);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: "",
    recipients: "",
    scheduledDate: ""
  });
  
  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    content: "",
    target: "",
    scheduledDate: ""
  });

  // Filtered emails based on search and status
  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.recipients.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? email.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Filtered notifications based on search and status
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notification.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? notification.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Handle email form change
  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmailForm({ ...emailForm, [name]: value });
  };

  // Handle notification form change
  const handleNotificationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNotificationForm({ ...notificationForm, [name]: value });
  };

  // Submit new email
  const handleEmailSubmit = (saveAsDraft: boolean) => {
    if (!emailForm.subject || !emailForm.content || !emailForm.recipients) return;
    
    const now = new Date().toISOString();
    const newEmail = {
      id: `${emails.length + 1}`,
      subject: emailForm.subject,
      recipients: emailForm.recipients,
      sent: 0,
      opened: 0,
      clicked: 0,
      date: now,
      status: saveAsDraft ? "draft" : emailForm.scheduledDate ? "scheduled" : "sent",
      ...(emailForm.scheduledDate && { scheduledDate: emailForm.scheduledDate })
    };
    
    setEmails([...emails, newEmail]);
    
    // Reset form
    setEmailForm({
      subject: "",
      content: "",
      recipients: "",
      scheduledDate: ""
    });
  };

  // Submit new notification
  const handleNotificationSubmit = (saveAsDraft: boolean) => {
    if (!notificationForm.title || !notificationForm.content || !notificationForm.target) return;
    
    const now = new Date().toISOString();
    const newNotification = {
      id: `${notifications.length + 1}`,
      title: notificationForm.title,
      content: notificationForm.content,
      target: notificationForm.target,
      sent: 0,
      viewed: 0,
      date: now,
      status: saveAsDraft ? "draft" : notificationForm.scheduledDate ? "scheduled" : "sent",
      ...(notificationForm.scheduledDate && { scheduledDate: notificationForm.scheduledDate })
    };
    
    setNotifications([...notifications, newNotification]);
    
    // Reset form
    setNotificationForm({
      title: "",
      content: "",
      target: "",
      scheduledDate: ""
    });
  };

  // Delete email
  const handleDeleteEmail = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este email?")) {
      setEmails(emails.filter(email => email.id !== id));
    }
  };

  // Delete notification
  const handleDeleteNotification = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta notificação?")) {
      setNotifications(notifications.filter(notification => notification.id !== id));
    }
  };

  // Get status badge
  const getStatusBadge = (status: string, scheduledDate?: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600">Enviado</Badge>;
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'scheduled':
        return (
          <div className="flex flex-col">
            <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Agendado</Badge>
            {scheduledDate && (
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(scheduledDate).toLocaleString()}
              </span>
            )}
          </div>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Comunicações</h1>
        <p className="text-muted-foreground">Gerencie emails, notificações e comunicados para os usuários.</p>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail size={16} />
              <span>Emails</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing size={16} />
              <span>Notificações</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="h-10 rounded-md border border-input bg-background px-3 py-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="sent">Enviado</option>
              <option value="draft">Rascunho</option>
              <option value="scheduled">Agendado</option>
            </select>
          </div>
        </div>
        
        <TabsContent value="emails" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campanhas de Email</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  <span>Novo Email</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Campanha de Email</DialogTitle>
                  <DialogDescription>
                    Crie e envie emails para seus usuários. Configure os detalhes abaixo.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      value={emailForm.subject} 
                      onChange={handleEmailFormChange} 
                      placeholder="Assunto do email" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="recipients">Destinatários</Label>
                    <select 
                      id="recipients" 
                      name="recipients" 
                      value={emailForm.recipients} 
                      onChange={handleEmailFormChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="">Selecione os destinatários</option>
                      <option value="Todos os Usuários">Todos os Usuários</option>
                      <option value="Novos Usuários">Novos Usuários</option>
                      <option value="Usuários Premium">Usuários Premium</option>
                      <option value="Usuários Inativos">Usuários Inativos</option>
                      <option value="Fãs de Fantasia">Fãs de Fantasia</option>
                      <option value="Fãs de Romance">Fãs de Romance</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <textarea 
                      id="content" 
                      name="content" 
                      value={emailForm.content} 
                      onChange={handleEmailFormChange} 
                      className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Conteúdo do email (suporta HTML)" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scheduledDate">Agendar Envio (opcional)</Label>
                    <Input 
                      id="scheduledDate" 
                      name="scheduledDate" 
                      type="datetime-local" 
                      value={emailForm.scheduledDate} 
                      onChange={handleEmailFormChange} 
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleEmailSubmit(true)}
                  >
                    Salvar como Rascunho
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => alert("Email de teste enviado!")}
                    >
                      Enviar Teste
                    </Button>
                    <Button type="submit" onClick={() => handleEmailSubmit(false)}>
                      {emailForm.scheduledDate ? 'Agendar' : 'Enviar Agora'}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assunto</TableHead>
                <TableHead>Destinatários</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviados</TableHead>
                <TableHead>Abertos</TableHead>
                <TableHead>Clicados</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmails.length > 0 ? (
                filteredEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">{email.subject}</TableCell>
                    <TableCell>{email.recipients}</TableCell>
                    <TableCell>
                      {getStatusBadge(email.status, email.scheduledDate)}
                    </TableCell>
                    <TableCell>{email.sent}</TableCell>
                    <TableCell>
                      {email.sent > 0 ? `${email.opened} (${Math.round((email.opened / email.sent) * 100)}%)` : '0'}
                    </TableCell>
                    <TableCell>
                      {email.sent > 0 ? `${email.clicked} (${Math.round((email.clicked / email.sent) * 100)}%)` : '0'}
                    </TableCell>
                    <TableCell>{new Date(email.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Estatísticas"
                          disabled={email.status !== 'sent'}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Editar"
                          disabled={email.status === 'sent'}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Excluir"
                          onClick={() => handleDeleteEmail(email.id)}
                          disabled={email.status === 'sent' && email.sent > 0}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum email encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Notificações do Sistema</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  <span>Nova Notificação</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Notificação</DialogTitle>
                  <DialogDescription>
                    Envie notificações para os usuários da plataforma.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={notificationForm.title} 
                      onChange={handleNotificationFormChange} 
                      placeholder="Título da notificação" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <textarea 
                      id="content" 
                      name="content" 
                      value={notificationForm.content} 
                      onChange={handleNotificationFormChange} 
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Mensagem da notificação" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="target">Público-alvo</Label>
                    <select 
                      id="target" 
                      name="target" 
                      value={notificationForm.target} 
                      onChange={handleNotificationFormChange}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="">Selecione o público-alvo</option>
                      <option value="Todos os Usuários">Todos os Usuários</option>
                      <option value="Usuários Premium">Usuários Premium</option>
                      <option value="Leitores Ativos">Leitores Ativos</option>
                      <option value="Novos Usuários">Novos Usuários</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notif-scheduledDate">Agendar Envio (opcional)</Label>
                    <Input 
                      id="notif-scheduledDate" 
                      name="scheduledDate" 
                      type="datetime-local" 
                      value={notificationForm.scheduledDate} 
                      onChange={handleNotificationFormChange} 
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleNotificationSubmit(true)}
                  >
                    Salvar como Rascunho
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={() => handleNotificationSubmit(false)}
                  >
                    {notificationForm.scheduledDate ? 'Agendar' : 'Enviar Agora'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Conteúdo</TableHead>
                <TableHead>Público-alvo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviadas</TableHead>
                <TableHead>Visualizadas</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.content}</TableCell>
                    <TableCell>{notification.target}</TableCell>
                    <TableCell>
                      {getStatusBadge(notification.status, notification.scheduledDate)}
                    </TableCell>
                    <TableCell>{notification.sent}</TableCell>
                    <TableCell>
                      {notification.sent > 0 ? `${notification.viewed} (${Math.round((notification.viewed / notification.sent) * 100)}%)` : '0'}
                    </TableCell>
                    <TableCell>{new Date(notification.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Estatísticas"
                          disabled={notification.status !== 'sent'}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Editar"
                          disabled={notification.status === 'sent'}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Excluir"
                          onClick={() => handleDeleteNotification(notification.id)}
                          disabled={notification.status === 'sent' && notification.sent > 0}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhuma notificação encontrada com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communications;
