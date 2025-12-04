import React, { useState, useEffect } from 'react';
import { Habit } from '../types';

interface HabitManagerProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onSave: (updatedHabits: Habit[]) => void;
}

export const HabitManager: React.FC<HabitManagerProps> = ({ isOpen, onClose, habits, onSave }) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Deep copy to avoid mutating state directly
      setLocalHabits(JSON.parse(JSON.stringify(habits)));
    }
  }, [isOpen, habits]);

  const handleChange = (id: string, field: 'name' | 'goal', value: string | number) => {
    setLocalHabits(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const handleDelete = (id: string) => {
    setLocalHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleAdd = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: '',
      goal: 7,
      completedDays: Array(28).fill(false)
    };
    setLocalHabits(prev => [...prev, newHabit]);
  };

  const handleSave = () => {
    // Filter out empty names
    const validHabits = localHabits.filter(h => h.name.trim() !== '');
    onSave(validHabits);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">습관 관리</h2>
          <button 
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Content - Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {localHabits.length === 0 ? (
            <div className="text-center py-10 text-muted">
              등록된 습관이 없습니다. 아래 버튼을 눌러 추가해보세요.
            </div>
          ) : (
            localHabits.map((habit, index) => (
              <div key={habit.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-background p-4 rounded-xl border border-border group hover:border-border/80 transition-colors">
                <span className="text-muted w-6 font-mono hidden sm:block">{index + 1}</span>
                
                <div className="flex-grow w-full sm:w-auto">
                  <label className="text-xs text-muted mb-1 block ml-1">습관 이름</label>
                  <input
                    type="text"
                    value={habit.name}
                    onChange={(e) => handleChange(habit.id, 'name', e.target.value)}
                    placeholder="예: 물 마시기"
                    className="w-full bg-surfaceHighlight border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-gray-600"
                    autoFocus={habit.name === ''}
                  />
                </div>

                <div className="w-full sm:w-24">
                  <label className="text-xs text-muted mb-1 block ml-1">주간 목표</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={habit.goal}
                      onChange={(e) => handleChange(habit.id, 'goal', parseInt(e.target.value) || 0)}
                      className="w-full bg-surfaceHighlight border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
                    />
                    <span className="absolute right-2 top-2 text-muted text-xs pointer-events-none">회</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-end mt-2 sm:mt-6">
                    <button
                        onClick={() => handleDelete(habit.id)}
                        className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="삭제"
                    >
                        <span className="material-icons">delete_outline</span>
                    </button>
                </div>
              </div>
            ))
          )}
          
          <button
            onClick={handleAdd}
            className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-icons">add_circle_outline</span>
            새로운 습관 추가하기
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surfaceHighlight/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-primary hover:bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 flex items-center gap-2"
          >
            <span className="material-icons text-sm">save</span>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};