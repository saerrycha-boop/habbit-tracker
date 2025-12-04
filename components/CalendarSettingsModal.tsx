import React, { useState, useEffect } from 'react';

interface CalendarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialYear: number;
  initialMonth: number;
  onApply: (year: number, month: number) => void;
}

export const CalendarSettingsModal: React.FC<CalendarSettingsModalProps> = ({
  isOpen,
  onClose,
  initialYear,
  initialMonth,
  onApply,
}) => {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  useEffect(() => {
    if (isOpen) {
      setYear(initialYear);
      setMonth(initialMonth);
    }
  }, [isOpen, initialYear, initialMonth]);

  const handleApply = () => {
    onApply(year, month);
    onClose();
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-surface rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-border bg-surfaceHighlight/30 text-center">
          <h2 className="text-lg font-bold text-text">기간 설정</h2>
          <p className="text-xs text-muted mt-1">조회할 연도와 월을 선택하세요</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Year Selector */}
          <div className="flex items-center justify-between bg-background rounded-xl p-2 border border-border">
            <button 
              onClick={() => setYear(prev => prev - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surfaceHighlight text-muted hover:text-white transition-colors"
            >
              <span className="material-icons">chevron_left</span>
            </button>
            <span className="text-xl font-bold font-mono tracking-wider">{year}</span>
            <button 
              onClick={() => setYear(prev => prev + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surfaceHighlight text-muted hover:text-white transition-colors"
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-4 gap-2">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`
                  h-10 rounded-lg text-sm font-medium transition-all duration-200 border
                  ${month === m 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-background border-transparent text-muted hover:bg-surfaceHighlight hover:text-text hover:border-border'
                  }
                `}
              >
                {m}월
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-surfaceHighlight/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-muted hover:bg-white/5 hover:text-white transition-colors font-medium text-sm"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold shadow-md transition-all active:scale-95 text-sm"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};
