import { useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface Caption {
  id: string;
  text: string;
  timestamp: number;
  simplified?: string;
}

interface CaptionDisplayProps {
  captions: Caption[];
  showSimplified: boolean;
  fontSize: number;
}

export function CaptionDisplay({ captions, showSimplified, fontSize }: CaptionDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new captions arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [captions]);

  return (
    <div className="h-full bg-[#1a1a1a] border-2 border-[#FFD700]/30 rounded-lg overflow-hidden shadow-xl shadow-[#FFD700]/10 flex flex-col">
      <div className="bg-[#2a2a2a] px-3 py-2 border-b border-[#FFD700]/30 flex-shrink-0">
        <h3 className="text-[#FFD700] m-0 text-base">Caption History</h3>
      </div>
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-3 space-y-2">
          {captions.length === 0 ? (
            <p className="text-[#FFD700]/50 text-center py-8 m-0 text-sm">
              No captions yet
            </p>
          ) : (
            captions.map((caption) => (
              <div 
                key={caption.id} 
                className="bg-[#2a2a2a] rounded-md p-2 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-[#FFD700] m-0 text-sm">
                    {showSimplified && caption.simplified 
                      ? caption.simplified 
                      : caption.text}
                  </p>
                  <span className="text-[#FFC107] text-xs">
                    {new Date(caption.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
