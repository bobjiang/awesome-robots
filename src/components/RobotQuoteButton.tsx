'use client';

import { useState, useEffect } from 'react';
import { trackRobotQuote } from '@/lib/gtag';

interface RobotQuoteButtonProps {
  robotId: string;
  robotName: string;
  robotBrand: string;
}

export default function RobotQuoteButton({
  robotId,
  robotName,
  robotBrand
}: RobotQuoteButtonProps) {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [QuoteFormComponent, setQuoteFormComponent] = useState<React.ComponentType<{ robotName: string; robotBrand: string; onClose: () => void }> | null>(null);

  // Only load after client-side hydration to avoid SSR/build issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load QuoteForm component lazily when user clicks button
  const handleQuoteRequest = async () => {
    trackRobotQuote(robotId, robotName, robotBrand);

    if (!QuoteFormComponent) {
      // Dynamically import only when needed
      const formModule = await import('@/components/QuoteForm');
      setQuoteFormComponent(() => formModule.default);
    }

    setShowQuoteForm(true);
  };

  // Don't render anything during SSR
  if (!isMounted) {
    return (
      <button
        className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
        disabled
      >
        Request Quote
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleQuoteRequest}
        className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
      >
        Request Quote
      </button>

      {showQuoteForm && QuoteFormComponent && (
        <QuoteFormComponent
          robotName={robotName}
          robotBrand={robotBrand}
          onClose={() => setShowQuoteForm(false)}
        />
      )}
    </>
  );
}
