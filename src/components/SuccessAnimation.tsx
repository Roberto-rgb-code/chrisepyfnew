'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SUCCESS_LOTTIE_URL =
  'https://lottie.host/4a626cf5-8a06-4dd1-807a-c61646d9d9e0/7mRRtbVOin.lottie';

export default function SuccessAnimation() {
  return (
    <div className="relative w-full max-w-[min(220px,70vw)] sm:max-w-[220px] mx-auto aspect-square flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 via-blue-200/30 to-purple-200/40 rounded-full blur-2xl scale-110" />
      <DotLottieReact
        src={SUCCESS_LOTTIE_URL}
        loop
        autoplay
        className="relative z-10 w-full h-full"
      />
    </div>
  );
}
