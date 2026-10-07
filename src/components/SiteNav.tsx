import { useEffect, useState } from 'react';
const links=[['story-section','Story'],['explorer-section','Project map'],['pilot-studies','Case studies'],['methodology','Sources']];
export function SiteNav(){
 const [active,setActive]=useState('');
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id==='top'?'':entry.target.id);},{rootMargin:'-10% 0px -65% 0px',threshold:0});for(const id of ['top',...links.map(([id])=>id)]){const el=document.getElementById(id);if(el)observer.observe(el);}return()=>observer.disconnect();},[]);
 return <nav className="site-nav" aria-label="Main navigation"><a className="site-nav-brand" href="#top" aria-label="Paper to Power home">P<span>→</span>P</a><div>{links.map(([id,label])=><a href={`#${id}`} key={id} aria-current={active===id?'location':undefined}>{label}</a>)}</div></nav>;
}
