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
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.maxClimbHeight?.AIR}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.maxClimbHeight?.PRO}</div>
            <div className="p-4 text-sm text-gray-700">{specs.maxClimbHeight?.EDU}</div>
          </div>
          
          <div className="grid grid-cols-4">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Max Climb Angle</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.maxClimbAngle?.AIR}</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.maxClimbAngle?.PRO}</div>
            <div className="p-4 text-sm text-gray-700">{specs.maxClimbAngle?.EDU}</div>
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
            <div className="p-4 text-sm text-gray-700 col-span-3">{specs.sensors?.join(', ')}</div>
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
              {specs.sensors?.join(', ')}
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-200 bg-gray-50 text-gray-900">Warranty</div>
            <div className="p-4 text-sm border-r border-gray-200 text-gray-700">{specs.warranty?.G1}</div>
            <div className="p-4 text-sm text-gray-700">{specs.warranty?.G1_EDU}</div>
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
              {typeof specs.battery === 'string' ? specs.battery : 'N/A'}
            </div>
          </div>
        )}
        {specs.maxSpeed && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Max Speed</div>
            <div className="text-gray-900">
              {typeof specs.maxSpeed === 'string' ? specs.maxSpeed : 'N/A'}
            </div>
          </div>
        )}
        {specs.payload && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Payload</div>
            <div className="text-gray-900">
              {typeof specs.payload === 'string' ? specs.payload : 'N/A'}
            </div>
          </div>
        )}
        {specs.dof && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Degrees of Freedom</div>
            <div className="text-gray-900">{specs.dof}</div>
          </div>
        )}
        {specs.sensors && specs.sensors.length > 0 && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Sensors</div>
            <div className="text-gray-900">
              <ul className="list-disc list-inside space-y-1">
                {specs.sensors.map((sensor, index) => (
                  <li key={index} className="text-sm">{sensor}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}