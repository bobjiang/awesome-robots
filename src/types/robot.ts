export interface Robot {
  id: string;
  name: string;
  brand: string;
  category: 'humanoid' | 'quadruped' | 'accessory' | 'other';
  price: {
    starting: number;
    currency: string;
    models: Array<{
      name: string;
      price: number | 'request';
    }>;
  };
  specifications: {
    dimensions?: string;
    weight?: string;
    battery?: string | {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    sensors?: string[];
    dof?: number;
    maxSpeed?: string | {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    payload?: string | {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    // Go2 specific fields
    material?: string;
    voltage?: string;
    workingMaxPower?: string;
    maxClimbHeight?: {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    maxClimbAngle?: {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    computingPower?: string | {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    wirelessVectorPositioning?: {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    footEndForceSensor?: {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    // G1 specific fields
    totalDegreesOfFreedom?: string;
    singleLegDOF?: number;
    waistDOF?: string;
    singleArmDOF?: number;
    singleHandDOF?: string;
    jointOutputBearing?: string;
    jointMotor?: string;
    maxTorqueKneeJoint?: string | {
      G1?: string;
      G1_EDU?: string;
    };
    armMaxLoad?: string | {
      G1?: string;
      G1_EDU?: string;
    };
    computing?: string;
    connectivity?: string[];
    warranty?: {
      G1?: string;
      G1_EDU?: string;
    };
    calfThighLength?: string;
    armSpan?: string;
    // H1 specific fields
    keyDimensions?: {
      H1?: string;
      H1_2?: string;
    };
    thighCalfLength?: {
      H1?: string;
      H1_2?: string;
    };
    totalArmLength?: {
      H1?: string;
      H1_2?: string;
    };
    dofEachLeg?: {
      H1?: string;
      H1_2?: string;
    };
    dofEachArm?: {
      H1?: string;
      H1_2?: string;
    };
    totalWeight?: {
      H1?: string;
      H1_2?: string;
    };
    coreJointMotor?: string;
    ultimateTorqueJointUnit?: {
      kneeTorque?: string;
      hipJointTorque?: string;
      ankleTorque?: {
        H1?: string;
        H1_2?: string;
      };
      armJointTorque?: {
        H1?: string;
        H1_2?: string;
      };
    };
    mobility?: {
      H1?: string;
      H1_2?: string;
    };
    controlPerceptionComputingPower?: string;
    sensorConfiguration?: string;
    dexterousHand?: {
      H1?: string;
      H1_2?: string;
    };
    armJointPerformance?: {
      H1?: string;
      H1_2?: string;
    };
    armNormalLoad?: {
      H1?: string;
      H1_2?: string;
    };
  };
  features: string[];
  images: string[];
  videos?: string[];
  documentation?: string[];
  officialUrl: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  specifications?: {
    sensors?: string[];
    features?: string[];
  };
}

export interface SortOption {
  value: string;
  label: string;
}