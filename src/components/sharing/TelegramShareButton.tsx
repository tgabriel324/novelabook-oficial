
import { MessageCircle } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";

export interface TelegramShareProps extends ButtonProps {
  text: string;
  url?: string;
  onShareComplete?: () => void;
}

/**
 * Um botão para compartilhar conteúdo no Telegram
 */
const TelegramShareButton = ({
  text,
  url = "https://novelbook.app",
  onShareComplete,
  className,
  children,
  variant = "telegram", // Default to the telegram variant
  ...props
}: TelegramShareProps) => {
  const handleShare = () => {
    // Constrói a URL do Telegram para compartilhamento
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
    
    // Abre em uma nova janela/aba
    window.open(telegramUrl, "_blank");
    
    // Notifica o usuário
    toast.success("Compartilhando no Telegram");
    
    // Executa callback opcional após o compartilhamento
    if (onShareComplete) {
      onShareComplete();
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      className={className}
      {...props}
    >
      <MessageCircle size={18} className="mr-2" />
      {children || "Compartilhar no Telegram"}
    </Button>
  );
};

export default TelegramShareButton;
