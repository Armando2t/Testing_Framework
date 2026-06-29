import fs from 'fs';
import path from 'path';
import {
  DatosModuloPersonalizado,
  ModeloPredictivoPersonalizado
} from '../../src/confiabilidad/ModeloPredictivoPersonalizado';

const rutaDatos = path.join(
  process.cwd(),
  'config',
  'confiabilidad',
  'datosHistoricosModulos.json'
);

const rutaReporte = path.join(
  process.cwd(),
  'reports',
  'confiabilidad',
  'modelo-predictivo-personalizado.json'
);

const contenidoArchivo = JSON.parse(fs.readFileSync(rutaDatos, 'utf-8'));

const registrosFuente = Array.isArray(contenidoArchivo)
  ? contenidoArchivo
  : contenidoArchivo.modulos;

if (!Array.isArray(registrosFuente)) {
  throw new Error(
    'No se encontro un arreglo de modulos en datosHistoricosModulos.json.'
  );
}

const datos: DatosModuloPersonalizado[] = registrosFuente.map((item, index) => ({
  modulo:
    item.modulo ??
    item.nombreModulo ??
    item.nombre ??
    `ModuloSinNombre${index + 1}`,
  defectosHistoricos: Number(item.defectosHistoricos ?? 0),
  coberturaLineas: Number(item.coberturaLineas ?? 0),
  mutationScore: Number(item.mutationScore ?? 0),
  complejidadPromedio: Number(item.complejidadPromedio ?? 1),
  usoEstimado: Number(item.usoEstimado ?? 0)
}));

const modelo = new ModeloPredictivoPersonalizado();
const predicciones = modelo.predecirVarios(datos);

const reporte = {
  fechaGeneracion: new Date().toISOString(),
  descripcion:
    'Modelo predictivo personalizado basado en datos historicos, complejidad, patrones de uso, enfoque logaritmico y simulacion estocastica.',
  totalModulosAnalizados: predicciones.length,
  moduloMayorRiesgo: predicciones[0]?.modulo,
  predicciones
};

fs.mkdirSync(path.dirname(rutaReporte), { recursive: true });
fs.writeFileSync(rutaReporte, JSON.stringify(reporte, null, 2), 'utf-8');

console.log('Modelo predictivo personalizado generado correctamente.');
console.log(`Total de modulos analizados: ${reporte.totalModulosAnalizados}`);
console.log(`Modulo de mayor riesgo: ${reporte.moduloMayorRiesgo}`);
console.log(`Reporte generado en: ${rutaReporte}`);