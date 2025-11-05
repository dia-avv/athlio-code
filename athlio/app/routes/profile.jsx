import React, { useState } from 'react';
import NavigationTabs from '../components/UI/NavTabs';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'info', label: 'Info' },
    { id: 'stats', label: 'Stats' },
    { id: 'matches', label: 'Matches' }
  ];

  return (
    <main className="profile-page">
      <NavigationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="profile-content">
        {activeTab === 'posts' && <div>Posts content (placeholder)</div>}
        {activeTab === 'info' && <div>Info content (placeholder)</div>}
        {activeTab === 'stats' && <div>Stats content (placeholder)</div>}
        {activeTab === 'matches' && <div>Matches content (placeholder)</div>}
      </section>
    </main>
  );
}
