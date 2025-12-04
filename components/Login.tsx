import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // If signing up, use the entered name (ID). 
      // If logging in, derive a display name from email (simulating backend response)
      const displayName = isSignUp ? name : (email.split('@')[0] || "사용자");
      onLogin(displayName, email);
    }, 1000);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
        {/* Decorational background blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center transform rotate-3">
              <span className="material-icons text-primary text-4xl">check_circle</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2">FocusFlow</h2>
          <p className="text-muted text-center mb-8">
            {isSignUp ? "새로운 습관을 시작해보세요" : "더 나은 나를 만드는 습관의 시작"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-medium text-muted mb-1.5">아이디 (ID)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="사용하실 아이디를 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">이메일</label>
              <input 
                type="email" 
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-muted">비밀번호</label>
                {!isSignUp && <a href="#" className="text-xs text-primary hover:text-indigo-400">비밀번호 찾기</a>}
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <span className="material-icons animate-spin text-xl">sync</span>
              ) : (
                isSignUp ? "회원가입" : "로그인"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted">
            {isSignUp ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"} 
            <button 
              onClick={toggleMode} 
              className="ml-2 text-primary hover:text-indigo-400 font-semibold focus:outline-none"
            >
              {isSignUp ? "로그인" : "회원가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};