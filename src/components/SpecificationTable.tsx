'use client';

import { Robot } from '@/types/robot';

interface SpecificationTableProps {
  robot: Robot;
}

export default function SpecificationTable({ robot }: SpecificationTableProps) {
  const specs = robot.specifications;

  // For Go2 robot with detailed variant specs
  if (robot.id === 'unitree-go2' && specs.payload && typeof specs.payload === 'object') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-4 bg-blue-600 text-white">
          <div className="p-4 font-semibold border-r border-blue-500">Model</div>
          <div className="p-4 font-semibold text-center border-r border-blue-500">Go2 AIR</div>
          <div className="p-4 font-semibold text-center border-r border-blue-500">Go2 PRO</div>
          <div className="p-4 font-semibold text-center">Go2 EDU</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Dimensions (Standing)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700 col-span-3">{specs.dimensions?.split(', ')[0]}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Dimensions (Crouching)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700 col-span-3">{specs.dimensions?.split(', ')[1]}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Weight (with Battery)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700 col-span-3">{specs.weight}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Material</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700 col-span-3">{specs.material}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Voltage</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700 col-span-3">{specs.voltage}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Working Maximum Power</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700 col-span-3">{specs.workingMaxPower}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Payload</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.payload === 'object' ? specs.payload.AIR : ''}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.payload === 'object' ? specs.payload.PRO : ''}</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.payload === 'object' ? specs.payload.EDU : ''}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Maximum Speed</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxSpeed === 'object' ? specs.maxSpeed.AIR : ''}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxSpeed === 'object' ? specs.maxSpeed.PRO : ''}</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.maxSpeed === 'object' ? specs.maxSpeed.EDU : ''}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Climb Height</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbHeight === 'object' ? specs.maxClimbHeight?.AIR : ''}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbHeight === 'object' ? specs.maxClimbHeight?.PRO : ''}</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.maxClimbHeight === 'object' ? specs.maxClimbHeight?.EDU : ''}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Climb Angle</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbAngle === 'object' ? specs.maxClimbAngle?.AIR : ''}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbAngle === 'object' ? specs.maxClimbAngle?.PRO : ''}</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.maxClimbAngle === 'object' ? specs.maxClimbAngle?.EDU : ''}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Computing Power</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.computingPower === 'object' ? specs.computingPower.AIR : ''}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.computingPower === 'object' ? specs.computingPower.PRO : ''}</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.computingPower === 'object' ? specs.computingPower.EDU : ''}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Wireless Vector Positioning</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.wirelessVectorPositioning?.AIR}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.wirelessVectorPositioning?.PRO}</div>
            <div className="p-4 text-sm text-gray-700">{specs.wirelessVectorPositioning?.EDU}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Foot-end Force Sensor</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.footEndForceSensor?.AIR}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.footEndForceSensor?.PRO}</div>
            <div className="p-4 text-sm text-gray-700">{specs.footEndForceSensor?.EDU}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.battery === 'object' ? specs.battery.AIR : ''}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.battery === 'object' ? specs.battery.PRO : ''}</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.battery === 'object' ? specs.battery.EDU : ''}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Sensors</div>
            <div className="p-4 text-sm text-gray-700 col-span-3">
              {Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For Go2-W robot with detailed specs
  if (robot.id === 'unitree-go2-w' && specs.jointMotors) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-2 bg-blue-600 text-white">
          <div className="p-4 font-semibold border-r border-blue-500">Specification</div>
          <div className="p-4 font-semibold text-center">Go2-W</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Dimensions</div>
            <div className="p-4 text-sm text-gray-700">{specs.dimensions}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Weight (with Battery)</div>
            <div className="p-4 text-sm text-gray-700">{specs.weight}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Voltage</div>
            <div className="p-4 text-sm text-gray-700">{specs.voltage}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Payload</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.payload === 'string' ? specs.payload : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Maximum Speed</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.maxSpeed === 'string' ? specs.maxSpeed : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Climb Height</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.maxClimbHeight === 'string' ? specs.maxClimbHeight : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Climb Angle</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.maxClimbAngle === 'string' ? specs.maxClimbAngle : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Computing Power</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.computingPower === 'string' ? specs.computingPower : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Joint Motors</div>
            <div className="p-4 text-sm text-gray-700">{specs.jointMotors}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Joint Torque</div>
            <div className="p-4 text-sm text-gray-700">{specs.maxJointTorque}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Tires</div>
            <div className="p-4 text-sm text-gray-700">{specs.tires}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.battery === 'string' ? specs.battery : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Charger</div>
            <div className="p-4 text-sm text-gray-700">{specs.charger}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Warranty</div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.warranty === 'string' ? specs.warranty : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Sensors</div>
            <div className="p-4 text-sm text-gray-700">{Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Additional Features</div>
            <div className="p-4 text-sm text-gray-700">
              <ul className="list-disc list-inside space-y-1">
                {specs.additionalFeatures?.map((feature, index) => (
                  <li key={index} className="text-sm">{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For A2 robot with detailed specs
  if (robot.id === 'unitree-a2' && specs.dimensionsStanding) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-3 bg-blue-600 text-white">
          <div className="p-4 font-semibold border-r border-blue-500">Specification</div>
          <div className="p-4 font-semibold text-center border-r border-blue-500">A2</div>
          <div className="p-4 font-semibold text-center">A2-PRO</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Size (Standing)</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.dimensionsStanding}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Size (Lying Prone)</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.dimensionsLying}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Material</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.material}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Weight (with battery)</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.weight}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Weight (without battery)</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.weightWithoutBattery}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Supply Voltage</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.supplyVoltage}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Degrees of Freedom</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.degreesOfFreedom}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Joint Bearings</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.jointBearings}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Joint Torque</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.maxJointTorque}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery Capacity</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">
              {typeof specs.batteryCapacity === 'object' ? 
                `Single: ${specs.batteryCapacity.single}, Dual: ${specs.batteryCapacity.dual}` : 
                specs.batteryCapacity || 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery Life</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">
              {typeof specs.batteryLife === 'object' ? 
                `No Load: ${specs.batteryLife.noLoad}, With Load: ${specs.batteryLife.withLoad}` : 
                specs.batteryLife || 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Standing Load</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.maxStandingLoad}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Continuous Walking Load</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.continuousWalkingLoad}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Slope Walking</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.slopeWalking}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Speed</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{typeof specs.maxSpeed === 'string' ? specs.maxSpeed : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Stair Climbing</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.stairClimbing}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Operating Temperature</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.operatingTemperature}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Ingress Protection</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.ingressProtection === 'object' ? specs.ingressProtection.A2 : specs.ingressProtection}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.ingressProtection === 'object' ? specs.ingressProtection.A2_PRO : specs.ingressProtection}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Computing</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{typeof specs.computingPower === 'string' ? specs.computingPower : specs.computing}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Connectivity</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.connectivity?.join(', ')}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Sensors</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.sensors === 'object' && !Array.isArray(specs.sensors) && 'A2' in specs.sensors && specs.sensors.A2 ? 
                specs.sensors.A2.join(', ') : 
                (Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A')}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.sensors === 'object' && !Array.isArray(specs.sensors) && 'A2_PRO' in specs.sensors && specs.sensors.A2_PRO ? 
                specs.sensors.A2_PRO.join(', ') : 
                (Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For B2 robot with detailed specs
  if (robot.id === 'unitree-b2' && specs.dimensionsStanding) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-2 bg-blue-600 text-white">
          <div className="p-4 font-semibold border-r border-blue-500">Specification</div>
          <div className="p-4 font-semibold text-center">B2</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Size (Standing)</div>
            <div className="p-4 text-sm text-gray-700">{specs.dimensionsStanding}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Size (Lying Prone)</div>
            <div className="p-4 text-sm text-gray-700">{specs.dimensionsLying}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Weight (including battery)</div>
            <div className="p-4 text-sm text-gray-700">{specs.weight}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Running Speed</div>
            <div className="p-4 text-sm text-gray-700">{specs.maxRunningSpeed}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Joint Torque</div>
            <div className="p-4 text-sm text-gray-700">{specs.maxJointTorque}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Longest Jump Distance</div>
            <div className="p-4 text-sm text-gray-700">{specs.longestJumpDistance}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Standing Load</div>
            <div className="p-4 text-sm text-gray-700">{specs.standingLoad}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Continuous Walking Load</div>
            <div className="p-4 text-sm text-gray-700">{specs.continuousWalkingLoad}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Obstacle Crossing</div>
            <div className="p-4 text-sm text-gray-700">{specs.obstacleCrossing}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Slope Angle</div>
            <div className="p-4 text-sm text-gray-700">{specs.slopeAngle}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery</div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.batteryCapacity === 'string' ? specs.batteryCapacity : 'N/A'} @ {specs.batteryVoltage}
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery Life</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.batteryLife === 'string' ? specs.batteryLife : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Endurance</div>
            <div className="p-4 text-sm text-gray-700">
              Unloaded: {specs.endurance?.unloaded}<br/>
              Loaded: {specs.endurance?.loaded}
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Operating Temperature</div>
            <div className="p-4 text-sm text-gray-700">{specs.operatingTemperature}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Ingress Protection</div>
            <div className="p-4 text-sm text-gray-700">{typeof specs.ingressProtection === 'string' ? specs.ingressProtection : 'N/A'}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Ditch Jumping</div>
            <div className="p-4 text-sm text-gray-700">{specs.ditchJumping}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Control Platform</div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.controlPlatform === 'object' ? 
                `Standard: ${specs.controlPlatform.standard}, User Dev: ${specs.controlPlatform.userDevelopment}, Optional: ${specs.controlPlatform.optional}` : 
                specs.controlPlatform || 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Connectivity</div>
            <div className="p-4 text-sm text-gray-700">{specs.connectivity?.join(', ')}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Power Outputs</div>
            <div className="p-4 text-sm text-gray-700">{specs.powerOutputs?.join(', ')}</div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Sensors</div>
            <div className="p-4 text-sm text-gray-700">{Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}</div>
          </div>
        </div>
      </div>
    );
  }

  // For H1/H1-2 robots with detailed comparative specs
  if (robot.id === 'unitree-h1' && specs.keyDimensions) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-3 bg-blue-600 text-white">
          <div className="p-4 font-semibold border-r border-blue-500"></div>
          <div className="p-4 font-semibold text-center border-r border-blue-500">H1</div>
          <div className="p-4 font-semibold text-center">H1-2</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Key Dimensions</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.keyDimensions.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.keyDimensions.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Thigh and Calf Length</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.thighCalfLength?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.thighCalfLength?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Total Arm Length</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.totalArmLength?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.totalArmLength?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">DOF of Each Leg</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.dofEachLeg?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.dofEachLeg?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">DOF of Each Arm</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.dofEachArm?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.dofEachArm?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Total Weight</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.totalWeight?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.totalWeight?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Joint output bearing</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.jointOutputBearing}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Core Joint motor</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.coreJointMotor}</div>
          </div>
          
          {specs.ultimateTorqueJointUnit && (
            <>
              <div className="grid grid-cols-3">
                <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Ultimate Torque of Joint Unit</div>
                <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
                  Knee Torque {specs.ultimateTorqueJointUnit.kneeTorque}, Hip Joint Torque {specs.ultimateTorqueJointUnit.hipJointTorque}<br/>
                  Ankle Torque {specs.ultimateTorqueJointUnit.ankleTorque?.H1}, Arm Joint Torque {specs.ultimateTorqueJointUnit.armJointTorque?.H1}
                </div>
                <div className="p-4 text-sm text-gray-700">
                  Knee Torque {specs.ultimateTorqueJointUnit.kneeTorque}, Hip Joint Torque {specs.ultimateTorqueJointUnit.hipJointTorque}<br/>
                  {specs.ultimateTorqueJointUnit.armJointTorque?.H1_2}
                </div>
              </div>
            </>
          )}
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Mobility</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.mobility?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.mobility?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">
              {typeof specs.battery === 'string' ? specs.battery : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Control and Perception Computing Power</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.controlPerceptionComputingPower}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Sensor Configuration</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.sensorConfiguration}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Dexterous Hand</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.dexterousHand?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.dexterousHand?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Arm joint performance (peak torque)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.armJointPerformance?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.armJointPerformance?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Arm normal load</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.armNormalLoad?.H1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.armNormalLoad?.H1_2}</div>
          </div>
        </div>
      </div>
    );
  }

  // For Deep Robotics X30 robot with variant specs
  if (robot.id === 'deep-robotics-x30' && typeof specs.dimensions === 'object') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-3 bg-blue-600 text-white">
          <div className="p-4 font-semibold border-r border-blue-500">Specification</div>
          <div className="p-4 font-semibold text-center border-r border-blue-500">X30</div>
          <div className="p-4 font-semibold text-center">X30 Pro</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Dimensions</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.dimensions === 'object' && specs.dimensions && 'X30' in specs.dimensions ? specs.dimensions.X30 : 'N/A'}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.dimensions === 'object' && specs.dimensions && 'X30_Pro' in specs.dimensions ? specs.dimensions.X30_Pro : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Weight</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.weight === 'object' && specs.weight && 'X30' in specs.weight ? specs.weight.X30 : 'N/A'}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.weight === 'object' && specs.weight && 'X30_Pro' in specs.weight ? specs.weight.X30_Pro : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Speed</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.maxSpeed}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Slope</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.maxSlope}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Step Height</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.stepHeight}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Ingress Protection</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.ingressProtection}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Operating Temperature</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.operatingTemperature}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery Life</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.batteryLife}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Mileage</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.maxMileage}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Connectivity</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.connectivity === 'object' && specs.connectivity && 'X30' in specs.connectivity ? 
                (Array.isArray(specs.connectivity.X30) ? specs.connectivity.X30.join(', ') : specs.connectivity.X30) : 'N/A'}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.connectivity === 'object' && specs.connectivity && 'X30_Pro' in specs.connectivity ? 
                (Array.isArray(specs.connectivity.X30_Pro) ? specs.connectivity.X30_Pro.join(', ') : specs.connectivity.X30_Pro) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For G1 robot with detailed specs
  if (robot.id === 'unitree-g1' && specs.totalDegreesOfFreedom) {
    const standDimensions = specs.dimensions?.includes('standing') ? 
      specs.dimensions.match(/([\d,]+x[\d,]+x[\d,]+mm)\s*\(standing\)/)?.[1] || '1320x450x200mm' : '1320x450x200mm';
    const foldDimensions = specs.dimensions?.includes('folded') ? 
      specs.dimensions.match(/([\d,]+x[\d,]+x[\d,]+mm)\s*\(folded\)/)?.[1] || '690x450x300mm' : '690x450x300mm';
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-3 bg-blue-600 text-white">
          <div className="p-4 font-semibold border-r border-blue-500">Model</div>
          <div className="p-4 font-semibold text-center border-r border-blue-500">G1</div>
          <div className="p-4 font-semibold text-center">G1 EDU</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Height, Width and Thickness (Stand)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{standDimensions}</div>
            <div className="p-4 text-sm text-gray-700">{standDimensions}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Height, Width and Thickness (Fold)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{foldDimensions}</div>
            <div className="p-4 text-sm text-gray-700">{foldDimensions}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Weight (With Battery)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.weight}</div>
            <div className="p-4 text-sm text-gray-700">{specs.weight}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Total Degrees of Freedom (Joint Freedom)</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">23</div>
            <div className="p-4 text-sm text-gray-700">{specs.totalDegreesOfFreedom}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Single Leg Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.singleLegDOF}</div>
            <div className="p-4 text-sm text-gray-700">{specs.singleLegDOF}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Waist Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">1</div>
            <div className="p-4 text-sm text-gray-700">{specs.waistDOF}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Single Arm Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.singleArmDOF}</div>
            <div className="p-4 text-sm text-gray-700">{specs.singleArmDOF}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Single Hand Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">0</div>
            <div className="p-4 text-sm text-gray-700">{specs.singleHandDOF}<br/>
              <span className="text-xs text-gray-500">Force-controlled three-fingered hand<br/>
              Dexterous manipulation capabilities<br/>
              Optional tactile sensor arrays</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Joint output bearing</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.jointOutputBearing}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Joint motor</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.jointMotor}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Maximum Torque of Knee Joint [1]</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.maxTorqueKneeJoint === 'object' ? specs.maxTorqueKneeJoint.G1 : '90N.m'}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.maxTorqueKneeJoint === 'object' ? specs.maxTorqueKneeJoint.G1_EDU : specs.maxTorqueKneeJoint}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Arm Maximum Load [2]</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.armMaxLoad === 'object' ? specs.armMaxLoad.G1 : 'About 2Kg'}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.armMaxLoad === 'object' ? specs.armMaxLoad.G1_EDU : specs.armMaxLoad}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Calf + Thigh Length</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.calfThighLength}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Arm Span</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.armSpan}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Battery</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">
              {typeof specs.battery === 'string' ? specs.battery : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Computing Power</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">{specs.computing}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Connectivity</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">
              {specs.connectivity?.join(', ')}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Sensors</div>
            <div className="p-4 text-sm text-gray-700 col-span-2">
              {Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Warranty</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">
              {typeof specs.warranty === 'object' && specs.warranty ? (specs.warranty as {G1?: string}).G1 : 'N/A'}
            </div>
            <div className="p-4 text-sm text-gray-700">
              {typeof specs.warranty === 'object' && specs.warranty ? (specs.warranty as {G1_EDU?: string}).G1_EDU : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default simple specification display for other robots
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-200">
        {specs.dimensions && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Dimensions</div>
            <div className="text-gray-900">{specs.dimensions}</div>
          </div>
        )}
        {specs.weight && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Weight</div>
            <div className="text-gray-900">{specs.weight}</div>
          </div>
        )}
        {specs.battery && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Battery</div>
            <div className="text-gray-900">
              {typeof specs.battery === 'string' ? specs.battery : 
               typeof specs.battery === 'object' && specs.battery ? 
                 Object.entries(specs.battery).map(([key, value]) => `${key}: ${value}`).join(', ') : 'N/A'}
            </div>
          </div>
        )}
        {specs.maxSpeed && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Max Speed</div>
            <div className="text-gray-900">
              {typeof specs.maxSpeed === 'string' ? specs.maxSpeed : 
               typeof specs.maxSpeed === 'object' && specs.maxSpeed ? 
                 Object.entries(specs.maxSpeed).map(([key, value]) => `${key}: ${value}`).join(', ') : 'N/A'}
            </div>
          </div>
        )}
        {specs.payload && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Payload</div>
            <div className="text-gray-900">
              {typeof specs.payload === 'string' ? specs.payload : 
               typeof specs.payload === 'object' && specs.payload ? 
                 Object.entries(specs.payload).map(([key, value]) => `${key}: ${value}`).join(', ') : 'N/A'}
            </div>
          </div>
        )}
        {specs.dof && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Degrees of Freedom</div>
            <div className="text-gray-900">{specs.dof}</div>
          </div>
        )}
        {(Array.isArray(specs.sensors) || (typeof specs.sensors === 'object' && specs.sensors)) && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Sensors</div>
            <div className="text-gray-900">
              {Array.isArray(specs.sensors) ? (
                <ul className="list-disc list-inside space-y-1">
                  {specs.sensors.map((sensor, index) => (
                    <li key={index} className="text-sm">{sensor}</li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                  {typeof specs.sensors === 'object' && specs.sensors && Object.entries(specs.sensors).map(([variant, sensorList]) => (
                    <div key={variant} className="text-sm">
                      <span className="font-medium text-blue-600">{variant}:</span> {Array.isArray(sensorList) ? sensorList.join(', ') : String(sensorList)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}