import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/**
 * Pose Detail screen — implemented in task 11.
 */
export default function PoseDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pose Detail</Text>
      <Text style={styles.subtitle}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F1E7', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#181818' },
  subtitle: { fontSize: 16, color: '#65744A', marginTop: 8 },
});
