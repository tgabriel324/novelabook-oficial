
import { Card, CardContent } from "@/components/ui/card";

const Library = () => {
  const myNovels = [
    { id: 1, title: "A Filha do Imperador", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+1", progress: 45 },
    { id: 2, title: "O Príncipe das Sombras", cover: "https://via.placeholder.com/300x450/9b87f5/ffffff?text=Novela+2", progress: 78 },
  ];

  return (
    <div className="container py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Minha Biblioteca</h1>
        <p className="text-muted-foreground">Continue suas leituras</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {myNovels.map((novel) => (
          <Card key={novel.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="font-semibold">{novel.title}</h3>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-novel-gold-400"
                      style={{ width: `${novel.progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-white/80">{novel.progress}% lido</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Library;
