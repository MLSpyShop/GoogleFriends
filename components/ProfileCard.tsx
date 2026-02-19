
import React from 'react';
import { SocialProfile } from '../types';
import { 
  ExternalLink, User, Linkedin, Twitter, Github, Instagram, 
  Youtube, Share2, Award, CheckCircle, MessageSquare, 
  Music, BookOpen, PenTool, Hash, Facebook
} from 'lucide-react';

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-5 h-5 text-gray-200" />;
  if (p.includes('github')) return <Github className="w-5 h-5 text-gray-300" />;
  if (p.includes('instagram')) return <Instagram className="w-5 h-5 text-[#E4405F]" />;
  if (p.includes('youtube')) return <Youtube className="w-5 h-5 text-[#FF0000]" />;
  if (p.includes('tiktok')) return <Music className="w-5 h-5 text-[#00f2ea]" />;
  if (p.includes('reddit')) return <MessageSquare className="w-5 h-5 text-[#FF4500]" />;
  if (p.includes('medium')) return <BookOpen className="w-5 h-5 text-white" />;
  if (p.includes('pinterest')) return <Hash className="w-5 h-5 text-[#BD081C]" />;
  if (p.includes('facebook') || p.includes('behance')) return <Facebook className="w-5 h-5 text-[#1877F2]" />;
  return <User className="w-5 h-5 text-purple-400" />;
};

interface ProfileCardProps {
  profile: SocialProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="group relative glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 hover:border-white/20">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
          <PlatformIcon platform={profile.platform} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Award className="w-3 h-3" />
            {profile.relevanceScore}% Score
          </div>
          <div className="flex items-center gap-1 text-[9px] text-green-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <CheckCircle className="w-2.5 h-2.5" />
            URL Verified
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors truncate" title={profile.name}>
        {profile.name}
      </h3>
      <p className="text-xs text-gray-500 mb-3 truncate font-mono">
        @{profile.handle.replace('@', '')}
      </p>
      
      <p className="text-gray-400 text-xs line-clamp-3 mb-4 leading-relaxed h-[54px]">
        {profile.bio || "No biography provided."}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-6 h-[48px] overflow-hidden">
        {profile.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] uppercase tracking-widest text-gray-500 font-bold border border-white/5">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <a 
          href={profile.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 text-white py-2 rounded-lg text-xs font-semibold transition-all"
        >
          View <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button 
          title="Share profile"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: profile.name, url: profile.url });
            } else {
              navigator.clipboard.writeText(profile.url);
              alert('Link copied!');
            }
          }}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
