import * as fs from 'fs';
import * as path from 'path';
import { OrquestadorCombinatorio } from '../../src/combinatorio/OrquestadorCombinatorio';
import {
  HistoricoEjecuciones,
  ParametrosPedidos
} from '../../src/combinatorio/TiposCombinatorios';

function leerJson<T>(ruta: string): T {
  return JSON.parse(fs.readFileSync(ruta, 'utf8')) as T;
}

function crearDirectorioReportes(): string {
  const directorioReportes = path.join(process.cwd(), 'reports', 'combinatorio');

  if (!fs.existsSync(directorioReportes)) {
    fs.mkdirSync(directorioReportes, { recursive: true });
  }

  return directorioReportes;
}

const rutaParametros = path.join(
  process.cwd(),
  'config',
  'combinatorio',
  'parametrosPedidos.json'
);

const rutaHistorico = path.join(
  process.cwd(),
  'config',
  'combinatorio',
  'historicoEjecuciones.json'
);

const parametros = leerJson<ParametrosPedidos>(rutaParametros);
const historico = leerJson<HistoricoEjecuciones>(rutaHistorico);

const orquestador = new OrquestadorCombinatorio();
const casosPriorizados = orquestador.generarCasosPriorizados(
  parametros,
  historico
);

const reporte = {
  fechaGeneracion: new Date().toISOString(),
  totalCasosGenerados: casosPriorizados.length,
  resumen: {
    altoRiesgo: casosPriorizados.filter(caso => caso.nivelRiesgo === 'ALTO').length,
    medioRiesgo: casosPriorizados.filter(caso => caso.nivelRiesgo === 'MEDIO').length,
    bajoRiesgo: casosPriorizados.filter(caso => caso.nivelRiesgo === 'BAJO').length
  },
  primerosDiezCasos: casosPriorizados.slice(0, 10),
  casos: casosPriorizados
};

const directorioReportes = crearDirectorioReportes();
const rutaReporte = path.join(directorioReportes, 'casos-priorizados.json');

fs.writeFileSync(rutaReporte, JSON.stringify(reporte, null, 2), 'utf8');

console.log('Reporte combinatorio generado correctamente.');
console.log(`Total de casos generados: ${reporte.totalCasosGenerados}`);
console.log(`Casos alto riesgo: ${reporte.resumen.altoRiesgo}`);
console.log(`Casos medio riesgo: ${reporte.resumen.medioRiesgo}`);
console.log(`Casos bajo riesgo: ${reporte.resumen.bajoRiesgo}`);
console.log(`Archivo generado: ${rutaReporte}`);