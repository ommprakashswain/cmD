/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Interface } from './components/Interface';
import { Features } from './components/Features';
import { DesktopApp } from './components/DesktopApp';

export default function App() {
  const [isDesktopMode, setIsDesktopMode] = useState(false);

  useEffect(() => {
    // 1. Detect Electron wrapper (userAgent will contain 'electron')
    // 2. OR enable a web simulation mode if ?desktop=true is in the URL
    const checkIsDesktop = 
      navigator.userAgent.toLowerCase().includes('electron') ||
      window.location.search.includes('desktop=true');
      
    setIsDesktopMode(checkIsDesktop);
  }, []);

  // If opened inside our Windows Electron App, render the actual assistant tool:
  if (isDesktopMode) {
    return <DesktopApp />;
  }

  // If opened in a standard web browser, show the intro/download landing page:
  return (
    <Layout>
      <Hero />
      <Interface />
      <Features />
    </Layout>
  );
}

