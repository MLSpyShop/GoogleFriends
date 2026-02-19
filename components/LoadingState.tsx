
import React, { useState, useEffect } from 'react';
import { Search, Globe, Sparkles, Cpu } from 'lucide-react';
import Logo from './Logo';

const messages = [
  "Initializing Google Search index...",
  "Querying 10 global social platforms...",
  "Analyzing profile synergy via Gemini...",
  "Generating 25 verified profile matches...",
  "Cross-referencing URLs with search grounding...",
  "Synthesizing your social galaxy...",
  "Applying Google AI refinement...",
  "Mapping the future of your network...",
];

const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-10">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/30 blur-[100px] rounded-full animate-pulse"></div>
        <div className="relative flex items-center justify-center w-32 h-32 glass rounded-full border-2 border-blue-500/20 overflow-hidden p-4">
          <Logo className="w-full h-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-6 h-6 text-white animate-bounce" />
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold mb-3 tracking-tight">Discovery in Progress</h3>
        <p className="text-gray-400 text-sm font-medium flex items-center justify-center gap-2 h-6">
          <Cpu className="w-4 h-4 text-blue-500 animate-pulse" />
          {messages[msgIndex]}
        </p>
      </div>

      <div className="w-72 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-red-500 to-green-500 animate-[loading_15s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
