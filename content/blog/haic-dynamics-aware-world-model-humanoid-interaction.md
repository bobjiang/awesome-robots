---
title: "HAIC: A Dynamics-Aware World Model for Humanoid Object Interaction"
slug: "haic-dynamics-aware-world-model-humanoid-interaction"
date: "2026-02-24"
author: "bob-jiang"
category: "tutorials"
tags: ["humanoid robots", "world models", "robot control", "proprioception", "contact dynamics", "reinforcement learning"]
excerpt: "HAIC shows how a dynamics-aware world model can help humanoids interact with underactuated objects (like skateboards and carts) using only proprioception and a grounded dynamic occupancy map."
featured: true
published: true
seo:
  title: "HAIC World Model for Humanoids: Underactuated Object Control"
  description: "HAIC introduces a dynamics-aware world model that predicts object motion from proprioception, builds a dynamic occupancy map, and enables humanoids to skateboard and push carts robustly."
  keywords: ["HAIC", "dynamics-aware world model", "humanoid robot control", "underactuated object", "dynamic occupancy map", "proprioception"]
---

## Introduction

Humanoid robots are finally getting good at **whole-body, contact-rich tasks**: carrying boxes, opening doors, and manipulating tools while staying balanced. But there’s a category of tasks that remains deceptively hard:

- objects that **aren’t rigidly attached** to the robot,
- objects that are **underactuated** (the robot can’t directly command their full state), and
- objects that have **non-holonomic constraints** (e.g., wheels that roll forward but don’t slide sideways).

Think: pushing a heavy cart, pulling a suitcase, or even **skateboarding**. In these cases, the object’s dynamics fight you. Contacts are intermittent. The object can drift into blind spots. And the robot’s control policy has to reason about *what the object is doing now* and *what it will do next*—often without clean external state estimation.

A February 2026 paper proposes a compelling approach: **HAIC (Humanoid Agile Object Interaction Control via Dynamics-Aware World Model)**, a framework designed to make these “humanoid + underactuated object” interactions robust *without external state estimation*, using primarily **proprioceptive history** and a clever representation called a **spatially grounded dynamic occupancy map**.

- Paper: **“HAIC: Humanoid Agile Object Interaction Control via Dynamics-Aware World Model”** (arXiv:2602.11758)
- Project page: https://haic-humanoid.github.io/
- arXiv: https://arxiv.org/abs/2602.11758

This post breaks down the core idea, why it matters, and how to think about it in the broader trend toward **world-model-driven physical AI**.

---

## The real problem: “HOI” is often easier than it looks

The paper points out an uncomfortable truth: a lot of humanoid “human-object interaction” (HOI) research implicitly assumes the object is either:

1) **fully actuated** (the robot can effectively command the important degrees of freedom), or
2) **rigidly coupled** to the robot (e.g., grasped firmly), or
3) **easy to estimate** via external sensing (motion capture, markers, overhead cameras).

But with carts, skateboards, and other rolling objects, you get extra failure modes:

- **Coupling forces**: a small error in pushing direction can torque the robot or whip the object.
- **Occlusions / blind spots**: the object drifts out of view (or never was in view).
- **Non-holonomic constraints**: the object responds in constrained ways (rolling vs sliding), so a naive control signal causes instability.
- **Distribution shift**: the moment the policy explores a new behavior, your estimator/model can become wrong.

HAIC’s pitch: build a **dynamics-aware world model** that *adapts online* to the policy’s behavior and provides the policy with a grounded representation it can use to infer collision boundaries and contact affordances—even when the object is partly “invisible.”

---

## HAIC in one sentence

**HAIC predicts high-order object motion (velocity, acceleration) from proprioceptive history, projects that prediction into a geometric prior to create a dynamic occupancy map, and trains a policy with asymmetric fine-tuning so the world model continuously adapts to the policy’s exploration.**

That sentence hides three key design choices. Let’s unpack them.

---

## 1) Predicting object dynamics from proprioception (no external estimator)

The first ingredient is a **dynamics predictor** that estimates *high-order* object state—specifically including **velocity** and **acceleration**—using only the robot’s **proprioceptive history**.

Proprioception usually includes signals like:

- joint positions/velocities,
- IMU measurements,
- contact forces/torques (depending on the platform),
- foot pressure/contact state,
- sometimes motor currents.

Why might this work?

Because when a humanoid pushes or pulls something, the object “talks back” through the robot:

- the push resistance shows up as torques,
- rolling friction changes the required effort,
- inertial loads show up when the object accelerates,
- micro-slips and impacts show up as high-frequency signatures.

In other words, the robot can treat the object as something it can *feel*, not only something it must *see*.

This is a strong bet: it’s basically saying **“state estimation through contact is viable at scale.”** And if it’s true, it’s a big deal for real-world deployments where clean tracking is rare.

---

## 2) Turning predictions into a “spatially grounded dynamic occupancy map”

Predicted velocities and accelerations are useful, but policies usually benefit from **spatial representations**:

- Where is the object relative to the robot?
- What space might it sweep through next?
- Where are collision boundaries and safe margins?

HAIC’s solution is to **project predicted dynamics onto static geometric priors** to form a **dynamic occupancy map**.

Intuition:

- You start with some knowledge of the object’s **shape** (or at least a geometric prior).
- You combine it with predicted motion (including high-order terms).
- You get a representation of **where the object is and where it is going**, grounded in real space.

The abstract emphasizes that this map helps the policy infer:

- collision boundaries,
- contact affordances,
- and crucially, what’s happening in **blind spots**.

If you’ve worked with robotics stacks, this should feel like a cousin of:

- occupancy grids in navigation,
- signed distance fields in manipulation,
- reachability envelopes in planning.

But the twist here is that it’s not only “what is occupied right now”—it’s “what will be occupied *soon*, given predicted dynamics.”

That’s what makes it potentially useful for agile interactions like skateboarding, where a slight delay in reacting can be catastrophic.

---

## 3) Asymmetric fine-tuning: let the world model chase the policy

One of the hardest problems in learning-based control is **non-stationarity**:

- When you update the policy, the distribution of states changes.
- Estimators trained on “old behavior” can degrade.
- Models become wrong in exactly the situations where the policy is exploring.

HAIC addresses this using **asymmetric fine-tuning**, described as:

> “a world model continuously adapts to the student policy's exploration, ensuring robust state estimation under distribution shifts.” (paraphrased from the abstract)

You can think of this like a teacher-student setup where:

- the **student** is the policy that actually acts,
- the **world model** is being fine-tuned to track the student’s evolving behavior.

This is an underappreciated idea: in real robots, your perception/estimation stack is often *forced* to be robust to new behaviors. If your model can’t keep up, you end up either freezing exploration (bad) or crashing robots (worse).

Asymmetric fine-tuning is essentially saying: **don’t treat the model as fixed infrastructure—treat it as a component that must adapt alongside the policy.**

---

## What HAIC demonstrates (from the abstract)

The paper reports experiments on a humanoid robot across tasks including:

- **Skateboarding** (agile, dynamics-sensitive, non-holonomic object)
- **Cart pushing/pulling** under different loads (classic underactuated interaction)
- **Long-horizon box carrying** across varied terrain while predicting dynamics of *multiple objects*

The significance isn’t only “cool demos.” The broader point is that these tasks force a system to handle:

- inertial perturbations,
- variable mass and friction,
- intermittent contact and occlusion,
- and long-horizon planning/control.

If HAIC’s approach generalizes, it’s a strong template for “humanoid + real world objects” beyond lab-perfect conditions.

---

## Why this matters: the next bottleneck is interaction with the world, not just locomotion

Humanoid robotics has had a visible recent arc:

1) **Locomotion** improved (learned gaits, robust balance, better hardware).
2) **Manipulation** improved (better hands, better policies, more data).
3) Now the bottleneck is **interaction with underactuated, messy objects** in unstructured environments.

Underactuated object interaction is where “robotics meets physics” in the most annoying way:

- A door hinge is non-holonomic.
- A suitcase has wheels.
- A shopping trolley has caster dynamics.
- A pallet jack is basically a dynamics puzzle.

If you want humanoids in homes and warehouses, this is unavoidable.

HAIC’s core philosophy—**predict dynamics through proprioception, ground it spatially, and adapt the model online**—is a plausible path through that mess.

---

## A mental model: HAIC as a contact-centric world model

Here’s a practical way to categorize HAIC among world-model approaches.

Many world models in robotics prioritize vision:

- encode images into latent states,
- predict future latents,
- plan in latent space.

HAIC (at least from the abstract) is more **contact-centric**:

- the key signal is proprioception over time,
- the predictions are high-order motion of the object,
- the output is something the policy can use to avoid collisions and choose contacts.

That’s an important complement to vision-heavy methods, because a lot of real contact-rich interaction is **better sensed through forces** than pixels.

In manipulation, there’s a saying: *“vision gets you to the object; touch lets you finish the job.”* HAIC is effectively trying to formalize that for whole-body humanoid interaction.

---

## Limitations and open questions (what to watch next)

Even if HAIC works well in the paper, a few practical questions matter for real deployment:

### 1) How strong must the “static geometric priors” be?
If you need accurate CAD models of every object, it won’t scale. If coarse priors work (simple bounding shapes, approximate geometry), that’s much more deployable.

### 2) How does it handle changes in contact mode?
Underactuated objects often switch regimes:

- rolling → slipping,
- one wheel stuck,
- caster flip,
- object hits an obstacle.

A dynamics predictor needs to adapt quickly when physics changes. The asymmetric fine-tuning may help—but the stability and safety properties become crucial.

### 3) Sample efficiency and data requirements
Online adaptation is great, but robots are expensive. How much data is required to get robust predictions across loads, surfaces, and terrains?

### 4) Multi-object scaling
The abstract mentions long-horizon tasks predicting dynamics of multiple objects. That’s huge if true, but multi-object interaction is where combinatorics explode. The representation and training pipeline need to stay stable.

---

## Takeaways

- **Underactuated object interaction** is one of the most important “last-mile” problems for real humanoids.
- **HAIC** proposes a unified approach that does *not* rely on external state estimation.
- The key ingredients are:
  - a **proprioception-based dynamics predictor** (including velocity/acceleration),
  - a **spatially grounded dynamic occupancy map** built from motion + geometry priors,
  - and **asymmetric fine-tuning** so the world model adapts to the policy’s evolving behavior.
- The reported tasks (skateboarding, cart pushing/pulling, long-horizon carrying) are exactly the kind of physics-heavy challenges that separate “great demos” from “deployable robots.”

If you want a future where humanoids do useful work in human spaces, systems like HAIC—where contact, dynamics, and adaptation are first-class—are the direction to bet on.

---

## Sources

- Li et al., “HAIC: Humanoid Agile Object Interaction Control via Dynamics-Aware World Model” (2026), arXiv:2602.11758. https://arxiv.org/abs/2602.11758
- Project page: https://haic-humanoid.github.io/
