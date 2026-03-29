---
title: "General Action Expert: Why Action Foundation Models Could Be the Next Big Step for Humanoid Robots"
slug: "general-action-expert-foundation-model-humanoid-robot-titan-o1"
date: "2026-03-30"
author: "bob-jiang"
category: "news"
tags: ["humanoid robots", "robot learning", "teleoperation", "foundation models", "world models", "embodied AI", "motion capture"]
excerpt: "Westlake Robotics says its General Action Expert model lets a humanoid (Titan o1) mirror any operator in real time—here’s what that implies for scaling humanoid skills, and what still blocks mass adoption."
featured: true
published: true
seo:
  title: "General Action Expert: Action Foundation Models for Humanoids"
  description: "Westlake Robotics unveiled Titan o1 powered by its General Action Expert (GAE). Learn how action foundation models work, why they matter for scaling humanoid skills, and key limitations."
  keywords: ["General Action Expert", "GAE model", "Titan o1", "Westlake Robotics", "action foundation model", "humanoid robot teleoperation", "embodied intelligence"]
---

## A humanoid that mirrors you in milliseconds

A pattern is emerging in humanoid robotics: flashy demos aren’t the point anymore. The point is *transfer*—how quickly a robot can pick up a new behavior, and how reliably it can repeat it in the messy, unstructured real world.

On March 23–24, Chinese media outlets reported that Westlake Robotics (Hangzhou) demonstrated a humanoid robot called **Titan o1** controlled through a motion-capture suit. An operator waved, turned, and kicked a ball, and the robot mirrored the movements **in milliseconds**. The company says the core is a large model it calls **General Action Expert (GAE)**—described as a kind of “general-purpose cerebellum” for humanoid motion, with claims of real-time imitation and cross-robot deployment. 

If those claims hold up beyond a staged demo, they hint at a pragmatic route to “scaling” humanoid capabilities: not by solving household autonomy overnight, but by turning *human motion* into a reusable, compounding asset.

This post breaks down what an “action foundation model” is likely aiming to be, why real-time imitation matters, how it could connect to the world-model wave, and what still blocks a true mass-adoption moment.

## What Westlake is claiming (and what we can infer)

Based on the reports, Westlake Robotics’ demo includes four key claims:

1. **Real-time imitation**: Titan o1 maps an operator’s motion-capture inputs to robot joint-level actions with very low latency.
2. **Generalization to different operators**: the system adapts even when different people wear the suit and move differently.
3. **One-to-many operation**: one person can “operate” multiple robots performing the same task simultaneously.
4. **Cross-embodiment capability**: the GAE model can be deployed to robots with different structures and sizes.

The last two are the big ones.

Real-time teleoperation itself isn’t new—industrial arms, drones, and humanoids have all used it for years. What’s new is the *ambition* to make the mapping sufficiently universal that it can be reused across:

- different humans (different heights, limb proportions, motion style), and
- different robots (different kinematics, joint limits, actuation, balance constraints).

In other words: not just “remote control,” but a *learned translation layer* between humans and machines.

## Why “action foundation models” are a logical next step

Most readers have heard of foundation models for text (LLMs) and vision (ViTs). In robotics, the analog is a model that can represent *actions* and *control* across many tasks.

There are two deep reasons action foundation models are attractive:

### 1) Data scaling is the bottleneck—and humans generate high-quality action data

Humanoids need enormous amounts of data to be robust. But collecting robot data is slow, expensive, and safety-limited.

Teleoperation flips the problem:

- you can record rich trajectories quickly,
- you can cover edge cases by having a human intentionally create them,
- you can label intent implicitly (what the operator is trying to do).

If the model can compress “human motion” into a reusable latent representation and then retarget it onto a robot, the operator becomes a scalable data generator.

### 2) Retargeting is hard—and the cerebellum metaphor is telling

The cerebellum metaphor is not accidental. In biology, the cerebellum is the part that makes movement smooth, stable, and fast—essentially a real-time control system that refines motion under constraints.

For humanoids, the equivalent constraints are brutal:

- balance and contact dynamics,
- joint limits,
- actuator saturation and delays,
- foot placement constraints,
- compliance and impact handling.

An “action expert” model that learns how to *turn high-level motion intent into stable robot actions* is exactly what many humanoid stacks are missing.

## Teleoperation isn’t the end goal. It’s a training pipeline.

A common mistake is to treat teleop as “not real autonomy.” That’s missing the point.

Teleoperation can be a bridge to autonomy in three phases:

1. **Imitate**: robot mirrors a human in real time.
2. **Replay**: robot repeats recorded behaviors reliably.
3. **Generalize**: robot executes behaviors from higher-level goals with reduced or no teleop.

Phase (1) generates data; phase (2) is a reliability test; phase (3) is the autonomy threshold.

If Westlake’s GAE genuinely reduces the engineering effort needed for phase (1) across multiple robots (“cross-embodiment”), it becomes a *platform* rather than a single demo.

## How could “cross-embodiment” work in practice?

Cross-embodiment is the hardest claim to take at face value, because different robots have different:

- degrees of freedom,
- contact geometry (feet vs wheels, hand design),
- torque limits,
- sensor suites,
- control frequency.

To make a single model portable, the system likely needs an intermediate representation—something like:

- a **task-space** target (end-effector poses, center-of-mass, footstep plan), or
- a **latent action space** that can be decoded by robot-specific adapters.

A plausible architecture is:

- **Human motion encoder**: turns mocap signals (poses, velocities) into a latent representation of intent.
- **General action model (GAE core)**: predicts next-step targets in that latent space conditioned on state.
- **Embodiment adapter**: maps latent targets into robot-specific joint commands with constraints.

This is similar in spirit to how many multi-robot learning systems handle “morphology” changes: shared backbone + per-robot heads.

If Westlake has built a good adapter layer, “one operator driving many robots” becomes realistic: the operator provides intent; each robot’s adapter handles its own dynamics.

## Where this fits in the bigger trend: world models and closed-loop control

In parallel, the robotics community is moving from purely reactive policies (“observation → action”) to systems that can *predict* and *plan*—often via world models.

A recent arXiv paper, **“Causal World Modeling for Robot Control”**, argues that video world models can provide a new foundation for robot learning by allowing the robot to “imagine” near-future states. Their proposed approach, LingBot-VA, uses an autoregressive diffusion framework to learn frame prediction and policy execution jointly, emphasizing:

- causal modeling (past → present → future),
- closed-loop rollouts with real observations,
- inference pipelines that overlap planning and execution.

Why bring this up in a post about GAE and Titan o1?

Because the two directions are complementary:

- **Action foundation models** (like GAE is aspiring to be) help translate intent into robust motion under constraints.
- **World models** help decide *what* action should happen next by anticipating consequences.

The most practical humanoid stacks will likely combine both:

1. A planner/world model to pick goals and anticipate contact dynamics,
2. An action expert to execute those goals with stability and high-frequency control.

## NVIDIA’s “world action model” framing is converging on the same idea

At NVIDIA GTC 2026, NVIDIA described a path toward generalized robot intelligence via “world foundation models” and “world action models,” including previews of a next-generation robot foundation model (GR00T N2) built on a world action model architecture. In NVIDIA’s framing, these models aim to improve success on new tasks in new environments compared to leading VLA approaches.

Whether you look at it from Westlake’s “general-purpose cerebellum” language or NVIDIA’s “world action model” language, the direction is similar:

- move beyond brittle, single-task controllers,
- build reusable action representations,
- scale skills through data and simulation,
- close the loop between prediction, planning, and execution.

The ecosystem is converging on a layered model stack rather than one monolithic “robot brain.”

## The real blocker isn’t motion. It’s reliability at scale.

Even if Titan o1 can mirror a human instantly, that doesn’t mean we’re two months away from home robots.

At the Boao Forum for Asia (Mar 25, 2026), industry leaders argued that a mass-adoption “ChatGPT moment” for humanoids could be anywhere from **two years to a decade**, with a recurring theme: **data scaling and reliability**.

The hard problems are boring but lethal:

- **Durability**: can the robot operate daily without frequent mechanical intervention?
- **Consistency**: can it repeat tasks thousands of times with low variance?
- **Safety**: can it handle unexpected contact, humans, and clutter?
- **Cost**: can the whole stack be cheap enough for broad deployment?
- **Trust and governance**: who is accountable when systems fail?

A robot that kicks a ball in a demo is not the same thing as a robot that works a warehouse shift.

## What to watch next (practical evaluation checklist)

If you want to separate meaningful progress from “teleop theater,” watch for these signals in follow-up releases:

1. **Latency and control rate**
   - What is the end-to-end latency (mocap → robot actuation)?
   - What control frequency does it run at?

2. **Contact-rich tasks**
   - Can it do tasks with sustained contact (pushing, lifting, opening doors), not just free-space gestures?

3. **Embodiment transfer demos**
   - Show the same GAE model driving robots with different kinematics.
   - Ideally: same operator, same intent, different robots.

4. **Autonomy creep**
   - Can the robot complete a task when teleop is intermittent?
   - Any “assistive” autonomy (stabilization, footstep correction) under teleop?

5. **Dataset and training disclosure**
   - What data was used? mocap only? robot trajectories? simulation?
   - Any open benchmarks or public model releases?

6. **Failure modes**
   - Does it fall? drift? saturate actuators? lose balance under perturbations?
   - How does it recover?

If Westlake can show (3) and (4) convincingly, “GAE” becomes more than branding.

## A likely near-term use case: one operator, many robots

The “one person operating multiple robots” line is worth highlighting because it’s a business model.

Think of it as **teleoperation at fleet scale**:

- A warehouse deploys 20 humanoids.
- A handful of operators supervise them.
- Operators step in for edge cases.
- The system records those interventions to reduce future interventions.

That’s not sci-fi—it’s a plausible intermediate stage between fully manual teleop and full autonomy.

In that world, an action foundation model is not a gimmick. It’s the interface that converts human expertise into a compounding dataset.

## Bottom line

Westlake Robotics’ Titan o1 demo, powered by its General Action Expert (GAE) model, is interesting not because teleoperation is new, but because **action representation** is becoming the next scaling frontier.

If action foundation models can:

- absorb diverse human motion,
- retarget it onto multiple embodiments,
- and provide robust stabilization under contact constraints,

then humanoid robotics gets a credible “data flywheel”: more operators → more trajectories → better action models → fewer interventions.

That still doesn’t guarantee a near-term “ChatGPT moment.” As the Boao discussion emphasizes, reliability, cost, and governance will likely define when humanoids go mainstream. But the direction is clear: the winning stacks will combine world modeling, simulation, and action experts into a system that can learn continuously—without breaking every time reality gets inconvenient.

## Sources

- People’s Daily Online (Xinhua): “Chinese company unveils humanoid robot powered by general action foundation model” (Mar 24, 2026) — https://en.people.cn/n3/2026/0324/c90000-20439255.html
- CGTN: “Chinese company unveils humanoid robot powered by general action foundation model” (Mar 24, 2026) — https://news.cgtn.com/news/2026-03-24/Chinese-company-unveils-humanoid-robot-powered-by-GAE-model-1LLWTAAAv1C/share_amp.html
- Channel NewsAsia: “ChatGPT moment for humanoid robots 2 to 10 years away, say Chinese tech leaders” (Mar 25, 2026) — https://www.channelnewsasia.com/east-asia/boao-humanoid-robots-ai-mainstream-challenges-risks-governance-6011081
- arXiv: “Causal World Modeling for Robot Control” (LingBot-VA) — https://arxiv.org/html/2601.21998
- Digital Engineering 24/7: “NVIDIA Extends Physical AI to Robotics” (GTC 2026 summary) — https://www.digitalengineering247.com/article/nvidia-extends-physical-ai-to-robotics
