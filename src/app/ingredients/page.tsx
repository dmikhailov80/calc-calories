'use client';

import { useSession } from 'next-auth/react';
import { BookOpen } from 'lucide-react';

export default function IngredientsPage() {
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

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card p-8 rounded-lg border shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-foreground mb-4">Доступ запрещен</h1>
          <p className="text-muted-foreground">Войдите в систему для просмотра ингридиентов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Ингридиенты</h1>
      </div>
      
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <p className="text-muted-foreground">
          Здесь будет список всех ингридиентов с их калорийностью и питательной ценностью.
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          Функционал в разработке...
        </div>
      </div>
    </div>
  );
}
