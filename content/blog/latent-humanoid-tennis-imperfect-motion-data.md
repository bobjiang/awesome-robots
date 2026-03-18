---
title: "Tennis-Playing Humanoids: How LATENT Learns Athletic Skills from Imperfect Motion Data"
slug: "latent-humanoid-tennis-imperfect-motion-data"
date: "2026-03-19"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "humanoid robots", "sim-to-real", "imitation learning", "reinforcement learning", "MuJoCo", "Unitree G1", "arXiv"]
excerpt: "LATENT shows how a humanoid can learn high-speed tennis rallies from messy, fragmentary human motion data by building a latent action space, composing primitives, and engineering robust sim-to-real transfer."
featured: true
published: true
seo:
  title: "LATENT: Humanoid Tennis from Imperfect Motion Data"
  description: "A deep dive into LATENT (arXiv:2603.12686): learning humanoid tennis skills from imperfect motion fragments, with latent actions, policy composition, and sim-to-real designs on Unitree G1."
  keywords: ["LATENT humanoid tennis", "imperfect motion data", "latent action space", "sim-to-real humanoid", "Unitree G1 tennis"]
---

## The problem: athletic skills are data hungry and reality is messy

Humanoids are getting surprisingly good at locomotion and manipulation, but athletic skills like tennis sit in a brutal corner of the robotics landscape:

- The ball is fast and the timing window is small.
- The robot must coordinate whole-body motion (footwork, torso, arm, wrist) under tight dynamics.
- Small perception or control errors compound into a complete miss.
- Collecting high-quality humanoid demonstrations for such behaviors is expensive, risky, and often impossible.

A common assumption in robot learning is that better data solves the problem: dense, clean, well-aligned demonstrations, or thousands of hours of robot interaction. In the real world, you often have neither. You have scraps: partial clips, inconsistent styles, missing contacts, and motion that does not even fully match the robot kinematics.

That is exactly the motivation behind **LATENT**, a system introduced in the paper **"Learning Athletic Humanoid Tennis Skills from Imperfect Human Motion Data"** (arXiv:2603.12686). The key idea is simple and powerful:

> If you can extract useful primitives from imperfect motion fragments, you can correct and compose them into a robust policy that still works in the real world.

The authors report deployment on a **Unitree G1** humanoid that can sustain multi-shot rallies with a human player, which is a meaningful bar for robustness and timing.

Sources:
- Paper: https://arxiv.org/abs/2603.12686
- Code repo (official): https://github.com/GalaxyGeneralRobotics/LATENT
- News summary: https://robohorizon.com/en-gb/news/2026/03/tennis-robot-beats-creator/

## What counts as "imperfect" motion data here

In LATENT, the data is not a complete set of perfect tennis rallies captured end-to-end. Instead, it is **motion fragments** that cover primitive tennis skills.

From the abstract, the motion fragments are described as *quasi-realistic* priors: useful enough to seed behaviors, but incomplete and not match-quality sequences. This matters because it shifts the data collection burden:

- You can capture short snippets (for example, a forehand swing, a reach, a recovery step) instead of full competitive rallies.
- You can accept noisy or partial trajectories instead of requiring a fully labeled dataset.
- You can still build a policy if you have a mechanism to correct and compose the fragments.

This is a general pattern worth remembering for robot learning: you do not always need perfect demonstrations if your pipeline can treat demonstrations as a weak prior rather than a strict target.

## The core idea: a latent action space that can be corrected and composed

The paper names the system LATENT, short for **Learns Athletic humanoid TEnnis skills from imperfect human motioN daTa**. The key phrase to focus on is **latent action space**.

A practical way to think about latent actions is:

- Low-level control is hard: raw joint torques or target positions are high-dimensional and sensitive.
- High-level intent is easier: "hit the ball with this swing style", "recover to ready stance", "step left".
- A latent action can represent a compact command that triggers a coherent motion primitive.

If you can learn a library of motion primitives (even from imperfect data), then a higher-level policy can decide which primitive to use and how to adjust it.

In other words, the stack becomes hierarchical:

1. **Motion tracking or primitive learning**: learn to reproduce plausible tennis-like motions in simulation.
2. **Online distillation and correction**: adapt and refine so the motions become usable for the task.
3. **High-level policy learning**: learn to choose and compose these actions to actually return the ball to targets.

The official repository describes an open-source pipeline that includes **motion tracker pre-training**, **online distillation**, and **high-level policy learning**, using **MuJoCo** simulation and multi-GPU training support.

Source (repo description): https://github.com/GalaxyGeneralRobotics/LATENT

## Why learning from fragments is more than a convenience

There are two deep benefits to learning from imperfect fragments, beyond "it is cheaper":

### 1) It matches how skills are built

Humans do not learn tennis by perfectly repeating full match rallies at first. They learn pieces:

- Serve motion
- Forehand and backhand mechanics
- Footwork patterns
- Recovery stance

A fragment-based dataset is closer to a coaching curriculum than a match replay archive.

### 2) It decouples style from task success

If you have fragments that contain plausible style (human-like coordination), you can preserve style while still optimizing task success.

That can matter for humanoids in real environments:

- More natural dynamics can reduce slippage or instability.
- Human-like motion may fit better within hardware limits.
- People trust and understand predictable, human-like motion more than chaotic flailing.

The LATENT abstract explicitly highlights preserving natural motion styles while achieving robust ball striking.

Source: https://arxiv.org/abs/2603.12686

## The real engineering battle: sim-to-real for a high-speed sport

Even if a policy works in simulation, tennis is a sim-to-real stress test:

- Contact dynamics are harsh.
- Latency matters.
- Small model mismatch leads to big failure.

The abstract states that the authors propose "a series of designs for robust sim-to-real transfer" and deploy on Unitree G1.

You can interpret this as: the learning method alone is not enough. The system needs practical transfer design.

While full implementation details are spread across the paper and the codebase, here are concrete sim-to-real tactics that are commonly necessary for this class of problem and align with the described pipeline:

- **Domain randomization**: vary ball speed, spin proxies, contact parameters, friction, and delays so the policy does not overfit one simulator.
- **Control interface selection**: choose a lower-level controller that is stable on hardware (for example, tracking a learned motion target rather than raw torque).
- **Latency-aware perception and prediction**: for a fast ball, the robot needs to act on where the ball will be, not where it is.
- **Recovery behaviors**: when the robot misses or is late, it must safely return to a stable stance.

If you are building similar systems, the lesson is that you should treat sim-to-real as a first-class design problem. Put it into your training loop, not as an afterthought.

## A mental model for the pipeline (how you would build something similar)

Let us translate LATENT into an actionable blueprint you can reuse.

### Step A: Collect imperfect motion fragments

You want short sequences that represent meaningful primitives:

- Ready stance transitions
- Lateral steps
- Forehand and backhand swings
- Follow-through and recovery

The fragments do not need to be complete rallies. They need to cover the motion vocabulary.

### Step B: Retarget to a humanoid and learn a tracker

A big friction point is kinematic mismatch: a human skeleton does not match a robot.

The LATENT repo includes "retargeted tennis data" and describes a tracking pipeline related to OpenTrack. This stage is where you:

- Map motion into the robot joint space.
- Learn a tracking policy that reproduces the motion plausibly in simulation.

Source: https://github.com/GalaxyGeneralRobotics/LATENT

### Step C: Learn a latent action model

Instead of directly outputting raw joint commands, learn a compact latent that indexes motion fragments and variations.

A good latent action space should be:

- Expressive enough to represent the motion library.
- Smooth enough that nearby latents produce nearby motions.
- Stable under noise.

### Step D: Learn a high-level tennis policy that composes primitives

The abstract describes correction and composition to strike incoming balls under wide conditions and return them to target locations.

That means the high-level policy takes the current situation (robot state, ball trajectory estimate, target return location) and chooses latent actions over time.

A practical trick for tasks like this is to separate the policy into modes:

- Preparation
- Swing
- Follow-through
- Recovery

You can either explicitly structure these modes or let the policy discover them through reward shaping and curriculum.

### Step E: Stress test transfer in simulation, then deploy

Do not ship the first simulator success to hardware. You need transfer hardening:

- Randomize and perturb
- Add delays
- Add imperfect perception
- Test edge cases like late hits or out-of-reach balls

Then deploy with safety constraints and conservative limits, gradually opening the envelope.

## What is actually new here (and why it matters for robotics in 2026)

Many robotics papers show a single flashy demo. LATENT is notable because it pushes on a constraint that is universal:

> Real data is imperfect.

If this approach generalizes, it can reshape how we build robot skill datasets:

- Instead of trying to capture perfect end-to-end demonstrations, capture a broad library of primitives.
- Let learning and composition do the heavy lifting.
- Build systems that can tolerate inconsistent, fragmentary supervision.

This also fits a bigger industry trend: the move toward **data flywheels** and closed-loop improvement.

For example, a recent funding story about a physical AI startup highlighted exactly this kind of closed-loop stack: collect real-world interaction data, improve models in a digital twin, deploy again, repeat.

Source (data flywheel example): https://en.wowtale.net/2026/03/15/233669/

The connection is important:

- LATENT shows a learning recipe for turning imperfect motion into a usable skill.
- Closed-loop deployment provides the stream of imperfect data.

Together, they point to a future where robots learn skills the way products improve: iteratively, with messy telemetry and incremental capability gains.

## Limitations and open questions (what to watch next)

Even if the results are strong, there are important questions for anyone trying to apply this approach.

### 1) How broad is the skill transfer

Tennis is a specific athletic domain with structured contact and predictable object physics. Will the same pipeline work for:

- Soccer kicking with dynamic balance
- Basketball shooting with high arc prediction
- Warehouse throwing and catching
- Construction tasks with deformable materials

If the answer is yes, fragment-based learning could become a general athletic skill builder.

### 2) How much perception is required

The abstract focuses on motion data challenges, but real tennis requires robust perception:

- Ball detection and tracking
- State estimation under occlusion
- Trajectory prediction

One direction to watch is integration with vision-language-action or world model stacks, where perception and control are trained together or co-designed.

### 3) Hardware constraints

Unitree G1 is a capable platform, but athletic skills can push hardware limits:

- Joint speed and acceleration
- Impact tolerance
- Thermal constraints
- Battery drain under repeated high-power moves

A pipeline that depends on frequent high-impact contact may not generalize to all humanoids.

### 4) Safety and compliance

Athletic motion in proximity to humans needs safety layers:

- Speed limits near people
- Collision detection
- Safe fallback behaviors

A future "athletic humanoid" product will likely require a safety architecture that is at least as important as the policy itself.

## Practical takeaways for builders

If you are building robot skills in 2026, LATENT suggests a pragmatic strategy:

1. **Stop waiting for perfect demos.** Collect the fragments you can.
2. **Build a primitive library.** Skills are a vocabulary.
3. **Use hierarchy.** High-level intent on top, stable tracking below.
4. **Treat sim-to-real as design.** Randomize, perturb, and validate.
5. **Plan the data flywheel.** Deployment is how you get the next dataset.

This is how you move from single demos to repeatable capability.

## References

- Zhang et al., "Learning Athletic Humanoid Tennis Skills from Imperfect Human Motion Data" (arXiv:2603.12686): https://arxiv.org/abs/2603.12686
- Official LATENT implementation: https://github.com/GalaxyGeneralRobotics/LATENT
- RoboHorizon coverage and links to project resources: https://robohorizon.com/en-gb/news/2026/03/tennis-robot-beats-creator/
- Physical AI data flywheel example (WOWTALE): https://en.wowtale.net/2026/03/15/233669/
