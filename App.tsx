/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Facebook, SignInGoogle, PhoneSignIn, EmailSignIn } from './app/components';
import AppStack from './app/navigation/AppStack';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
        <EmailSignIn />
        <SignInGoogle />
        <Facebook />
        <PhoneSignIn />
      </View>
    );
  }

  return (
    <AppStack />
  );
}
