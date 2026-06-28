import { busquedaBinaria } from '../../src/algoritmos/BusquedaBinaria';

// Pruebas base del algoritmo de busqueda binaria.
describe('Busqueda binaria - pruebas base', () => {
  it('encuentra un valor existente en un arreglo ordenado', () => {
    const valores = [1, 3, 5, 7, 9, 11];

    const resultado = busquedaBinaria(valores, 7);

    expect(resultado.encontrado).toBeTrue();
    expect(resultado.indice).toBe(3);
    expect(resultado.iteraciones).toBeGreaterThan(0);
  });

  it('retorna indice -1 cuando el valor no existe', () => {
    const valores = [1, 3, 5, 7, 9, 11];

    const resultado = busquedaBinaria(valores, 4);

    expect(resultado.encontrado).toBeFalse();
    expect(resultado.indice).toBe(-1);
    expect(resultado.iteraciones).toBeGreaterThan(0);
  });

  it('maneja un arreglo vacio', () => {
    const resultado = busquedaBinaria([], 10);

    expect(resultado.encontrado).toBeFalse();
    expect(resultado.indice).toBe(-1);
    expect(resultado.iteraciones).toBe(0);
  });

  it('rechaza arreglos no ordenados', () => {
    const valores = [5, 1, 3];

    expect(() => busquedaBinaria(valores, 3)).toThrowError(
      'El arreglo debe estar ordenado de forma ascendente'
    );
  });
});