import { useEffect, useRef } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface CameraFeedProps {
  isActive: boolean;
  onError: (error: string) => void;
}

export function CameraFeed({ isActive, onError }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      onError('Failed to access camera. Please ensure camera permissions are granted.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-2 border-[#FFD700]/30 shadow-xl shadow-[#FFD700]/10">
      {isActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-md border border-[#FFD700]/50 shadow-lg shadow-[#FFD700]/30">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50" />
            <span className="text-[#FFD700] text-sm">LIVE</span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-black to-[#1a1a1a]">
          <CameraOff className="w-16 h-16 text-[#FFD700]/30" />
          <p className="text-[#FFD700]/50">Camera is off</p>
        </div>
      )}
    </div>
  );
}
