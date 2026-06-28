export interface ResultadoComplejidadPrueba {
  archivo: string;
  nombrePrueba: string;
  complejidad: number;
  decisionesDetectadas: string[];
}

export class AnalizadorComplejidad {
  analizarPrueba(
    archivo: string,
    nombrePrueba: string,
    contenidoPrueba: string
  ): ResultadoComplejidadPrueba {
    const decisionesDetectadas: string[] = [];

    const patronesDecision = [
      { nombre: 'if', patron: /\bif\s*\(/g },
      { nombre: 'for', patron: /\bfor\s*\(/g },
      { nombre: 'while', patron: /\bwhile\s*\(/g },
      { nombre: 'case', patron: /\bcase\b/g },
      { nombre: 'catch', patron: /\bcatch\s*\(/g },
      { nombre: 'and-logico', patron: /&&/g },
      { nombre: 'or-logico', patron: /\|\|/g },
      { nombre: 'operador-ternario', patron: /\?/g }
    ];

    patronesDecision.forEach(decision => {
      const coincidencias = contenidoPrueba.match(decision.patron);

      if (coincidencias) {
        coincidencias.forEach(() => decisionesDetectadas.push(decision.nombre));
      }
    });

    return {
      archivo,
      nombrePrueba,
      complejidad: 1 + decisionesDetectadas.length,
      decisionesDetectadas
    };
  }
}