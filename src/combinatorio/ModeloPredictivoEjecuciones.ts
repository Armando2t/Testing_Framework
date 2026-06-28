import { HistoricoEjecuciones } from './TiposCombinatorios';

export class ModeloPredictivoEjecuciones {
  calcularProbabilidadFallo(
    tipoEscenario: string,
    historico: HistoricoEjecuciones
  ): number {
    const escenario = historico.escenarios.find(
      item => item.tipoEscenario === tipoEscenario
    );

    if (!escenario || escenario.ejecuciones === 0) {
      return 0.5;
    }

    return Number((escenario.fallos / escenario.ejecuciones).toFixed(2));
  }
}