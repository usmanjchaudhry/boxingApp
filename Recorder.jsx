import { StyleSheet, Text, TouchableOpacity, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';




const Recorder = () => {
  const navigation = useNavigation();
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();


  const [time, setTime] = useState(30);
  const [isThreeMinutes, setIsThreeMinutes] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [counter, setCounter] = useState(0);
  const [words, setWords] = useState("");
  const [soundPlayed, setSoundPlayed] = useState(false);





  const playSound = async () => {
    setSoundPlayed(true);
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require('./boxingBell.mp3'));
      await sound.playAsync();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }

  };

  const playSound2 = async () => {
    setSoundPlayed(true);
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require('./tenSecondWarning.m4a'));
      await sound.playAsync();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }

  };




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
    if (time === 11 && !soundPlayed) {
      playSound2();
      setSoundPlayed(false);

    }
    if (time === 1 && !soundPlayed) {
      playSound();
      setSoundPlayed(false);

    }
  }, [time, isThreeMinutes, soundPlayed]);





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
    setTime(30);
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

        <TouchableOpacity style={styles.overlay}>
            <Icon name="stop" size={'5000%'} color={words === "Fight" ? "rgba(0, 128, 0, 0.3)" : words === "Rest" ? "rgba(255, 0, 0, 0.3)" : "rgba(128, 128, 128, 0.3)"}/>
          </TouchableOpacity>

          <Text style={[styles.timer2Text, words === "Fight" ? styles.fightText : words === "Rest" ? styles.restText : styles.warmupText, time === 0 ? styles.endText : null]}>{words ? words : 'Warm Up'}</Text>
          <Text style={[styles.timerText, time === 0 ? styles.endText : null]}>{formattedTime}</Text>
          <Text style={styles.counterText}>Round: {counter}</Text>

  
          <TouchableOpacity style={styles.icon1} onPress={isRecording ? stopRecording : recordVideo}>
            <Icon name={isRecording ? 'stop' : 'play-arrow'} size={90} color="white" />
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.icon2} onPress={handleExit}>
            <Icon name={'exit-to-app'} size={90} color="white" />
          </TouchableOpacity>
  
        

        </View>
      </Camera>
  );
  
};

const styles = StyleSheet.create({


  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,

  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    


  },
  icon1: {
    borderRadius: 100, // Use a high value to make it more round
    width: 120, // Replace with your desired width
    height: 120,
    paddingVertical: 15,
    paddingHorizontal: 15,
    margin:20,
    borderWidth:2,
    borderColor:'white',
      },
      icon2: {
        borderRadius: 100, // Use a high value to make it more round
        width: 120, // Replace with your desired width
        height: 120,
        paddingVertical: 15,
        paddingHorizontal: 15,
        margin:20,
        borderWidth:2,
        borderColor:'white',
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
    top: '-420%',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 100,
    fontWeight: 'bold',
  },
  timer2Text: {
    position: 'absolute',
    top: '-350%',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 60,
    fontWeight: 'bold',
  },
  warmupText: {
    color: 'white',
    borderWidth:2,
    borderColor:'white',
    borderRadius: 20,
    width: 280, // Replace with your desired width
    height: 100,
    paddingVertical: 9,
    paddingHorizontal: 11,
    overflow: 'hidden', // add this to round the edges of the background color

  },
  fightText: {
    color: 'white',
    backgroundColor: 'green',
    borderWidth:2,
    borderColor:'white',
    borderRadius: 20,
    width: 230, // Replace with your desired width
    height: 100,
    paddingVertical: 9,
    paddingHorizontal: 45,
    overflow: 'hidden', // add this to round the edges of the background color

  },
  restText: {
    color: 'white',
    backgroundColor: 'red',
    borderWidth:2,
    borderColor:'white',
    borderRadius: 20,
    width: 220, // Replace with your desired width
    height: 100,
    paddingVertical: 9,
    paddingHorizontal: 45,
    overflow: 'hidden', // add this to round the edges of the background color

  },
  endText: {
    color: 'red',
  },
  
  video: {
    flex: 1,
    alignSelf: "stretch"
  },
  counterText: {
    position: 'absolute',
    top: -450,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
},
});

export default Recorder;
