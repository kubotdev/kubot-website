import React, { useEffect, useRef } from 'react';

/**
 * The kubot mark, composed from the real icon parts and brought to life:
 * - eyes track the cursor
 * - the helm steers every few seconds, hands glued to the rim
 *
 * All coordinates are in the 1024px icon space the parts were measured in.
 */
const HEAD = { x: 76, y: 244, w: 536, h: 536 };
const EYE_L = { x: 288, y: 416, w: 72, h: 166 };
const EYE_R = { x: 424, y: 416, w: 72, h: 166 };
const HELM = { x: 356, y: 192, w: 657, h: 642 };
// hub within the helm sprite; the steering origin
const HUB = { x: 324, y: 320 };
// grip positions, local to the helm box so they orbit with the wheel
const HAND1 = { x: 388, y: 88, w: 108, h: 124 };
const HAND2 = { x: 120, y: 424, w: 108, h: 124 };

export const SailingKubot: React.FC<{ size?: number }> = ({ size = 150 }) => {
  const stage = useRef<HTMLDivElement>(null);
  const eyeL = useRef<HTMLImageElement>(null);
  const eyeR = useRef<HTMLImageElement>(null);
  const scale = size / 1024;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const maxDisplay = Math.max(6, size * 0.07);
    const onMove = (e: MouseEvent) => {
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      let ox = dx * 26;
      let oy = dy * 26;
      const len = Math.hypot(ox, oy);
      if (len > maxDisplay) {
        ox = (ox / len) * maxDisplay;
        oy = (oy / len) * maxDisplay;
      }
      // eyes live inside the scaled-down icon space: compensate so the
      // offset lands in screen pixels, not shrunken icon pixels
      const t = `translate(${(ox / scale).toFixed(1)}px, ${(oy / scale).toFixed(1)}px)`;
      if (eyeL.current) eyeL.current.style.transform = t;
      if (eyeR.current) eyeR.current.style.transform = t;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [size]);

  return (
    <div
      ref={stage}
      className="sailing"
      role="img"
      aria-label="kubot sailing the cluster helm"
      style={{ width: size, height: size }}
    >
      <div className="sailing-inner" style={{ transform: `scale(${scale})`, width: 1024, height: 1024 }}>
        <img src="./parts-t/head.png" alt="" style={{ left: HEAD.x, top: HEAD.y, width: HEAD.w, height: HEAD.h }} />
        <img ref={eyeL} className="sailing-eye" src="./parts-t/left-eye.png" alt="" style={{ left: EYE_L.x, top: EYE_L.y, width: EYE_L.w, height: EYE_L.h }} />
        <img ref={eyeR} className="sailing-eye" src="./parts-t/right-eye.png" alt="" style={{ left: EYE_R.x, top: EYE_R.y, width: EYE_R.w, height: EYE_R.h }} />
        <div
          className="sailing-helm"
          style={{
            left: HELM.x,
            top: HELM.y,
            width: HELM.w,
            height: HELM.h,
            transformOrigin: `${(HUB.x / HELM.w) * 100}% ${(HUB.y / HELM.h) * 100}%`,
          }}
        >
          <img src="./parts-t/helm.png" alt="" style={{ left: 0, top: 0, width: HELM.w, height: HELM.h }} />
          <img src="./parts-t/hand1.png" alt="" style={{ left: HAND1.x, top: HAND1.y, width: HAND1.w, height: HAND1.h }} />
          <img src="./parts-t/hand2.png" alt="" style={{ left: HAND2.x, top: HAND2.y, width: HAND2.w, height: HAND2.h }} />
        </div>
      </div>
    </div>
  );
};
