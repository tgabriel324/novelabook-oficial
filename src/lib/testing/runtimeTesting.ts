
/**
 * Sistema de testes automatizados que podem ser executados em ambiente de produção
 * 
 * Estas funções permitem criar testes que verificam se componentes críticos estão
 * funcionando corretamente mesmo em produção, sem interferir na experiência do usuário.
 */

type TestResult = {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
};

type TestFunction = () => Promise<void>;

const testResults: TestResult[] = [];
let isTestingEnabled = false;

/**
 * Habilita ou desabilita o sistema de testes em runtime
 */
export const setTestingEnabled = (enabled: boolean): void => {
  isTestingEnabled = enabled;
  console.log(`Testes automatizados em runtime ${enabled ? 'ativados' : 'desativados'}`);
};

/**
 * Executa um teste específico
 * @param name Nome do teste
 * @param testFn Função de teste
 * @returns Resultado do teste
 */
export const runTest = async (name: string, testFn: TestFunction): Promise<TestResult> => {
  if (!isTestingEnabled) {
    console.warn('Sistema de testes desativado. Use setTestingEnabled(true) para ativar.');
    return { name, success: false, error: 'Testes desativados', duration: 0 };
  }
  
  const startTime = performance.now();
  let success = false;
  let error = undefined;
  
  try {
    await testFn();
    success = true;
  } catch (e) {
    success = false;
    error = e instanceof Error ? e.message : 'Erro desconhecido';
    console.error(`Teste "${name}" falhou:`, e);
  }
  
  const duration = performance.now() - startTime;
  
  const result = {
    name,
    success,
    error,
    duration
  };
  
  testResults.push(result);
  
  console.log(`Teste "${name}": ${success ? 'PASSOU' : 'FALHOU'} (${duration.toFixed(2)}ms)`);
  
  return result;
};

/**
 * Obtém todos os resultados de testes executados
 */
export const getTestResults = (): TestResult[] => {
  return [...testResults];
};

/**
 * Limpa todos os resultados de testes
 */
export const clearTestResults = (): void => {
  testResults.length = 0;
};

/**
 * Gera um relatório de testes
 */
export const generateTestReport = (): { 
  total: number;
  passed: number;
  failed: number;
  averageDuration: number;
  results: TestResult[];
} => {
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.length - passed;
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  const averageDuration = testResults.length ? totalDuration / testResults.length : 0;
  
  return {
    total: testResults.length,
    passed,
    failed,
    averageDuration,
    results: [...testResults]
  };
};

/**
 * Verifica se um elemento está presente no DOM
 * @param selector Seletor CSS do elemento
 */
export const expectElementToExist = (selector: string): void => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Elemento não encontrado: ${selector}`);
  }
};

/**
 * Verifica se um elemento contém um texto específico
 * @param selector Seletor CSS do elemento
 * @param text Texto que deve estar contido no elemento
 */
export const expectElementToContainText = (selector: string, text: string): void => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Elemento não encontrado: ${selector}`);
  }
  
  if (!element.textContent || !element.textContent.includes(text)) {
    throw new Error(`Elemento ${selector} não contém o texto: ${text}`);
  }
};

/**
 * Verifica se uma API está respondendo corretamente
 * @param url URL da API
 * @param expectedStatus Status HTTP esperado
 */
export const expectApiToRespond = async (url: string, expectedStatus = 200): Promise<void> => {
  try {
    const response = await fetch(url, { mode: 'no-cors' });
    if (response.status !== expectedStatus) {
      throw new Error(`API ${url} respondeu com status ${response.status} (esperado: ${expectedStatus})`);
    }
  } catch (e) {
    throw new Error(`Falha ao acessar API ${url}: ${e instanceof Error ? e.message : 'Erro desconhecido'}`);
  }
};

/**
 * Define testes para componentes críticos da aplicação
 */
export const setupCriticalComponentTests = (): void => {
  // Esses testes podem ser executados periodicamente na aplicação em produção
  
  // Exemplo de teste para o carregamento do componente de página
  const testPageComponent = async () => {
    expectElementToExist('main');
    expectElementToExist('header');
    expectElementToExist('footer');
  };
  
  // Exemplo de teste para verificar se o sistema de autenticação está funcionando
  const testAuthSystem = async () => {
    // Aqui seria uma verificação se os tokens estão presentes, etc.
    const hasLocalStorageToken = !!localStorage.getItem('authToken');
    if (!hasLocalStorageToken) {
      // Se não estiver logado, verificamos se o componente de login é exibido
      expectElementToExist('form[data-test="login-form"]');
    } else {
      // Se estiver logado, verificamos se o perfil do usuário está acessível
      expectElementToExist('[data-test="user-profile"]');
    }
  };
  
  // Registra os testes
  runTest('Componentes de página', testPageComponent);
  runTest('Sistema de autenticação', testAuthSystem);
};
