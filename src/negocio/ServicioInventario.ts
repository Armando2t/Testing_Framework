export interface ProductoInventario {
  codigo: string;
  stockDisponible: number;
}

export class ServicioInventario {
  private readonly productos: ProductoInventario[];

  constructor(productos: ProductoInventario[]) {
    this.productos = productos;
  }

  consultarStock(codigoProducto: string): number {
    const producto = this.productos.find(
      item => item.codigo === codigoProducto
    );

    return producto ? producto.stockDisponible : 0;
  }

  tieneStock(codigoProducto: string, cantidadSolicitada: number): boolean {
    if (cantidadSolicitada <= 0) {
      return false;
    }

    const stockDisponible = this.consultarStock(codigoProducto);

    return stockDisponible >= cantidadSolicitada;
  }

  descontarStock(codigoProducto: string, cantidadSolicitada: number): void {
    const producto = this.productos.find(
      item => item.codigo === codigoProducto
    );

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (!this.tieneStock(codigoProducto, cantidadSolicitada)) {
      throw new Error('Stock insuficiente');
    }

    producto.stockDisponible -= cantidadSolicitada;
  }
}