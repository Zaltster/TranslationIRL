import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import Voice from '@react-native-voice/voice';

interface TextBubble {
    id: number;
    text: string;
    position: {
        x: number;
        y: number;
    };
}

const CameraTextOverlay: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState<CameraType>(CameraType.front);
    const [faces, setFaces] = useState<FaceDetector.FaceFeature[]>([]);
    const [textBubbles, setTextBubbles] = useState<TextBubble[]>([]);
    const [isListening, setIsListening] = useState(false);
    const cameraRef = useRef<Camera | null>(null);

    const speechResultsHandler = useCallback((e: any) => {
        if (faces.length > 0 && e.value) {
            const face = faces[0];
            const newBubble: TextBubble = {
                id: Date.now(),
                text: e.value[0],
                position: { x: face.bounds.origin.x, y: face.bounds.origin.y - 50 }
            };
            setTextBubbles(prevBubbles => [...prevBubbles, newBubble]);
        }
    }, [faces]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        Voice.onSpeechResults = speechResultsHandler;

        return () => {
            Voice.destroy().then(() => {
                Voice.removeAllListeners();
            });
        };
    }, [speechResultsHandler]);

    const onFacesDetected = useCallback((result: FaceDetectionResult) => {
        if ((result as any).faces.length > 0) {
            setFaces((result as any).faces);
        }
    }, []);

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
            <Camera
                style={styles.camera}
                type={type}
                ref={cameraRef}
                onFacesDetected={onFacesDetected}
                faceDetectorSettings={{
                    mode: FaceDetector.FaceDetectorMode.fast,
                    detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                    runClassifications: FaceDetector.FaceDetectorClassifications.none,
                    minDetectionInterval: 100,
                    tracking: true,
                }}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(prevType =>
                                prevType === CameraType.back ? CameraType.front : CameraType.back
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