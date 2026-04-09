'use client';

import { useEffect, useRef } from 'react';

interface WaveformProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
}

export default function Waveform({ analyserNode, isActive }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BAR_COUNT = 48;
    const BAR_GAP = 3;

    function draw() {
      if (!canvas || !ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const dataArray: number[] = [];

      if (analyserNode && isActive) {
        const bufferLength = analyserNode.frequencyBinCount;
        const raw = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(raw as unknown as Uint8Array<ArrayBuffer>);
        for (let i = 0; i < bufferLength; i++) dataArray.push(raw[i] ?? 0);
      } else {
        // Idle animation — gentle breathing
        const t = Date.now() / 1000;
        for (let i = 0; i < BAR_COUNT; i++) {
          const wave = Math.sin(t * 1.5 + i * 0.4) * 0.5 + 0.5;
          dataArray.push(Math.round(wave * 30 + 8));
        }
      }

      const barWidth = (W - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
      const step = Math.floor(dataArray.length / BAR_COUNT);

      // Gradient
      const gradient = ctx.createLinearGradient(0, H, 0, 0);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(0.5, '#a78bfa');
      gradient.addColorStop(1, '#f43f5e');

      for (let i = 0; i < BAR_COUNT; i++) {
        const sample = dataArray[i * step] ?? 0;
        const normalised = sample / 255;
        const barHeight = Math.max(4, normalised * H * 0.85);
        const x = i * (barWidth + BAR_GAP);
        const y = (H - barHeight) / 2;

        // Rounded rect bars
        const r = Math.min(barWidth / 2, 4);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, y + barHeight - r);
        ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - r, y + barHeight);
        ctx.lineTo(x + r, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.globalAlpha = isActive ? 0.9 : 0.35;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserNode, isActive]);

  return (
    <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={80}
        style={{ width: '100%', height: '100%' }}
        aria-label="Audio waveform visualisation"
      />
    </div>
  );
}
