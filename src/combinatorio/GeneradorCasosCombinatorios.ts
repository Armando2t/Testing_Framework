import {
  CasoPruebaCombinatorio,
  ParametrosPedidos
} from './TiposCombinatorios';

export class GeneradorCasosCombinatorios {
  generar(parametros: ParametrosPedidos): CasoPruebaCombinatorio[] {
    const casos: CasoPruebaCombinatorio[] = [];
    let contador = 1;

    parametros.productos.forEach(producto => {
      parametros.stocksDisponibles.forEach(stockDisponible => {
        parametros.cantidadesSolicitadas.forEach(cantidadSolicitada => {
          parametros.clientesValidos.forEach(clienteValido => {
            parametros.notificacionesDisponibles.forEach(
              notificacionDisponible => {
                casos.push({
                  id: `CASO-${contador.toString().padStart(4, '0')}`,
                  producto,
                  stockDisponible,
                  cantidadSolicitada,
                  clienteValido,
                  notificacionDisponible,
                  tipoEscenario: this.clasificarEscenario(
                    stockDisponible,
                    cantidadSolicitada,
                    clienteValido,
                    notificacionDisponible
                  )
                });

                contador++;
              }
            );
          });
        });
      });
    });

    return casos;
  }

  private clasificarEscenario(
    stockDisponible: number,
    cantidadSolicitada: number,
    clienteValido: boolean,
    notificacionDisponible: boolean
  ): string {
    if (cantidadSolicitada <= 0) {
      return 'cantidad_invalida';
    }

    if (!clienteValido) {
      return 'cliente_invalido';
    }

    if (cantidadSolicitada > stockDisponible) {
      return 'stock_insuficiente';
    }

    if (!notificacionDisponible) {
      return 'notificacion_no_disponible';
    }

    return 'pedido_normal';
  }
}