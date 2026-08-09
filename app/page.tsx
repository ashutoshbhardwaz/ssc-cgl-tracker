'use client';

import { useState } from 'react';
import { subjectsData } from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import SubjectView from '@/components/SubjectView';

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedSubjectData = subjectsData.find((s) => s.id === selectedSubject);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <Sidebar
          selectedSubject={selectedSubject}
          onSubjectSelect={setSelectedSubject}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="lg:ml-72">
            {selectedSubject && selectedSubjectData ? (
              <SubjectView subject={selectedSubjectData} />
            ) : (
              <Dashboard />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
