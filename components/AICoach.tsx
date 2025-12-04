import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Habit } from '../types';

interface AICoachProps {
  habits: Habit[];
}

interface CoachingData {
  compliment: string;
  improvement: string;
  tip: string;
}

export const AICoach: React.FC<AICoachProps> = ({ habits }) => {
  const [loading, setLoading] = useState(false);
  const [coachingData, setCoachingData] = useState<CoachingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetCoaching = async () => {
    setLoading(true);
    setError(null);
    setCoachingData(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Prepare data summary for the AI
      const summary = habits.map(h => {
        const completedCount = h.completedDays.filter(d => d).length;
        const rate = Math.round((completedCount / 28) * 100);
        return `${h.name}: ${rate}% 완료 (목표: 주 ${h.goal}회)`;
      }).join('\n');

      const prompt = `
        당신은 친절하고 동기부여를 잘 해주는 습관 코치 'FocusFlow AI'입니다.
        아래는 사용자의 최근 4주간 습관 달성 현황입니다.
        
        ${summary}

        이 데이터를 바탕으로 사용자를 위해 다음 세 가지 항목으로 나누어 조언해주세요:
        1. 칭찬해요: 가장 잘한 점에 대한 따뜻한 칭찬.
        2. 개선이 필요해요: 아쉬운 점이나 개선이 필요한 습관에 대한 분석.
        3. 실전 팁: 구체적으로 바로 실천할 수 있는 행동 팁 1가지.
        
        말투는 정중하고 부드러운 한국어 존댓말로 해주세요.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              compliment: { type: Type.STRING, description: "가장 잘한 점에 대한 칭찬" },
              improvement: { type: Type.STRING, description: "개선이 필요한 부분에 대한 분석" },
              tip: { type: Type.STRING, description: "구체적인 실천 팁" },
            },
            required: ["compliment", "improvement", "tip"],
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setCoachingData(data);
      }

    } catch (err) {
      console.error(err);
      setError("AI 코치를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 shadow-lg flex flex-col gap-4">
      <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 text-primary font-bold">
          <span className="material-icons">auto_awesome</span>
          <span>AI 코치</span>
        </div>
        {!coachingData && !loading && (
          <button 
            onClick={handleGetCoaching}
            className="text-xs bg-primary hover:bg-indigo-600 text-white px-3 py-1.5 rounded-full transition-colors flex items-center shadow-sm"
          >
            분석 시작
          </button>
        )}
      </div>

      <div className="bg-surfaceHighlight/30 rounded-lg p-4 min-h-[120px] text-sm leading-relaxed relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surfaceHighlight/50 backdrop-blur-sm z-10 gap-3">
            <span className="animate-spin material-icons text-primary text-3xl">sync</span>
            <span className="text-muted animate-pulse font-medium">데이터 분석 중...</span>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-400 gap-2">
            <span className="material-icons">error_outline</span>
            <p>{error}</p>
          </div>
        )}

        {coachingData ? (
          <div className="space-y-4 animate-fade-in">
            {/* Compliment Section */}
            <div className="bg-surface border border-emerald-500/20 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <span className="material-icons text-lg">thumb_up</span>
                <h4 className="font-bold">칭찬해요</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pl-1">{coachingData.compliment}</p>
            </div>

            {/* Improvement Section */}
            <div className="bg-surface border border-orange-500/20 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-orange-400">
                <span className="material-icons text-lg">trending_up</span>
                <h4 className="font-bold">개선이 필요해요</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pl-1">{coachingData.improvement}</p>
            </div>

            {/* Tip Section */}
            <div className="bg-surface border border-blue-500/20 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <span className="material-icons text-lg">lightbulb</span>
                <h4 className="font-bold">실전 팁</h4>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pl-1">{coachingData.tip}</p>
            </div>
          </div>
        ) : (
          !loading && <p className="text-muted text-center mt-6 flex flex-col items-center gap-2">
            <span className="material-icons text-3xl opacity-20">analytics</span>
            <span>버튼을 눌러 나만의 맞춤형 피드백을 받아보세요.</span>
          </p>
        )}
        
        {coachingData && !loading && (
           <button 
           onClick={handleGetCoaching}
           className="mt-4 w-full text-xs text-muted hover:text-white transition-colors flex items-center justify-center gap-1 py-2 hover:bg-white/5 rounded-lg"
         >
           <span className="material-icons text-sm">refresh</span> 다시 분석하기
         </button>
        )}
      </div>
    </div>
  );
};