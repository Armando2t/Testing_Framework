import * as fs from 'fs';
import * as path from 'path';
import { AnalizadorComplejidad } from '../../src/metricas/AnalizadorComplejidad';

interface ArchivoPrueba {
  ruta: string;
  contenido: string;
}

function obtenerArchivosSpec(directorio: string): ArchivoPrueba[] {
  const resultado: ArchivoPrueba[] = [];

  const elementos = fs.readdirSync(directorio, { withFileTypes: true });

  elementos.forEach(elemento => {
    const rutaCompleta = path.join(directorio, elemento.name);

    if (elemento.isDirectory()) {
      resultado.push(...obtenerArchivosSpec(rutaCompleta));
      return;
    }

    if (elemento.isFile() && elemento.name.endsWith('Spec.ts')) {
      resultado.push({
        ruta: rutaCompleta,
        contenido: fs.readFileSync(rutaCompleta, 'utf8')
      });
    }
  });

  return resultado;
}

function extraerPruebas(contenido: string): Array<{
  nombre: string;
  cuerpo: string;
}> {
  const pruebas: Array<{ nombre: string; cuerpo: string }> = [];
  const patron = /it\('([^']+)'\s*,\s*\(\)\s*=>\s*\{([\s\S]*?)\n\s*\}\);/g;

  let coincidencia = patron.exec(contenido);

  while (coincidencia !== null) {
    pruebas.push({
      nombre: coincidencia[1],
      cuerpo: coincidencia[2]
    });

    coincidencia = patron.exec(contenido);
  }

  return pruebas;
}

function crearDirectorioReportes(): string {
  const directorioReportes = path.join(process.cwd(), 'reports', 'metricas');

  if (!fs.existsSync(directorioReportes)) {
    fs.mkdirSync(directorioReportes, { recursive: true });
  }

  return directorioReportes;
}

const analizador = new AnalizadorComplejidad();
const archivos = obtenerArchivosSpec(path.join(process.cwd(), 'spec'));

const resultados = archivos.flatMap(archivo => {
  const pruebas = extraerPruebas(archivo.contenido);

  return pruebas.map(prueba =>
    analizador.analizarPrueba(
      path.relative(process.cwd(), archivo.ruta),
      prueba.nombre,
      prueba.cuerpo
    )
  );
});

const reporte = {
  fechaGeneracion: new Date().toISOString(),
  totalPruebasAnalizadas: resultados.length,
  complejidadPromedio:
    resultados.length === 0
      ? 0
      : Number(
          (
            resultados.reduce(
              (suma, resultado) => suma + resultado.complejidad,
              0
            ) / resultados.length
          ).toFixed(2)
        ),
  pruebas: resultados
};

const directorioReportes = crearDirectorioReportes();
const rutaReporte = path.join(
  directorioReportes,
  'complejidad-pruebas.json'
);

fs.writeFileSync(rutaReporte, JSON.stringify(reporte, null, 2), 'utf8');

console.log('Reporte de complejidad generado correctamente.');
console.log(`Total de pruebas analizadas: ${reporte.totalPruebasAnalizadas}`);
console.log(`Complejidad promedio: ${reporte.complejidadPromedio}`);
console.log(`Archivo generado: ${rutaReporte}`);