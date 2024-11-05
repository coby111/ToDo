import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EstadoTarea, Tarea } from '../../components/features/proyecto/domain/entities/Tarea';
import { TareaRepository } from '../../components/features/proyecto/infraestructure/repositories/TareaRepository';
import { TareasDataSource } from '../../components/features/proyecto/infraestructure/datasources/TareasDataSource';

const TareaScreen = () => {
  const { proyectoId } = useLocalSearchParams<{ proyectoId: string }>();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [estatus, setEstatus] = useState<EstadoTarea>('no realizada');
  const [nuevaTarea, setNuevaTarea] = useState<Tarea>({
    id: '',
    proyectoId: proyectoId,
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    estatus: 'no realizada',
  });
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
  const router = useRouter();
  const tareaRepository = new TareaRepository(new TareasDataSource());

  useEffect(() => {
    const cargarTareas = async () => {
      const tareasProyecto: Tarea[] = [
        { id: '1-1', proyectoId: '1', nombre: 'Tarea 1 de Proyecto 1', descripcion: 'Descripción de la tarea 1 para Proyecto 1', fechaInicio: '01-11-2024', estatus: 'no realizada' as EstadoTarea },
        { id: '1-2', proyectoId: '1', nombre: 'Tarea 2 de Proyecto 1', descripcion: 'Descripción de la tarea 2 para Proyecto 1', fechaInicio: '01-11-2024', estatus: 'realizada' as EstadoTarea },
        { id: '2-1', proyectoId: '2', nombre: 'Tarea 1 de Proyecto 2', descripcion: 'Descripción de la tarea 1 para Proyecto 2', fechaInicio: '01-11-2024', estatus: 'no realizada' as EstadoTarea },
        { id: '3-1', proyectoId: '3', nombre: 'Tarea 1 de Proyecto 3', descripcion: 'Descripción de la tarea 1 para Proyecto 3', fechaInicio: '01-11-2024', estatus: 'realizada' as EstadoTarea },
      ];
      for (const tarea of tareasProyecto) {
        await tareaRepository.crearTarea(tarea);
      }

      const tareasCargadas = await tareaRepository.obtenerTareasPorProyecto(proyectoId!);
      setTareas(tareasCargadas);
    };

    cargarTareas();
  }, [proyectoId]);

  const cambiarEstado = async (id: string, estatus: EstadoTarea) => {
    const tareaIndex = tareas.findIndex((t) => t.id === id);
    if (tareaIndex > -1) {
      const tareasActualizadas = [...tareas];
      tareasActualizadas[tareaIndex] = {
        ...tareas[tareaIndex],
        estatus,
      };

      await tareaRepository.actualizarEstadoTarea(id, estatus);
      setTareas(tareasActualizadas);
    }
  };

  const crearTarea = async () => {
    const idTarea = (Math.random() * 10000).toFixed(0);
    const nuevaTareaCompleta: Tarea = {
      id: idTarea,
      proyectoId: proyectoId,
      nombre: nuevaTarea.nombre,
      descripcion: nuevaTarea.descripcion,
      fechaInicio: new Date().toISOString().split('T')[0],
      estatus: estatus,
    };
    await tareaRepository.crearTarea(nuevaTareaCompleta);
    setTareas((prevTareas) => [...prevTareas, nuevaTareaCompleta]);
    setModalVisible(false);
    setEstatus('no realizada');
    setNuevaTarea({ id: '', proyectoId: proyectoId, nombre: '', descripcion: '', fechaInicio: '', estatus: 'no realizada' });
  };

  const editarTarea = async () => {
    if (tareaSeleccionada) {
      await tareaRepository.actualizarTarea(tareaSeleccionada);
      setTareas((prevTareas) =>
        prevTareas.map((t) => (t.id === tareaSeleccionada.id ? tareaSeleccionada : t))
      );
      setEditModalVisible(false);
      setTareaSeleccionada(null);
    }
  };

  const eliminarTarea = async (id: string) => {
    await tareaRepository.eliminarTarea(id);
    setTareas((prevTareas) => prevTareas.filter(t => t.id !== id));
  };

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaSeleccionada(tarea);
    setEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixToButtons}>
        <TouchableOpacity style={styles.buttonPressable} onPress={() => router.push('/ToDo')}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Tareas para Proyecto {proyectoId}</Text>
        <TouchableOpacity style={styles.buttonPressable} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tareas}
        renderItem={({ item }) => (
          <View style={styles.tareaContainer}>
            <View style={styles.fixToButtons}>
              <Text style={styles.tareaTitle}>{item.nombre} ({item.estatus})</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => cambiarEstado(item.id, item.estatus === 'realizada' ? 'no realizada' : 'realizada')}>
                  <Ionicons
                    name={item.estatus === 'realizada' ? "checkmark-circle" : "close-circle"}
                    size={24}
                    color={item.estatus === 'realizada' ? "green" : "red"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => abrirModalEditar(item)}>
                  <Ionicons name="create" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarTarea(item.id)}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
            <Text>{item.descripcion}</Text>

            <View style={styles.containerFecha}>
              <Text style={styles.textFecha}>Fecha de Inicio: {item.fechaInicio}</Text>
            </View>

          </View>
        )}
        keyExtractor={(item) => item.id}
      />


      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Tarea</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la Tarea"
              value={nuevaTarea.nombre}
              onChangeText={(text) => setNuevaTarea({ ...nuevaTarea, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={nuevaTarea.descripcion}
              onChangeText={(text) => setNuevaTarea({ ...nuevaTarea, descripcion: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Guardar" color="#0079ff" onPress={crearTarea} />
              <Button title="Cancelar" color="#fd4a3f" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>


      <Modal visible={editModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Tarea</Text>
            {tareaSeleccionada && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de la Tarea"
                  value={tareaSeleccionada.nombre}
                  onChangeText={(text) => setTareaSeleccionada({ ...tareaSeleccionada, nombre: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Descripción"
                  value={tareaSeleccionada.descripcion}
                  onChangeText={(text) => setTareaSeleccionada({ ...tareaSeleccionada, descripcion: text })}
                />
                <View style={styles.modalButtons}>
                  <Button title="Guardar" color="#0079ff" onPress={editarTarea} />
                  <Button title="Cancelar" color="#fd4a3f" onPress={() => setEditModalVisible(false)} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  buttonPressable: { borderRadius: 50, marginVertical: 10, alignSelf: 'center', marginRight: 20, marginLeft: 20 },
  tareaContainer: { marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#dbd9ff' },
  tareaTitle: { fontSize: 18, fontWeight: 'bold', width: "60%" },
  fixToButtons: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20 },
  iconContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '50%', marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', width: '100%' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 10 },
  statusButton: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  containerFecha: { alignSelf: 'flex-end', justifyContent: 'flex-end', marginTop: 10 },
  textFecha: { fontSize: 14, color: 'green', fontWeight: 'bold' }
});

export default TareaScreen;
