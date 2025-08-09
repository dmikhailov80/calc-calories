'use client';

import { useSession } from 'next-auth/react';
import SignOutButton from '@/components/SignOutButton';
import SignInButton from '@/components/SignInButton';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Добро пожаловать!</h1>
          <div className="mb-6">
            <img 
              src={session.user?.image || ''} 
              alt="Profile" 
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <p className="text-lg font-medium text-gray-900">{session.user?.name}</p>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Калькулятор Калорий</h1>
        <p className="text-gray-600 mb-8">Войдите в систему для начала работы</p>
        
        <SignInButton />
      </div>
    </div>
  );
}
