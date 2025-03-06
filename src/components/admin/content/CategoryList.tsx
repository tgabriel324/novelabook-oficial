
import { useState } from "react";
import { Category } from "@/lib/data/types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onAdd?: (category: Partial<Category>) => void;
  onUpdate?: (id: string, category: Partial<Category>) => void;
  onDelete?: (id: string) => void;
}

export function CategoryList({ 
  categories, 
  isLoading,
  onAdd,
  onUpdate,
  onDelete
}: CategoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: ''
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando categorias...</div>;
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description
    });
    setEditingId(category.id);
    setNewCategory(false);
  };

  const handleSave = () => {
    if (newCategory && onAdd) {
      onAdd(formData);
    } else if (editingId && onUpdate) {
      onUpdate(editingId, formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewCategory(false);
    setFormData({
      name: '',
      slug: '',
      description: ''
    });
  };

  const handleDelete = (id: string) => {
    if (onDelete && window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      onDelete(id);
    }
  };

  const handleNewCategory = () => {
    resetForm();
    setNewCategory(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleNewCategory} disabled={!onAdd || newCategory || !!editingId}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Novelas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newCategory && (
              <TableRow>
                <TableCell>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="Nome da categoria"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    placeholder="slug-da-categoria"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Descrição (opcional)"
                  />
                </TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={handleSave} disabled={!formData.name || !formData.slug}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={resetForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>
                  {editingId === category.id ? (
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === category.id ? (
                    <Input 
                      value={formData.slug} 
                      onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    />
                  ) : (
                    category.slug
                  )}
                </TableCell>
                <TableCell>
                  {editingId === category.id ? (
                    <Input 
                      value={formData.description || ''} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                  ) : (
                    category.description || '—'
                  )}
                </TableCell>
                <TableCell>{category.count}</TableCell>
                <TableCell>
                  {editingId === category.id ? (
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={handleSave} disabled={!formData.name || !formData.slug}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={resetForm}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleEdit(category)}
                        disabled={!!editingId || newCategory || !onUpdate}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(category.id)}
                        disabled={!!editingId || newCategory || !onDelete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {categories.length === 0 && !newCategory && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <span className="text-muted-foreground">Nenhuma categoria encontrada</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
