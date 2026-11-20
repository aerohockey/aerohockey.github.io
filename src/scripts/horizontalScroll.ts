export interface HorizontalTrackOptions {
  trackSelector?: string;
}

export function initHorizontalTrack(options: HorizontalTrackOptions = {}): void {
  const track = document.querySelector<HTMLElement>(
    options.trackSelector ?? '[data-horizontal-track]'
  );
  if (!track) return;

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

  // Mobile card pager step buttons (`01 / 06 →`, `←`, `→`)
  const stepButtons = track.querySelectorAll<HTMLButtonElement>('[data-track-step]');
  if (stepButtons.length > 0) {
    const cards = Array.from(track.querySelectorAll<HTMLElement>('article'));
    stepButtons.forEach((btn) => {
      btn.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const currentIndex = Number(btn.dataset.cardIndex ?? '0');
        const step = Number(btn.dataset.trackStep ?? '0');
        const targetIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + step));
        const target = cards[targetIndex];
        if (!target) return;

        const trackRect = track.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const targetCenterInTrack =
          targetRect.left - trackRect.left + track.scrollLeft + targetRect.width / 2;
        const left = Math.max(0, targetCenterInTrack - track.clientWidth / 2);
        track.scrollTo({ left, behavior: 'smooth' });
      });
    });
  }
}
