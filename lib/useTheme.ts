'use client'

import { useState, useEffect } from "react"

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    } else {
      return false;
    };
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    };

    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleMode = () => setDarkMode(!darkMode);

  return { darkMode, toggleMode }
}