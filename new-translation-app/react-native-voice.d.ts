declare module '@react-native-voice/voice' {
    export interface SpeechResultsEvent {
        value: string[];
    }

    const Voice: {
        onSpeechResults: (callback: (e: SpeechResultsEvent) => void) => void;
        start: (locale: string) => Promise<void>;
        stop: () => Promise<void>;
        destroy: () => Promise<void>;
        removeAllListeners: () => void;
    };

    export default Voice;
}