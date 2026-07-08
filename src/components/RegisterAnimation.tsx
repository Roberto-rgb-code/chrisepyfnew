'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const REGISTER_LOTTIE_URL =
  'https://lottie.host/39419cd3-fd06-44b1-8311-669274be309e/ksVNkfkHKf.lottie';

export default function RegisterAnimation() {
  return (
    <div className="relative w-full max-w-[min(200px,60vw)] sm:max-w-[180px] mx-auto aspect-square flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-red-200/40 via-red-100/30 to-white/40 rounded-full blur-2xl scale-110" />
      <DotLottieReact
        src={REGISTER_LOTTIE_URL}
        loop
        autoplay
        className="relative z-10 w-full h-full"
      />
    </div>
  );
}
