
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupGlobalErrorMonitoring } from './lib/bugFix/errorMonitoring.ts'
import { adjustUserExperience } from './lib/compatibility/deviceDetection.ts'

// Inicializa sistemas de monitoramento e otimização
setupGlobalErrorMonitoring();
adjustUserExperience();

// Configura parâmetros de desempenho
const isLowEndDevice = localStorage.getItem('device-performance') === 'low';
if (isLowEndDevice) {
  console.log("Modo de desempenho otimizado ativado para dispositivo de baixo desempenho");
  // Aqui seriam aplicadas otimizações específicas para dispositivos de baixo desempenho
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Log de performance inicial
console.log(`Tempo de carregamento inicial: ${performance.now().toFixed(2)}ms`);
