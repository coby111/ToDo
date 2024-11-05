import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Index() {
  const router = useRouter();

  const handleProyecto = () => {
    router.push('/ToDo')
   }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
      onPress={handleProyecto}
      >
        <Text>Ir a Tablero</Text>
      </TouchableOpacity>
      {/* <Text>Cargando...</Text>
      <ActivityIndicator
        size='large'
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  loading: {
    color: 'black',
    fontSize: 25
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5
  },
})