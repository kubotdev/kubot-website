import React, { useEffect, useRef } from 'react';

/**
 * The kubot mark, composed from the real icon parts and brought to life:
 * - eyes track the cursor
 * - the helm steers every few seconds, hands glued to the rim
 *
 * All artwork coordinates are in the 1024px icon space the parts were
 * measured in. They are converted to display pixels up front (k = size/1024)
 * so the browser rasterizes the vector helm at EXACTLY the shown size —
 * no wrapping scale() transform that would bitmap-shrink it.
 */
const HEAD = { x: 74, y: 250, w: 536, h: 536 };
const EYE_L = { x: 289, y: 419, w: 72, h: 166 };
const EYE_R = { x: 425, y: 419, w: 72, h: 166 };
const HELM = { x: 352, y: 192, w: 657, h: 642 };
// hub fractions within the helm box, from the vector bbox center
const HUB_FX = 82.08 / 165;
const HUB_FY = 80.18 / 161;
// grip positions, local to the helm box so they orbit with the wheel
const HAND1 = { x: 393, y: 95, w: 108, h: 124 };
const HAND2 = { x: 125, y: 431, w: 108, h: 124 };

export const SailingKubot: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const stage = useRef<HTMLDivElement>(null);
  const eyeL = useRef<HTMLImageElement>(null);
  const eyeR = useRef<HTMLImageElement>(null);
  const k = size / 1024;
  const px = (v: number) => v * k;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const max = Math.max(6, size * 0.07);
    const onMove = (e: MouseEvent) => {
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      let ox = dx * 26;
      let oy = dy * 26;
      const len = Math.hypot(ox, oy);
      if (len > max) {
        ox = (ox / len) * max;
        oy = (oy / len) * max;
      }
      const t = `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px)`;
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
      <div className="sailing-inner" style={{ width: size, height: size }}>
        <img src="./parts/head.png" alt="" style={{ left: px(HEAD.x), top: px(HEAD.y), width: px(HEAD.w), height: px(HEAD.h) }} />
        <img ref={eyeL} className="sailing-eye" src="./parts/left-eye.png" alt="" style={{ left: px(EYE_L.x), top: px(EYE_L.y), width: px(EYE_L.w), height: px(EYE_L.h) }} />
        <img ref={eyeR} className="sailing-eye" src="./parts/right-eye.png" alt="" style={{ left: px(EYE_R.x), top: px(EYE_R.y), width: px(EYE_R.w), height: px(EYE_R.h) }} />
        <div
          className="sailing-helm"
          style={{
            left: px(HELM.x),
            top: px(HELM.y),
            width: px(HELM.w),
            height: px(HELM.h),
            transformOrigin: `${HUB_FX * 100}% ${HUB_FY * 100}%`,
          }}
        >
          <img
            src="./parts/helm.svg"
            alt=""
            style={{ left: 0, top: 0, width: '100%', height: '100%' }}
            onError={(e) => {
              const el = e.currentTarget;
              if (!el.dataset.fbk) {
                el.dataset.fbk = '1';
                el.src = './parts/helm.png';
              }
            }}
          />
          <img src="./parts/hand1.png" alt="" style={{ left: px(HAND1.x), top: px(HAND1.y), width: px(HAND1.w), height: px(HAND1.h) }} />
          <img src="./parts/hand2.png" alt="" style={{ left: px(HAND2.x), top: px(HAND2.y), width: px(HAND2.w), height: px(HAND2.h) }} />
        </div>
      </div>
    </div>
  );
};
