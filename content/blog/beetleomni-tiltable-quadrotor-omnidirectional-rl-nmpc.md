---
title: "BeetleOmni: RL Control for Tiltable Quadrotors That Fly Omnidirectionally"
slug: "beetleomni-tiltable-quadrotor-omnidirectional-rl-nmpc"
date: "2026-03-08"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "aerial robotics", "reinforcement learning", "control", "Isaac Sim", "PPO", "sim-to-real", "MPC"]
excerpt: "A deep dive into BeetleOmni, a learning based control stack that makes an overactuated tiltable quadrotor track full 6 DoF poses with strong real world robustness."
featured: true
published: true
seo:
  title: "BeetleOmni RL Control for Tiltable Quadrotors (6 DoF Flight)"
  description: "Learn how BeetleOmni combines PPO, system identification, and minimal domain randomization to control overactuated tiltable quadrotors for agile 6 DoF flight."
  keywords: ["tiltable quadrotor", "omnidirectional flight", "reinforcement learning control", "PPO", "Isaac Sim", "Isaac Lab", "NMPC", "sim to real"]
---

## Why omnidirectional flight matters

Most quadrotors are underactuated. They can control position in 3D space and yaw, but roll and pitch are largely dictated by the thrust vector needed to accelerate. That constraint is fine for many tasks, but it becomes a bottleneck for close range inspection, contact rich interaction, and tight indoor navigation.

A tiltable quadrotor changes the game. By actively rotating each rotor, the vehicle can redirect thrust and generate forces and moments more freely. In the limit, it approaches full 6 degree of freedom actuation, meaning it can track a full pose in SE(3): position plus orientation.

The catch is control. Tilt joints add strong coupling between the rotor dynamics and the joint dynamics. Classical model based controllers can be accurate under nominal conditions, but they often get brittle when the model is even slightly wrong, latency is present, or disturbances show up.

That is where BeetleOmni is interesting: it shows how reinforcement learning can be used as a practical low level controller for a real tiltable quadrotor, with strong robustness and zero shot deployment on hardware.

## The core idea in one paragraph

BeetleOmni trains an actor critic policy with PPO in NVIDIA Isaac Sim and Isaac Lab, but avoids the usual heavy domain randomization. Instead, it leans on system identification to make the simulator physically consistent, then adds minimal and physically motivated randomization to cover the remaining mismatch. The result is a policy that runs extremely fast at inference time, reaches target 6 DoF poses with comparable accuracy to nonlinear model predictive control, and often exceeds NMPC on disturbance rejection and generalization.

Primary reference: "Learning Agile and Robust Omnidirectional Aerial Motion on Overactuated Tiltable Quadrotors" (project page).

- Project page: https://zwt006.github.io/posts/BeetleOmni/
- Mentioned in IEEE Spectrum Video Friday roundup: https://spectrum.ieee.org/quadruped-farming-robots

## The robot platform: why it is overactuated

The Beetle platform uses:

- Four rotors
- Four single degree of freedom tilt joints (one per rotor)

Each tilt joint rotates the thrust direction of its rotor. That adds a new control input that a standard quadrotor does not have.

Conceptually:

- Standard quadrotor: you choose four thrust magnitudes, which indirectly set net force and moments
- Tiltable quadrotor: you choose thrust magnitudes and thrust directions, which can span a much larger wrench space

That larger wrench space enables:

- Sideways acceleration without pitching the whole body
- Aggressive orientation changes while maintaining position
- Precise pose transitions in confined environments

The flip side is that the system has more actuators than the minimum required to control pose, so the controller must learn or compute coordinated rotor plus joint behaviors.

## Framing the control problem as a POMDP

BeetleOmni formulates control as a partially observable Markov decision process. This is a realistic choice because:

- Sensor estimates are noisy and delayed
- Aerodynamic effects are hard to model exactly
- The policy cannot observe every latent variable that affects dynamics

### Action space

The policy outputs an 8 dimensional action:

- 4 joint position targets
- 4 rotor thrust targets

That design makes the policy feel like a unified controller that directly coordinates joint angles and thrust.

### Observation space

The observation is 33 dimensional and includes:

- Body velocities
- Relative target pose
- Current orientation
- Joint positions
- Previous actions

Including previous actions is a common trick that helps the policy infer unobserved dynamics such as actuator lag.

### Asymmetric actor critic

Training uses an asymmetric actor critic setup:

- Actor: uses the standard observation
- Critic: receives additional privileged information such as rotor thrust and torque signals during training

This often improves sample efficiency and stabilizes learning, while keeping the deployed policy realistic.

## Why PPO is a sensible choice here

PPO (Proximal Policy Optimization) is a strong baseline for continuous control when you want:

- Stable training
- Reasonable hyperparameter sensitivity
- Compatibility with vectorized simulation

In Isaac Lab, PPO is also a common default, which makes reproduction and extension easier.

The deeper takeaway is not that PPO is magical. The takeaway is that a robust pipeline needs:

- A training objective that matches the task
- A simulator that is close enough to reality
- A transfer strategy that does not rely on luck

## The sim to real playbook: system identification over chaos randomization

Many sim to real pipelines push heavy domain randomization: randomize everything and hope the real world sits inside the randomized envelope.

BeetleOmni takes a more disciplined approach:

1. Identify the key actuator models from real measurements
2. Encode those models into the simulator
3. Add minimal randomization only where uncertainty remains

This matters because randomization is not free. Too much of it can:

- Slow training
- Encourage conservative policies
- Reduce precision for fine control

### What gets identified

From the project page, key identified components include:

- Rotor thrust and torque maps as a function of command and voltage
- Joint motor dynamics using a second order transfer function fit from sine wave response
- System latency, including communication and estimation delays

### What gets randomized

Instead of randomizing everything, they randomize a small set of physically meaningful parameters, such as:

- Body mass
- Inertia
- Joint offsets

This combination is a practical recipe: high fidelity where you can measure, and bounded uncertainty where you cannot.

## RL vs NMPC: what the experiments show

The work compares the learned policy to a state of the art NMPC controller.

### Inference speed

A striking claim is inference latency:

- RL policy inference: about 0.3 ms per step
- NMPC compute: about 10 ms per step

That gap matters for real robots. Faster control loops can improve disturbance rejection, and they also free compute for perception and planning.

### Waypoint pose reaching

The policy is trained for reaching target 6 DoF poses. In waypoint hovering experiments, RL achieves comparable pose tracking accuracy to NMPC, with strong agility during transitions.

### Disturbance rejection

Under continuous wind and impulsive pushes, the learned controller is reported to be more stable in orientation and position, and to recover faster.

The high level interpretation: the policy has learned a reactive feedback behavior that is effective even when the model mismatch would otherwise degrade a model based controller.

### Payload robustness

Another practical highlight is stable hovering with additional payload up to 1.0 kg without retuning. In real deployments, payload variation is common, so this is an important robustness axis.

### Generalization to trajectory tracking

Even though the policy is trained for point to point pose reaching, it generalizes to tracking a 3D lemniscate trajectory with synchronized orientation modulation.

It does not outperform NMPC on every metric, but it holds its own and stays stable without extra training, which is meaningful.

## What this means for robotics in 2026

There is a growing pattern across robotics:

- Learning based low level control can be viable when paired with a good physics prior
- System identification can replace a lot of brute force randomization
- The best results often come from hybrid thinking, not pure learning or pure modeling

Tiltable quadrotors are a great example because they are complex enough to stress classical control, but structured enough that a well trained policy can exploit the actuation richness.

## How to apply these ideas to your own platform

If you are building an aerial robot and want to replicate the spirit of BeetleOmni, focus on the pipeline, not the exact numbers.

### 1) Pick a task aligned with deployment

Pose reaching is a clean objective for learning a stabilized motion controller. If you only train on tracking a single scripted trajectory, you may overfit.

### 2) Build an actuator truth model

Do not skip actuator identification. For aerial robots, rotor and motor behavior drives everything.

### 3) Randomize with intent

Randomize parameters that represent real uncertainty, not parameters that make the simulator unrealistic.

### 4) Add latency and estimation noise

Real hardware has delays. If your sim does not, your controller will act like a lab demo.

### 5) Treat the policy as a low level controller

A strong architecture is:

- High level planner: generates target poses or trajectories
- Learned policy: tracks targets with high bandwidth feedback

This split keeps learning focused on what it does best.

## Limitations and open problems

This line of work still has open questions:

- Safety guarantees: learning based control can be hard to certify
- Failure modes: edge cases under extreme disturbances must be understood
- Energy efficiency: overactuated flight can waste power if not optimized
- Hardware wear: tilt joints add mechanical complexity

A reasonable near term direction is hybrid control: keep a backup stabilizer or constraint layer that can intervene when policy outputs drift into unsafe regimes.

## Summary

BeetleOmni is a strong example of learning based control done with engineering discipline:

- PPO policy trained in Isaac Sim and Isaac Lab
- Actuator and latency system identification for simulator fidelity
- Minimal domain randomization for robustness
- Zero shot deployment on real hardware
- Competitive accuracy vs NMPC, with stronger disturbance rejection in several tests

If tiltable quadrotors become common for inspection, manipulation, or tight indoor flight, this kind of stack is a plausible blueprint.
