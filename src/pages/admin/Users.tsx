
import { useState } from "react";
import { useUsers, useActivityLogs } from "@/hooks/useAdminData";
import { User } from "@/lib/data/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Users as UsersIcon,
  UserPlus,
  MoreVertical,
  UserCog,
  Shield,
  Ban,
  Clock,
  CalendarClock,
  Search,
  FilterX,
  ArrowUpDown,
  UserCheck,
  UserX,
  InfoIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Users() {
  const { users, updateUser, deleteUser, addUser } = useUsers();
  const { addLog } = useActivityLogs();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "date" | "role">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Form state for new/edit user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    avatar: "",
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
      avatar: "",
    });
  };

  // Load user data for editing
  const loadUserForEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar || "",
    });
    setSelectedUser(user);
    setIsEditing(true);
  };

  // Load user data for viewing
  const loadUserForView = (user: User) => {
    setSelectedUser(user);
    setIsViewing(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form for create/edit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedUser) {
        updateUser(selectedUser.id, formData);
        
        // Log the action
        addLog({
          user: { id: "1", name: "Admin" },
          action: "user_updated",
          entity: {
            type: "user",
            id: selectedUser.id,
            name: formData.name
          },
          details: `Usuário atualizado: ${selectedUser.name} -> ${formData.name}`
        });
        
        toast.success("Usuário atualizado com sucesso!");
      } else {
        const newUser = addUser({
          ...formData,
          createdAt: new Date().toISOString(),
          purchased: 0,
          reads: 0,
        });
        
        // Log the action
        addLog({
          user: { id: "1", name: "Admin" },
          action: "user_created",
          entity: {
            type: "user",
            id: newUser.id,
            name: formData.name
          },
          details: `Novo usuário criado: ${formData.name}`
        });
        
        toast.success("Usuário criado com sucesso!");
      }
      
      resetFormData();
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      toast.error("Erro ao salvar o usuário");
      console.error(error);
    }
  };

  // Change user status
  const changeUserStatus = (userId: string, status: User["status"]) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, { status });
      
      // Log the action
      const actionMap = {
        active: "user_activated",
        blocked: "user_blocked",
        pending: "user_pending"
      };
      
      addLog({
        user: { id: "1", name: "Admin" },
        action: actionMap[status],
        entity: {
          type: "user",
          id: userId,
          name: user.name
        },
        details: `Status alterado para: ${status}`
      });
      
      toast.success(`Status do usuário alterado para ${status}`);
    }
  };

  // Change user role
  const changeUserRole = (userId: string, role: User["role"]) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, { role });
      
      // Log the action
      addLog({
        user: { id: "1", name: "Admin" },
        action: "user_role_changed",
        entity: {
          type: "user",
          id: userId,
          name: user.name
        },
        details: `Papel alterado para: ${role}`
      });
      
      toast.success(`Papel do usuário alterado para ${role}`);
    }
  };

  // Delete user
  const confirmDelete = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      deleteUser(userId);
      
      // Log the action
      addLog({
        user: { id: "1", name: "Admin" },
        action: "user_deleted",
        entity: {
          type: "user",
          id: userId,
          name: user.name
        },
        details: `Usuário excluído: ${user.name}`
      });
      
      toast.success("Usuário excluído com sucesso!");
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus = filterStatus === "all" || user.status === filterStatus;
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "date":
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "role":
          comparison = a.role.localeCompare(b.role);
          break;
      }
      
      return sortOrder === "asc" ? comparison * -1 : comparison;
    });

  // Toggle sort order
  const toggleSort = (field: "name" | "email" | "date" | "role") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Status badge renderer
  const renderStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600"><UserCheck className="mr-1 h-3 w-3" /> Ativo</Badge>;
      case "blocked":
        return <Badge variant="destructive"><Ban className="mr-1 h-3 w-3" /> Bloqueado</Badge>;
      case "pending":
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Role badge renderer
  const renderRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return <Badge variant="default" className="bg-purple-500 hover:bg-purple-600"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>;
      case "author":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600"><BookOpen className="mr-1 h-3 w-3" /> Autor</Badge>;
      case "user":
        return <Badge variant="outline"><UserIcon className="mr-1 h-3 w-3" /> Usuário</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterRole("all");
    setFilterStatus("all");
    setSearchTerm("");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários da plataforma
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetFormData();
              setIsCreating(true);
            }}>
              <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo usuário. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Papel</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um papel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="author">Autor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">URL do Avatar (opcional)</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/avatar.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetFormData();
                    setIsCreating(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Lista de todos os usuários cadastrados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="flex flex-row gap-2">
              <Select
                value={filterRole}
                onValueChange={setFilterRole}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filtrar papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                  <SelectItem value="author">Autores</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filtrar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="blocked">Bloqueados</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-[40px] p-0 h-10"
                title="Limpar filtros"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("name")}
                      className="flex items-center"
                    >
                      Nome
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("email")}
                      className="flex items-center"
                    >
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("role")}
                      className="flex items-center"
                    >
                      Papel
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("date")}
                      className="flex items-center"
                    >
                      Cadastro
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{renderRoleBadge(user.role)}</TableCell>
                      <TableCell>{renderStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Dialog open={isEditing && selectedUser?.id === user.id} onOpenChange={(open) => {
                          if (!open) setIsEditing(false);
                        }}>
                          <Dialog open={isViewing && selectedUser?.id === user.id} onOpenChange={(open) => {
                            if (!open) setIsViewing(false);
                          }}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => loadUserForView(user)}>
                                  <InfoIcon className="h-4 w-4 mr-2" /> Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => loadUserForEdit(user)}>
                                  <UserCog className="h-4 w-4 mr-2" /> Editar
                                </DropdownMenuItem>
                                {user.status !== "active" ? (
                                  <DropdownMenuItem onClick={() => changeUserStatus(user.id, "active")}>
                                    <UserCheck className="h-4 w-4 mr-2" /> Ativar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => changeUserStatus(user.id, "blocked")}>
                                    <Ban className="h-4 w-4 mr-2" /> Bloquear
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => confirmDelete(user.id)}>
                                  <UserX className="h-4 w-4 mr-2" /> Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Edit User Dialog */}
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Usuário</DialogTitle>
                                <DialogDescription>
                                  Atualize os detalhes do usuário. Clique em salvar quando terminar.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nome</Label>
                                    <Input
                                      id="edit-name"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      name="email"
                                      type="email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-role">Papel</Label>
                                      <Select
                                        value={formData.role}
                                        onValueChange={(value) => handleSelectChange("role", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione um papel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="user">Usuário</SelectItem>
                                          <SelectItem value="author">Autor</SelectItem>
                                          <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Status</Label>
                                      <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange("status", value)}
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
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-avatar">URL do Avatar (opcional)</Label>
                                    <Input
                                      id="edit-avatar"
                                      name="avatar"
                                      value={formData.avatar}
                                      onChange={handleInputChange}
                                      placeholder="https://exemplo.com/avatar.jpg"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button type="submit">Salvar</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                            
                            {/* View User Dialog */}
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalhes do Usuário</DialogTitle>
                                <DialogDescription>
                                  Informações detalhadas sobre o usuário.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="py-4">
                                  <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                      <AvatarFallback className="text-lg">{getInitials(selectedUser.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                                      <p className="text-muted-foreground">{selectedUser.email}</p>
                                      <div className="flex gap-2 mt-1">
                                        {renderRoleBadge(selectedUser.role)}
                                        {renderStatusBadge(selectedUser.status)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
                                      <p>{format(new Date(selectedUser.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                                    </div>
                                    {selectedUser.lastLogin && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Último Acesso</p>
                                        <p>{format(new Date(selectedUser.lastLogin), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-muted p-3 rounded-md">
                                      <p className="text-sm font-medium text-muted-foreground mb-1">Compras</p>
                                      <p className="text-xl font-bold">{selectedUser.purchased}</p>
                                    </div>
                                    <div className="bg-muted p-3 rounded-md">
                                      <p className="text-sm font-medium text-muted-foreground mb-1">Leituras</p>
                                      <p className="text-xl font-bold">{selectedUser.reads}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsViewing(false)}
                                >
                                  Fechar
                                </Button>
                                <Button onClick={() => {
                                  setIsViewing(false);
                                  if (selectedUser) loadUserForEdit(selectedUser);
                                }}>
                                  Editar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <span>Mostrando {filteredUsers.length} de {users.length} usuários</span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {users.filter(u => u.status === "active").length} ativos
            </span>
            <span className="h-4 border-r"></span>
            <span>
              {users.filter(u => u.status === "blocked").length} bloqueados
            </span>
            <span className="h-4 border-r"></span>
            <span>
              {users.filter(u => u.status === "pending").length} pendentes
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function BookOpen(props: any) {
  return <lucide-react.BookOpen {...props} />;
}

function UserIcon(props: any) {
  return <lucide-react.User {...props} />;
}
