export interface CoberturaArchivo {
  archivo: string;
  coberturaLineas: number;
  coberturaFunciones: number;
  coberturaRamas: number;
  coberturaSentencias: number;
}

export interface DefectosArchivo {
  archivo: string;
  mutantesTotales: number;
  detectados: number;
  sobrevivientes: number;
  mutationScore: number;
}

export interface RelacionCoberturaDefectos {
  archivo: string;
  coberturaLineas: number;
  coberturaFunciones: number;
  coberturaRamas: number;
  coberturaSentencias: number;
  mutantesTotales: number;
  defectosDetectados: number;
  defectosNoDetectados: number;
  mutationScore: number;
  nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO';
  observacion: string;
}

export class AnalizadorCoberturaDefectos {
  generarRelacion(
    coberturas: CoberturaArchivo[],
    defectos: DefectosArchivo[]
  ): RelacionCoberturaDefectos[] {
    return defectos.map(defecto => {
      const cobertura = coberturas.find(item =>
        item.archivo.endsWith(defecto.archivo)
      );

      const coberturaLineas = cobertura ? cobertura.coberturaLineas : 0;
      const coberturaFunciones = cobertura ? cobertura.coberturaFunciones : 0;
      const coberturaRamas = cobertura ? cobertura.coberturaRamas : 0;
      const coberturaSentencias = cobertura ? cobertura.coberturaSentencias : 0;

      const nivelRiesgo = this.calcularRiesgo(
        coberturaLineas,
        defecto.mutationScore,
        defecto.sobrevivientes
      );

      return {
        archivo: defecto.archivo,
        coberturaLineas,
        coberturaFunciones,
        coberturaRamas,
        coberturaSentencias,
        mutantesTotales: defecto.mutantesTotales,
        defectosDetectados: defecto.detectados,
        defectosNoDetectados: defecto.sobrevivientes,
        mutationScore: defecto.mutationScore,
        nivelRiesgo,
        observacion: this.generarObservacion(nivelRiesgo)
      };
    });
  }

  private calcularRiesgo(
    coberturaLineas: number,
    mutationScore: number,
    sobrevivientes: number
  ): 'BAJO' | 'MEDIO' | 'ALTO' {
    if (coberturaLineas >= 80 && mutationScore >= 80 && sobrevivientes <= 5) {
      return 'BAJO';
    }

    if (coberturaLineas >= 70 && mutationScore >= 60) {
      return 'MEDIO';
    }

    return 'ALTO';
  }

  private generarObservacion(nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO'): string {
    if (nivelRiesgo === 'BAJO') {
      return 'Buena cobertura y alta capacidad de deteccion de defectos.';
    }

    if (nivelRiesgo === 'MEDIO') {
      return 'Cobertura aceptable, pero existen mutantes sobrevivientes que requieren pruebas adicionales.';
    }

    return 'Riesgo alto: se recomienda reforzar las pruebas y revisar los escenarios no cubiertos.';
  }
}