export interface ResultadoEjecucionPruebas {
  numeroEjecucion: number;
  exitosa: boolean;
  duracionMs: number;
  salida: string;
}

export interface ResultadoEstabilidadPruebas {
  totalEjecuciones: number;
  ejecucionesExitosas: number;
  ejecucionesFallidas: number;
  duracionMinimaMs: number;
  duracionMaximaMs: number;
  duracionPromedioMs: number;
  pruebasInestables: boolean;
  variacionTiempoAlta: boolean;
  ejecuciones: ResultadoEjecucionPruebas[];
}

export class DetectorPruebasInestables {
  analizar(ejecuciones: ResultadoEjecucionPruebas[]): ResultadoEstabilidadPruebas {
    const duraciones = ejecuciones.map(ejecucion => ejecucion.duracionMs);
    const ejecucionesExitosas = ejecuciones.filter(ejecucion => ejecucion.exitosa).length;
    const ejecucionesFallidas = ejecuciones.length - ejecucionesExitosas;

    const duracionMinimaMs = Math.min(...duraciones);
    const duracionMaximaMs = Math.max(...duraciones);
    const duracionPromedioMs = Number(
      (
        duraciones.reduce((suma, duracion) => suma + duracion, 0) /
        ejecuciones.length
      ).toFixed(2)
    );

    const variacionTiempoAlta =
      duracionMinimaMs > 0 && duracionMaximaMs / duracionMinimaMs > 2;

    return {
      totalEjecuciones: ejecuciones.length,
      ejecucionesExitosas,
      ejecucionesFallidas,
      duracionMinimaMs,
      duracionMaximaMs,
      duracionPromedioMs,
      pruebasInestables: ejecucionesFallidas > 0,
      variacionTiempoAlta,
      ejecuciones
    };
  }
}