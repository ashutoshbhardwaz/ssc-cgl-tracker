'use client';

import { subjectsData } from '@/lib/data';
import { BookOpen, ChevronRight, Menu, X, Timer } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.button
        onClick={onMobileMenuToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card hover:bg-slate-700/50 transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={onMobileMenuToggle}
          />
        )}
      </AnimatePresence>

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
            <motion.button
              layout
              onClick={() => {
                onSubjectSelect(null);
                if (window.innerWidth < 1024) onMobileMenuToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedSubject === null
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center"
                animate={{
                  backgroundColor: selectedSubject === null ? 'rgba(59, 130, 246, 0.3)' : 'rgba(51, 65, 85, 0.8)',
                }}
                transition={{ duration: 0.3 }}
              >
                <BookOpen size={16} />
              </motion.div>
              <span className="font-medium">Dashboard</span>
              <AnimatePresence>
                {selectedSubject === null && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-auto"
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              layout
              onClick={() => {
                window.location.href = '/focus';
                if (window.innerWidth < 1024) onMobileMenuToggle();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Timer size={16} className="text-purple-400" />
              </div>
              <span className="font-medium">Focus Timer</span>
            </motion.button>

            {subjectsData.map((subject) => (
              <motion.button
                layout
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${subject.color}-500/30 to-${subject.color}-600/30 flex items-center justify-center`}
                  animate={{
                    backgroundColor: selectedSubject === subject.id 
                      ? `rgba(var(--${subject.color}-rgb), 0.3)` 
                      : 'rgba(51, 65, 85, 0.8)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <BookOpen size={16} className={`text-${subject.color}-400`} />
                </motion.div>
                <div className="flex-1 text-left">
                  <span className="font-medium block">{subject.name}</span>
                  <span className="text-xs text-slate-500">{subject.faculty}</span>
                </div>
                <AnimatePresence>
                  {selectedSubject === subject.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-auto"
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
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
