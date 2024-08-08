/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function EmailSignIn() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // Handle the button press
    async function signInEmailPassword(email, password) {
        await auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }

    return (
        <>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#fff"
                onChangeText={e => setEmail(e)}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#fff"
                onChangeText={p => setPassword(p)}
            />
            <Button title="Sign-In with email" onPress={() => signInEmailPassword(email, password)} />
        </>
    );
}