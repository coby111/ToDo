import { Tarea } from "../entities/Tarea";

export interface ITareaRepository {
  crearTarea(tarea: Tarea): Promise<void>;
  obtenerTareasPorProyecto(proyectoId: string): Promise<Tarea[]>;
  actualizarEstadoTarea(id: string, estado: Tarea['estatus']): Promise<void>;
}