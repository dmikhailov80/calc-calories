'use client';

import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewCookingPage() {
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
          <p className="text-muted-foreground">Войдите в систему для создания новой готовки</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Plus className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Новая готовка</h1>
      </div>
      
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <p className="text-muted-foreground mb-6">
          Создайте новое блюдо, выберите ингридиенты и автоматически рассчитайте калории.
        </p>
        
        <div className="space-y-4">
          <Button className="w-full" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Создать новое блюдо
          </Button>
          
          <Button variant="outline" className="w-full" size="lg">
            Использовать готовый рецепт
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-muted-foreground">
          Функционал в разработке...
        </div>
      </div>
    </div>
  );
}
