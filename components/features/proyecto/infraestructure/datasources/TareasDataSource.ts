import { Tarea } from "../../domain/entities/Tarea";

export class TareasDataSource {
  private tareas: Tarea[] = [];

  async crearTarea(tarea: Tarea): Promise<void> {
    this.tareas.push(tarea);
  }

  async obtenerTareasPorProyecto(proyectoId: string): Promise<Tarea[]> {
    return this.tareas.filter((tarea) => tarea.proyectoId === proyectoId);
  }

  async actualizarEstadoTarea(id: string, estado: Tarea['estatus']): Promise<void> {
    const tarea = this.tareas.find((tarea) => tarea.id === id);
    if (tarea) {
      tarea.estatus = estado;
    }
  }

  async actualizarTarea(tarea: Tarea): Promise<void> {
    const index = this.tareas.findIndex((t) => t.id === tarea.id);
    if (index !== -1) {
      this.tareas[index] = tarea;
    }
  }

  async eliminarTarea(id: string): Promise<void> {
    this.tareas = this.tareas.filter((tarea) => tarea.id !== id);
  }

}