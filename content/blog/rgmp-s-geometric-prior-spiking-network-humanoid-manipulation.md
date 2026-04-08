---
title: "RGMP-S Explained: Geometric Priors + Spiking Features for Generalizable Humanoid Manipulation"
slug: "rgmp-s-geometric-prior-spiking-network-humanoid-manipulation"
date: "2026-04-09"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "humanoid robots", "imitation learning", "vision-language models", "spiking neural networks", "multimodal policy"]
excerpt: "A practical breakdown of RGMP-S (arXiv:2601.09031): how lightweight geometric priors can ground VLM reasoning, and how spiking feature learning can improve data efficiency for robot manipulation."
featured: true
published: true
seo:
  title: "RGMP-S: Geometric Priors + Spiking Features for Humanoid Manipulation"
  description: "Learn how RGMP-S grounds VLM planning with geometric priors and uses spiking feature learning to improve data efficiency and generalization in humanoid manipulation."
  keywords: ["RGMP-S", "humanoid manipulation", "geometric priors", "spiking neural network", "vision-language model", "robot imitation learning"]
---

## The problem: humanoid manipulation fails in two boring, expensive ways

Humanoid manipulation looks like a single capability (pick up objects, open doors, use tools), but it keeps failing in **two very different layers**:

1. **High-level reasoning isn’t physically grounded.** A vision-language model (VLM) can explain what to do in English, but it may still pick a plan that is impossible given reachability, occlusions, or object geometry.
2. **Low-level action learning is data hungry.** Even when you know the right plan, turning it into stable long-horizon motion typically takes a lot of demonstrations or reinforcement learning rollouts.

The paper **“Generalizable Geometric Prior and Recurrent Spiking Feature Learning for Humanoid Robot Manipulation”** proposes a framework called **RGMP-S** that attacks both layers at once.

Primary source:
- arXiv:2601.09031 — “Generalizable Geometric Prior and Recurrent Spiking Feature Learning for Humanoid Robot Manipulation” (Jan 2026): https://arxiv.org/abs/2601.09031

Code (per authors):
- https://github.com/xtli12/RGMP-S

## What RGMP-S is (in one sentence)

**RGMP-S = a multimodal policy stack where a VLM selects long-horizon skills using explicit geometric priors, and a spiking-inspired recurrent module distills interaction dynamics for data-efficient action generation.**

That sentence is dense, so let’s unpack it into the two key contributions:

- **Long-horizon Geometric Prior Skill Selector** (planning / skill selection)
- **Recursive Adaptive Spiking Network** (representation learning for action generation)

## Part 1: Geometric priors that force the planner to respect reality

A lot of modern “VLM + robot policy” systems implicitly assume the VLM will infer the geometry from pixels.

In practice, that’s fragile:
- the VLM may “know” what a mug is but not its **exact pose**
- it may hallucinate affordances (a handle you can’t actually grasp)
- it may choose a subgoal that is semantically correct but **kinematically unreachable**

### RGMP-S’s bet: don’t ask the VLM to be a geometry engine

Instead of trying to make the VLM learn perfect 3D geometry end-to-end, RGMP-S injects **lightweight 2D geometric inductive biases** that help convert language goals into **spatially consistent constraints**.

The paper frames this as grounding high-level reasoning in “physical reality” by aligning:
- **semantic intent** (what the instruction wants)
- with **spatial constraints** (what is physically possible)

### How this typically looks in a real robot stack

Even if the paper’s details are specific, the pattern is broadly useful:

1. **Parse the instruction** into a structured goal (object of interest, target region, constraints)
2. **Extract geometry cues** from the scene that are cheap but informative (bounding boxes, keypoints, 2D relations like left-of / inside / overlap)
3. **Score candidate skills/subgoals** by combining semantic relevance and geometric feasibility

In other words: make the planner answer two questions, not one.

- “Does this skill match the instruction?”
- “Is this skill feasible given the observed geometry?”

### Why 2D priors can be enough

2D geometry sounds like a downgrade from “full 3D scene understanding,” but it often gives you the constraints you actually need:

- relative ordering: in-front-of / behind
- proximity: near / far
- containment: in-bounds, inside a region
- occlusion indicators: overlaps that suggest hidden grasp points

For many manipulation tasks, those are the difference between:
- choosing a grasp that exists
- choosing a grasp that only exists in the model’s imagination

## Part 2: Spiking feature learning for sample-efficient action generation

Once a high-level skill is selected, the system still needs to generate long-horizon motion.

This is where many approaches fall apart:
- behavior cloning overfits to small demos
- policies become brittle under slight changes
- temporal credit assignment gets messy (especially with contact)

### RGMP-S’s bet: treat interaction as an event-driven temporal process

The paper introduces a **Recursive Adaptive Spiking Network** designed to improve:

- **spatiotemporal consistency** (actions don’t jitter or drift over time)
- **long-horizon feature distillation** (retain what matters across many steps)
- **data efficiency** (learn from fewer demos without collapsing)

Spiking networks (broadly) are known for:
- event-driven computation
- temporal dynamics baked into the representation
- efficiency and robustness in some settings

RGMP-S uses “spiking features” as a way to parameterize **robot-object interaction dynamics**, rather than relying only on standard continuous activations.

### Why this matters specifically for contact-rich manipulation

Contact introduces discrete-ish events:
- first touch
- slip onset
- object lifts off
- collisions

Even if your sensors are continuous, the *useful structure* often has event-like moments.

A representation that’s good at:
- compressing long temporal windows
- and emphasizing meaningful state changes

can make the downstream policy easier to learn (and harder to overfit).

### Recursive/adaptive = the practical part

In practice, “spiking features” alone aren’t magic. The more important idea is the **recursive distillation**:

- reuse hidden state across time
- adapt to different phases of the task
- keep the model from memorizing a small set of trajectories

If you’ve trained imitation policies before, you’ll recognize the pain RGMP-S is targeting:

- policy works for the demo start state
- diverges after a few seconds
- never recovers because errors compound

Anything that stabilizes the internal temporal features is valuable.

## Putting it together: an end-to-end view of RGMP-S

A helpful way to think about RGMP-S is a two-stage loop:

1. **Skill selection (slow time scale)**
   - interpret instruction + scene
   - apply geometric priors
   - select the next skill / subgoal
2. **Motion synthesis (fast time scale)**
   - execute the selected skill
   - use spiking/recurrent features to maintain temporal consistency
   - observe outcomes and transition to the next skill

This “slow planner / fast controller” structure is common.

What’s new here is the paper’s claim that both halves become more generalizable when:
- planning is constrained by cheap, explicit geometry
- control is stabilized by an interaction-aware temporal representation

## Where RGMP-S fits vs the current trend (VLA end-to-end policies)

There’s a strong industry trend toward **single giant policies** (VLA models) that map images + text straight to actions.

That’s attractive because it’s simple to deploy.

But the downside is also simple:
- when it fails, it fails opaquely
- it needs a lot of data to become robust

RGMP-S is a more “systems” take:

- add explicit structure where the model tends to hallucinate (geometry)
- add temporal bias where the model tends to overfit (contact dynamics)

My take: this is the more realistic path for humanoids in 2026.

End-to-end will win eventually, but right now most teams still need:
- interpretable constraints
- modular debugging
- ways to reduce demo requirements

## Practical lessons you can steal even if you do not implement RGMP-S

### 1) Ground language planning with cheap geometry, not perfect 3D

You probably do not need dense 3D reconstruction to improve success rate.

Try this first:
- detect objects
- compute relative 2D spatial relations
- forbid obviously impossible subgoals

This is the highest ROI “anti-hallucination” layer for many VLM planners.

### 2) Long-horizon manipulation is a temporal representation problem

If your policy jitters, stalls, or drifts, it’s often not “the robot is hard.”

It’s that your model:
- cannot remember the right features long enough
- or remembers the wrong features too strongly

Recurrent state + interaction-aware features (spiking or not) is a direct fix.

### 3) Evaluate on heterogeneity, not just more tasks in one simulator

The paper reports experiments across:
- a simulation benchmark (ManiSkill)
- multiple real robot platforms (including a custom humanoid, per abstract)

That matters because generalization failures are often *robot-specific*:
- different compliance
- different camera placement
- different latency

If your approach only works on one platform, it’s not generalizable.

## Limitations and open questions (what I would check before believing it)

Based on the abstract and the typical failure modes in this space, the key questions to validate are:

- **Ablations:** how much does the geometric prior contribute vs the spiking module?
- **Compute/latency:** can the full loop run at real-time rates on embedded hardware?
- **Failure cases:** does it degrade gracefully, or does the planner/controller mismatch cause cascading failures?
- **Data scaling:** does the spiking feature learning still help when you have a lot more demos?

These do not invalidate the approach, but they determine whether you ship it.

## A concrete implementation sketch (if you want to try this idea this week)

You do not need to reproduce RGMP-S exactly to benefit from its structure. Here is a minimal “RGMP-S shaped” prototype you can build:

1. **Perception**
   - Run object detection + segmentation (or even just boxes).
   - Derive simple 2D relations: overlap, relative depth cue (size), left/right, inside/outside a ROI.

2. **Skill library**
   - Define 5–15 parameterized skills (reach, grasp, lift, place, open/close, push, pull).
   - Make every skill declare its *preconditions* (object visible, handle exposed, target region free).

3. **Language-to-skill selection**
   - Prompt a VLM/LLM to propose a short list of candidate skills and arguments.
   - Hard-filter candidates using your geometric preconditions.
   - Soft-rank what remains using semantic similarity.

4. **Controller / policy**
   - Start with a recurrent policy (GRU/LSTM) trained on demonstrations.
   - If you want the “spiking flavor,” add an auxiliary event-like channel: contact on/off, slip indicator, force threshold crossings.
   - Train with strong regularization (dropout, noise injection, action smoothing) to reduce overfitting.

Even this stripped-down version will usually outperform “pure prompting + end-to-end BC” once tasks get longer than ~10–20 seconds.

## Conclusion

RGMP-S is interesting because it is not trying to brute-force humanoid manipulation with more parameters.

It is instead doing two “grown-up robotics” things:

- **planning:** constrain language reasoning with explicit geometric feasibility
- **control:** encode interaction dynamics with a temporal representation that resists overfitting

If you are building a humanoid manipulation stack today, this is a solid template:

- give the planner a geometry filter
- give the controller a memory that respects contact events

And then iterate relentlessly on the messy real-world edge cases.

---

### References

- Xuetao Li et al. “Generalizable Geometric Prior and Recurrent Spiking Feature Learning for Humanoid Robot Manipulation.” arXiv:2601.09031 (2026). https://arxiv.org/abs/2601.09031
- RGMP-S code repository (per authors): https://github.com/xtli12/RGMP-S
