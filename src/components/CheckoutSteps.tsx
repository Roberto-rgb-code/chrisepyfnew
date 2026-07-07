'use client';

interface CheckoutStepsProps {
  current: 1 | 2 | 3;
}

const steps = [
  { num: 1, label: 'Personalizar' },
  { num: 2, label: 'Carrito' },
  { num: 3, label: 'Pago' },
];

export default function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                current >= step.num
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.num}
            </div>
            <span
              className={`text-sm font-medium hidden sm:inline ${
                current >= step.num ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-0.5 ${
                current > step.num ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
