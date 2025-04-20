import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Screen1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Scan</Text>
        <Text style={styles.subtitle}>
          Point the camera at ASL signs in real-time or take a picture to translate.
        </Text>

        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} /> 
          <View style={styles.dot} />
        </View>

        <Pressable style={styles.button} onPress={() => router.push('/screens/screen3')}>
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
      backgroundColor: '#ddd',
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
  