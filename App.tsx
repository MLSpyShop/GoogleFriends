
import React, { useState } from 'react';
import { Search, Shield, Zap, Globe, Github, Info, AlertCircle, RefreshCw, ChevronRight, Sparkles, Layers, Twitter, Settings, Check, X as CloseIcon } from 'lucide-react';
import { GeminiService } from './services/geminiService';
import { SearchState, Platform } from './types';
import ProfileCard from './components/ProfileCard';
import LoadingState from './components/LoadingState';
import Logo from './components/Logo';

const ALL_PLATFORMS: Platform[] = [
  'LinkedIn', 'X', 'Instagram', 'GitHub', 'YouTube', 
  'TikTok', 'Medium', 'Reddit', 'Pinterest', 'Facebook', 
  'Behance', 'Dribbble', 'Product Hunt', 'Crunchbase', 
  'Wellfound', 'Stack Overflow', 'Substack', 'Polywork', 
  'Contra', 'Upwork', 'Threads', 'Bluesky', 'Mastodon', 
  'Quora', 'Discord', 'Twitch', 'Tumblr'
];

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [seenUrls, setSeenUrls] = useState<string[]>([]);
  const [enabledPlatforms, setEnabledPlatforms] = useState<Platform[]>(ALL_PLATFORMS);
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    results: null
  });

  React.useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // Fallback for environments where the API might not be present yet
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleSearch = async (e?: React.FormEvent, isRefresh = false) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await GeminiService.analyzeAndSearch(url, seenUrls, enabledPlatforms);
      
      // Update seen URLs with the new suggestions
      const newUrls = data.suggestions.map(s => s.url);
      setSeenUrls(prev => [...new Set([...prev, ...newUrls])]);
      
      setState({ loading: false, error: null, results: data });
      
      // Scroll to results if refreshing
      if (isRefresh) {
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      if (err.message?.includes('Requested entity was not found')) {
        setHasApiKey(false);
        setState({ loading: false, error: 'Your API key is invalid or has expired. Please select a new one.', results: null });
      } else {
        setState({ loading: false, error: err.message, results: null });
      }
    }
  };

  const togglePlatform = (platform: Platform) => {
    setEnabledPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 -left-4 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob"></div>
      <div className="fixed top-40 -right-4 w-[500px] h-[500px] bg-red-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-40 left-40 w-[600px] h-[600px] bg-green-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-blob animation-delay-4000"></div>

      {/* API Key Lock Screen */}
      {hasApiKey === false && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="max-w-md w-full glass p-10 rounded-[40px] border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                <Shield className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase italic">Access Restricted</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                To ensure security and prevent unauthorized usage of admin resources, you must connect your own Gemini API key to use the Social Synergy Engine.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={handleSelectKey}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  <Zap className="w-4 h-4" />
                  Connect API Key
                </button>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-[10px] font-bold text-gray-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
                >
                  Learn about Gemini Billing & Keys
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter cursor-pointer group" onClick={() => window.location.reload()}>
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white">Google <span className="text-[#4285F4]">Friends</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">20 Platforms</a>
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass max-w-5xl w-full p-6 md:p-10 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -ml-32 -mb-32"></div>
            
            <div className="flex justify-between items-center mb-8 relative shrink-0">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">Platform Filter</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Select networks to include in your synergy search</p>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-3 hover:bg-white/10 rounded-full transition-all hover:rotate-90 duration-300 border border-white/5"
              >
                <CloseIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-8 relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {ALL_PLATFORMS.map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-300 group ${
                      enabledPlatforms.includes(platform)
                        ? 'bg-blue-500/10 border-blue-500/40 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]'
                        : 'bg-white/5 border-white/5 text-gray-600 grayscale opacity-40 hover:opacity-60'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest truncate mr-2">{platform}</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${
                      enabledPlatforms.includes(platform) ? 'bg-blue-500' : 'bg-gray-800'
                    }`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                        enabledPlatforms.includes(platform) ? 'left-4.5' : 'left-0.5'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative shrink-0 pt-4 border-t border-white/5">
              <div className="flex-1 flex gap-3">
                <button 
                  onClick={() => setEnabledPlatforms(ALL_PLATFORMS)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
                >
                  Select All
                </button>
                <button 
                  onClick={() => setEnabledPlatforms([])}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
                >
                  Clear All
                </button>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="sm:w-64 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

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

          <div className="flex flex-col items-center gap-6 mb-12">
            <button 
              onClick={() => setShowSettings(true)}
              className="group relative flex items-center gap-4 px-12 py-6 bg-white/5 hover:bg-white/10 border-2 border-blue-500/30 rounded-[24px] transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse"></div>
              <Settings className="w-6 h-6 text-blue-400 group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-lg font-black uppercase tracking-[0.5em] text-white">Settings</span>
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                <span className="text-xs font-black text-blue-400">{enabledPlatforms.length} Active</span>
              </div>
            </button>

            <form onSubmit={handleSearch} className="w-full max-w-3xl relative group mb-8">
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

          {/* Quick Platform Toggles */}
          <div className="w-full max-w-5xl mx-auto relative group/filters">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none opacity-0 group-hover/filters:opacity-100 transition-opacity"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none opacity-0 group-hover/filters:opacity-100 transition-opacity"></div>
            
            <div className="overflow-x-auto no-scrollbar pb-4 px-4">
              <div className="flex items-center gap-2 min-w-max">
                <div className="flex items-center gap-1 mr-4 pr-4 border-r border-white/10">
                  <button 
                    onClick={() => setEnabledPlatforms(ALL_PLATFORMS)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all border border-white/5"
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setEnabledPlatforms([])}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all border border-white/5"
                  >
                    None
                  </button>
                </div>

                {ALL_PLATFORMS.map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                      enabledPlatforms.includes(platform)
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]'
                        : 'bg-white/5 border-white/5 text-gray-600 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {platform}
                    {enabledPlatforms.includes(platform) && <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />}
                  </button>
                ))}
                
                <button 
                  onClick={() => setShowSettings(true)}
                  className="ml-2 p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-full border border-blue-500/20 text-blue-400 hover:text-blue-300 transition-all group/btn"
                  title="Advanced Settings"
                >
                  <Settings className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
                      Mapping 25 Verified Live Profiles
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
                       <div className="text-2xl font-black text-white">20</div>
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
              <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <h3 className="text-3xl font-black flex items-center gap-3 tracking-tighter">
                  <Zap className="w-8 h-8 text-blue-500" />
                  Synergistic Connections
                </h3>
                <button 
                  onClick={() => handleSearch(undefined, true)}
                  disabled={state.loading}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/20 transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {state.loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Find 25 More
                </button>
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
                title: "20 Platforms", 
                desc: "Discovery happens across LinkedIn, X, Instagram, Facebook, Reddit, Discord, and 14 other major social networks." 
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
