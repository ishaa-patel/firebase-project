/* eslint-disable prettier/prettier */
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native';
import { isUserExist } from '../utils/SignInWithOAuth';

const signInWithFacebook = async (data: any) => {
    try {
        // Create a credential with the Facebook access token
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        isUserExist(facebookCredential);
    } catch (error: any) {
        // Handle errors
        if (error.code === 'auth/account-exists-with-different-credential') {
            console.log('That email address is already in use!');
        } else if (error.code === 'auth/invalid-credential') {
            console.log('The credential is invalid!');
        } else {
            console.error('Authentication error:', error);
        }
    }
};
export default function Facebook() {
    async function onFacebookButtonPress() {
        try {
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['email']);
            console.log('Result success:', result);

            if (result.isCancelled) {
                throw 'User cancelled the login process';
            }

            // Once signed in, get the users AccessToken
            const data = await AccessToken.getCurrentAccessToken();
            console.log('Data success:', data);

            if (!data) {
                throw 'Something went wrong obtaining access token';
            }
            signInWithFacebook(data);
            return;
        }
        catch (err) {
            console.log('FB Login Error:', JSON.stringify(err));
        }
    }
    return (
        <Button
            title="Facebook Sign-In"
            onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
        />
    );
}
