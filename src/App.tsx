import { useState, useEffect, useRef } from 'react';
import { CameraFeed } from './components/CameraFeed';
import { CaptionDisplay } from './components/CaptionDisplay';
import { LanguageSelector, INDIAN_LANGUAGES } from './components/LanguageSelector';
import { ControlPanel } from './components/ControlPanel';
import { SpeechRecognitionService } from './utils/speechRecognition';
import { simplifyCaption } from './utils/textSimplification';
import { Alert, AlertDescription } from './components/ui/alert';
import { AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

interface Caption {
  id: string;
  text: string;
  timestamp: number;
  simplified?: string;
}

export default function App() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [showSimplified, setShowSimplified] = useState(true);
  const [fontSize, setFontSize] = useState(24);
  const [error, setError] = useState<string | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);

  useEffect(() => {
    // Initialize speech recognition service
    speechServiceRef.current = new SpeechRecognitionService();

    if (!speechServiceRef.current.isAvailable()) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    // Setup callbacks
    speechServiceRef.current.onResult((result) => {
      if (result.isFinal) {
        // Add final caption to history
        const newCaption: Caption = {
          id: Date.now().toString(),
          text: result.transcript,
          timestamp: Date.now(),
          simplified: simplifyCaption(result.transcript),
        };
        setCaptions(prev => [...prev, newCaption]);
        setCurrentTranscript('');
      } else {
        // Show interim results
        setCurrentTranscript(result.transcript);
      }
    });

    speechServiceRef.current.onError((errorMsg) => {
      setError(errorMsg);
      toast.error(errorMsg);
      setIsListening(false);
    });

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // Update language when changed
    if (speechServiceRef.current) {
      speechServiceRef.current.setLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  const handleToggleListening = () => {
    if (!speechServiceRef.current?.isAvailable()) {
      setError('Speech recognition is not available');
      return;
    }

    if (isListening) {
      speechServiceRef.current.stop();
      setIsListening(false);
      toast.success('Captioning stopped');
    } else {
      const started = speechServiceRef.current.start();
      if (started) {
        setIsListening(true);
        setError(null);
        toast.success('Captioning started');
      }
    }
  };

  const handleToggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    if (!isCameraActive) {
      toast.success('Camera activated');
    } else {
      toast.info('Camera deactivated');
    }
  };

  const handleCameraError = (errorMsg: string) => {
    setError(errorMsg);
    toast.error(errorMsg);
    setIsCameraActive(false);
  };

  const handleClearCaptions = () => {
    setCaptions([]);
    setCurrentTranscript('');
    toast.success('Captions cleared');
  };

  const handleExportCaptions = () => {
    if (captions.length === 0) {
      toast.error('No captions to export');
      return;
    }

    const exportData = captions.map(caption => ({
      timestamp: new Date(caption.timestamp).toISOString(),
      original: caption.text,
      simplified: caption.simplified || caption.text,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `captions-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Captions exported successfully');
  };

  const displayCaptions = currentTranscript
    ? [
        ...captions,
        {
          id: 'interim',
          text: currentTranscript,
          timestamp: Date.now(),
          simplified: simplifyCaption(currentTranscript),
        },
      ]
    : captions;

  return (
    <div className="h-screen bg-black text-[#FFD700] p-4 flex flex-col overflow-hidden">
      <Toaster />
      
      {/* Header */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-lg flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-[#FFD700] m-0 text-xl">Real-Time Multilingual Captioning</h1>
              <p className="text-[#FFC107] text-xs m-0">
                AI-powered accessibility for Deaf and hard-of-hearing individuals
              </p>
            </div>
          </div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            disabled={isListening}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-[#1a1a1a] border-red-500/50 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Status Bar */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] border border-[#FFD700]/30 rounded-lg p-2 shadow-lg shadow-[#FFD700]/10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-[#00ff00] animate-pulse shadow-md shadow-[#00ff00]/50' : 'bg-[#666]'}`} />
            <span className="text-xs text-[#FFD700]">
              {isListening ? 'Listening...' : 'Standby'}
            </span>
          </div>
          <div className="h-4 w-px bg-[#FFD700]/20" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-[#FFD700] animate-pulse shadow-md shadow-[#FFD700]/50' : 'bg-[#666]'}`} />
            <span className="text-xs text-[#FFD700]">
              {isCameraActive ? 'Camera Active' : 'Camera Off'}
            </span>
          </div>
          <div className="h-4 w-px bg-[#FFD700]/20" />
          <span className="text-xs text-[#FFC107]">
            Language: {INDIAN_LANGUAGES.find(l => l.code === selectedLanguage)?.name}
          </span>
          <div className="h-4 w-px bg-[#FFD700]/20" />
          <span className="text-xs text-[#FFC107]">
            Captions: {captions.length}
          </span>
        </div>
      </div>

      {/* Main Content - Camera + Caption History */}
      <div className="flex-1 grid grid-cols-3 gap-4 mb-3 min-h-0">
        {/* Left - Camera Feed with Live Caption Overlay (2/3 width) */}
        <div className="col-span-2 h-full relative">
          <CameraFeed isActive={isCameraActive} onError={handleCameraError} />
          
          {/* Live Caption Overlay - Transparent, only text visible */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center pointer-events-none">
            {displayCaptions.length > 0 ? (
              <p 
                className="text-[#FFD700] text-center leading-relaxed m-0"
                style={{ 
                  fontSize: `${fontSize}px`,
                  textShadow: '0 0 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 1), -2px -2px 4px rgba(0, 0, 0, 1), 2px -2px 4px rgba(0, 0, 0, 1), -2px 2px 4px rgba(0, 0, 0, 1)'
                }}
              >
                {showSimplified && displayCaptions[displayCaptions.length - 1].simplified 
                  ? displayCaptions[displayCaptions.length - 1].simplified 
                  : displayCaptions[displayCaptions.length - 1].text}
              </p>
            ) : (
              <p 
                className="text-[#FFD700]/50 text-center italic m-0"
                style={{ 
                  textShadow: '0 0 15px rgba(0, 0, 0, 0.9), 2px 2px 4px rgba(0, 0, 0, 1)'
                }}
              >
                Waiting for speech...
              </p>
            )}
          </div>
        </div>

        {/* Right - Caption History (1/3 width) */}
        <div className="col-span-1 h-full">
          <CaptionDisplay
            captions={displayCaptions}
            showSimplified={showSimplified}
            fontSize={fontSize}
          />
        </div>
      </div>

      {/* Bottom - Controls */}
      <div className="flex-shrink-0 grid grid-cols-3 gap-4">
        {/* Empty space to maintain layout alignment */}
        <div className="col-span-2"></div>

        {/* Control Panel */}
        <div className="col-span-1">
          <ControlPanel
            isListening={isListening}
            isCameraActive={isCameraActive}
            showSimplified={showSimplified}
            fontSize={fontSize}
            onToggleListening={handleToggleListening}
            onToggleCamera={handleToggleCamera}
            onToggleSimplified={setShowSimplified}
            onFontSizeChange={setFontSize}
            onClearCaptions={handleClearCaptions}
            onExportCaptions={handleExportCaptions}
          />
        </div>
      </div>
    </div>
  );
}
