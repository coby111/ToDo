export type EstadoProyecto = 'pendiente' | 'en progreso' | 'terminado';

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  estatus: EstadoProyecto;
}