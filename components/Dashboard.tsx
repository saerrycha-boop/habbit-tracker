import React, { useState, useMemo } from 'react';
import { Habit } from '../types';
import { HabitTable } from './HabitTable';
import { WeeklyBarChart, ActivityLineChart, CircularProgress } from './Charts';
import { AICoach } from './AICoach';
import { HabitManager } from './HabitManager';
import { CalendarSettingsModal } from './CalendarSettingsModal';

interface DashboardProps {
  user: { name: string };
  onLogout: () => void;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, habits, setHabits }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  
  // Date State
  const [currentDate, setCurrentDate] = useState({ year: 2025, month: 12 });
  const [isCalendarSettingsOpen, setIsCalendarSettingsOpen] = useState(false);

  const toggleHabit = (id: string, dayIndex: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newCompleted = [...h.completedDays];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        return { ...h, completedDays: newCompleted };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    if (confirm("정말로 이 습관을 삭제하시겠습니까?")) {
        setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleSaveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
  };

  const handleDateApply = (year: number, month: number) => {
    setCurrentDate({ year, month });
    // In a real app, you would fetch data for this specific month here
  };

  // Derived Statistics
  const totalChecks = useMemo(() => 
    habits.reduce((acc, h) => acc + h.completedDays.filter(d => d).length, 0), 
  [habits]);
  
  const totalPossible = Math.max(1, habits.length * 28);
  const overallProgress = Math.round((totalChecks / totalPossible) * 100) || 0;

  const weeklyData = useMemo(() => {
    // Mocking weekly progression based on checks (grouping by 7 days)
    const weeks = [0, 0, 0, 0];
    habits.forEach(h => {
      h.completedDays.forEach((done, idx) => {
        if (done) weeks[Math.floor(idx / 7)]++;
      });
    });
    return weeks.map((val, idx) => ({ name: `W${idx + 1}`, value: val }));
  }, [habits]);

  const activityData = useMemo(() => {
      // Mock daily activity for the line chart
      return Array.from({length: 10}, (_, i) => ({
          name: `Day ${i+1}`,
          value: Math.floor(Math.random() * 10) + 5,
          prevValue: Math.floor(Math.random() * 10) + 2
      }))
  }, []);

  const topHabits = useMemo(() => {
    return [...habits]
      .map(h => ({
        ...h,
        rate: Math.round((h.completedDays.filter(d => d).length / 28) * 100)
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 8);
  }, [habits]);

  const getMonthName = (m: number) => {
    const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return names[m - 1];
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="h-16 flex-shrink-0 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 shadow-md z-30">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-muted hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="material-icons">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary text-3xl">check_circle</span>
            <h1 className="text-xl font-bold tracking-tight">FocusFlow</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-muted">안녕하세요, <span className="text-text font-semibold">{user.name}</span>님</span>
          <button className="p-2 text-muted hover:text-white rounded-full hover:bg-white/5">
            <span className="material-icons">notifications</span>
          </button>
           <button onClick={onLogout} className="p-2 text-muted hover:text-red-400 rounded-full hover:bg-white/5" title="로그아웃">
            <span className="material-icons">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
             <div className="absolute inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Left Sidebar (Desktop: Static, Mobile: Drawer) */}
        <aside className={`
            absolute lg:static inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col gap-4 p-4 overflow-y-auto scrollbar-hide
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Calendar Widget */}
          <div className="bg-surfaceHighlight/30 p-4 rounded-xl border border-border">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted">캘린더 설정</h3>
            <div className="space-y-3">
               <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                 <span className="text-sm text-muted">Year</span>
                 <span className="font-bold">{currentDate.year}</span>
               </div>
               <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                 <span className="text-sm text-muted">Month</span>
                 <span className="font-bold">{currentDate.month}월 <span className="text-xs text-muted font-normal">({getMonthName(currentDate.month)})</span></span>
               </div>
               <button 
                onClick={() => setIsCalendarSettingsOpen(true)}
                className="w-full py-2 bg-surfaceHighlight hover:bg-border transition-colors rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
               >
                 <span className="material-icons text-base">settings</span>
                 설정 변경
               </button>
            </div>
          </div>

          {/* Weekly Chart Widget */}
          <div className="bg-surfaceHighlight/30 p-4 rounded-xl border border-border">
            <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-muted">주간 달성률</h3>
            <WeeklyBarChart data={weeklyData} />
            <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-muted">완료됨</span>
                    <span className="font-mono text-accent">{totalChecks}</span>
                </div>
                 <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-muted">목표 (4주)</span>
                    <span className="font-mono">{totalPossible}</span>
                </div>
                <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span>전체 진행률</span>
                        <span className="font-bold">{overallProgress}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                    </div>
                </div>
            </div>
          </div>

          {/* AI Coach Widget */}
          <AICoach habits={habits} />
        </aside>

        {/* Center Main Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-6 scrollbar-hide">
            
            {/* Top Chart Section */}
            <section className="bg-surface rounded-xl border border-border p-5">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="font-bold text-lg">주간 활동량 추이</h2>
                     <span className="text-sm text-muted bg-surfaceHighlight px-3 py-1 rounded-full">
                        {currentDate.year}년 {currentDate.month}월
                     </span>
                </div>
                <ActivityLineChart data={activityData} />
            </section>

            {/* Habit Grid Section (Takes remaining height) */}
            <section className="flex-grow min-h-[500px]">
                <HabitTable 
                    habits={habits} 
                    onToggle={toggleHabit} 
                    onDelete={deleteHabit} 
                    onManage={() => setIsManagerOpen(true)}
                />
            </section>

             {/* Mobile only: Right column content shown at bottom */}
             <div className="lg:hidden space-y-6">
                <div className="bg-surface rounded-xl border border-border p-6 text-center">
                    <h3 className="font-bold mb-4">전체 진행률</h3>
                    <div className="flex justify-center">
                        <CircularProgress percentage={overallProgress} />
                    </div>
                </div>
             </div>
        </main>

        {/* Right Sidebar (Desktop only) */}
        <aside className="hidden lg:flex w-80 bg-surface border-l border-border flex-col p-6 gap-6 overflow-y-auto">
            {/* Total Progress */}
            <div className="bg-surfaceHighlight/20 p-6 rounded-2xl border border-border flex flex-col items-center">
                <h3 className="font-bold text-lg mb-2">전체 진행률</h3>
                <CircularProgress percentage={overallProgress} />
                <div className="flex w-full justify-between mt-6 text-sm">
                     <div className="text-center">
                        <div className="text-muted text-xs">남음</div>
                        <div className="font-bold text-lg text-text">{100 - overallProgress}%</div>
                     </div>
                     <div className="text-center">
                        <div className="text-muted text-xs">완료됨</div>
                        <div className="font-bold text-lg text-accent">{overallProgress}%</div>
                     </div>
                </div>
            </div>

            {/* Ranking */}
            <div className="flex-grow bg-surfaceHighlight/20 p-4 rounded-2xl border border-border overflow-hidden flex flex-col">
                <h3 className="font-bold text-lg mb-4 px-2">상위 습관 랭킹</h3>
                <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {topHabits.map((habit, idx) => (
                        <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surfaceHighlight transition-colors border border-border/50">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={`font-bold font-mono text-sm w-5 text-center ${idx < 3 ? 'text-accent' : 'text-muted'}`}>
                                    {idx + 1}
                                </span>
                                <span className="text-sm truncate">{habit.name}</span>
                            </div>
                            <span className="text-xs font-bold bg-background px-2 py-1 rounded text-muted">
                                {habit.rate}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>

        {/* Habit Manager Modal */}
        <HabitManager 
            isOpen={isManagerOpen} 
            onClose={() => setIsManagerOpen(false)} 
            habits={habits} 
            onSave={handleSaveHabits} 
        />

        {/* Calendar Settings Modal */}
        <CalendarSettingsModal
          isOpen={isCalendarSettingsOpen}
          onClose={() => setIsCalendarSettingsOpen(false)}
          initialYear={currentDate.year}
          initialMonth={currentDate.month}
          onApply={handleDateApply}
        />

      </div>
    </div>
  );
};
