declare module '@react-native-voice/voice' {
    interface SpeechResultsEvent {
        value: string[];
    }

    interface SpeechErrorEvent {
        error: {
            message: string;
            code: string;
        };
    }

    const Voice: {
        onSpeechResults: (callback: (e: SpeechResultsEvent) => void) => void;
        onSpeechError: (callback: (e: SpeechErrorEvent) => void) => void;
        start: (locale?: string) => Promise<void>;
        stop: () => Promise<void>;
        destroy: () => Promise<void>;
        removeAllListeners: () => void;
    };

    export default Voice;
}