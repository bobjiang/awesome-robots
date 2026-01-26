# New Robots Added - January 26, 2026

## Summary

Successfully added 3 new robots from the discovered robots data (`data/discovered-robots/2026-01-26.json`) to the Awesome Robots catalog. All robots now include complete specifications following the `RobotDetailTemplate.tsx` schema, with images downloaded locally.

---

## Robots Added

### 1. Moxi by Diligent Robotics

**Category:** Other Robots (Mobile Manipulator)
**ID:** `diligent-robotics-moxi`
**Official URL:** https://www.diligentrobots.com/moxi

**Key Highlights:**
- 23 DOF autonomous mobile manipulator for hospital logistics
- 24/7 operation with automatic self-docking charging
- Deployed in 25+ U.S. hospitals with 1.25+ million deliveries completed
- 15kg payload capacity for medical supplies
- SOC Type II, TX-RAMP Level 2, HIPAA compliant
- Acquired by Serve Robotics in January 2026

**Specifications:**
- Height: 152-214cm (telescopic)
- Weight: 136 kg
- Sensors: Intel RealSense, Hokuyo, LiDAR, RGB-D cameras
- Computing: Intel embedded with GPU, Ubuntu OS
- Manipulator: Kinova Jaco2 arm with Robotiq gripper
- ROS Support: Yes

**Pricing:** Robot-as-a-Service (RaaS) model, contact for quote

**Images Downloaded:**
- ✅ `/images/robots/diligent-robotics-moxi/robot-1.jpg` (214 KB)

---

### 2. Serve Robot by Serve Robotics

**Category:** Other Robots (Autonomous Delivery Robot)
**ID:** `serve-robotics-serve`
**Official URL:** https://www.serverobotics.com/

**Key Highlights:**
- Level 4 autonomous sidewalk delivery robot
- 2,000+ robots deployed across major U.S. cities
- 99.8% delivery completion rate
- 50 pounds payload capacity (6 extra-large pizzas)
- 14-hour battery life (Gen3: 48 miles range)
- Zero emissions autonomous navigation
- Fleet logs 1 million miles monthly
- Publicly traded (NASDAQ: SERV)

**Specifications:**
- Dimensions: 105cm H x 64cm W x 79cm L
- Weight: 73 kg (161 lb)
- Top Speed: 6 mph (10 km/h)
- Processor: NVIDIA Jetson Orin (Gen3)
- LiDAR: Ouster REV7 digital lidar (360°)
- Cargo Capacity: ~13 gallons

**Pricing:** Robot-as-a-Service (RaaS) model, contact for quote

**Images Downloaded:**
- ✅ `/images/robots/serve-robotics-serve/robot-1.jpg` (15 KB)

---

### 3. Abi by Andromeda Robotics

**Category:** Humanoid Robots (Companion Robot)
**ID:** `andromeda-robotics-abi`
**Official URL:** https://andromedarobotics.ai/

**Key Highlights:**
- Emotionally intelligent humanoid companion for aged care
- ChatGPT-4 powered conversational AI
- Supports 90+ languages for multilingual communication
- Facial recognition with conversation memory retention
- Adaptive personality based on individual preferences
- Deployed in Australian aged care facilities
- Valued at $100M with $19.2M funding raised
- Designed by former DreamWorks animator (inspired by Disney's Baymax)

**Specifications:**
- Height: 120 cm (~4 feet tall)
- AI Model: ChatGPT-4
- Languages: 90+ languages supported
- Mobility: Wheeled base with autonomous navigation
- Display: Screen-based face for emotional expression
- Manufacturing Cost: ~$10,000 per unit
- Production Capacity: Current 8 units/month, target 100 units/month

**Pricing:** Contact for quote (custom contracts for aged care facilities)

**Images Downloaded:**
- ✅ `/images/robots/andromeda-robotics-abi/robot-1.jpg` (133 KB)

---

## New Brands Added

Added 3 new brands to `src/data/brands.json`:

### 1. Diligent Robotics
- **Country:** USA
- **Founded:** 2017
- **Description:** Healthcare robotics company deploying autonomous mobile manipulator robots in hospitals. Founded by MIT and Georgia Tech social robotics experts, Moxi robots handle logistics tasks, completing over 1.25 million deliveries across 25+ U.S. hospitals. Acquired by Serve Robotics in January 2026.
- **Website:** https://www.diligentrobots.com/

### 2. Serve Robotics
- **Country:** USA
- **Founded:** 2017
- **Description:** Publicly traded sidewalk delivery robotics company with the largest autonomous delivery fleet in the U.S. Spun off from Postmates in 2021, deploys 2,000+ Level 4 autonomous robots for last-mile delivery with Uber Eats, DoorDash, and major retail partners. Targeting $1 per delivery cost at scale.
- **Website:** https://www.serverobotics.com/

### 3. Andromeda Robotics
- **Country:** Australia
- **Founded:** 2022
- **Description:** Australian robotics company building emotionally intelligent humanoid companions for aged care. Abi robot leverages ChatGPT-4, speaks 90+ languages, and combats loneliness in healthcare settings. Valued at $100M with $19.2M funding, deployed in Australian aged care facilities with U.S. expansion underway.
- **Website:** https://andromedarobotics.ai/

---

## Data Schema Compliance

All robots follow the complete `RobotDetailTemplate.tsx` schema with:

✅ **generalInfo:** manufacturer, modelName, dimensions (height, weight)
✅ **keyFeatures:** Array of 12+ detailed bullet points
✅ **hardwareBuildQuality:** DOF, payload, battery, sensors, interfaces
✅ **softwareEcosystem:** ROS support, SDK languages, AI frameworks, documentation quality
✅ **supplierReliability:** warranty details, post-sales support, track record
✅ **specifications:** Complete technical specs dictionary
✅ **features:** Short feature list for product cards
✅ **images:** Local image paths (downloaded from official sources)
✅ **officialUrl:** Official product or company website
✅ **description:** 2-3 sentence summary

---

## Quality Standards Met

### ✅ All Images Downloaded Locally
- No remote image URLs used
- All images stored in `/public/images/robots/[brand]-[model]/`
- Proper file naming convention: `robot-1.jpg`, `robot-2.jpg`, etc.

### ✅ Complete Specifications Research
- Researched official websites for accurate data
- Included all required fields from RobotDetailTemplate
- Marked unavailable data as "Not publicly disclosed" rather than guessing

### ✅ Proper Brand Integration
- Added new brands to `brands.json` with complete information
- Included country, founding year, and comprehensive descriptions
- Linked official websites

### ✅ Category Classification
- Moxi: "other" (mobile manipulator, hospital logistics)
- Serve Robot: "other" (wheeled delivery robot, not quadruped)
- Abi: "humanoid" (companion robot with screen-based face)

---

## Build Verification

✅ **JSON Validation:** All JSON files valid
✅ **TypeScript Compilation:** No errors
✅ **Next.js Build:** Successful (124 static pages generated)
✅ **Total Robots in Catalog:** 105 robots
✅ **Total Brands in Catalog:** 52 brands

---

## Files Modified

1. `src/data/robots.json` - Added 3 new robots
2. `src/data/brands.json` - Added 3 new brands
3. `public/images/robots/diligent-robotics-moxi/robot-1.jpg` - Downloaded
4. `public/images/robots/serve-robotics-serve/robot-1.jpg` - Downloaded
5. `public/images/robots/andromeda-robotics-abi/robot-1.jpg` - Downloaded

---

## Next Steps (Optional Enhancements)

### Additional Images
Consider downloading more product images for each robot:
- **Moxi:** Additional angles, in-hospital deployment photos
- **Serve Robot:** Gen3 detailed shots, delivery in action
- **Abi:** Multiple angles, interaction with elderly residents

### Brand Logos
Create or download brand logos for:
- `/public/images/brands/diligent-robotics-logo.svg`
- `/public/images/brands/serve-robotics-logo.svg`
- `/public/images/brands/andromeda-robotics-logo.svg`

### Blog Post
Consider creating a blog post announcement:
- "New Robots Added: Healthcare & Delivery Automation"
- Highlight Moxi's 1.25M deliveries milestone
- Showcase Serve's 2,000-robot fleet deployment
- Feature Abi's emotional intelligence and multilingual capabilities

---

## Research Sources

### Moxi by Diligent Robotics
- Official website: https://www.diligentrobots.com/moxi
- Technical specs: Standard Bots, Robots Guide
- Acquisition news: The Robot Report

### Serve Robot by Serve Robotics
- Official website: https://www.serverobotics.com/
- Press kit: Google Drive
- Technical specs: Dimensions.com, NVIDIA customer stories
- Company info: PitchBook, Golden

### Abi by Andromeda Robotics
- Official website: https://andromedarobotics.ai/
- MassRobotics article: Cohort announcement
- Company profile: SmartCompany, Stone & Chalk
- Funding news: Women's Agenda, Business News Australia

---

## Contact for Updates

If you need to add more robots from future discoveries:
1. Run `npm run fetch-articles` to collect weekly articles
2. Run `npm run extract-robots` to extract robot data
3. Research official specifications from brand websites
4. Download all images locally to `public/images/robots/[brand]-[model]/`
5. Follow the `RobotDetailTemplate.tsx` schema for complete data
6. Add brands to `brands.json` if new
7. Add robots to `robots.json` with all required fields
8. Run `npm run build` to verify

---

**Summary:** Successfully added 3 commercially deployed robots with complete specifications, local images, and proper brand integration. All quality standards met, build verified successful.
