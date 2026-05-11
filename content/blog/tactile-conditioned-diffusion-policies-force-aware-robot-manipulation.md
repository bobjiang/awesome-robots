---
title: "Tactile Conditioned Diffusion Policies: How Robots Learn Force Aware Manipulation"
slug: "tactile-conditioned-diffusion-policies-force-aware-robot-manipulation"
date: "2026-05-12"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "Diffusion Policy", "tactile sensing", "imitation learning", "manipulation", "force control", "embodied AI"]
excerpt: "A practical, system level explanation of how tactile conditioned diffusion policies model contact rich actions, and what it takes to deploy them on real robots."
featured: true
published: true
seo:
  title: "Tactile Conditioned Diffusion Policies for Force Aware Manipulation"
  description: "Learn how tactile conditioned diffusion policies represent contact rich actions, fuse touch with vision, and improve force aware robot manipulation in the real world."
  keywords: ["tactile diffusion policy", "force aware manipulation", "Diffusion Policy robotics", "tactile sensing", "robot imitation learning"]
---

## Introduction

Robot manipulation looks deceptively simple until the moment the robot touches something.

The instant contact happens, the task becomes dominated by **force**, **friction**, **deformation**, **stick slip**, **micro collisions**, and a pile of unmodeled physics. This is why a robot that can pick up a block reliably might still struggle with “boring” household actions like:

- pulling a tight drawer
- inserting a plug
- twisting a bottle cap
- picking up a soft sponge without crushing it
- sliding a mug across a table without tipping

For years, we tried to solve this mainly with better controllers and better models: impedance control, force torque sensors, analytic contact models, and ever more careful calibration.

A different approach has been gaining ground: **learn the behavior directly from demonstrations**, and use a generative model to represent the full distribution of plausible actions. In robotics, the most influential version of this idea is **Diffusion Policy** (Columbia) which frames action generation as a conditional diffusion process.

In this post, we go one level deeper:

- Why diffusion policies are a good fit for contact rich, multimodal control
- Why adding **tactile sensing** changes the game
- How “tactile conditioned diffusion policies” are usually built end to end
- Where they fail in practice (and what to do about it)

**Primary references (accessible sources):**
- Diffusion Policy project page: https://diffusion-policy.cs.columbia.edu/
- TacDiffusion (tactile diffusion policy): https://arxiv.org/html/2409.11047v2
- FARM / tactile conditioned diffusion policy (force aware manipulation): https://arxiv.org/abs/2510.13324

Note on sourcing: web sources available in this environment skew toward foundational pages and preprints rather than the very latest news. Where I generalize beyond the papers above, I’ll say so explicitly.

---

## 1) Why contact makes robot learning hard

Contact rich manipulation is hard for two fundamental reasons.

### A. The “state” is not fully observable
Vision can tell you where objects are, but it often cannot tell you:

- whether the object is already slightly jammed
- how much normal force the gripper is applying
- whether the fingertip is slipping
- if an insertion is aligned but binding

This hidden information matters because contact dynamics are discontinuous: a tiny geometry or force difference can flip the outcome.

### B. The action space is multi modal
Many tasks have *multiple valid action sequences*.

Example: turning a tight cap.

- Option 1: apply higher grip force and twist steadily
- Option 2: micro wiggle to break static friction
- Option 3: reposition fingers and then twist

A deterministic policy that outputs “the” action at each step often collapses toward an average behavior that is not actually stable in the real world.

This is exactly the kind of situation where generative modeling can shine.

---

## 2) Diffusion Policy in one mental model

If you’ve seen diffusion models for images, the core idea is the same.

- During training, you corrupt the target signal with noise.
- You train a network to denoise it step by step.
- At inference, you sample by starting from noise and denoising.

In **Diffusion Policy**, the “image” is not pixels. It is a **sequence of future actions**.

Instead of predicting a single next action, the model predicts a *chunk* (a horizon) of actions, which tends to improve smoothness and long horizon stability.

Reference: Diffusion Policy project page (with links to the paper and benchmarks): https://diffusion-policy.cs.columbia.edu/

### Why diffusion is attractive for manipulation

Diffusion based action generation has three properties that fit contact manipulation well:

1. **Multi modality**: sampling allows multiple plausible action futures.
2. **Implicit constraint satisfaction**: the model learns that “bad” action sequences are unlikely under demonstrations.
3. **Trajectory level reasoning**: predicting a horizon helps avoid greedy myopic actions.

But diffusion alone does not solve the observability issue. That is where tactile sensing comes in.

---

## 3) What “tactile conditioned” actually means

In robotics papers, “tactile conditioned policy” usually means:

- You add tactile observations (touch images, taxel arrays, deformation maps, or derived features) into the policy input.
- The policy learns to map (vision + proprioception + touch) → action sequence.

The key is that tactile signals provide **high bandwidth feedback during contact**.

Depending on the sensor, tactile inputs can encode:

- contact patch location and area
- shear direction (slip)
- local surface geometry
- deformation or pressure distribution

The practical implication: the policy can **close the loop on force without a force torque sensor at the wrist**.

---

## 4) Two representative designs: TacDiffusion and FARM

Different groups implement tactile diffusion policies in different ways, but two recent preprints illustrate the design space.

### A) TacDiffusion: force domain diffusion for precise tactile manipulation

TacDiffusion positions the diffusion model as a way to output actions that are precise under tactile feedback.

Source: https://arxiv.org/html/2409.11047v2

A useful framing from this line of work is:

- Vision is great for *approach* and *coarse alignment*
- Touch is great for *contact phase control*

So you often see a two stage behavior in the learned policy:

1. Move to contact (vision dominated)
2. Modulate forces / micro motions (tactile dominated)

### B) FARM: tactile conditioned diffusion policy for force aware manipulation

FARM (Force Aware Robotic Manipulation) builds an imitation learning setup where tactile data is used to infer tactile conditioned force signals, and the diffusion policy jointly predicts a richer action representation.

Source: https://arxiv.org/abs/2510.13324

Even if you do not adopt their exact architecture, there are two practical takeaways worth stealing:

- The **action space matters**. Representing actions as only end effector poses can be insufficient for force tasks.
- If your demonstrations include force intent (explicitly or implicitly), you need a representation that can express it.

---

## 5) The standard pipeline (what you actually build)

Here is a realistic, “system builder” view of the pipeline most labs end up with.

### Step 1: Choose your tactile representation

Common options:

- **Raw tactile images** (GelSight like sensors)
- **Taxel arrays** (pressure maps)
- **Compressed embeddings** from a tactile encoder
- **Hand engineered features** (contact centroid, slip estimate)

In practice, raw images are powerful but expensive. Many deployed systems end up with a learned encoder that produces a low dimensional latent.

### Step 2: Fuse modalities

Typical fusion layouts:

- early fusion: concatenate embeddings then feed a transformer or MLP
- late fusion: separate encoders then cross attention
- hierarchical: vision for scene, touch for contact, proprio for state

The important point is *timing*: tactile is most useful at contact, so you want the model to preserve high frequency tactile updates rather than average them away.

### Step 3: Decide the action parameterization

You need to decide what the diffusion model predicts. Options include:

- end effector delta pose (SE3)
- joint velocities
- gripper width
- gripper force (if the hardware supports it)
- hybrid control targets (position + impedance parameters)

FARM highlights this point explicitly by emphasizing grip force as part of the output representation.

### Step 4: Train with chunked horizons

Diffusion Policy style training often predicts action chunks:

- horizon length: e.g., 8 to 32 steps
- control frequency: depends on robot (10 to 30 Hz typical)

Chunking is not just an optimization trick: it can be the difference between a robot that “twitches” and one that behaves smoothly.

### Step 5: Deploy with a real time loop

At runtime you typically:

1. read sensors (vision, proprio, tactile)
2. compute embeddings
3. sample a diffusion action chunk (or denoise fewer steps)
4. execute the first action(s)
5. replan continuously

The performance bottleneck is sampling. Many real systems reduce diffusion steps, distill the model, or use smaller denoisers.

---

## 6) Where tactile diffusion policies break in the real world

The papers are impressive, but contact rich manipulation is brutal in deployment. Here are the failure modes you should expect.

### Failure mode 1: tactile distribution shift

Tactile sensors are sensitive to:

- wear and tear
- lighting (for vision based tactile)
- gel changes and contamination
- calibration drift

If the tactile observation distribution shifts, a policy can fail suddenly.

Mitigation ideas:

- augment tactile data aggressively (noise, blur, brightness changes)
- normalize per session
- periodic self calibration routines

### Failure mode 2: action ambiguity without explicit constraints

Diffusion sampling can produce multiple plausible actions. That is good, but in safety critical scenarios you need **constraints**.

Typical constraints:

- joint limits
- collision avoidance
- force or torque limits
- keep out zones

If you do not add a constraint layer, you rely on the training data to have “never done something unsafe,” which is not a great safety strategy.

### Failure mode 3: slow inference

If your diffusion sampling takes too long, you lose the ability to react to fast contact events (like slip).

Practical fixes:

- reduce denoising steps
- smaller model
- predict deltas at lower frequency but add a fast stabilizing controller

### Failure mode 4: demonstrations do not encode the right force intent

Human demos might succeed using subtle force strategies that are not captured by your sensors.

Example: a person “feels” a binding insertion and backs off slightly. If your tactile resolution is too low, the robot never sees the cue.

This is one of the strongest arguments for high resolution tactile sensors combined with a policy that can actually use them.

---

## 7) A practical design pattern: diffusion policy + fast inner loop

A reliable deployment pattern looks like this:

- diffusion policy proposes a trajectory chunk (macro behavior)
- a fast, classical inner loop enforces stability (micro behavior)

Think of diffusion as the “plan generator” and the inner loop as “contact stabilizer.”

This is not a cop out. It is a recognition that learned policies are rarely perfect at high frequency control.

If you are building a real product, this hybrid approach tends to ship faster than pure end to end.

---

## 8) What this means for the next 12 months of robot manipulation

The bigger trend is clear: robot learning is moving toward **policies that treat contact as first class**, and tactile sensing is one of the most direct ways to do that.

What I expect to matter most next:

1. **Standardized tactile datasets** (the equivalent of ImageNet for touch)
2. **Sensor robustness** (long term stability, cheap replacement, calibration)
3. **Compute efficient sampling** (distillation, fewer steps, better architectures)
4. **Safety layers** (constraint enforcement that does not destroy dexterity)

Diffusion policies gave robotics a strong generative backbone. Tactile conditioning gives that backbone a way to feel the world.

---

## Conclusion

Tactile conditioned diffusion policies are not just “Diffusion Policy plus an extra sensor.” They are a pragmatic answer to the hardest part of manipulation: making decisions under contact uncertainty.

If you take only one lesson from the papers: **force aware manipulation is primarily an observability problem**, and tactile sensing is the most information dense fix we have.

If you want to go deeper, start with the Diffusion Policy benchmark results to understand the baseline, then read TacDiffusion and FARM to see how tactile and force signals are integrated.

**Further reading:**
- Diffusion Policy: https://diffusion-policy.cs.columbia.edu/
- TacDiffusion: https://arxiv.org/html/2409.11047v2
- FARM: https://arxiv.org/abs/2510.13324
