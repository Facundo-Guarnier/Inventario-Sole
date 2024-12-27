export interface Notificacion {
  mensaje: string;
  puedeDeshacer: boolean;
  idProducto?: string;
  cantidad?: number;
}
