'use client';

import { AlertTriangle, CheckCircle } from 'lucide-react';
import { memo } from 'react';

interface ValidationSummaryProps {
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
  className?: string;
  mode?: 'add' | 'edit'; // Добавляем режим для контроля отображения
}

/**
 * Компонент для отображения общего состояния валидации формы
 */
function ValidationSummary({ 
  isValid, 
  isDirty, 
  errors, 
  className = '',
  mode = 'add'
}: ValidationSummaryProps) {
  // В режиме редактирования показываем ошибки даже если форма не изменена
  const shouldShowValidation = isDirty || (mode === 'edit' && Object.keys(errors).length > 0);
  
  if (!shouldShowValidation) {
    return null;
  }

  const errorCount = Object.keys(errors).length;

  if (isValid && errorCount === 0) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-800 font-medium">
            Все поля заполнены корректно
          </p>
        </div>
      </div>
    );
  }

  if (errorCount > 0) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium mb-2">
              {errorCount === 1 
                ? 'Исправьте ошибку перед сохранением:' 
                : `Исправьте ${errorCount} ошибок перед сохранением:`
              }
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default memo(ValidationSummary);
