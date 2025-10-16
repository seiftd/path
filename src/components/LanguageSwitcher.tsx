'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <Button variant="ghost" className="flex items-center space-x-2">
        <Globe className="w-4 h-4" />
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
      </Button>
      
      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg ${
              i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {i18n.language === language.code && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
