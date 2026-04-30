---
title: "Awesome Robots Weekly Digest Issue 28: Production Fleets, Contact Physics, and Better Tactile Sensing"
slug: "awesome-robots-weekly-digest-issue-28-2026-05-01"
date: "2026-05-01"
author: "bob-jiang"
category: "digest"
tags: ["digest", "newsletter", "robotics", "AI", "weekly", "industry-news", "research"]
excerpt: "This week: humanoid production rates jump, airports trial humanoid labor, simulation stacks get more serious about contact physics, and tactile sensing keeps getting more deployable."
featured: false
published: true
seo:
  title: "Awesome Robots Weekly Digest Issue 28 (2026-05-01)"
  description: "Weekly digest of AI robotics: humanoid production scaling, airport deployments, contact-rich physics engines, deformable simulation, tactile sensing upgrades, and open-source robot arms."
  keywords: ["robotics weekly digest", "humanoid robots", "robot simulation", "contact-rich manipulation", "tactile sensors", "sim-to-real", "robot learning"]
---

## TL;DR

- **Humanoids are leaving the lab and entering fleet operations.** Figure says it has shipped hundreds of Figure 03 units and reached a one-per-hour production cadence.
- **Real deployments are getting mundane in a good way.** Japan Airlines is trialing humanoid robots for baggage and cargo handling at Haneda starting in May.
- **Simulation is doubling down on contact.** NVIDIA highlighted Newton 1.0 as a stable, contact-rich physics foundation; new research also pushes GPU-native deformable manipulation simulation.
- **Evaluation and sensing are maturing.** RoboLab proposes harder generalist-policy benchmarking, and XELA upgraded tactile sensing to survive factory magnet mess and scale via CAN FD.

---

## Introduction

A pattern is getting clearer every week: the robotics story is shifting from single impressive demos to **repeatable operations**.

That change forces uncomfortable questions. Can you build enough robots to matter. Can you keep them running. Can you train policies that do not crumble on contact. Can you measure real generalization instead of benchmark overfitting. And can your sensing stack handle the chaos of factories, warehouses, and airports.

This week delivered solid “infrastructure wins” across manufacturing, simulation, evaluation, and tactile sensing.

---

## Top News and Breakthroughs

### 🏭 Company News

- **Figure ramps Figure 03 production and fleet ops** — Figure says it has shipped **350+** third-generation humanoids from its BotQ facility and improved throughput from **one per day to one per hour**. The post emphasizes quality gates, end-of-line testing, yield improvements, and how a growing fleet accelerates data collection for autonomy.
  - Source: https://www.figure.ai/news/ramping-figure-03-production

- **Humanoid robots trialed for baggage handling at Tokyo Haneda** — Japan Airlines will run a multi-year experiment using humanoid robots for moving luggage and cargo on the tarmac, positioning it as a response to labor shortages and rising tourism volumes.
  - Source: https://www.theguardian.com/world/2026/apr/28/humanoid-robots-baggage-handlers-japan-airports

### 🧠 Simulation and Robot Learning Stack

- **NVIDIA spotlights Newton 1.0 and the “contact physics” layer** — NVIDIA highlighted Newton 1.0 general availability as a stable open-source physics engine aimed at accurate collision detection and realistic object contact, alongside broader Isaac Sim and Isaac Lab updates.
  - Source: https://blogs.nvidia.com/blog/national-robotics-week-2026/

---

## Research Spotlight

### 📄 Research Papers

- **FLASH: GPU-native, contact-rich deformable manipulation simulation** — FLASH proposes a GPU-native simulation framework designed for deformable object manipulation with strict contact and deformation constraints. The headline claim is fast, high-DOF simulation and **zero-shot sim-to-real transfer** for tasks like towel and garment folding.
  - arXiv: https://arxiv.org/abs/2604.17513

- **RoboLab: A higher-fidelity benchmark for task-generalist robot policies** — RoboLab argues many existing benchmarks saturate and fail to test true generalization. It introduces a framework for generating tasks and scenes and proposes a RoboLab-120 benchmark spanning visual, procedural, and relational competencies.
  - arXiv: https://arxiv.org/abs/2604.09860

---

## Event Horizon

### 🗓️ Coming Up

- **Robotics Summit and Expo (Boston, May 2026)** — multiple sensor and component vendors (including XELA) are teeing up announcements and demos.

---

## Tool or Resource of the Week

### 🎯 Featured Resource: XELA uSkin tactile sensing upgrades

XELA announced two practical upgrades to its uSkin 3D tactile sensor family:

- **Magnetic interference compensation** for environments with magnets and ferromagnetic materials
- **CAN FD support** to scale the number of sensor modules on a single bus while keeping high update rates

This is the kind of “boring hardware” progress that quietly makes dexterous manipulation more deployable outside pristine labs.

- Source: https://www.therobotreport.com/xela-robotics-adds-2-enhancements-uskin-sensor-family-ahead-robotics-summit/

---

## Community Corner

### 🛠️ Cool Projects

- **Seeed Studio reBot Arm B601-DM (open-source 6+1 DoF arm)** — A fully open-source arm designed to lower the barrier for teleoperation and embodied AI experimentation, with out-of-the-box compatibility claims for ROS 1/2, Isaac Sim, and LeRobot.
  - Source: https://www.cnx-software.com/2026/04/17/rebot-arm-b601-dm-an-open-source-61-dof-robotic-arm-for-embodied-ai-and-teleoperation-applications/

---

## Conclusion

The takeaway is not that humanoids are “solved.” It is that the ecosystem is finally putting energy into the parts that decide whether humanoids become a product category or stay a perpetual demo reel: production throughput, fleet reliability, contact physics, hard benchmarks, and sensing that survives the real world.

If you had to pick one theme for the week, it is this: **robotics is becoming an operations problem** — and that is a compliment.

---

## Stay Connected

- **Subscribe:** https://magic.beehiiv.com/v1/6fe709b7-c290-4fa5-a05b-14355504a3b1
- **Follow us:** https://x.com/awesome__robots
- **Website:** https://www.awesomerobots.xyz/
