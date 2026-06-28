import { ContratoBusquedaBinaria } from '../../src/algoritmos/ContratoBusquedaBinaria';

// Pruebas de contrato para busqueda binaria.
describe('Busqueda binaria - contract testing', () => {
  it('cumple contrato cuando encuentra un valor existente', () => {
    // Valida entrada, salida e indice retornado.
    const contrato = new ContratoBusquedaBinaria();

    const resultado = contrato.ejecutar([1, 3, 5, 7, 9], 7);

    expect(resultado.encontrado).toBeTrue();
    expect(resultado.indice).toBe(3);
  });

  it('cumple contrato cuando no encuentra el valor', () => {
    // Valida que el indice sea -1 cuando no existe el valor.
    const contrato = new ContratoBusquedaBinaria();

    const resultado = contrato.ejecutar([1, 3, 5, 7, 9], 4);

    expect(resultado.encontrado).toBeFalse();
    expect(resultado.indice).toBe(-1);
  });

  it('rechaza arreglos no ordenados por contrato de entrada', () => {
    // El contrato exige arreglo ordenado ascendente.
    const contrato = new ContratoBusquedaBinaria();

    expect(() => contrato.ejecutar([5, 1, 3], 3)).toThrowError(
      'El arreglo debe estar ordenado de forma ascendente'
    );
  });

  it('rechaza objetivos no numericos validos', () => {
    // El contrato exige un numero finito como objetivo.
    const contrato = new ContratoBusquedaBinaria();

    expect(() => contrato.ejecutar([1, 2, 3], Number.NaN)).toThrowError(
      'Contrato invalido: objetivo debe ser un numero valido'
    );
  });

  it('rechaza arreglos con valores no numericos validos', () => {
    // El contrato exige numeros finitos dentro del arreglo.
    const contrato = new ContratoBusquedaBinaria();

    expect(() => contrato.ejecutar([1, Number.NaN, 3], 3)).toThrowError(
      'Contrato invalido: todos los valores deben ser numeros validos'
    );
  });
});