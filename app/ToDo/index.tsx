import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TextInput, TouchableOpacity, useWindowDimensions
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Proyecto, EstadoProyecto } from '../../components/features/proyecto/domain/entities/Proyecto';
import { ProyectoRepository } from '../../components/features/proyecto/infraestructure/repositories/ProyectoRepository';
import { ProyectoDataSource } from '../../components/features/proyecto/infraestructure/datasources/ProyectoDataSource';
import { Ionicons } from '@expo/vector-icons';

const ProyectoScreen = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estatus, setEstatus] = useState<EstadoProyecto>('pendiente');
  const proyectoRepository = new ProyectoRepository(new ProyectoDataSource());
  const { width } = useWindowDimensions();

  useEffect(() => {
    const cargarProyectos = async () => {
      const proyectosEjemplo = [
        { id: '1', nombre: 'Proyecto 1', descripcion: 'Descripción del Proyecto 1', estatus: 'pendiente' as EstadoProyecto },
        { id: '2', nombre: 'Proyecto 2', descripcion: 'Descripción del Proyecto 2', estatus: 'en progreso' as EstadoProyecto },
        { id: '3', nombre: 'Proyecto 3', descripcion: 'Descripción del Proyecto 3', estatus: 'terminado' as EstadoProyecto }
      ];
      await Promise.all(proyectosEjemplo.map(proyecto => proyectoRepository.crearProyecto(proyecto)));
      setProyectos(await proyectoRepository.obtenerProyectos());
    };
    cargarProyectos();
  }, []);

  const cambiarEstado = async (id: string, nuevoEstatus: EstadoProyecto) => {
    const index = proyectos.findIndex(p => p.id === id);
    if (index > -1) {
      const proyectosActualizados = [...proyectos];
      proyectosActualizados[index].estatus = nuevoEstatus;
      await proyectoRepository.actualizarEstadoProyecto(id, nuevoEstatus);
      setProyectos(proyectosActualizados);
    }
  };

  const agregarProyecto = async () => {
    const nuevoProyecto = { id: (proyectos.length + 1).toString(), nombre, descripcion, estatus };
    await proyectoRepository.crearProyecto(nuevoProyecto);
    setProyectos([...proyectos, nuevoProyecto]);
    setModalVisible(false);
    setNombre(''); setDescripcion(''); setEstatus('pendiente');
  };

  const renderEstadoIcono = (item: Proyecto, estado: EstadoProyecto, actual: EstadoProyecto) => {
    const iconData: { [key in EstadoProyecto]: { name: 'checkmark-circle' | 'hourglass' | 'alert-circle', color: string } } = {
      'terminado': { name: 'checkmark-circle', color: actual === 'terminado' ? 'green' : 'gray' },
      'en progreso': { name: 'hourglass', color: actual === 'en progreso' ? 'orange' : 'gray' },
      'pendiente': { name: 'alert-circle', color: actual === 'pendiente' ? 'red' : 'gray' }
    };
    const { name, color } = iconData[estado];
    return (
      <TouchableOpacity onPress={() => cambiarEstado(item.id, estado)}>
        <Ionicons name={name} size={24} color={color} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixToButtons}>
        <Text style={styles.header}>Proyectos ({proyectos.length})</Text>
        <TouchableOpacity style={styles.buttonPressable} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={proyectos}
        renderItem={({ item }) => (
          <View style={[styles.proyectoContainer, { width: width * 0.9 }]}>
            <View style={styles.fixToButtons}>
              <Text style={styles.proyectoTitle}>{item.nombre} ({item.estatus})</Text>
              <View style={styles.estadoIcons}>
                {['terminado', 'en progreso', 'pendiente'].map((estado, index) => (
                  <React.Fragment key={`${item.id}-${estado}`}>
                    {renderEstadoIcono(item, estado as EstadoProyecto, item.estatus)}
                  </React.Fragment>
                ))}
                <Link href={`/ToDo/${item.id}`} style={[styles.estadoIcons, { width: 30 }]} key={`link-${item.id}`}>
                  <Ionicons name="list" size={24} />
                </Link>
              </View>
            </View>
            <Text style={styles.textDescription}>{item.descripcion}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />


      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Proyecto</Text>
            <TextInput placeholder="Nombre del proyecto" style={styles.input} value={nombre} onChangeText={setNombre} />
            <TextInput placeholder="Descripción del proyecto" style={styles.input} value={descripcion} onChangeText={setDescripcion} />
            <View style={styles.modalButtons}>
              <Button title="Agregar" color="#0079ff" onPress={agregarProyecto} />
              <Button title="Cancelar" color="#fd4a3f" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', alignSelf: 'center' },
  proyectoContainer: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', alignSelf: 'center', backgroundColor: '#dbd9ff', borderRadius: 10, marginVertical: 10 },
  proyectoTitle: { fontSize: 18, fontWeight: 'bold', width: "60%" },
  buttonPressable: { borderRadius: 50, marginVertical: 10, alignSelf: 'center', marginRight: 30 },
  buttonVerTareas: { padding: 10, backgroundColor: 'blue', borderRadius: 5, marginLeft: 1, marginBottom: 20 },
  textButtonVerTareas: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  fixToButtons: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  estadoIcons: { flexDirection: 'row', justifyContent: 'space-around', width: '50%' },
  textDescription: { color: '#666', textAlign: 'justify' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', width: '100%' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 10 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 }
});

export default ProyectoScreen;
