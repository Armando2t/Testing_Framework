export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO';

export interface ParametrosPedidos {
  productos: string[];
  stocksDisponibles: number[];
  cantidadesSolicitadas: number[];
  clientesValidos: boolean[];
  notificacionesDisponibles: boolean[];
}

export interface CasoPruebaCombinatorio {
  id: string;
  producto: string;
  stockDisponible: number;
  cantidadSolicitada: number;
  clienteValido: boolean;
  notificacionDisponible: boolean;
  tipoEscenario: string;
}

export interface CasoPriorizado extends CasoPruebaCombinatorio {
  nivelRiesgo: NivelRiesgo;
  probabilidadFallo: number;
  prioridad: number;
  resultadoEsperado: string;
}

export interface EscenarioHistorico {
  tipoEscenario: string;
  ejecuciones: number;
  fallos: number;
}

export interface HistoricoEjecuciones {
  fuente: string;
  escenarios: EscenarioHistorico[];
}