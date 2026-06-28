import {
  DatosModuloConfiabilidad,
  ModeloConfiabilidad
} from '../../src/confiabilidad/ModeloConfiabilidad';

// Pruebas del modelo predictivo de confiabilidad.
describe('Modelo predictivo de confiabilidad', () => {
  it('calcula una prediccion de confiabilidad por modulo', () => {
    const modelo = new ModeloConfiabilidad();

    const datos: DatosModuloConfiabilidad = {
      nombre: 'BusquedaBinaria',
      defectosHistoricos: 2,
      coberturaLineas: 96.36,
      mutationScore: 88.64,
      complejidadPromedio: 1.1,
      usoEstimado: 80
    };

    const prediccion = modelo.predecir(datos);

    expect(prediccion.modulo).toBe('BusquedaBinaria');
    expect(prediccion.indiceRiesgo).toBeGreaterThan(0);
    expect(prediccion.confiabilidadEstimada).toBeGreaterThan(0);
    expect(prediccion.probabilidadFallo).toBeLessThanOrEqual(1);
  });

  it('clasifica como mayor riesgo a modulos con mas defectos y menor mutation score', () => {
    const modelo = new ModeloConfiabilidad();

    const moduloEstable: DatosModuloConfiabilidad = {
      nombre: 'ModuloEstable',
      defectosHistoricos: 1,
      coberturaLineas: 95,
      mutationScore: 90,
      complejidadPromedio: 1.1,
      usoEstimado: 50
    };

    const moduloRiesgoso: DatosModuloConfiabilidad = {
      nombre: 'ModuloRiesgoso',
      defectosHistoricos: 8,
      coberturaLineas: 70,
      mutationScore: 45,
      complejidadPromedio: 2.5,
      usoEstimado: 90
    };

    const estable = modelo.predecir(moduloEstable);
    const riesgoso = modelo.predecir(moduloRiesgoso);

    expect(riesgoso.probabilidadFallo).toBeGreaterThan(
      estable.probabilidadFallo
    );
  });

  it('ordena multiples modulos por mayor probabilidad de fallo', () => {
    const modelo = new ModeloConfiabilidad();

    const predicciones = modelo.predecirVarios([
      {
        nombre: 'ModuloBajoRiesgo',
        defectosHistoricos: 1,
        coberturaLineas: 95,
        mutationScore: 90,
        complejidadPromedio: 1.1,
        usoEstimado: 50
      },
      {
        nombre: 'ModuloAltoRiesgo',
        defectosHistoricos: 8,
        coberturaLineas: 65,
        mutationScore: 40,
        complejidadPromedio: 2.5,
        usoEstimado: 90
      }
    ]);

    expect(predicciones[0].modulo).toBe('ModuloAltoRiesgo');
  });
});