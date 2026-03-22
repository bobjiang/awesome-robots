---
title: "Power Is the Bottleneck: How pSemi PE26100 and PE25304 Enable Next Generation Humanoid Robots"
slug: "psemi-pe26100-pe25304-power-modules-humanoid-robots"
date: "2026-03-23"
author: "bob-jiang"
category: "news"
tags: ["robotics", "power electronics", "humanoid robots", "dexterous hands", "48V", "hardware"]
excerpt: "A practical deep dive into two new pSemi power products and why efficient, low profile conversion is becoming a gating factor for dexterous humanoid robots."
featured: true
published: true
seo:
  title: "pSemi PE26100 and PE25304: Power for Humanoid Robots"
  description: "pSemi announced PE26100 and PE25304 at APEC 2026. Learn what multi level bucks and 48V divide by 4 modules change for humanoid robots and dexterous hands."
  keywords: ["pSemi", "PE26100", "PE25304", "humanoid robot power", "48V to 12V", "dexterous hand robotics"]
---

## Introduction

Robots do not fail in demos because the policy is weak. They fail in the real world because the hardware stack cannot reliably deliver energy where and when the robot needs it.

Humanoid robots and dexterous hands are the clearest example. The industry loves talking about foundation models, world models, and end to end policies, but every one of those layers ultimately has to push current through copper inside a constrained volume, with tight thermal limits, while the robot is in motion.

At APEC 2026 in San Antonio, pSemi (a Murata company) announced two power products that are not robotics products on the surface, but they map directly to the pain points of humanoid systems:

- **PE26100**, a multi level buck converter designed for low profile, high current fast charging and direct battery charging architectures
- **PE25304**, an integrated 48V divide by 4 charge pump module aimed at high efficiency, space constrained power conversion that pSemi explicitly ties to dexterous hand and mechatronic systems

The headline is simple: **humanoid robots are becoming power electronics problems as much as they are AI problems**.

Sources:
- pSemi APEC 2026 announcement (republished): https://www.pharmiweb.com/press-release/2026-03-20/psemi-a-murata-company-unveils-breakthrough-power-solutions-for-fast-charging-mobile-devices-and-n
- pSemi product page for PE26100: https://psemi.com/products/power-management/multi-level-converter-pe26100/
- pSemi product page for PE25304: https://psemi.com/products/power-management/pe25304/

## Why power conversion is a gating factor for humanoids

A modern humanoid has three power domains that fight each other:

1. **High voltage distribution** for efficiency (often 48V, sometimes higher in industrial platforms)
2. **Medium voltage rails** (12V, 24V) feeding motor drives, pumps, and actuators
3. **Low voltage digital rails** (5V, 3.3V, sub 1V) feeding compute, sensors, and networking

The problem is not that any one rail is difficult. The problem is that the robot must deliver all of them at once while meeting four constraints:

- **Volume**: humanoids have thin limbs and crowded hands. The most valuable cubic centimeters are in the distal segments.
- **Thermals**: you cannot put a hot converter next to tactile sensors, cameras, or polymer tendons and expect stability.
- **Dynamics**: load profiles are spiky. Hands and arms can go from idle to peak torque in milliseconds.
- **Safety and reliability**: brownouts and transient faults are system level failures in a robot that interacts with people.

That is why efficiency is not an optimization. It is a requirement.

If a power stage runs at 90% instead of 97%, the difference does not just hit battery life. It becomes heat that must be moved somewhere, and the mechanical design of a hand or forearm typically has nowhere to put it.

## The PE26100: multi level buck conversion for fast, low profile power delivery

The **PE26100** is presented as a direct battery charging and fast charging component for mobile devices, but the spec sheet reads like it was written for any system that has to push high current through a thin stack.

From the pSemi product description:

- It is a **high efficiency multi level buck converter**
- Designed for **single cell lithium batteries**
- Supports **4 level and 3 level modes** when a fixed input like USB power delivery is applied
- Delivers up to **6A**
- Fits a **low profile** form factor (pSemi notes less than 1 mm height)
- Operates over **4.5V to 18.5V input**
- Can run as a **charge pump capacitor divider** in 2:1 and 3:1 modes for programmable sources
- Includes **I2C telemetry** and supports reverse boost for limited power out scenarios

In a humanoid context, why should anyone care about a converter originally framed around USB PD?

### 1) Low profile power stages are scarce in robotic packaging

Humanoid packaging resembles smartphones more than industrial cabinets. Every layer you add to a power stage forces compromises:

- thicker forearms and shrouds
- reduced sensor placement
- reduced actuator size
- worse cable routing

A low profile converter that can still deliver high current is valuable even if the original use case is not a robot.

### 2) Multi level architecture is a pathway to higher efficiency at high power density

The PE26100 reduces effective inductance requirements by using a multi level topology. In practice, this tends to reduce losses and make it easier to fit the magnetics and caps in a thin solution.

Roboticists often treat the DC DC design as something you buy off the shelf. That works until you put the converter inside a moving limb next to sensors. Then the shape and loss profile matter as much as the electrical performance.

### 3) Telemetry is becoming non optional

pSemi highlights I2C telemetry. In robots, this is more than nice to have.

A power module that can report current, voltage, and thermal conditions enables:

- predictive fault detection
- better energy budgeting in autonomy stacks
- more stable behavior under transient loads

A dexterous manipulation policy can be brilliant, but if the hand browns out during a torque peak, the overall system looks dumb.

## The PE25304: 48V divide by 4 conversion for hands and mechatronics

The more directly robotics relevant announcement is the **PE25304**.

In the APEC 2026 announcement, pSemi describes it as an advanced integrated charge pump switching capacitor power module that is purpose built for 48V input architectures and highlights dexterous hand robotics as a target application.

Key claims from the announcement and the product page:

- Designed to **divide input voltage by four**
- Operates from **20V to 60V input**
- Aimed at **48V architectures**
- **Ultra low profile package** (pSemi notes 2 mm)
- Up to **72W output power**
- Around **97% conversion efficiency** (product page cites 96.5% at 48V in to 12V out)
- Can be **paralleled** for higher power

This looks like a small detail until you map it onto the direction the humanoid industry is moving.

### The case for 48V in humanoids

48V is attractive because it lowers current for a given power level. Lower current means:

- thinner wiring harnesses
- less copper mass
- lower resistive loss
- easier distribution across the torso and limbs

But the moment you distribute 48V, you need efficient local conversion down to rails that motor drives and embedded compute can use.

That conversion often happens in the worst places: hands, forearms, and compact actuator packs.

### Why a divide by 4 stage is a pragmatic sweet spot

Going from 48V to 12V is a common step. A divide by 4 charge pump stage effectively performs that step with high efficiency in a compact module, then downstream buck stages can do fine grained regulation.

For dexterous hands, this matters because hands are becoming power dense.

A high end humanoid hand might have:

- dozens of small motors or tendon drives
- multiple sensor modalities (tactile, force torque, encoders)
- local microcontrollers and comms

All of it needs power with low ripple and predictable thermal behavior.

A 2 mm package that can deliver tens of watts at high efficiency is not a toy feature. It is an enabler for packaging and reliability.

## What this changes for dexterous hands

Dexterous hands are the new battlefield. Everyone wants a hand that can:

- pinch and regrasp
- maintain stable contact forces
- manipulate soft and rigid objects
- survive impacts and drops

The AI stack gets the headlines, but the hand is an electromechanical system that lives on the edge of a thermal cliff.

### Heat is the enemy of tactile fidelity

Tactile sensors, especially those based on elastomers and thin films, have temperature dependent characteristics. Heat drift can become a silent failure mode:

- contact force estimates drift
- slip detection becomes unreliable
- calibration changes with time

High efficiency power conversion inside the hand reduces thermal gradients and improves stability.

### Low profile modules reduce mechanical compromises

A bulky power stage forces:

- thicker palm sections
- reduced joint travel
- worse cable routing

If a module is thin enough, you can place it closer to where power is consumed, reduce cable length, and reduce resistive loss and EMI.

### Parallelability supports modular design

pSemi notes that PE25304 modules can be connected in parallel. That supports a modular approach to hands and forearms:

- identical power bricks repeated per finger cluster
- easier spares and manufacturing
- more graceful degradation if one module is derated

## The hidden link: power electronics and autonomy reliability

Robotics teams increasingly measure autonomy in hours of stable operation, not in benchmark scores.

Power electronics impacts autonomy reliability through failure modes that look like software bugs:

- intermittent resets
- sensor dropouts under load
- latency spikes when compute rails sag
- subtle torque limits when motor drivers derate

When a robot does something strange, the instinct is to debug the policy. Many times, the root cause is a transient in the power path.

Telemetry capable, efficient, low profile converters make these issues observable and manageable.

## Practical design pattern: distribute high voltage, convert locally

A practical humanoid architecture in 2026 looks like this:

1. Battery pack supplies a high voltage bus (often 48V)
2. Bus is distributed through the torso and into limbs
3. Each limb has local conversion stages to 12V or 24V for actuators
4. Local point of load regulators generate 5V, 3.3V, and sub 1V rails for compute and sensors

The PE25304 fits between step 2 and step 3.

The PE26100 fits more naturally into compact packs where you need a low profile high current stage, including charging, hot swap, or local power islands.

## Limitations and what to watch

These products do not magically solve humanoid power. There are real questions engineers will still have to answer:

- **EMI**: charge pumps and high frequency converters need careful layout, especially near sensitive sensors.
- **Mechanical integration**: thin packages are good, but they also need reliable thermal paths.
- **Fault behavior**: in a robot, you need predictable responses to short circuits and overloads.
- **Supply chain**: humanoids are entering volume production, and component availability matters.

The announcement also frames the PE26100 around mobile charging and the PE25304 around 48V conversion. The robotics relevance depends on how these parts are adopted into reference designs and modules that robotic OEMs can actually integrate.

## Why this announcement matters more than it looks

APEC is not a robotics event. It is a power electronics event. That is precisely why it matters.

The humanoid industry is scaling into a phase where the limiting factors move down the stack:

- from model quality to system reliability
- from policy generalization to thermal budgets
- from one off demos to manufacturable power and wiring

pSemi is effectively saying that **the same low profile, high density power techniques that made smartphones possible are now needed for dexterous robots**.

That is a strong signal about where the bottlenecks are.

## Takeaways

- Humanoid robots are rapidly becoming constrained by power density, heat, and packaging.
- pSemi announced PE26100 and PE25304 at APEC 2026, explicitly linking the PE25304 to dexterous hand robotics.
- PE26100 highlights the value of multi level buck conversion for thin, high current power stages with telemetry.
- PE25304 targets 48V architectures with divide by 4 conversion, high efficiency, and a low profile package.
- The near term winners in humanoids will be the teams that treat power electronics as a first class system, not an afterthought.

If you are building hands, forearms, or compact actuator packs, the most important question is no longer only what policy you will run.

It is also: can your power stack deliver repeatable performance at peak load without cooking itself.
