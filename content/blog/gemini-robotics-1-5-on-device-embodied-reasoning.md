---
title: "Gemini Robotics 1.5 + ER 1.6: What DeepMind's New VLA Stack Changes for Real Robots"
slug: "gemini-robotics-1-5-on-device-embodied-reasoning"
date: "2026-05-26"
author: "bob-jiang"
category: "news"
tags: ["robotics", "AI", "VLA", "embodied AI", "DeepMind", "humanoid robots", "on-device inference", "robot manipulation"]
excerpt: "A practical breakdown of Gemini Robotics 1.5, ER 1.6, and the on-device variant—what they are, why they matter, and where the hard problems still are."
featured: true
published: true
seo:
  title: "Gemini Robotics 1.5: DeepMind's VLA stack for real robots"
  description: "Deep dive into Gemini Robotics 1.5, ER 1.6, and on-device VLA: capabilities, multi-step planning, dexterity, multi-embodiment transfer, and deployment tradeoffs."
  keywords: ["Gemini Robotics", "Gemini Robotics 1.5", "embodied reasoning", "vision-language-action", "VLA model", "on-device robotics AI", "robot dexterity", "humanoid robots"]
---

Google DeepMind just put a clear name and product surface on something robotics has been inching toward for years: a **general-purpose vision-language-action (VLA) stack** that can plan, talk, and *do* things across multiple robot bodies.

On the [Gemini Robotics page](https://deepmind.google/models/gemini-robotics/), DeepMind frames the system around three connected deliverables:

- **Gemini Robotics 1.5** — their most capable VLA model (see + understand + act).
- **Gemini Robotics-ER 1.6** — an “embodied reasoning” model focused on physical-world precision and planning.
- **Gemini Robotics On-Device** — a VLA variant optimized to run locally on robotic hardware.

This isn’t just branding. It’s a fairly explicit blueprint for how modern robot intelligence is going to ship: **(1) a general policy, (2) a reasoning/planning layer, and (3) a deployable local runtime for latency + privacy + reliability.**

Below is the practical breakdown: what’s genuinely new, what’s marketing, and what it changes for humanoids and industrial arms.

## 1) The core bet: one model, many robots

The page highlights “**multiple embodiments**” as a first-class capability: the same underlying model can adapt to platforms ranging from static bi-arm systems (like ALOHA-style setups), to industrial arms (Franka-style), to humanoids such as **Apptronik’s Apollo**.

DeepMind’s claim is not that the robot hardware differences disappear—obviously they don’t—but that a single learned policy can:

- map *similar intents* (e.g. “pack lunch”, “fold”, “sort”) onto different kinematics,
- reuse skills learned in one embodiment (say, a dual-arm tabletop system) to accelerate learning in another,
- and generalize better because it sees a broader distribution of physical interactions.

If that holds up beyond demos, it’s a big deal because robotics has been stuck in a painful loop:

1. Train a controller on Robot A.
2. Spend months porting it to Robot B.
3. Discover Robot B’s quirks force you to re-collect data anyway.

A “multi-embodiment” foundation model doesn’t eliminate Step 3, but it can reduce the *amount* of new data and engineering you need per platform.

## 2) What “agentic robotics” actually means (and why it matters)

DeepMind lists the system as **agentic**, meaning the robot can “natively call tools—like Google Search—look up information, and create step-by-step plans.”

Two things to notice here:

- **Tool use is a software architecture choice**, not a robotics breakthrough by itself.
- But in robotics, tool use is valuable because it’s a bridge between *open-world knowledge* and *closed-world execution*.

Example: a home robot might not know the best way to remove a specific stain. If it can search, ask a clarifying question, and then choose a safe action plan, that’s qualitatively different from a scripted task graph.

The catch: the moment you connect a robot to external tools, you inherit new failure modes:

- hallucinated “facts” becoming physical actions,
- unsafe plans due to incorrect assumptions,
- prompt injection via labels/screens/QR codes in the environment,
- and the worst one: the model sounding confident while being wrong.

DeepMind also emphasizes “**thinking before acting**” and being able to explain decisions in natural language. That’s not just for show. For real deployment, you want:

- **inspectability** (“why are you about to do that?”),
- **interruptibility** (humans can redirect mid-plan),
- and **bounded autonomy** (clear constraints and safety checks).

## 3) Gemini Robotics 1.5: VLA as the execution engine

DeepMind describes **Gemini Robotics 1.5** as the VLA engine: it processes visual input and language prompts and outputs actions.

The important capabilities they call out are basically the checklist robotics teams care about in 2026:

- **Generality**: adapt to novel situations.
- **Multi-step planning**: break down goals into steps.
- **Interactivity**: follow everyday commands; allow users to steer.
- **Dexterity**: fine motor skills (origami, lunch packing, salad prep).

If you’ve watched the field evolve from pure imitation learning → diffusion policies → foundation-model policies, you’ll recognize the pattern: the “robot brain” is increasingly a *generalist* that can be conditioned on language and context.

But there’s a reality check here:

- The long tail is not “fold origami once in a clean demo.”
- The long tail is “fold *hundreds* of different items under varied lighting, wrinkles, friction, and interruptions, without tearing, jamming, or making a mess.”

So the real question for Gemini Robotics 1.5 isn’t “can it do cute tasks?” It’s:

- **How robust is it across days/weeks of operation?**
- **How does it recover from partial failures?**
- **How does it behave around humans with unpredictable motion?**

Those are the metrics that convert demos into product.

## 4) Gemini Robotics-ER 1.6: the missing layer many VLA demos hide

DeepMind positions **Gemini Robotics-ER 1.6** as an “embodied reasoning model” designed to plan complex tasks and make logical decisions with “unprecedented precision.”

This is a hint at an emerging split in robot AI stacks:

- **Policy layer**: low-level action generation (VLA / diffusion / RL / hybrid).
- **Reasoning layer**: goal decomposition, constraint checking, verification, and recovery planning.

A lot of robotics demos quietly rely on hand-written scaffolding for reasoning:

- pre-specified subgoals,
- carefully constrained action spaces,
- environment resets,
- “human in the loop” corrections not shown.

If ER 1.6 is truly a reusable reasoning component, it’s valuable because it makes the stack more modular:

- you can improve planning without re-training the manipulation policy,
- and you can add explicit constraints (don’t exceed force limit, don’t enter restricted region, keep tool upright) more cleanly.

That said, reasoning models don’t automatically make robots safe. They can still produce plausible-but-wrong plans. In deployed systems, you still want **hard safety checks**:

- force/torque bounds,
- speed limits,
- collision avoidance,
- and ideally a supervisory safety controller that can veto actions.

## 5) The on-device variant is the most product-shaped part

“**Gemini Robotics On-Device**” is easy to underrate, but it’s arguably the biggest practical signal on the page.

Robots that depend on the cloud for every perception → action step inherit problems that are brutal in the real world:

- latency (especially for contact-rich tasks),
- Wi‑Fi dropouts,
- privacy (cameras inside factories/homes),
- and cost (streaming high-rate video is expensive).

On-device inference is not just a speed upgrade—it’s a **reliability upgrade**. It enables:

- fast reflex-like control loops,
- local autonomy in network-degraded environments,
- and safer human-robot collaboration because the robot can respond quickly.

The tradeoff is obvious: on-device models are usually smaller or more optimized, which can reduce generality. The winning pattern is likely:

- on-device for perception + low-latency execution,
- optional cloud calls for heavy reasoning, knowledge retrieval, or long-horizon planning.

DeepMind’s “agentic + thinking + on-device” framing suggests exactly that hybrid path.

## 6) Why partnerships matter: Apollo is the poster child for VLA → humanoid

DeepMind highlights collaboration with **Apptronik** (Apollo humanoid) and lists multiple partners/testers across the robotics ecosystem.

This is not just business development. For generalist robot models, partnerships are a data and deployment engine:

- Different robots generate different distributions of contact events.
- Different environments (factory vs lab vs home) generate different failure modes.
- Different teams have different safety stacks and evaluation harnesses.

A single company can’t get that coverage alone. Broad partner networks are a way to scale:

- embodiments,
- tasks,
- and evaluation.

## 7) What still blocks “helpful robots” (even with Gemini Robotics)

Even if Gemini Robotics is state-of-the-art, there are still three hard bottlenecks that will decide whether this ships widely.

### A) Evaluation that correlates with deployment
Robots fail in boring ways: glare, clutter, specular objects, cable snags, occlusions, humans walking into frame. Benchmarks rarely capture that.

We need evaluation that measures:

- recovery rate,
- long-horizon success without resets,
- safety constraint violations,
- and degradation over time.

### B) Data flywheels with privacy + safety built in
Scaling robot data is not like scaling text. Data collection in homes/factories triggers:

- privacy constraints,
- safety constraints,
- and high cost per hour.

The winners will build **privacy-preserving, opt-in, tightly scoped** data flywheels.

### C) The “last 10%” in manipulation is most of the product
Packing a lunchbox is a perfect example. The last 10% includes:

- sealing containers,
- aligning lids,
- handling deformable foods,
- cleaning spills,
- and recovering when something slips.

That last 10% is what makes the robot feel competent.

## The takeaway

Gemini Robotics looks like a serious attempt to standardize the modern robot intelligence stack:

- **Gemini Robotics 1.5** as the general VLA execution model,
- **ER 1.6** as the embodied reasoning/planning layer,
- and an **on-device** path that acknowledges robotics is fundamentally a reliability game.

If the on-device variant plus multi-embodiment transfer works as advertised, it’s a strong step toward robots that are trained once and deployed many times—across arms, mobile manipulators, and humanoids.

But the real test won’t be the demo reel. It will be **week-after-week performance**: recovery, safety, and cost per successful task.

### Further reading

- DeepMind: Gemini Robotics (capabilities, ER model, on-device variant, partners)
  - https://deepmind.google/models/gemini-robotics/
