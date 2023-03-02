import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';



const Recorder = () => {
  const navigation = useNavigation();
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();


  const [time, setTime] = useState(10);
  const [isThreeMinutes, setIsThreeMinutes] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [counter, setCounter] = useState(0);
  const [words, setWords] = useState("");




  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (time === 0) {
      if (isThreeMinutes) {
        setIsThreeMinutes(false);
        setTime(60);
        setWords("Rest");
      } else {
        setIsThreeMinutes(true);
        setTime(180);
        setWords("Fight");
        setCounter((prevValue) => prevValue + 1);
      }
    }
  }, [time, isThreeMinutes]);





  const handleExit = () => {
    Alert.alert(
      'Confirm Exit',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => {
            navigation.navigate('Home'); // <--- navigate back to home screen



          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }
 
  let recordVideo = () => {
    setIsRecording(true);
    setIsRunning((prev) => !prev);
    let options = {
      quality: "1080p",
      mute: false
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  let stopRecording = () => {
    setIsRecording(false);
    setTime(10);
    setIsRunning(false);
    setIsThreeMinutes(false);
    setWords("");

    cameraRef.current.stopRecording();
  };

  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };



    

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{uri: video.uri}}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        <Button title="Share" onPress={shareVideo} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
      </SafeAreaView>
    );
  }

  const formattedTime = `${Math.floor(time / 60)
  .toString()
  .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
  return (
    <Camera style={styles.container} ref={cameraRef} type={Camera.Constants.Type.front}>
      <View style={styles.buttonContainer}>
      <Text style={[styles.timer2Text, words === "Fight" ? styles.fightText : words === "Rest" ? styles.restText : styles.warmupText, time === 0 ? styles.endText : null]}>{words ? words : 'Warmup'}</Text>
      <Text style={[styles.timerText, time === 0 ? styles.endText : null]}>{formattedTime}</Text>
        <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
        <Button title={'Exit'}
        onPress={handleExit}
           />

      </View>
    </Camera>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  timerText: {
    position: 'absolute',
    top: -680,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  warmupText: {
    color: 'black',
    backgroundColor: 'yellow',
  },
  fightText: {
    color: 'black',
    backgroundColor: 'green',
  },
  restText: {
    color: 'black',
    backgroundColor: 'red'
  },
  endText: {
    color: 'red',
  },
  
  video: {
    flex: 1,
    alignSelf: "stretch"
  }
});

export default Recorder;
