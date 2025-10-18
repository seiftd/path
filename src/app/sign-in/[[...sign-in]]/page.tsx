'use client';

import { SignIn } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'

export default function Page() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('auth.signIn')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.welcome')}
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
            }
          }}
        />
      </div>
    </div>
  )
}
