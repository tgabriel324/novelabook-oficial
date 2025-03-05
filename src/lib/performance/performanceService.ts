
/**
 * Serviço para otimização de performance da aplicação
 */

// Cache para armazenar conteúdo pré-carregado
const preloadCache = new Map<string, any>();

/**
 * Pré-carrega conteúdo e o armazena em cache
 * @param key Identificador único do conteúdo
 * @param dataFetcher Função que busca os dados
 */
export const preloadContent = async (key: string, dataFetcher: () => Promise<any>): Promise<void> => {
  try {
    if (!preloadCache.has(key)) {
      const data = await dataFetcher();
      preloadCache.set(key, {
        data,
        timestamp: Date.now()
      });
      console.log(`Conteúdo pré-carregado: ${key}`);
    }
  } catch (error) {
    console.error(`Erro ao pré-carregar conteúdo para ${key}:`, error);
  }
};

/**
 * Recupera conteúdo do cache
 * @param key Identificador único do conteúdo
 * @param maxAge Idade máxima do cache em milissegundos (padrão: 5 minutos)
 * @returns O conteúdo armazenado em cache ou null se não estiver disponível
 */
export const getPreloadedContent = (key: string, maxAge = 300000): any | null => {
  const cached = preloadCache.get(key);
  
  if (!cached) return null;
  
  // Verifica se o cache está expirado
  if (Date.now() - cached.timestamp > maxAge) {
    preloadCache.delete(key);
    return null;
  }
  
  return cached.data;
};

/**
 * Registra o tempo de carregamento de uma operação específica
 * @param label Nome da operação
 * @param startTime Timestamp de início (obtido com performance.now())
 */
export const logPerformance = (label: string, startTime: number): void => {
  const duration = performance.now() - startTime;
  console.log(`Tempo de ${label}: ${duration.toFixed(2)}ms`);
  
  // Opcionalmente, enviar métricas para um serviço de analytics
  if (duration > 500) {
    console.warn(`Desempenho lento detectado em ${label}`);
  }
};

/**
 * Otimiza o carregamento de imagens com lazy loading e tamanhos adequados
 * @param imageSrc URL da imagem
 * @param width Largura desejada
 * @param height Altura desejada
 * @returns URL otimizada para a imagem
 */
export const optimizeImageUrl = (imageSrc: string, width?: number, height?: number): string => {
  // Se a URL já for de um serviço de otimização de imagens, retorna a URL original
  if (imageSrc.includes('imagecdn') || imageSrc.includes('placeholder.com')) {
    return imageSrc;
  }
  
  // Simplificação: na prática, isso seria integrado a um CDN ou serviço de redimensionamento
  let optimizedUrl = imageSrc;
  
  // Adiciona parâmetros de dimensão se fornecidos
  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    
    optimizedUrl += (optimizedUrl.includes('?') ? '&' : '?') + params.toString();
  }
  
  return optimizedUrl;
};

/**
 * Implementa uma técnica de debounce para limitar a frequência de execução de funções
 * @param func Função a ser executada
 * @param wait Tempo de espera em milissegundos
 * @returns Função com debounce aplicado
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
};

/**
 * Implementa uma técnica de throttle para limitar a frequência de execução de funções
 * @param func Função a ser executada
 * @param limit Limite de tempo em milissegundos
 * @returns Função com throttle aplicado
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Detecta se a conexão do usuário é lenta
 * @returns Promise que resolve para true se a conexão for lenta
 */
export const isSlowConnection = async (): Promise<boolean> => {
  // Verificação de API de navegador
  if ('connection' in navigator && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.saveData) return true;
    if (conn.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return true;
  }
  
  // Teste de velocidade simples
  try {
    const startTime = performance.now();
    await fetch('https://www.google.com/favicon.ico', { 
      mode: 'no-cors',
      cache: 'no-store'
    });
    const duration = performance.now() - startTime;
    return duration > 1000; // Considera lenta se demorar mais de 1 segundo
  } catch (e) {
    // Se houver erro na conexão, assume que é lenta
    return true;
  }
};

/**
 * Monitora o uso de memória da aplicação
 * @returns Informações sobre o uso de memória ou null se não disponível
 */
export const getMemoryUsage = (): { usedJSHeapSize?: number, totalJSHeapSize?: number, jsHeapSizeLimit?: number } | null => {
  if ('memory' in performance) {
    return (performance as any).memory;
  }
  return null;
};
