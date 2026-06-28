export type SupportedType = 'number' | 'string' | 'boolean' | 'array';

export interface GeneratedTestValue {
  type: SupportedType;
  value: unknown;
  description: string;
}

export class TypeBasedTestGenerator {
  generate(type: SupportedType): GeneratedTestValue[] {
    if (type === 'number') {
      return [
        { type, value: 0, description: 'número cero' },
        { type, value: 1, description: 'número positivo' },
        { type, value: -1, description: 'número negativo' }
      ];
    }

    if (type === 'string') {
      return [
        { type, value: '', description: 'cadena vacía' },
        { type, value: 'test', description: 'cadena con texto' }
      ];
    }

    if (type === 'boolean') {
      return [
        { type, value: true, description: 'valor verdadero' },
        { type, value: false, description: 'valor falso' }
      ];
    }

    return [
      { type, value: [], description: 'arreglo vacío' },
      { type, value: [1, 2, 3], description: 'arreglo con elementos' }
    ];
  }
}
