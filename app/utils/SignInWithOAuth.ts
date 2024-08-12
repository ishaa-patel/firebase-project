/* eslint-disable prettier/prettier */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const isUserExist = async (credential: any) => {
    // Attempt to sign in with the credential
    await auth().signInWithCredential(credential);

    const usersCollection = firestore().collection('Users');
    const user = auth().currentUser;

    // Check if the user exists in the database
    const userDoc = await usersCollection
        .where('id', '==', user?.uid)
        .get();
    const checkEmail = await usersCollection.where('email', '==', user?.email).get();
    if (userDoc.size === 0) {
        if (checkEmail.size === 0) {
            // If the user does not exist, create a new user document
            await usersCollection.add({
                id: user?.uid,
                name: user?.displayName,
                email: user?.email,
                imageUrl: user?.photoURL,
                provider: credential.providerId,
            });
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
