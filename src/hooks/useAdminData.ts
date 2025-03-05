
import { useState } from 'react';
import { 
  mockUsers, 
  mockNovels, 
  mockSales, 
  mockReportData, 
  mockStats, 
  mockActivityLogs, 
  mockCategories, 
  mockSystemSettings 
} from '@/lib/data/mockData';
import type { 
  User, 
  Novel, 
  Sale, 
  ReportData, 
  ActivityLog, 
  Category, 
  Stats, 
  SystemSetting 
} from '@/lib/data/types';

// Hook para dados de usuários
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: `${users.length + 1}`,
    };
    setUsers([...users, newUser as User]);
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById
  };
};

// Hook para dados de novelas
export const useNovels = () => {
  const [novels, setNovels] = useState<Novel[]>(mockNovels);

  const addNovel = (novel: Omit<Novel, 'id'>) => {
    const newNovel = {
      ...novel,
      id: `${novels.length + 1}`,
    };
    setNovels([...novels, newNovel as Novel]);
    return newNovel;
  };

  const updateNovel = (id: string, novelData: Partial<Novel>) => {
    setNovels(novels.map(novel => 
      novel.id === id ? { ...novel, ...novelData } : novel
    ));
  };

  const deleteNovel = (id: string) => {
    setNovels(novels.filter(novel => novel.id !== id));
  };

  const getNovelById = (id: string) => {
    return novels.find(novel => novel.id === id);
  };

  return {
    novels,
    addNovel,
    updateNovel,
    deleteNovel,
    getNovelById
  };
};

// Hook para dados de categorias
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: `${categories.length + 1}`,
    };
    setCategories([...categories, newCategory as Category]);
    return newCategory;
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, ...categoryData } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};

// Hook para dados de vendas
export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>(mockSales);

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = {
      ...sale,
      id: `${sales.length + 1}`,
    };
    setSales([...sales, newSale as Sale]);
    return newSale;
  };

  const updateSaleStatus = (id: string, status: Sale['status']) => {
    setSales(sales.map(sale => 
      sale.id === id ? { ...sale, status } : sale
    ));
  };

  return {
    sales,
    addSale,
    updateSaleStatus
  };
};

// Hook para dados de relatórios
export const useReports = () => {
  const [reportData] = useState<ReportData[]>(mockReportData);
  const [stats] = useState<Stats>(mockStats);

  return {
    reportData,
    stats
  };
};

// Hook para logs de atividade
export const useActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLogs);

  const addLog = (log: Omit<ActivityLog, 'id' | 'date'>) => {
    const newLog = {
      ...log,
      id: `${logs.length + 1}`,
      date: new Date().toISOString(),
    };
    setLogs([newLog as ActivityLog, ...logs]);
    return newLog;
  };

  return {
    logs,
    addLog
  };
};

// Hook para configurações do sistema
export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>(mockSystemSettings);

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const getSetting = (key: string) => {
    return settings.find(setting => setting.key === key);
  };

  const getSettingsByCategory = (category: SystemSetting['category']) => {
    return settings.filter(setting => setting.category === category);
  };

  return {
    settings,
    updateSetting,
    getSetting,
    getSettingsByCategory
  };
};
