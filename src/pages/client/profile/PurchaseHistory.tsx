
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";

type Purchase = {
  id: string;
  date: string;
  title: string;
  author: string;
  price: number;
  status: "completed" | "refunded" | "pending";
  receiptAvailable: boolean;
};

const mockPurchases: Purchase[] = [
  {
    id: "PED-001234",
    date: "12/04/2023",
    title: "A Filha do Imperador",
    author: "Ana Lima",
    price: 19.90,
    status: "completed",
    receiptAvailable: true
  },
  {
    id: "PED-001235",
    date: "22/04/2023",
    title: "O Príncipe das Sombras",
    author: "Carlos Mendes",
    price: 24.90,
    status: "completed",
    receiptAvailable: true
  },
  {
    id: "PED-001240",
    date: "15/05/2023",
    title: "Renascendo em Outro Mundo",
    author: "Luciana Fraga",
    price: 29.90,
    status: "pending",
    receiptAvailable: false
  },
  {
    id: "PED-001245",
    date: "01/06/2023",
    title: "O Último Guardião",
    author: "Roberto Silva",
    price: 15.90,
    status: "refunded",
    receiptAvailable: true
  }
];

const PurchaseHistory = () => {
  const getStatusBadge = (status: Purchase["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Processando</Badge>;
      case "refunded":
        return <Badge className="bg-red-500">Reembolsado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container py-6 pb-20 md:pb-6">
      <div className="mb-6 flex items-center">
        <Link to="/perfil" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Histórico de Compras</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Suas Compras</CardTitle>
              <CardDescription>
                Visualize todas as suas transações de compra de novelas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtrar por:</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="pending">Processando</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.title}</TableCell>
                    <TableCell>{purchase.author}</TableCell>
                    <TableCell>R$ {purchase.price.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {purchase.receiptAvailable && (
                          <Button variant="outline" size="sm">
                            <FileText size={14} className="mr-1" />
                            Nota
                          </Button>
                        )}
                        {purchase.status === "completed" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-novel-lilac-500 border-novel-lilac-500 hover:bg-novel-lilac-50"
                          >
                            <Download size={14} className="mr-1" />
                            Baixar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {mockPurchases.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-muted-foreground">Você ainda não realizou nenhuma compra</p>
              <Button className="mt-4 bg-novel-lilac-500 hover:bg-novel-lilac-600">
                <Link to="/loja">Explorar a Loja</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseHistory;
