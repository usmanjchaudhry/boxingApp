import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from './DetailScreen';
import Timer from './Timer'
import Recorder from './Recorder'

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
      <Button
        title="Go to Timer Screen"
        onPress={() => navigation.navigate('Timer')}
      />
      <Button
        title="Go to Recorder Screen"
        onPress={() => navigation.navigate('Recorder')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
