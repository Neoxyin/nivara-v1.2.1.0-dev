'use client';

import React, { useState } from 'react';
import { 
  UsersRound, 
  Clock, 
  ShieldCheck, 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import Link from 'next/link';
import type { SupportCircle, CirclePost } from '@/lib/data/support-circles';
import { getSupportCircleById, getCirclePosts, addCirclePost } from '@/lib/api/support-circles';

export function SupportCircleDetail({ circleId }: { circleId: string }) {
  const [circle, setCircle] = useState<SupportCircle | null>(null);
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationNotice, setModerationNotice] = useState<string | null>(null);

  React.useEffect(() => {
    getSupportCircleById(circleId).then((c) => {
      if (c) setCircle(c);
    });
    getCirclePosts(circleId).then((p) => {
      if (p && p.length > 0) {
        setPosts(p);
      } else {
        setPosts([
          {
            id: 'default-1',
            circleId,
            author: 'Moderator',
            content: 'Welcome to this temporary support circle. Feel free to share your thoughts, pacing strategies, or questions in a respectful, supportive environment.',
            timestamp: '1 day ago',
            moderationStatus: 'published'
          }
        ]);
      }
    });
  }, [circleId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setModerationNotice(null);

    try {
      const newPost = await addCirclePost(circleId, newPostContent.trim());
      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setIsSubmitting(false);

      if (newPost.moderationStatus === 'human_review') {
        setModerationNotice('Your post has been routed for gentle human review by a campus moderator to ensure care and support.');
      } else if (newPost.moderationStatus === 'safety_workflow') {
        setModerationNotice('Our safety workflow has detected language indicating distress. Immediate campus support resources and counsellor options have been attached.');
      } else {
        setModerationNotice('Post successfully reviewed and published to the circle.');
      }
    } catch {
      setIsSubmitting(false);
      setModerationNotice('Unable to post to the circle at this time. Please check your connection and try again.');
    }
  };

  if (!circle) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#c3f340] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back & Header */}
      <div className="space-y-4">
        <Link 
          href="/support/circles" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Support Circles
        </Link>

        <div className="border border-white/[0.09] bg-[#141414]/90 p-6 sm:p-8 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span
                title={circle.category}
                className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-bold uppercase tracking-[.06em] text-[#c3f340] bg-[#c3f340]/10 border border-[#c3f340]/20 px-2.5 py-1 rounded-md shrink-0"
              >
                {circle.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/50 font-medium whitespace-nowrap shrink-0">
                <Clock size={13} className="text-[#c3f340] shrink-0" />
                <span>Expires in {circle.expiresInDays} days (Temporary)</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{circle.title}</h1>
            <p className="text-sm text-white/70 max-w-3xl leading-relaxed">{circle.description}</p>
          </div>

          <div className="shrink-0 bg-white/[0.03] border border-white/[0.08] p-4 rounded-xl space-y-2 min-w-[200px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Capacity</span>
              <span className="text-white font-semibold">{circle.memberCount} / {circle.maxMembers}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#c3f340] h-full rounded-full" 
                style={{ width: `${(circle.memberCount / circle.maxMembers) * 100}%` }} 
              />
            </div>
            <span className="text-[10px] text-white/40 block pt-1">Moderator: {circle.moderator}</span>
          </div>
        </div>
      </div>

      {/* Moderation Notice Alert */}
      {moderationNotice && (
        <div className="p-4 rounded-xl bg-[rgba(195,243,64,.08)] border border-[#c3f340]/20 text-[#c3f340] text-xs flex items-center gap-3">
          <ShieldCheck size={16} className="shrink-0" />
          <span>{moderationNotice}</span>
        </div>
      )}

      {/* Discussion Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Creation Box */}
          <div className="border border-white/[0.09] bg-[#141414]/90 p-5 backdrop-blur-xl rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-[#c3f340]" />
              Share with the Circle (Anonymous / Safe)
            </h3>
            
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isSubmitting && newPostContent.trim()) handleCreatePost(e as unknown as React.FormEvent<HTMLFormElement>);
                  }
                }}
                placeholder="Write a supportive reflection, question, or encouragement..."
                rows={3}
                disabled={isSubmitting}
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c3f340]/50 transition-colors disabled:opacity-50 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#c3f340]" /> Moderated for safety & constructive peer support
                </span>
                <button
                  type="submit"
                  disabled={!newPostContent.trim() || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#c3f340] text-black text-xs font-semibold hover:bg-[#dff77d] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#c3f340]/10"
                >
                  <Send size={14} /> {isSubmitting ? 'Reviewing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider px-1">Discussion Feed ({posts.length})</h3>
            
            {posts.map((post) => (
              <div key={post.id} className="border border-white/[0.08] bg-white/[0.02] p-5 rounded-xl space-y-3 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.08] text-[#c3f340] text-xs font-bold border border-white/10">
                      <User size={13} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white">{post.author}</span>
                      <span className="text-[10px] text-white/40 ml-2">{post.timestamp}</span>
                    </div>
                  </div>

                  {/* Moderation Status Pill */}
                  <div>
                    {post.moderationStatus === 'published' && (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#c3f340]/10 text-[#c3f340] border border-[#c3f340]/20 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Safe / Published
                      </span>
                    )}
                    {post.moderationStatus === 'human_review' && (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <AlertTriangle size={11} /> Human Review
                      </span>
                    )}
                    {post.moderationStatus === 'safety_workflow' && (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20 flex items-center gap-1">
                        <Lock size={11} /> Safety Workflow
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-white/90 leading-relaxed pl-9">{post.content}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Sidebar Guidelines */}
        <div className="space-y-6">
          <div className="border border-white/[0.09] bg-[#141414]/90 p-6 backdrop-blur-xl rounded-2xl space-y-4">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#c3f340]" />
              Support Circle Norms
            </h4>
            <ul className="space-y-3 text-xs text-white/70 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#c3f340] font-bold">•</span>
                <span><strong>Confidentiality:</strong> What is shared in this circle stays in this circle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c3f340] font-bold">•</span>
                <span><strong>Constructive Pacing:</strong> Focus on mutual encouragement and actionable coping steps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c3f340] font-bold">•</span>
                <span><strong>Automatic Expiry:</strong> Circles close after 14 days to prevent stale or persistent social loops.</span>
              </li>
            </ul>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] p-5 rounded-2xl space-y-3">
            <h5 className="text-xs font-semibold text-white/80 flex items-center gap-2">
              <Info size={15} className="text-[#c3f340]" /> Need Immediate Help?
            </h5>
            <p className="text-[11px] text-white/50 leading-relaxed">
              If you or someone you know is in acute distress, our campus counsellors and emergency support line are available 24/7.
            </p>
            <Link 
              href="/counsellors" 
              className="inline-block w-full py-2.5 text-center rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white/90 border border-white/10 transition-colors"
            >
              Book Counsellor Session
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
