// import { View, StyleSheet } from "react-native";
// import { useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import Logo from './assets/icons/logo.png';
// //import * as Svg from 'react-native-svg';`

// export default function SplashScreen() {
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout (() => {
//       router.replace("/screens/screen1")
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}> 
//       {/* {* <Image source={Logo} style={{ width: 120, height: 120 }} /> */} */}
//     </View>
//   );
// }

//   const styles = StyleSheet.create ({
//     container: {
//       flex: 1,
//       justifyContent:"center",
//       alignItems:"center",
//     },
//   });

import { View, StyleSheet, Image } from "react-native";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Logo from './../assets/icons/logo.png';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/screen1");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}> 
      <Image source={Logo} style={{ width: "100%", height: "90%" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
  },
});
