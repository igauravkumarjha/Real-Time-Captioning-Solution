import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Download, 
  Trash2,
  Type,
  Settings
} from 'lucide-react';
import { Card } from './ui/card';

interface ControlPanelProps {
  isListening: boolean;
  isCameraActive: boolean;
  showSimplified: boolean;
  fontSize: number;
  onToggleListening: () => void;
  onToggleCamera: () => void;
  onToggleSimplified: (checked: boolean) => void;
  onFontSizeChange: (size: number) => void;
  onClearCaptions: () => void;
  onExportCaptions: () => void;
}

export function ControlPanel({
  isListening,
  isCameraActive,
  showSimplified,
  fontSize,
  onToggleListening,
  onToggleCamera,
  onToggleSimplified,
  onFontSizeChange,
  onClearCaptions,
  onExportCaptions,
}: ControlPanelProps) {
  return (
    <Card className="bg-[#1a1a1a] border-[#FFD700]/30 p-3 shadow-xl shadow-[#FFD700]/10 h-full flex flex-col justify-between">
      <div className="space-y-3">
        {/* Main Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onToggleCamera}
            variant={isCameraActive ? "default" : "outline"}
            size="sm"
            className={`w-full ${
              isCameraActive 
                ? 'bg-[#FFD700] text-black hover:bg-[#FFC107] shadow-lg shadow-[#FFD700]/30' 
                : 'bg-[#2a2a2a] text-[#FFD700] border-[#FFD700]/30 hover:bg-[#3a3a3a] hover:border-[#FFD700]/50'
            }`}
          >
            {isCameraActive ? (
              <>
                <Video className="w-3 h-3 mr-1" />
                Camera
              </>
            ) : (
              <>
                <VideoOff className="w-3 h-3 mr-1" />
                Camera
              </>
            )}
          </Button>

          <Button
            onClick={onToggleListening}
            variant={isListening ? "default" : "outline"}
            size="sm"
            className={`w-full ${
              isListening 
                ? 'bg-[#FFD700] text-black hover:bg-[#FFC107] shadow-lg shadow-[#FFD700]/30' 
                : 'bg-[#2a2a2a] text-[#FFD700] border-[#FFD700]/30 hover:bg-[#3a3a3a] hover:border-[#FFD700]/50'
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-3 h-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <MicOff className="w-3 h-3 mr-1" />
                Start
              </>
            )}
          </Button>
        </div>

        {/* Text Simplification */}
        <div className="flex items-center justify-between bg-[#2a2a2a] rounded-md p-2 border border-[#FFD700]/20">
          <span className="text-[#FFD700] text-xs">Simplified</span>
          <Switch
            checked={showSimplified}
            onCheckedChange={onToggleSimplified}
          />
        </div>

        {/* Font Size Control */}
        <div className="space-y-1">
          <Label className="text-[#FFD700] text-xs">
            Size: {fontSize}px
          </Label>
          <Slider
            value={[fontSize]}
            onValueChange={(values) => onFontSizeChange(values[0])}
            min={16}
            max={48}
            step={2}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onExportCaptions}
            variant="outline"
            size="sm"
            className="w-full bg-[#2a2a2a] text-[#FFD700] border-[#FFD700]/30 hover:bg-[#3a3a3a] hover:border-[#FFD700]/50"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button
            onClick={onClearCaptions}
            variant="outline"
            size="sm"
            className="w-full bg-[#2a2a2a] text-[#FFD700] border-[#FFD700]/30 hover:bg-[#3a3a3a] hover:border-[#FFD700]/50"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
