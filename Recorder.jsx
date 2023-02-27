import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

const Recorder = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.front);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleRecordPress = async () => {
    if (isRecording) {
      setIsSaving(true);
      await cameraRef.current.stopRecording();
      setIsRecording(false);
      setIsSaving(false);
      setVideoSource(videoRef.current.uri);
      await saveToCameraRollAsync(videoRef.current.uri);
    } else {
      setIsRecording(true);
      const { uri } = await cameraRef.current.recordAsync();
      videoRef.current = { uri };
    }
  };

  const saveToCameraRollAsync = async (uri) => {
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync('Expo Videos', asset, false);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ratio="16:9"
        ref={cameraRef}
        onCameraReady={() => {
          videoRef.current = null;
          setVideoSource(null);
        }}
      >
        <View style={styles.buttonContainer}>
          {videoSource ? (
            <Video
              source={{ uri: videoSource }}
              style={styles.video}
              shouldPlay
              isLooping
              resizeMode="cover"
              onPlaybackStatusUpdate={(status) => {
                if (!status.isPlaying) {
                  setVideoSource(null);
                }
              }}
            />
          ) : (
            <TouchableOpacity
              style={[styles.button, isRecording ? styles.recordingButton : null]}
              onPress={handleRecordPress}
              disabled={isSaving}
            >
              <Text style={styles.text}>{isRecording ? 'Stop' : 'Record'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: 'red',
  },
  text: {
    fontSize: 18,
  },
  video: {
    flex: 1,
  },
});

export default Recorder;
