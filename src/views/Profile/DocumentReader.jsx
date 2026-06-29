import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Printer, Download, FileText } from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

export default function DocumentReader({ navigateTo, docType }) {
  const [zoomLevel, setZoomLevel] = useState(100);

  const docTitle = docType === 'whitepaper' ? 'Official Platform Whitepaper' : 'Terms & Conditions';
  const docFileName = docType === 'whitepaper' ? 'AnonRoom_Whitepaper_v2.0.pdf' : 'AnonRoom_TNC_v1.5.pdf';

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12 flex flex-col h-[calc(100vh-80px)] relative">
      
      {/* Premium Reader Toolbar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-t-[1.5rem] flex items-center justify-between shrink-0 shadow-2xl z-20 border-b border-slate-700">
        <div className="flex items-center gap-4 sm:gap-5">
          <button 
            onClick={() => { AudioEngine.playClick(); navigateTo('menu'); }} 
            className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </button>
          <div className="hidden sm:block">
            <h2 className="font-bold text-base tracking-wide text-white">{docTitle}</h2>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 tracking-widest">{docFileName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-xl p-1.5 mr-2 hidden md:flex border border-slate-700 shadow-inner">
            <button onClick={() => setZoomLevel(prev => Math.max(prev - 25, 50))} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold w-14 text-center text-slate-200">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(prev => Math.min(prev + 25, 200))} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          <button className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors hidden sm:block border border-slate-700">
            <Printer className="w-4 h-4 text-slate-300" />
          </button>
          <button className="px-5 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/50 active:scale-95 border border-blue-400">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Massive Iframe Container */}
      <div className="flex-1 bg-slate-200 overflow-hidden relative rounded-b-[1.5rem] border-x border-b border-slate-300 shadow-inner flex justify-center p-4 sm:p-8">
        <div 
          className="w-full max-w-4xl bg-white shadow-2xl relative transition-transform duration-300 ease-out origin-top border border-slate-300"
          style={{ transform: `scale(${zoomLevel / 100})`, height: '200%' }} 
        >
          {/* 
            Set the src to your actual document path (e.g., /docs/whitepaper.pdf). 
            Using a PDF is recommended over .doc for native iframe rendering. 
          */}
          <iframe
            src="about:blank"
            title="Document Viewer"
            className="w-full h-full border-none absolute inset-0 z-10 opacity-0" 
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50 border-4 border-dashed border-slate-200 m-8 rounded-3xl">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
              <FileText className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-700">Document Viewer Ready</h3>
            <p className="text-base font-medium text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              This expansive container is ready to render your 15-20 page document. <br/><br/>Map the <code>&lt;iframe src="..."&gt;</code> to your repository file path to view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
