/* eslint-disable prettier/prettier */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const isUserExist = async (credential: any, _user: any) => {
    // Attempt to sign in with the credential
    await auth().signInWithCredential(credential);

    const usersCollection = firestore().collection('Users');

    // Check if the user exists in the database
    const userDoc = await usersCollection
        .where('id', '==', _user?.id)
        .get();
    const checkEmail = await usersCollection.where('email', '==', _user?.email).get();
    console.log(checkEmail.size);

    if (userDoc.size === 0) {
        if (checkEmail.size === 0) {
            // If the user does not exist, create a new user document
            if (credential.providerId === 'google.com') {
                await usersCollection.add({
                    id: _user?.id,
                    name: _user?.name,
                    familyName: _user?.familyName,
                    givenName: _user?.givenName,
                    email: _user?.email,
                    imageUrl: _user?.photo,
                    provider: credential.providerId,
                });
            }
            else if (credential.providerId === 'facebook.com') {
                await usersCollection.add({
                    id: _user?.id,
                    firstName: _user?.first_name,
                    lastName: _user?.last_name,
                    name: _user?.name,
                    email: _user?.email,
                    imageUrl: _user?.picture.data.url,
                    provider: credential.providerId,
                });
            }
        }
        else if (checkEmail.size !== 0) {
            console.log('User exists with same email.Check your Email ID');
        }
        else {
            return;
        }
    }
    else {
        console.log('User signed in successfully');
    }
};
