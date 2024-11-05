export type EstadoTarea = 'realizada' | 'no realizada';

export interface Tarea {
  id: string;
  proyectoId: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  estatus: EstadoTarea;
}