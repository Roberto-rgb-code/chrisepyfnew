'use client';

import PhoneLoader from './PhoneLoader';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingScreen({
  message = 'Cargando...',
  submessage,
  fullScreen = true,
  size = 'md',
  className = '',
}: LoadingScreenProps) {
  const wrapper = fullScreen
    ? 'min-h-[50vh] sm:min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'
    : 'flex flex-col items-center justify-center py-12 px-4';

  return (
    <div className={`${wrapper} ${className}`.trim()}>
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100/80 px-6 py-8 sm:px-10 sm:py-12 flex flex-col items-center max-w-[min(100%,20rem)] w-full mx-auto">
        <PhoneLoader size={size} />
        <p className="mt-6 sm:mt-8 text-base sm:text-lg font-semibold text-gray-800 text-center leading-snug">
          {message}
        </p>
        {submessage && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center max-w-[240px]">{submessage}</p>
        )}
      </div>
    </div>
  );
}
