
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'author';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  purchaseCount: number;
}

export interface Novel {
  id: string;
  title: string;
  cover: string;
  author: string;
  authorId: string;
  description: string;
  price: number;
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  categories: string[];
  language: string;
  length: 'curta' | 'média' | 'longa';
  rating: number;
  reviewCount: number;
  chapterCount: number;
  wordCount: number;
  salesCount: number;
  featuredUntil?: string;
}

export interface Sale {
  id: string;
  userId: string;
  userName: string;
  novelId: string;
  novelTitle: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'refunded' | 'pending';
  date: string;
}

export interface ReportData {
  period: string;
  sales: number;
  revenue: number;
  users: number;
  novels: number;
}
