'use client';

interface CheckoutStepsProps {
  current: 1 | 2 | 3 | 4;
}

const steps = [
  { num: 1, label: 'Personalizar', short: 'Diseño' },
  { num: 2, label: 'Carrito', short: 'Carrito' },
  { num: 3, label: 'Datos de entrega', short: 'Entrega' },
  { num: 4, label: 'Pago', short: 'Pago' },
];

export default function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-3 mb-6 sm:mb-8 px-1 overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center gap-1 sm:gap-3 shrink-0">
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
              className={`text-[10px] sm:text-sm font-medium text-center max-w-[56px] sm:max-w-none leading-tight ${
                current >= step.num ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <span className="sm:hidden">{step.short}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-3 sm:w-8 h-0.5 ${
                current > step.num ? 'bg-brand-red' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
