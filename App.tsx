/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import SignInGoogle from './app/components/SignInWithGoogle';
import SignInFacebook from './app/components/SignInWithFacebook';

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
        <SignInGoogle />
        <SignInFacebook />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}
