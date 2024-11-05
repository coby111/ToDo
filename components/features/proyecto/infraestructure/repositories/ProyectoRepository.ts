import { Proyecto } from "../../domain/entities/Proyecto";
import { IProyectoRepository } from "../../domain/repositories/ProyectoRepository";
import { ProyectoDataSource } from "../datasources/ProyectoDataSource";

export class ProyectoRepository implements IProyectoRepository {
  constructor(private dataSource: ProyectoDataSource) {}

  async crearProyecto(proyecto: Proyecto): Promise<void> {
    await this.dataSource.crearProyecto(proyecto);
  }

  async obtenerProyectos(): Promise<Proyecto[]> {
    return await this.dataSource.obtenerProyectos();
  }

  async actualizarEstadoProyecto(id: string, estado: Proyecto['estatus']): Promise<void> {
    await this.dataSource.actualizarEstadoProyecto(id, estado);
  }
}