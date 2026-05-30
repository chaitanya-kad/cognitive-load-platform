import { useState, useEffect, useRef, useCallback } from "react";

export function useTypingMetrics() {
  const [keystrokes, setKeystrokes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [keyFreq, setKeyFreq] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [keyTimes, setKeyTimes] = useState([]);
  const [pauses, setPauses] = useState(0);
  const [burstCount, setBurstCount] = useState(0);
  const [consistencyScore, setConsistencyScore] = useState(100);
  const [focusDecay, setFocusDecay] = useState(0);

  const startTime = useRef(null);
  const timerRef = useRef(null);
  const lastKeyTime = useRef(null);
  const recentGaps = useRef([]);
  const errorBursts = useRef(0);
  const consecutiveBackspaces = useRef(0);

  useEffect(() => {
  if (keystrokes > 0 && !timerRef.current) {
    timerRef.current = setInterval(() => {
      if (startTime.current) {
        setElapsed(Date.now() - startTime.current);
      }
    }, 200); // faster interval = more responsive WPM
  }
   return () => {
     if (timerRef.current) {
       clearInterval(timerRef.current);
       timerRef.current = null;
     }
   };
  }, [keystrokes]);

  const recordKey = useCallback((key) => {
    const now = Date.now();
    if (!startTime.current) startTime.current = now;

    // Gap analysis
    if (lastKeyTime.current) {
      const gap = now - lastKeyTime.current;

      // Pause detection (gap > 2s)
      if (gap > 2000) setPauses(p => p + 1);

      // Store recent gaps for consistency
      recentGaps.current = [...recentGaps.current.slice(-19), gap];

      // Consistency: std deviation of gaps
      if (recentGaps.current.length > 3) {
        const avg = recentGaps.current.reduce((a, b) => a + b, 0) / recentGaps.current.length;
        const variance = recentGaps.current.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / recentGaps.current.length;
        const stdDev = Math.sqrt(variance);
        const consistency = Math.max(0, Math.round(100 - (stdDev / avg) * 50));
        setConsistencyScore(consistency);
      }
    }
    lastKeyTime.current = now;

    setKeystrokes(k => k + 1);
    setKeyTimes(prev => [...prev.slice(-199), now]);

    // Backspace burst detection
    if (key === "Backspace") {
      setBackspaces(b => b + 1);
      consecutiveBackspaces.current += 1;
      if (consecutiveBackspaces.current >= 3) {
        errorBursts.current += 1;
        setBurstCount(errorBursts.current);
      }
    } else {
      consecutiveBackspaces.current = 0;
    }

    const k = key.toLowerCase();
    if (k.length === 1 || k === " ") {
      setKeyFreq(prev => ({ ...prev, [k]: (prev[k] || 0) + 1 }));
    }

    // Focus decay: increases over time with high error rate
    setFocusDecay(prev => {
      const timeWeight = Math.min((Date.now() - startTime.current) / 120000, 1);
      return Math.round(Math.min(100, prev + (key === "Backspace" ? 0.5 : 0) + timeWeight * 0.1));
    });

  }, []);

  const reset = useCallback(() => {
    setKeystrokes(0); setBackspaces(0); setKeyFreq({});
    setElapsed(0); setKeyTimes([]); setPauses(0);
    setBurstCount(0); setConsistencyScore(100); setFocusDecay(0);
    startTime.current = null; lastKeyTime.current = null;
    recentGaps.current = []; errorBursts.current = 0;
    consecutiveBackspaces.current = 0;
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  return {
    keystrokes, backspaces, keyFreq, elapsed, keyTimes,
    pauses, burstCount, consistencyScore, focusDecay,
    recordKey, reset
  };
}