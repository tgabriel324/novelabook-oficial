
/**
 * Sistema de monitoramento e correção de erros em tempo de execução
 */

type ErrorRecord = {
  message: string;
  stack?: string;
  componentInfo?: string;
  timestamp: number;
  url: string;
  count: number;
  lastOccurrence: number;
  fixed: boolean;
  fixAttempted: boolean;
};

type ErrorFixStrategy = {
  pattern: RegExp;
  fix: () => void;
  description: string;
};

// Banco de dados em memória para erros
const errorDatabase: Map<string, ErrorRecord> = new Map();

// Estratégias para correção automática de erros conhecidos
const fixStrategies: ErrorFixStrategy[] = [
  {
    pattern: /TypeError: Cannot read property .* of (undefined|null)/,
    fix: () => {
      // Tenta recarregar componentes com problemas
      try {
        const appRoot = document.getElementById('root');
        if (appRoot) {
          const brokenComponents = Array.from(
            document.querySelectorAll('[data-error="true"]')
          );
          
          if (brokenComponents.length > 0) {
            brokenComponents.forEach(el => {
              // Tenta recarregar o componente
              const clone = el.cloneNode(true);
              el.parentNode?.replaceChild(clone, el);
            });
            console.log('Tentativa de correção: componentes problemáticos recarregados');
          }
        }
      } catch (e) {
        console.error('Falha na estratégia de correção:', e);
      }
    },
    description: 'Recarrega componentes quebrados devido a referências nulas'
  },
  {
    pattern: /Failed to fetch|NetworkError|NETWORK_ERR/,
    fix: () => {
      // Problema de rede - tenta novamente com backoff
      const pendingRequests = window._pendingRequests || [];
      if (pendingRequests.length > 0) {
        const now = Date.now();
        pendingRequests.forEach((req: any) => {
          if (now - req.timestamp > req.backoff) {
            console.log('Tentativa de correção: repetindo requisição com falha');
            setTimeout(() => {
              // Repetir a requisição
              fetch(req.url, req.options)
                .then(req.resolve)
                .catch((e: Error) => {
                  req.backoff *= 2; // Exponential backoff
                  req.errors.push(e);
                  if (req.retries < 3) {
                    req.retries += 1;
                    window._pendingRequests.push(req);
                  } else {
                    req.reject(new Error('Máximo de tentativas atingido'));
                  }
                });
            }, 1000);
          }
        });
      }
    },
    description: 'Repete requisições de rede com falha usando exponential backoff'
  },
  {
    pattern: /Loading chunk \d+ failed/,
    fix: () => {
      // Falha no carregamento de chunk - recarrega a página
      console.log('Tentativa de correção: recarregando chunks JS');
      window.location.reload();
    },
    description: 'Recarrega a página após falha no carregamento de chunk'
  }
];

// Inicializa as estruturas globais necessárias
declare global {
  interface Window {
    _pendingRequests: any[];
    _errorMonitoring: {
      enabled: boolean;
      autofix: boolean;
    };
  }
}

// Inicializa o objeto global
window._pendingRequests = window._pendingRequests || [];
window._errorMonitoring = window._errorMonitoring || {
  enabled: true,
  autofix: true
};

/**
 * Registra um erro no sistema de monitoramento
 * @param error Objeto de erro
 * @param componentInfo Informações opcionais sobre o componente
 */
export const recordError = (error: Error, componentInfo?: string): string => {
  const errorId = `${error.name}:${error.message}`;
  const url = window.location.href;
  const now = Date.now();
  
  if (errorDatabase.has(errorId)) {
    // Atualiza registro existente
    const record = errorDatabase.get(errorId)!;
    record.count += 1;
    record.lastOccurrence = now;
    if (componentInfo && !record.componentInfo) {
      record.componentInfo = componentInfo;
    }
  } else {
    // Cria novo registro
    errorDatabase.set(errorId, {
      message: error.message,
      stack: error.stack,
      componentInfo,
      timestamp: now,
      url,
      count: 1,
      lastOccurrence: now,
      fixed: false,
      fixAttempted: false
    });
  }
  
  console.error(`Erro registrado [${errorId}]:`, error);
  
  // Aplica estratégia de correção se possível
  if (window._errorMonitoring.autofix) {
    attemptErrorFix(errorId);
  }
  
  return errorId;
};

/**
 * Tenta aplicar uma correção para um erro conhecido
 * @param errorId ID do erro
 * @returns true se uma correção foi tentada
 */
export const attemptErrorFix = (errorId: string): boolean => {
  if (!errorDatabase.has(errorId)) return false;
  
  const errorRecord = errorDatabase.get(errorId)!;
  if (errorRecord.fixAttempted) return false;
  
  // Marca que tentamos a correção
  errorRecord.fixAttempted = true;
  
  // Verifica se temos uma estratégia para este erro
  for (const strategy of fixStrategies) {
    if (strategy.pattern.test(errorRecord.message)) {
      try {
        console.log(`Tentando aplicar correção para erro: ${errorId}`);
        console.log(`Estratégia: ${strategy.description}`);
        
        strategy.fix();
        
        // Marca como corrigido (otimisticamente)
        errorRecord.fixed = true;
        return true;
      } catch (e) {
        console.error('Falha ao aplicar correção:', e);
        return false;
      }
    }
  }
  
  return false;
};

/**
 * Obtém estatísticas sobre erros registrados
 */
export const getErrorStats = (): {
  total: number;
  uniqueErrors: number;
  fixAttempted: number;
  fixed: number;
  recent: number;
} => {
  const records = Array.from(errorDatabase.values());
  const now = Date.now();
  const recentThreshold = now - 3600000; // última hora
  
  return {
    total: records.reduce((sum, record) => sum + record.count, 0),
    uniqueErrors: records.length,
    fixAttempted: records.filter(r => r.fixAttempted).length,
    fixed: records.filter(r => r.fixed).length,
    recent: records.filter(r => r.lastOccurrence > recentThreshold).length
  };
};

/**
 * Configura monitoramento global de erros não tratados
 */
export const setupGlobalErrorMonitoring = (): void => {
  if (!window._errorMonitoring.enabled) return;
  
  // Captura erros não tratados
  window.addEventListener('error', (event) => {
    recordError(event.error || new Error(event.message), 'window.onerror');
  });
  
  // Captura rejeições de promessas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    recordError(error, 'unhandledRejection');
  });
  
  console.log('Monitoramento global de erros ativado');
};

/**
 * Habilita ou desabilita o monitoramento automático de erros
 */
export const setErrorMonitoringEnabled = (enabled: boolean): void => {
  window._errorMonitoring.enabled = enabled;
  console.log(`Monitoramento de erros ${enabled ? 'ativado' : 'desativado'}`);
};

/**
 * Habilita ou desabilita a correção automática de erros
 */
export const setAutoFixEnabled = (enabled: boolean): void => {
  window._errorMonitoring.autofix = enabled;
  console.log(`Correção automática de erros ${enabled ? 'ativada' : 'desativada'}`);
};

/**
 * Limpa o histórico de erros
 */
export const clearErrorHistory = (): void => {
  errorDatabase.clear();
  console.log('Histórico de erros limpo');
};

/**
 * Retorna detalhes de todos os erros registrados
 */
export const getAllErrors = (): ErrorRecord[] => {
  return Array.from(errorDatabase.values());
};
