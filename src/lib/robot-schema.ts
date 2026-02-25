import type { z } from 'zod';

// Runtime schemas live in the .mjs file so both Next.js (TS) and Node scripts (CJS) can import them.
// This .ts file is the typed facade (single import path for the app code).
export {
  RobotCategorySchema,
  RobotPriceModelSchema,
  RobotPriceSchema,
  RobotSchema,
  RobotsSchema,
} from './robot-schema.mjs';

import {
  RobotCategorySchema,
  RobotSchema,
  RobotsSchema,
} from './robot-schema.mjs';

export type RobotCategory = z.infer<typeof RobotCategorySchema>;
export type Robot = z.infer<typeof RobotSchema>;
export type Robots = z.infer<typeof RobotsSchema>;
