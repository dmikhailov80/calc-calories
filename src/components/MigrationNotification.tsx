'use client';

import { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { getMigrationReport, clearMigrationReport, type MigrationReportData } from '@/lib/products-data';

export function MigrationNotification() {
  const [report, setReport] = useState<MigrationReportData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const migrationReport = getMigrationReport();
    if (migrationReport) {
      setReport(migrationReport);
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    clearMigrationReport();
    setReport(null);
  };

  if (!isVisible || !report) {
    return null;
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed top-4 right-4 max-w-md w-full bg-white border border-orange-200 shadow-lg rounded-lg p-4 z-50 max-[420px]:fixed max-[420px]:top-0 max-[420px]:right-0 max-[420px]:left-0 max-[420px]:bottom-0 max-[420px]:max-w-none max-[420px]:rounded-none max-[420px]:border-0 max-[420px]:flex max-[420px]:flex-col max-[420px]:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900">
            Данные были автоматически исправлены
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          aria-label="Закрыть уведомление"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-3 max-[420px]:flex-1 max-[420px]:overflow-y-auto">
        <p className="mb-2">
          При загрузке ваших продуктов были обнаружены и исправлены проблемы с данными:
        </p>
        <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto max-[420px]:max-h-none max-[420px]:flex-1">
          <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700">
            {report.report}
          </pre>
        </div>
      </div>

      <div className="max-[420px]:flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-500">
            Исправлено: {formatDate(report.timestamp)}
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            Данные сохранены
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium py-2 px-3 rounded-md transition-colors"
        >
          Понятно, закрыть
        </button>
      </div>
    </div>
  );
}
