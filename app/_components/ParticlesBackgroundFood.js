"use client";

import { useEffect, useRef } from "react";

export default function ParticlesBackgroundFood({
  speed = 0.12,
  opacity = 0.55,
  sizeMin = 70,
  sizeMax = 110,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stopped = false;

    // ✅ Only what you have
    const sources = [
      "/particles/burger.png",
      "/particles/pizza.png",
      "/particles/fries.png",
      "/particles/donut.png",
    ];

    let goodImages = [];
    let particles = [];

    const setSize = () => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = window.innerWidth;
      h = window.innerHeight;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loadImages = async () => {
      const results = await Promise.all(
        sources.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve({ ok: true, img, src });
              img.onerror = () => resolve({ ok: false, img: null, src });
              img.src = src;
            })
        )
      );

      goodImages = results.filter((r) => r.ok && r.img).map((r) => r.img);

      const failed = results.filter((r) => !r.ok).map((r) => r.src);
      if (failed.length) console.warn("Food particles failed to load:", failed);

      return goodImages.length > 0;
    };

    // spread them around screen in fixed "zones" so it looks intentional
    const zones = [
      { x: 0.18, y: 0.22 },
      { x: 0.78, y: 0.18 },
      { x: 0.22, y: 0.78 },
      { x: 0.82, y: 0.72 },
    ];

    class FoodFloat {
      constructor(img, zoneIndex) {
        this.img = img;
        this.zone = zones[zoneIndex % zones.length];

        this.size = rand(sizeMin, sizeMax);

        // start near zone but with a little randomness
        this.baseX = w * this.zone.x + rand(-60, 60);
        this.baseY = h * this.zone.y + rand(-60, 60);

        this.x = this.baseX;
        this.y = this.baseY;

        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;

        // slow “breathing” bob
        this.bobSpeed = rand(0.6, 1.2);
        this.bobAmp = rand(10, 18);
        this.bobPhase = Math.random() * Math.PI * 2;

        this.angle = rand(-0.25, 0.25);
        this.rot = rand(-0.002, 0.002);

        this.alpha = opacity;
      }

      update(t) {
        // gentle drift around base position
        this.x = this.baseX + Math.sin(t * 0.001 * this.bobSpeed + this.bobPhase) * this.bobAmp;
        this.y = this.baseY + Math.cos(t * 0.001 * this.bobSpeed + this.bobPhase) * this.bobAmp;

        this.angle += this.rot;

        // keep base inside viewport on resize / small screens
        this.baseX = clamp(this.baseX, this.size, w - this.size);
        this.baseY = clamp(this.baseY, this.size, h - this.size);

        this.draw();
      }

      draw() {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        // stronger but still soft shadow, tinted by brand (#A73D4D)
        ctx.shadowBlur = 22;
        ctx.shadowColor = "rgba(167,61,77,0.22)";

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const createParticles = () => {
      particles = [];
      // 1 of each image
      goodImages.forEach((img, i) => {
        particles.push(new FoodFloat(img, i));
      });
    };

    const animate = (t) => {
      if (stopped) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => p.update(t));
      animationId = requestAnimationFrame(animate);
    };

    const onResize = () => {
      setSize();
      createParticles();
    };

    const rand = (min, max) => min + Math.random() * (max - min);
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    (async () => {
      setSize();
      const ok = await loadImages();
      if (!ok) return;

      createParticles();
      animate(0);
      window.addEventListener("resize", onResize);
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [speed, opacity, sizeMin, sizeMax]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
