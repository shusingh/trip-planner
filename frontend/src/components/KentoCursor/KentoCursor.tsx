import { useEffect, useRef } from 'react';

import styles from './KentoCursor.module.css';

/**
 * Kentō cursor. In woodblock printing, kentō marks are the carved corner
 * registrations that align the paper to the block. Here the pointer is a fine
 * ink dot inside a small breathing frame of corner brackets; hovering an
 * interactive element sends the corners out to register it. Falls back to the
 * native cursor for touch input and reduced motion.
 *
 * Ported from the portfolio (shusingh.github.io) to keep the two sites feeling
 * like one hand made them.
 */
export function KentoCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const nwRef = useRef<HTMLDivElement>(null);
  const neRef = useRef<HTMLDivElement>(null);
  const swRef = useRef<HTMLDivElement>(null);
  const seRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const corners = [nwRef.current, neRef.current, swRef.current, seRef.current];
    if (!dot || corners.some((c) => c === null)) return undefined;
    const dotEl: HTMLDivElement = dot;
    const marks = corners as HTMLDivElement[];

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    if (reducedMotion.matches || coarsePointer.matches) {
      return undefined;
    }

    document.documentElement.classList.add('kento-cursor');

    const MARK = 11; // corner bracket size, must match the CSS
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight * 0.3;
    let target: Element | null = null;
    let visible = false;
    let cx = pointerX;
    let cy = pointerY;
    let hw = 13;
    let hh = 13;
    let pulse = 0;
    let lastTime = performance.now();
    let raf = 0;

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const element = target instanceof Element && target.isConnected ? target : null;
      const interactive = element?.closest<HTMLElement>(
        'a, button, input, textarea, select, [role="button"]'
      );
      const overProse = !interactive && Boolean(element?.closest('p, li, h1, h2, h3'));

      let tx = pointerX;
      let ty = pointerY;
      // Slow breathing at rest, like paper settling.
      let thw = 13 + Math.sin(now / 900) * 1.2;
      let thh = thw;
      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        tx = rect.left + rect.width / 2;
        ty = rect.top + rect.height / 2;
        thw = rect.width / 2 + 7;
        thh = rect.height / 2 + 7;
      }

      pulse = Math.max(0, pulse - dt * 6);
      const shrink = pulse * 4;
      const ease = 1 - Math.exp(-(interactive ? 14 : 20) * dt);
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      hw += (thw - shrink - hw) * ease;
      hh += (thh - shrink - hh) * ease;

      marks[0].style.transform = `translate3d(${cx - hw}px, ${cy - hh}px, 0)`;
      marks[1].style.transform = `translate3d(${cx + hw - MARK}px, ${cy - hh}px, 0)`;
      marks[2].style.transform = `translate3d(${cx - hw}px, ${cy + hh - MARK}px, 0)`;
      marks[3].style.transform = `translate3d(${cx + hw - MARK}px, ${cy + hh - MARK}px, 0)`;
      const opacity = !visible ? '0' : overProse ? '0.18' : '1';
      for (const mark of marks) {
        mark.style.opacity = opacity;
        mark.classList.toggle(styles.cornerHot, Boolean(interactive));
      }
      dotEl.style.transform = `translate3d(${pointerX - 1.75}px, ${pointerY - 1.75}px, 0)`;
      dotEl.style.opacity = visible ? '1' : '0';

      raf = window.requestAnimationFrame(frame);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      target = event.target instanceof Element ? event.target : null;
      visible = true;
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      pulse = 1;
    }

    function hide() {
      visible = false;
    }

    function handleScroll() {
      // The element under the pointer changes as the page scrolls beneath it.
      target = document.elementFromPoint(pointerX, pointerY);
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('scroll', handleScroll, { passive: true });
    raf = window.requestAnimationFrame(frame);

    return () => {
      document.documentElement.classList.remove('kento-cursor');
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={nwRef} className={`${styles.corner} ${styles.cornerNw}`} />
      <div ref={neRef} className={`${styles.corner} ${styles.cornerNe}`} />
      <div ref={swRef} className={`${styles.corner} ${styles.cornerSw}`} />
      <div ref={seRef} className={`${styles.corner} ${styles.cornerSe}`} />
      <div ref={dotRef} className={styles.cursorDot} />
    </div>
  );
}
