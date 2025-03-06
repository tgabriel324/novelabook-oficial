
import { useState, useEffect } from "react";
import { Novel, Category } from "@/lib/data/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  MultiSelect, 
  MultiSelectItem 
} from "@/components/admin/content/MultiSelect";

interface NovelFormDialogProps {
  novel: Novel | null;
  categories: Category[];
  onSubmit: (data: Partial<Novel>) => void;
  onCancel: () => void;
}

export function NovelFormDialog({ 
  novel, 
  categories, 
  onSubmit, 
  onCancel 
}: NovelFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Novel>>({
    title: '',
    description: '',
    status: 'draft',
    categories: [],
    tags: [],
    price: 0,
  });

  useEffect(() => {
    if (novel) {
      setFormData({
        title: novel.title,
        description: novel.description,
        status: novel.status,
        categories: novel.categories,
        tags: novel.tags,
        price: novel.price || 0
      });
    }
  }, [novel]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {novel ? `Editar Novela: ${novel.title}` : 'Nova Novela'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={formData.title || ''} 
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="featured">Destaque</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description"
              rows={5}
              value={formData.description || ''} 
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">R$</span>
                <Input 
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-10"
                  value={formData.price || ''} 
                  onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                />
              </div>
              <p className="text-xs text-muted-foreground">Deixe 0 para gratuito</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cover">Imagem de Capa</Label>
              <Input 
                id="cover" 
                type="file" 
                accept="image/*"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categorias</Label>
            <MultiSelect
              placeholder="Selecione as categorias"
              value={formData.categories || []}
              onChange={(value) => handleChange('categories', value)}
            >
              {categories.map((category) => (
                <MultiSelectItem key={category.id} value={category.name}>
                  {category.name}
                </MultiSelectItem>
              ))}
            </MultiSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input 
              id="tags" 
              placeholder="Separe as tags por vírgula" 
              value={formData.tags ? formData.tags.join(', ') : ''} 
              onChange={(e) => {
                const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                handleChange('tags', tagsArray);
              }}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {novel ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
