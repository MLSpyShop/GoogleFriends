
import React, { useState } from 'react';
import { Search, Shield, Zap, Globe, Github, Info, AlertCircle, RefreshCw, ChevronRight, Sparkles, Layers, Twitter } from 'lucide-react';
import { GeminiService } from './services/geminiService';
import { SearchState } from './types';
import ProfileCard from './components/ProfileCard';
import LoadingState from './components/LoadingState';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    results: null
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setState({ loading: true, error: null, results: null });
    try {
      const data = await GeminiService.analyzeAndSearch(url);
      setState({ loading: false, error: null, results: data });
    } catch (err: any) {
      setState({ loading: false, error: err.message, results: null });
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 -left-4 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob"></div>
      <div className="fixed top-40 -right-4 w-[500px] h-[500px] bg-red-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-40 left-40 w-[600px] h-[600px] bg-green-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter cursor-pointer group" onClick={() => window.location.reload()}>
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white">Google <span className="text-[#4285F4]">Friends</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">10 Platforms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">25 Matches</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Gemini API</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-10">
            <Logo className="w-48 h-48" showText={true} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-[11px] text-blue-400 font-bold uppercase tracking-widest border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Platform Synergy Engine</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
            Meet Your <br /> <span className="gradient-text">New Universe.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
            Paste one social link. Discover 25 verified peers and collaborators using Google Search and Gemini Intelligence.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-red-500 to-green-600 rounded-2xl blur opacity-20 group-focus-within:opacity-60 transition duration-700"></div>
            <div className="relative flex flex-col md:flex-row gap-2 p-2 glass rounded-2xl border border-white/10">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Globe className="w-5 h-5 text-blue-500" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste LinkedIn, X, GitHub, or YouTube URL..."
                  className="w-full py-4 bg-transparent outline-none text-white placeholder:text-gray-600 font-medium"
                />
              </div>
              <button 
                type="submit"
                disabled={state.loading}
                className="bg-white text-black font-black px-10 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 uppercase tracking-tighter text-sm"
              >
                {state.loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
                Map Friends
              </button>
            </div>
          </form>
        </section>

        {/* Status Area */}
        {state.loading && <LoadingState />}

        {state.error && (
          <div className="max-w-xl mx-auto p-8 glass border-red-500/30 bg-red-500/5 rounded-3xl flex items-start gap-5 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-lg text-white mb-1">Signal Interrupted</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{state.error}</p>
              <button onClick={() => setUrl('')} className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-1">
                Clear & Retry <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Results Area */}
        {state.results && !state.loading && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Subject Profile Header */}
            <div className="glass p-10 rounded-[40px] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                      Discovery Node
                    </span>
                    <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                      Mapping 25 Verified Friends
                    </span>
                  </div>
                  <h2 className="text-5xl font-black mb-4 tracking-tighter">{state.results.originalProfile.name}</h2>
                  <p className="text-xl text-blue-300/80 font-medium mb-6">Niche: {state.results.originalProfile.niche}</p>
                  <p className="text-gray-400 leading-relaxed text-lg font-light max-w-xl">
                    "{state.results.originalProfile.description}"
                  </p>
                </div>
                <div className="w-full md:w-auto p-6 glass rounded-2xl border-white/5 bg-white/[0.01]">
                   <div className="grid grid-cols-2 gap-4 text-center">
                     <div>
                       <div className="text-2xl font-black text-white">10</div>
                       <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Platforms</div>
                     </div>
                     <div>
                       <div className="text-2xl font-black text-white">25</div>
                       <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Matches</div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Suggestions Grid */}
            <div id="results">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black flex items-center gap-3 tracking-tighter">
                  <Zap className="w-8 h-8 text-blue-500" />
                  Synergistic Connections
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {state.results.suggestions.map((profile, idx) => (
                  <ProfileCard key={idx} profile={profile} />
                ))}
              </div>
            </div>

            {/* Sources & Verifiability */}
            {state.results.groundingSources.length > 0 && (
              <div className="pt-20 border-t border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-10">
                  <div className="max-w-md">
                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      Google Search Grounding
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Every profile was cross-referenced using real-time Google Search data to ensure high-fidelity matches and accurate URLs.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {state.results.groundingSources.slice(0, 6).map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/5 transition-all group border-white/5"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Globe className="w-4 h-4 text-gray-600 group-hover:text-blue-500 shrink-0" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-white truncate">
                          {source.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Benefits/Landing State */}
        {!state.results && !state.loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {[
              { 
                icon: <Layers className="w-8 h-8 text-blue-500" />, 
                title: "Massive Scope", 
                desc: "We analyze the entire social web to identify 25 unique connections tailored to your profile." 
              },
              { 
                icon: <Globe className="w-8 h-8 text-red-500" />, 
                title: "10 Platforms", 
                desc: "Discovery happens across LinkedIn, X, Instagram, GitHub, YouTube, and five other major networks." 
              },
              { 
                icon: <Sparkles className="w-8 h-8 text-green-500" />, 
                title: "Google Intelligence", 
                desc: "Harnesses the power of Gemini 3 and Google Search for real-time, verified profile discovery." 
              }
            ].map((feature, i) => (
              <div key={i} className="glass p-10 rounded-3xl hover:border-white/10 transition-all group bg-white/[0.01]">
                <div className="mb-6 p-4 bg-white/5 inline-block rounded-2xl group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-black mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-40 py-20 border-t border-white/5 bg-black/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-4 mb-6">
                <Logo className="w-12 h-12" />
                <span className="text-white font-black text-3xl tracking-tighter">Google Friends</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                The leading edge of social discovery. Mapping the world's creators and professionals through advanced AI-powered synergy.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-20">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Engine</h5>
                <ul className="text-sm text-gray-500 space-y-3 font-bold">
                  <li className="hover:text-white cursor-pointer transition-colors">Gemini 3</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Search Grounding</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Vertex AI</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Legal</h5>
                <ul className="text-sm text-gray-500 space-y-3 font-bold">
                  <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Data Safety</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">© 2025 Google Friends — Distributed Discovery Lab</p>
            <div className="flex gap-6">
               <Twitter className="w-4 h-4 text-gray-600 hover:text-white transition-colors cursor-pointer" />
               <Github className="w-4 h-4 text-gray-600 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
