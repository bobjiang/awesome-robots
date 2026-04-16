---
title: "SeedPolicy Explained: Horizon Scaling with Self-Evolving Diffusion Policies for Robot Manipulation"
slug: "seedpolicy-horizon-scaling-self-evolving-diffusion-policy"
date: "2026-04-16"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "imitation learning", "diffusion policy", "robot manipulation", "long-horizon", "attention", "embodied AI"]
excerpt: "SeedPolicy adds a self-evolving gated attention memory to diffusion policies so robots can use longer observation histories without performance collapse."
featured: true
published: true
seo:
  title: "SeedPolicy Explained: Long-Horizon Diffusion Policy for Robots"
  description: "A deep dive into SeedPolicy and its Self-Evolving Gated Attention (SEGA) module, enabling diffusion policies to scale to long observation horizons for robot manipulation."
  keywords: ["SeedPolicy", "diffusion policy", "imitation learning", "robot manipulation", "long-horizon robotics"]
---

## Introduction

Diffusion policies have become one of the most reliable ways to do high-quality robot imitation learning: instead of predicting a single next action, they generate an *action trajectory* by denoising from noise toward a plausible expert-like sequence. That generative framing handles multi-modality well (there are often multiple “correct” ways to complete a task) and tends to produce smooth, stable motions.

But there is an awkward, counterintuitive failure mode that shows up when you try to make diffusion policies “more informed” by giving them *more history*.

In principle, longer observation windows should help:

- the robot can infer intent (what is being attempted),
- disambiguate partial views and occlusions,
- understand contact dynamics and cause/effect over time,
- and recover from errors with context.

In practice, many diffusion-policy implementations treat the observation history as a simple stack of frames (or tokens). As you increase the horizon, performance can actually degrade sharply.

A March 2026 arXiv paper, **SeedPolicy: Horizon Scaling via Self-Evolving Diffusion Policy for Robot Manipulation**, makes this failure mode the central problem and proposes a clean fix: add a *temporal module* that maintains a compact, evolving memory of the past, and gate that memory so irrelevant frames do not pollute it.

- Paper: https://arxiv.org/abs/2603.05117
- Project code: https://github.com/Youqiang-Gui/SeedPolicy

This post breaks down what SeedPolicy changes, why “horizon scaling” is harder than it sounds, and how you can think about its Self-Evolving Gated Attention module (SEGA) as a pragmatic middle ground between full Transformer attention over long sequences and classic recurrent networks.

## The real problem: why longer horizons can make diffusion policies worse

### Frame stacking is not temporal modeling

A common pattern for vision-based policies is:

1. collect the last *H* RGB frames (and maybe proprioception),
2. encode each frame with a CNN or vision backbone,
3. concatenate (or stack) the features,
4. feed them into a policy network.

That pipeline gives the policy “access” to history, but it does not force the network to build a structured temporal representation. Worse, when *H* becomes large, the model gets flooded with redundant information:

- stationary backgrounds,
- repeated near-identical frames,
- sensor noise,
- irrelevant motion (camera shake, people walking by),
- and long stretches where nothing meaningful happens.

The SeedPolicy authors show a striking effect: diffusion policy success rates can drop as the observation horizon grows, to the point that large horizons can drive success toward zero on some tasks (see their horizon-scaling analysis in the paper’s introduction).

### “Temporal sparsity” makes naive attention brittle

Even if you add attention over frames, you run into two practical issues:

- **Computational cost:** full attention scales roughly with the square of the sequence length, which hurts real-time control.
- **Noise sensitivity:** attention can happily attend to the wrong frames. If irrelevant frames dominate, the model can lose the few key moments that matter (contact onset, grasp alignment, object slip, etc.).

Robotic manipulation often has *temporally sparse* decisive moments. Most frames are boring; a few are critical.

So the question becomes:

> How do we give a diffusion policy a long memory without paying quadratic attention cost and without letting noise wreck the memory?

SeedPolicy’s answer is: keep a **fixed-size latent state** that evolves over time, update it with **attention**, and use **gating** to suppress irrelevant information.

## Quick refresher: what a diffusion policy is (in robotics terms)

A diffusion policy (DP) typically does something like:

- Condition on recent observations (images + robot state).
- Initialize a chunk of actions as Gaussian noise.
- Iteratively denoise it with a neural network conditioned on observations.
- Output an action sequence (or “action chunk”) and execute the first step (or a few steps) before replanning.

This is attractive because:

- it models multi-modal behaviors (different valid strategies),
- it can generate smooth trajectories,
- it is relatively stable under distribution shift compared to brittle next-step regressors.

But the “conditioning on observations” part matters. If your conditioning representation is weak at temporal reasoning, the diffusion policy cannot take advantage of history.

## SeedPolicy in one line

**SeedPolicy = Diffusion Policy + a Self-Evolving Gated Attention memory (SEGA) that compresses long observation histories into a fixed-size evolving latent state.**

In the paper’s framing:

- SEGA is the temporal module.
- Adding SEGA to DP yields *Self-Evolving Diffusion Policy*, abbreviated **SeedPolicy**.

## The SEGA module: self-evolving memory with gated attention

SeedPolicy introduces a time-evolving latent state (think: a small “memory tensor”) that carries information forward.

At each timestep *t*:

1. You encode the current observation into feature tokens (from RGB + proprioception).
2. You update the latent state using attention between the state and current observation.
3. You apply a *gate* that uses attention maps as a regulator to prevent irrelevant information from being integrated.
4. You emit enhanced observation features that combine current perception with historical context.

Those context-rich features then condition the diffusion action generator.

### Why a fixed-size state matters

Instead of keeping all past frames, you keep a latent state of fixed shape.

That gives you:

- **bounded compute** per timestep (recurrent-style updates),
- a persistent summary of history,
- and a natural place to apply filtering and sparsification.

This is essentially the core idea behind recurrent networks, but implemented with modern attention blocks and explicit gating.

### Why “gating” is not a minor detail

If you always update your memory with whatever you see, the memory will drift.

In robotics, drift is fatal:

- occlusion frames can overwrite the true scene,
- background motion can look like object motion,
- minor lighting changes can accumulate,
- and repeated irrelevant tokens can dominate.

SeedPolicy’s **Self-Evolving Gate (SEG)** uses cross-attention patterns to decide how much of the new signal should modify the memory. In plain language:

- if current observations align semantically with what the model deems important, allow an update,
- if they look noisy or irrelevant, suppress the update.

That is a good fit for manipulation, where meaningful events are sparse and visually subtle.

## Why this helps “horizon scaling”

If your memory is stable and compact, you can increase the effective horizon without needing to attend over an ever-growing frame stack.

SeedPolicy claims to reverse the baseline trend:

- vanilla diffusion policy performance drops as horizon grows,
- SeedPolicy performance improves as horizon grows.

That is the kind of behavior you *expected* the baseline to have in the first place.

## Results (what SeedPolicy reports)

On the **RoboTwin 2.0** benchmark (50 manipulation tasks), the authors report:

- averaged across CNN and Transformer backbones,
- **36.8% relative improvement** in “clean” settings,
- **169% relative improvement** in randomized challenging settings,
- compared to the baseline Diffusion Policy.

They also compare against large vision-language-action (VLA) models (for example, RDT with ~1.2B parameters) and claim competitive performance with **one to two orders of magnitude fewer parameters**.

Source: SeedPolicy abstract and introduction (arXiv:2603.05117).

## How to think about SeedPolicy vs other approaches

### 1) Full Transformer over long history

Pros:

- maximum expressivity,
- can capture long-range dependencies.

Cons:

- compute and memory scale poorly,
- brittle under noise unless carefully regularized,
- often overkill for real-time robot control loops.

SeedPolicy keeps the *attention flavor* but bounds the sequence length via the latent state.

### 2) Classic RNN/LSTM/GRU

Pros:

- fixed compute per step,
- proven temporal modeling.

Cons:

- harder to train at scale for high-dimensional vision tokens,
- weaker inductive bias for selective retrieval than attention,
- can underperform on tasks requiring rich context routing.

SEGA looks like a modern “attention-based RNN,” with gates tuned for temporal sparsity.

### 3) Bigger foundation policies (VLA models)

Pros:

- broad generalization,
- can incorporate language supervision and large-scale data.

Cons:

- expensive,
- hard to deploy on edge,
- you often still need task-specific adaptation and careful safety constraints.

SeedPolicy’s pitch is: get long-horizon benefits without needing billion-parameter policies.

## Practical implications: where this could matter most

### Contact-rich manipulation

Insertion, tool use, and dexterous tasks rely on micro-events:

- contact onset,
- slip events,
- tiny pose corrections,
- compliant pushing.

These are exactly the moments that disappear in long, redundant observation stacks.

A gated memory can preserve the right signals instead of averaging them away.

### Partially observable scenes

If the gripper blocks the camera or the object goes out of frame temporarily, a persistent state helps the robot maintain beliefs about the scene.

### Real-world noise and domain randomization

SeedPolicy’s reported gains are especially large in randomized settings. That is what you want: robotics models usually look great in clean demos and then collapse in the messy world.

## Limitations and open questions (the stuff to be skeptical about)

SeedPolicy is compelling, but a few questions matter if you plan to bet on this direction:

1. **How stable is the memory under extreme shifts?**
   If the camera changes, lighting changes, or the background becomes dynamic, does the gate suppress too much or too little?

2. **How sensitive is SEGA to hyperparameters?**
   Gating often introduces tuning complexity. A gate that is too conservative prevents learning; too permissive causes drift.

3. **Does the approach transfer beyond the benchmark?**
   RoboTwin 2.0 is useful, but long-horizon real-world tasks often include interruptions, human interaction, and non-stationary dynamics.

4. **How does it compare to world-model-based memory?**
   Some groups push “world models” or latent dynamics models for long-horizon reasoning. SeedPolicy is not a world model; it is a policy-side temporal compressor. That distinction matters.

None of these are deal-breakers. They are the natural next evaluation steps for any new temporal architecture.

## A simple mental model: SEGA as a write-filtered scratchpad

If you want a mental model that is easier than equations:

- Imagine you have a scratchpad that can store a small set of key tokens about the world.
- Every timestep you can write new information.
- But you have a strict editor (the gate) that only allows writes that look relevant.
- The scratchpad is then used to condition the action generator.

That is basically what SeedPolicy implements.

## What to read next

If you want to go deeper, these sections of the paper are worth your time:

- the horizon scaling analysis (why baseline DP degrades),
- the SEGA design (how they implement the self-evolving gate),
- the benchmark breakdown by task category and difficulty.

Start here:

- SeedPolicy (arXiv): https://arxiv.org/abs/2603.05117
- HTML version (easy to skim): https://arxiv.org/html/2603.05117v2
- Code: https://github.com/Youqiang-Gui/SeedPolicy

## Conclusion

SeedPolicy is a nice reminder that “just add more context” is not a free win in robotics.

Long-horizon manipulation needs *structured temporal modeling*, and the best architectures usually do two things at once:

- **compress** history into a stable representation, and
- **filter** updates so noise does not drown signal.

By adding a self-evolving, gated attention memory to diffusion policies, SeedPolicy turns longer observation windows from a liability into an advantage. If you care about real-world manipulation, that is exactly the direction you want diffusion-based control to move.
