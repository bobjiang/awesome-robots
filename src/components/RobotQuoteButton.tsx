'use client';

import { useState } from 'react';
import QuoteForm from '@/components/QuoteForm';
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

  const handleQuoteRequest = () => {
    trackRobotQuote(robotId, robotName, robotBrand);
    setShowQuoteForm(true);
  };

  return (
    <>
      <button
        onClick={handleQuoteRequest}
        className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
      >
        Request Quote
      </button>

      {showQuoteForm && (
        <QuoteForm
          robotName={robotName}
          robotBrand={robotBrand}
          onClose={() => setShowQuoteForm(false)}
        />
      )}
    </>
  );
}
