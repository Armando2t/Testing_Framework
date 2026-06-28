import * as fs from 'fs';
import * as path from 'path';
import {
  AnalizadorCoberturaDefectos,
  CoberturaArchivo,
  DefectosArchivo
} from '../../src/metricas/AnalizadorCoberturaDefectos';

interface CoverageSummaryItem {
  lines: { pct: number };
  functions: { pct: number };
  branches: { pct: number };
  statements: { pct: number };
}

interface DefectosDetectadosArchivo {
  archivo: string;
  mutantesTotales: number;
  detectados: number;
  sobrevivientes: number;
  mutationScore: number;
}

interface DefectosDetectadosConfig {
  fuente: string;
  fechaReferencia: string;
  archivos: DefectosDetectadosArchivo[];
}

function leerJson<T>(ruta: string): T {
  return JSON.parse(fs.readFileSync(ruta, 'utf8')) as T;
}

function crearDirectorioReportes(): string {
  const directorioReportes = path.join(process.cwd(), 'reports', 'metricas');

  if (!fs.existsSync(directorioReportes)) {
    fs.mkdirSync(directorioReportes, { recursive: true });
  }

  return directorioReportes;
}

function obtenerCoberturas(rutaCoverageSummary: string): CoberturaArchivo[] {
  const resumen = leerJson<Record<string, CoverageSummaryItem>>(
    rutaCoverageSummary
  );

  return Object.entries(resumen)
    .filter(([archivo]) => archivo !== 'total')
    .map(([archivo, datos]) => ({
      archivo,
      coberturaLineas: datos.lines.pct,
      coberturaFunciones: datos.functions.pct,
      coberturaRamas: datos.branches.pct,
      coberturaSentencias: datos.statements.pct
    }));
}

const rutaCoverage = path.join(
  process.cwd(),
  'coverage',
  'coverage-summary.json'
);

const rutaDefectos = path.join(
  process.cwd(),
  'config',
  'metricas',
  'defectosDetectados.json'
);

if (!fs.existsSync(rutaCoverage)) {
  throw new Error(
    'No existe coverage/coverage-summary.json. Ejecuta primero npm.cmd run test:coverage'
  );
}

const coberturas = obtenerCoberturas(rutaCoverage);
const configuracionDefectos = leerJson<DefectosDetectadosConfig>(rutaDefectos);

const defectos: DefectosArchivo[] = configuracionDefectos.archivos.map(
  archivo => ({
    archivo: archivo.archivo,
    mutantesTotales: archivo.mutantesTotales,
    detectados: archivo.detectados,
    sobrevivientes: archivo.sobrevivientes,
    mutationScore: archivo.mutationScore
  })
);

const analizador = new AnalizadorCoberturaDefectos();
const relacion = analizador.generarRelacion(coberturas, defectos);

const reporte = {
  fechaGeneracion: new Date().toISOString(),
  fuenteCobertura: 'c8',
  fuenteDefectos: configuracionDefectos.fuente,
  totalArchivosAnalizados: relacion.length,
  archivos: relacion
};

const directorioReportes = crearDirectorioReportes();
const rutaReporte = path.join(
  directorioReportes,
  'relacion-cobertura-defectos.json'
);

fs.writeFileSync(rutaReporte, JSON.stringify(reporte, null, 2), 'utf8');

console.log('Reporte de relacion cobertura-defectos generado correctamente.');
console.log(`Archivos analizados: ${reporte.totalArchivosAnalizados}`);

relacion.forEach(item => {
  console.log(
    `${item.archivo} | cobertura lineas: ${item.coberturaLineas}% | mutation score: ${item.mutationScore}% | riesgo: ${item.nivelRiesgo}`
  );
});

console.log(`Archivo generado: ${rutaReporte}`);