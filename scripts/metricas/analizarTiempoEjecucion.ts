import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import {
  AnalizadorTiempoEjecucion,
  MedicionTiempoEjecucion
} from '../../src/metricas/AnalizadorTiempoEjecucion';

function crearDirectorioReportes(): string {
  const directorioReportes = path.join(process.cwd(), 'reports', 'metricas');

  if (!fs.existsSync(directorioReportes)) {
    fs.mkdirSync(directorioReportes, { recursive: true });
  }

  return directorioReportes;
}

function extraerDuracionJasmine(salida: string): number | null {
  const coincidencia = salida.match(/Finished in ([0-9.]+) seconds/);

  if (!coincidencia) {
    return null;
  }

  return Number(coincidencia[1]);
}

function ejecutarPruebas(numeroEjecucion: number): MedicionTiempoEjecucion {
  const inicio = Date.now();

  const comando = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const argumentos =
    process.platform === 'win32' ? ['/c', 'npm.cmd', 'test'] : ['test'];

  const resultado = spawnSync(comando, argumentos, {
    encoding: 'utf8',
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    windowsHide: true
  });

  const fin = Date.now();
  const salida = `${resultado.stdout || ''}${resultado.stderr || ''}`;

  return {
    numeroEjecucion,
    exitosa: resultado.status === 0,
    duracionProcesoMs: fin - inicio,
    duracionJasmineSegundos: extraerDuracionJasmine(salida)
  };
}

const totalEjecuciones = 5;
const mediciones: MedicionTiempoEjecucion[] = [];

for (let indice = 1; indice <= totalEjecuciones; indice++) {
  console.log(`Midiendo tiempo de ejecucion. Intento ${indice} de ${totalEjecuciones}...`);

  const medicion = ejecutarPruebas(indice);
  mediciones.push(medicion);

  console.log(
    `Intento ${indice}: ${medicion.exitosa ? 'exitoso' : 'fallido'} - ${medicion.duracionProcesoMs} ms`
  );
}

const analizador = new AnalizadorTiempoEjecucion();
const reporte = {
  fechaGeneracion: new Date().toISOString(),
  ...analizador.generarReporte(mediciones)
};

const directorioReportes = crearDirectorioReportes();
const rutaReporte = path.join(
  directorioReportes,
  'tiempo-ejecucion-pruebas.json'
);

fs.writeFileSync(rutaReporte, JSON.stringify(reporte, null, 2), 'utf8');

console.log('Reporte de tiempo de ejecucion generado correctamente.');
console.log(`Total de ejecuciones: ${reporte.totalEjecuciones}`);
console.log(`Ejecuciones exitosas: ${reporte.ejecucionesExitosas}`);
console.log(`Ejecuciones fallidas: ${reporte.ejecucionesFallidas}`);
console.log(`Duracion minima: ${reporte.duracionMinimaMs} ms`);
console.log(`Duracion maxima: ${reporte.duracionMaximaMs} ms`);
console.log(`Duracion promedio: ${reporte.duracionPromedioMs} ms`);
console.log(`Diferencia maxima: ${reporte.diferenciaMaximaMs} ms`);
console.log(`Archivo generado: ${rutaReporte}`);