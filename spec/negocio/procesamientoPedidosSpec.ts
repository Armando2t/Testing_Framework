import { HybridTest } from '../../src/framework/HybridTest';
import { IntegrationRunner } from '../../src/framework/IntegrationRunner';
import { CustomSpy } from '../../src/framework/CustomSpy';
import { TypeBasedTestGenerator } from '../../src/framework/TypeBasedTestGenerator';

import { ServicioInventario } from '../../src/negocio/ServicioInventario';
import {
  ServicioNotificaciones,
  NotificacionPedido
} from '../../src/negocio/ServicioNotificaciones';
import { ServicioPedidos } from '../../src/negocio/ServicioPedidos';

// Caso practico: validacion de pedidos con stock y notificaciones.
describe('Procesamiento de pedidos con mini-framework hibrido', () => {
  it('clasifica pruebas del proceso de pedidos', () => {
    // Registra pruebas del caso real por categoria.
    const framework = new HybridTest();

    framework.addUnitTest('validar stock de producto', () => {});
    framework.addIntegrationTest('procesar pedido completo', () => {});
    framework.addGeneratedTest('validar cantidades generadas', () => {});

    expect(framework.countByType('unit')).toBe(1);
    expect(framework.countByType('integration')).toBe(1);
    expect(framework.countByType('generated')).toBe(1);
  });

  it('valida dependencias para pruebas de integracion', () => {
    // Verifica que los servicios requeridos esten disponibles.
    const runner = new IntegrationRunner();

    const resultado = runner.checkDependencies([
      { name: 'ServicioInventario', available: true },
      { name: 'ServicioPedidos', available: true },
      { name: 'ServicioNotificaciones', available: true }
    ]);

    expect(resultado.canRun).toBeTrue();
    expect(resultado.unavailableDependencies.length).toBe(0);
  });

  it('aprueba pedido cuando existe stock y envia notificacion', () => {
    // Usa un espia personalizado para validar la notificacion.
    const inventario = new ServicioInventario([
      { codigo: 'LAPTOP-001', stockDisponible: 5 }
    ]);

    const espiaNotificacion = new CustomSpy(
      (notificacion: NotificacionPedido): boolean => {
        return Boolean(notificacion.destinatario && notificacion.mensaje);
      }
    );

    const notificaciones = new ServicioNotificaciones();

    notificaciones.enviar = (notificacion: NotificacionPedido): boolean => {
      return espiaNotificacion.execute(notificacion);
    };

    const servicioPedidos = new ServicioPedidos(
      inventario,
      notificaciones
    );

    const resultado = servicioPedidos.procesarPedido({
      codigoProducto: 'LAPTOP-001',
      cantidad: 2,
      cliente: 'cliente@empresa.com'
    });

    expect(resultado.aprobado).toBeTrue();
    expect(resultado.mensaje).toBe('Pedido aprobado correctamente');
    expect(inventario.consultarStock('LAPTOP-001')).toBe(3);
    expect(espiaNotificacion.getCallCount()).toBe(1);
  });

  it('rechaza pedido cuando no existe stock suficiente', () => {
    // Valida rechazo por falta de inventario.
    const inventario = new ServicioInventario([
      { codigo: 'LAPTOP-001', stockDisponible: 5 }
    ]);

    const notificaciones = new ServicioNotificaciones();

    const servicioPedidos = new ServicioPedidos(
      inventario,
      notificaciones
    );

    const resultado = servicioPedidos.procesarPedido({
      codigoProducto: 'LAPTOP-001',
      cantidad: 10,
      cliente: 'cliente@empresa.com'
    });

    expect(resultado.aprobado).toBeFalse();
    expect(resultado.mensaje).toBe('Pedido rechazado por stock insuficiente');
    expect(inventario.consultarStock('LAPTOP-001')).toBe(5);
  });

  it('genera cantidades de prueba para validar reglas de negocio', () => {
    // Genera datos numericos para probar cantidades validas e invalidas.
    const generador = new TypeBasedTestGenerator();

    const cantidades = generador
      .generate('number')
      .map(item => Number(item.value));

    expect(cantidades).toContain(0);
    expect(cantidades).toContain(1);
    expect(cantidades).toContain(-1);

    cantidades.forEach((cantidad: number) => {
      const inventario = new ServicioInventario([
        { codigo: 'LAPTOP-001', stockDisponible: 5 }
      ]);

      const notificaciones = new ServicioNotificaciones();

      const servicioPedidos = new ServicioPedidos(
        inventario,
        notificaciones
      );

      const resultado = servicioPedidos.procesarPedido({
        codigoProducto: 'LAPTOP-001',
        cantidad,
        cliente: 'cliente@empresa.com'
      });

      if (cantidad <= 0) {
        expect(resultado.aprobado).toBeFalse();
      } else {
        expect(resultado.aprobado).toBeTrue();
      }
    });
  });
});