import {
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import { styles } from './styles/HomeScreenStyle';
import * as Progress from 'react-native-progress';
import storage from '@react-native-firebase/storage';
import { useState } from 'react';

export default function HomeScreen() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    const selectImage = () => {
        ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            maxWidth: 2000,
            maxHeight: 2000,
        }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.errorCode) {
                console.log('User tapped custom button: ', response.errorCode);
            } else {
                const source = { uri: response.assets[0].uri };
                console.log(source);
                setImage(source);
            }
        });
    };
    const uploadImage = async () => {
        const { uri } = image;
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = uri;

        setUploading(true);
        setTransferred(0);

        const task = storage().ref(fileName).putFile(uploadUri);
        task.on('state_changed', (snapshot) => {
            setTransferred(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 1000);
        });
        try {
            await task;
        } catch (e) {
            console.log('Error in uploading image to firestore:', e);
        }
        setUploading(false);
        Alert.alert('Photo uploaded!',
            'Your photo has been uploaded to Firebase Cloud Storage!');
        setImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Welcome!{auth().currentUser?.email}</Text>
            <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
                <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image?.uri }} style={styles.imageBox} />
                ) : null}
                {uploading ? (
                    <View style={styles.progressBarContainer}>
                        <Progress.Bar progress={transferred} width={300} />
                    </View>
                ) : (
                    <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                        <Text style={styles.buttonText}>Upload image</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}
