/**
 * Configuracion de mutation testing para busqueda binaria.
 * Usa npm.cmd en Windows y npm en Linux/GitHub Actions.
 */
const comandoPruebas = process.platform === 'win32'
  ? 'npm.cmd test'
  : 'npm test';

export default {
  packageManager: 'npm',
  reporters: ['clear-text', 'progress', 'html'],
  testRunner: 'command',
  commandRunner: {
    command: comandoPruebas
  },
  mutate: [
    'src/algoritmos/BusquedaBinaria.ts',
    'src/algoritmos/ContratoBusquedaBinaria.ts'
  ],
  coverageAnalysis: 'off',
  timeoutMS: 60000,
  thresholds: {
    high: 80,
    low: 60,
    break: 50
  }
};