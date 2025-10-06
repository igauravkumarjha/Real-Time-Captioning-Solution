import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Globe } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const INDIAN_LANGUAGES: Language[] = [
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange, 
  disabled 
}: LanguageSelectorProps) {
  const currentLanguage = INDIAN_LANGUAGES.find(lang => lang.code === selectedLanguage);

  return (
    <div className="flex items-center gap-3">
      <Globe className="w-5 h-5 text-[#FFD700]" />
      <Select value={selectedLanguage} onValueChange={onLanguageChange} disabled={disabled}>
        <SelectTrigger className="w-[280px] bg-[#1a1a1a] border-[#FFD700]/40 text-[#FFD700] hover:border-[#FFD700]/60 transition-colors shadow-lg shadow-[#FFD700]/10">
          <SelectValue>
            {currentLanguage ? (
              <span>
                {currentLanguage.name} ({currentLanguage.nativeName})
              </span>
            ) : (
              'Select Language'
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-[#FFD700]/40">
          {INDIAN_LANGUAGES.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="text-[#FFD700] focus:bg-[#2a2a2a] focus:text-[#FFD700]"
            >
              {language.name} ({language.nativeName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
