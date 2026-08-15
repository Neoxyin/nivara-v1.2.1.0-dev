'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: width * 0.7, y: height * 0.3, targetX: width * 0.7, targetY: height * 0.3 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic floating orbs
    const orbs = [
      {
        x: width * 0.8,
        y: height * 0.2,
        radius: Math.min(width, height) * 0.35,
        color: 'rgba(195, 243, 64, 0.055)',
        vx: 0.3,
        vy: 0.2,
        baseX: width * 0.8,
        baseY: height * 0.2,
      },
      {
        x: width * 0.2,
        y: height * 0.4,
        radius: Math.min(width, height) * 0.32,
        color: 'rgba(39, 90, 67, 0.12)',
        vx: -0.2,
        vy: 0.25,
        baseX: width * 0.2,
        baseY: height * 0.4,
      },
      {
        x: width * 0.5,
        y: height * 0.8,
        radius: Math.min(width, height) * 0.28,
        color: 'rgba(229, 162, 125, 0.04)',
        vx: 0.15,
        vy: -0.3,
        baseX: width * 0.5,
        baseY: height * 0.8,
      },
    ];

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.01;
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Draw floating orbs with smooth motion and mouse attraction
      orbs.forEach((orb, i) => {
        orb.x = orb.baseX + Math.sin(time + i * 2) * 40 + (mouse.x - width / 2) * (0.04 * (i + 1));
        orb.y = orb.baseY + Math.cos(time + i * 1.5) * 35 + (mouse.y - height / 2) * (0.04 * (i + 1));

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Pointer interactive spotlight glow
      const mouseGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        320
      );
      mouseGrad.addColorStop(0, 'rgba(195, 243, 64, 0.035)');
      mouseGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 320, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 will-change-transform"
    />
  );
}
