import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from './DetailScreen';
import Timer from './Timer'
import Recorder from './Recorder'
import { TouchableOpacity, Image} from 'react-native';


const Stack = createStackNavigator();

export default function App() {

  const goToHomeScreen = () => {
    navigation.navigate('Home');
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerLeft: () => null // Remove the back button
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false  }}
        />
        <Stack.Screen
          name="Timer"
          component={Timer}
          options={{ headerShown: false }}


        />
         <Stack.Screen
          name="Recorder"
          component={Recorder}
          options={{ headerShown: false }}


        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}





function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('./boxingIcon.png')} style={styles.logo} />

      <TouchableOpacity
        style={styles.topHalf}
        onPress={() => navigation.navigate('Timer')}
      >
        <Text style={styles.buttonText}>Timer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomHalf}
        onPress={() => navigation.navigate('Recorder')}
      >
        <Text style={styles.buttonText}>Timer + Recorder</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  topHalf: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    width: '80%',
    borderColor: 'white',
    borderWidth:3,
    height: '10%',
    color:'white',
    borderRadius: 100, // adjust this value to change the roundness of the edges
    top:'-10%',


    

    
  },
  bottomHalf: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    width: '80%',
    borderColor: 'white',
    borderWidth:3,
    marginTop:'10%',
    height: '10%',
    borderRadius: 100, // adjust this value to change the roundness of the edges
    top:'-10%'


  

  },
  buttonText: {
    color:'white',
    fontSize: '40%',
  },
  logo: {
    width: '80%',
    height:'80%',
    resizeMode: 'contain',
    top:'-10%'
  },
});
