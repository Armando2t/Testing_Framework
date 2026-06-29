export interface DatosModuloPersonalizado {
  modulo: string;
  defectosHistoricos: number;
  coberturaLineas: number;
  mutationScore: number;
  complejidadPromedio: number;
  usoEstimado: number;
}

export interface PrediccionModuloPersonalizada {
  modulo: string;
  riesgoHistorico: number;
  riesgoComplejidad: number;
  riesgoUsoLogaritmico: number;
  riesgoCalidad: number;
  probabilidadBaseFallo: number;
  probabilidadEstocasticaFallo: number;
  confiabilidadIntegrada: number;
  nivelConfiabilidad: 'ALTA' | 'MEDIA' | 'BAJA';
  recomendacion: string;
}

export class ModeloPredictivoPersonalizado {
  predecir(datos: DatosModuloPersonalizado): PrediccionModuloPersonalizada {
    const riesgoHistorico = Math.min(datos.defectosHistoricos * 0.08, 0.4);

    const riesgoComplejidad = Math.min(
      Math.max(datos.complejidadPromedio - 1, 0) * 0.04,
      0.25
    );

    const riesgoUsoLogaritmico =
      (Math.log1p(datos.usoEstimado) / Math.log1p(100)) * 0.2;

    const riesgoCalidad =
      ((100 - datos.coberturaLineas) / 100) * 0.15 +
      ((100 - datos.mutationScore) / 100) * 0.25;

    const probabilidadBase = Math.min(
      riesgoHistorico + riesgoComplejidad + riesgoUsoLogaritmico + riesgoCalidad,
      0.95
    );

    const probabilidadEstocastica = this.simularProbabilidadFallo(
      probabilidadBase,
      this.generarSemilla(datos.modulo)
    );

    const riesgoIntegrado = probabilidadBase * 0.6 + probabilidadEstocastica * 0.4;
    const confiabilidad = (1 - riesgoIntegrado) * 100;

    return {
      modulo: datos.modulo,
      riesgoHistorico: this.redondear(riesgoHistorico * 100),
      riesgoComplejidad: this.redondear(riesgoComplejidad * 100),
      riesgoUsoLogaritmico: this.redondear(riesgoUsoLogaritmico * 100),
      riesgoCalidad: this.redondear(riesgoCalidad * 100),
      probabilidadBaseFallo: this.redondear(probabilidadBase * 100),
      probabilidadEstocasticaFallo: this.redondear(probabilidadEstocastica * 100),
      confiabilidadIntegrada: this.redondear(confiabilidad),
      nivelConfiabilidad: this.obtenerNivel(confiabilidad),
      recomendacion: this.obtenerRecomendacion(confiabilidad)
    };
  }

  predecirVarios(datos: DatosModuloPersonalizado[]): PrediccionModuloPersonalizada[] {
    return datos
      .map((modulo) => this.predecir(modulo))
      .sort((a, b) => a.confiabilidadIntegrada - b.confiabilidadIntegrada);
  }

  private simularProbabilidadFallo(probabilidadBase: number, semilla: number): number {
    const iteraciones = 1000;
    let fallos = 0;

    for (let i = 0; i < iteraciones; i++) {
      const aleatorio = this.numeroPseudoAleatorio(semilla + i);

      if (aleatorio < probabilidadBase) {
        fallos++;
      }
    }

    return fallos / iteraciones;
  }

  private numeroPseudoAleatorio(semilla: number): number {
    const valor = Math.sin(semilla) * 10000;
    return valor - Math.floor(valor);
  }

  private generarSemilla(texto: string): number {
    return texto
      .split('')
      .reduce((total, caracter) => total + caracter.charCodeAt(0), 0);
  }

  private obtenerNivel(confiabilidad: number): 'ALTA' | 'MEDIA' | 'BAJA' {
    if (confiabilidad >= 80) {
      return 'ALTA';
    }

    if (confiabilidad >= 60) {
      return 'MEDIA';
    }

    return 'BAJA';
  }

  private obtenerRecomendacion(confiabilidad: number): string {
    if (confiabilidad >= 80) {
      return 'Mantener las pruebas actuales y monitorear el módulo.';
    }

    if (confiabilidad >= 60) {
      return 'Agregar más pruebas para reforzar la confiabilidad del módulo.';
    }

    return 'Priorizar mejoras, aumentar cobertura y reforzar pruebas de mutación.';
  }

  private redondear(valor: number): number {
    return Number(valor.toFixed(2));
  }
}