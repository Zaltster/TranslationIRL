import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import Voice from '@react-native-voice/voice';

const CameraTextOverlay = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [textBubbles, setTextBubbles] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        Voice.onSpeechResults = onSpeechResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechResults = (e) => {
        const newBubble = {
            id: Date.now(),
            text: e.value[0],
            position: { x: Math.random() * 300, y: Math.random() * 500 }
        };
        setTextBubbles(prevBubbles => [...prevBubbles, newBubble]);
    };

    const startListening = async () => {
        try {
            await Voice.start('en-US');
            setIsListening(true);
        } catch (e) {
            console.error(e);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (e) {
            console.error(e);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={isListening ? stopListening : startListening}
                    >
                        <Text style={styles.text}>
                            {isListening ? 'Stop Listening' : 'Start Listening'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {textBubbles.map((bubble) => (
                    <View
                        key={bubble.id}
                        style={[
                            styles.textBubble,
                            { left: bubble.position.x, top: bubble.position.y }
                        ]}
                    >
                        <Text>{bubble.text}</Text>
                    </View>
                ))}
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    textBubble: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
});

export default CameraTextOverlay;