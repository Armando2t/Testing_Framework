import {
  CasoPruebaCombinatorio,
  NivelRiesgo
} from './TiposCombinatorios';

export class PriorizadorRiesgo {
  calcularNivelRiesgo(caso: CasoPruebaCombinatorio): NivelRiesgo {
    if (
      caso.cantidadSolicitada <= 0 ||
      caso.cantidadSolicitada > caso.stockDisponible
    ) {
      return 'ALTO';
    }

    if (!caso.clienteValido || !caso.notificacionDisponible) {
      return 'MEDIO';
    }

    return 'BAJO';
  }

  generarResultadoEsperado(caso: CasoPruebaCombinatorio): string {
    if (caso.cantidadSolicitada <= 0) {
      return 'Pedido rechazado por cantidad invalida';
    }

    if (!caso.clienteValido) {
      return 'Pedido rechazado por cliente invalido';
    }

    if (caso.cantidadSolicitada > caso.stockDisponible) {
      return 'Pedido rechazado por stock insuficiente';
    }

    if (!caso.notificacionDisponible) {
      return 'Pedido aprobado con alerta de notificacion';
    }

    return 'Pedido aprobado correctamente';
  }

  obtenerPesoRiesgo(nivelRiesgo: NivelRiesgo): number {
    if (nivelRiesgo === 'ALTO') {
      return 3;
    }

    if (nivelRiesgo === 'MEDIO') {
      return 2;
    }

    return 1;
  }
}