import { View, Text, StyleSheet } from 'react-native';

/**
 * Downloads screen — pose pack management.
 */
export default function DownloadsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Downloads</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F1E7', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#181818' },
});
