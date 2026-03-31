---
title: "SCDP: Humanoid Locomotion from Partial Observations with Sensor-Conditioned Diffusion Policies"
slug: "scdp-humanoid-locomotion-partial-observations"
date: "2026-04-01"
author: "bob-jiang"
category: "tutorials"
tags: ["humanoid robots", "diffusion policy", "robot locomotion", "partial observability", "proprioception", "Unitree G1", "robot learning"]
excerpt: "Sensor-Conditioned Diffusion Policies show how to run robust humanoid locomotion using only onboard sensors by training a diffusion controller to predict privileged trajectories under partial observability."
featured: true
published: true
seo:
  title: "SCDP: Sensor-Only Humanoid Locomotion with Diffusion Policies"
  description: "Learn how Sensor-Conditioned Diffusion Policies (SCDP) enable humanoid locomotion from onboard sensors only, removing fragile state estimation while keeping high success rates."
  keywords: ["Sensor-Conditioned Diffusion Policies", "SCDP humanoid locomotion", "diffusion policy robotics", "partial observability POMDP", "Unitree G1 locomotion"]
---

## Introduction

If you have ever tried to take a humanoid locomotion policy out of simulation and put it on a real robot, you have probably met the same enemy: **state estimation**.

Many of today’s best locomotion controllers, including diffusion-based trajectory policies, assume they can read out a clean full-body state at runtime: global base pose, base velocity, body positions, and other “privileged” quantities that are easy in simulation but messy in the real world. On hardware, those quantities must be reconstructed by a pipeline that fuses IMUs, encoders, foot contact signals, and sometimes external systems. The pipeline works until it does not, and when it fails, your robot falls.

A March 2026 paper proposes a clean alternative:

- **SCDP: Sensor-Conditioned Diffusion Policies**
- arXiv: https://arxiv.org/abs/2603.09574

The central idea is simple to state and surprisingly powerful:

**Train a diffusion controller that only conditions on onboard sensor histories, but supervise it to predict privileged future state action trajectories.**

This “mixed-observation” setup forces the model to learn an *implicit* representation of the missing global state, without requiring an explicit estimator at deployment.

In this post, we will unpack what SCDP is, why it matters for humanoids, and what you can learn from the design if you are building your own real-robot policies.

## The core problem: locomotion is partially observable in the real world

In simulation, it is common to give a policy everything:

- base pose and velocity
- link positions and velocities
- ground truth contacts
- clean gravity direction

In the field, a humanoid typically has **reliable** access to:

- joint encoders and joint velocities
- IMU signals (angular velocity, acceleration)
- sometimes force torque sensing, contact estimates, and motor currents

But what it usually does not have is a perfect global pose and velocity, especially in dynamic motion and on non-flat terrain.

Formally, the real robot is a **partially observable Markov decision process (POMDP)**. A policy must infer the hidden state from observation history.

Many modern methods acknowledge partial observability by stacking frames, using recurrent networks, or training an explicit estimator. The paper argues that diffusion controllers for humanoids have a specific issue: **they often rely heavily on privileged state in their conditioning and break catastrophically when it is removed.**

## Why diffusion policies are appealing for humanoid control

Diffusion models in robotics are attractive because they can represent **multi-modal action distributions** and produce smooth multi-step plans, rather than a single reactive action.

A well-known example is Diffusion Policy for visuomotor manipulation, which treats action generation as a conditional denoising diffusion process and uses receding-horizon control at inference time:

- Project page: https://diffusion-policy.cs.columbia.edu/
- Paper (RSS 2023 / IJRR 2024): https://arxiv.org/abs/2303.04137v5

For humanoid locomotion, diffusion style controllers can:

- generate coherent action sequences
- incorporate long horizon structure
- handle ambiguity (for example, two valid stepping patterns)

But they also tend to be trained in environments where privileged state is freely available, which makes deployment painful.

## What SCDP changes: decouple sensing from supervision

SCDP proposes **mixed-observation distillation**.

At a high level, the framework looks like this:

1. Train or use an expert policy (the paper uses a reinforcement learning expert for multi-motion tracking).
2. Collect offline trajectories from the expert in simulation.
3. Train a diffusion model that:
   - **conditions only on onboard sensor history** (proprioception and IMU-style signals)
   - but is **supervised to predict privileged future state action trajectories**

The result is a policy that, at inference time, can produce the actions needed for humanoid locomotion **without external sensing and without an explicit state estimator**.

This is the key conceptual shift:

- typical distillation tries to map observation to action directly
- SCDP distills a **trajectory diffusion planner** that must denoise coherent sequences while missing important state, forcing it to learn internal dynamics

### What counts as “onboard sensors” here

The paper’s inference observation includes signals like:

- pelvis angular velocity
- joint positions (relative to a default)
- joint velocities
- gravity vectors expressed in body frames

The privileged quantities (available in simulation and used for supervision) include more geometric information about body poses and velocities.

## The SCDP recipe: three tricks that make mixed-observation training work

Mixed-observation supervision sounds great, but there are several ways it can fail:

- train on privileged state distributions that the model never sees at inference
- leak privileged information through shortcuts
- create causal mismatches between training and deployment

The paper introduces several design choices to avoid these pitfalls.

### 1) Restricted denoising: make the model infer what sensors cannot reliably provide

One practical issue is that some quantities are particularly unreliable on hardware. Linear velocity is a classic example.

SCDP uses **restricted denoising**: it excludes certain privileged signals (like base velocity) from the denoising inputs while keeping them in the supervision target. In plain terms:

- the model must predict trajectories that contain velocity
- but it is not allowed to “cheat” by reading a clean velocity estimate in its inputs

This encourages the model to infer velocity implicitly from context.

### 2) Context distribution alignment: prevent train deploy mismatch

Diffusion policies are sequence models. If the context window at training time is built differently than the context window at inference time, the model can learn brittle dependencies.

The paper proposes **context distribution alignment** to keep the causal relationships between states and actions consistent across training and inference.

If you have built any real-time robot policy that uses history windows, you have seen this class of failure: a tiny mismatch in how you assemble the window makes the deployment context out-of-distribution.

### 3) Context-aware attention masking: use bidirectional attention where it helps

The model uses an attention mechanism with masking to allow bidirectional attention inside the context window, while keeping the right causal structure for prediction.

The point is not that “attention is better”, but that the model needs a structured way to fuse sensor history so it can reconstruct latent global dynamics.

## Deployment loop: diffusion policy as a receding-horizon locomotion controller

Diffusion policies are typically used with a receding-horizon loop:

1. Condition on the most recent sensor history plus a command (for example, a desired velocity).
2. Sample or denoise to generate a short future trajectory of actions and states.
3. Execute only the first action (or first few actions).
4. Repeat at a fixed control rate.

The paper reports deployment on a Unitree G1 humanoid at **50 Hz**, which is an important practical number.

If you want this kind of method to be useful in the real world, it cannot be a slow planner that runs at 5 Hz and hopes a low-level controller fixes everything.

## Results: how well does it work

According to the paper:

- in simulation, SCDP achieves **near-perfect success** on velocity-commanded locomotion (reported as 99 to 100 percent)
- on motion reference tracking, it achieves **93 percent tracking success** on the AMASS test set
- it is deployed on a real Unitree G1, demonstrating robust locomotion using only onboard sensors, without external sensing and without explicit state estimation

Source: https://arxiv.org/abs/2603.09574

The most interesting part is not the success numbers by themselves. It is that SCDP aims to match privileged baselines while removing the fragile dependency that usually makes a controller unusable outside of lab conditions.

## Why this matters: it reframes what “state estimation” can look like

Robotics often treats state estimation as a separate subsystem:

- estimator gives you base pose and velocity
- controller consumes estimator output

SCDP suggests another path:

- **the policy itself can perform implicit state estimation** as part of the control computation

This has several potential benefits.

### Fewer moving pieces

Every additional subsystem is an additional failure mode:

- calibration drift
- time synchronization issues
- filtering latency
- contact misclassification

If you can remove an explicit estimator, you simplify the stack.

### Better alignment between training and deployment

If the estimator is imperfect, training on clean privileged state creates a gap. You can try to degrade the privileged state during training, but it is hard to model all real-world estimator failures.

Mixed-observation supervision instead teaches the policy to operate under the same sensor constraints it will face on hardware.

### Natural use of history

Many estimators are fundamentally about integrating history (IMU integration, contact events, phase detection). A diffusion sequence model that conditions on sensor histories is well-positioned to learn these dynamics.

## Where SCDP fits among other approaches

It helps to compare SCDP with a few common strategies.

### Strategy A: stack frames or use an RNN

You can treat partial observability by giving the policy a window of observations, possibly with recurrence.

This can work, but if the training target is only actions, the policy may still rely on shortcuts or fail to capture long-horizon latent state cleanly.

### Strategy B: train an explicit estimator

Explicit estimators are interpretable and can be verified in isolation. But they can be hard to make robust across terrain, impacts, and sensor drift.

### Strategy C: privileged training with domain randomization

You can randomize noise and try to teach robustness. But the failure modes of real estimators are often structured, and random noise is not always the right approximation.

### Strategy D: mixed-observation distillation

SCDP sits here. It still uses privileged information, but only as **supervision**, not as an inference-time input.

That makes privileged state a “teacher signal” rather than a runtime dependency.

## Practical takeaways if you are building real humanoid policies

Even if you never train a diffusion model, there are several transferable lessons.

### 1) Treat the observation interface as a contract

If your runtime robot cannot reliably measure a variable, do not let your model depend on it. If you must use it, use it as supervision, not input.

Restricted denoising is a concrete implementation of this philosophy.

### 2) Prevent train deploy context mismatch

History windows are a common source of silent failure. Build the exact same context assembly code for training and deployment, and test it.

SCDP’s emphasis on context distribution alignment is a good reminder that “sequence model + robotics” is full of these sharp edges.

### 3) Measure control-rate viability early

A method that works at 50 Hz in real robot locomotion is in a different category than a method that works in a slow simulation loop.

### 4) Distill trajectories, not only actions

If you have access to a good expert, supervising trajectories can encourage internal dynamics models. It can also help with smoother control and better stability.

## Limitations and open questions

SCDP is promising, but there are still questions you should keep in mind.

### Data collection and coverage

Locomotion controllers can look great until you hit an out-of-distribution event: a slip, a stumble, a shove, a surface transition. The paper’s performance depends on the diversity and quality of the offline dataset.

### Generalization beyond the trained robot and morphology

Humanoid dynamics differ across platforms. How much of the learned implicit state estimation transfers across robots is unclear.

### Safety and verification

Removing an explicit state estimator can make debugging harder. If a robot falls, was it because the implicit state estimate was wrong, because the diffusion sampler produced a bad mode, or because of a low-level actuation issue.

In practice, you may still want some lightweight estimators for monitoring and safety.

### Sample efficiency and compute

Diffusion inference can be compute-heavy depending on the number of denoising steps. Achieving 50 Hz implies careful engineering, and the compute budget may not be trivial for embedded systems.

## What I expect next

If you buy the premise of SCDP, the next wave of work should focus on:

- pushing mixed-observation distillation into more contact-rich behaviors beyond steady locomotion
- combining these policies with explicit safety layers (for example, constraint-based filters) while keeping the sensor-only interface
- scaling datasets toward “real-world humanoid trajectories” rather than simulation-only expert rollouts
- improving inference efficiency so the approach runs comfortably on robot-grade compute

## References

- SCDP: Learning Humanoid Locomotion from Partial Observations via Mixed-Observation Distillation (arXiv:2603.09574)
  - https://arxiv.org/abs/2603.09574

- Diffusion Policy: Visuomotor Policy Learning via Action Diffusion
  - Project: https://diffusion-policy.cs.columbia.edu/
  - Paper (IJRR 2024): https://arxiv.org/abs/2303.04137v5
