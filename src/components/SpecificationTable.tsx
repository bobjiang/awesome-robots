'use client';

import { Robot } from '@/types/robot';

interface SpecificationTableProps {
  robot: Robot;
}


interface ExtendedSpecifications {
  maxSlope?: string;
  stepHeight?: string;
  ingressProtection?: string;
  operatingTemperature?: string;
  batteryLife?: string;
  maxMileage?: string;
  [key: string]: unknown;
}

export default function SpecificationTable({ robot }: SpecificationTableProps) {
  const specs = robot.specifications;


  // Helper function to safely access object spec properties
  const getObjectSpecValue = (obj: unknown, key: string): string => {
    if (typeof obj === 'object' && obj && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return typeof value === 'string' ? value : 'N/A';
    }
    return 'N/A';
  };

  // For Go2 robot with detailed variant specs
  if (robot.id === 'unitree-go2' && specs.payload && typeof specs.payload === 'object') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th scope="col" className="p-4 font-semibold border-r border-blue-500 text-left">Model</th>
              <th scope="col" className="p-4 font-semibold text-center border-r border-blue-500">Go2 AIR</th>
              <th scope="col" className="p-4 font-semibold text-center border-r border-blue-500">Go2 PRO</th>
              <th scope="col" className="p-4 font-semibold text-center">Go2 EDU</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Dimensions (Standing)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700" colSpan={3}>{specs.dimensions?.split(', ')[0]}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Dimensions (Crouching)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700" colSpan={3}>{specs.dimensions?.split(', ')[1]}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Weight (with Battery)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700" colSpan={3}>{specs.weight}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Material</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700" colSpan={3}>{specs.material}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Voltage</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700" colSpan={3}>{specs.voltage}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Working Maximum Power</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700" colSpan={3}>{specs.workingMaxPower}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Payload</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.payload === 'object' ? specs.payload.AIR : ''}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.payload === 'object' ? specs.payload.PRO : ''}</td>
              <td className="p-4 text-sm text-gray-700">{typeof specs.payload === 'object' ? specs.payload.EDU : ''}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Maximum Speed</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxSpeed === 'object' ? specs.maxSpeed.AIR : ''}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxSpeed === 'object' ? specs.maxSpeed.PRO : ''}</td>
              <td className="p-4 text-sm text-gray-700">{typeof specs.maxSpeed === 'object' ? specs.maxSpeed.EDU : ''}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Climb Height</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbHeight === 'object' ? specs.maxClimbHeight?.AIR : ''}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbHeight === 'object' ? specs.maxClimbHeight?.PRO : ''}</td>
              <td className="p-4 text-sm text-gray-700">{typeof specs.maxClimbHeight === 'object' ? specs.maxClimbHeight?.EDU : ''}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Climb Angle</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbAngle === 'object' ? specs.maxClimbAngle?.AIR : ''}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.maxClimbAngle === 'object' ? specs.maxClimbAngle?.PRO : ''}</td>
              <td className="p-4 text-sm text-gray-700">{typeof specs.maxClimbAngle === 'object' ? specs.maxClimbAngle?.EDU : ''}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Computing Power</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.computingPower === 'object' ? specs.computingPower.AIR : ''}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.computingPower === 'object' ? specs.computingPower.PRO : ''}</td>
              <td className="p-4 text-sm text-gray-700">{typeof specs.computingPower === 'object' ? specs.computingPower.EDU : ''}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Wireless Vector Positioning</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.wirelessVectorPositioning?.AIR}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.wirelessVectorPositioning?.PRO}</td>
              <td className="p-4 text-sm text-gray-700">{specs.wirelessVectorPositioning?.EDU}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Foot-end Force Sensor</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.footEndForceSensor?.AIR}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.footEndForceSensor?.PRO}</td>
              <td className="p-4 text-sm text-gray-700">{specs.footEndForceSensor?.EDU}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.battery === 'object' ? specs.battery.AIR : ''}</td>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{typeof specs.battery === 'object' ? specs.battery.PRO : ''}</td>
              <td className="p-4 text-sm text-gray-700">{typeof specs.battery === 'object' ? specs.battery.EDU : ''}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Sensors</th>
              <td className="p-4 text-sm text-gray-700" colSpan={3}>
                {Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // For Go2-W robot with detailed specs
  if (robot.id === 'unitree-go2-w' && specs.jointMotors) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th scope="col" className="p-4 font-semibold border-r border-blue-500 text-left">Specification</th>
              <th scope="col" className="p-4 font-semibold text-center">Go2-W</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Dimensions</th>
              <td className="p-4 text-sm text-gray-700">{specs.dimensions}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Weight (with Battery)</th>
              <td className="p-4 text-sm text-gray-700">{specs.weight}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Voltage</th>
              <td className="p-4 text-sm text-gray-700">{specs.voltage}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Payload</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.payload === 'string' ? specs.payload : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Maximum Speed</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.maxSpeed === 'string' ? specs.maxSpeed : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Climb Height</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.maxClimbHeight === 'string' ? specs.maxClimbHeight : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Climb Angle</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.maxClimbAngle === 'string' ? specs.maxClimbAngle : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Computing Power</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.computingPower === 'string' ? specs.computingPower : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Joint Motors</th>
              <td className="p-4 text-sm text-gray-700">{specs.jointMotors}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Joint Torque</th>
              <td className="p-4 text-sm text-gray-700">{specs.maxJointTorque}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Tires</th>
              <td className="p-4 text-sm text-gray-700">{specs.tires}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.battery === 'string' ? specs.battery : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Charger</th>
              <td className="p-4 text-sm text-gray-700">{specs.charger}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Warranty</th>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.warranty === 'string' ? specs.warranty : 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Sensors</th>
              <td className="p-4 text-sm text-gray-700">{Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Additional Features</th>
              <td className="p-4 text-sm text-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  {specs.additionalFeatures?.map((feature, index) => (
                    <li key={index} className="text-sm">{feature}</li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // For A2 robot with detailed specs
  if (robot.id === 'unitree-a2' && specs.dimensionsStanding) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th scope="col" className="p-4 font-semibold border-r border-blue-500 text-left">Specification</th>
              <th scope="col" className="p-4 font-semibold text-center border-r border-blue-500">A2</th>
              <th scope="col" className="p-4 font-semibold text-center">A2-PRO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Size (Standing)</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.dimensionsStanding}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Size (Lying Prone)</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.dimensionsLying}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Material</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.material}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Weight (with battery)</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.weight}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Weight (without battery)</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.weightWithoutBattery}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Supply Voltage</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.supplyVoltage}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Degrees of Freedom</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.degreesOfFreedom}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Joint Bearings</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.jointBearings}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Joint Torque</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.maxJointTorque}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery Capacity</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>
                {typeof specs.batteryCapacity === 'object' ?
                  `Single: ${specs.batteryCapacity.single}, Dual: ${specs.batteryCapacity.dual}` :
                  specs.batteryCapacity || 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery Life</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>
                {typeof specs.batteryLife === 'object' ?
                  `No Load: ${specs.batteryLife.noLoad}, With Load: ${specs.batteryLife.withLoad}` :
                  specs.batteryLife || 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Standing Load</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.maxStandingLoad}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Continuous Walking Load</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.continuousWalkingLoad}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Slope Walking</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.slopeWalking}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Speed</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{typeof specs.maxSpeed === 'string' ? specs.maxSpeed : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Stair Climbing</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.stairClimbing}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Operating Temperature</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.operatingTemperature}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Ingress Protection</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {typeof specs.ingressProtection === 'object' ? specs.ingressProtection.A2 : specs.ingressProtection}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.ingressProtection === 'object' ? specs.ingressProtection.A2_PRO : specs.ingressProtection}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Computing</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{typeof specs.computingPower === 'string' ? specs.computingPower : specs.computing}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Connectivity</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.connectivity?.join(', ')}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Sensors</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {typeof specs.sensors === 'object' && !Array.isArray(specs.sensors) && 'A2' in specs.sensors && specs.sensors.A2 ?
                  specs.sensors.A2.join(', ') :
                  (Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A')}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.sensors === 'object' && !Array.isArray(specs.sensors) && 'A2_PRO' in specs.sensors && specs.sensors.A2_PRO ?
                  specs.sensors.A2_PRO.join(', ') :
                  (Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // For B2 robot with detailed specs
  if (robot.id === 'unitree-b2' && specs.dimensionsStanding) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th scope="col" className="p-4 font-semibold border-r border-blue-500 text-left">Specification</th>
              <th scope="col" className="p-4 font-semibold text-center">B2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Size (Standing)</th>
              <td className="p-4 text-sm text-gray-700">{specs.dimensionsStanding}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Size (Lying Prone)</th>
              <td className="p-4 text-sm text-gray-700">{specs.dimensionsLying}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Weight (including battery)</th>
              <td className="p-4 text-sm text-gray-700">{specs.weight}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Running Speed</th>
              <td className="p-4 text-sm text-gray-700">{specs.maxRunningSpeed}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Joint Torque</th>
              <td className="p-4 text-sm text-gray-700">{specs.maxJointTorque}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Longest Jump Distance</th>
              <td className="p-4 text-sm text-gray-700">{specs.longestJumpDistance}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Standing Load</th>
              <td className="p-4 text-sm text-gray-700">{specs.standingLoad}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Continuous Walking Load</th>
              <td className="p-4 text-sm text-gray-700">{specs.continuousWalkingLoad}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Obstacle Crossing</th>
              <td className="p-4 text-sm text-gray-700">{specs.obstacleCrossing}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Slope Angle</th>
              <td className="p-4 text-sm text-gray-700">{specs.slopeAngle}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery</th>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.batteryCapacity === 'string' ? specs.batteryCapacity : 'N/A'} @ {specs.batteryVoltage}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery Life</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.batteryLife === 'string' ? specs.batteryLife : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Endurance</th>
              <td className="p-4 text-sm text-gray-700">
                Unloaded: {specs.endurance?.unloaded}<br/>
                Loaded: {specs.endurance?.loaded}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Operating Temperature</th>
              <td className="p-4 text-sm text-gray-700">{specs.operatingTemperature}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Ingress Protection</th>
              <td className="p-4 text-sm text-gray-700">{typeof specs.ingressProtection === 'string' ? specs.ingressProtection : 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Ditch Jumping</th>
              <td className="p-4 text-sm text-gray-700">{specs.ditchJumping}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Control Platform</th>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.controlPlatform === 'object' ?
                  `Standard: ${specs.controlPlatform.standard}, User Dev: ${specs.controlPlatform.userDevelopment}, Optional: ${specs.controlPlatform.optional}` :
                  specs.controlPlatform || 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Connectivity</th>
              <td className="p-4 text-sm text-gray-700">{specs.connectivity?.join(', ')}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Power Outputs</th>
              <td className="p-4 text-sm text-gray-700">{specs.powerOutputs?.join(', ')}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Sensors</th>
              <td className="p-4 text-sm text-gray-700">{Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // For H1/H1-2 robots with detailed comparative specs
  if (robot.id === 'unitree-h1' && specs.keyDimensions) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th scope="col" className="p-4 font-semibold border-r border-blue-500 text-left"></th>
              <th scope="col" className="p-4 font-semibold text-center border-r border-blue-500">H1</th>
              <th scope="col" className="p-4 font-semibold text-center">H1-2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Key Dimensions</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.keyDimensions.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.keyDimensions.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Thigh and Calf Length</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.thighCalfLength?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.thighCalfLength?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Total Arm Length</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.totalArmLength?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.totalArmLength?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">DOF of Each Leg</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.dofEachLeg?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.dofEachLeg?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">DOF of Each Arm</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.dofEachArm?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.dofEachArm?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Total Weight</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.totalWeight?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.totalWeight?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Joint output bearing</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.jointOutputBearing}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Core Joint motor</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.coreJointMotor}</td>
            </tr>
            {specs.ultimateTorqueJointUnit && (
              <tr>
                <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Ultimate Torque of Joint Unit</th>
                <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                  Knee Torque {specs.ultimateTorqueJointUnit.kneeTorque}, Hip Joint Torque {specs.ultimateTorqueJointUnit.hipJointTorque}<br/>
                  Ankle Torque {specs.ultimateTorqueJointUnit.ankleTorque?.H1}, Arm Joint Torque {specs.ultimateTorqueJointUnit.armJointTorque?.H1}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  Knee Torque {specs.ultimateTorqueJointUnit.kneeTorque}, Hip Joint Torque {specs.ultimateTorqueJointUnit.hipJointTorque}<br/>
                  {specs.ultimateTorqueJointUnit.armJointTorque?.H1_2}
                </td>
              </tr>
            )}
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Mobility</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.mobility?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.mobility?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>
                {typeof specs.battery === 'string' ? specs.battery : 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Control and Perception Computing Power</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.controlPerceptionComputingPower}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Sensor Configuration</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.sensorConfiguration}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Dexterous Hand</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.dexterousHand?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.dexterousHand?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Arm joint performance (peak torque)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.armJointPerformance?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.armJointPerformance?.H1_2}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Arm normal load</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.armNormalLoad?.H1}</td>
              <td className="p-4 text-sm text-gray-700">{specs.armNormalLoad?.H1_2}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // For Deep Robotics X30 robot with variant specs
  if (robot.id === 'deep-robotics-x30' && typeof specs.dimensions === 'object') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th scope="col" className="p-4 font-semibold border-r border-blue-500 text-left">Specification</th>
              <th scope="col" className="p-4 font-semibold text-center border-r border-blue-500">X30</th>
              <th scope="col" className="p-4 font-semibold text-center">X30 Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Dimensions</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {getObjectSpecValue(specs.dimensions, 'X30')}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {getObjectSpecValue(specs.dimensions, 'X30_Pro')}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Weight</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {getObjectSpecValue(specs.weight, 'X30')}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {getObjectSpecValue(specs.weight, 'X30_Pro')}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Speed</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>
                {typeof specs.maxSpeed === 'string' ? specs.maxSpeed :
                 typeof specs.maxSpeed === 'object' && specs.maxSpeed ?
                   Object.entries(specs.maxSpeed).map(([key, value]) => `${key}: ${value}`).join(', ') : 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Slope</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{(specs as ExtendedSpecifications).maxSlope || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Step Height</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{(specs as ExtendedSpecifications).stepHeight || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Ingress Protection</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{(specs as ExtendedSpecifications).ingressProtection || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Operating Temperature</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{(specs as ExtendedSpecifications).operatingTemperature || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery Life</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{(specs as ExtendedSpecifications).batteryLife || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Max Mileage</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{(specs as ExtendedSpecifications).maxMileage || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Connectivity</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {getObjectSpecValue(specs.connectivity, 'X30')}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {getObjectSpecValue(specs.connectivity, 'X30_Pro')}
              </td>
            </tr>
          </tbody>
        </table>
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
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th scope="col" className="p-4 font-semibold border-r border-blue-500 text-left">Model</th>
              <th scope="col" className="p-4 font-semibold text-center border-r border-blue-500">G1</th>
              <th scope="col" className="p-4 font-semibold text-center">G1 EDU</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Height, Width and Thickness (Stand)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{standDimensions}</td>
              <td className="p-4 text-sm text-gray-700">{standDimensions}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Height, Width and Thickness (Fold)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{foldDimensions}</td>
              <td className="p-4 text-sm text-gray-700">{foldDimensions}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Weight (With Battery)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.weight}</td>
              <td className="p-4 text-sm text-gray-700">{specs.weight}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Total Degrees of Freedom (Joint Freedom)</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">23</td>
              <td className="p-4 text-sm text-gray-700">{specs.totalDegreesOfFreedom}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Single Leg Degrees of Freedom</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.singleLegDOF}</td>
              <td className="p-4 text-sm text-gray-700">{specs.singleLegDOF}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Waist Degrees of Freedom</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">1</td>
              <td className="p-4 text-sm text-gray-700">{specs.waistDOF}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Single Arm Degrees of Freedom</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.singleArmDOF}</td>
              <td className="p-4 text-sm text-gray-700">{specs.singleArmDOF}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Single Hand Degrees of Freedom</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">0</td>
              <td className="p-4 text-sm text-gray-700">{specs.singleHandDOF}<br/>
                <span className="text-xs text-gray-500">Force-controlled three-fingered hand<br/>
                Dexterous manipulation capabilities<br/>
                Optional tactile sensor arrays</span>
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Joint output bearing</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.jointOutputBearing}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Joint motor</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.jointMotor}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Maximum Torque of Knee Joint [1]</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {typeof specs.maxTorqueKneeJoint === 'object' ? specs.maxTorqueKneeJoint.G1 : '90N.m'}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.maxTorqueKneeJoint === 'object' ? specs.maxTorqueKneeJoint.G1_EDU : specs.maxTorqueKneeJoint}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Arm Maximum Load [2]</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {typeof specs.armMaxLoad === 'object' ? specs.armMaxLoad.G1 : 'About 2Kg'}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.armMaxLoad === 'object' ? specs.armMaxLoad.G1_EDU : specs.armMaxLoad}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Calf + Thigh Length</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.calfThighLength}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Arm Span</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.armSpan}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Battery</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>
                {typeof specs.battery === 'string' ? specs.battery : 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Computing Power</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>{specs.computing}</td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Connectivity</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>
                {specs.connectivity?.join(', ')}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Sensors</th>
              <td className="p-4 text-sm text-gray-700" colSpan={2}>
                {Array.isArray(specs.sensors) ? specs.sensors.join(', ') : 'N/A'}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900 text-left">Warranty</th>
              <td className="p-4 text-sm border-r border-gray-200 text-gray-700">
                {typeof specs.warranty === 'object' && specs.warranty ? (specs.warranty as {G1?: string}).G1 : 'N/A'}
              </td>
              <td className="p-4 text-sm text-gray-700">
                {typeof specs.warranty === 'object' && specs.warranty ? (specs.warranty as {G1_EDU?: string}).G1_EDU : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Default simple specification display for other robots
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <tbody className="divide-y divide-gray-200">
          {specs.dimensions && (
            <tr>
              <th scope="row" className="p-4 font-medium text-gray-700 text-left">Dimensions</th>
              <td className="p-4 text-gray-900">{specs.dimensions}</td>
            </tr>
          )}
          {specs.weight && (
            <tr>
              <th scope="row" className="p-4 font-medium text-gray-700 text-left">Weight</th>
              <td className="p-4 text-gray-900">{specs.weight}</td>
            </tr>
          )}
          {specs.battery && (
            <tr>
              <th scope="row" className="p-4 font-medium text-gray-700 text-left">Battery</th>
              <td className="p-4 text-gray-900">
                {typeof specs.battery === 'string' ? specs.battery :
                 typeof specs.battery === 'object' && specs.battery ?
                   Object.entries(specs.battery).map(([key, value]) => `${key}: ${value}`).join(', ') : 'N/A'}
              </td>
            </tr>
          )}
          {specs.maxSpeed && (
            <tr>
              <th scope="row" className="p-4 font-medium text-gray-700 text-left">Max Speed</th>
              <td className="p-4 text-gray-900">
                {typeof specs.maxSpeed === 'string' ? specs.maxSpeed :
                 typeof specs.maxSpeed === 'object' && specs.maxSpeed ?
                   Object.entries(specs.maxSpeed).map(([key, value]) => `${key}: ${value}`).join(', ') : 'N/A'}
              </td>
            </tr>
          )}
          {specs.payload && (
            <tr>
              <th scope="row" className="p-4 font-medium text-gray-700 text-left">Payload</th>
              <td className="p-4 text-gray-900">
                {typeof specs.payload === 'string' ? specs.payload :
                 typeof specs.payload === 'object' && specs.payload ?
                   Object.entries(specs.payload).map(([key, value]) => `${key}: ${value}`).join(', ') : 'N/A'}
              </td>
            </tr>
          )}
          {specs.dof && (
            <tr>
              <th scope="row" className="p-4 font-medium text-gray-700 text-left">Degrees of Freedom</th>
              <td className="p-4 text-gray-900">{specs.dof}</td>
            </tr>
          )}
          {(Array.isArray(specs.sensors) || (typeof specs.sensors === 'object' && specs.sensors)) && (
            <tr>
              <th scope="row" className="p-4 font-medium text-gray-700 text-left align-top">Sensors</th>
              <td className="p-4 text-gray-900">
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
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
