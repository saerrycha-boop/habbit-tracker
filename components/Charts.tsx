import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartProps {
  data: any[];
}

// Weekly Achievement (Bar Chart)
export const WeeklyBarChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
            contentStyle={{ backgroundColor: '#1f212d', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Activity Level (Line Chart)
export const ActivityLineChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f212d', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#14b8a6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#14b8a6', strokeWidth: 0 }} 
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
          />
           <Line 
            type="monotone" 
            dataKey="prevValue" 
            stroke="#6366f1" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#374151"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#14b8a6"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-text leading-none">{percentage}%</span>
      </div>
    </div>
  );
};