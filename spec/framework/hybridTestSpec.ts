import { HybridTest } from '../../src/framework/HybridTest';
import { IntegrationRunner } from '../../src/framework/IntegrationRunner';
import { CustomSpy } from '../../src/framework/CustomSpy';
import { TypeBasedTestGenerator } from '../../src/framework/TypeBasedTestGenerator';

// Pruebas del mini-framework hibrido.
describe('Mini-framework hibrido', () => {
  it('registra pruebas por tipo', () => {
    // Registra pruebas unitarias, de integracion y generadas.
    const framework = new HybridTest();

    framework.addUnitTest('prueba unitaria base', () => {});
    framework.addIntegrationTest('prueba de integracion base', () => {});
    framework.addGeneratedTest('prueba generada por tipo', () => {});

    expect(framework.getTests().length).toBe(3);
    expect(framework.countByType('unit')).toBe(1);
    expect(framework.countByType('integration')).toBe(1);
    expect(framework.countByType('generated')).toBe(1);
  });

  it('valida dependencias de integracion', () => {
    // Verifica si las dependencias requeridas estan disponibles.
    const runner = new IntegrationRunner();

    const result = runner.checkDependencies([
      { name: 'base de datos simulada', available: true },
      { name: 'servicio externo simulado', available: false }
    ]);

    expect(result.canRun).toBeFalse();
    expect(result.unavailableDependencies).toContain('servicio externo simulado');
  });

  it('registra llamadas con espia personalizado', () => {
    // Valida llamadas y parametros recibidos por el espia.
    const spy = new CustomSpy(
      (a: number, b: number): number => a + b
    );

    const result = spy.execute(2, 3);

    expect(result).toBe(5);
    expect(spy.getCallCount()).toBe(1);
    expect(spy.wasCalledWith(2, 3)).toBeTrue();
  });

  it('genera valores de prueba por tipo', () => {
    // Genera datos de prueba segun el tipo indicado.
    const generator = new TypeBasedTestGenerator();

    const values = generator.generate('number');

    expect(values.length).toBe(3);
    expect(values.map(item => item.value)).toContain(0);
    expect(values.map(item => item.value)).toContain(1);
    expect(values.map(item => item.value)).toContain(-1);
  });
});