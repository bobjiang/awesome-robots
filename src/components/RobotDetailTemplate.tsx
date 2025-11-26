'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Robot } from '@/types/robot';

interface ExtendedRobot extends Robot {
  generalInfo?: {
    manufacturer: string;
    modelName: string;
    dimensions: {
      standing: string;
      folded?: string;
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

interface RobotDetailTemplateProps {
  robot: ExtendedRobot;
}

export default function RobotDetailTemplate({ robot }: RobotDetailTemplateProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  
  const photos = robot.highResPhotos || robot.images || [];
  
  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h3>
      {children}
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* High Resolution Photos */}
      {photos.length > 0 && (
        <div className="mb-16">
          {/* Main Photo Display */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
              <div className="relative w-full h-full">
                <Image
                  src={photos[activePhotoIndex]}
                  alt={`${robot.name} High Resolution Photo ${activePhotoIndex + 1}`}
                  fill
                  className="object-contain rounded-lg"
                  priority
                  sizes="(max-width: 1200px) 100vw, 80vw"
                />
              </div>
            </div>
          </div>
          
          {/* Photo Thumbnails */}
          {photos.length > 1 && (
            <div className="flex justify-center space-x-4">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setActivePhotoIndex(index)}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    activePhotoIndex === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* General Info */}
      {robot.generalInfo && (
        <InfoSection title="General Info">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Manufacturer / Brand</span>
                <span className="text-lg text-gray-900">{robot.generalInfo.manufacturer}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Model Name</span>
                <span className="text-lg text-gray-900">{robot.generalInfo.modelName}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Weight</span>
                <span className="text-lg text-gray-900">{robot.generalInfo.dimensions.weight}</span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600 block mb-1">Dimensions</span>
              <div className="text-gray-900">
                <div>Standing: {robot.generalInfo.dimensions.standing}</div>
                {robot.generalInfo.dimensions.folded && (
                  <div>Folded: {robot.generalInfo.dimensions.folded}</div>
                )}
              </div>
            </div>
          </div>
        </InfoSection>
      )}

      {/* Key Features */}
      {robot.keyFeatures && (
        <InfoSection title="Key Features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {robot.keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </InfoSection>
      )}


      {/* Hardware - Build Quality */}
      {robot.hardwareBuildQuality && (
        <InfoSection title="Hardware – Build Quality">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Total Degrees of Freedom (DoF)</span>
                <span className="text-lg text-gray-900">{robot.hardwareBuildQuality.totalDegreesOfFreedom}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Payload Capacity</span>
                <span className="text-lg text-gray-900">{robot.hardwareBuildQuality.payloadCapacity}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Battery Capacity & Runtime</span>
                <span className="text-lg text-gray-900">{robot.hardwareBuildQuality.batteryCapacityRuntime}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Charger</span>
                <span className="text-lg text-gray-900">{robot.hardwareBuildQuality.charger}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Sensors Included</span>
                <span className="text-gray-900">{robot.hardwareBuildQuality.sensorsIncluded?.join(', ') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Interfaces</span>
                <span className="text-gray-900">{robot.hardwareBuildQuality.interfaces?.join(', ') || 'N/A'}</span>
              </div>
            </div>
          </div>
        </InfoSection>
      )}

      {/* Software - Ecosystem */}
      {robot.softwareEcosystem && (
        <InfoSection title="Software – Ecosystem">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">ROS/ROS2 Support</span>
                <span className="text-lg text-gray-900">{robot.softwareEcosystem.rosSupport}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">SDK Languages</span>
                <span className="text-gray-900">{robot.softwareEcosystem.sdkLanguages?.join(', ') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">API Documentation Quality</span>
                <span className="text-gray-900">{robot.softwareEcosystem.apiDocumentationQuality}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Open-source Repos / Community</span>
                {robot.softwareEcosystem.openSourceRepos === "No" ? (
                  <span className="text-gray-900">No</span>
                ) : (
                  <Link 
                    href={robot.softwareEcosystem.openSourceRepos} 
                    target="_blank"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    GitHub Repository
                  </Link>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">AI Frameworks Supported</span>
                <span className="text-gray-900">{robot.softwareEcosystem.aiFrameworksSupported?.join(', ') || 'N/A'}</span>
              </div>
            </div>
          </div>
        </InfoSection>
      )}

      {/* Supplier Reliability */}
      {robot.supplierReliability && (
        <InfoSection title="Supplier Reliability">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Warranty</span>
                <div className="text-gray-900">
                  <div>Duration: {robot.supplierReliability.warranty?.duration || 'N/A'}</div>
                  <div className="text-sm text-gray-600 mt-1">Coverage: {robot.supplierReliability.warranty?.coverage || 'N/A'}</div>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Track Record</span>
                <span className="text-gray-900">{robot.supplierReliability.trackRecord}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Post-sales Support</span>
                <span className="text-gray-900">{robot.supplierReliability.postSalesSupport}</span>
              </div>
            </div>
          </div>
        </InfoSection>
      )}
    </div>
  );
}