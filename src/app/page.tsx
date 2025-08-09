'use client';

import { useSession } from 'next-auth/react';
import SignOutButton from '@/components/SignOutButton';
import SignInButton from '@/components/SignInButton';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card p-8 rounded-lg border shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-foreground mb-6">Добро пожаловать!</h1>
          <div className="mb-6">
            <img 
              src={session.user?.image || ''} 
              alt="Profile" 
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <p className="text-lg font-medium text-foreground">{session.user?.name}</p>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-card p-8 rounded-lg border shadow-sm text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-foreground mb-2">Калькулятор Калорий</h1>
        <p className="text-muted-foreground mb-8">Войдите в систему для начала работы</p>
        
        <SignInButton />
      </div>
    </div>
  );
}
