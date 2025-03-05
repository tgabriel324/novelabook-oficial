
/**
 * Sistema de detecção de dispositivos e recursos do navegador
 * para garantir compatibilidade da aplicação em diferentes ambientes
 */

type DeviceInfo = {
  type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  screenSize: {
    width: number;
    height: number;
  };
  touchEnabled: boolean;
  pixelRatio: number;
  lowEndDevice: boolean;
};

type FeatureSupport = {
  webp: boolean;
  webgl: boolean;
  webgl2: boolean;
  indexedDb: boolean;
  localStorage: boolean;
  serviceWorker: boolean;
  webShare: boolean;
  payment: boolean;
  notification: boolean;
  geolocation: boolean;
  imageWebp: boolean;
  videoWebm: boolean;
  audioMp3: boolean;
  customElements: boolean;
};

/**
 * Detecta informações sobre o dispositivo e navegador do usuário
 */
export const detectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  let browser = 'Desconhecido';
  let browserVersion = 'Desconhecido';
  let os = 'Desconhecido';
  let osVersion = 'Desconhecido';
  
  // Detectar navegador e versão
  if (userAgent.indexOf('Chrome') > -1) {
    browser = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)![1];
  } else if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)![1];
  } else if (userAgent.indexOf('Safari') > -1) {
    browser = 'Safari';
    browserVersion = userAgent.match(/Version\/([0-9.]+)/)![1];
  } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1) {
    browser = 'Edge';
    browserVersion = userAgent.match(/Edg(?:e)?\/([0-9.]+)/)![1];
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browser = 'Internet Explorer';
    browserVersion = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)![1];
  }
  
  // Detectar sistema operacional e versão
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
    const match = userAgent.match(/Windows NT ([0-9.]+)/);
    if (match) {
      const ntVersion = match[1];
      switch (ntVersion) {
        case '10.0': osVersion = '10'; break;
        case '6.3': osVersion = '8.1'; break;
        case '6.2': osVersion = '8'; break;
        case '6.1': osVersion = '7'; break;
        default: osVersion = ntVersion;
      }
    }
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'macOS';
    const match = userAgent.match(/Mac OS X ([0-9_]+)/);
    if (match) {
      osVersion = match[1].replace(/_/g, '.');
    }
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android';
    const match = userAgent.match(/Android ([0-9.]+)/);
    if (match) {
      osVersion = match[1];
    }
  } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    os = 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    if (match) {
      osVersion = match[1].replace(/_/g, '.');
    }
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
  }
  
  // Detectar tipo de dispositivo
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android|Touch/i.test(userAgent) && window.innerWidth > 640;
  const type = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  
  // Detectar capacidades da tela
  const screenSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  // Detect baixo desempenho
  const isLowEndDevice = () => {
    // Aproximação baseada em heurísticas simples
    const memoryLimit = 2; // GB
    const memory = (navigator as any).deviceMemory;
    const cores = (navigator as any).hardwareConcurrency;
    
    if (memory && cores) {
      return memory < memoryLimit || cores <= 4;
    }
    
    // Se não for possível detectar precisamente
    return /Android [1-6]/.test(userAgent) || 
           /Android.*Mobile/.test(userAgent) || 
           /iPhone OS [1-9]_/.test(userAgent) ||
           /low|slow/.test((navigator as any).connection?.effectiveType || '');
  };
  
  return {
    type,
    browser,
    browserVersion,
    os,
    osVersion,
    screenSize,
    touchEnabled: 'ontouchstart' in window,
    pixelRatio: window.devicePixelRatio || 1,
    lowEndDevice: isLowEndDevice()
  };
};

/**
 * Detecta o suporte a recursos modernos do navegador
 */
export const detectFeatureSupport = (): FeatureSupport => {
  // Verificar suporte a WebP
  const hasWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };
  
  // Verificar suporte a WebGL
  const hasWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };
  
  // Verificar suporte a WebGL2
  const hasWebGL2 = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    } catch (e) {
      return false;
    }
  };
  
  return {
    webp: hasWebP(),
    webgl: hasWebGL(),
    webgl2: hasWebGL2(),
    indexedDb: 'indexedDB' in window,
    localStorage: 'localStorage' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webShare: 'share' in navigator,
    payment: 'PaymentRequest' in window,
    notification: 'Notification' in window,
    geolocation: 'geolocation' in navigator,
    imageWebp: hasWebP(),
    videoWebm: !!document.createElement('video').canPlayType('video/webm; codecs="vp8, vorbis"'),
    audioMp3: !!document.createElement('audio').canPlayType('audio/mpeg'),
    customElements: 'customElements' in window
  };
};

/**
 * Gera dados detalhados para diagnóstico de compatibilidade
 */
export const generateCompatibilityReport = (): {
  device: DeviceInfo;
  features: FeatureSupport;
  timestamp: string;
} => {
  return {
    device: detectDevice(),
    features: detectFeatureSupport(),
    timestamp: new Date().toISOString()
  };
};

/**
 * Verifica se o dispositivo está em modo de economia de dados
 */
export const isDataSaverEnabled = (): boolean => {
  return !!(navigator as any).connection?.saveData;
};

/**
 * Ajusta a experiência do usuário com base nas capacidades do dispositivo
 * @param lowEndMode Se true, ativa otimizações para dispositivos de baixo desempenho
 */
export const adjustUserExperience = (lowEndMode = false): void => {
  const deviceInfo = detectDevice();
  const forceLowEnd = lowEndMode || deviceInfo.lowEndDevice;
  
  // Aplicar classe para ajustar CSS
  if (forceLowEnd) {
    document.documentElement.classList.add('low-end-device');
  } else {
    document.documentElement.classList.remove('low-end-device');
  }
  
  // Armazenar configuração
  localStorage.setItem('device-performance', forceLowEnd ? 'low' : 'normal');

  // Registrar no console para depuração
  console.log('Ajuste de experiência aplicado:', forceLowEnd ? 'Modo de baixo desempenho' : 'Modo normal');
};

/**
 * Hook para detectar e reagir à orientação do dispositivo
 */
export const setupOrientationDetection = (
  callback: (orientation: 'portrait' | 'landscape') => void
): (() => void) => {
  const handleResize = () => {
    const isPortrait = window.innerHeight > window.innerWidth;
    callback(isPortrait ? 'portrait' : 'landscape');
  };
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Chamada inicial
  
  // Retorna função para remover o listener
  return () => window.removeEventListener('resize', handleResize);
};
