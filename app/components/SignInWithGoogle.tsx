/* eslint-disable prettier/prettier */
import React from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function SignInGoogle() {
    GoogleSignin.configure({
        webClientId:
            '1073107012067-s153pacfd8h98613e5q0fcip8p5ivs89.apps.googleusercontent.com',
    });
    async function onGoogleButtonPress() {
        console.log('Google Button Press');

        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        console.log('Google Play service success');

        // Get the users ID token
        try {
            const { idToken, user } = await GoogleSignin.signIn();
            console.log('idToken success', JSON.stringify(user));

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
        } catch (err) {
            console.log('idToken error:', JSON.stringify(err, null, 2));
        }
    }
    return (
        <Button
            title="Google Sign-In"
            onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
        />
    );
}

