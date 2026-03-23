import React, { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './CTAButton.css';

const CTAButton = ({
  children,
  variant = 'primary',
  size = 'lg',
  loading = false,
  loadingText = 'Loading...',
  icon = 'arrow',
  showIcon = true,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const Icon = useMemo(() => {
    if (icon === 'sparkles') return Sparkles;
    return ArrowRight;
  }, [icon]);

  const handleClick = (event) => {
    if (disabled || loading) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const sizePx = Math.max(rect.width, rect.height) * 2;
    const ripple = {
      id: Date.now() + Math.random(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      size: sizePx
    };

    setRipples((prev) => [...prev, ripple]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 580);

    if (onClick) onClick(event);
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`cta-btn cta-btn--${variant} cta-btn--${size} ${className}`.trim()}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="cta-btn__ripple"
          style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
        />
      ))}

      <span className="cta-btn__content inline-flex items-center gap-2">
        {loading ? (
          <>
            <span className="cta-btn__spinner" aria-hidden="true" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            {showIcon && <Icon className="cta-btn__icon h-4 w-4" aria-hidden="true" />}
          </>
        )}
      </span>
    </button>
  );
};

export default CTAButton;
