
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  Mail, 
  Shield, 
  User as UserIcon,
  UserPlus,
  BookOpen,
  Clock,
  Check,
  X
} from "lucide-react";
import { useUsers } from "@/hooks/useAdminData";
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
import { Label } from "@/components/ui/label";
import { User } from "@/lib/data/types";

const Users = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  // User form state
  const [userForm, setUserForm] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "active"
  });

  // Filtered users based on search, role and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user form change
  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  // Submit new user
  const handleUserSubmit = () => {
    if (!userForm.name || !userForm.email) return;
    
    const newUser = {
      ...userForm,
      createdAt: new Date().toISOString(),
      purchased: 0,
      reads: 0
    } as Omit<User, 'id'>;
    
    addUser(newUser);
    
    // Reset form
    setUserForm({
      name: "",
      email: "",
      role: "user",
      status: "active"
    });
  };

  // Delete a user
  const handleDeleteUser = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUser(id);
    }
  };

  // Update user status
  const handleStatusChange = (id: string, status: User['status']) => {
    updateUser(id, { status });
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="secondary" className="bg-purple-500 hover:bg-purple-600">{role}</Badge>;
      case 'author':
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">{role}</Badge>;
      case 'user':
        return <Badge variant="outline">{role}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'blocked':
        return <Badge variant="secondary" className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Administração de Usuários</h1>
        <p className="text-muted-foreground">Gerencie usuários, autores e administradores da plataforma.</p>
      </header>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuários..."
              className="w-80 pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Todos os papéis</option>
            <option value="user">Usuário</option>
            <option value="author">Autor</option>
            <option value="admin">Administrador</option>
          </select>
          
          <select 
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="blocked">Bloqueado</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Novo Usuário</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do usuário. Um email será enviado para o novo usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={userForm.name} 
                  onChange={handleUserFormChange} 
                  placeholder="Nome completo" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={userForm.email} 
                  onChange={handleUserFormChange} 
                  placeholder="email@exemplo.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Papel</Label>
                  <select 
                    id="role" 
                    name="role" 
                    value={userForm.role} 
                    onChange={handleUserFormChange}
                    className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="user">Usuário</option>
                    <option value="author">Autor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    name="status" 
                    value={userForm.status} 
                    onChange={handleUserFormChange}
                    className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="active">Ativo</option>
                    <option value="blocked">Bloqueado</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUserSubmit}>Adicionar Usuário</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Registro</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead>Leituras</TableHead>
            <TableHead>Compras</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <UserIcon size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{user.reads || 0}</TableCell>
                <TableCell>{user.purchased || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {user.status === "active" ? (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Bloquear" 
                        onClick={() => handleStatusChange(user.id, "blocked")}
                      >
                        <X size={16} className="text-red-500" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Ativar" 
                        onClick={() => handleStatusChange(user.id, "active")}
                      >
                        <Check size={16} className="text-green-500" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" title="Enviar Email">
                      <Mail size={16} />
                    </Button>
                    <Button variant="outline" size="icon" title="Editar">
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Excluir"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado com os filtros selecionados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
