import { View, Text, StyleSheet } from 'react-native';

/**
 * Gallery screen — implemented in task 13.
 */
export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F1E7', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#181818' },
});
