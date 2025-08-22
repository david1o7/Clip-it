import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GALLERY_KEY = 'GALLERY_PHOTOS_URIS';
const PHOTOS_DIR = FileSystem.documentDirectory + 'photos';

async function ensurePhotosDir() {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

async function persistPhotoAndGetUri(tempUri: string) {
  await ensurePhotosDir();
  const extension = tempUri.split('.').pop() || 'jpg';
  const filename = `${Date.now()}.${extension}`;
  const destUri = `${PHOTOS_DIR}/${filename}`;
  await FileSystem.copyAsync({ from: tempUri, to: destUri });
  return destUri;
}

async function appendPhotoUri(uri: string) {
  try {
    const existing = await AsyncStorage.getItem(GALLERY_KEY);
    const list: string[] = existing ? JSON.parse(existing) : [];
    list.unshift(uri); // newest first
    await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save photo to gallery', e);
  }
}

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto =  async () => {
    if (!isCameraReady || isCapturing) return;
    if (!cameraRef.current || typeof cameraRef.current.takePictureAsync !== 'function') return;

    setIsCapturing(true);
    try {
      const options = {
        quality: 1,
        base64: false,
        exif: false,
      } as const;

      const takenPhoto = await cameraRef.current.takePictureAsync(options);

      // Do NOT auto-save. Show preview first.
      setPhoto(takenPhoto);
    } catch (e) {
      console.warn('Failed to take photo', e);
    } finally {
      setIsCapturing(false);
    }
  }; 

  const handleDeletePhoto = async () => {
    try {
      if (photo?.uri) {
        const info = await FileSystem.getInfoAsync(photo.uri);
        if (info.exists) {
          await FileSystem.deleteAsync(photo.uri, { idempotent: true });
        }
      }
    } catch (e) {
      console.warn('Failed to delete temp photo', e);
    } finally {
      setPhoto(null);
    }
  };

  const handleSavePhoto = async () => {
    if (!photo?.uri) return;
    try {
      const savedUri = await persistPhotoAndGetUri(photo.uri);
      await appendPhotoUri(savedUri);
    } catch (e) {
      console.warn('Failed to save photo', e);
    } finally {
      setPhoto(null);
    }
  };

  const handleRetakePhoto = () => {
    // Just close the preview and remount the camera
    setPhoto(null);
  };

  if (photo) return (
    <PhotoPreviewSection
      photo={photo}
      onDeletePhoto={handleDeletePhoto}
      onSavePhoto={handleSavePhoto}
      onRetakePhoto={handleRetakePhoto}
    />
  );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing} disabled={!isCameraReady || isCapturing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto} disabled={!isCameraReady || isCapturing}>
            <AntDesign name='camera' size={44} color='black' />
          </TouchableOpacity>
        </View>
        <Text style={{marginLeft:"5%",color:'white',fontSize:11}}>If Camera is not yet activated , press the camera switch icon</Text>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});