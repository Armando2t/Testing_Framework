import {
  busquedaBinaria,
  ResultadoBusqueda,
  validarArregloOrdenado
} from './BusquedaBinaria';

export class ContratoBusquedaBinaria {
  ejecutar(valores: number[], objetivo: number): ResultadoBusqueda {
    this.validarEntrada(valores, objetivo);

    const resultado = busquedaBinaria(valores, objetivo);

    this.validarSalida(valores, objetivo, resultado);

    return resultado;
  }

  validarEntrada(valores: number[], objetivo: number): void {
    if (!Array.isArray(valores)) {
      throw new TypeError('Contrato invalido: valores debe ser un arreglo');
    }

    if (!Number.isFinite(objetivo)) {
      throw new TypeError('Contrato invalido: objetivo debe ser un numero valido');
    }

    valores.forEach((valor: number) => {
      if (!Number.isFinite(valor)) {
        throw new TypeError('Contrato invalido: todos los valores deben ser numeros validos');
      }
    });

    validarArregloOrdenado(valores);
  }

  validarSalida(
    valores: number[],
    objetivo: number,
    resultado: ResultadoBusqueda
  ): void {
    if (resultado.iteraciones < 0) {
      throw new Error('Contrato invalido: las iteraciones no pueden ser negativas');
    }

    if (resultado.encontrado) {
      if (resultado.indice < 0 || resultado.indice >= valores.length) {
        throw new Error('Contrato invalido: indice fuera de rango');
      }

      if (valores[resultado.indice] !== objetivo) {
        throw new Error('Contrato invalido: el indice no corresponde al objetivo');
      }

      return;
    }

    if (resultado.indice !== -1) {
      throw new Error('Contrato invalido: si no se encuentra, el indice debe ser -1');
    }
  }
}