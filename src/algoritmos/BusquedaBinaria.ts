export interface ResultadoBusqueda {
  encontrado: boolean;
  indice: number;
  iteraciones: number;
}

export function busquedaBinaria(
  valores: number[],
  objetivo: number
): ResultadoBusqueda {
  if (!Array.isArray(valores)) {
    throw new TypeError('Los valores deben estar en un arreglo');
  }

  validarArregloOrdenado(valores);

  let izquierda = 0;
  let derecha = valores.length - 1;
  let iteraciones = 0;

  while (izquierda <= derecha) {
    iteraciones++;

    const medio = Math.floor((izquierda + derecha) / 2);
    const valorActual = valores[medio];

    if (valorActual === objetivo) {
      return {
        encontrado: true,
        indice: medio,
        iteraciones
      };
    }

    if (valorActual < objetivo) {
      izquierda = medio + 1;
    } else {
      derecha = medio - 1;
    }
  }

  return {
    encontrado: false,
    indice: -1,
    iteraciones
  };
}

export function validarArregloOrdenado(valores: number[]): void {
  for (let indice = 1; indice < valores.length; indice++) {
    if (valores[indice] < valores[indice - 1]) {
      throw new Error('El arreglo debe estar ordenado de forma ascendente');
    }
  }
}