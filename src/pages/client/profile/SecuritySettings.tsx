
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Check, Eye, EyeOff, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SecuritySettings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    rememberDevices: true,
    lastActiveSession: "Hoje, 14:32 - São Paulo, BR (Chrome em Windows)"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [name]: checked }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!passwordData.currentPassword) {
      return toast.error("Digite sua senha atual");
    }
    
    if (passwordData.newPassword.length < 8) {
      return toast.error("A nova senha deve ter pelo menos 8 caracteres");
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("As senhas não coincidem");
    }
    
    // Simulação de sucesso
    toast.success("Senha alterada com sucesso!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleSessionLogout = () => {
    toast.success("Todas as outras sessões foram encerradas");
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" };
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const checks = [hasUppercase, hasLowercase, hasNumber, hasSpecial, isLongEnough];
    const passedChecks = checks.filter(Boolean).length;
    
    if (passedChecks <= 2) return { strength: 1, label: "Fraca" };
    if (passedChecks <= 4) return { strength: 2, label: "Média" };
    return { strength: 3, label: "Forte" };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex items-center">
        <Link to="/perfil" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Segurança da Conta</h1>
      </div>

      <div className="grid gap-6">
        {/* Alteração de Senha */}
        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              É recomendável utilizar uma senha forte e única
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input 
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Digite sua senha atual"
                    value={passwordData.currentPassword}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input 
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Digite a nova senha"
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Força da senha:</span>
                      <span className={
                        passwordStrength.strength === 1 ? "text-red-500" : 
                        passwordStrength.strength === 2 ? "text-yellow-500" : 
                        "text-green-500"
                      }>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1">
                      <div className={`flex-1 rounded-full ${
                        passwordStrength.strength >= 1 ? "bg-red-500" : "bg-gray-200"
                      }`}></div>
                      <div className={`flex-1 rounded-full ${
                        passwordStrength.strength >= 2 ? "bg-yellow-500" : "bg-gray-200"
                      }`}></div>
                      <div className={`flex-1 rounded-full ${
                        passwordStrength.strength >= 3 ? "bg-green-500" : "bg-gray-200"
                      }`}></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-1.5 text-sm">
                        {isLongEnough ? 
                          <Check size={14} className="text-green-500" /> : 
                          <X size={14} className="text-muted-foreground" />
                        }
                        <span className={isLongEnough ? "text-green-500" : "text-muted-foreground"}>
                          8+ caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        {hasUpperLower ? 
                          <Check size={14} className="text-green-500" /> : 
                          <X size={14} className="text-muted-foreground" />
                        }
                        <span className={hasUpperLower ? "text-green-500" : "text-muted-foreground"}>
                          Maiúsculas e minúsculas
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        {hasNumber ? 
                          <Check size={14} className="text-green-500" /> : 
                          <X size={14} className="text-muted-foreground" />
                        }
                        <span className={hasNumber ? "text-green-500" : "text-muted-foreground"}>
                          Números
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        {hasSpecial ? 
                          <Check size={14} className="text-green-500" /> : 
                          <X size={14} className="text-muted-foreground" />
                        }
                        <span className={hasSpecial ? "text-green-500" : "text-muted-foreground"}>
                          Símbolos especiais
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme a nova senha"
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    As senhas não coincidem
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-novel-lilac-500 hover:bg-novel-lilac-600"
              >
                Alterar Senha
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Autenticação de Dois Fatores */}
        <Card>
          <CardHeader>
            <CardTitle>Autenticação de Dois Fatores</CardTitle>
            <CardDescription>
              Adicione uma camada extra de segurança à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Autenticação de dois fatores</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um código por email para confirmar seus logins
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => {
                  handleSwitchChange("twoFactorAuth", checked);
                  if (checked) {
                    toast.success("Autenticação de dois fatores ativada");
                  } else {
                    toast.success("Autenticação de dois fatores desativada");
                  }
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="login-notifications">Notificações de login</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando sua conta for acessada de um novo dispositivo
                </p>
              </div>
              <Switch
                id="login-notifications"
                checked={securitySettings.loginNotifications}
                onCheckedChange={(checked) => handleSwitchChange("loginNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="remember-devices">Lembrar dispositivos</Label>
                <p className="text-sm text-muted-foreground">
                  Permanecer conectado em dispositivos confiáveis
                </p>
              </div>
              <Switch
                id="remember-devices"
                checked={securitySettings.rememberDevices}
                onCheckedChange={(checked) => handleSwitchChange("rememberDevices", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sessões Ativas */}
        <Card>
          <CardHeader>
            <CardTitle>Sessões Ativas</CardTitle>
            <CardDescription>
              Gerencie os dispositivos onde sua conta está conectada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">Sessão atual</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {securitySettings.lastActiveSession}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full text-red-500 hover:text-red-700"
              onClick={handleSessionLogout}
            >
              Encerrar todas as outras sessões
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Variáveis auxiliares para validação de senha
const isLongEnough = (password: string) => password.length >= 8;
const hasUpperLower = (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password);
const hasNumber = (password: string) => /[0-9]/.test(password);
const hasSpecial = (password: string) => /[^A-Za-z0-9]/.test(password);

export default SecuritySettings;
