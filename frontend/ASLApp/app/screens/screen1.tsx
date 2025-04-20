import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Wave from './../../assets/icons/wave.png';

export default function Screen1() {
  const router = useRouter();

  return (
    <View style={styles.container}> 

      <Image source={Wave} style={{ width: "100%", position: 'absolute', bottom: 0 }} />

      <View style={styles.card}> 
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          to <Text style={styles.bold}>PalmReader</Text>, the real-time American Sign Language (ASL) camera translator!
        </Text>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} /> 
          <View style={styles.dot} />
        </View> 

        <Pressable style={styles.button} onPress={() => router.push('/screens/screen2')}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: '#F6B92E',
  },
  card: {
    backgroundColor: 'white',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 12, 
    textAlign: 'left',
    paddingHorizontal: 15,
  },
  subtitle: {
    textAlign: 'left',
    fontSize: 18,
    marginBottom: 32,
    paddingHorizontal: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
    justifyContent: 'center',
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
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
