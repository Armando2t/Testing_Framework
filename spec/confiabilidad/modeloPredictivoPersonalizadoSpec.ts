import { ModeloPredictivoPersonalizado } from '../../src/confiabilidad/ModeloPredictivoPersonalizado';

describe('ModeloPredictivoPersonalizado', () => {
  it('deberia generar una prediccion integrada para un modulo', () => {
    const modelo = new ModeloPredictivoPersonalizado();

    const resultado = modelo.predecir({
      modulo: 'ModuloPrueba',
      defectosHistoricos: 3,
      coberturaLineas: 80,
      mutationScore: 60,
      complejidadPromedio: 2,
      usoEstimado: 50
    });

    expect(resultado.modulo).toBe('ModuloPrueba');
    expect(resultado.probabilidadBaseFallo).toBeGreaterThan(0);
    expect(resultado.probabilidadEstocasticaFallo).toBeGreaterThan(0);
    expect(resultado.confiabilidadIntegrada).toBeLessThanOrEqual(100);
  });

  it('deberia considerar el uso estimado con enfoque logaritmico', () => {
    const modelo = new ModeloPredictivoPersonalizado();

    const resultado = modelo.predecir({
      modulo: 'ModuloUsoAlto',
      defectosHistoricos: 1,
      coberturaLineas: 90,
      mutationScore: 80,
      complejidadPromedio: 1,
      usoEstimado: 90
    });

    expect(resultado.riesgoUsoLogaritmico).toBeGreaterThan(0);
  });

  it('deberia ordenar primero el modulo con menor confiabilidad', () => {
    const modelo = new ModeloPredictivoPersonalizado();

    const resultados = modelo.predecirVarios([
      {
        modulo: 'ModuloEstable',
        defectosHistoricos: 0,
        coberturaLineas: 95,
        mutationScore: 90,
        complejidadPromedio: 1,
        usoEstimado: 10
      },
      {
        modulo: 'ModuloRiesgoso',
        defectosHistoricos: 5,
        coberturaLineas: 60,
        mutationScore: 40,
        complejidadPromedio: 5,
        usoEstimado: 90
      }
    ]);

    expect(resultados[0].modulo).toBe('ModuloRiesgoso');
  });
});