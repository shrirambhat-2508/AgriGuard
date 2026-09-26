import React, { useRef, useEffect, useState, useCallback, useId } from 'react';
import './GooeyNav.css';

export interface GooeyNavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: (number | string)[];
  initialActiveIndex?: number;
  activeIndex?: number;
  onChange?: (index: number, item: GooeyNavItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 500,
  particleCount = 16,
  particleDistances = [36, 6],
  particleR = 60,
  timeVariance = 200,
  colors = [1, 2, 3, 4, 1, 2, 3, 4],
  initialActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onChange,
  className = '',
  style
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLUListElement | null>(null);
  const filterRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(initialActiveIndex);

  const rawId = useId();
  const filterId = 'gooey-filter-' + rawId.replace(/[:]/g, '');

  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(4), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', bubbleTime + 'ms');

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', p.start[0] + 'px');
        particle.style.setProperty('--start-y', p.start[1] + 'px');
        particle.style.setProperty('--end-x', p.end[0] + 'px');
        particle.style.setProperty('--end-y', p.end[1] + 'px');
        particle.style.setProperty('--time', p.time + 'ms');
        particle.style.setProperty('--scale', String(p.scale));

        const colorVal =
          typeof p.color === 'string'
            ? p.color
            : 'var(--color-' + p.color + ', #2C5F2E)';
        particle.style.setProperty('--color', colorVal);
        particle.style.setProperty('--rotate', p.rotate + 'deg');

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // cleanup
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = useCallback((element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: (pos.x - containerRect.x) + 'px',
      top: (pos.y - containerRect.y) + 'px',
      width: pos.width + 'px',
      height: pos.height + 'px'
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLElement> | { currentTarget: HTMLElement; preventDefault?: () => void },
    index: number
  ) => {
    e.preventDefault?.();
    const target = e.currentTarget;
    const liEl = (target.tagName === 'LI' ? target : target.closest('li') || target) as HTMLElement;

    if (activeIndex === index) return;

    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onChange?.(index, items[index]);
    items[index]?.onClick?.();

    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current?.removeChild(p));
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = (e.currentTarget.parentElement || e.currentTarget) as HTMLElement;
      if (liEl) {
        handleClick({ currentTarget: liEl, preventDefault: () => {} }, index);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex, updateEffectPosition]);

  return (
    <div className={'gooey-nav-container ' + className.trim()} ref={containerRef} style={style}>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none',
          opacity: 0,
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={index} className={activeIndex === index ? 'active' : ''}>
              <a
                href={item.href || '#'}
                onClick={e => handleClick(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span
        className="effect filter"
        ref={filterRef}
        style={{ filter: 'url(#' + filterId + ')' }}
      />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
