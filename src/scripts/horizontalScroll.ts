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

  // Keyboard arrow navigation (yield when a lightbox is open)
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (document.body.dataset.lightboxOpen === 'true') return;
    if (
      document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA'
    ) {
      return;
    }
    if (track.scrollWidth <= track.clientWidth) return;
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

  // Sync optional mobile/shelf slide counter (e.g. "01 / 06")
  const counterEl = document.querySelector<HTMLElement>('[data-carousel-counter]');
  const items = Array.from(track.querySelectorAll<HTMLElement>('[data-carousel-item]'));

  if (counterEl && items.length > 0) {
    let rafPending = false;

    const updateCounter = () => {
      rafPending = false;
      const total = items.length;
      const trackRect = track.getBoundingClientRect();
      const firstRect = items[0].getBoundingClientRect();
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;

      let activeIndex = 0;
      if (atEnd) {
        activeIndex = total - 1;
      } else {
        const anchorLeft = trackRect.left + Math.max(16, firstRect.left - trackRect.left);
        let bestDist = Infinity;
        for (let i = 0; i < total; i++) {
          const dist = Math.abs(items[i].getBoundingClientRect().left - anchorLeft);
          if (dist < bestDist) {
            bestDist = dist;
            activeIndex = i;
          }
        }
      }

      counterEl.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    };

    track.addEventListener(
      'scroll',
      () => {
        if (!rafPending) {
          rafPending = true;
          window.requestAnimationFrame(updateCounter);
        }
      },
      { passive: true }
    );
  }
}
