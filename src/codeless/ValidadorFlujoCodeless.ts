export interface PasoCodeless {
  orden: number;
  accion: string;
  valor?: string | number | boolean;
  valorEsperado?: string | number | boolean;
  descripcion: string;
}

export interface FlujoCodeless {
  nombreFlujo: string;
  descripcion: string;
  tipo: string;
  herramientaReferencia: string;
  modulo: string;
  pasos: PasoCodeless[];
  resultadoEsperado: {
    pedidoAprobado: boolean;
    stockFinalEsperado: number;
    notificacionEnviada: boolean;
  };
}

export interface ResultadoValidacionCodeless {
  valido: boolean;
  totalPasos: number;
  errores: string[];
}

export class ValidadorFlujoCodeless {
  validar(flujo: FlujoCodeless): ResultadoValidacionCodeless {
    const errores: string[] = [];

    if (!flujo.nombreFlujo) {
      errores.push('El flujo debe tener nombre');
    }

    if (flujo.tipo !== 'codeless-testing') {
      errores.push('El tipo del flujo debe ser codeless-testing');
    }

    if (!flujo.herramientaReferencia) {
      errores.push('Debe indicar una herramienta de referencia');
    }

    if (!Array.isArray(flujo.pasos) || flujo.pasos.length === 0) {
      errores.push('El flujo debe tener pasos definidos');
    }

    flujo.pasos.forEach((paso, indice) => {
      if (paso.orden !== indice + 1) {
        errores.push(`El paso ${indice + 1} tiene orden incorrecto`);
      }

      if (!paso.accion) {
        errores.push(`El paso ${indice + 1} no tiene accion`);
      }

      if (!paso.descripcion) {
        errores.push(`El paso ${indice + 1} no tiene descripcion`);
      }
    });

    return {
      valido: errores.length === 0,
      totalPasos: flujo.pasos.length,
      errores
    };
  }
}