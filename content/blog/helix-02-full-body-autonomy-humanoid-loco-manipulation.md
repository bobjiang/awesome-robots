---
title: "Helix 02: How Figure's System 0/1/2 Makes Full-Body Humanoid Autonomy Real"
slug: "helix-02-full-body-autonomy-humanoid-loco-manipulation"
date: "2026-03-20"
author: "bob-jiang"
category: "tutorials"
tags: ["humanoid robots", "embodied AI", "vision-language-action", "loco-manipulation", "tactile sensing", "robot learning", "Figure AI"]
excerpt: "A technical deep dive into Helix and Helix 02, Figure's pixels-to-whole-body stack that unifies perception, language, balance, and dexterous manipulation for multi-minute autonomous tasks."
featured: true
published: true
seo:
  title: "Helix 02 Explained: Full-Body Humanoid Autonomy with System 0/1/2"
  description: "Learn how Figure's Helix 02 unifies locomotion and manipulation using a hierarchical VLA stack (System 2, System 1, System 0), enabling multi-minute autonomous humanoid tasks."
  keywords: ["Helix 02", "Figure AI", "vision language action", "humanoid loco-manipulation", "whole-body control", "tactile humanoid robots"]
---

## The moment humanoids stopped being two robots in a trench coat

Humanoid autonomy has had a dirty secret for years: most impressive demos are either **short-horizon** (a few seconds of motion) or **stitched** together (walk, stop, stabilize, grasp, stop, walk again) using brittle state machines.

Figure's Helix line is one of the clearest attempts to break that pattern.

- **Helix** introduced a generalist **Vision-Language-Action (VLA)** model that can control a humanoid's *upper body* at high rate while still generalizing across unseen objects.
- **Helix 02** extends the idea to **whole-body loco-manipulation**: walking, balancing, and manipulating as one continuous behavior, with a hierarchical stack that runs from pixels down to torque.

If you're trying to understand where humanoid robotics is going in 2026, this is a good axis to look at: **Can a single learned system continuously coordinate feet, torso, head, hands, and fingertips for minutes at a time, while the world stays messy?**

This post breaks down how Helix and Helix 02 are structured, why the architecture matters, what it enables (and what it does not), and how to think about "full-body autonomy" without getting hypnotized by a slick video.

**Primary sources:** Figure's Helix announcement, Helix 02 technical writeup, and Figure's logistics case study, plus the broader deployment context compiled by humanoid.press.

- Helix (Figure AI): https://www.figure.ai/news/helix
- Helix 02 (Figure AI): https://www.figure.ai/news/helix-02
- Helix in logistics (Figure AI): https://www.figure.ai/news/helix-logistics
- Broader 2026 humanoid context (humanoid.press): https://www.humanoid.press/

---

## Why loco-manipulation is still the boss fight

Robotics teams have built strong locomotion controllers and strong manipulation controllers. The hard part is **doing both at once**.

When you reach, your center of mass changes. When you step, your reach changes. When you carry something, your balance constraints tighten. In real homes and workplaces, every contact is a moving target.

Helix 02 calls this out explicitly: traditional approaches decompose into separate controllers "stitched together with state machines" (walk, stop, grasp, walk), which is slow and brittle for long-horizon tasks. Helix 02 aims for **continuous whole-body control** instead. (Source: Helix 02)

This is the key framing: **autonomy is not only "understanding".** It's also **coordinating physics at millisecond timescales** while the plan evolves.

---

## Helix in one sentence: a fast controller conditioned by a slower VLM

Helix (the first release) tackled a classic VLA tradeoff:

- Vision-language models are **general** but **slow**.
- Visuomotor policies can be **fast** but often **narrow**.

Figure's answer was a split architecture they describe as **"System 1, System 2"** (Source: Helix):

- **System 2 (S2)**: an onboard internet-pretrained VLM operating around **7 to 9 Hz** for scene understanding and language.
- **System 1 (S1)**: a fast reactive visuomotor policy running at **200 Hz** that maps the semantic latent from S2 into continuous actions.

Helix emphasizes several claims that matter if you're evaluating whether this is a real step forward or marketing:

1. **Continuous, high-dimensional control** (upper body including wrists, torso, head, and individual fingers) rather than low-dimensional gripper actions.
2. **Zero-shot generalization** to novel objects using natural language prompts.
3. **One neural network** for many behaviors, without task-specific fine-tuning.
4. **Onboard embedded GPUs** ("commercial-ready"), which is important because cloud dependence is a non-starter for many deployments.

Helix also discusses training scale and data:

- Around **500 hours** of diverse teleoperated behaviors.
- A 7B-parameter open-weight VLM for S2, and a smaller transformer for S1.
- Hindsight instruction labeling using a VLM. (Source: Helix)

Even if you discount some of the performance claims, the architecture is a sensible piece of engineering: run semantic reasoning at low rate, and run control at high rate.

---

## Helix 02 adds the missing layer: "System 0" for balance and contact

Helix 02 keeps the S2 → S1 idea, but adds a new foundation layer: **System 0 (S0)**.

Figure describes a three-layer hierarchy (Source: Helix 02):

- **System 2 (S2)**: slow semantic reasoning and language.
- **System 1 (S1)**: fast visuomotor policy producing full-body joint targets at **200 Hz**.
- **System 0 (S0)**: a learned whole-body controller running at **1 kHz**, handling balance, contact, and coordination.

This is the part people miss when they watch the dishwasher video.

Most humanoid "end-to-end" stories hide a conventional stabilizer underneath, because stable biped control is hard. Helix 02's claim is different: S0 is a *learned prior* trained on **over 1,000 hours of retargeted human motion data** and sim-to-real reinforcement learning, and it replaces a large hand-engineered C++ base controller (they cite **109,504 lines**). (Source: Helix 02)

### Why that matters

A learned stabilizer is not automatically better than a well-written classical controller. But it changes what you can optimize for:

- You can train for "human-like" motion distribution.
- You can bake in a strong prior over feasible whole-body coordination.
- You can potentially generalize across a fleet more easily than hand-tuned gains.

If S0 really works robustly, it becomes a platform primitive: you stop writing a new base controller for every new humanoid application.

---

## "All sensors in. All actuators out." is not a slogan, it's a product requirement

Helix 02 makes a very specific design statement: connect **every sensor** to **every actuator** through a unified visuomotor policy.

Inputs include (Source: Helix 02):

- Head cameras
- Palm cameras
- Fingertip tactile sensors
- Full-body proprioception

Outputs include joint-level control across:

- Legs
- Torso
- Head
- Arms, wrists
- Individual fingers

### The quiet point: sensing is what makes long-horizon manipulation possible

Vision-only manipulation systems break down in the boring places:

- occlusions when the hand blocks the object
- subtle contact transitions (cap threads, pill edges, syringe friction)
- force regulation without crushing or slipping

Helix 02 explicitly ties new dexterity tasks to **tactile sensing** and **palm cameras**, and lists examples like extracting individual pills, dispensing precise syringe volumes, and singulating small irregular objects from clutter. (Source: Helix 02)

Whether you believe the demos are representative or cherry-picked, the direction is correct: **the next plateau of manipulation is multimodal**.

---

## The dishwasher demo: what it actually proves

Helix 02 highlights a continuous "load and unload a dishwasher" sequence across a kitchen, described as a **four-minute** end-to-end autonomous task with **61** loco-manipulation actions, no resets, no human intervention. (Source: Helix 02)

Treat this as evidence for three capabilities:

1. **Task state persistence** across minutes (sequencing).
2. **Room-scale navigation + manipulation coupling** (loco-manipulation).
3. **Closed-loop correction** when contacts and objects are not perfectly repeatable.

What it does *not* automatically prove:

- that the policy is robust to your specific kitchen
- that it will handle new dish layouts reliably
- that it will succeed for hours without intervention

But it is still meaningful, because long-horizon autonomy is where most systems collapse, especially when the robot must keep moving.

---

## Helix in logistics: the unsexy path to real deployment

A lot of humanoid hype is home-focused. The fastest commercial path is usually something like: conveyors, totes, kitting, triage.

Figure's "Helix Accelerating Real-World Logistics" post is useful because it is not a generic manifesto. It describes a specific conveyor package manipulation and label-orientation problem, and then lists concrete engineering iterations to S1:

- **Implicit stereo vision** for depth-aware motion
- **Multi-scale visual representation**
- **Learned visual proprioception** for cross-robot transfer (online self-calibration)
- A test-time speed technique called **"sport mode"** that re-samples action chunks to execute faster (20% speedup example; effective up to 50% before throughput degrades) (Source: Helix logistics)

The most important lesson is not the buzzwords. It's the emphasis on:

- data curation (quality over quantity)
- cross-robot transfer as a first-class constraint
- throughput as a metric, not just success rate

This is the stuff you need if you're going to ship robots, not just videos.

---

## How to interpret the System 2 → System 1 → System 0 stack

If you build robots, you should read Helix 02 as a claim about **interfaces**.

- S2 outputs a semantic latent that defines intent.
- S1 turns that intent + observations into joint targets.
- S0 turns joint targets into stable torque-level execution with contact handling.

This mirrors how humans operate:

- We reason about goals slowly ("put dishes away")
- We execute movements quickly (fine motor control)
- We rely on reflex-like stabilization for balance

You do not need to buy the full end-to-end story to respect the interface design.

### A practical mental model

Think of S0 as "this motion is physically plausible and stable".
Think of S1 as "given what I see, move my body to make progress".
Think of S2 as "what does the instruction mean and what should come next".

The hard problem is training them so the boundaries do not leak instability.

---

## Where this fits in the bigger 2026 humanoid wave

The reason Helix matters is not that Figure is the only team doing embodied AI. It matters because it is part of a 2026 pattern:

- more humanoid teams moving from stage demos toward real pilots
- increasing attention on fleet scaling and manufacturing
- a shift from pure locomotion spectacle toward manipulation throughput and reliability

Humanoid.press describes 2026 as a tipping point with global showcases, production shifts, and pilot expansions (and it calls out multiple vendors and pilots across regions). (Source: humanoid.press)

In that context, Helix 02 is one of the more concrete examples of a stack designed for **continuous autonomy**, which is what pilots eventually demand.

---

## Limitations and honest questions to ask

If you're evaluating this tech as an engineer, investor, or operator, these are the questions that matter more than the marketing:

1. **Generalization across environments:** how far does the "pixels-to-whole-body" policy transfer without retraining?
2. **Failure modes:** what happens when it drops an object, bumps a cabinet, or gets partially occluded?
3. **Safety envelope:** how are contact forces bounded, and what is the runtime monitor when the policy deviates?
4. **Data bottlenecks:** how expensive is high-quality whole-body teleop data at scale?
5. **Fleet calibration:** can the learned self-calibration in logistics hold across months of hardware wear?
6. **Uptime:** can it run for hours (not minutes) without resets or intervention?

The good news is that the Helix posts at least acknowledge the operational axis: onboard compute, cross-robot transfer, throughput.

---

## Takeaway: the winning humanoid stack will look boring in the middle

The headline is "humanoid unloads dishwasher".

The real story is that Helix 02 is trying to formalize a control stack where:

- semantics are slow,
- visuomotor reactions are fast,
- balance and contact are faster still,

and the whole thing is trained so that it behaves like a single organism.

In 2026, the teams that win will not be the ones with the flashiest athletic demo. They'll be the ones who can take a humanoid and make it do **continuous, coupled, long-horizon work** with acceptable uptime.

Helix 02 is not proof that we are there yet. But it is a clean blueprint for how you might get there.

---

## Further reading

- Figure AI: Helix (VLA with System 1 and System 2)
  - https://www.figure.ai/news/helix
- Figure AI: Helix 02 (adds System 0 for full-body autonomy)
  - https://www.figure.ai/news/helix-02
- Figure AI: Helix logistics case study (throughput, stereo, cross-robot transfer)
  - https://www.figure.ai/news/helix-logistics
- Humanoid robotics news and context (MWC and 2026 pilots)
  - https://www.humanoid.press/
