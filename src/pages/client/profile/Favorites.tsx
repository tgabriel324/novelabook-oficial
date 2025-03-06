
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Heart, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type FavoriteBook = {
  id: string;
  title: string;
  author: string;
  cover: string;
  dateAdded: string;
};

const mockFavorites: FavoriteBook[] = [
  { 
    id: "1", 
    title: "A Filha do Imperador", 
    author: "Ana Lima", 
    cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", 
    dateAdded: "12/04/2023" 
  },
  { 
    id: "2", 
    title: "O Príncipe das Sombras", 
    author: "Carlos Mendes", 
    cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", 
    dateAdded: "22/04/2023" 
  },
  { 
    id: "3", 
    title: "Renascendo em Outro Mundo", 
    author: "Luciana Fraga", 
    cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+3", 
    dateAdded: "15/05/2023" 
  },
  { 
    id: "4", 
    title: "O Último Guardião", 
    author: "Roberto Silva", 
    cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+4", 
    dateAdded: "01/06/2023" 
  }
];

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteBook[]>(mockFavorites);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFavorites = favorites.filter(
    (book) => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(book => book.id !== id));
    toast.success("Livro removido dos favoritos");
  };

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex items-center">
        <Link to="/perfil" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Meus Favoritos</h1>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar favoritos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart size={16} className="text-novel-lilac-400" />
          <span>{favorites.length} favoritos</span>
        </div>
      </div>

      {filteredFavorites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFavorites.map((book) => (
            <Card key={book.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-[2/3]">
                <img 
                  src={book.cover}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg leading-tight">{book.title}</h3>
                  <p className="text-white/80 text-sm">{book.author}</p>
                </div>
              </div>
              <CardContent className="p-4 grid gap-3 flex-1">
                <div className="text-sm text-muted-foreground">
                  Adicionado em: {book.dateAdded}
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-novel-lilac-500 text-white hover:bg-novel-lilac-600 hover:text-white"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ler
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="text-red-500 hover:text-white hover:bg-red-500"
                    onClick={() => removeFavorite(book.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Nenhum favorito encontrado</h2>
          <p className="mt-1 text-muted-foreground">
            {searchQuery ? "Nenhum resultado para sua busca" : "Você ainda não adicionou nenhum livro aos favoritos"}
          </p>
          <Button className="mt-6 bg-novel-lilac-500 hover:bg-novel-lilac-600">
            <Link to="/">Explorar Livros</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
