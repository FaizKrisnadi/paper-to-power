import { useEffect, useRef } from 'react';

export function HeroSection() {
 const videoRef = useRef<HTMLVideoElement>(null);
 useEffect(() => {
  const video = videoRef.current!;
  video.muted = true; video.defaultMuted = true;
  video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
  const start = () => { if (!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) void video.play().catch(() => undefined); };
  video.addEventListener('canplay', start); window.addEventListener('pageshow', start);
  document.addEventListener('visibilitychange', start); document.addEventListener('pointerup', start, { once: true });
  start();
  return () => {video.removeEventListener('canplay',start);window.removeEventListener('pageshow',start);document.removeEventListener('visibilitychange',start);document.removeEventListener('pointerup',start);};
 }, []);
 return <section className="hero-landing hero-v3" id="top">
  <div className="hero-landing__media" aria-hidden="true"><video ref={videoRef} className="hero-landing__video" autoPlay muted loop playsInline preload="auto"><source src="/background-video-clean-h264.mp4" type="video/mp4" /></video><div className="hero-landing__tint" /></div>
  <div className="hero-landing__inner">
   <p className="hero-kicker">Renewable energy · Southeast Asia</p>
   <h1 className="hero-landing__title">Paper to Power</h1>
   <p className="hero-landing__lede">What’s on the ground?</p>
   <p className="hero-support">Across Southeast Asia, renewable energy projects move from announcements to construction and operation. Paper to Power follows that journey through public records and mapped evidence.</p>
   <a className="hero-start" href="#story-section">Follow the story <span aria-hidden="true">↘</span></a>
  </div>
 </section>;
}
