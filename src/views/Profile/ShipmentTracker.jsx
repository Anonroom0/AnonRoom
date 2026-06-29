import React from 'react';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Truck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

/**
 * ShipmentTracker Component
 * -----------------------------------------------------------------------------
 * Displays physical prize delivery progress. Features a vertical timeline,
 * status progress bars, and localized mock tracking data for high realism.
 */
export default function ShipmentTracker({ navigateTo }) {
  
  // High-fidelity mock tracking data
  const mockShipments = [
    { 
      id: 'TRK-9982-IN', 
      item: 'Iron Man Custom Action Figure', 
      status: 'In Transit', 
      courier: 'Shadowfax Global',
      estimatedArrival: 'July 5, 2026',
      progress: 60, // percentage for the horizontal bar
      destination: 'Meerut, Uttar Pradesh, India',
      updates: [
        { date: 'June 29, 2026', time: '10:30 AM', event: 'Departed main sorting facility in Delhi Hub.' },
        { date: 'June 28, 2026', time: '04:15 PM', event: 'Package picked up by courier logistics team.' },
        { date: 'June 27, 2026', time: '09:00 AM', event: 'Order processed, packed, and labeled.' }
      ]
    },
    { 
      id: 'TRK-8811-IN', 
      item: 'AnonRoom Exclusive Premium Hoodie', 
      status: 'Delivered', 
      courier: 'Delhivery',
      estimatedArrival: 'June 10, 2026',
      progress: 100,
      destination: 'Meerut, Uttar Pradesh, India',
      updates: [
        { date: 'June 10, 2026', time: '02:20 PM', event: 'Package successfully delivered to recipient.' },
        { date: 'June 10, 2026', time: '08:15 AM', event: 'Out for delivery. Courier is arriving today.' },
        { date: 'June 09, 2026', time: '11:45 PM', event: 'Arrived at local distribution center (Meerut).' }
      ]
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => { AudioEngine.playClick(); navigateTo('menu'); }} 
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Shipments</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Track your physical prize delivery routes.</p>
        </div>
      </div>

      <div className="space-y-8">
        {mockShipments.map((shipment) => (
          <div key={shipment.id} className="card-standard bg-white overflow-hidden shadow-sm border border-slate-100 transition-shadow hover:shadow-md rounded-[1.5rem]">
            
            {/* Shipment Header Block */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-start justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Truck className="w-32 h-32" />
              </div>
              
              <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 border shadow-sm ${
                  shipment.progress === 100 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                }`}>
                  <Package className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="space-y-1.5 mt-1">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight pr-4">
                    {shipment.item}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" /> {shipment.id}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                      {shipment.courier}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-left md:text-right relative z-10 bg-white p-3 rounded-xl border border-slate-100 shadow-sm min-w-[160px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1 md:justify-end">
                  <Clock className="w-3 h-3" /> Estimated Arrival
                </p>
                <p className={`text-lg font-black tracking-tight ${shipment.progress === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                  {shipment.estimatedArrival}
                </p>
              </div>
            </div>

            {/* Horizontal Progress Bar Segment */}
            <div className="px-6 sm:px-8 py-6 border-b border-slate-50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3 px-1 uppercase tracking-widest">
                <span className={shipment.progress >= 0 ? 'text-indigo-600' : ''}>Processed</span>
                <span className={shipment.progress >= 50 ? 'text-indigo-600' : ''}>In Transit</span>
                <span className={shipment.progress >= 100 ? 'text-green-600' : ''}>Delivered</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                    shipment.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-400'
                  }`} 
                  style={{ width: `${shipment.progress}%` }} 
                >
                  {/* Subtle shine effect on the progress bar */}
                  <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white/30 to-transparent"></div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">Destination: <strong className="text-slate-700">{shipment.destination}</strong></span>
              </div>
            </div>

            {/* Vertical Tracking Timeline */}
            <div className="p-6 sm:p-8">
              <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Transit Log Updates
              </h4>
              
              <div className="space-y-6 pl-3 border-l-2 border-slate-100 ml-2">
                {shipment.updates.map((update, idx) => {
                  const isLatest = idx === 0;
                  const isDelivered = isLatest && shipment.progress === 100;
                  
                  return (
                    <div key={idx} className="relative pl-6 sm:pl-8">
                      {/* Timeline Dot & Ring */}
                      <div className={`absolute -left-[25px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                        isLatest 
                          ? isDelivered 
                            ? 'bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)]'
                            : 'bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.2)] animate-pulse' 
                          : 'bg-slate-300'
                      }`}>
                        {isDelivered && <CheckCircle2 className="w-2 h-2 text-white" strokeWidth={4} />}
                      </div>
                      
                      {/* Event Details */}
                      <p className={`text-[15px] leading-snug font-bold ${
                        isLatest 
                          ? isDelivered ? 'text-green-700' : 'text-slate-900' 
                          : 'text-slate-600'
                      }`}>
                        {update.event}
                      </p>
                      
                      {/* Event Timestamp */}
                      <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                        {update.date} • {update.time}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 mx-auto transition-colors">
                  View Detailed Tracking History <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fallback empty Activity component since it's not imported directly in the main block above
const Activity = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
