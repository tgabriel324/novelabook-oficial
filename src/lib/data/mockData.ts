
import { 
  User, 
  Novel, 
  Sale, 
  ReportData, 
  Category, 
  ActivityLog, 
  Stats,
  SystemSetting 
} from './types';

// Mock de usuários
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-08-15T10:30:00Z',
    lastLogin: '2023-10-01T14:22:10Z',
    purchased: 12,
    reads: 45
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    role: 'author',
    status: 'active',
    createdAt: '2023-04-22T08:15:30Z',
    lastLogin: '2023-10-01T09:14:55Z',
    purchased: 3,
    reads: 120
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    role: 'admin',
    status: 'active',
    createdAt: '2022-12-01T11:45:20Z',
    lastLogin: '2023-10-01T18:30:45Z'
  },
  {
    id: '4',
    name: 'Ana Souza',
    email: 'ana.souza@exemplo.com',
    role: 'user',
    status: 'blocked',
    createdAt: '2023-06-10T09:20:15Z',
    lastLogin: '2023-09-15T22:10:30Z',
    purchased: 5,
    reads: 28
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@exemplo.com',
    role: 'author',
    status: 'active',
    createdAt: '2023-01-05T16:40:10Z',
    lastLogin: '2023-09-30T11:45:22Z',
    purchased: 8,
    reads: 76
  },
  {
    id: '6',
    name: 'Juliana Costa',
    email: 'juliana.costa@exemplo.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-07-18T13:25:40Z',
    lastLogin: '2023-09-28T19:20:15Z',
    purchased: 15,
    reads: 92
  },
  {
    id: '7',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    role: 'user',
    status: 'pending',
    createdAt: '2023-09-30T10:10:10Z'
  },
  {
    id: '8',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@exemplo.com',
    role: 'author',
    status: 'active',
    createdAt: '2023-02-28T14:50:30Z',
    lastLogin: '2023-09-29T15:35:40Z',
    purchased: 2,
    reads: 184
  }
];

// Mock de novelas
export const mockNovels: Novel[] = [
  {
    id: '1',
    title: 'A Jornada do Herói',
    author: {
      id: '2',
      name: 'Maria Oliveira'
    },
    cover: '/placeholder.svg',
    status: 'published',
    price: 19.9,
    description: 'Uma épica jornada de autodescoberta e aventura em um mundo fantástico repleto de magia e perigos.',
    categories: ['Fantasia', 'Aventura'],
    tags: ['magia', 'jornada', 'herói', 'épico'],
    rating: 4.7,
    reads: 1250,
    purchases: 350,
    publishedAt: '2023-05-10T09:00:00Z',
    updatedAt: '2023-08-15T14:30:20Z',
    createdAt: '2023-03-22T11:45:30Z',
    chapters: 24
  },
  {
    id: '2',
    title: 'O Mistério da Casa Azul',
    author: {
      id: '5',
      name: 'Carlos Ferreira'
    },
    cover: '/placeholder.svg',
    status: 'published',
    price: 15.5,
    description: 'Um grupo de amigos decide passar o fim de semana em uma mansão isolada, mas estranhos eventos começam a acontecer.',
    categories: ['Mistério', 'Suspense'],
    tags: ['casa assombrada', 'investigação', 'suspense'],
    rating: 4.3,
    reads: 890,
    purchases: 210,
    publishedAt: '2023-06-20T10:15:00Z',
    updatedAt: '2023-09-05T16:20:10Z',
    createdAt: '2023-04-15T08:30:45Z',
    chapters: 18
  },
  {
    id: '3',
    title: 'Amor em Paris',
    author: {
      id: '8',
      name: 'Fernanda Lima'
    },
    cover: '/placeholder.svg',
    status: 'featured',
    price: 12.9,
    description: 'Uma história romântica entre uma estudante brasileira e um chef francês nas ruas encantadoras de Paris.',
    categories: ['Romance', 'Drama'],
    tags: ['paris', 'amor', 'culinária', 'viagem'],
    rating: 4.8,
    reads: 2100,
    purchases: 580,
    publishedAt: '2023-04-05T11:30:00Z',
    updatedAt: '2023-09-12T13:15:30Z',
    createdAt: '2023-02-10T09:20:15Z',
    chapters: 16
  },
  {
    id: '4',
    title: 'Código Enigma',
    author: {
      id: '5',
      name: 'Carlos Ferreira'
    },
    cover: '/placeholder.svg',
    status: 'published',
    price: 22.5,
    description: 'Um programador descobre um código misterioso que pode mudar o futuro da humanidade, mas forças poderosas querem impedi-lo.',
    categories: ['Ficção Científica', 'Thriller'],
    tags: ['tecnologia', 'conspiração', 'futuro', 'hacker'],
    rating: 4.5,
    reads: 750,
    purchases: 180,
    publishedAt: '2023-07-18T08:45:00Z',
    updatedAt: '2023-09-20T10:10:10Z',
    createdAt: '2023-05-30T15:25:40Z',
    chapters: 22
  },
  {
    id: '5',
    title: 'As Memórias de um Gato',
    author: {
      id: '2',
      name: 'Maria Oliveira'
    },
    cover: '/placeholder.svg',
    status: 'draft',
    price: null,
    description: 'A vida vista pelos olhos de um gato que passou por diversos lares ao longo de suas sete vidas.',
    categories: ['Fábula', 'Drama'],
    tags: ['animais', 'perspectiva', 'vida', 'filosófico'],
    reads: 0,
    purchases: 0,
    updatedAt: '2023-09-25T14:50:30Z',
    createdAt: '2023-09-01T11:20:15Z',
    chapters: 5
  },
  {
    id: '6',
    title: 'Império das Sombras',
    author: {
      id: '8',
      name: 'Fernanda Lima'
    },
    cover: '/placeholder.svg',
    status: 'archived',
    price: 18.9,
    description: 'Em um mundo dominado por criaturas das trevas, um grupo de rebeldes luta para restaurar a luz e a esperança.',
    categories: ['Fantasia', 'Horror'],
    tags: ['escuridão', 'batalha', 'monstros', 'resistência'],
    rating: 4.0,
    reads: 1500,
    purchases: 320,
    publishedAt: '2022-11-10T10:00:00Z',
    updatedAt: '2023-08-01T09:15:45Z',
    createdAt: '2022-09-15T08:30:20Z',
    chapters: 30
  }
];

// Mock de categorias
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Fantasia',
    slug: 'fantasia',
    description: 'Histórias ambientadas em mundos fictícios com elementos mágicos e sobrenaturais',
    count: 155
  },
  {
    id: '2',
    name: 'Romance',
    slug: 'romance',
    description: 'Narrativas focadas em relacionamentos amorosos e emocionais',
    count: 210
  },
  {
    id: '3',
    name: 'Ficção Científica',
    slug: 'ficcao-cientifica',
    description: 'Histórias baseadas em conceitos científicos reais ou imaginários',
    count: 98
  },
  {
    id: '4',
    name: 'Mistério',
    slug: 'misterio',
    description: 'Narrativas envolvendo enigmas, crimes e investigações',
    count: 87
  },
  {
    id: '5',
    name: 'Aventura',
    slug: 'aventura',
    description: 'Histórias emocionantes com desafios e perigos para os protagonistas',
    count: 123
  },
  {
    id: '6',
    name: 'Drama',
    slug: 'drama',
    description: 'Narrativas focadas em conflitos emocionais e psicológicos',
    count: 145
  },
  {
    id: '7',
    name: 'Suspense',
    slug: 'suspense',
    description: 'Histórias que mantêm o leitor em estado de tensão e expectativa',
    count: 92
  },
  {
    id: '8',
    name: 'Horror',
    slug: 'horror',
    description: 'Narrativas destinadas a provocar medo e terror no leitor',
    count: 68
  }
];

// Mock de vendas
export const mockSales: Sale[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'João Silva'
    },
    novel: {
      id: '1',
      title: 'A Jornada do Herói'
    },
    price: 19.9,
    date: '2023-09-28T14:20:15Z',
    status: 'completed',
    paymentMethod: 'credit_card'
  },
  {
    id: '2',
    user: {
      id: '4',
      name: 'Ana Souza'
    },
    novel: {
      id: '3',
      title: 'Amor em Paris'
    },
    price: 12.9,
    date: '2023-09-27T10:15:30Z',
    status: 'completed',
    paymentMethod: 'pix'
  },
  {
    id: '3',
    user: {
      id: '6',
      name: 'Juliana Costa'
    },
    novel: {
      id: '2',
      title: 'O Mistério da Casa Azul'
    },
    price: 15.5,
    date: '2023-09-25T16:45:10Z',
    status: 'completed',
    paymentMethod: 'credit_card'
  },
  {
    id: '4',
    user: {
      id: '1',
      name: 'João Silva'
    },
    novel: {
      id: '4',
      title: 'Código Enigma'
    },
    price: 22.5,
    date: '2023-09-23T09:30:45Z',
    status: 'completed',
    paymentMethod: 'boleto'
  },
  {
    id: '5',
    user: {
      id: '4',
      name: 'Ana Souza'
    },
    novel: {
      id: '6',
      title: 'Império das Sombras'
    },
    price: 18.9,
    date: '2023-09-20T11:20:30Z',
    status: 'refunded',
    paymentMethod: 'credit_card'
  },
  {
    id: '6',
    user: {
      id: '5',
      name: 'Carlos Ferreira'
    },
    novel: {
      id: '3',
      title: 'Amor em Paris'
    },
    price: 12.9,
    date: '2023-09-18T15:10:20Z',
    status: 'completed',
    paymentMethod: 'pix'
  },
  {
    id: '7',
    user: {
      id: '6',
      name: 'Juliana Costa'
    },
    novel: {
      id: '1',
      title: 'A Jornada do Herói'
    },
    price: 19.9,
    date: '2023-09-15T08:45:15Z',
    status: 'completed',
    paymentMethod: 'credit_card'
  },
  {
    id: '8',
    user: {
      id: '8',
      name: 'Fernanda Lima'
    },
    novel: {
      id: '4',
      title: 'Código Enigma'
    },
    price: 22.5,
    date: '2023-09-10T13:25:40Z',
    status: 'pending',
    paymentMethod: 'boleto'
  }
];

// Mock de dados para relatórios
export const mockReportData: ReportData[] = [
  { period: 'Jan', sales: 45, revenue: 765.5, users: 120, reads: 1550 },
  { period: 'Fev', sales: 58, revenue: 920.8, users: 145, reads: 1720 },
  { period: 'Mar', sales: 72, revenue: 1250.3, users: 170, reads: 2100 },
  { period: 'Abr', sales: 68, revenue: 1150.5, users: 210, reads: 2450 },
  { period: 'Mai', sales: 85, revenue: 1480.2, users: 260, reads: 3200 },
  { period: 'Jun', sales: 110, revenue: 1950.7, users: 310, reads: 3850 },
  { period: 'Jul', sales: 125, revenue: 2250.3, users: 380, reads: 4500 },
  { period: 'Ago', sales: 145, revenue: 2650.8, users: 450, reads: 5300 },
  { period: 'Set', sales: 168, revenue: 3120.5, users: 520, reads: 6100 },
  { period: 'Out', sales: 192, revenue: 3580.2, users: 590, reads: 6800 },
  { period: 'Nov', sales: 210, revenue: 3950.9, users: 630, reads: 7200 },
  { period: 'Dez', sales: 240, revenue: 4550.6, users: 680, reads: 7800 }
];

// Mock de estatísticas
export const mockStats: Stats = {
  totalUsers: 1234,
  totalNovels: 85,
  monthlyRevenue: 8390,
  conversionRate: 12.5,
  userGrowth: 18.5,
  novelGrowth: 14.2,
  revenueGrowth: 23.0,
  conversionGrowth: 2.1
};

// Mock de logs de atividade
export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    user: {
      id: '3',
      name: 'Pedro Santos'
    },
    action: 'user_blocked',
    entity: {
      type: 'user',
      id: '4',
      name: 'Ana Souza'
    },
    date: '2023-09-20T10:15:20Z',
    details: 'Violação dos termos de uso'
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Maria Oliveira'
    },
    action: 'novel_published',
    entity: {
      type: 'novel',
      id: '1',
      name: 'A Jornada do Herói'
    },
    date: '2023-09-18T14:30:45Z'
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Pedro Santos'
    },
    action: 'system_settings_updated',
    entity: {
      type: 'setting',
      id: '5',
      name: 'Configurações de Pagamento'
    },
    date: '2023-09-15T09:20:10Z'
  },
  {
    id: '4',
    user: {
      id: '5',
      name: 'Carlos Ferreira'
    },
    action: 'novel_updated',
    entity: {
      type: 'novel',
      id: '4',
      name: 'Código Enigma'
    },
    date: '2023-09-14T16:45:30Z'
  },
  {
    id: '5',
    user: {
      id: '3',
      name: 'Pedro Santos'
    },
    action: 'user_role_changed',
    entity: {
      type: 'user',
      id: '8',
      name: 'Fernanda Lima'
    },
    date: '2023-09-10T11:30:15Z',
    details: 'Alterado de usuário para autor'
  }
];

// Mock de configurações do sistema
export const mockSystemSettings: SystemSetting[] = [
  {
    id: '1',
    key: 'site_name',
    value: 'NovelBook',
    category: 'general',
    description: 'Nome do site mostrado no título e cabeçalhos',
    type: 'string'
  },
  {
    id: '2',
    key: 'primary_color',
    value: '#7e69ab',
    category: 'appearance',
    description: 'Cor primária do tema',
    type: 'string'
  },
  {
    id: '3',
    key: 'enable_registration',
    value: 'true',
    category: 'general',
    description: 'Permite que novos usuários se registrem',
    type: 'boolean'
  },
  {
    id: '4',
    key: 'smtp_host',
    value: 'smtp.example.com',
    category: 'email',
    description: 'Servidor SMTP para envio de emails',
    type: 'string'
  },
  {
    id: '5',
    key: 'payment_gateway',
    value: 'stripe',
    category: 'payment',
    description: 'Gateway de pagamento padrão',
    type: 'string'
  },
  {
    id: '6',
    key: 'maintenance_mode',
    value: 'false',
    category: 'general',
    description: 'Ativa o modo de manutenção no site',
    type: 'boolean'
  },
  {
    id: '7',
    key: 'two_factor_auth',
    value: 'optional',
    category: 'security',
    description: 'Configuração de autenticação de dois fatores',
    type: 'string'
  },
  {
    id: '8',
    key: 'featured_novels',
    value: '["1", "3"]',
    category: 'general',
    description: 'IDs das novelas em destaque na página inicial',
    type: 'json'
  }
];
