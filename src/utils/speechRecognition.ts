// Speech Recognition utility with Web Speech API

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class SpeechRecognitionService {
  private recognition: any;
  private isSupported: boolean;
  private onResultCallback?: (result: SpeechRecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;
  private isRunning: boolean = false;

  constructor() {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    this.isSupported = !!SpeechRecognition;

    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      const confidence = lastResult[0].confidence;
      const isFinal = lastResult.isFinal;

      if (this.onResultCallback) {
        this.onResultCallback({
          transcript,
          confidence,
          isFinal
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Don't restart on not-allowed error
      if (event.error === 'not-allowed') {
        this.isRunning = false;
      }
      
      if (this.onErrorCallback) {
        let errorMessage = 'Speech recognition error occurred';
        switch (event.error) {
          case 'no-speech':
            // Don't show error for no-speech, just continue listening
            return;
          case 'audio-capture':
            errorMessage = 'Microphone access failed. Please check your microphone connection.';
            this.isRunning = false;
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access and refresh the page.';
            this.isRunning = false;
            break;
          case 'network':
            errorMessage = 'Network error occurred. Speech recognition requires internet connection.';
            break;
          case 'aborted':
            // Don't show error for aborted, it's intentional
            return;
        }
        this.onErrorCallback(errorMessage);
      }
    };

    this.recognition.onstart = () => {
      this.isRunning = true;
    };

    this.recognition.onend = () => {
      // Auto-restart if it was running and stopped unexpectedly
      if (this.isRunning) {
        try {
          this.recognition.start();
        } catch (e) {
          console.log('Recognition restart failed:', e);
          this.isRunning = false;
        }
      }
    };
  }

  public setLanguage(languageCode: string) {
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
  }

  public start() {
    if (!this.isSupported) {
      if (this.onErrorCallback) {
        this.onErrorCallback('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      }
      return false;
    }

    try {
      this.isRunning = true;
      this.recognition.start();
      return true;
    } catch (error: any) {
      console.error('Failed to start recognition:', error);
      if (error.message && error.message.includes('already started')) {
        // Recognition is already running, that's fine
        this.isRunning = true;
        return true;
      }
      this.isRunning = false;
      if (this.onErrorCallback) {
        this.onErrorCallback('Failed to start speech recognition. Please refresh the page and try again.');
      }
      return false;
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.log('Stop recognition error (safe to ignore):', error);
      }
    }
  }

  public onResult(callback: (result: SpeechRecognitionResult) => void) {
    this.onResultCallback = callback;
  }

  public onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  public isAvailable(): boolean {
    return this.isSupported;
  }
}
