export interface NotificacionPedido {
  destinatario: string;
  mensaje: string;
}

export class ServicioNotificaciones {
  enviar(notificacion: NotificacionPedido): boolean {
    if (!notificacion.destinatario || !notificacion.mensaje) {
      return false;
    }

    return true;
  }
}