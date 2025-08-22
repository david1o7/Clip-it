import { AntDesign, Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

const PhotoPreviewSection = ({
    photo,
    onDeletePhoto,
    onSavePhoto,
    onRetakePhoto,
}: {
    photo: CameraCapturedPicture;
    onDeletePhoto: () => void;
    onSavePhoto: () => void;
    onRetakePhoto: () => void;
}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewConatiner}
                source={{ uri: photo.uri }}
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onDeletePhoto}>
                <Fontisto name='trash' size={36} color='black' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onSavePhoto}>
                <Fontisto name='save' size={36} color='black' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRetakePhoto}>
                <AntDesign name='retweet' size={36} color='black' />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: "center",
    },
    previewConatiner: {
        width: '95%',
        height: '85%',
        borderRadius: 15
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: "center",
        width: '100%',
        gap: 16,
    },
    button: {
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    }

});

export default PhotoPreviewSection;