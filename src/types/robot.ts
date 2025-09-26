// Base robot interface with common properties
export interface BaseRobot {
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
  specifications: Record<string, unknown>;
  features: string[];
  images: string[];
  videos?: string[];
  documentation?: string[];
  officialUrl: string;
  description: string;
  // Extended properties for RobotDetailTemplate
  generalInfo?: {
    manufacturer: string;
    modelName: string;
    dimensions: {
      standing: string;
      folded: string;
      weight: string;
    };
  };
  keyFeatures?: string[];
  hardwareBuildQuality?: {
    totalDegreesOfFreedom: string;
    payloadCapacity: string;
    batteryCapacityRuntime: string;
    charger: string;
    sensorsIncluded: string[];
    interfaces: string[];
  };
  softwareEcosystem?: {
    rosSupport: string;
    sdkLanguages: string[];
    openSourceRepos: string;
    aiFrameworksSupported: string[];
    apiDocumentationQuality: string;
  };
  supplierReliability?: {
    warranty: {
      duration: string;
      coverage: string;
    };
    postSalesSupport: string;
    trackRecord: string;
  };
  highResPhotos?: string[];
}

// Legacy Robot interface for backward compatibility
export interface Robot extends BaseRobot {
  specifications: {
    dimensions?: string;
    weight?: string;
    battery?: string | {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    sensors?: string[] | {
      A2?: string[];
      A2_PRO?: string[];
      AIR?: string[];
      PRO?: string[];
      EDU?: string[];
    };
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
    maxClimbHeight?: string | {
      AIR?: string;
      PRO?: string;
      EDU?: string;
    };
    maxClimbAngle?: string | {
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
    // Go2-W specific fields
    jointMotors?: string;
    maxJointTorque?: string;
    tires?: string;
    charger?: string;
    additionalFeatures?: string[];
    // A2 and B2 specific fields
    dimensionsStanding?: string;
    dimensionsLying?: string;
    weightWithoutBattery?: string;
    supplyVoltage?: string;
    degreesOfFreedom?: string;
    jointBearings?: string;
    batteryCapacity?: string | {
      single?: string;
      dual?: string;
    };
    batteryLife?: string | {
      noLoad?: string;
      withLoad?: string;
    };
    maxStandingLoad?: string;
    continuousWalkingLoad?: string;
    slopeWalking?: string;
    stairClimbing?: string;
    operatingTemperature?: string;
    ingressProtection?: string | {
      A2?: string;
      A2_PRO?: string;
    };
    // B2 specific fields
    maxRunningSpeed?: string;
    longestJumpDistance?: string;
    standingLoad?: string;
    obstacleCrossing?: string;
    slopeAngle?: string;
    batteryVoltage?: string;
    endurance?: {
      unloaded?: string;
      loaded?: string;
    };
    ditchJumping?: string;
    controlPlatform?: string | {
      standard?: string;
      userDevelopment?: string;
      optional?: string;
    };
    powerOutputs?: string[];
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
    warranty?: string | {
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

export interface BrandConfig extends Brand {
  imagePatterns: {
    hostname: string;
    pathname: string;
    protocol?: string;
    port?: string;
  }[];
  imageBasePath: string; // Base path for local images
  specificationSchema?: Record<string, unknown>; // Brand-specific spec validation
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