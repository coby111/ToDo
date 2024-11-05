import { Proyecto } from "../../domain/entities/Proyecto";

export class ProyectoDataSource {
  private proyectos: Proyecto[] = [];

  // constructor() {
  //   this.proyectos = [
  //   {
  //     id: '1',
  //     nombre: 'Desarrollo de Aplicación Móvil',
  //     descripcion: 'Creación de una app multiplataforma para gestionar tareas.',
  //     estatus: 'en progreso',
  //   },
  //   {
  //     id: '2',
  //     nombre: 'Sitio Web Corporativo',
  //     descripcion: 'Diseño y desarrollo de un sitio web informativo para la empresa.',
  //     estatus: 'pendiente',
  //   },
  //   {
  //     id: '3',
  //     nombre: 'Optimización SEO',
  //     descripcion: 'Mejora del posicionamiento en motores de búsqueda para el blog de la empresa.',
  //     estatus: 'terminado',
  //   },
  //   ];
  // }
  

  async crearProyecto(proyecto: Proyecto): Promise<void> {
    this.proyectos.push(proyecto);
  }

  async obtenerProyectos(): Promise<Proyecto[]> {
    return this.proyectos;
  }

  async actualizarEstadoProyecto(id: string, estado: Proyecto['estatus']): Promise<void> {
    const proyecto = this.proyectos.find(proyecto => proyecto.id === id);
    if (proyecto) {
      proyecto.estatus = estado;
    }
  }
}