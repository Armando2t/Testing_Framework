import { OrquestadorCombinatorio } from '../../src/combinatorio/OrquestadorCombinatorio';
import {
  HistoricoEjecuciones,
  ParametrosPedidos
} from '../../src/combinatorio/TiposCombinatorios';

// Pruebas de orquestacion combinatoria con riesgo y prediccion.
describe('Orquestador combinatorio', () => {
  const historico: HistoricoEjecuciones = {
    fuente: 'Historial de prueba',
    escenarios: [
      {
        tipoEscenario: 'cantidad_invalida',
        ejecuciones: 10,
        fallos: 8
      },
      {
        tipoEscenario: 'stock_insuficiente',
        ejecuciones: 12,
        fallos: 7
      },
      {
        tipoEscenario: 'cliente_invalido',
        ejecuciones: 8,
        fallos: 5
      },
      {
        tipoEscenario: 'notificacion_no_disponible',
        ejecuciones: 6,
        fallos: 3
      },
      {
        tipoEscenario: 'pedido_normal',
        ejecuciones: 20,
        fallos: 1
      }
    ]
  };

  it('genera casos priorizados automaticamente', () => {
    const parametros: ParametrosPedidos = {
      productos: ['LAPTOP-001'],
      stocksDisponibles: [0, 5],
      cantidadesSolicitadas: [1, 10],
      clientesValidos: [true],
      notificacionesDisponibles: [true]
    };

    const orquestador = new OrquestadorCombinatorio();
    const casos = orquestador.generarCasosPriorizados(
      parametros,
      historico
    );

    expect(casos.length).toBe(4);
    expect(casos[0].prioridad).toBe(1);
    expect(casos[0].nivelRiesgo).toBe('ALTO');
  });

  it('asigna mayor prioridad a escenarios de alto riesgo', () => {
    const parametros: ParametrosPedidos = {
      productos: ['LAPTOP-001'],
      stocksDisponibles: [0, 10],
      cantidadesSolicitadas: [1, 10],
      clientesValidos: [true],
      notificacionesDisponibles: [true]
    };

    const orquestador = new OrquestadorCombinatorio();
    const casos = orquestador.generarCasosPriorizados(
      parametros,
      historico
    );

    expect(casos[0].nivelRiesgo).toBe('ALTO');
    expect(casos[0].resultadoEsperado).toBe(
      'Pedido rechazado por stock insuficiente'
    );
  });

  it('calcula probabilidad de fallo usando historial previo', () => {
    const parametros: ParametrosPedidos = {
      productos: ['LAPTOP-001'],
      stocksDisponibles: [0],
      cantidadesSolicitadas: [10],
      clientesValidos: [true],
      notificacionesDisponibles: [true]
    };

    const orquestador = new OrquestadorCombinatorio();
    const casos = orquestador.generarCasosPriorizados(
      parametros,
      historico
    );

    expect(casos[0].tipoEscenario).toBe('stock_insuficiente');
    expect(casos[0].probabilidadFallo).toBe(0.58);
  });

  it('clasifica pedidos normales como bajo riesgo', () => {
    const parametros: ParametrosPedidos = {
      productos: ['LAPTOP-001'],
      stocksDisponibles: [10],
      cantidadesSolicitadas: [1],
      clientesValidos: [true],
      notificacionesDisponibles: [true]
    };

    const orquestador = new OrquestadorCombinatorio();
    const casos = orquestador.generarCasosPriorizados(
      parametros,
      historico
    );

    expect(casos[0].nivelRiesgo).toBe('BAJO');
    expect(casos[0].probabilidadFallo).toBe(0.05);
    expect(casos[0].resultadoEsperado).toBe(
      'Pedido aprobado correctamente'
    );
  });
});