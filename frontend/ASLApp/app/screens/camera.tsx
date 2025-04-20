import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

export default function CameraScreen() {
//   const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions(); 
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleFrame = (frame) => {
    // 🔍 Each frame here contains raw data
    console.log("Captured frame", frame);
    // You can send it to a model, extract pixel data, etc.
  }; 
  

  return (
    <View style={styles.container}>
        <CameraView 
        style={styles.camera}  
        ref={cameraRef} 
        onFrame={handleFrame} 
        isActive={true}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
