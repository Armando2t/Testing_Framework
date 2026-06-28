import * as fs from 'fs';
import * as path from 'path';
import {
  DatosModuloConfiabilidad,
  ModeloConfiabilidad
} from '../../src/confiabilidad/ModeloConfiabilidad';

interface ConfiguracionConfiabilidad {
  modulos: DatosModuloConfiabilidad[];
}

function leerJson<T>(ruta: string): T {
  return JSON.parse(fs.readFileSync(ruta, 'utf8')) as T;
}

function crearDirectorioReportes(): string {
  const directorioReportes = path.join(process.cwd(), 'reports', 'confiabilidad');

  if (!fs.existsSync(directorioReportes)) {
    fs.mkdirSync(directorioReportes, { recursive: true });
  }

  return directorioReportes;
}

const rutaDatos = path.join(
  process.cwd(),
  'config',
  'confiabilidad',
  'datosHistoricosModulos.json'
);

const configuracion = leerJson<ConfiguracionConfiabilidad>(rutaDatos);

const modelo = new ModeloConfiabilidad();
const predicciones = modelo.predecirVarios(configuracion.modulos);

const resumen = {
  totalModulos: predicciones.length,
  confiabilidadAlta: predicciones.filter(
    item => item.nivelConfiabilidad === 'ALTA'
  ).length,
  confiabilidadMedia: predicciones.filter(
    item => item.nivelConfiabilidad === 'MEDIA'
  ).length,
  confiabilidadBaja: predicciones.filter(
    item => item.nivelConfiabilidad === 'BAJA'
  ).length,
  moduloMayorRiesgo: predicciones[0]?.modulo ?? null
};

const reporte = {
  fechaGeneracion: new Date().toISOString(),
  modelo: 'Modelo predictivo propio inspirado en enfoques SMERFS/Frestimate',
  descripcion:
    'Predice confiabilidad por modulo usando defectos historicos, cobertura, mutation score, complejidad y uso estimado.',
  resumen,
  predicciones
};

const directorioReportes = crearDirectorioReportes();
const rutaReporte = path.join(
  directorioReportes,
  'reporte-confiabilidad.json'
);

fs.writeFileSync(rutaReporte, JSON.stringify(reporte, null, 2), 'utf8');

console.log('Reporte de confiabilidad generado correctamente.');
console.log(`Total de modulos analizados: ${resumen.totalModulos}`);
console.log(`Confiabilidad alta: ${resumen.confiabilidadAlta}`);
console.log(`Confiabilidad media: ${resumen.confiabilidadMedia}`);
console.log(`Confiabilidad baja: ${resumen.confiabilidadBaja}`);
console.log(`Modulo de mayor riesgo: ${resumen.moduloMayorRiesgo}`);
console.log(`Archivo generado: ${rutaReporte}`);