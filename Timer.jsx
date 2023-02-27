import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const Timer = ({ }) => {

  const navigation = useNavigation();

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
              setTime(10);
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
      <View style={[styles.container, { backgroundColor: words === 'Fight' ? '#90EE90' : words === 'Rest' ? 'red' : 'yellow' }]}>
        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, words === "Fight" ? styles.fightText : words === "Rest" ? styles.restText : styles.warmupText, time === 0 ? styles.endText : null]}>{words ? words : 'Warmup'}</Text>
          <Text style={[styles.timerText, time === 0 ? styles.endText : null]}>{formattedTime}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={isRunning ? 'Pause' : 'Start'}
            onPress={handleStartStop}
            buttonStyle={styles.button}
          />
          <Button
            title='Exit'
            onPress={handleReset}
            buttonStyle={styles.button}
          />
          <Text style={styles.counterText}>Rounds: {counter}</Text>
        </View>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 50,
    textAlign: 'center',
  },
  warmupText: {
    color: 'black',
    backgroundColor: 'yellow',
  },
  fightText: {
    color: 'black',
    backgroundColor: '#90EE90',
  },
  restText: {
    color: 'black',
    backgroundColor: 'red'
  },
  endText: {
    color: 'red',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'grey',
    marginVertical: 10,
  },
  counterText: {
    fontSize: 30,
  },
});


export default Timer;
