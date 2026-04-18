---
title: "General Policy Composition: A Training-Free Way to Boost Diffusion Robot Policies at Test Time"
slug: "general-policy-composition-test-time-boost-diffusion-robot-policies"
date: "2026-04-18"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "diffusion policy", "policy composition", "VLA", "visuomotor learning", "test-time", "robomimic", "ICLR"]
excerpt: "A practical guide to test-time policy composition (GPC) and why score-level mixing can improve diffusion and flow-based robot control without collecting new data."
featured: true
published: true
seo:
  title: "General Policy Composition: Training-Free Diffusion Policy Boost"
  description: "Learn how General Policy Composition (GPC) improves diffusion and flow-based robot policies at test time by convex score composition, with practical implementation guidance."
  keywords: ["General Policy Composition", "GPC", "diffusion policy", "robot control", "test-time composition"]
---

## The uncomfortable truth about robot foundation models

Diffusion-based robot policies (and their cousins in flow matching and VLA models) are on a pretty predictable trajectory:

- They get better when you scale data.
- They get better when you scale compute.
- They get better when you scale model capacity.

And all three of those are expensive.

If you are training something like a vision-action (VA) policy or a vision-language-action (VLA) policy, you are paying for (1) robot time, (2) teleop time, (3) dataset cleaning, (4) simulation, (5) evaluation, and (6) the very real engineering cost of getting stable training runs.

So here is a question that has been quietly sitting in the background:

**Can we make robot diffusion policies better without training them again?**

A 2026 ICLR paper argues yes: by *composing* existing pre-trained policies at test time, at the level of diffusion “scores” (gradients of the log probability). The method is called **General Policy Composition (GPC)**.

This post explains what that means, when it helps, and how to think about implementing it in real robot stacks.

## Quick background: what a diffusion robot policy is actually doing

If you have not looked at diffusion policies since the hype wave, here is the key idea in plain language.

A diffusion policy treats action generation as a denoising process:

1. Start with a noisy action sequence (or a noisy trajectory).
2. Iteratively denoise it, conditioning on observations (images, proprioception, etc.).
3. Output a sequence of actions and execute them in a receding-horizon loop.

Diffusion Policy (Chi et al.) is the canonical reference here, and it popularized a very practical recipe:

- Use diffusion to model *multimodal* action distributions (so the policy can represent multiple valid ways to solve a task).
- Generate *action sequences* (not just one-step actions) and run them with **receding-horizon control**.
- Condition on vision and optionally other modalities.

The original Diffusion Policy project page is still one of the clearest summaries of why diffusion works well for visuomotor control, and it highlights the advantages around multimodality, high-dimensional action spaces, and training stability.

Sources:
- Diffusion Policy project page: https://diffusion-policy.cs.columbia.edu/
- arXiv: https://arxiv.org/abs/2303.04137

## The bottleneck: data is the currency, and robots are slow

If your policy underperforms in a new environment, you typically do one of these:

- Collect more demonstrations.
- Fine-tune with additional robot interaction.
- Add more simulation and try sim-to-real tricks.
- Do domain randomization.
- Do some form of adaptation.

All of those cost time and introduce operational risk.

GPC is interesting because it tries to shift the trade-off:

- **No new data.**
- **No new training.**
- **Only inference-time compute and some search over mixing weights.**

That does not mean it is “free” (inference becomes heavier), but it *is* a different knob to turn.

## What is “policy composition” in diffusion terms?

GPC’s framing is: many diffusion-based policies can be described as estimating a **score** (loosely: a gradient direction that tells you how to denoise toward higher-probability actions given the observation).

If you have multiple pre-trained policies, you can combine their scores.

### The simplest mental model

Assume you have two policies:

- Policy A: good at task structure but weak on some corner cases.
- Policy B: a different architecture or modality that covers those corner cases.

Instead of choosing one, GPC does something like:

- At each denoising step, compute both scores.
- Mix them with a convex combination.
- Use the mixed score to denoise.

In symbols (high-level):

- Score mix: **s = w·sA + (1 - w)·sB**, where **w** is between 0 and 1.

Then you generate an action trajectory using that mixed score.

This is conceptually similar to ensemble ideas in supervised learning, but the key difference is:

- You are composing the *generative dynamics* of a diffusion sampler.
- You are composing at the distribution level, not just averaging final actions.

## The 2026 twist: General Policy Composition (GPC)

The ICLR 2026 paper “Compose Your Policies!” proposes **General Policy Composition (GPC)** as a training-free framework.

Their claims (paraphrased, with the original wording worth reading) are:

- A proper convex composition of scores can yield a better “single-step” objective than either parent policy.
- Under stability assumptions (they reference a Grönwall-type bound), single-step improvements can propagate through the generation trajectory.
- In practice, this can improve success rate across benchmarks like Robomimic, PushT, and RoboTwin.

Source:
- arXiv: https://arxiv.org/abs/2510.01068
- Project page: https://sagecao1125.github.io/GPC-Site/

### Why “general”?

The “general” part matters because the authors position GPC as plug-and-play across:

- Vision-action (VA) and vision-language-action (VLA) policies
- Diffusion and flow-matching policies
- Different visual modalities (e.g., RGB vs point cloud, depending on the policy)

That is a stronger claim than “ensemble two diffusion policies with the same input.” It is essentially: **compose heterogeneous policies at test time**.

## When composition can help (and when it probably will not)

From an engineering standpoint, the biggest value of this line of work is not the specific math. It is the practical intuition:

**Different policies fail differently.**

If you have two policies whose errors are not perfectly correlated, mixing them can reduce failure probability.

### Good cases

GPC is most plausible when:

1. **Both policies are “okay,” not perfect.**
   If one is extremely weak, it can poison the mixture.

2. **They have complementary strengths.**
   Examples:
   - One policy trained on a broader dataset, another on a narrower but higher-quality dataset.
   - One policy conditioned on RGB, another on depth or point clouds.
   - One is a VLA that uses language context well, another is a VA that is very crisp on low-level manipulation.

3. **Your deployment environment is uncertain.**
   If you are dealing with variable lighting, clutter, or object variation, robustness is the entire game.

4. **You can afford the inference-time cost.**
   Composition means running multiple models (and potentially a search procedure) in the control loop.

### Bad cases

Composition is less likely to help when:

- One policy dominates the other (the weaker one mostly adds noise).
- The task requires very tight real-time latency and you cannot increase compute.
- The failure mode is systematic (e.g., both policies never learned the same concept).

A practical rule: **composition is not a substitute for missing skills.** It is a robustness and performance boost for skills you already have.

## How to implement GPC without hand-waving

Let’s translate “convex score composition + test-time search” into something you can actually wire up.

### Step 1: Standardize the action parameterization

If you want to combine policies, they must agree on:

- Action space (joint deltas, end-effector pose deltas, gripper control)
- Action horizon length
- Normalization and scaling

If they disagree, you will end up composing apples and forklifts.

### Step 2: Expose the score (or noise prediction) interface

In many diffusion implementations, the network predicts something like:

- ε (noise) or
- x0 (denoised target) or
- v (a reparameterization)

Your sampler then converts that into an update step.

To do composition, you need to:

- Run both networks at the same denoising step.
- Convert their outputs into the same score-like quantity (or mix in a consistent parameterization).

The GPC project page shows a simple mixing formula for noise prediction in one of their experiments:

- ε̂ = w1·εA + w2·εB

That is an implementation-friendly view: you can mix predicted noise and proceed with a standard sampler.

### Step 3: Choose a weight schedule

A fixed weight w is the simplest starting point, but it might not be optimal.

Two common strategies:

1. **Static mixture**
   - Choose a single w (e.g., 0.7) and keep it constant.
   - Pros: simple, stable.
   - Cons: may underperform.

2. **Search at test time**
   - Evaluate multiple w values (or a small schedule) and select what looks best.
   - Pros: can extract more gains.
   - Cons: adds compute, requires an evaluation signal.

That last part (evaluation signal) is the real engineering problem.

### Step 4: Decide how you will “score” candidate trajectories

To search over weights, you need a way to pick the best generated trajectory.

Options:

- **Model-based scoring**: use a learned value function or critic.
- **Heuristic scoring**: distance-to-goal, collision penalties, smoothness.
- **Language-conditioned scoring**: if you have language goals, you can score alignment.

If you do not have a scoring function, you can still use a static mixture and hope the ensemble effect helps.

### Step 5: Wrap it in receding-horizon control

Diffusion Policy’s receding-horizon approach is not just a detail; it is how you keep things stable:

1. Generate an action sequence.
2. Execute only the first k actions.
3. Observe the new state.
4. Re-plan.

Composition fits naturally here because:

- You can search more aggressively at a lower frequency (every re-plan), rather than every control tick.

## Practical deployment considerations

### Latency: do not destroy your control loop

If your base diffusion policy already runs near your compute limit, composing two or three policies will be painful.

Practical mitigations:

- Use smaller backbones for one component policy.
- Lower denoising steps (fewer diffusion iterations).
- Use asynchronous planning (generate trajectories on a separate thread and feed the controller).

### Safety: composition is not certification

If you are deploying on real hardware, you still need:

- Action bounds and joint limit checks
- Collision avoidance layers (even basic ones)
- Emergency stop integration
- Monitoring for divergence (e.g., high action variance)

Composition changes the action distribution; treat it as a new policy for safety purposes.

### Dataset bias: composition can mix biases too

If both policies were trained on similar demonstrations, they may share the same blind spots.

Composition is most useful when the policies were trained differently.

## Why this matters in the bigger “Physical AI” narrative

The last year of robotics discourse has been obsessed with “foundation models,” but there is a quieter engineering reality:

**Robots need reliability before they need generality.**

GPC is interesting because it is a reliability tool:

- It leverages multiple imperfect policies.
- It tries to reduce failure without retraining.
- It provides a clear interface for combining modalities and architectures.

Even if you never implement GPC exactly as described, the lesson sticks:

> If you can afford it, running multiple policies and composing them at inference can be a cheaper path to robustness than another month of data collection.

## A concrete workflow you can try this week

If you are building with an existing diffusion policy codebase:

1. Train or obtain two policies that differ meaningfully (modality, backbone, dataset, or conditioning).
2. Implement a sampler wrapper that:
   - runs both policies,
   - mixes predicted noise (or score) with a weight w,
   - generates trajectories.
3. Run offline evaluation on a benchmark you already use (Robomimic-style tasks are ideal).
4. Sweep w over {0.1, 0.3, 0.5, 0.7, 0.9}.
5. If you see a consistent lift, move to a small test-time search with a lightweight scoring function.

## References

- Chi et al., “Diffusion Policy: Visuomotor Policy Learning via Action Diffusion” (RSS 2023 / IJRR 2024)
  - https://arxiv.org/abs/2303.04137
  - https://diffusion-policy.cs.columbia.edu/

- Cao et al., “Compose Your Policies! Improving Diffusion-based or Flow-based Robot Policies via Test-time Distribution-level Composition” (ICLR 2026)
  - https://arxiv.org/abs/2510.01068
  - https://sagecao1125.github.io/GPC-Site/
