import { ServicioInventario } from './ServicioInventario';
import { ServicioNotificaciones } from './ServicioNotificaciones';

export interface SolicitudPedido {
  codigoProducto: string;
  cantidad: number;
  cliente: string;
}

export interface ResultadoPedido {
  aprobado: boolean;
  mensaje: string;
}

export class ServicioPedidos {
  constructor(
    private readonly inventario: ServicioInventario,
    private readonly notificaciones: ServicioNotificaciones
  ) {}

  procesarPedido(solicitud: SolicitudPedido): ResultadoPedido {
    if (solicitud.cantidad <= 0) {
      return {
        aprobado: false,
        mensaje: 'La cantidad solicitada debe ser mayor a cero'
      };
    }

    const hayStock = this.inventario.tieneStock(
      solicitud.codigoProducto,
      solicitud.cantidad
    );

    if (!hayStock) {
      return {
        aprobado: false,
        mensaje: 'Pedido rechazado por stock insuficiente'
      };
    }

    this.inventario.descontarStock(
      solicitud.codigoProducto,
      solicitud.cantidad
    );

    this.notificaciones.enviar({
      destinatario: solicitud.cliente,
      mensaje: `Pedido aprobado para el producto ${solicitud.codigoProducto}`
    });

    return {
      aprobado: true,
      mensaje: 'Pedido aprobado correctamente'
    };
  }
}