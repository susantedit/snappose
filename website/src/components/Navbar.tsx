'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Sparkles, Menu, X, ArrowUpRight, Compass, Mic, Brain } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0E0C]/85 backdrop-blur-xl border-b border-surfaceBorder/60 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-neon-lime group-hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="POSEHANUM logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-textPrimary flex items-center gap-1">
              POSE<span className="text-primary font-black">HANUM</span>
            </span>
            <span className="hidden sm:block text-[9px] font-bold tracking-widest text-textSecondary uppercase">
              AI Pose & Photo Coach
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-textSecondary">
          <Link
            href="/features"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            Features
          </Link>
          <Link
            href="/pose-guide"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-primary" /> Pose Library
          </Link>
          <Link
            href="/guides"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            Guides
          </Link>
          <Link
            href="/blog"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Blog
          </Link>
          <Link
            href="/faq"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            FAQ
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/#download"
            className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-[#0A0E0C] font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-neon-lime hover:shadow-[0_0_30px_rgba(183,255,0,0.6)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#0A0E0C] fill-[#0A0E0C]" />
            Get App Free
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-surface border border-surfaceBorder text-textPrimary"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-secondaryBg/95 backdrop-blur-2xl border-b border-surfaceBorder px-6 py-6 space-y-4 animate-in slide-in-from-top-4">
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-textPrimary hover:text-primary"
          >
            All Features Directory
          </Link>
          <Link
            href="/pose-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-textPrimary hover:text-primary"
          >
            Visual Pose Guide Library
          </Link>
          <Link
            href="/guides"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-textPrimary hover:text-primary"
          >
            Photography Masterclass Guides
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-textPrimary hover:text-primary"
          >
            Deep Dives & Blog Hub
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-textPrimary hover:text-primary"
          >
            Frequently Asked Questions (FAQ)
          </Link>
          <div className="pt-2">
            <a
              href="/#download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-primary text-background font-black text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2"
            >
              Get POSEHANUM Now <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Subtle Scroll-Progress Indicator Line */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-cyanAccent to-primary shadow-[0_0_8px_#B7FF00]"
      />
    </header>
  );
}
