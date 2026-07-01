import React, { useState, useEffect } from 'react';
import { AudioEngine } from '../services/AudioEngine.js';
import { SupabaseService } from '../services/SupabaseService.js';

// Modular View Imports
import ProfileMenu from './Profile/ProfileMenu';
import RewardCenter from './Profile/RewardCenter';
import TaskCenter from './Profile/TaskCenter';
import WinningsManager from './Profile/WinningsManager';
import ShipmentTracker from './Profile/ShipmentTracker';
import ReferralHub from './Profile/ReferralHub';
import NotificationCenter from './Profile/NotificationCenter';
import HelpAndFaq from './Profile/HelpAndFaq';
import KycPage from './Profile/KycPage';
import DocumentReader from './Profile/DocumentReader';

/**
 * ProfileView (Master Controller)
 * -----------------------------------------------------------------------------
 * Acts as the secure router for the entire profile ecosystem. 
 * Manages the active page state and safely loads the modular components.
 */
export default function ProfileView({ userProfile, onOpenWallet, initialPage = 'menu', onSignOut }) {
  // ROUTING STATE
  const [activePage, setActivePage] = useState(initialPage);
  const [activeDocument, setActiveDocument] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔥 THE DEEP-LINK FIX: 
  // Forces the Profile router to switch pages if App.jsx sends a new initialPage
  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  // NAVIGATION CONTROLLER
  const navigateTo = (page, docType = null) => {
    // Play sound safely
    if (window.AudioEngine) window.AudioEngine.playClick();
    
    if (page === 'doc_reader' && docType) {
      setActiveDocument(docType);
    }
    
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshProfile = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const refreshOnAuth = async () => {
      if (!userProfile?.id) return;
      try {
        const freshProfile = await SupabaseService.getUserProfile(userProfile.id);
        if (freshProfile) {
          window.__PROFILE_REFRESH__?.(freshProfile);
        }
      } catch (err) {
        console.error('Profile refresh failed:', err);
      }
    };
    refreshOnAuth();
  }, [userProfile?.id, refreshKey]);

  // RENDER ROUTER
  return (
    <div className="w-full relative min-h-screen">
      {activePage === 'menu' && (
        <ProfileMenu navigateTo={navigateTo} userProfile={userProfile} onSignOut={onSignOut} refreshSignal={refreshKey} />
      )}
      
      {activePage === 'tasks' && (
        <TaskCenter navigateTo={navigateTo} userProfile={userProfile} onRefresh={refreshProfile} />
      )}
      
      {activePage === 'rewards' && (
        <RewardCenter navigateTo={navigateTo} userProfile={userProfile} onRefresh={refreshProfile} />
      )}
      
      {activePage === 'winnings' && (
        <WinningsManager navigateTo={navigateTo} userProfile={userProfile} onRefresh={refreshProfile} />
      )}
      
      {activePage === 'shipments' && (
        <ShipmentTracker navigateTo={navigateTo} userProfile={userProfile} />
      )}
      
      {activePage === 'referrals' && (
        <ReferralHub navigateTo={navigateTo} userProfile={userProfile} />
      )}
      
      {activePage === 'notifications' && (
        <NotificationCenter navigateTo={navigateTo} userProfile={userProfile} onRefresh={refreshProfile} />
      )}
      
      {activePage === 'faqs' && (
        <HelpAndFaq navigateTo={navigateTo} />
      )}
      
      {activePage === 'kyc' && (
        <KycPage navigateTo={navigateTo} />
      )}
      
      {activePage === 'doc_reader' && (
        <DocumentReader navigateTo={navigateTo} docType={activeDocument} />
      )}
    </div>
  );
}
