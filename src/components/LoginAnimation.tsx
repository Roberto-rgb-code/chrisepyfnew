'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LOGIN_LOTTIE_URL =
  'https://lottie.host/7f409a80-1dc2-4ddb-9211-e3d606f32b77/RPqJFJgwk0.lottie';

export default function LoginAnimation() {
  return (
    <div className="relative w-full max-w-[min(200px,60vw)] sm:max-w-[180px] mx-auto aspect-square flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-red-200/40 via-red-100/30 to-white/40 rounded-full blur-2xl scale-110" />
      <DotLottieReact
        src={LOGIN_LOTTIE_URL}
        loop
        autoplay
        className="relative z-10 w-full h-full"
      />
    </div>
  );
}
