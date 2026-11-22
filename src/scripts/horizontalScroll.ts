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

  // Prevent native browser drag-and-drop on links/images inside the track
  track.addEventListener('dragstart', (e: DragEvent) => {
    e.preventDefault();
  });

  // Gentle click-vs-drag support for desktop mouse users
  let isPointerDown = false;
  let hasDragged = false;
  let activePointerId: number | null = null;
  let resetDragTimer: number | undefined;
  let startX = 0;
  let startScrollLeft = 0;

  const endDrag = () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (activePointerId !== null) {
      try {
        if (track.hasPointerCapture(activePointerId)) {
          track.releasePointerCapture(activePointerId);
        }
      } catch {
        // Ignore if pointer capture was already released
      }
      activePointerId = null;
    }
    delete track.dataset.dragging;
    track.classList.remove('cursor-grabbing', 'select-none');
    if (hasDragged) {
      resetDragTimer = window.setTimeout(() => {
        hasDragged = false;
        resetDragTimer = undefined;
      }, 50);
    }
  };

  track.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target instanceof Element && e.target.closest('[data-no-drag]')) return;
    if (resetDragTimer !== undefined) {
      window.clearTimeout(resetDragTimer);
      resetDragTimer = undefined;
    }
    isPointerDown = true;
    hasDragged = false;
    activePointerId = e.pointerId;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
  });

  window.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isPointerDown) return;
    if ((e.buttons & 1) === 0) {
      endDrag();
      return;
    }
    const dx = e.clientX - startX;
    if (!hasDragged && Math.abs(dx) > 6) {
      hasDragged = true;
      track.dataset.dragging = 'true';
      track.classList.add('cursor-grabbing', 'select-none');
      window.getSelection()?.removeAllRanges();
      if (activePointerId !== null) {
        try {
          track.setPointerCapture(activePointerId);
        } catch {
          // Ignore if element cannot capture this pointer
        }
      }
    }
    if (hasDragged) {
      track.scrollLeft = startScrollLeft - dx;
    }
  });

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', endDrag);
  track.addEventListener('lostpointercapture', endDrag);

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
