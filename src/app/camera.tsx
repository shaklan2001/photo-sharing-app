import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, Pressable, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { uploadToCloudinary } from '../lib/cloudinary';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState('off');
  const camera = useRef<CameraView>(null);

  const toggleCameraFacing = useCallback(() => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  },[]);

  const openFlash = useCallback(() => {
    setFlashMode(prevMode => (prevMode === 'off' ? 'on' : 'off'));
  },[]);

  const takePicture = useCallback(async () => {
    const photo = await camera.current?.takePictureAsync();
    const cloudinaryResponse =  await uploadToCloudinary(photo!.uri);
    console.log(cloudinaryResponse);
  },[]);

  if (!permission) {
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={camera} style={styles.camera} facing={facing} flash={flashMode} />
      <View className='w-full flex-row justify-between p-2 col-span-2 absolute bottom-32'>
        <Pressable onPress={openFlash}>
          {flashMode === 'on' ? <Ionicons name="flash-sharp" size={24} color="white" /> : <Ionicons name= "flash-outline" size={24} color="white" />}
        </Pressable>
        <Pressable onPress={toggleCameraFacing}>
          <MaterialCommunityIcons name="camera-flip-outline" size={24} color="white" />
        </Pressable>
      </View>
      <View className='w-full flex-row justify-evenly p-6'>
        <Pressable className='bg-white rounded-full w-20 h-20' onPress={takePicture}>
        </Pressable>
      </View>
    </View>
  );
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
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
