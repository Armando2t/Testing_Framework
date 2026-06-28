export interface DatosModuloConfiabilidad {
  nombre: string;
  defectosHistoricos: number;
  coberturaLineas: number;
  mutationScore: number;
  complejidadPromedio: number;
  usoEstimado: number;
}

export interface PrediccionConfiabilidad {
  modulo: string;
  indiceRiesgo: number;
  confiabilidadEstimada: number;
  probabilidadFallo: number;
  nivelConfiabilidad: 'ALTA' | 'MEDIA' | 'BAJA';
  recomendacion: string;
}

export class ModeloConfiabilidad {
  predecir(datos: DatosModuloConfiabilidad): PrediccionConfiabilidad {
    const riesgoDefectos = Math.min(datos.defectosHistoricos * 8, 40);
    const riesgoCobertura = Math.max(0, 100 - datos.coberturaLineas) * 0.25;
    const riesgoMutacion = Math.max(0, 100 - datos.mutationScore) * 0.35;
    const riesgoComplejidad = Math.max(0, datos.complejidadPromedio - 1) * 10;
    const riesgoUso = datos.usoEstimado * 0.05;

    const indiceRiesgo = Number(
      (
        riesgoDefectos +
        riesgoCobertura +
        riesgoMutacion +
        riesgoComplejidad +
        riesgoUso
      ).toFixed(2)
    );

    const probabilidadFallo = Number(
      Math.min(indiceRiesgo / 100, 1).toFixed(2)
    );

    const confiabilidadEstimada = Number(
      Math.max(0, 1 - probabilidadFallo).toFixed(2)
    );

    return {
      modulo: datos.nombre,
      indiceRiesgo,
      confiabilidadEstimada,
      probabilidadFallo,
      nivelConfiabilidad: this.clasificarConfiabilidad(confiabilidadEstimada),
      recomendacion: this.generarRecomendacion(confiabilidadEstimada)
    };
  }

  predecirVarios(
    modulos: DatosModuloConfiabilidad[]
  ): PrediccionConfiabilidad[] {
    return modulos
      .map(modulo => this.predecir(modulo))
      .sort((a, b) => b.probabilidadFallo - a.probabilidadFallo);
  }

  private clasificarConfiabilidad(
    confiabilidad: number
  ): 'ALTA' | 'MEDIA' | 'BAJA' {
    if (confiabilidad >= 0.8) {
      return 'ALTA';
    }

    if (confiabilidad >= 0.6) {
      return 'MEDIA';
    }

    return 'BAJA';
  }

  private generarRecomendacion(confiabilidad: number): string {
    if (confiabilidad >= 0.8) {
      return 'Modulo estable; mantener monitoreo normal.';
    }

    if (confiabilidad >= 0.6) {
      return 'Modulo con riesgo moderado; reforzar pruebas y revisar mutantes sobrevivientes.';
    }

    return 'Modulo critico; requiere refactorizacion, mas pruebas y analisis de defectos.';
  }
}