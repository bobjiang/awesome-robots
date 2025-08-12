'use client';

import { Robot } from '@/types/robot';

interface SpecificationTableProps {
  robot: Robot;
}

export default function SpecificationTable({ robot }: SpecificationTableProps) {
  const specs = robot.specifications;

  // For H1/H1-2 robots with detailed comparative specs
  if (robot.id === 'unitree-h1' && specs.keyDimensions) {
    return (
      <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-800">
          <div className="p-4 font-semibold border-r border-gray-700"></div>
          <div className="p-4 font-semibold text-center border-r border-gray-700">H1</div>
          <div className="p-4 font-semibold text-center">H1-2</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Key Dimensions</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.keyDimensions.H1}</div>
            <div className="p-4 text-sm">{specs.keyDimensions.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Thigh and Calf Length</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.thighCalfLength?.H1}</div>
            <div className="p-4 text-sm">{specs.thighCalfLength?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Total Arm Length</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.totalArmLength?.H1}</div>
            <div className="p-4 text-sm">{specs.totalArmLength?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">DOF of Each Leg</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.dofEachLeg?.H1}</div>
            <div className="p-4 text-sm">{specs.dofEachLeg?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">DOF of Each Arm</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.dofEachArm?.H1}</div>
            <div className="p-4 text-sm">{specs.dofEachArm?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Total Weight</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.totalWeight?.H1}</div>
            <div className="p-4 text-sm">{specs.totalWeight?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Joint output bearing</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.jointOutputBearing}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Core Joint motor</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.coreJointMotor}</div>
          </div>
          
          {specs.ultimateTorqueJointUnit && (
            <>
              <div className="grid grid-cols-3">
                <div className="p-4 font-medium border-r border-gray-700">Ultimate Torque of Joint Unit</div>
                <div className="p-4 text-sm border-r border-gray-700">
                  Knee Torque {specs.ultimateTorqueJointUnit.kneeTorque}, Hip Joint Torque {specs.ultimateTorqueJointUnit.hipJointTorque}<br/>
                  Ankle Torque {specs.ultimateTorqueJointUnit.ankleTorque?.H1}, Arm Joint Torque {specs.ultimateTorqueJointUnit.armJointTorque?.H1}
                </div>
                <div className="p-4 text-sm">
                  Knee Torque {specs.ultimateTorqueJointUnit.kneeTorque}, Hip Joint Torque {specs.ultimateTorqueJointUnit.hipJointTorque}<br/>
                  {specs.ultimateTorqueJointUnit.armJointTorque?.H1_2}
                </div>
              </div>
            </>
          )}
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Mobility</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.mobility?.H1}</div>
            <div className="p-4 text-sm">{specs.mobility?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Battery</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.battery}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Control and Perception Computing Power</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.controlPerceptionComputingPower}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Sensor Configuration</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.sensorConfiguration}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Dexterous Hand</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.dexterousHand?.H1}</div>
            <div className="p-4 text-sm">{specs.dexterousHand?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Arm joint performance (peak torque)</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.armJointPerformance?.H1}</div>
            <div className="p-4 text-sm">{specs.armJointPerformance?.H1_2}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Arm normal load</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.armNormalLoad?.H1}</div>
            <div className="p-4 text-sm">{specs.armNormalLoad?.H1_2}</div>
          </div>
        </div>
      </div>
    );
  }

  // For G1 robot with detailed specs
  if (robot.id === 'unitree-g1' && specs.totalDegreesOfFreedom) {
    return (
      <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-800">
          <div className="p-4 font-semibold border-r border-gray-700">Model</div>
          <div className="p-4 font-semibold text-center border-r border-gray-700">G1</div>
          <div className="p-4 font-semibold text-center">G1 EDU</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Height, Width and Thickness (Stand)</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.dimensions?.split(', ')[0]}</div>
            <div className="p-4 text-sm">{specs.dimensions?.split(', ')[0]}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Height, Width and Thickness (Fold)</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.dimensions?.split(', ')[1]}</div>
            <div className="p-4 text-sm">{specs.dimensions?.split(', ')[1]}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Weight (With Battery)</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.weight}</div>
            <div className="p-4 text-sm">{specs.weight}+</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Total Degrees of Freedom (Joint Freedom)</div>
            <div className="p-4 text-sm border-r border-gray-700">23</div>
            <div className="p-4 text-sm">{specs.totalDegreesOfFreedom}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Single Leg Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.singleLegDOF}</div>
            <div className="p-4 text-sm">{specs.singleLegDOF}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Waist Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-700">1</div>
            <div className="p-4 text-sm">{specs.waistDOF}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Single Arm Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-700">{specs.singleArmDOF}</div>
            <div className="p-4 text-sm">{specs.singleArmDOF}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Single Hand Degrees of Freedom</div>
            <div className="p-4 text-sm border-r border-gray-700">/</div>
            <div className="p-4 text-sm">{specs.singleHandDOF}<br/>
              +2(Optional 2 additional wrist degrees of freedom)<br/>
              *Three-fingered dexterous hand Dex3-1 Parameter:<br/>
              The thumb has 3 active degrees of freedom; the index finger has 2 active degrees of freedom; the middle finger has 2 active degrees of freedom.<br/>
              **Dex3-1 can optionally be installed with tactile sensor arrays
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Joint output bearing</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.jointOutputBearing}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Joint motor</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.jointMotor}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Maximum Torque of Knee Joint [1]</div>
            <div className="p-4 text-sm border-r border-gray-700">90N.m</div>
            <div className="p-4 text-sm">{specs.maxTorqueKneeJoint}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Arm Maximum Load [2]</div>
            <div className="p-4 text-sm border-r border-gray-700">About 2Kg</div>
            <div className="p-4 text-sm">{specs.armMaxLoad}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Calf + Thigh Length</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.calfThighLength}</div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="p-4 font-medium border-r border-gray-700">Arm Span</div>
            <div className="p-4 text-sm border-r border-gray-700 col-span-2">{specs.armSpan}</div>
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
            <div className="text-gray-900">{specs.battery}</div>
          </div>
        )}
        {specs.maxSpeed && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Max Speed</div>
            <div className="text-gray-900">{specs.maxSpeed}</div>
          </div>
        )}
        {specs.payload && (
          <div className="grid grid-cols-2 p-4">
            <div className="font-medium text-gray-700">Payload</div>
            <div className="text-gray-900">{specs.payload}</div>
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