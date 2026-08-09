'use client';

import { subjectsData } from '@/lib/data';
import { BookOpen, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  selectedSubject: string | null;
  onSubjectSelect: (subjectId: string | null) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export default function Sidebar({
  selectedSubject,
  onSubjectSelect,
  isMobileMenuOpen,
  onMobileMenuToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card hover:bg-slate-700/50 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 glass z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SAFAR 3.0</h1>
              <p className="text-xs text-slate-400">SSC CGL 2027</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-2">
            <button
              onClick={() => {
                onSubjectSelect(null);
                if (window.innerWidth < 1024) onMobileMenuToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedSubject === null
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <BookOpen size={16} />
              </div>
              <span className="font-medium">Dashboard</span>
              {selectedSubject === null && <ChevronRight size={16} className="ml-auto" />}
            </button>

            {subjectsData.map((subject) => (
              <button
                key={subject.id}
                onClick={() => {
                  onSubjectSelect(subject.id);
                  if (window.innerWidth < 1024) onMobileMenuToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedSubject === subject.id
                    ? `bg-gradient-to-r from-${subject.color}-500/20 to-${subject.color}-600/20 border border-${subject.color}-500/30 text-white`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${subject.color}-500/30 to-${subject.color}-600/30 flex items-center justify-center`}
                >
                  <BookOpen size={16} className={`text-${subject.color}-400`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium block">{subject.name}</span>
                  <span className="text-xs text-slate-500">{subject.faculty}</span>
                </div>
                {selectedSubject === subject.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">
              Stay consistent. Stay focused.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
