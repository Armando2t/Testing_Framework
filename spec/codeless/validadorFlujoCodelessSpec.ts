import * as fs from 'fs';
import * as path from 'path';
import {
  FlujoCodeless,
  ValidadorFlujoCodeless
} from '../../src/codeless/ValidadorFlujoCodeless';

// Pruebas de flujo codeless tipo TestCraft.
describe('Validador de flujo codeless', () => {
  it('valida correctamente el flujo declarativo de pedidos', () => {
    const rutaFlujo = path.join(
      process.cwd(),
      'config',
      'codeless',
      'flujoPedidosCodeless.json'
    );

    const flujo = JSON.parse(
      fs.readFileSync(rutaFlujo, 'utf8')
    ) as FlujoCodeless;

    const validador = new ValidadorFlujoCodeless();
    const resultado = validador.validar(flujo);

    expect(resultado.valido).toBeTrue();
    expect(resultado.totalPasos).toBe(5);
    expect(resultado.errores.length).toBe(0);
  });
});