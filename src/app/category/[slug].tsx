import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/**
 * Category filtered pose list — implemented in task 10.
 */
export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category: {slug}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F1E7', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#181818' },
});
