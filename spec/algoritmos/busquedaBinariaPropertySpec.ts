import * as fc from 'fast-check';
import { busquedaBinaria } from '../../src/algoritmos/BusquedaBinaria';

// Pruebas basadas en propiedades para busqueda binaria.
describe('Busqueda binaria - property-based testing', () => {
  const arreglosOrdenados = fc
    .uniqueArray(fc.integer({ min: -1000, max: 1000 }), {
      minLength: 1,
      maxLength: 50
    })
    .map(valores => valores.sort((a, b) => a - b));

  it('encuentra cualquier valor existente en un arreglo ordenado', () => {
    fc.assert(
      fc.property(
        arreglosOrdenados,
        fc.integer({ min: 0, max: 49 }),
        (valores: number[], indiceGenerado: number) => {
          const indice = indiceGenerado % valores.length;
          const objetivo = valores[indice];

          const resultado = busquedaBinaria(valores, objetivo);

          expect(resultado.encontrado).toBeTrue();
          expect(resultado.indice).toBeGreaterThanOrEqual(0);
          expect(resultado.indice).toBeLessThan(valores.length);
          expect(valores[resultado.indice]).toBe(objetivo);
        }
      )
    );
  });

  it('rechaza valores menores al minimo del arreglo', () => {
    fc.assert(
      fc.property(arreglosOrdenados, (valores: number[]) => {
        const objetivo = valores[0] - 1;

        const resultado = busquedaBinaria(valores, objetivo);

        expect(resultado.encontrado).toBeFalse();
        expect(resultado.indice).toBe(-1);
      })
    );
  });

  it('no modifica el arreglo original recibido', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -1000, max: 1000 }), {
          minLength: 0,
          maxLength: 50
        }),
        fc.integer({ min: -1000, max: 1000 }),
        (valoresGenerados: number[], objetivo: number) => {
          const valores = [...valoresGenerados].sort((a, b) => a - b);
          const copiaOriginal = [...valores];

          busquedaBinaria(valores, objetivo);

          expect(valores).toEqual(copiaOriginal);
        }
      )
    );
  });

  it('mantiene un numero de iteraciones compatible con busqueda binaria', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -1000, max: 1000 }), {
          minLength: 0,
          maxLength: 100
        }),
        fc.integer({ min: -1000, max: 1000 }),
        (valoresGenerados: number[], objetivo: number) => {
          const valores = Array.from(new Set(valoresGenerados)).sort(
            (a, b) => a - b
          );

          const resultado = busquedaBinaria(valores, objetivo);

          const maximoEsperado =
            valores.length === 0
              ? 0
              : Math.ceil(Math.log2(valores.length + 1));

          expect(resultado.iteraciones).toBeLessThanOrEqual(maximoEsperado);
        }
      )
    );
  });
});