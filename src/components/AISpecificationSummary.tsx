import { Robot } from '@/types/robot';

interface AISpecificationSummaryProps {
  robot: Robot;
}

export default function AISpecificationSummary({ robot }: AISpecificationSummaryProps) {
  // Generate AI-friendly summary based on robot data
  const generateAISummary = (robot: Robot): string => {
    const parts = [];
    
    // Basic info
    parts.push(`The ${robot.brand} ${robot.name} is a ${robot.category} robot.`);
    
    // Key capabilities
    if (robot.specifications) {
      const specs = robot.specifications;
      
      if (specs.weight) {
        parts.push(`It weighs ${specs.weight}.`);
      }
      
      if (specs.maxSpeed) {
        parts.push(`Maximum speed is ${specs.maxSpeed}.`);
      }
      
      if (specs.batteryLife) {
        parts.push(`Battery life ranges ${specs.batteryLife}.`);
      }
      
      if (specs.payload) {
        parts.push(`Can carry payloads up to ${specs.payload}.`);
      }
    }
    
    // Use cases from features if available
    const features = robot.features || robot.keyFeatures || [];
    if (features.length > 0) {
      parts.push(`Key features: ${features.slice(0, 3).join(', ')}.`);
    }
    
    // Price information
    if (robot.price) {
      if (typeof robot.price.starting === 'string') {
        parts.push('Pricing available upon request.');
      } else {
        parts.push(`Starting price: $${robot.price.starting?.toLocaleString()}.`);
      }
    }
    
    return parts.join(' ');
  };

  const generateKeySpecs = (robot: Robot) => {
    const keySpecs: Array<{label: string, value: string}> = [];
    
    if (robot.specifications) {
      const specs = robot.specifications;
      
      // Most important specs for AI understanding
      const specMappings = [
        { key: 'weight', label: 'Weight' },
        { key: 'maxSpeed', label: 'Max Speed' },
        { key: 'batteryLife', label: 'Battery Life' },
        { key: 'payload', label: 'Max Payload' },
        { key: 'operatingTemp', label: 'Operating Temperature' },
        { key: 'connectivity', label: 'Connectivity' },
        { key: 'sensors', label: 'Sensors' },
        { key: 'controlMethods', label: 'Control Methods' }
      ];
      
      specMappings.forEach(mapping => {
        const value = specs[mapping.key as keyof typeof specs];
        if (value) {
          keySpecs.push({
            label: mapping.label,
            value: Array.isArray(value) ? value.join(', ') : value.toString()
          });
        }
      });
    }
    
    return keySpecs;
  };

  const aiSummary = generateAISummary(robot);
  const keySpecs = generateKeySpecs(robot);
  const features = robot.features || robot.keyFeatures || [];
  const useCase = features[0] || robot.category;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-blue-600 text-white rounded-full p-2 mt-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {aiSummary}
          </p>
        </div>
      </div>
      
      {keySpecs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-200">
          {keySpecs.slice(0, 6).map((spec, index) => (
            <div key={index} className="bg-white rounded-lg p-3">
              <div className="text-sm font-medium text-gray-600">{spec.label}</div>
              <div className="text-sm text-gray-900 mt-1">{spec.value}</div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {robot.category}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {useCase}
          </span>
          {robot.specifications?.sensors && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Advanced Sensors
            </span>
          )}
        </div>
      </div>
    </div>
  );
}