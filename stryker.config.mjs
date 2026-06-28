/**
 * Configuracion de mutation testing para busqueda binaria.
 */
export default {
  packageManager: 'npm',
  reporters: ['clear-text', 'progress', 'html'],
  testRunner: 'command',
  commandRunner: {
    command: 'npm.cmd test'
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