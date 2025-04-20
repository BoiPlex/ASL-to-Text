import { View, StyleSheet } from "react-native";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout (() => {
      router.replace("/screens/screen1")
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* logo svg here */}
    </View>
  );
}

  const styles = StyleSheet.create ({
    container: {
      flex: 1,
      justifyContent:"center",
      alignItems:"center",
    },
  });
