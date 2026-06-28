import { GeneradorCasosCombinatorios } from '../../src/combinatorio/GeneradorCasosCombinatorios';
import { ParametrosPedidos } from '../../src/combinatorio/TiposCombinatorios';

// Pruebas del generador automatico de casos combinatorios.
describe('Generador de casos combinatorios', () => {
  it('genera combinaciones automaticamente a partir de parametros', () => {
    const parametros: ParametrosPedidos = {
      productos: ['LAPTOP-001'],
      stocksDisponibles: [0, 5],
      cantidadesSolicitadas: [1, 10],
      clientesValidos: [true, false],
      notificacionesDisponibles: [true, false]
    };

    const generador = new GeneradorCasosCombinatorios();
    const casos = generador.generar(parametros);

    expect(casos.length).toBe(16);
    expect(casos[0].id).toBe('CASO-0001');
  });

  it('clasifica escenarios de riesgo del proceso de pedidos', () => {
    const parametros: ParametrosPedidos = {
      productos: ['LAPTOP-001'],
      stocksDisponibles: [0],
      cantidadesSolicitadas: [10],
      clientesValidos: [true],
      notificacionesDisponibles: [true]
    };

    const generador = new GeneradorCasosCombinatorios();
    const casos = generador.generar(parametros);

    expect(casos[0].tipoEscenario).toBe('stock_insuficiente');
  });
});