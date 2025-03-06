
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, MoonStar, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    // Configurações de tema
    theme: "light",
    fontSize: 16,
    reduceAnimations: false,
    
    // Configurações de leitura
    autoPlay: true,
    continuousScrolling: false,
    keepScreenOn: true,
    showPageNumber: true,
    
    // Preferências de conteúdo
    adultContent: false,
    contentLanguages: ["pt-BR"],
    autoDownload: false,
  });

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setPreferences(prev => ({ ...prev, [name]: value[0] }));
  };

  const savePreferences = () => {
    toast.success("Preferências salvas com sucesso!");
  };

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex items-center">
        <Link to="/perfil" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Preferências</h1>
      </div>

      <div className="grid gap-6">
        {/* Configurações de tema */}
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Personalize a interface visual do NovelBook
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base">Tema</Label>
                <RadioGroup 
                  value={preferences.theme} 
                  onValueChange={(value) => handleRadioChange("theme", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" />
                      Claro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="flex items-center">
                      <MoonStar className="mr-2 h-4 w-4" />
                      Escuro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">Sistema</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size">Tamanho da Fonte</Label>
                  <span className="text-sm">{preferences.fontSize}px</span>
                </div>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[preferences.fontSize]}
                  onValueChange={(value) => handleSliderChange("fontSize", value)}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-animations">Reduzir animações</Label>
                  <p className="text-sm text-muted-foreground">
                    Diminui efeitos de movimento na interface
                  </p>
                </div>
                <Switch
                  id="reduce-animations"
                  checked={preferences.reduceAnimations}
                  onCheckedChange={(checked) => handleSwitchChange("reduceAnimations", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de leitura */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Leitura</CardTitle>
            <CardDescription>
              Personalize a experiência de leitura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-play">Reprodução automática</Label>
                <p className="text-sm text-muted-foreground">
                  Continuar automaticamente para o próximo capítulo
                </p>
              </div>
              <Switch
                id="auto-play"
                checked={preferences.autoPlay}
                onCheckedChange={(checked) => handleSwitchChange("autoPlay", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="continuous-scrolling">Rolagem contínua</Label>
                <p className="text-sm text-muted-foreground">
                  Ler capítulos em uma rolagem contínua sem quebra de página
                </p>
              </div>
              <Switch
                id="continuous-scrolling"
                checked={preferences.continuousScrolling}
                onCheckedChange={(checked) => handleSwitchChange("continuousScrolling", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="keep-screen-on">Manter tela ligada</Label>
                <p className="text-sm text-muted-foreground">
                  Impedir que a tela desligue durante a leitura
                </p>
              </div>
              <Switch
                id="keep-screen-on"
                checked={preferences.keepScreenOn}
                onCheckedChange={(checked) => handleSwitchChange("keepScreenOn", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="page-number">Mostrar número de página</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir número da página e progresso durante a leitura
                </p>
              </div>
              <Switch
                id="page-number"
                checked={preferences.showPageNumber}
                onCheckedChange={(checked) => handleSwitchChange("showPageNumber", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de conteúdo */}
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo e Downloads</CardTitle>
            <CardDescription>
              Gerencie configurações de conteúdo e downloads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="adult-content">Conteúdo adulto</Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar conteúdo marcado para maiores de 18 anos
                </p>
              </div>
              <Switch
                id="adult-content"
                checked={preferences.adultContent}
                onCheckedChange={(checked) => handleSwitchChange("adultContent", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-download">Download automático</Label>
                <p className="text-sm text-muted-foreground">
                  Baixar novos capítulos das novelas que você está lendo
                </p>
              </div>
              <Switch
                id="auto-download"
                checked={preferences.autoDownload}
                onCheckedChange={(checked) => handleSwitchChange("autoDownload", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-4">
          <Link to="/perfil">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button 
            className="bg-novel-lilac-500 hover:bg-novel-lilac-600"
            onClick={savePreferences}
          >
            Salvar Preferências
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
