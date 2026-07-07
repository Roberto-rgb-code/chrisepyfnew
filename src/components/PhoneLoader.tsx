'use client';

type PhoneLoaderSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<PhoneLoaderSize, string> = {
  sm: 'phone-loader-wrap--sm',
  md: 'phone-loader-wrap--md',
  lg: 'phone-loader-wrap--lg',
};

interface PhoneLoaderProps {
  size?: PhoneLoaderSize;
  className?: string;
}

export default function PhoneLoader({ size = 'md', className = '' }: PhoneLoaderProps) {
  return (
    <div
      className={`phone-loader-wrap ${sizeClass[size]} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="phone-loader-container">
        <div className="phone-loader-bar phone-loader-bar--1" />
        <div className="phone-loader-bar phone-loader-bar--2" />
        <div className="phone-loader-bar phone-loader-bar--3" />
      </div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
