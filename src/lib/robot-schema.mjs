import { z } from 'zod';

export const RobotCategorySchema = z.enum(['humanoid', 'quadruped', 'accessory', 'other']);

const PriceValueSchema = z.union([z.number().nonnegative(), z.string().min(1), z.null()]);

export const RobotPriceModelSchema = z.object({
  name: z.string().min(1),
  price: PriceValueSchema,
});

export const RobotPriceSchema = z.object({
  starting: PriceValueSchema,
  currency: z.string().min(1),
  models: z.array(RobotPriceModelSchema).default([]),
});

// These “detail sections” vary a lot between robots (and evolve over time).
// We keep them flexible at the schema level, and make UI render defensively.
const DimensionsSchema = z.record(z.string(), z.string());

const GeneralInfoSchema = z
  .object({
    manufacturer: z.string().min(1),
    modelName: z.string().min(1),
    dimensions: DimensionsSchema,
  })
  .passthrough();

const HardwareBuildQualitySchema = z.record(z.string(), z.unknown());
const SoftwareEcosystemSchema = z.record(z.string(), z.unknown());
const SupplierReliabilitySchema = z.record(z.string(), z.unknown());

export const RobotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  category: RobotCategorySchema,

  price: RobotPriceSchema,

  specifications: z.record(z.string(), z.unknown()).default({}),

  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).optional(),
  documentation: z.array(z.string()).optional(),

  officialUrl: z.string().url().nullable().optional().default(null),
  description: z.string().min(1),

  generalInfo: GeneralInfoSchema.optional(),
  keyFeatures: z.array(z.string()).optional(),
  hardwareBuildQuality: HardwareBuildQualitySchema.optional(),
  softwareEcosystem: SoftwareEcosystemSchema.optional(),
  supplierReliability: SupplierReliabilitySchema.optional(),
  highResPhotos: z.array(z.string()).optional(),
});

export const RobotsSchema = z.array(RobotSchema);
