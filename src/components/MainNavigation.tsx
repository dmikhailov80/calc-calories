'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, BookOpen, Clock, Plus, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const navigationItems = [
  {
    name: 'Главная',
    href: '/',
    icon: Home,
  },
  {
    name: 'Ингридиенты',
    href: '/ingredients',
    icon: BookOpen,
  },
  {
    name: 'Рецепты',
    href: '/recipes',
    icon: ChefHat,
  },
  {
    name: 'История готовки',
    href: '/cooking-history',
    icon: Clock,
  },
];

export default function MainNavigation() {
  const pathname = usePathname();

  const NavigationContent = () => (
    <div className="flex flex-col space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
      
      <Separator className="my-4" />
      
      <Link
        href="/new-cooking"
        className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="font-semibold">Новая готовка</span>
      </Link>
    </div>
  );

  return (
    <>
      {/* Десктопное меню */}
      <div className="hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-64 lg:bg-background lg:border-r lg:border-border lg:flex-col lg:p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground">Калькулятор Калорий</h1>
        </div>
        <NavigationContent />
      </div>

      {/* Нижняя навигация для мобильных */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 sm:px-4 py-2">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-1 sm:px-2 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 min-[420px]:h-4 min-[420px]:w-4 sm:h-5 sm:w-5" />
                <span className="hidden min-[420px]:block text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
          <Link
            href="/new-cooking"
            className="flex flex-col items-center space-y-1 px-2 sm:px-3 py-1 rounded-lg bg-primary text-primary-foreground"
          >
            <Plus className="h-5 w-5 min-[420px]:h-4 min-[420px]:w-4 sm:h-5 sm:w-5" />
            <span className="hidden min-[420px]:block text-xs font-semibold">Готовка</span>
          </Link>
        </div>
      </div>
    </>
  );
}
