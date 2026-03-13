---
title: "Force Control Is the Missing Piece: Why Humanoid Robots Still Struggle With Doors and Stairs"
slug: "force-control-humanoid-robots-doors-stairs"
date: "2026-03-14"
author: "bob-jiang"
category: "tutorials"
tags: ["humanoid robots", "force control", "impedance control", "reinforcement learning", "VLA models", "actuators", "robot safety", "physical AI"]
excerpt: "Humanoid robots look dramatically better in demos, but reliable operation in messy human spaces still hinges on one hard problem: controlling contact forces." 
featured: true
published: true
seo:
  title: "Force Control: The Key to Reliable Humanoid Robots"
  description: "Humanoids can run and dance, yet still fail on doors and stairs. Learn how force sensing, impedance control, and RL policies must combine for safe real-world robots."
  keywords: ["force control", "impedance control", "humanoid robots", "proprioceptive actuators", "reinforcement learning", "vision-language-action", "RT-2", "physical AI"]
---

## Introduction: the uncanny gap between impressive demos and boring reliability

Humanoid robots have improved fast over the past decade. Videos now show bipeds jogging, doing parkour, recovering from pushes, and manipulating awkward objects with a smoothness that would have looked like science fiction in 2015. Yet, when you ask the most credible teams a mundane question, the answer is still sobering:

- Can a humanoid walk through any doorway without getting stuck or bumping into the frame?
- Can it climb any random stair set in a real building, not just a tuned test rig?
- Can it open a heavy door with a sticky latch, without slamming it or losing balance?

A recent deep reporting piece from Quanta Magazine captures the state of the field well: even with modern reinforcement learning control and better actuation hardware, doors and stairs are not solved reliably in the wild, because the real world is a contact problem first and an intelligence problem second. The missing ingredient is not another language model. It is physics. More specifically: *force control* and the sensing, actuation, and software stack needed to regulate forces under uncertainty.\
Source: Quanta Magazine, "Why Do Humanoid Robots Still Struggle With the Small Stuff?" (2026-03-13)\
https://www.quantamagazine.org/why-do-humanoid-robots-still-struggle-with-the-small-stuff-20260313/

This post explains what force control means in practice, why it is the bottleneck behind many real world failures, and how the next generation of humanoid systems are likely to blend classic impedance control with modern learned whole body policies.

## Why doors and stairs are harder than they look

Doors and stairs are not “hard” because the robot cannot plan a sequence of actions. The plan is trivial:

- For stairs: place foot, shift weight, push up, repeat.
- For a door: reach handle, apply torque, pull, step through.

They are hard because these tasks are:

1. **Contact rich.** Every step and every push involves unknown contact geometry, friction, compliance, and micro impacts.
2. **Coupled.** If the arm pulls a door, the torso and legs must counterbalance. If the foot slips, the whole body must react.
3. **Unforgiving.** A few centimeters of error can mean a toe catch on a stair edge or a shoulder collision with a door frame.
4. **Variable.** Real stairs vary in height, tread depth, and stiffness. Doors vary in hinge friction, latch force, and swing dynamics.

In other words, this is not just a perception problem, and it is not just a control problem. It is **whole body interaction under uncertainty**.

## The three big shifts that got us here

The Quanta article describes three shifts that explain why humanoids look so much better today:

### 1) Learned control (especially reinforcement learning)

Instead of hand designing every gait and recovery behavior, many teams now train policies in simulation and transfer them to real hardware. Reinforcement learning can produce controllers that coordinate dozens of joints, maintain balance, avoid collisions, and react to disturbances.

The key benefit is not magic. It is scale: simulation lets you run millions of trials, explore edge cases, and discover coordination strategies that would take years to hand tune.

### 2) Better electric actuation (quasi direct drive and “proprioceptive” motors)

Many modern legged robots moved away from heavy hydraulics toward high torque density electric motors with low gear ratios and high backdrivability. These actuators can be made compliant, absorb impacts, and provide high fidelity torque estimation via motor current.

That last point is crucial: if the motor is “transparent” enough, it can function as a kind of force sensor, reducing the need for expensive dedicated force torque sensors in every joint.

### 3) Vision language action models for planning and generalization

Vision language action models (VLA) connect perception and high level intent to action generation. A canonical example is DeepMind RT-2, which adapts a vision language model backbone so it can output robot actions as tokens, and learns from both web data and robot demonstrations.

Source: DeepMind blog, "RT-2: New model translates vision and language into action" (2023-07-28)\
https://deepmind.google/blog/rt-2-new-model-translates-vision-and-language-into-action/

This helps robots pick the right tool, understand what the user asked for, and sequence multi step tasks.

So why does it still fail on a sticky door?

Because none of these shifts *guarantee* that the robot can regulate physical interaction forces precisely and safely.

## Force control, explained like an engineer

Force control is the ability to regulate how hard a robot pushes, pulls, or presses when it is in contact with the world.

If a robot only does position control, it behaves like a stiff machine: it tries to reach a target pose no matter what it hits. In contact, that can mean:

- Slamming into a surface
- Wrenching a door handle
- Breaking an object
- Losing balance when the world pushes back

Force control adds a second objective: do not just go to a pose, **interact with a desired force profile**.

### The classic tool: impedance control

A widely used approach is impedance control. The idea is to make the robot behave like a virtual spring and damper, with adjustable stiffness in different directions.

A simple example:

- While writing with a marker on a whiteboard, you want high stiffness along the plane (to draw accurately), but low stiffness into the plane (to avoid crushing the marker).

For a humanoid opening a door:

- You want moderate stiffness in the direction that keeps the hand on the handle.
- You want controlled compliance so that if the door sticks, the robot increases force gradually instead of jerking.
- You want damping to prevent oscillations that can destabilize the whole body.

Traditional industrial robotics has used these ideas for decades, but humanoids make it harder because the whole body is involved and the contact conditions are constantly changing.

## Why learned policies often “get force control for free” and why that is not enough

Many reinforcement learning locomotion policies appear to handle forceful contact surprisingly well. They can land from jumps, recover from pushes, and traverse uneven terrain.

But in many cases the policy is not explicitly commanded to apply a force, and it does not expose a knob like “be twice as compliant” or “limit contact force to 20 newtons.” It learns a behavior that works in training, with force regulation emerging indirectly.

That is fine for a narrow benchmark, but it becomes a problem for real deployments:

- A warehouse customer may want the robot to push heavy carts in one zone and be extra gentle near humans.
- A home robot may need different compliance when handling glass, plastic, or metal cookware.
- A door may require high torque briefly at the latch, then low force as it swings.

Without an explicit mechanism for force and compliance control, you either retrain for every scenario or accept brittle behavior.

## A concrete research direction: learning explicit force control without force sensors

A relevant paper cited in the Quanta piece is "Learning Force Control for Legged Manipulation" (Portela et al., 2024), from MIT Improbable AI Lab and collaborators. The paper argues that sim to real RL succeeds in contact rich problems, but often does force regulation implicitly, which limits precision and user control.

They propose training RL policies for direct force control **without requiring dedicated force torque sensors**, using proprioceptive sensing to estimate and regulate the forces.

Key ideas from the paper:

- The controller is trained so a user can command a desired contact force.
- Variable compliance enables behaviors like gravity compensation and impedance control.
- The approach is demonstrated on a quadruped with an arm, where whole body posture adjusts to achieve the desired end effector force.

Source: arXiv HTML, "Learning Force Control for Legged Manipulation" (v2)\
https://arxiv.org/html/2405.01402v2

Even though the platform is a legged manipulator, the lesson transfers to humanoids: if you can estimate forces through motors and proprioception, and learn policies that treat force as a first class control target, you can unlock safer interaction and easier teleoperation.

## The real stack problem: where force control sits relative to VLA models

It is tempting to imagine that a VLA model will output motor commands directly. That is not how most reliable robot systems will be built in the near term.

A more realistic stack has layers:

1. **High level intent and task planning** (language, vision, reasoning)
2. **Motion planning and skill selection** (trajectories, contact sequences)
3. **Whole body control** (balance, coordination, collision avoidance)
4. **Low level actuation and force regulation** (torque, impedance, compliance)

VLA models help most in layers 1 and 2: deciding what to do, choosing an object, selecting a skill, and generating a sequence.

Force control lives in layers 3 and 4. It must be fast, stable, and safety constrained.

If the high level planner says "open the door," the force control layer needs to handle:

- Unknown latch stiffness
- Micro slip at the foot contact
- Compliance in the wrist and gripper
- The door accelerating as it swings
- The robot shifting its center of mass to remain stable

This is millisecond scale feedback control, not token prediction.

## Hardware matters: the sensing that force control needs

Force control is not only a software challenge. It is limited by what the robot can sense and how quickly it can respond.

### 1) Proprioception and torque estimation

If an actuator is backdrivable and has low friction, motor current can estimate torque with useful accuracy. That gives you a cheap, high bandwidth signal that can stand in for force sensing in many joints.

The tradeoff: estimation is not perfect, especially with gearboxes, friction, temperature changes, and unmodeled dynamics.

### 2) Tactile sensing

Tactile skins and fingertip sensors can provide contact location and pressure distribution, which is valuable for manipulation and safe human interaction. But tactile sensors can be expensive, fragile, and hard to calibrate.

### 3) Feet sensing and contact state

Stairs are brutal because foot contact state changes quickly: heel strike, toe off, edge contact, and occasional slip. Reliable contact detection and force estimation at the feet are critical for stable gait on real staircases.

### 4) Inertia and compliance

Even a perfect controller struggles if the robot is heavy and stiff. High inertia means any control error carries more momentum. Compliance helps, but too much compliance reduces precision.

The outcome is a design tension: the robot needs to be light and compliant for safety, but stiff and strong for useful work.

## Why “small stuff” is a systems engineering test

Doors and stairs are the robotics equivalent of driving in the rain at night: not glamorous, but a true robustness test.

A reliable humanoid must combine:

- **Perception:** detect edges, handles, steps, and moving obstacles.
- **State estimation:** know its body pose and contact state precisely.
- **Planning:** choose stable foot placements and safe hand trajectories.
- **Control:** regulate forces and react to disturbances.
- **Safety constraints:** limit peak forces near humans and near fragile objects.

What makes this hard is not any one module. It is the integration.

### Failure mode 1: the robot is too stiff

If stiffness is high, a small pose error turns into a large contact force. On a door, that can produce an unexpected torque that twists the torso and destabilizes the gait.

### Failure mode 2: the robot is too compliant

If stiffness is too low, the robot cannot transmit enough force to complete the task, or it becomes sluggish and unstable when its body needs to counteract reaction forces.

### Failure mode 3: simulation mismatch

Many learned policies are trained in simulation with simplified contact. If the real world has different friction, different surface compliance, or unexpected geometry, the learned controller may hit regimes it never experienced.

Explicit force objectives and better contact modeling help reduce this gap.

## Practical metrics: how to measure progress beyond viral videos

If you want to evaluate whether a humanoid is getting closer to real world utility, consider metrics that incorporate force and reliability.

1. **Stair success rate across environments:** multiple staircases with different dimensions, surfaces, and handrails.
2. **Door opening envelope:** range of latch forces and hinge frictions the robot can handle.
3. **Peak contact force near humans:** worst case force in near miss collisions or light contact.
4. **Task completion under perturbations:** pushes, blocked handles, unexpected obstacles.
5. **Recovery time:** how quickly the controller returns to a stable gait after contact disturbances.

These measures push teams toward robust force regulation, not just choreography.

## What the next 12 to 24 months may look like

Based on the trajectory in industry and research, expect humanoid control stacks to evolve in three ways.

### 1) Force and compliance become explicit interfaces

Instead of a policy that outputs joint positions, controllers will increasingly expose tunable compliance and force targets, so operators and planners can specify what “gentle” means numerically.

### 2) Better whole body controllers that combine model based and learned pieces

A hybrid approach is likely: learned policies for coordination and generalization, with model based constraints for stability and safety, and with dedicated force control loops where needed.

### 3) Richer contact data for training

Training data will expand beyond video and pose demonstrations. Expect more datasets that include:

- Tactile signals
- Motor currents and torque estimates
- Foot contact patterns
- Interaction forces during household like tasks

This is expensive to collect, but it aligns the learning objective with the physics the robot must master.

## Takeaway: physical AI needs “physics knobs”

VLA models are a huge step forward for making robots understand what humans want and for generalizing across objects and tasks. Reinforcement learning is a huge step forward for producing coordinated whole body behaviors. Modern electric actuators are a huge step forward for making those behaviors feasible on real hardware.

But to cross the line from impressive demos to reliable deployment, humanoid robots need explicit mastery of contact: sensing forces, regulating forces, and exposing force and compliance as controllable interfaces.

That is why doors and stairs remain the real benchmark. When humanoids can open any door and climb any stairs safely, quietly, and repeatably, the rest of the household will feel much closer.

## Further reading

- Quanta Magazine: "Why Do Humanoid Robots Still Struggle With the Small Stuff?" (2026-03-13)\
  https://www.quantamagazine.org/why-do-humanoid-robots-still-struggle-with-the-small-stuff-20260313/
- Portela et al.: "Learning Force Control for Legged Manipulation" (arXiv, 2024)\
  https://arxiv.org/html/2405.01402v2
- DeepMind: "RT-2: New model translates vision and language into action" (2023)\
  https://deepmind.google/blog/rt-2-new-model-translates-vision-and-language-into-action/
