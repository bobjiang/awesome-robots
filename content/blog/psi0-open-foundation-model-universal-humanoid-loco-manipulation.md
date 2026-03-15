---
title: "Psi0: An Open Foundation Model for Universal Humanoid Loco-Manipulation"
slug: "psi0-open-foundation-model-universal-humanoid-loco-manipulation"
date: "2026-03-16"
author: "bob-jiang"
category: "tutorials"
tags: ["humanoid robots", "robot learning", "vision-language-action", "egocentric video", "diffusion policy", "loco-manipulation", "foundation models"]
excerpt: "A deep dive into the Psi0 paper and why its staged training recipe (human egocentric video pretraining plus a robot joint-space action expert) is a practical path to long-horizon humanoid loco-manipulation."
featured: true
published: true
seo:
  title: "Psi0 Foundation Model: Humanoid Loco-Manipulation Explained"
  description: "Learn how Psi0 trains a humanoid loco-manipulation foundation model using high-quality egocentric human video plus a joint-space action expert, enabling strong real-world performance with far less robot data."
  keywords: ["Psi0", "humanoid loco-manipulation", "humanoid foundation model", "egocentric video", "vision-language-action", "diffusion transformer policy"]
---

## The problem: why humanoid loco-manipulation is still hard in 2026

Humanoid robots can now *move* impressively: dynamic walking, running, balancing, even acrobatics. But put that same robot in a kitchen or a workshop and ask it to do something genuinely useful (open a fridge, pick up an object, carry it across the room, manipulate a door while staying balanced) and you hit a different class of problem: **loco-manipulation**.

Loco-manipulation is hard because it combines:

- **Whole-body balance** (foot contacts, base stability, disturbance rejection)
- **Dexterous manipulation** (hands, wrists, precise trajectories)
- **Long horizons** (multi-step plans with opportunities for compounding errors)
- **Partial observability** (occlusions, hands blocking view, cluttered scenes)
- **Embodiment constraints** (joint limits, torque limits, timing constraints)

The modern trend in robotics is to train large policies by scaling data and model capacity (think VLA and foundation-model-like approaches). But humanoid loco-manipulation data is painfully expensive to collect because it typically requires VR teleoperation, careful safety constraints, and a reliable full-body control stack.

That is the backdrop for a new paper that caught a lot of attention in March 2026:

- **Ψ0 (Psi0): An Open Foundation Model Towards Universal Humanoid Loco-Manipulation** (arXiv HTML version) — https://arxiv.org/html/2603.12263

Psi0 is interesting not just because it reports strong real-robot performance, but because it makes a clear argument that many current “scale everything together” recipes are **suboptimal** for humanoids.

## Psi0 in one sentence

**Psi0 decouples “learning what to do” from “learning how the humanoid should move”, by pretraining a VLM on high-quality egocentric human manipulation video and post-training a separate joint-space action expert on a much smaller amount of real humanoid trajectories.**

This staged approach is meant to avoid a common failure mode: a single monolithic model being forced to learn two fundamentally different action distributions (humans vs robots) at once.

## The key claim: scaling the wrong data wastes your budget

A lot of cross-embodiment robot learning tries to mix:

- Internet videos (noisy, uncontrolled)
- Human demos (different body kinematics and dynamics)
- Non-humanoid robot data (different embodiments)
- Humanoid robot teleop (expensive)

Psi0 argues that this mixture often leads to a model that is “big” but not “efficient”:

- The policy must simultaneously fit **human motion** and **humanoid joint control**
- The mapping between them is not just a simple domain shift, it is a *structural mismatch* (different degrees of freedom, timing, constraints)

Instead, Psi0’s recipe is:

1. **Pretrain a VLM backbone on high-quality egocentric human manipulation videos** to learn visual representations and task semantics.
2. **Post-train a separate action expert directly in humanoid joint space** using real humanoid trajectories.

The paper reports that this gets strong results with about **800 hours of human video** plus **30 hours of real robot data**, and claims it outperforms baselines trained with more than 10 times as much data (see abstract and introduction in the arXiv HTML page: https://arxiv.org/html/2603.12263).

## Architecture overview (conceptual)

Psi0 is easiest to understand as a two-part system:

### 1) A VLM backbone: learning task-level representations from egocentric video

The first stage is an autoregressive VLM (vision-language model) backbone trained to predict next-action tokens in a unified task space.

The goal here is not to output perfectly executable humanoid actions. It is to learn:

- Task semantics (“what is happening?”)
- Visual grounding (“where is the cup handle?”)
- Action intent priors (“what usually comes next in this task?”)

Egocentric video is a good fit for this because:

- It naturally captures hand-object interactions
- It reflects the kind of close-range manipulation scenes humanoids will face
- It scales better than humanoid teleoperation

### 2) A flow or diffusion-based action expert: learning embodiment-specific joint control

The second stage is the part most humanoid policies struggle with: producing stable, precise whole-body actions.

Psi0 trains a separate **flow-based action expert** (implemented as a multi-modal diffusion transformer variant) to output **joint-space action chunks** conditioned on features from the VLM backbone.

Two design choices are worth calling out:

- **Joint-space modeling:** it avoids having to predict human-wrist-space actions and then rely on inverse kinematics at inference time.
- **Action chunking:** predicting short sequences (chunks) tends to reduce jitter and makes the system more robust to inference latency.

In other words, the VLM gives you “what to do”, while the action expert gives you “how the humanoid should physically execute it”.

## Why joint-space post-training matters

Joint-space post-training is a direct response to an ugly reality: **humanoid control is less forgiving than tabletop arms**.

A bimanual arm on a fixed base can tolerate some policy noise. A humanoid cannot.

Typical failure modes include:

- Slight timing errors that shift the center of mass
- Hand contact forces that destabilize foot contacts
- Occlusions that cause grasp uncertainty
- Small joint errors that become large end-effector errors

By explicitly training a joint-space action expert on real humanoid trajectories, Psi0 tries to “lock in” the embodiment-specific dynamics that a generic VLM will not learn from human video.

## Real-time action chunking: the practical deployment trick

The paper also points out something practitioners learn the hard way: even a good model can look bad on hardware if inference latency causes micro-stutters.

Psi0 describes a real-time chunking approach that leverages a lower-body controller to keep the humanoid stable while the high-level model produces action chunks.

This is a reminder that production-grade robot learning is usually a **stack**, not a single end-to-end network:

- A learned policy for intent and manipulation
- Traditional control for stability and safety
- Scheduling tricks to handle compute latency

## Where this fits in the 2026 landscape

Psi0 sits at the intersection of three trends:

1. **Foundation models for robotics** (large-scale generalization via representation learning)
2. **Diffusion and flow policies** (generative action modeling, action chunking)
3. **Egocentric human data** as the scalable substitute for expensive robot teleop

If you have been following diffusion-based robot policies, you can see Psi0 as a humanoid-flavored continuation of the idea that generative models can represent multi-modal expert behavior.

A related March 2026 example on the locomotion side is **SCDP**, which also uses diffusion for humanoid control but focuses on removing privileged state requirements:

- **SCDP: Learning Humanoid Locomotion from Partial Observations via Mixed-Observation Distillation** — https://arxiv.org/html/2603.09574

SCDP’s headline is “deploy on a real Unitree G1 using only onboard sensors”, avoiding heavy state estimation. Different problem than loco-manipulation, but the theme is similar: diffusion policies are being redesigned to survive real robot constraints.

On the manipulation side, another recent paper argues that diffusion policies struggle with long observation horizons and proposes a recurrent temporal module:

- **SeedPolicy: Horizon Scaling via Self-Evolving Diffusion Policy for Robot Manipulation** — https://arxiv.org/html/2603.05117

Again, different setting, but the same underlying message: action generation is not enough; you need the right temporal and embodiment structure.

## A practical mental model: what Psi0 gets right

Even if you ignore all the paper-specific engineering details, Psi0’s staged recipe gives a strong “systems” lesson.

### Lesson 1: separate semantics from embodiment

Humans and humanoids may share tasks, but they do not share action distributions.

If you try to force a single model to represent both in one action space, you burn capacity and data on bridging the gap.

A staged pipeline lets you:

- Learn rich task and visual representations from scalable data (human egocentric video)
- Learn the embodiment-specific motor program from the scarce data (humanoid teleop)

### Lesson 2: quality beats quantity when you pick the right bottleneck

The paper explicitly claims that high-quality egocentric manipulation data is more valuable than huge quantities of noisy clips.

This is consistent with what we see elsewhere in AI: once you have enough data to learn a representation, the marginal value of additional low-quality data can be negative.

### Lesson 3: long-horizon humanoid tasks need more than “policy outputs actions”

Humanoid loco-manipulation is a long-horizon control problem with safety constraints. In practice, you want:

- Action chunking
- Latency-aware scheduling
- Stabilizing controllers for base and feet
- Fallback behaviors

Psi0 makes those stack components explicit, which is refreshing.

## What this could enable (if the open ecosystem ships)

Psi0 also promises to open-source:

- A data processing and training pipeline
- A humanoid foundation model
- A real-time action inference engine

If that release is complete and usable, it matters because it lowers the barrier to entry for researchers and builders who do not have the budget to collect massive humanoid teleop datasets.

The “open ecosystem” framing is particularly important for humanoids: without reproducible pipelines and deployable inference code, many papers remain “demo-only”.

## Limitations and open questions

The approach is compelling, but there are still practical questions you should keep in mind:

1. **Task coverage:** How broad are the loco-manipulation tasks? Pantry tasks are a great benchmark, but industry needs a long tail.
2. **Generalization vs robustness:** Do policies generalize to new objects and layouts, or do they mostly interpolate within a curated environment?
3. **Failure recovery:** Long-horizon tasks fail. How well does Psi0 recover after a slip, a dropped object, or a partial grasp?
4. **Hardware dependence:** How tied is performance to a specific humanoid platform, hands, or sensors?
5. **Data bottleneck remains:** 30 hours of humanoid data is much better than 300, but collecting stable full-body teleop is still non-trivial.

Still, as a direction, the staged recipe looks like the right kind of compromise between “foundation model scaling” and “hard realtime robotics constraints”.

## Takeaways

If you are building or evaluating humanoid robot learning stacks in 2026, Psi0 is worth reading for two reasons:

- It proposes a clean staged training strategy that respects the human-to-humanoid embodiment gap.
- It emphasizes deployment details (joint-space actions, action chunking, stability stack) that tend to dominate real-world performance.

Read the paper here:

- Psi0 (arXiv HTML): https://arxiv.org/html/2603.12263

And if you want related diffusion-policy reads from the same month:

- SCDP (humanoid locomotion from onboard sensing): https://arxiv.org/html/2603.09574
- SeedPolicy (horizon scaling for diffusion manipulation): https://arxiv.org/html/2603.05117
