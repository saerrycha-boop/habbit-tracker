import React from 'react';
import { Habit } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface HabitTableProps {
  habits: Habit[];
  onToggle: (habitId: string, dayIndex: number) => void;
  onDelete: (habitId: string) => void;
  onManage: () => void;
}

export const HabitTable: React.FC<HabitTableProps> = ({ habits, onToggle, onDelete, onManage }) => {
  return (
    <div className="w-full overflow-hidden flex flex-col h-full bg-surface rounded-xl border border-border">
      {/* Header Controls */}
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg text-text">월간 습관 로그</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/20">
            4주 기록
          </span>
        </div>
        <button 
          onClick={onManage}
          className="flex items-center gap-1 text-sm font-semibold px-4 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm"
        >
          <span className="material-icons text-base">edit_note</span>
          습관 관리/추가
        </button>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-grow overflow-auto relative">
        <table className="w-full text-sm border-collapse min-w-[1200px]">
          <thead className="sticky top-0 z-20 bg-surfaceHighlight text-muted shadow-sm">
            <tr>
              <th className="p-3 text-left font-medium sticky left-0 z-30 bg-surfaceHighlight border-r border-border min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                습관 목록
              </th>
              <th className="p-3 font-medium border-r border-border w-16 text-center">목표</th>
              {[1, 2, 3, 4].map(week => (
                <th key={week} colSpan={7} className="p-2 font-medium border-r border-border text-center bg-surfaceHighlight/50">
                  {week}주차
                </th>
              ))}
              <th className="p-3 font-medium text-center w-16 sticky right-0 bg-surfaceHighlight z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.3)]">관리</th>
            </tr>
            <tr>
              <th className="sticky left-0 z-30 bg-surfaceHighlight border-r border-border"></th>
              <th className="border-r border-border bg-surfaceHighlight"></th>
              {[1, 2, 3, 4].map((_, wIndex) => (
                <React.Fragment key={wIndex}>
                  {DAYS_OF_WEEK.map((day, dIndex) => (
                    <th key={`${wIndex}-${dIndex}`} className={`p-2 font-medium border-b border-border text-center w-10 ${day === '일' ? 'text-red-400' : 'text-muted'}`}>
                      {day}
                    </th>
                  ))}
                </React.Fragment>
              ))}
              <th className="sticky right-0 bg-surfaceHighlight z-20 border-b border-border"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {habits.map((habit, index) => (
              <tr key={habit.id} className="group hover:bg-surfaceHighlight/30 transition-colors">
                <td className="p-3 sticky left-0 z-10 bg-surface group-hover:bg-surfaceHighlight/30 border-r border-border font-medium text-text whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                  <span className="text-muted mr-3 w-4 inline-block text-right">{index + 1}</span>
                  {habit.name}
                </td>
                <td className="p-2 text-center text-muted border-r border-border">{habit.goal}</td>
                {habit.completedDays.map((completed, i) => (
                  <td key={i} className="p-1 text-center border-r border-border/50 last:border-r-border">
                    <div className="flex justify-center items-center h-full">
                      <button
                        onClick={() => onToggle(habit.id, i)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 ${
                          completed 
                            ? 'bg-primary text-white shadow-[0_0_8px_rgba(99,102,241,0.5)] scale-100' 
                            : 'bg-surfaceHighlight hover:bg-border text-transparent scale-90 hover:scale-100'
                        }`}
                      >
                        <span className="material-icons text-sm font-bold">check</span>
                      </button>
                    </div>
                  </td>
                ))}
                <td className="p-2 text-center sticky right-0 z-10 bg-surface group-hover:bg-surfaceHighlight/30 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                  <button 
                    onClick={() => onDelete(habit.id)}
                    className="text-muted hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-400/10"
                  >
                    <span className="material-icons text-lg">delete_outline</span>
                  </button>
                </td>
              </tr>
            ))}
            {habits.length === 0 && (
              <tr>
                <td colSpan={32} className="p-8 text-center text-muted">
                  습관이 없습니다. '습관 관리/추가' 버튼을 눌러 시작해보세요!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};