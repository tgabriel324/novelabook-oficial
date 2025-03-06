
import { Novel } from "@/lib/data/types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";

interface NovelListProps {
  novels: Novel[];
  isLoading: boolean;
  onEdit: (novel: Novel) => void;
  onDelete: (id: string) => void;
}

export function NovelList({ novels, isLoading, onEdit, onDelete }: NovelListProps) {
  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando novelas...</div>;
  }

  if (novels.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Nenhuma novela encontrada</p>
      </div>
    );
  }

  const getStatusBadge = (status: Novel['status']) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Publicado</Badge>;
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'featured':
        return <Badge variant="secondary" className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white">Destaque</Badge>;
      case 'archived':
        return <Badge variant="destructive">Arquivado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Categorias</TableHead>
            <TableHead>Publicado em</TableHead>
            <TableHead>Leituras</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {novels.map(novel => (
            <TableRow key={novel.id}>
              <TableCell className="font-medium">{novel.title}</TableCell>
              <TableCell>{novel.author.name}</TableCell>
              <TableCell>{getStatusBadge(novel.status)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {novel.categories.slice(0, 2).map(category => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {novel.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{novel.categories.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(novel.publishedAt)}</TableCell>
              <TableCell>{novel.reads}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onEdit(novel)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onDelete(novel.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    asChild
                  >
                    <a href={`/livro/${novel.id}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
