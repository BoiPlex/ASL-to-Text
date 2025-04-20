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
  useEffect(() => {
    if (!mediaPermission) {
        requestMediaPermission();
    }
  }, [mediaPermission]);
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    // You can remove the automatic capture interval if you only want to capture on button press
    let intervalId: NodeJS.Timeout | null = null;

    if (permission?.granted) {
      intervalId = setInterval(async () => {
        if (cameraRef.current && !isCapturing) {
          setIsCapturing(true);
          try {
            const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
            console.log('Captured photo at', new Date().toISOString());
          } catch (e) {
            console.error("Capture error:", e);
          } finally {
            setIsCapturing(false);
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
          
        } else {
          Alert.alert('Error', 'No image returned from API');
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
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing} />
        <View style={styles.overlay}>
          
          {/* Bottom Speech Bubble (You can customize this) */}
          <View style={styles.bottomBubble}>
            <View style={styles.bubbleRect}>
              <Text style={styles.bubbleText}>Tap the button to capture</Text>
            </View>
          </View>

          {/* Toggle Front/Back Camera */}
          <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
            <Text style={styles.toggleButtonText}>
                {facing === 'back' ? 'Front' : 'Back'}
                {/* replace text with cam switch icon */}
            </Text>
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isCapturing}>
            <View style={[styles.captureButtonInner, isCapturing && styles.capturing]} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Display the image if available */}
      {capturedImage ? (
        <Image
          source={{ uri: `data:image/png;base64,${capturedImage}` }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      ) : (
        <Text style={{ color: 'white', marginTop: 20 }}>No image to display</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  bottomBubble: {
    marginBottom: 30,
    width: '100%',
  },
  bubbleRect: {
    backgroundColor: 'white',
    paddingVertical: 30,
    // paddingHorizontal: 20,
    borderRadius: 10,
  },
  bubbleText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E91E63', // Pink color
  },
  capturing: {
    backgroundColor: '#FF4081', // A slightly lighter pink when capturing
  },
  toggleButton: {
    position: 'absolute',
    bottom: 65,
    right: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 10,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
  }, 
});