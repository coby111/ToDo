import { Tarea } from "../../domain/entities/Tarea";
import { ITareaRepository } from "../../domain/repositories/TareaRepository";
import { TareasDataSource } from "../datasources/TareasDataSource";

export class TareaRepository implements ITareaRepository {
  constructor(private dataSource: TareasDataSource) {}

  async crearTarea(tarea: Tarea): Promise<void> {
    await this.dataSource.crearTarea(tarea);
  }

  async obtenerTareasPorProyecto(proyectoId: string): Promise<Tarea[]> {
    return await this.dataSource.obtenerTareasPorProyecto(proyectoId);
  }

  async actualizarEstadoTarea(id: string, estado: Tarea['estatus']): Promise<void> {
    await this.dataSource.actualizarEstadoTarea(id, estado);
  }
  
  async actualizarTarea(tarea: Tarea): Promise<void> {
    await this.dataSource.actualizarTarea(tarea);
  }

  async eliminarTarea(id: string): Promise<void> {
    await this.dataSource.eliminarTarea(id);
  }
}
