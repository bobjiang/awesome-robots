---
title: "Two New Robots Join the Catalog: Fauna Robotics Sprout and DEWALT Robotic Drilling System"
slug: "new-robots-fauna-sprout-dewalt-drilling-2026"
author: "bob-jiang"
date: "2026-01-30"
category: "news"
tags: ["new-robots", "humanoid", "construction", "fauna-robotics", "dewalt", "august-robotics", "development-platform", "autonomous"]
excerpt: "We've added two new robots to the catalog: Fauna Robotics Sprout, a 29-DoF humanoid development platform, and the DEWALT Robotic Drilling System by August Robotics for autonomous construction."
featured: true
published: true
seo:
  title: "New Robots: Fauna Robotics Sprout Humanoid & DEWALT Drilling Robot"
  description: "Discover two new robots: the Fauna Robotics Sprout humanoid dev platform with 29 DoF and NVIDIA Jetson, and DEWALT's autonomous drilling system for data centers."
  keywords: ["fauna robotics sprout", "dewalt drilling robot", "humanoid robot", "construction robot", "august robotics", "new robots 2026", "autonomous drilling"]
---

# Two New Robots Join the Catalog: Fauna Robotics Sprout and DEWALT Robotic Drilling System

This week we're adding two very different robots to the Awesome Robots catalog. One is a lightweight humanoid built for developers and researchers exploring embodied AI. The other is an autonomous construction machine that drills concrete floors with near-perfect accuracy. Together, they highlight how robotics is advancing across both research platforms and industrial applications.

## Fauna Robotics Sprout: A Humanoid Built for Safe Interaction

Fauna Robotics, a New York-based startup, has introduced **Sprout** — a 107 cm tall, 22.7 kg humanoid development platform designed to operate safely in unstructured environments alongside people.

### What Makes Sprout Stand Out

Sprout packs **29 degrees of freedom** into a compact frame:

- **Arms:** 6 DoF each with floor-to-countertop reach
- **Legs:** 5 DoF each with compliant, low-impact locomotion
- **Neck:** 2 DoF articulated for directional gaze
- **Grippers:** 1 DoF each with rubberized interiors

The robot runs on an **NVIDIA Jetson AGX Orin** with 64GB of memory and 1TB SSD — enough onboard compute for real-time perception and decision-making without cloud dependencies. A **ZED 2i stereoscopic vision system** and four time-of-flight sensors handle depth perception and obstacle detection.

### Safety-First Design

What separates Sprout from other humanoid platforms is its emphasis on safe human interaction:

- **Soft deformable exterior panels** absorb contact forces
- **Back-drivable motors** minimize impact during unexpected collisions
- **Dedicated real-time safety subsystem** monitors and enforces constraints across all mechanical and software levels
- **Emergency stop (E-Stop)** for immediate shutdown

The robot also features a full-color 360-degree facial LED array and motorized eyebrows for non-verbal communication — useful for HRI (human-robot interaction) research. And in a charming touch, the head has a **LEGO-compatible grid** for customization with standard bricks.

### Developer-Ready Platform

Sprout ships with mapping, navigation, and voice interaction out of the box. The platform provides stable APIs and containerized services, from motor control up to high-level autonomy. A four-microphone directional array handles speech recognition and sound-source localization, while dual high-fidelity speakers enable voice responses.

The swappable battery system provides **3 to 3.5 hours of runtime**, and the entire robot weighs just 50 pounds — light enough for a single person to transport.

Fauna Robotics targets developers, enterprises, and researchers building embodied AI applications across retail, hospitality, home environments, and education. Pricing is available on request.

**[View Sprout on Awesome Robots →](/robots/fauna-robotics-sprout)**

---

## DEWALT Robotic Drilling System: Autonomous Construction at Scale

On the industrial side, **August Robotics** has partnered with **DEWALT** (Stanley Black & Decker) to create the world's first downward-drilling, fleet-capable autonomous construction robot.

### The Problem It Solves

Data center construction requires drilling thousands of holes in concrete floors for cable routing, server rack mounting, and infrastructure. Traditionally, this involves weeks of manual layout and drilling. The DEWALT Robotic Drilling System compresses **8 to 9 weeks of manual layout and drilling into 7 to 9 days** using a fleet of four robots.

### Performance Numbers

The early access results are striking:

| Metric | Result |
|--------|--------|
| **Holes drilled** | 108,000+ |
| **Placement accuracy** | 99.97% |
| **Tolerance** | ±1/8 inch (3.175 mm) |
| **Cost per hole** | $60 → ~$20 (67% reduction) |
| **Labor hours saved** | 21,000 in first 6 months |

### How It Works

The system is built on August Robotics' **Lionel** autonomous mobile robot platform, which has over 1 million marks recorded across exhibitions and industrial projects since 2019. The drilling system:

1. **Imports CAD files** for precise hole placement — no manual layout needed
2. **Navigates autonomously** using indoor positioning
3. **Avoids obstacles** and approaches blocked positions from multiple angles
4. **Coordinates as a fleet** — multiple robots work simultaneously on the same floor

The robot mounts a full industrial DEWALT concrete drilling rig on the Lionel AMR base, combining proven drilling hardware with autonomous navigation.

### Availability

The system was demonstrated at the **World of Concrete Trade Show** in Las Vegas, with commercial release expected **mid-2026**. Twelve robots are already in early access deployment. August Robotics won the 2024 ESCA Innovation Award for their exhibition technology, and this construction application extends their platform into a much larger market.

**[View DEWALT Robotic Drilling System on Awesome Robots →](/robots/august-robotics-dewalt-drilling)**

---

## What These Additions Mean

These two robots represent distinct but equally important trends in the field:

**Sprout** shows that humanoid development platforms are getting more accessible and safety-focused. Rather than building a general-purpose humanoid for everything, Fauna Robotics has optimized for safe interaction and developer experience — the kind of platform that could accelerate embodied AI research at universities and startups.

**The DEWALT Drilling System** demonstrates that autonomous robots are reaching the point where they can replace entire construction workflows, not just individual tasks. A 67% cost reduction and 10x speed improvement with 99.97% accuracy is the kind of ROI that drives rapid adoption.

Both robots are now live on the catalog with full specifications, images, and quote request forms.

**Browse all robots → [Awesome Robots Catalog](/browse)**
