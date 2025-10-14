# Robots Data Batch 1 - 11 Brands

This document contains comprehensive robot specifications for 11 leading humanoid and quadruped robotics brands, structured according to the RobotDetailTemplate interface.

## Data Collection Date
October 14, 2025

## Brands Covered
1. Tesla
2. Figure AI
3. Agility Robotics
4. Apptronik
5. Sanctuary AI
6. 1X Technologies
7. Fourier Intelligence
8. PAL Robotics
9. Engineered Arts
10. Hanson Robotics
11. Sony

---

## 1. TESLA OPTIMUS GEN 3

### General Info
- **Manufacturer / Brand**: Tesla
- **Model Name**: Optimus Gen 3
- **Dimensions**:
  - **Standing**: 173 cm (5 ft 8 in) tall
  - **Folded**: N/A
  - **Weight**: 57 kg

### Key Features
- 28 structural actuators granting human-like movement
- 22 degrees of freedom per hand with five fingers
- Tesla on-board AI brain based on Autopilot hardware
- Walking gait and manipulation learned via reinforcement learning
- 4680 battery cells from Tesla's energy division
- Designed for factory automation and general-purpose tasks
- Planned deployment of 5,000 units in Tesla factories during 2025
- Target long-term price of around $20,000 per unit

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 28 structural actuators + 22 DoF per hand
- **Payload Capacity**: Approximately 20 kg
- **Battery Capacity & Runtime**: 2.3 kWh onboard battery, 10-12 hours on a single charge
- **Charger**: Standard charging (specifications not publicly available)
- **Sensors Included**:
  - Eight autopilot cameras for visual perception
  - Tactile sensors on fingertips for force and position sensing
  - Foot force/torque sensors for balance and gait control
  - Ultrasonic and proximity sensors for environment awareness
- **Interfaces**: Tesla Autopilot hardware integration, AI control system

### Software – Ecosystem
- **ROS/ROS2 Support**: Custom Tesla software stack (not ROS-based)
- **SDK Languages**: Proprietary Tesla development environment
- **Open-source Repos / Community**: No public repositories
- **AI Frameworks Supported**: Tesla's proprietary AI framework (neural networks trained via reinforcement learning)
- **API Documentation Quality**: Not publicly available (internal development only)

### Supplier Reliability
- **Warranty**:
  - **Duration**: TBD (planned for 2026 commercial release)
  - **Coverage**: Standard Tesla warranty terms (to be announced)
- **Post-sales Support**: Tesla service network (to be expanded for robotics)
- **Track Record**: Tesla's proven track record in automotive AI and manufacturing at scale. Company has deep expertise in battery technology, AI, and mass production.

### High-Resolution Photos
- N/A (would need official Tesla press kit images)

---

## 2. FIGURE AI - FIGURE 02

### General Info
- **Manufacturer / Brand**: Figure AI
- **Model Name**: Figure 02
- **Dimensions**:
  - **Standing**: 168 cm (5 ft 6 in) tall
  - **Folded**: N/A
  - **Weight**: 70 kg

### Key Features
- 16 degrees of freedom per hand with human-equivalent strength
- 400% faster in manufacturing tasks compared to Figure 01
- Successfully tested at BMW Plant Spartanburg performing sheet metal fitting
- Deployed in real production environments at BMW factories
- Multi-modal interaction and 3D vision capabilities
- Force-torque sensors providing sense of touch
- Designed for industrial manufacturing and logistics

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 16 DoF per hand (total body DoF not specified)
- **Payload Capacity**: 20 kg (hands can carry up to 25 kg / 55 lbs)
- **Battery Capacity & Runtime**: 5 hours runtime (50% improvement over Figure 01)
- **Charger**: Standard charging system
- **Sensors Included**:
  - 6 cameras for environmental perception
  - Force-torque sensors in hands for touch feedback
  - Built-in speakers and microphones for communication
  - 3D vision for object recognition and spatial awareness
- **Interfaces**: Ethernet, wireless communication, industrial control systems

### Software – Ecosystem
- **ROS/ROS2 Support**: Custom software stack with industry-standard interfaces
- **SDK Languages**: Python, C++
- **Open-source Repos / Community**: No public repositories
- **AI Frameworks Supported**: Proprietary Figure AI, integration with OpenAI models
- **API Documentation Quality**: Available to commercial partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: Commercial warranty terms (1-2 years typical)
  - **Coverage**: Hardware defects, software updates
- **Post-sales Support**: Dedicated support team for BMW and commercial partners
- **Track Record**: Successfully deployed at BMW Spartanburg plant. Multiple Figure 02 robots working 10 hours/day, 5 days/week. Company valued at $2.6B with backing from Jeff Bezos, Microsoft, OpenAI, NVIDIA, and Intel.

### High-Resolution Photos
- N/A (would need official Figure AI press kit images)

---

## 3. FIGURE AI - FIGURE 03

### General Info
- **Manufacturer / Brand**: Figure AI
- **Model Name**: Figure 03
- **Dimensions**:
  - **Standing**: 168 cm (5 ft 6 in) tall
  - **Folded**: N/A
  - **Weight**: 63.7 kg (9% lighter than Figure 02)

### Key Features
- Wireless inductive charging capability
- Ultra-sensitive tactile sensors (detect forces as small as 3 grams)
- 60% wider field of view per camera
- Cameras capture twice as many frames per second vs previous model
- Redesigned hands with cameras and tactile sensors in palms
- Moving joints are smaller and stronger
- Components are 90% cheaper to manufacture
- Designed for home and everyday environments
- Near-continuous operation capability

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: Enhanced from Figure 02 (specific DoF not disclosed)
- **Payload Capacity**: Similar to Figure 02 (~20-25 kg estimated)
- **Battery Capacity & Runtime**: 2.3 kWh battery, 5 hours runtime at peak performance
- **Charger**: 2 kW wireless inductive charging
- **Sensors Included**:
  - Enhanced camera suite with 60% wider field of view
  - Ultra-sensitive fingertip sensors (3-gram detection threshold)
  - Palm-mounted cameras in hands
  - Higher frame rate cameras (2x faster capture)
  - Force/torque sensors throughout body
- **Interfaces**: Wireless charging interface, standard communication protocols

### Software – Ecosystem
- **ROS/ROS2 Support**: Custom software with industry compatibility
- **SDK Languages**: Python, C++
- **Open-source Repos / Community**: No public repositories
- **AI Frameworks Supported**: Proprietary Figure AI with Helix AI system, OpenAI integration
- **API Documentation Quality**: Available to commercial and research partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: TBD for consumer release
  - **Coverage**: Hardware and software support
- **Post-sales Support**: Figure AI support network (expanding for home deployments)
- **Track Record**: Built on proven Figure 02 platform. Production-ready design optimized for manufacturing at scale.

### High-Resolution Photos
- N/A (would need official Figure AI press kit images)

---

## 4. AGILITY ROBOTICS - DIGIT

### General Info
- **Manufacturer / Brand**: Agility Robotics
- **Model Name**: Digit
- **Dimensions**:
  - **Standing**: 175 cm (5 ft 9 in) tall
  - **Folded**: N/A
  - **Weight**: 37-42 kg (reports vary)

### Key Features
- First company to build dedicated humanoid robot manufacturing facility (RoboFab)
- Manufacturing capacity of 10,000 units per year
- Deployed at Amazon fulfillment centers for tote recycling
- Autonomous docking and charging without human intervention
- Four degree-of-freedom arms for manipulation
- Lidar and depth cameras for navigation
- Designed specifically for warehouse automation and logistics
- Bipedal walking capability for human-designed spaces

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 16 total (4-DoF arms, 2-DoF feet)
- **Payload Capacity**: 16 kg (35 lbs)
- **Battery Capacity & Runtime**: 4-5 hours per charge with autonomous recharging
- **Charger**: Automatic docking and charging station
- **Sensors Included**:
  - Lidar for spatial mapping and navigation
  - Four Intel RealSense depth cameras
  - MEMS IMU (Inertial Measurement Unit)
  - Stereo and RGB cameras for object recognition
  - Proximity and force sensors for safe interaction
  - Joint encoders for precise motion control
- **Interfaces**: Ethernet, Wi-Fi, warehouse management system integration

### Software – Ecosystem
- **ROS/ROS2 Support**: ROS2-compatible
- **SDK Languages**: Python, C++, ROS
- **Open-source Repos / Community**: Limited public repositories, research partnerships
- **AI Frameworks Supported**: TensorFlow, PyTorch, custom perception algorithms
- **API Documentation Quality**: Available to commercial partners and research institutions

### Supplier Reliability
- **Warranty**:
  - **Duration**: Commercial warranty (1-2 years typical)
  - **Coverage**: Hardware components, software updates, maintenance
- **Post-sales Support**: Dedicated support team, RoboFab service center, Amazon partnership support
- **Track Record**: Successfully deployed at Amazon fulfillment centers and GXO Logistics/Spanx warehouse in Georgia. First humanoid with dedicated 10,000 unit/year manufacturing facility.

### High-Resolution Photos
- N/A (would need official Agility Robotics press kit images)

---

## 5. APPTRONIK - APOLLO

### General Info
- **Manufacturer / Brand**: Apptronik
- **Model Name**: Apollo
- **Dimensions**:
  - **Standing**: 173 cm (5 ft 8 in) tall
  - **Folded**: N/A
  - **Weight**: 72.6 kg (160 lbs)

### Key Features
- Developed from NASA Valkyrie robot heritage
- Hot swappable battery packs for continuous operation
- Stereoscopic cameras as eyes
- E Ink expressive display for face/mouth
- OLED chest display for human co-worker communication
- Force sensing for safe human proximity operation
- Slows down or stops when near humans
- Designed for automotive manufacturing and logistics
- Modular design based on NASA legged robot research

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: Not specifically disclosed (proprietary linear actuator system)
- **Payload Capacity**: 25 kg (55 lbs)
- **Battery Capacity & Runtime**: 4 hours per battery pack, hot swappable for continuous operation
- **Charger**: Quick-change battery system
- **Sensors Included**:
  - Stereoscopic cameras for depth perception
  - Vision perception systems
  - Force sensing throughout body
  - Proximity sensors for human safety
  - Torque sensors in joints
- **Interfaces**: E Ink facial display, OLED chest display, wireless communication, industrial protocols

### Software – Ecosystem
- **ROS/ROS2 Support**: ROS2-compatible
- **SDK Languages**: Python, C++, ROS
- **Open-source Repos / Community**: Limited public repositories, research partnerships
- **AI Frameworks Supported**: TensorFlow, PyTorch, NVIDIA AI frameworks
- **API Documentation Quality**: Available to commercial partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: Commercial warranty terms
  - **Coverage**: Hardware, software, battery system
- **Post-sales Support**: Apptronik support team, partnership with Mercedes-Benz, Amazon, Walmart, and Jabil
- **Track Record**: Built on NASA Valkyrie heritage with over 10 previous robots developed. Testing at Mercedes-Benz facility in Hungary. Raised $522M with partnerships from Amazon, Mercedes-Benz, Walmart, and Jabil.

### High-Resolution Photos
- N/A (would need official Apptronik press kit images)

---

## 6. SANCTUARY AI - PHOENIX

### General Info
- **Manufacturer / Brand**: Sanctuary AI
- **Model Name**: Phoenix (6th generation)
- **Dimensions**:
  - **Standing**: 170 cm (5 ft 7 in) tall
  - **Folded**: N/A
  - **Weight**: 70 kg (155 lbs)

### Key Features
- Powered by Carbon™ AI cognitive architecture
- Most sensor-rich and physically capable humanoid when released
- Hands with 20 degrees of freedom rivaling human dexterity
- Proprietary haptic technology mimicking human sense of touch
- Can be supervised and teleoperated by humans
- Combines symbolic/logical reasoning with LLMs and deep learning
- Simulates human brain subsystems including memory and sensory perception
- Designed for general-purpose work in various industries

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 20 DoF in hands (total body DoF not fully disclosed)
- **Payload Capacity**: 25 kg (55 lbs)
- **Battery Capacity & Runtime**: Not publicly disclosed
- **Charger**: Standard charging system
- **Sensors Included**:
  - Proprietary haptic sensors in hands
  - Vision systems for perception
  - Force/torque sensors
  - Tactile feedback sensors mimicking human touch
  - Multi-modal sensor arrays
- **Interfaces**: Teleoperation interface, wireless communication, industrial protocols

### Software – Ecosystem
- **ROS/ROS2 Support**: Custom Carbon™ AI platform with standard interfaces
- **SDK Languages**: Python, C++
- **Open-source Repos / Community**: No public repositories
- **AI Frameworks Supported**: Carbon™ AI (proprietary), integrates LLMs, deep learning, reinforcement learning
- **API Documentation Quality**: Available to commercial and research partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: Commercial warranty terms
  - **Coverage**: Hardware, software, AI platform updates
- **Post-sales Support**: Sanctuary AI support team
- **Track Record**: Leading Canadian robotics company. Sixth generation humanoid robot. Mission to deploy millions of industrial-grade humanoid robots. Combines advanced AI cognition with physical embodiment.

### High-Resolution Photos
- N/A (would need official Sanctuary AI press kit images)

---

## 7. 1X TECHNOLOGIES - NEO GAMMA

### General Info
- **Manufacturer / Brand**: 1X Technologies
- **Model Name**: NEO Gamma (also NEO Beta)
- **Dimensions**:
  - **Standing**: 165 cm (5 ft 5 in) tall
  - **Folded**: N/A
  - **Weight**: 30 kg (66 lbs)

### Key Features
- Biologically-inspired design for home environments
- Backed by OpenAI
- Can lift 75 kg in deadlift/squat position
- Four microphones with beamforming and echo cancellation
- Designed specifically for home assistant tasks
- Most realistic AI-powered humanoid for home use
- Sophisticated navigation in complex home environments
- Target price around $20,000 (comparable to economical car)

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: Not specifically disclosed
- **Payload Capacity**: 20 kg (44 lbs) carrying capacity, 75 kg (165 lbs) lift capacity
- **Battery Capacity & Runtime**: 2-4 hours per charge
- **Charger**: Standard charging system
- **Sensors Included**:
  - Sophisticated cameras for navigation
  - Four microphones (front, back, left, right) with beamforming
  - Echo cancellation technology
  - Obstacle avoidance sensors
  - Vision systems for object recognition
- **Interfaces**: Wi-Fi, voice control, app integration, smart home compatibility

### Software – Ecosystem
- **ROS/ROS2 Support**: Custom software stack
- **SDK Languages**: Python, proprietary 1X SDK
- **Open-source Repos / Community**: Limited public repositories
- **AI Frameworks Supported**: OpenAI integration, proprietary 1X AI
- **API Documentation Quality**: Limited public documentation, partner access available

### Supplier Reliability
- **Warranty**:
  - **Duration**: TBD for consumer release
  - **Coverage**: Hardware and software support
- **Post-sales Support**: 1X Technologies support network (expanding for home deployments)
- **Track Record**: Norwegian-American startup backed by OpenAI. NEO Beta in home trials. EVE model available at $24K for commercial security and frontline services. Raised $100M Series B funding.

### High-Resolution Photos
- N/A (would need official 1X Technologies press kit images)

---

## 8. FOURIER INTELLIGENCE - GR-1

### General Info
- **Manufacturer / Brand**: Fourier Intelligence
- **Model Name**: GR-1 (First Generation)
- **Dimensions**:
  - **Standing**: 165 cm (5 ft 5 in) tall
  - **Folded**: N/A
  - **Weight**: 55 kg (121 lbs)

### Key Features
- 40 degrees of freedom throughout body
- 11 degrees of freedom in robotic hands
- Peak torque of 300 Nm at hip
- 360-degree view capability with 6 RGB cameras
- Production capacity of 5,000 units per year
- Deployed in Chinese Tier-1 hospitals
- Deployed in European automotive factories
- Rehabilitation robotics heritage

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 40 DoF body + 11 DoF hands = 51 total
- **Payload Capacity**: 50 kg (110 lbs)
- **Battery Capacity & Runtime**: Not specifically disclosed
- **Charger**: Standard charging system
- **Sensors Included**:
  - Six RGB cameras providing 360-degree view
  - Depth cameras in head and torso
  - Force/torque sensors
  - Joint position sensors
- **Interfaces**: Ethernet, wireless communication, industrial control systems

### Software – Ecosystem
- **ROS/ROS2 Support**: ROS2-compatible
- **SDK Languages**: Python, C++, ROS
- **Open-source Repos / Community**: Limited public repositories
- **AI Frameworks Supported**: TensorFlow, PyTorch, custom perception algorithms
- **API Documentation Quality**: Available to commercial and research partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: Commercial warranty (1-2 years typical)
  - **Coverage**: Hardware components, software updates
- **Post-sales Support**: Fourier Intelligence support network in Asia and Europe
- **Track Record**: Rehabilitation robotics leader dominating Asian market. Production capacity of 5,000 units/year. Successfully deployed in Chinese Tier-1 hospitals and European automotive factories.

### High-Resolution Photos
- N/A (would need official Fourier Intelligence press kit images)

---

## 9. FOURIER INTELLIGENCE - GR-2

### General Info
- **Manufacturer / Brand**: Fourier Intelligence
- **Model Name**: GR-2 (Next Generation)
- **Dimensions**:
  - **Standing**: 175 cm (5 ft 9 in) tall
  - **Folded**: N/A
  - **Weight**: 63 kg

### Key Features
- 53 degrees of freedom throughout body
- 12-DoF hands with 6 array-type tactile sensors
- Peak torque exceeding 380 Nm (280 ft-lbs)
- Detachable battery with 2x capacity of GR-1
- Real-time grasp modification based on tactile feedback
- Can identify materials and shapes of objects
- Deployed at SAIC-GM automotive facility in China
- Sufficient torque to lift patients and operate industrial tools

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 53 total (including 12-DoF hands)
- **Payload Capacity**: 3 kg single-arm load capacity (designed for precision vs heavy loads)
- **Battery Capacity & Runtime**: 2 hours runtime, double capacity vs GR-1
- **Charger**: Detachable battery system
- **Sensors Included**:
  - Six array-type tactile sensors in hands
  - Force sensors for material identification
  - Shape detection sensors
  - Cameras and depth sensors
  - Real-time tactile feedback system
- **Interfaces**: Ethernet, wireless communication, automotive manufacturing protocols

### Software – Ecosystem
- **ROS/ROS2 Support**: ROS2-compatible
- **SDK Languages**: Python, C++, ROS
- **Open-source Repos / Community**: Limited public repositories
- **AI Frameworks Supported**: TensorFlow, PyTorch, proprietary tactile AI
- **API Documentation Quality**: Available to commercial partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: Commercial warranty terms
  - **Coverage**: Hardware, software, battery system
- **Post-sales Support**: Fourier Intelligence support network, automotive industry partnerships
- **Track Record**: Built on proven GR-1 platform. Successfully deployed at SAIC-GM automotive facility. Enhanced capabilities for industrial and healthcare applications.

### High-Resolution Photos
- N/A (would need official Fourier Intelligence press kit images)

---

## 10. PAL ROBOTICS - TALOS

### General Info
- **Manufacturer / Brand**: PAL Robotics
- **Model Name**: TALOS
- **Dimensions**:
  - **Standing**: 175 cm (5 ft 9 in) tall
  - **Folded**: N/A
  - **Weight**: 95 kg

### Key Features
- 32 degrees of freedom throughout body
- 6 kg payload per arm at full extension
- Can handle heavy tools for drilling and riveting
- Full torque sensor feedback in all joints
- Advanced Navigation Orientus IMU/AHRS (1 KHz measurement)
- Designed for Industry 4.0 applications
- Can walk at 3 km/h
- Torque control at 2 kHz low latency
- Used by multiple research institutions for AI and ML research

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 32 total (6-DoF legs, 7-DoF arms, 1-DoF hands, 2-DoF neck, 2-DoF waist)
- **Payload Capacity**: 6 kg per arm at full extension
- **Battery Capacity & Runtime**: 1080 Wh Lithium-Ion, 1.5 hours walking / 3 hours standby
- **Charger**: Lithium-Ion charging system, maximum discharge +100A
- **Sensors Included**:
  - Four 6-axis Force/Torque sensors (ankles and wrists)
  - Full torque sensor feedback in all joints
  - Encoders in all joints
  - IMU (Inertial Measurement Unit)
  - Temperature sensors throughout
  - Orientus IMU/AHRS (1 KHz frequency, low latency)
- **Interfaces**: ROS Control, Ethernet, research-grade interfaces

### Software – Ecosystem
- **ROS/ROS2 Support**: Full ROS/ROS2 support via ros_control
- **SDK Languages**: Python, C++, ROS
- **Open-source Repos / Community**: Active research community, multiple universities
- **AI Frameworks Supported**: TensorFlow, PyTorch, all major AI frameworks
- **API Documentation Quality**: Extensive documentation for research community

### Supplier Reliability
- **Warranty**:
  - **Duration**: Research/commercial warranty (customizable)
  - **Coverage**: Hardware components, software support
- **Post-sales Support**: PAL Robotics technical support team, research community
- **Track Record**: Barcelona-based specialist in research and industrial humanoids. TALOS used by Inria and other prestigious research institutions. 32-DOF design ideal for complex manipulation and locomotion research.

### High-Resolution Photos
- N/A (would need official PAL Robotics press kit images)

---

## 11. ENGINEERED ARTS - AMECA

### General Info
- **Manufacturer / Brand**: Engineered Arts
- **Model Name**: Ameca
- **Dimensions**:
  - **Standing**: 187 cm (6 ft 2 in) tall
  - **Folded**: N/A
  - **Weight**: 49 kg

### Key Features
- 61 degrees of freedom (27 DoF for facial expressions alone)
- Can emulate more than 60 facial expressions
- Stunningly lifelike facial expressions
- Binocular eye-mounted cameras with facial recognition
- Can blink, yawn, scratch nose, and react to personal space
- Embedded microphones for conversation
- Popular in exhibitions, research labs, and media productions
- Designed for entertainment, education, and customer engagement
- Natural human-robot interaction platform

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 61 total (27 DoF for facial expressions, remaining for body)
- **Payload Capacity**: Not applicable (designed for expression and interaction, not manipulation)
- **Battery Capacity & Runtime**: Not publicly disclosed
- **Charger**: Standard charging system
- **Sensors Included**:
  - Binocular eye-mounted cameras for depth perception
  - Chest camera for environmental awareness
  - Embedded microphones for audio input
  - Facial recognition software
  - Touch sensors (implied for personal space reaction)
- **Interfaces**: Audio input/output, video feeds, facial recognition API, network connectivity

### Software – Ecosystem
- **ROS/ROS2 Support**: Custom Engineered Arts software platform
- **SDK Languages**: Proprietary Engineered Arts SDK
- **Open-source Repos / Community**: Limited public repositories, research partnerships
- **AI Frameworks Supported**: Facial recognition AI, natural language processing, emotion detection
- **API Documentation Quality**: Available to customers and research partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: Commercial warranty terms
  - **Coverage**: Hardware components, facial actuator system
- **Post-sales Support**: Engineered Arts UK support team, global customer base
- **Track Record**: UK studio renowned for creating world's most expressive humanoid robots. Ameca featured globally in exhibitions, research labs, and media productions. Proven platform for human-robot interaction research and public engagement.

### High-Resolution Photos
- N/A (would need official Engineered Arts press kit images)

---

## 12. HANSON ROBOTICS - SOPHIA

### General Info
- **Manufacturer / Brand**: Hanson Robotics
- **Model Name**: Sophia
- **Dimensions**:
  - **Standing**: 167 cm (5 ft 6 in) tall
  - **Folded**: N/A
  - **Weight**: 20 kg

### Key Features
- 83 degrees of freedom (36 in head/neck, 15 per arm/hand, 3 in torso, 14 in mobile base)
- Can emulate more than 60 facial expressions
- Patented Frubber (flesh rubber) skin resembling human skin
- First robot granted citizenship (Saudi Arabia, 2017)
- UN Development Programme's first Innovation Champion
- Over 30 motors in head for expressions
- Intel RealSense cameras in eyes
- Powered by Hanson AI SDK

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 83 total (36 head/neck, 15 per arm, 3 torso, 14 mobile base)
- **Payload Capacity**: Not specified (designed for expression and social interaction)
- **Battery Capacity & Runtime**: Not publicly disclosed
- **Charger**: Standard charging system
- **Sensors Included**:
  - Intel RealSense cameras in eyes
  - Custom wide-angle 1080p chest camera
  - Microphones with audio localization arrays
  - Inertial measurement units
  - Joint angle sensors in arms
  - Force sensors in arm joints
  - Touch sensors in fingers
- **Interfaces**: USB, Ethernet, Wi-Fi, facial recognition, speech recognition

### Software – Ecosystem
- **ROS/ROS2 Support**: Custom Hanson AI SDK with ROS compatibility
- **SDK Languages**: Python, C++, Hanson AI SDK
- **Open-source Repos / Community**: Limited public repositories, some research partnerships
- **AI Frameworks Supported**: Hanson AI SDK, natural language processing, facial recognition, visual tracking
- **API Documentation Quality**: Available through Hanson AI SDK to partners

### Supplier Reliability
- **Warranty**:
  - **Duration**: R&D version warranty terms
  - **Coverage**: Hardware components, Frubber skin, AI software
- **Post-sales Support**: Hanson Robotics support team (Hong Kong-based)
- **Track Record**: World's most famous humanoid robot. Granted Saudi Arabian citizenship (first robot with legal personhood). UN Development Programme Innovation Champion. Global media presence. Proven platform for social robotics research and public engagement.

### High-Resolution Photos
- N/A (would need official Hanson Robotics press kit images)

---

## 13. SONY - AIBO ERS-1000

### General Info
- **Manufacturer / Brand**: Sony
- **Model Name**: Aibo ERS-1000
- **Dimensions**:
  - **Standing**: 180 × 293 × 305 mm (7.1 × 11.5 × 12 inches)
  - **Folded**: N/A (quadruped)
  - **Weight**: 2.2 kg (4.9 lbs)

### Key Features
- 22 degrees of freedom for natural dog-like movement
- Cloud-based AI with LTE SIM card
- Can recognize up to 100 faces
- Responds to over 50 voice commands
- Learns customizable tricks
- Adaptive personality development through interaction
- Two cameras (front for recognition, SLAM for mapping)
- Most sophisticated autonomous companion robot
- Consumer robot dog platform since 1999

### Hardware – Build Quality
- **Total Degrees of Freedom (DoF)**: 22 total (3 DoF head, 1 DoF mouth, 1 DoF neck, 1 DoF waist, 3 DoF × 4 legs/paws, 1 DoF × 2 ears, 2 DoF tail)
- **Payload Capacity**: N/A (companion robot, not designed for carrying loads)
- **Battery Capacity & Runtime**: ~2 hours per charge, 3 hours charging time, 2-5 year battery lifespan
- **Charger**: Charging station, approximately 14W power consumption
- **Sensors Included**:
  - Time-of-flight sensor
  - Two IR range sensors
  - Four microphones with beamforming
  - Capacitive touch sensors (back, head, jaw)
  - Two 6-axis motion sensors (head and torso)
  - Motion sensor
  - Light sensor
  - Four paw pad contact sensors
  - Two cameras (front recognition camera, SLAM camera)
- **Interfaces**: LTE SIM card, Wi-Fi, cloud services, smartphone app

### Software – Ecosystem
- **ROS/ROS2 Support**: Proprietary Sony software (not ROS-based)
- **SDK Languages**: Limited SDK (primarily cloud-based AI)
- **Open-source Repos / Community**: Research community with limited public access
- **AI Frameworks Supported**: Sony proprietary AI, cloud-based machine learning
- **API Documentation Quality**: Limited public API, cloud service documentation for users

### Supplier Reliability
- **Warranty**:
  - **Duration**: Standard Sony consumer warranty (1 year typical)
  - **Coverage**: Hardware defects, battery replacement
- **Post-sales Support**: Sony customer support, cloud service subscription
- **Track Record**: Pioneering consumer robot dog since 1999. Multiple generations of Aibo demonstrating Sony's long-term commitment. Most sophisticated autonomous companion robot with AI personality development. Global customer base with active user community.

### High-Resolution Photos
- N/A (would need official Sony press kit images)

---

## Notes

### Data Sources
All specifications were gathered from web searches, official product pages, press releases, and reputable robotics news sources as of October 2025.

### Missing Data
- High-resolution photos for all robots (would require official press kit access)
- Some battery specifications not publicly disclosed
- Some warranty terms pending commercial release
- Detailed ROS support levels vary by manufacturer

### Next Steps
1. Obtain official high-resolution images from each manufacturer
2. Verify specifications with manufacturer technical documentation
3. Convert this data to JSON format for website integration
4. Add specific image URLs once obtained
5. Create individual robot data entries in robots.json
6. Link robots to their respective brands
7. Add robots to appropriate categories (humanoid/quadruped)

### Pricing Information (where available)
- Tesla Optimus Gen 3: ~$20,000 target
- Figure robots: Commercial pricing (not public)
- Agility Robotics Digit: ~$250,000 estimated
- Apptronik Apollo: Commercial pricing (not public)
- 1X Technologies NEO: ~$20,000 target
- Sony Aibo: Consumer pricing available on Sony website

### Commercial Deployments
- Figure 02: BMW Plant Spartanburg
- Digit: Amazon fulfillment centers, GXO Logistics/Spanx warehouse
- Apollo: Mercedes-Benz facility in Hungary
- Fourier GR-1/GR-2: Chinese hospitals, SAIC-GM automotive facility, European automotive factories
- Tesla Optimus: Planned 5,000 units in Tesla factories (2025)
