import { View, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>This screen does not exist.</Text>
        <Link href="/(tabs)">
          <Text>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}
