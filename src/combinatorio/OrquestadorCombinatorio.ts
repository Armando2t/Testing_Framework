import { GeneradorCasosCombinatorios } from './GeneradorCasosCombinatorios';
import { ModeloPredictivoEjecuciones } from './ModeloPredictivoEjecuciones';
import { PriorizadorRiesgo } from './PriorizadorRiesgo';
import {
  CasoPriorizado,
  HistoricoEjecuciones,
  ParametrosPedidos
} from './TiposCombinatorios';

export class OrquestadorCombinatorio {
  constructor(
    private readonly generador = new GeneradorCasosCombinatorios(),
    private readonly priorizador = new PriorizadorRiesgo(),
    private readonly modeloPredictivo = new ModeloPredictivoEjecuciones()
  ) {}

  generarCasosPriorizados(
    parametros: ParametrosPedidos,
    historico: HistoricoEjecuciones
  ): CasoPriorizado[] {
    const casos = this.generador.generar(parametros);

    const casosConRiesgo = casos.map(caso => {
      const nivelRiesgo = this.priorizador.calcularNivelRiesgo(caso);
      const probabilidadFallo =
        this.modeloPredictivo.calcularProbabilidadFallo(
          caso.tipoEscenario,
          historico
        );

      return {
        ...caso,
        nivelRiesgo,
        probabilidadFallo,
        prioridad: 0,
        resultadoEsperado: this.priorizador.generarResultadoEsperado(caso)
      };
    });

    return casosConRiesgo
      .sort((casoA, casoB) => {
        const puntajeA =
          this.priorizador.obtenerPesoRiesgo(casoA.nivelRiesgo) +
          casoA.probabilidadFallo;

        const puntajeB =
          this.priorizador.obtenerPesoRiesgo(casoB.nivelRiesgo) +
          casoB.probabilidadFallo;

        return puntajeB - puntajeA;
      })
      .map((caso, indice) => ({
        ...caso,
        prioridad: indice + 1
      }));
  }
}