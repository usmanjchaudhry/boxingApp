import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';





const Timer = ({ }) => {

  const navigation = useNavigation();

    const [time, setTime] = useState(13);
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
  
  
    const handleStartStop = () => {
      setIsRunning((prev) => !prev);
    };
  
    const handleReset = () => {
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
              setTime(13);
              setIsRunning(false);
              setIsThreeMinutes(false);
              setCounter(0);
              setWords("");
              navigation.navigate('Home'); // <--- navigate back to home screen



            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    };

  
  
    const formattedTime = `${Math.floor(time / 60)
      .toString()
      .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
  
    return (
      <View style={[styles.container, { backgroundColor: words === 'Fight' ? '#00A619' : words === 'Rest' ? 'red' : 'black' }]}>
        
        <View style={[styles.timerContainer,{backgroundColor: words === 'Fight' ? '#00A619' : words === 'Rest' ? 'red' : 'grey' }]}>
        <Text style={[styles.timerText, time === 0 ? styles.endText : null]}>{formattedTime}</Text>
          <Text style={[styles.timer2Text, words === "Fight" ? styles.fightText : words === "Rest" ? styles.restText : styles.warmupText, time === 0 ? styles.endText : null]}>{words ? words : 'Warmup'}</Text>
          <Text style={styles.counterText}>Rounds: {counter}</Text>

        </View>
        
        <View style={[styles.buttonContainer,{ backgroundColor: words === 'Fight' ? '#00A619' : words === 'Rest' ? 'red' : 'grey' }]}>
          <Button

            icon={<Icon name={isRunning ? 'pause' : 'play-arrow'} size={50} color="white" />}

            onPress={handleStartStop}
            buttonStyle={[styles.button,{ backgroundColor: words === 'Fight' ? '#00A619' : words === 'Rest' ? 'red' : 'grey' }]}

            titleStyle={{ color: 'white' }} // add this line
            />
          <Button
            icon={<Icon name="exit-to-app" size={50} color="white" />}
            onPress={handleReset}
            buttonStyle={[styles.button,{ backgroundColor: words === 'Fight' ? '#00A619' : words === 'Rest' ? 'red' : 'grey' }]}
            titleStyle={{ color: 'white' }} // add this line
            />
        </View>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    width: 350,
    alignSelf: 'center',
    borderRadius: 20, // adjust this value to change the roundness of the edges
    marginTop: 50,
    borderWidth:2,
    borderColor:'white',


  },
  timerText: {
    fontSize: 120,
    textAlign: 'center',
    color: 'white'
  },
  timer2Text: {
    fontSize: 80,
    textAlign: 'center',
    color: 'white'

  },
  warmupText: {
    color: 'white',
    


  },
  fightText: {
    color: 'white',
  },
  restText: {
    color: 'white',
  },
  endText: {
    color: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
    backgroundColor: 'green',
    flexDirection: 'row',
    borderRadius: 20, // adjust this value to change the roundness of the edges
    width: 350,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderWidth:2,
    borderColor:'white',



  },
  button: {
    borderRadius: 100, // Use a high value to make it more round
    width: 90, // Replace with your desired width
    height: 90,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin:40,
    borderWidth:2,
    borderColor:'white',
    
  },

  
  counterText: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white'  ,
    marginTop: 20 
},
});


export default Timer;
