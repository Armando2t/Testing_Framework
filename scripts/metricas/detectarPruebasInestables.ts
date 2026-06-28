import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import {
  DetectorPruebasInestables,
  ResultadoEjecucionPruebas
} from '../../src/metricas/DetectorPruebasInestables';

function crearDirectorioReportes(): string {
  const directorioReportes = path.join(process.cwd(), 'reports', 'metricas');

  if (!fs.existsSync(directorioReportes)) {
    fs.mkdirSync(directorioReportes, { recursive: true });
  }

  return directorioReportes;
}

function ejecutarPruebas(numeroEjecucion: number): ResultadoEjecucionPruebas {
  const inicio = Date.now();

  const comando =
    process.platform === 'win32'
      ? 'cmd.exe'
      : 'npm';

  const argumentos =
    process.platform === 'win32'
      ? ['/c', 'npm.cmd', 'test']
      : ['test'];

  const resultado = spawnSync(comando, argumentos, {
    encoding: 'utf8',
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    windowsHide: true
  });

  const fin = Date.now();

  const salidaCompleta = [
    resultado.stdout || '',
    resultado.stderr || '',
    resultado.error ? resultado.error.message : ''
  ].join('');

  return {
    numeroEjecucion,
    exitosa: resultado.status === 0,
    duracionMs: fin - inicio,
    salida: salidaCompleta
  };
}

const totalEjecuciones = 5;
const ejecuciones: ResultadoEjecucionPruebas[] = [];

for (let indice = 1; indice <= totalEjecuciones; indice++) {
  console.log(`Ejecutando pruebas. Intento ${indice} de ${totalEjecuciones}...`);

  const resultado = ejecutarPruebas(indice);
  ejecuciones.push(resultado);

  console.log(
    `Intento ${indice}: ${resultado.exitosa ? 'exitoso' : 'fallido'} - ${resultado.duracionMs} ms`
  );

  if (!resultado.exitosa) {
    console.log('Salida del intento fallido:');
    console.log(resultado.salida);
  }
}

const detector = new DetectorPruebasInestables();
const reporte = {
  fechaGeneracion: new Date().toISOString(),
  ...detector.analizar(ejecuciones)
};

const directorioReportes = crearDirectorioReportes();
const rutaReporte = path.join(
  directorioReportes,
  'estabilidad-pruebas.json'
);

fs.writeFileSync(rutaReporte, JSON.stringify(reporte, null, 2), 'utf8');

console.log('Reporte de estabilidad generado correctamente.');
console.log(`Total de ejecuciones: ${reporte.totalEjecuciones}`);
console.log(`Ejecuciones exitosas: ${reporte.ejecucionesExitosas}`);
console.log(`Ejecuciones fallidas: ${reporte.ejecucionesFallidas}`);
console.log(`Duracion promedio: ${reporte.duracionPromedioMs} ms`);
console.log(`Pruebas inestables: ${reporte.pruebasInestables ? 'SI' : 'NO'}`);
console.log(`Variacion de tiempo alta: ${reporte.variacionTiempoAlta ? 'SI' : 'NO'}`);
console.log(`Archivo generado: ${rutaReporte}`);