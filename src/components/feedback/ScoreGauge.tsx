'use client';

import { useEffect, useRef } from 'react';

interface ScoreGaugeProps {
  score: number; // 0–100
  label: string; // e.g. "Proficient"
  size?: number; // px diameter, default 180
}

export default function ScoreGauge({ score, label, size = 180 }: ScoreGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const target = Math.min(100, Math.max(0, score));
    const DPR = window.devicePixelRatio || 1;
    canvas.width = size * DPR;
    canvas.height = size * DPR;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(DPR, DPR);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.38;
    const lineWidth = size * 0.075;
    const START = Math.PI * 0.75;
    const FULL = Math.PI * 1.5;

    function getColor(pct: number): string {
      if (pct >= 0.85) return '#10b981'; // excellent — green
      if (pct >= 0.65) return '#6366f1'; // good — indigo
      if (pct >= 0.45) return '#f59e0b'; // average — amber
      return '#f43f5e';                  // poor — red
    }

    function drawFrame(current: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);

      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, R, START, START + FULL);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Arc fill
      const pct = current / 100;
      if (pct > 0) {
        const gradient = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, getColor(pct));

        ctx.beginPath();
        ctx.arc(cx, cy, R, START, START + FULL * pct);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Score text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = getColor(pct || 0.5);
      ctx.font = `bold ${size * 0.22}px Outfit, sans-serif`;
      ctx.fillText(String(Math.round(current)), cx, cy - size * 0.04);

      // Label
      ctx.fillStyle = 'rgba(148,163,184,0.9)';
      ctx.font = `${size * 0.085}px Inter, sans-serif`;
      ctx.fillText(label, cx, cy + size * 0.14);
    }

    // Animate count-up
    const duration = 900;
    const startTime = performance.now();
    const startVal = currentRef.current;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      currentRef.current = startVal + (target - startVal) * eased;
      drawFrame(currentRef.current);
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [score, label, size]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Score: ${score} — ${label}`}
      role="img"
    />
  );
}
