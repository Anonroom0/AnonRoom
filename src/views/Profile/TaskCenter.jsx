import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  Gift, 
  Send, 
  ExternalLink, 
  AlertCircle, 
  Copy, 
  Image as ImageIcon,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  Info // 🐛 FIX: Added the missing Info icon import here!
} from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

/**
 * TaskCenter Component
 * -----------------------------------------------------------------------------
 * A comprehensive modular workflow for users to discover, accept, and submit 
 * proof for promotional tasks. Uses an internal sub-router to manage the 
 * multi-step submission flow without polluting the global application state.
 */
export default function TaskCenter({ navigateTo }) {
  // ---------------------------------------------------------------------------
  // 1. INTERNAL SUB-ROUTING & STATE
  // ---------------------------------------------------------------------------
  // Views: 'list' | 'detail' | 'submit' | 'success'
  const [currentView, setCurrentView] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Submission Form State
  const [copiedLink, setCopiedLink] = useState(false);
  const [proofText, setProofText] = useState('');
  const [proofImage, setProofImage] = useState(false);
  
  // Registry of completed tasks (In a real app, this comes from the backend)
  const [completedTasks, setCompletedTasks] = useState([]);

  // ---------------------------------------------------------------------------
  // 2. MOCK TASK REGISTRY
  // ---------------------------------------------------------------------------
  const availableTasks = [
    {
      id: 'task-101',
      title: 'Partner App Registration',
      desc: 'Download our partner application and verify your account to unlock instant rewards.',
      points: 50,
      icon: Gift,
      color: 'indigo',
      link: 'https://partner-app.com/register/vaibhav',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
      steps: [
        'Click the designated link to visit the partner site.',
        'Download the app and create a new account using your primary email.',
        'Take a clear screenshot of your new profile dashboard.',
        'Return to this page to submit your proof.'
      ],
      isLocked: false
    },
    {
      id: 'task-102',
      title: 'Complete KYC Verification',
      desc: 'Secure your account by verifying your identity with a government ID.',
      points: 100,
      icon: ShieldCheck,
      color: 'emerald',
      link: null,
      image: null,
      steps: [],
      isLocked: true // Simulating a locked/coming soon task
    },
    {
      id: 'task-103',
      title: 'Join Telegram Community',
      desc: 'Stay updated with exclusive drops, news, and community voting.',
      points: 20,
      icon: Send,
      color: 'sky',
      link: null,
      image: null,
      steps: [],
      isLocked: true
    }
  ];

  // ---------------------------------------------------------------------------
  // 3. INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  
  const handleBack = () => {
    AudioEngine.playClick();
    if (currentView === 'success') {
      setCurrentView('list');
    } else if (currentView === 'submit') {
      setCurrentView('detail');
    } else if (currentView === 'detail') {
      setCurrentView('list');
    } else {
      // If we are at the list, go back to the global menu
      navigateTo('menu');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTaskSelect = (task) => {
    if (task.isLocked) return;
    AudioEngine.playClick();
    setSelectedTask(task);
    
    // Check if it's already completed
    if (completedTasks.includes(task.id)) {
      setCurrentView('success');
    } else {
      setCurrentView('detail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    if (!selectedTask?.link) return;
    AudioEngine.playClick();
    navigator.clipboard.writeText(selectedTask.link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (!proofText || !proofImage) return;
    
    AudioEngine.playClick();
    
    // Mark task as completed in our local array
    setCompletedTasks(prev => [...prev, selectedTask.id]);
    
    // Reset form fields
    setProofText('');
    setProofImage(false);
    
    // Advance to success view
    setCurrentView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------------
  // 4. RENDER: TASK LIST (HOME VIEW)
  // ---------------------------------------------------------------------------
  if (currentView === 'list') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleBack} 
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Task Center</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Complete tasks to earn points instantly.</p>
          </div>
        </div>

        {/* Global Task Metrics Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Zap className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Available Points Pool</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">170</span>
              <span className="text-lg font-bold text-amber-400">AR</span>
            </div>
            <p className="text-sm font-medium text-slate-300 mt-4 max-w-sm">
              Complete the active bounties below to secure your reward vouchers and multipliers.
            </p>
          </div>
        </div>

        {/* Task List Rendering */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">Current Bounties</h3>
          
          {availableTasks.map(task => {
            const isCompleted = completedTasks.includes(task.id);
            const isLocked = task.isLocked && !isCompleted;

            return (
              <div 
                key={task.id}
                onClick={() => handleTaskSelect(task)}
                className={`card-standard p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white border-2 transition-all ${
                  isCompleted 
                    ? 'border-green-200 shadow-sm cursor-pointer hover:bg-green-50/30' 
                    : isLocked
                      ? 'border-slate-100 opacity-60 cursor-not-allowed shadow-none'
                      : 'border-indigo-100 shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-300'
                }`}
              >
                
                {/* Task Icon Block */}
                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-transform ${
                  isCompleted 
                    ? 'bg-green-50 text-green-600 border-green-200 shadow-sm' 
                    : isLocked
                      ? 'bg-slate-100 text-slate-400 border-slate-200'
                      : `bg-${task.color}-50 text-${task.color}-600 border-${task.color}-200 shadow-sm`
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <task.icon className="w-6 h-6" />}
                </div>
                
                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[17px] font-bold text-slate-900 truncate">{task.title}</h4>
                    {!isCompleted && !isLocked && (
                      <span className="bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                        {task.points} Pts
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-500 line-clamp-2">
                    {isCompleted ? 'Task verified. Reward issued.' : task.desc}
                  </p>
                </div>
                
                {/* Call To Action Button */}
                <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  {isCompleted ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigateTo('rewards'); }} 
                      className="w-full sm:w-auto btn-secondary border-green-300 text-green-700 hover:bg-green-50 px-6 py-2.5 flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      View Reward <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : isLocked ? (
                    <button disabled className="w-full sm:w-auto bg-slate-100 text-slate-400 font-bold px-6 py-2.5 rounded-xl text-sm border border-slate-200 cursor-not-allowed">
                      Locked
                    </button>
                  ) : (
                    <button className="w-full sm:w-auto btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 px-8 py-2.5 active:scale-95 transition-all border border-indigo-700">
                      Do It
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 5. RENDER: TASK DETAIL INSTRUCTIONS (BEFORE SUBMISSION)
  // ---------------------------------------------------------------------------
  if (currentView === 'detail' && selectedTask) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12">
        <div className="card-standard overflow-hidden bg-white shadow-sm border border-slate-100">
          
          {/* Detailed Hero Image */}
          <div className="w-full h-48 sm:h-64 bg-slate-900 relative shadow-inner">
            <img 
              src={selectedTask.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000'} 
              alt={selectedTask.title} 
              className="w-full h-full object-cover opacity-60" 
            />
            <button 
              onClick={handleBack} 
              className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 shadow-sm hover:bg-white transition-colors flex items-center gap-2 font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTask.title}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed max-w-sm">
                  {selectedTask.desc}
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-[1rem] p-4 text-center shrink-0 min-w-[90px] shadow-sm">
                <span className="block text-3xl font-black text-indigo-600 leading-none tracking-tighter">{selectedTask.points}</span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 block">Points</span>
              </div>
            </div>

            {/* Instruction List Block */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-inner">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" /> Task Instructions:
              </h3>
              <ol className="list-decimal list-outside ml-5 text-sm text-slate-600 space-y-3 font-medium leading-relaxed">
                {selectedTask.steps.map((step, idx) => (
                  <li key={idx} className="pl-1">{step}</li>
                ))}
              </ol>
            </div>

            {/* Link Copy Box */}
            {selectedTask.link && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Official Link:</label>
                <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
                  <span className="text-sm font-medium text-blue-600 ml-2 truncate select-all">
                    {selectedTask.link}
                  </span>
                  <button 
                    onClick={handleCopyLink} 
                    className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-1.5 text-xs font-bold transition-colors shrink-0 shadow-sm"
                  >
                    {copiedLink ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Advance Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <a 
                href={selectedTask.link || '#'} 
                target="_blank" 
                rel="noreferrer"
                onClick={() => AudioEngine.playClick()}
                className="btn-secondary flex-1 text-center justify-center py-4 bg-white border-slate-200 shadow-sm"
              >
                <ExternalLink className="w-5 h-5 text-slate-400" /> Open Target Site
              </a>
              <button 
                onClick={() => { AudioEngine.playClick(); setCurrentView('submit'); window.scrollTo(0,0); }} 
                className="btn-primary flex-1 bg-indigo-600 shadow-indigo-600/20 py-4 border border-indigo-700 active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" /> Start & Submit Proof
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. RENDER: SUBMIT PROOF FORM
  // ---------------------------------------------------------------------------
  if (currentView === 'submit' && selectedTask) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12">
        <div className="card-standard overflow-hidden bg-white shadow-sm border border-slate-100">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
            <button 
              onClick={handleBack} 
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Submit Proof</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">For: {selectedTask.title}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmitProof} className="space-y-6">
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 shadow-sm mb-8">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 font-medium">
                  Ensure your screenshot clearly shows your registered username or email to prevent rejection.
                </p>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">Registered Email / Username</label>
                <input 
                  type="text" 
                  required 
                  value={proofText} 
                  onChange={(e) => setProofText(e.target.value)}
                  placeholder="e.g. vaibhav_singhal"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium shadow-inner"
                />
              </div>

              {/* File Dropzone Simulation */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">Upload Dashboard Screenshot</label>
                <button 
                  type="button"
                  onClick={() => { AudioEngine.playClick(); setProofImage(true); }}
                  className={`w-full p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all outline-none ${
                    proofImage 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-indigo-300'
                  }`}
                >
                  {proofImage ? (
                    <>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-sm border border-green-200">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <span className="font-bold text-green-800 block text-base">Dashboard_Proof.png</span>
                        <span className="text-xs text-green-600 font-medium">1.2 MB • Ready to upload</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block text-base">Tap to select image</span>
                        <span className="text-xs text-slate-400 font-medium">Supports JPG, PNG (Max 5MB)</span>
                      </div>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button 
                  type="submit" 
                  className={`w-full py-4 text-base font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                    proofText && proofImage 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-600/25 border border-indigo-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" /> Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 7. RENDER: SUCCESS COMPLETION VIEW
  // ---------------------------------------------------------------------------
  if (currentView === 'success' && selectedTask) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12">
        <div className="card-standard overflow-hidden bg-white shadow-sm border border-slate-100">
          
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-6">
            
            {/* Animated Checkmark Group */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-28 h-28 bg-gradient-to-br from-green-50 to-emerald-100 text-green-600 rounded-[2rem] flex items-center justify-center shadow-inner border-2 border-green-200 relative z-10">
                <CheckCircle2 className="w-14 h-14" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Task Completed!</h3>
              <p className="text-base font-medium text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your proof for <strong className="text-slate-900">"{selectedTask.title}"</strong> has been auto-verified by our system.
              </p>
            </div>
            
            {/* Reward Summary Pill */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-3 inline-flex items-center gap-3 shadow-sm mt-2">
              <Gift className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-amber-800">
                <span className="font-black text-lg">{selectedTask.points}</span> AR Points Credited
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={handleBack} 
                className="btn-secondary flex-1 py-3.5 shadow-sm border-slate-200"
              >
                Back to Tasks
              </button>
              
              {/* This correctly triggers the Master Controller to open RewardCenter */}
              <button 
                onClick={() => { AudioEngine.playClick(); navigateTo('rewards'); }} 
                className="btn-primary flex-1 py-3.5 shadow-blue-600/25 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                View Reward <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>

        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
