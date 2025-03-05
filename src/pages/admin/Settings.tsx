
import { useState } from "react";
import { useSystemSettings, useActivityLogs } from "@/hooks/useAdminData";
import { SystemSetting } from "@/lib/data/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Palette,
  Mail,
  CreditCard,
  Shield,
  Globe,
  Paintbrush,
  BadgePercent,
  UserCog,
} from "lucide-react";

export default function Settings() {
  const { settings, updateSetting, getSettingsByCategory } = useSystemSettings();
  const { addLog } = useActivityLogs();
  
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Create local state for settings by category
  const [generalSettings, setGeneralSettings] = useState(
    getSettingsByCategory("general")
  );
  const [appearanceSettings, setAppearanceSettings] = useState(
    getSettingsByCategory("appearance")
  );
  const [emailSettings, setEmailSettings] = useState(
    getSettingsByCategory("email")
  );
  const [paymentSettings, setPaymentSettings] = useState(
    getSettingsByCategory("payment")
  );
  const [securitySettings, setSecuritySettings] = useState(
    getSettingsByCategory("security")
  );

  // Handle setting change for category
  const handleSettingChange = (
    category: SystemSetting["category"],
    key: string,
    value: string
  ) => {
    setHasChanges(true);
    
    switch (category) {
      case "general":
        setGeneralSettings(
          generalSettings.map((setting) =>
            setting.key === key ? { ...setting, value } : setting
          )
        );
        break;
      case "appearance":
        setAppearanceSettings(
          appearanceSettings.map((setting) =>
            setting.key === key ? { ...setting, value } : setting
          )
        );
        break;
      case "email":
        setEmailSettings(
          emailSettings.map((setting) =>
            setting.key === key ? { ...setting, value } : setting
          )
        );
        break;
      case "payment":
        setPaymentSettings(
          paymentSettings.map((setting) =>
            setting.key === key ? { ...setting, value } : setting
          )
        );
        break;
      case "security":
        setSecuritySettings(
          securitySettings.map((setting) =>
            setting.key === key ? { ...setting, value } : setting
          )
        );
        break;
    }
  };

  // Toggle boolean setting
  const handleToggle = (
    category: SystemSetting["category"],
    key: string,
    currentValue: string
  ) => {
    const newValue = currentValue === "true" ? "false" : "true";
    handleSettingChange(category, key, newValue);
  };

  // Save all settings
  const saveSettings = () => {
    try {
      // Save general settings
      generalSettings.forEach((setting) => {
        updateSetting(setting.key, setting.value);
      });
      
      // Save appearance settings
      appearanceSettings.forEach((setting) => {
        updateSetting(setting.key, setting.value);
      });
      
      // Save email settings
      emailSettings.forEach((setting) => {
        updateSetting(setting.key, setting.value);
      });
      
      // Save payment settings
      paymentSettings.forEach((setting) => {
        updateSetting(setting.key, setting.value);
      });
      
      // Save security settings
      securitySettings.forEach((setting) => {
        updateSetting(setting.key, setting.value);
      });
      
      // Log the action
      addLog({
        user: { id: "1", name: "Admin" },
        action: "system_settings_updated",
        entity: {
          type: "setting",
          id: "system",
          name: "Configurações do Sistema"
        },
        details: "Configurações do sistema atualizadas"
      });
      
      setHasChanges(false);
      setIsEditing(false);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
      console.error(error);
    }
  };

  // Reset local settings to current saved settings
  const resetSettings = () => {
    setGeneralSettings(getSettingsByCategory("general"));
    setAppearanceSettings(getSettingsByCategory("appearance"));
    setEmailSettings(getSettingsByCategory("email"));
    setPaymentSettings(getSettingsByCategory("payment"));
    setSecuritySettings(getSettingsByCategory("security"));
    setHasChanges(false);
    setIsEditing(false);
  };

  // Render setting input based on type
  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={setting.key}
              checked={setting.value === "true"}
              onCheckedChange={() =>
                handleToggle(setting.category, setting.key, setting.value)
              }
              disabled={!isEditing}
            />
            <Label htmlFor={setting.key}>{setting.value === "true" ? "Ativado" : "Desativado"}</Label>
          </div>
        );
      case "json":
        return (
          <Textarea
            id={setting.key}
            value={setting.value}
            onChange={(e) =>
              handleSettingChange(setting.category, setting.key, e.target.value)
            }
            rows={5}
            disabled={!isEditing}
            className="font-mono text-sm"
          />
        );
      default:
        return (
          <Input
            id={setting.key}
            value={setting.value}
            onChange={(e) =>
              handleSettingChange(setting.category, setting.key, e.target.value)
            }
            disabled={!isEditing}
          />
        );
    }
  };

  // Get icon for setting category
  const getCategoryIcon = (category: SystemSetting["category"]) => {
    switch (category) {
      case "general":
        return <Globe className="h-5 w-5" />;
      case "appearance":
        return <Palette className="h-5 w-5" />;
      case "email":
        return <Mail className="h-5 w-5" />;
      case "payment":
        return <CreditCard className="h-5 w-5" />;
      case "security":
        return <Shield className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={saveSettings} disabled={!hasChanges}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Mudanças
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <UserCog className="mr-2 h-4 w-4" />
              Editar Configurações
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">
                <Globe className="mr-2 h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Paintbrush className="mr-2 h-4 w-4" />
                Aparência
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="payment">
                <BadgePercent className="mr-2 h-4 w-4" />
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Segurança
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Configurações Gerais</h3>
            </div>
            {generalSettings.map((setting) => (
              <div key={setting.key} className="grid gap-2">
                <Label htmlFor={setting.key}>{setting.description}</Label>
                {renderSettingInput(setting)}
              </div>
            ))}
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Paintbrush className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Configurações de Aparência</h3>
            </div>
            {appearanceSettings.map((setting) => (
              <div key={setting.key} className="grid gap-2">
                <Label htmlFor={setting.key}>{setting.description}</Label>
                {renderSettingInput(setting)}
              </div>
            ))}
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Configurações de Email</h3>
            </div>
            {emailSettings.map((setting) => (
              <div key={setting.key} className="grid gap-2">
                <Label htmlFor={setting.key}>{setting.description}</Label>
                {renderSettingInput(setting)}
              </div>
            ))}
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BadgePercent className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Configurações de Pagamento</h3>
            </div>
            {paymentSettings.map((setting) => (
              <div key={setting.key} className="grid gap-2">
                <Label htmlFor={setting.key}>{setting.description}</Label>
                {renderSettingInput(setting)}
              </div>
            ))}
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Configurações de Segurança</h3>
            </div>
            {securitySettings.map((setting) => (
              <div key={setting.key} className="grid gap-2">
                <Label htmlFor={setting.key}>{setting.description}</Label>
                {renderSettingInput(setting)}
                {setting.key === "password_policy" && (
                  <p className="text-xs text-muted-foreground">
                    Define a política de senhas para todos os usuários. Recomendado: mínimo 8 caracteres com letras e números.
                  </p>
                )}
              </div>
            ))}
          </TabsContent>
        </CardContent>
        {isEditing && (
          <CardFooter className="border-t px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-muted-foreground">
                {hasChanges
                  ? "Você tem alterações não salvas."
                  : "Nenhuma alteração realizada."}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetSettings}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={saveSettings} disabled={!hasChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
