/* eslint-disable prettier/prettier */
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function SignInFacebook() {
    const usersCollection = firestore().collection('Users');
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

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            const user = (await auth().signInWithCredential(facebookCredential)).user;
            usersCollection.add({
                id: user.uid,
                name: user.displayName,
                email: user.email,
                imageUrl: user.photoURL,
                provider: facebookCredential.providerId,
            });

            // Sign-in the user with the credential
            return auth().signInWithCredential(facebookCredential);
        } catch (err) {
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
