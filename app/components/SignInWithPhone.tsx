/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function PhoneSignIn() {
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);

    // verification code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');

    // Handle the button press
    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    }

    async function confirmCode() {
        try {
            await confirm?.confirm(code);
        } catch (error) {
            console.log('Invalid code.');
        }
    }
    if (!confirm) {
        return (
            <Button
                title="Phone Number Sign In"
                onPress={() => signInWithPhoneNumber('+917041735665')}
            />
        );
    }

    return (
        <>
            <TextInput value={code} onChangeText={text => setCode(text)} />
            <Button title="Confirm Code" onPress={() => confirmCode()} />
        </>
    );
}