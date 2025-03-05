
import React, { useState } from "react";
import { useUsers, useActivityLogs } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User } from "@/lib/data/types";
import { 
  Users as UsersIcon, 
  User as UserIcon, 
  UserPlus, 
  Filter, 
  Search, 
  MoreVertical, 
  Pencil, 
  Trash, 
  ShieldAlert, 
  Mail, 
  Key 
} from "lucide-react";

type StatusColors = {
  [key in User['status']]: string;
};

const statusColors: StatusColors = {
  active: "bg-green-100 text-green-800",
  blocked: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const statusLabels = {
  active: "Ativo",
  blocked: "Bloqueado",
  pending: "Pendente",
};

const roleLabels = {
  user: "Usuário",
  author: "Autor",
  admin: "Administrador",
};

const UsersPage = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { addLog } = useActivityLogs();
  
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form State for New User
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "user" as User['role'],
    status: "pending" as User['status'],
    avatar: "",
  });
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesTab = selectedTab === "all" || 
                       (selectedTab === "recent" && new Date(user.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });
  
  // Reset form
  const resetForm = () => {
    setNewUserForm({
      name: "",
      email: "",
      role: "user",
      status: "pending",
      avatar: "",
    });
  };
  
  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUserForm({
      ...newUserForm,
      [name]: value,
    });
  };
  
  // Handle form select change
  const handleSelectChange = (name: string, value: string) => {
    setNewUserForm({
      ...newUserForm,
      [name]: value,
    });
  };
  
  // Add new user
  const handleAddUser = () => {
    const userData = {
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: newUserForm.status,
      avatar: newUserForm.avatar || undefined,
    };
    
    const fullUserData = {
      ...userData,
      createdAt: new Date().toISOString(),
      purchased: 0,
      reads: 0,
    };
    
    addUser(fullUserData);
    
    addLog({
      user: {
        id: "admin",
        name: "Administrador",
      },
      action: "Adicionou um novo usuário",
      entity: {
        type: "user",
        id: "new",
        name: newUserForm.name,
      },
      details: `Usuário "${newUserForm.name}" adicionado como ${roleLabels[newUserForm.role]}`,
    });
    
    setIsNewUserOpen(false);
    resetForm();
    toast.success("Usuário adicionado com sucesso!");
  };
  
  // Edit user
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    const userData = {
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: newUserForm.status,
      avatar: newUserForm.avatar || undefined,
    };
    
    updateUser(selectedUser.id, userData);
    
    addLog({
      user: {
        id: "admin",
        name: "Administrador",
      },
      action: "Atualizou um usuário",
      entity: {
        type: "user",
        id: selectedUser.id,
        name: newUserForm.name,
      },
      details: `Usuário "${newUserForm.name}" atualizado com papel ${roleLabels[newUserForm.role]} e status ${statusLabels[newUserForm.status]}`,
    });
    
    setIsEditUserOpen(false);
    setSelectedUser(null);
    resetForm();
    toast.success("Usuário atualizado com sucesso!");
  };
  
  // Delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    deleteUser(selectedUser.id);
    
    addLog({
      user: {
        id: "admin",
        name: "Administrador",
      },
      action: "Removeu um usuário",
      entity: {
        type: "user",
        id: selectedUser.id,
        name: selectedUser.name,
      },
      details: `Usuário "${selectedUser.name}" removido do sistema`,
    });
    
    setIsDeleteConfirmOpen(false);
    setSelectedUser(null);
    toast.success("Usuário excluído com sucesso!");
  };
  
  // Open edit dialog
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setNewUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar || "",
    });
    setIsEditUserOpen(true);
  };
  
  // Open delete confirm dialog
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, autores e administradores.
          </p>
        </div>
        <Button onClick={() => setIsNewUserOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="all" className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-2" /> Todos os Usuários
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2" /> Registros Recentes
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={roleFilter || ""}
              onValueChange={(value) => setRoleFilter(value || null)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="author">Autor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Usuários ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Lista completa de todos os usuários registrados na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'author' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100'
                          }>
                            {user.role === 'admin' && <ShieldAlert className="h-3 w-3 mr-1" />}
                            {roleLabels[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[user.status]}>
                            {statusLabels[user.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="flex items-center"
                                onClick={() => openEditDialog(user)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar mensagem
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center">
                                <Key className="mr-2 h-4 w-4" />
                                Redefinir senha
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center text-destructive"
                                onClick={() => openDeleteDialog(user)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Recentes</CardTitle>
              <CardDescription>
                Usuários que se cadastraram nos últimos 7 dias.
              </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'author' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100'
                          }>
                            {user.role === 'admin' && <ShieldAlert className="h-3 w-3 mr-1" />}
                            {roleLabels[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[user.status]}>
                            {statusLabels[user.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="flex items-center"
                                onClick={() => openEditDialog(user)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar mensagem
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center">
                                <Key className="mr-2 h-4 w-4" />
                                Redefinir senha
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center text-destructive"
                                onClick={() => openDeleteDialog(user)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nenhum registro recente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Novo Usuário Dialog */}
      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para adicionar um novo usuário à plataforma.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                value={newUserForm.name}
                onChange={handleInputChange}
                placeholder="Nome completo"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newUserForm.email}
                onChange={handleInputChange}
                placeholder="usuario@exemplo.com"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Função
              </label>
              <Select
                value={newUserForm.role}
                onValueChange={(value) => handleSelectChange("role", value as User['role'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="author">Autor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={newUserForm.status}
                onValueChange={(value) => handleSelectChange("status", value as User['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="avatar" className="text-sm font-medium">
                URL do Avatar (opcional)
              </label>
              <Input
                id="avatar"
                name="avatar"
                value={newUserForm.avatar}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/avatar.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsNewUserOpen(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>Adicionar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Editar Usuário Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="edit-name"
                name="name"
                value={newUserForm.name}
                onChange={handleInputChange}
                placeholder="Nome completo"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={newUserForm.email}
                onChange={handleInputChange}
                placeholder="usuario@exemplo.com"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-role" className="text-sm font-medium">
                Função
              </label>
              <Select
                value={newUserForm.role}
                onValueChange={(value) => handleSelectChange("role", value as User['role'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="author">Autor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={newUserForm.status}
                onValueChange={(value) => handleSelectChange("status", value as User['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-avatar" className="text-sm font-medium">
                URL do Avatar (opcional)
              </label>
              <Input
                id="edit-avatar"
                name="avatar"
                value={newUserForm.avatar}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/avatar.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditUserOpen(false);
              setSelectedUser(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmar Exclusão Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
