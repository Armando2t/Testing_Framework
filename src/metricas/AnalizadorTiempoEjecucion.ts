export interface MedicionTiempoEjecucion {
  numeroEjecucion: number;
  exitosa: boolean;
  duracionProcesoMs: number;
  duracionJasmineSegundos: number | null;
}

export interface ReporteTiempoEjecucion {
  totalEjecuciones: number;
  ejecucionesExitosas: number;
  ejecucionesFallidas: number;
  duracionMinimaMs: number;
  duracionMaximaMs: number;
  duracionPromedioMs: number;
  duracionJasminePromedioSegundos: number | null;
  diferenciaMaximaMs: number;
  mediciones: MedicionTiempoEjecucion[];
}

export class AnalizadorTiempoEjecucion {
  generarReporte(
    mediciones: MedicionTiempoEjecucion[]
  ): ReporteTiempoEjecucion {
    const duraciones = mediciones.map(medicion => medicion.duracionProcesoMs);
    const ejecucionesExitosas = mediciones.filter(
      medicion => medicion.exitosa
    ).length;

    const duracionMinimaMs = Math.min(...duraciones);
    const duracionMaximaMs = Math.max(...duraciones);

    const duracionPromedioMs = Number(
      (
        duraciones.reduce((suma, duracion) => suma + duracion, 0) /
        mediciones.length
      ).toFixed(2)
    );

    const duracionesJasmine = mediciones
      .map(medicion => medicion.duracionJasmineSegundos)
      .filter((valor): valor is number => valor !== null);

    const duracionJasminePromedioSegundos =
      duracionesJasmine.length === 0
        ? null
        : Number(
            (
              duracionesJasmine.reduce((suma, duracion) => suma + duracion, 0) /
              duracionesJasmine.length
            ).toFixed(4)
          );

    return {
      totalEjecuciones: mediciones.length,
      ejecucionesExitosas,
      ejecucionesFallidas: mediciones.length - ejecucionesExitosas,
      duracionMinimaMs,
      duracionMaximaMs,
      duracionPromedioMs,
      duracionJasminePromedioSegundos,
      diferenciaMaximaMs: duracionMaximaMs - duracionMinimaMs,
      mediciones
    };
  }
}