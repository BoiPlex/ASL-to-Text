import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Screen1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Communicate</Text>
        <Text style={styles.subtitle}>
          It's that easy! Now you may freely translate ASL.
        </Text>

        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} /> 
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <Pressable style={styles.button} onPress={() => router.push('/screens/camera')}>
          <Text style={styles.buttonText}>Let's Translate!</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#ddd',
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8, 
    textAlign: 'left'
  },
  subtitle: {
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
  },
  activeDot: {
    backgroundColor: '#d87aa6',
  },
  button: {
    backgroundColor: '#17376A',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
