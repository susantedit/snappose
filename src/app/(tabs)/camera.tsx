import { View, Text, StyleSheet } from 'react-native';

/**
 * Camera screen — implemented in task 22.
 */
export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F6F1E7' },
});
