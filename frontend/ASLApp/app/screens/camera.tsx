import * as MediaLibrary from 'expo-media-library';

import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';

import { StatusBar } from 'expo-status-bar';

// import { decode } from 'base64-arraybuffer';

export default function CameraScreen() { 
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions(); 
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [classifications, setClassifications] = useState({
    handSignLabel: '',
    fingerGestureLabel: '',
    handedness: '',
  });
  
  useEffect(() => {
    if (!mediaPermission) {
        requestMediaPermission();
    }
  }, [mediaPermission]);
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    // You can remove the automatic capture interval if you only want to capture on button press
    // let intervalId: NodeJS.Timeout | null = null;

    // if (permission?.granted) {
    //   intervalId = setInterval(async () => {
    //     if (cameraRef.current && !isCapturing) {
    //       takePicture();
    //     }
    //   }, 100);
    // }

    // return () => {
    //   if (intervalId) {
    //     clearInterval(intervalId);
    //   }
    // };
  }, [permission?.granted, isCapturing]);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, skipProcessing: true});
        // console.log('Picture URI:', photo.uri);
        console.log("Picture Base64:", photo?.base64?.substring(0, 100));

        // Step 1: Remove the base64 prefix
        const base64String = photo.base64.replace(/^data:image\/(png|jpeg);base64,/, '');

        // Step 2: Convert base64 string to a Blob (binary data)
        const binary = atob(base64String);  // Decode base64 string
        const array = Uint8Array.from(binary, char => char.charCodeAt(0));  // Convert to binary array
        const blob = new Blob([array], { type: 'image/png' });  // Create a Blob with the appropriate MIME type

        const formData = new FormData();
        formData.append("file", blob, "photo.png");
        // formData.append("file", {
        //   uri: photo.uri,
        //   name: "photo.png",
        //   type: "image/png",
        // });
        // formData.append('file', blob);
        
        console.log("HERE");
        const response = await fetch('http://172.23.27.203:8000/classify/', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log("OK");
        // console.log("DATA: " + data);
        // console.log("IMAGE: " + data.image);
        if (data.image) {
          const outputBase64 = data.image;
          // console.log("base64: " + outputBase64);
          setCapturedImage(outputBase64);
          setClassifications({
            handSignLabel: data.hand_sign_label || 'None',
            fingerGestureLabel: data.finger_gesture_label || 'None',
            handedness: data.handedness || 'None',
          });
          console.log("IMAGE SET");
          
        } else {
          Alert.alert('Error', 'No image returned from API');
          setCapturedImage(null);
          console.log("ERROR");
        }

        // const response = await fetch('http://172.23.27.203:8000/', {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        // });
        // const data = await response.json();
        // console.log("MESSAGE: " + data.message);
  
      } catch (error) {
        console.error('Error taking picture:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleCameraType = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (capturedImage) {
      setCapturedImage(null); // go back to camera
    } else {
      await takePicture(); // take photo
    }
  };
  
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!capturedImage ? (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
        >
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleCapture}
              style={styles.captureButton}
            >
              <Text>📸</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleCameraType}
              style={styles.flipButton}
            >
              <Text style={styles.flipButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: `data:image/png;base64,${capturedImage}` }}
            style={{ flex: 1, resizeMode: 'contain' }}
            />
          <View style={styles.textOverlay}>
            <Text style={styles.labelText}>Hand Sign: {classifications.handSignLabel}</Text>
            <Text style={styles.labelText}>Gesture: {classifications.fingerGestureLabel}</Text>
            <Text style={styles.labelText}>Handedness: {classifications.handedness}</Text>
          </View>
          <TouchableOpacity
            onPress={handleCapture}
            style={styles.retakeButton}
          >
            <Text>🔁 Retake</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonRow: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 20, // Adds space between buttons
  },
  captureButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  flipButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  flipButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  textOverlay: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  labelText: {
    color: 'white',
    fontSize: 18,
  },
});