import { Proyecto } from '../entities/Proyecto';

export interface IProyectoRepository {
  crearProyecto(proyecto: Proyecto): Promise<void>;
  obtenerProyectos(): Promise<Proyecto[]>;
  actualizarEstadoProyecto(id: string, estado: Proyecto['estatus']): Promise<void>;
}
