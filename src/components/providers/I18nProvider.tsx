'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Set document direction based on language
      const isRTL = i18n.language === 'ar';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language, isClient]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
