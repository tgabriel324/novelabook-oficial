
// Tipos base para a aplicação administrativa

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'author' | 'admin';
  avatar?: string;
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
  lastLogin?: string;
  purchased?: number;
  reads?: number;
}

export interface Novel {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  cover: string;
  status: 'draft' | 'published' | 'featured' | 'archived';
  price: number | null;
  description: string;
  categories: string[];
  tags: string[];
  rating?: number;
  reads: number;
  purchases: number;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  chapters?: number;
  // Adicionar as propriedades que faltam
  reviewCount?: number;
  releaseDate?: string;
  totalChapters?: number;
  completedChapters?: number;
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  order: number;
  content: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  wordCount: number;
  reads: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface Sale {
  id: string;
  user: {
    id: string;
    name: string;
  };
  novel: {
    id: string;
    title: string;
  };
  price: number;
  date: string;
  status: 'completed' | 'refunded' | 'pending';
  paymentMethod: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: 'general' | 'appearance' | 'email' | 'payment' | 'security';
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
}

export interface ReportData {
  period: string;
  sales: number;
  revenue: number;
  users: number;
  reads: number;
}

export interface Stats {
  totalUsers: number;
  totalNovels: number;
  monthlyRevenue: number;
  conversionRate: number;
  userGrowth: number;
  novelGrowth: number;
  revenueGrowth: number;
  conversionGrowth: number;
}

export interface ActivityLog {
  id: string;
  user: {
    id: string;
    name: string;
  };
  action: string;
  entity: {
    type: 'user' | 'novel' | 'chapter' | 'setting' | 'system';
    id: string;
    name: string;
  };
  date: string;
  details?: string;
}
