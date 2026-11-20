export interface HorizontalTrackOptions {
  trackSelector?: string;
  itemSelector?: string;
  counterSelector?: string;
  mobileCounterSelector?: string;
  progressSelector?: string;
}

export function initHorizontalTrack(options: HorizontalTrackOptions = {}): void {
  const track = document.querySelector<HTMLElement>(
    options.trackSelector ?? '[data-horizontal-track]'
  );
  if (!track) return;

  const items = Array.from(
    track.querySelectorAll<HTMLElement>(options.itemSelector ?? '[data-track-item]')
  );
  const counterEl = document.querySelector<HTMLElement>(
    options.counterSelector ?? '[data-counter]'
  );
  const mobileCounterEl = document.querySelector<HTMLElement>(
    options.mobileCounterSelector ?? '[data-counter-mobile]'
  );
  const progressEl = document.querySelector<HTMLElement>(
    options.progressSelector ?? '[data-scroll-progress]'
  );

  const totalStr = String(items.length).padStart(2, '0');

  const updateIndicators = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (progressEl) {
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (track.scrollLeft / maxScroll) * 100)) : 100;
      progressEl.style.width = `${pct}%`;
    }

    if (items.length === 0) return;

    let activeIdx = 0;
    if (track.scrollLeft <= 12) {
      activeIdx = 0;
    } else if (maxScroll > 0 && track.scrollLeft >= maxScroll - 12) {
      activeIdx = items.length - 1;
    } else {
      const trackRect = track.getBoundingClientRect();
      const anchorX = trackRect.left + trackRect.width * 0.3;
      let bestDist = Infinity;

      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(center - anchorX);
        if (dist < bestDist) {
          bestDist = dist;
          activeIdx = idx;
        }
      });
    }

    const currentStr = String(activeIdx + 1).padStart(2, '0');
    if (counterEl) counterEl.textContent = `${currentStr} / ${totalStr}`;
    if (mobileCounterEl) mobileCounterEl.textContent = `${currentStr} / ${totalStr}`;
  };

  track.addEventListener('scroll', updateIndicators, { passive: true });
  window.addEventListener('resize', updateIndicators, { passive: true });
  updateIndicators();

  // Map vertical mouse wheel to horizontal scroll while preserving native trackpad deltaX
  track.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (track.scrollWidth <= track.clientWidth) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const factor = e.deltaMode === 1 ? 32 : 1;
        track.scrollLeft += e.deltaY * factor;
      }
    },
    { passive: false }
  );

  // Keyboard arrow navigation
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }
    e.preventDefault();
    const step = Math.round(track.clientWidth * 0.55);
    track.scrollBy({
      left: e.key === 'ArrowRight' ? step : -step,
      behavior: 'smooth',
    });
  });

  // Gentle click-vs-drag support for desktop mouse users
  let isPointerDown = false;
  let hasDragged = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    isPointerDown = true;
    hasDragged = false;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
  });

  window.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    if (!hasDragged && Math.abs(dx) > 6) {
      hasDragged = true;
      track.classList.add('cursor-grabbing', 'select-none');
    }
    if (hasDragged) {
      track.scrollLeft = startScrollLeft - dx;
    }
  });

  const endDrag = () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    track.classList.remove('cursor-grabbing', 'select-none');
    if (hasDragged) {
      setTimeout(() => {
        hasDragged = false;
      }, 0);
    }
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Prevent link navigation if user dragged instead of clicked
  track.addEventListener(
    'click',
    (e: MouseEvent) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
}
