'use client';

interface CheckoutStepsProps {
  current: 1 | 2 | 3;
}

const steps = [
  { num: 1, label: 'Personalizar', short: 'Diseño' },
  { num: 2, label: 'Carrito', short: 'Carrito' },
  { num: 3, label: 'Pago', short: 'Pago' },
];

export default function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-4 mb-6 sm:mb-8 px-2">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center gap-1 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${
                current >= step.num
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.num}
            </div>
            <span
              className={`text-[10px] sm:text-sm font-medium text-center max-w-[52px] sm:max-w-none leading-tight ${
                current >= step.num ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <span className="sm:hidden">{step.short}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-4 sm:w-12 h-0.5 mx-0.5 sm:mx-0 ${
                current > step.num ? 'bg-brand-red-light0' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
