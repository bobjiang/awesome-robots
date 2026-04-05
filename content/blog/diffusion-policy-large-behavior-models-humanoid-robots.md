---
title: "Diffusion Policies and Large Behavior Models: Why Humanoid Robots Finally Feel Close (and What’s Still Missing)"
slug: "diffusion-policy-large-behavior-models-humanoid-robots"
date: "2026-04-06"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "humanoid robots", "diffusion policy", "imitation learning", "behavior cloning", "Toyota Research Institute", "world models"]
excerpt: "A practical, technical guide to diffusion policies and large behavior models, why they unlocked today’s humanoid demos, and the system-two gap that still blocks reliable deployment."
featured: true
published: true
seo:
  title: "Diffusion Policy for Robots: Large Behavior Models Explained"
  description: "Learn how diffusion policies generate robot actions, why large behavior models reduce data needs, and what it will take to move from impressive demos to reliable humanoids."
  keywords: ["diffusion policy", "large behavior models", "humanoid robots", "robot imitation learning", "Toyota Research Institute"]
---

## The real shift: bodies were always impressive, brains were not

If you have watched humanoid robotics for a decade, the current wave can look like a sudden miracle: robots doing long-horizon manipulation, cleaning up messy tabletop scenes, recovering from bumps, and moving with a kind of “soft competence” that older pipelines rarely delivered.

But the biggest change is not the humanoid body. It is the learning stack.

In a recent interview with IEEE Spectrum, Toyota Research Institute CEO Gill Pratt framed it bluntly: what is different now is “not the body, but the brain.” He argues that we finally have a way to *teach* robots what to do (via demonstrations and modern AI methods) rather than writing an expanding pile of brittle task code.

This post explains the core technique behind many of those capabilities—**diffusion policies**—and how they connect to a second trend: **large behavior models (LBMs)** trained across many tasks. Then we will cover the uncomfortable part: why even great diffusion policies are still mostly “system one” pattern matching, and what that means for real deployments.

### Sources used (for readers who want to dig deeper)

- IEEE Spectrum interview with Gill Pratt on humanoid robots, diffusion, and the system-one/system-two gap: https://spectrum.ieee.org/humanoid-robots-gill-pratt-darpa
- Toyota Research Institute overview of teaching dexterous manipulation using diffusion policy: https://medium.com/toyotaresearch/tris-robots-learn-new-skills-in-an-afternoon-here-s-how-2c30b1a8c573
- Diffusion Policy project page (Columbia + TRI + MIT): https://diffusion-policy.cs.columbia.edu/
- arXiv: Diffusion Policy: Visuomotor Policy Learning via Action Diffusion (IJRR version): https://arxiv.org/abs/2303.04137v5

## Before diffusion: why classical robot learning often hit a wall

Modern robots have had strong hardware for a long time. What tends to fail is the “glue” between perception and action when the world gets messy.

Traditional robotics stacks usually look like:

1. Perception (detect objects, estimate pose)
2. Planning (compute a collision-free path or grasp)
3. Control (track that path, stabilize contact)
4. Recovery logic (if it goes wrong, branch to a fallback)

This can work well, but it has two chronic problems:

- **Brittleness in unstructured settings.** If your perception is slightly wrong, planning can fail hard.
- **Engineering burden.** Each new task (or each new corner case) adds more rules and more tuning.

Robot learning promised a simpler alternative: record demonstrations, train a policy, and let it generalize. But older behavior cloning methods struggled with:

- **Multimodality:** there are many correct ways to do a task, and regressing to the “average” action can be wrong.
- **Long-horizon structure:** predicting the next action is easier than predicting coherent sequences.
- **Training instability:** many methods require careful hyperparameter tuning and frequent real-robot testing.

Diffusion policies were a clean answer to those three pain points.

## What a diffusion policy is (in robotics terms)

A **diffusion policy** treats robot action generation like conditional generative modeling.

Instead of predicting a single next action with a deterministic network, it predicts a *distribution* over action trajectories and samples from that distribution at inference time.

The Diffusion Policy paper describes the policy as a conditional denoising diffusion process: you start from noise in action space and iteratively “denoise” it into a coherent action sequence, conditioned on observations (images, proprioception, sometimes language).

### The key idea: generate an action *sequence*, not just an action

In the Columbia/TRI work, diffusion is used to predict a sequence of actions for **receding-horizon control**:

- The model generates a short horizon trajectory (think: the next N steps).
- The robot executes the first step (or first few steps).
- Then it re-plans by sampling again, incorporating new sensor observations.

This looks like classical model predictive control in spirit (replan often), but the “planner” is a learned generative model that captures the kinds of trajectories demonstrated by humans.

### Why diffusion helps: three practical benefits

Based on TRI’s write-up and the Diffusion Policy project page, diffusion policies are attractive because they are:

1. **Good with multimodal demonstrations**
   - Real tasks have multiple correct strategies.
   - Diffusion learns a distribution over behaviors instead of collapsing to an average.

2. **Comfortable in high-dimensional action spaces**
   - Image diffusion models already generate huge outputs; action trajectories are smaller by comparison.
   - This makes it natural to generate smooth, coherent multi-DoF motions.

3. **Stable to train (relative to many alternatives)**
   - TRI emphasizes that diffusion policy works “out of the box” enough to scale up data collection.
   - That matters because real-robot evaluation is expensive and slow.

The Diffusion Policy benchmark results also claim a large average improvement over prior methods across multiple manipulation benchmarks (reported as an average success-rate improvement).

## How this connects to “teach a robot in an afternoon”

TRI’s Medium article is a useful mental model because it describes the *workflow*, not just the math:

1. A human teleoperates the robot for dozens of demonstrations (often 1–2 hours).
2. The system trains a diffusion policy using those demonstrations.
3. The robot performs the new behavior autonomously.

The punchline is not that the robot suddenly becomes “smart.” The punchline is that the system becomes a *repeatable pipeline* for adding skills without writing a bespoke planner for each one.

In practice, that is how you end up with robots that can do a long list of kitchen-like tasks.

### Teleoperation and tactile sensing matter more than people admit

A lot of “robot learning discourse” fixates on the model. But TRI’s write-up spends real time on:

- **Teleoperation interfaces** (including haptic devices) to produce clean demonstrations.
- **Tactile sensing** (such as soft bubble sensors) to give the policy information that vision misses.

That is an important reality check: diffusion policy is not magic. It is the modeling layer of a bigger system that includes data collection hardware, interfaces, and sensors.

## Large Behavior Models: why multitask learning changes the economics

If diffusion policy helps you learn a single skill from demonstrations, **large behavior models (LBMs)** aim to learn *many* skills in a shared model.

In the IEEE Spectrum interview, Pratt describes LBMs as a model trained on many tasks where adding new tasks can reduce data needs and improve overall capability. This is a robotics analogue of what happened in language models:

- Single-task models can be impressive but narrow.
- Multitask, large-capacity models can share structure and generalize better.

### Why LBMs matter for humanoids specifically

Humanoids are general-purpose bodies. They are only useful if the “software surface area” matches.

If each new behavior requires a custom stack, you will never cover enough behaviors to operate in real environments. Multitask learning offers a route to:

- a growing skill library
- shared representations (vision, contact, proprioception)
- faster adaptation to new tasks

In other words: LBMs are how you make “teach by demonstration” scale beyond demos.

## The uncomfortable truth: diffusion policies are mostly system one

The IEEE Spectrum piece contains the most important warning in the whole discussion.

Pratt’s framing:

- **System one** is fast, reactive pattern matching (what most current models do).
- **System two** is slow reasoning with imagination and world models.

Diffusion policies and LBMs are a huge system-one leap: “If I see the world like this, I act like that.” They can be extraordinarily competent in the distribution of behaviors they have learned.

But without system-two capabilities, you still see the classic failure modes:

- surprising edge cases
- brittle long-horizon plans
- poor error attribution (they do not know *why* they failed)
- difficulties when the environment changes in ways not seen in data

### What does “system two” mean in robotics?

In practice, a robotics system-two capability looks like some combination of:

- **World modeling:** predict consequences of actions, not just actions.
- **Planning over imagined futures:** evaluate multiple candidates before committing.
- **Explicit uncertainty:** know when you do not know.

This is not a philosophical preference. It is the difference between:

- a robot that looks competent until it encounters a novel situation
- a robot that can reason through novelty, ask for help, or safely pause

## A pragmatic bridge: humans as remote system two

One of the best “near-term deployment” ideas Pratt discusses is borrowed from autonomous driving operations: **human fallback**.

If a robot is system-one most of the time but can “raise its hand” for help when stuck, you can get real value before a full system-two breakthrough. This could look like:

- a remote operator giving a high-level choice
- a short teleoperated recovery
- labeling the failure mode to improve future training

This is not as flashy as fully autonomous humanoids, but it is likely the fastest route to safe commercialization.

## Where diffusion policy fits in the broader humanoid stack

Here is a practical way to think about diffusion policies if you are building or evaluating humanoid robotics systems.

### Diffusion policy is best viewed as a skill layer

- Input: observations (vision, proprioception, sometimes tactile and language)
- Output: short-horizon action sequences
- Strength: smooth, multimodal behavior generation from demonstrations

### What you still need around it

Even with a great diffusion policy, production systems still need:

- **Safety constraints** (joint limits, force limits, forbidden zones)
- **Fallback behaviors** (stop, retract, reset)
- **Monitoring and anomaly detection**
- **Data flywheel** (record failures, improve training sets)

A useful pattern is to treat learned policies as *proposals* and wrap them in a safety shell.

## How to evaluate “diffusion policy powered” humanoid demos

If you want to cut through hype, ask these questions:

1. **How many demonstrations and how diverse?**
   - Is the robot trained on dozens of examples or thousands?

2. **What sensors are used?**
   - Vision only, or tactile, force-torque, depth?

3. **Is there reset magic?**
   - Many demos rely on humans resetting the scene between attempts.

4. **What happens when the environment shifts?**
   - Lighting changes, object moves, tool slips, contact differs.

5. **Do they show failure rates?**
   - Success videos without statistics tell you almost nothing.

Diffusion policy can produce beautiful behavior. The deployment question is: does it do so reliably, under variation, with realistic resets, and with safe failure modes?

## The next 12 months: what would count as real progress

My take: the most meaningful progress will not be another slightly cooler demo. It will be signs that the stack is becoming *deployable*.

Concretely, look for:

- **Better data efficiency at scale** (LBMs that truly reduce per-skill data)
- **Generalization across environments** (same policy works in multiple kitchens, not one)
- **Integrated safety + recovery** (policies wrapped in constraint enforcement)
- **Human fallback workflows** (operators as a designed part of the product)
- **Early world-model hybrids** (even partial system-two planning helps)

If you see those ingredients, the humanoid hype curve may actually turn into a stable industry.

## Summary

Diffusion policies are not a buzzword—they are a genuinely useful way to learn robot skills from demonstrations because they handle multimodality, predict coherent trajectories, and train reliably.

Large behavior models extend that idea by sharing learning across tasks, which is exactly what humanoids need to become broadly capable.

But the core limitation remains: today’s “brains” are mostly reactive system-one pattern matchers. Until robotics gets better at world models and system-two reasoning—or designs products where humans fill that gap—humanoids will remain impressive, but fragile.

If you want to bet on the winners, bet on teams building the *full pipeline*: data, demonstrations, sensors, safety, and a realistic path from system one to system two.
