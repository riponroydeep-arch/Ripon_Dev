const initializePortfolioEnhancements = () => {
  const skip = document.createElement('a');
  skip.href = '#work'; skip.textContent = 'Skip to selected work'; skip.className = 'skip-link';
  document.body.prepend(skip);
  const skipStyle = document.createElement('style');
  skipStyle.textContent = '.skip-link{position:fixed;top:10px;left:10px;z-index:50;padding:10px 14px;background:var(--acid);color:var(--ink);font:11px DM Mono,monospace;transform:translateY(-160%);transition:transform .2s}.skip-link:focus{transform:none}';
  document.head.appendChild(skipStyle);
  document.querySelector('nav')?.setAttribute('aria-label', 'Primary navigation');
  const portrait = document.querySelector('.portrait img');
  if (portrait) { portrait.setAttribute('src', 'img/riponroy2.png'); portrait.setAttribute('alt', 'Portrait of Ripon Roy'); }
  const portraitFrame = portrait?.parentElement;
  const portraitSwap = portrait ? portrait.cloneNode(true) : null;
  if (portraitSwap instanceof HTMLImageElement && portraitFrame) { portraitSwap.className = 'portrait-swap'; portraitSwap.setAttribute('alt', ''); portraitFrame.appendChild(portraitSwap); }
  const visual = document.querySelector('.visual');
  if (visual) {
    const stage = document.createElement('div'); stage.className = 'sweep-stage'; stage.setAttribute('aria-hidden', 'true');
    const imageSources = ['img/riponroy1.png', 'img/riponroy2.png', 'img/riponroy3.png', 'img/riponroy4.png'];
    imageSources.forEach((source, index) => { const card = document.createElement('figure'); card.className = 'sweep-card'; card.innerHTML = `<img src="${source}" alt="">`; card.dataset.index = String(index); stage.appendChild(card); });
    visual.insertBefore(stage, visual.firstChild);
    const label = document.createElement('div'); label.className = 'sweep-label'; label.textContent = 'PERSONAL SIGNAL / 04 FRAMES'; visual.appendChild(label);
    const cards = [...stage.querySelectorAll('.sweep-card')]; let sweepAngle = 0; let sweepTarget = 0; let lastFront = -1;
    visual.addEventListener('pointermove', event => { const bounds = visual.getBoundingClientRect(); sweepTarget = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.55; });
    visual.addEventListener('pointerleave', () => { sweepTarget = 0; });
    const sweep = (time) => { sweepAngle += 0.0027; let frontIndex = 0; let frontDepth = -1; cards.forEach((card, index) => { const angle = sweepAngle + index * Math.PI * 2 / cards.length + sweepTarget; const x = Math.sin(angle) * 245; const z = Math.cos(angle) * 150; const depth = (z + 150) / 300; const scale = 0.72 + depth * 0.28; card.style.transform = `translate(-50%,-50%) translate3d(${x}px,0,${z}px) rotateY(${Math.sin(angle) * 20}deg) rotateZ(${Math.sin(angle) * 3}deg) scale(${scale})`; card.style.opacity = String(0.16 + Math.pow(depth, 3) * 0.84); card.style.filter = `brightness(${0.62 + Math.pow(depth, 3) * 0.38}) saturate(${0.62 + Math.pow(depth, 2) * 0.38})`; card.style.zIndex = String(Math.round(z + 200)); card.classList.toggle('is-front', depth > 0.92); if (depth > frontDepth) { frontDepth = depth; frontIndex = index; } }); if (portrait && frontDepth > 0.96 && frontIndex !== lastFront) { if (portraitSwap instanceof HTMLImageElement && portraitFrame) { portraitSwap.src = imageSources[frontIndex]; portraitFrame.classList.add('is-blending'); window.setTimeout(() => { portrait.src = imageSources[frontIndex]; portraitFrame.classList.remove('is-blending'); }, 700); } else { portrait.setAttribute('src', imageSources[frontIndex]); } lastFront = frontIndex; } requestAnimationFrame(sweep); }; requestAnimationFrame(sweep);
  }
  const dialog = document.querySelector('.case-modal');
  dialog?.setAttribute('aria-label', 'Case study details');
  const toggle = document.querySelector('.mobile-toggle');
  toggle?.addEventListener('click', event => event.stopPropagation());

  const canvas = document.querySelector('#network');
  if (!canvas || !visual) return;

  const hud = document.createElement('div');
  hud.className = 'network-hud mono';
  hud.innerHTML = '<span class="hud-dot"></span><span>FIELD / <b>TRACKING</b></span><span class="hud-coords">X 00 / Y 00</span>';
  visual.appendChild(hud);
  const style = document.createElement('style');
  style.textContent = '.network-hud{position:absolute;left:50%;bottom:4%;z-index:3;display:flex;gap:10px;align-items:center;padding:9px 12px;border:1px solid rgba(110,221,208,.28);background:rgba(7,16,24,.58);color:var(--muted);font-size:9px;letter-spacing:.12em;pointer-events:none;opacity:.75}.network-hud b{color:var(--acid);font-weight:400}.hud-dot{width:5px;height:5px;border-radius:50%;background:var(--acid);box-shadow:0 0 10px var(--acid)}.hud-coords{color:var(--aqua)}@media(max-width:760px){.network-hud{font-size:8px;bottom:2%}}';
  document.head.appendChild(style);
  const coords = hud.querySelector('.hud-coords');
  canvas.addEventListener('pointermove', event => {
    const bounds = canvas.getBoundingClientRect();
    const x = Math.round(((event.clientX - bounds.left) / bounds.width) * 100);
    const y = Math.round(((event.clientY - bounds.top) / bounds.height) * 100);
    if (coords) coords.textContent = `X ${String(x).padStart(2, '0')} / Y ${String(y).padStart(2, '0')}`;
    canvas.style.transform = `translate(${(x - 50) * 0.012}px, ${(y - 50) * 0.012}px)`;
  });
  canvas.addEventListener('pointerleave', () => { if (coords) coords.textContent = 'X 00 / Y 00'; canvas.style.transform = ''; });

  const workGrid = document.querySelector('.work-grid');
  if (workGrid) {
    const filterBar = document.createElement('div');
    filterBar.className = 'work-filter mono';
    filterBar.setAttribute('aria-label', 'Filter selected work');
    filterBar.innerHTML = ['All', 'Systems', 'Product', 'Automation', 'Research'].map((label, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-filter="${label.toLowerCase()}">${label}</button>`).join('');
    workGrid.parentElement?.insertBefore(filterBar, workGrid);
    const cards = [...workGrid.querySelectorAll('.work')];
    const categories = ['systems', 'product', 'automation', 'research'];
    filterBar.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      filterBar.querySelectorAll('button').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      cards.forEach((card, index) => { card.hidden = filter !== 'all' && categories[index] !== filter; });
    }));
    const filterStyle = document.createElement('style');
    filterStyle.textContent = '.work-filter{display:flex;gap:8px;flex-wrap:wrap;margin:-22px 0 30px}.work-filter button{border:1px solid var(--line);background:transparent;padding:9px 13px;color:var(--muted);font:10px DM Mono,monospace;text-transform:uppercase;letter-spacing:.1em}.work-filter button:hover,.work-filter button.active{border-color:var(--acid);color:var(--acid);background:rgba(200,240,74,.08)}.work[hidden]{display:none}@media(max-width:760px){.work-filter{margin-top:-8px}}';
    document.head.appendChild(filterStyle);
  }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePortfolioEnhancements); else initializePortfolioEnhancements();

const initializeMotionEnhancements = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const progress = document.createElement('div'); progress.className = 'scroll-progress'; progress.setAttribute('aria-hidden', 'true'); document.body.appendChild(progress);
  const updateProgress = () => { const height = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`; }; window.addEventListener('scroll', updateProgress, { passive: true }); updateProgress();
  document.querySelectorAll('.work').forEach(card => { card.addEventListener('pointermove', event => { const box = card.getBoundingClientRect(); const rotateX = ((event.clientY - box.top) / box.height - 0.5) * -7; const rotateY = ((event.clientX - box.left) / box.width - 0.5) * 9; card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`; }); card.addEventListener('pointerleave', () => { card.style.transform = ''; }); });
  const portrait = document.querySelector('.portrait'); const visual = document.querySelector('.visual'); visual?.addEventListener('pointermove', event => { if (!portrait) return; const box = visual.getBoundingClientRect(); const rotateX = ((event.clientY - box.top) / box.height - 0.5) * -4; const rotateY = ((event.clientX - box.left) / box.width - 0.5) * 5; portrait.style.transform = `rotate(3deg) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; }); visual?.addEventListener('pointerleave', () => { if (portrait) portrait.style.transform = ''; });
  document.querySelectorAll('.button,.nav-cta').forEach(button => { button.addEventListener('pointermove', event => { const box = button.getBoundingClientRect(); button.style.transform = `translate(${((event.clientX - box.left) / box.width - 0.5) * 5}px,${((event.clientY - box.top) / box.height - 0.5) * 4}px)`; }); button.addEventListener('pointerleave', () => { button.style.transform = ''; }); });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeMotionEnhancements); else initializeMotionEnhancements();
