---
title: "Soft Robots Gain Human-Like Intelligence: How SMART and NUS Are Redefining Adaptability in Robotics"
slug: "soft-robotics-neural-ai-breakthrough-smart-nus"
date: "2026-02-08"
author: "bob-jiang"
category: "tutorials"
tags: ["soft robotics", "AI control systems", "neural networks", "adaptive robotics", "SMART", "NUS", "MIT"]
excerpt: "Researchers from SMART and NUS have developed a brain-inspired AI control system that enables soft robots to learn tasks once and adapt in real-time without retraining—bringing human-like intelligence to flexible machines."
featured: true
published: true
seo:
  title: "Soft Robots Gain Human-Like Intelligence: SMART/NUS AI Breakthrough"
  description: "SMART and NUS researchers develop neural-inspired AI that enables soft robots to learn once and adapt instantly—no retraining needed. A major breakthrough for real-world robotics applications."
  keywords: ["soft robotics", "AI control systems", "neural networks", "adaptive robotics", "SMART", "NUS", "MIT", "structural synapses", "plastic synapses"]
---

## Introduction

Imagine a robotic arm that can shower assistance for elderly patients, delicately handle fresh produce on a farm, or seamlessly switch from assembly line tasks to medical procedures—all without being reprogrammed. This isn't science fiction anymore. Researchers from Singapore-MIT Alliance for Research and Technology (SMART) and National University of Singapore (NUS) have achieved a breakthrough that brings soft robots one giant leap closer to human-like adaptability.

Their innovation? A brain-inspired AI control system that enables soft robotic arms to **learn a wide repertoire of motions once, then adjust to new scenarios on the fly** without needing retraining or sacrificing stability. Published in *Science Advances*, this research fundamentally redefines what's possible in soft robotics—paving the way for intelligent, versatile machines that can safely operate in unpredictable real-world environments.

## The Fundamental Challenge: Why Soft Robots Are So Hard to Control

### What Makes Soft Robots Different?

Unlike conventional robots built with rigid motors and joints, **soft robots are made from flexible materials like soft rubber** and use specialized actuators that function like artificial muscles. This compliance gives them remarkable advantages:

- **Safe human interaction:** Their flexibility makes them inherently safer around people—no hard edges or rigid collisions
- **Adaptive grasping:** They can conform to objects of varying shapes and sizes
- **Delicate manipulation:** Perfect for handling fragile items or working with biological tissue

### The Control Nightmare

But these benefits come with a massive control challenge: **soft robots deform unpredictably**. Their shape changes constantly depending on forces, loads, material fatigue, and environmental conditions. Even small disturbances—a gust of wind, a shift in weight, a minor actuator failure—can throw off their movements entirely.

Traditional robotics frameworks, which rely on rigid-body kinematics and discrete joint control, simply don't apply. Soft robots need something fundamentally different.

According to a recent systematic review in the *Journal of Bionic Engineering*, "Conventional robotics frameworks are often inadequate for accurately representing the dynamic behavior of soft robots. As a result, innovative interdisciplinary methodologies have emerged, drawing from materials science, continuum mechanics, computational physics, and artificial intelligence."

### The Three-Way Trade-Off

Until now, soft robot controllers have struggled to achieve three critical capabilities simultaneously:

1. **Generalization:** Applying what they learned from one task to perform different tasks
2. **Online adaptation:** Quickly adjusting when conditions change in real-time
3. **Stability guarantees:** Maintaining safe, controlled behavior during adaptation

Most existing approaches could achieve one or two of these—but not all three. This limitation has been the primary barrier preventing soft robots from moving beyond research labs into real-world applications.

## The Breakthrough: A Neural Blueprint for Soft Robot Intelligence

### Inspiration from the Human Brain

The SMART/NUS team took a radically different approach: **they looked to the human brain for inspiration**. The result is an AI control system that mimics how biological neurons learn and adapt through synaptic connections.

Associate Professor Zhiqiang Tang, first and co-corresponding author of the paper, explains: "This new AI control system is one of the first general soft-robot controllers that can achieve all three key aspects needed for soft robots to be used in society and various industries. It can apply what it learned offline across different tasks, adapt instantly to new conditions and remain stable throughout—all within one control framework."

### The Two-Synapse Architecture

The system uses two complementary types of "synapses"—connections that adjust how the robot moves—working in tandem:

#### 1. Structural Synapses (The Foundation)

- **Trained offline** on a variety of foundational movements (bending, extending, twisting)
- Form the robot's **built-in skills**
- Provide a strong, stable baseline for all operations
- Like muscle memory in humans—deeply ingrained patterns learned through practice

#### 2. Plastic Synapses (Real-Time Adaptation)

- **Continually update online** as the robot operates
- Fine-tune behavior to respond to current conditions
- Enable instant adaptation to unexpected changes
- Like conscious adjustments humans make when conditions shift

### The Safety Net: Built-In Stability Guarantees

Critically, the system includes a **built-in stability measure** that acts as a safeguard. Even as the robot adjusts its behavior during online adaptation, its movements remain smooth and controlled. This is the key innovation that previous approaches lacked—the ability to adapt quickly **without sacrificing safety**.

Professor Daniela Rus, Co-lead Principal Investigator at M3S and Director of MIT's Computer Science and Artificial Intelligence Laboratory (CSAIL), emphasizes the significance: "Soft robots hold immense potential to take on tasks that conventional machines simply cannot, but true adoption requires control systems that are both highly capable and reliably safe. By combining structural learning with real-time adaptiveness, we've created a system that can handle the complexity of soft materials in unpredictable environments."

## Impressive Real-World Performance

### Multi-Platform Validation

The team didn't just test their system in simulation—they validated it on **two distinct physical platforms**:

1. **Cable-driven soft arm:** Uses cables to pull and shape the robot
2. **Shape-memory-alloy (SMA) actuated soft arm:** Uses smart materials that change shape with temperature

The system worked across both platforms, demonstrating true **cross-platform generalization**—a critical requirement for real-world deployment.

### The Numbers Speak for Themselves

The results are remarkable:

- **44-55% reduction in tracking error** under heavy disturbances compared to previous methods
- **Over 92% shape accuracy** when dealing with payload changes, airflow disturbances, and actuator failures
- **Stable performance even when 50% of actuators failed**—demonstrating incredible robustness

In one demonstration, a 160-gram soft robotic arm with a 37.2-gram soft gripper successfully performed pick-and-place tasks with a 56.4-gram object. The combined payload was **58.5% of the arm's mass**—a substantial load that would cause traditional soft robot controllers to fail.

### Anti-Disturbance Testing

In anti-disturbance tests, the team challenged the soft arm under both fixed and continuously changing fan speeds. Even under the most challenging scenario, the arm achieved its target shape with **93.8% accuracy**. This level of robustness is unprecedented in soft robotics.

## Real-World Applications: From Healthcare to Manufacturing

Professor Cecilia Laschi, Principal Investigator at M3S and Director of the Advanced Robotics Centre at NUS, describes the paradigm shift: "We've shifted the paradigm from task-specific tuning and capabilities toward a truly generalizable framework with human-like intelligence. It is a breakthrough that opens the door to scalable, intelligent soft machines capable of operating in real-world environments."

### Healthcare and Assistive Robotics

The most immediate applications are in healthcare:

- **Assistive devices for elderly care:** Soft arms that can safely help with showering, dressing, and daily activities—supporting people with limited mobility and easing caregiver burden
- **Rehabilitation robots:** Devices that automatically tailor their movements to a patient's changing strength, range of motion, or recovery progress
- **Wearable medical robots:** Systems that can respond more sensitively to individual needs, improving safety and patient outcomes

The key advantage? **Safe human contact.** Unlike rigid robots that could injure people, soft robots can operate in close proximity to the human body without causing discomfort or harm.

### Manufacturing and Logistics

Beyond healthcare, this technology enables:

- **Adaptive manufacturing:** Robots that can handle different parts and products without reprogramming—reducing downtime and setup costs
- **Delicate object handling:** Ideal for fresh produce, electronics, or any fragile items that rigid grippers would damage
- **Inspection in confined spaces:** Soft robots that can deform to access tight areas for quality control

### Medical Robotics

In surgical and medical contexts:

- **Minimally invasive procedures:** Soft instruments that can navigate through natural body pathways
- **Adaptive surgical tools:** Instruments that adjust their compliance based on tissue properties
- **Rehabilitation devices:** Systems that provide variable assistance levels as patients recover

## Technical Deep Dive: How Meta-Learning Enables Generalization

### The Meta-Learning Foundation

The system's ability to generalize across tasks stems from its use of **meta-learning**—a machine learning approach often called "learning to learn." During the offline training phase, the structural synapses aren't just learning specific tasks; they're learning **how to learn** new tasks quickly.

This is analogous to how humans develop general motor skills. A skilled athlete doesn't need to relearn movement from scratch for each new sport—they transfer foundational abilities like balance, timing, and coordination to novel situations.

### Embodied Intelligence in Action

The approach embodies principles of **embodied intelligence**—the idea that intelligence emerges from the interaction between body, brain, and environment. Rather than trying to perfectly model the soft robot's complex dynamics mathematically, the system learns through experience how the robot's physical properties affect its behavior.

This is why the same control framework can work across different soft robot platforms. The structural synapses capture platform-specific "motor primitives," while the plastic synapses handle real-time adjustments.

### Continuum Mechanics Meets AI

Traditional soft robot control often relies on continuum mechanics—the branch of physics that describes how continuous materials deform. These models are computationally expensive and difficult to solve in real-time.

The SMART/NUS approach sidesteps this complexity by using neural networks to implicitly learn the mapping from desired behaviors to actuator commands. The networks effectively compress the complex physics into a learned representation that's fast enough for real-time control.

## What This Means for the Future of Robotics

### Immediate Impact: Accelerating Deployment

This breakthrough removes one of the final barriers to deploying soft robots in real-world settings. With controllers that are reliable, safe, and don't require constant retuning, companies can now seriously consider soft robots for:

- Home care and eldercare services
- Food handling and agricultural automation
- Medical device innovation
- Manufacturing flexibility

### Research Directions: Higher Speeds and Complexity

The SMART/NUS team isn't stopping here. Their next steps include:

- **Extending to higher-speed operations:** Current demonstrations focus on precise, controlled movements; future work will tackle dynamic, fast motions
- **More complex environments:** Testing in cluttered, unpredictable settings with multiple disturbances
- **Integration with autonomous systems:** Combining the controller with vision systems and task planning for fully autonomous soft robots
- **Advanced medical applications:** Developing specialized versions for surgical and therapeutic contexts

### The Bigger Picture: Human-Robot Collaboration

Perhaps most importantly, this work advances the vision of **safe, seamless human-robot collaboration**. As robots gain the ability to work safely alongside people—adapting to unexpected movements, gentle in physical contact, and responsive to changing conditions—we move closer to a future where robots are true assistants rather than isolated industrial machines.

## Challenges That Remain

Despite this breakthrough, soft robotics still faces challenges:

### Material Science Limitations

- **Durability:** Soft materials can degrade over time, especially under repeated stress
- **Power density:** Current soft actuators generally produce less force than rigid motors of similar size
- **Response speed:** Many soft actuators (like pneumatics or SMAs) have slower response times than electric motors

### Sensing and Perception

While this work solves the control problem, soft robots still need better ways to sense their own state and environment. Developing soft, integrated sensors that don't interfere with the robot's compliance remains an active research area.

### Scalability and Cost

Manufacturing soft robots at scale with consistent properties is more challenging than mass-producing rigid robots. As the technology matures, production methods and costs will need to improve for widespread adoption.

## Conclusion: A Paradigm Shift in Robotics

The SMART/NUS breakthrough represents more than just an incremental improvement—it's a fundamental paradigm shift. By drawing inspiration from neuroscience and combining structural learning with online adaptation, the team has created a control framework that finally matches the unique capabilities of soft robots with the intelligence needed to deploy them in the real world.

As Professor Rus noted, "We've removed the final hardware barriers to truly autonomous AI" in soft systems. With control systems that are capable, safe, and adaptive, soft robots can now move from research curiosities to practical tools that improve lives—whether helping elderly patients maintain independence, enabling safer industrial automation, or advancing medical care.

The next decade will likely see soft robotics transform from a niche academic field into a major category of commercial robotics. And when that transformation happens, we'll look back at this work from SMART and NUS as one of the key enabling breakthroughs that made it possible.

---

**Research Citation:**  
Tang, Z., et al. (2026). "A general soft robotic controller inspired by neuronal structural and plastic synapses that adapts to diverse arms, tasks, and perturbations." *Science Advances*. 

**Institutions Involved:**  
Singapore-MIT Alliance for Research and Technology (SMART), National University of Singapore (NUS), Massachusetts Institute of Technology (MIT), Nanyang Technological University (NTU Singapore)

**Funding:**  
National Research Foundation Singapore under its Campus for Research Excellence and Technological Enterprise (CREATE) programme.
