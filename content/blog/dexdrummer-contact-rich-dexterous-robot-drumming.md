---
title: "DexDrummer: How Hierarchical Residual RL Enables Contact-Rich, Long-Horizon Dexterous Robot Drumming"
slug: "dexdrummer-contact-rich-dexterous-robot-drumming"
date: "2026-03-31"
author: "bob-jiang"
category: "tutorials"
tags: ["dexterous manipulation", "robot hands", "reinforcement learning", "sim-to-real", "contact-rich control", "hierarchical control", "residual RL"]
excerpt: "A deep technical walkthrough of DexDrummer, a simulation-trained hierarchical controller that combines motion planning with residual reinforcement learning to play drums with dexterous hands."
featured: true
published: true
seo:
  title: "DexDrummer: Contact-Rich, Long-Horizon Dexterous Robot Drumming"
  description: "Learn how DexDrummer combines motion planning, residual RL, and contact-targeted rewards to achieve in-hand, contact-rich, long-horizon dexterous robot drumming with sim-to-real transfer."
  keywords: ["DexDrummer", "dexterous manipulation", "robot drumming", "contact-rich control", "residual reinforcement learning", "sim-to-real", "robot hand policy"]
---

## Why drumming is a serious robotics benchmark

Dexterous manipulation research often splits the hard parts into separate projects:

- **In-hand control**: keep an object stable while you reposition it with your fingers.
- **Contact-rich interaction**: deliberately make and break contact, with impacts and friction doing most of the work.
- **Long-horizon robustness**: continue succeeding across dozens or hundreds of small contacts, without a single slip ending the episode.

The problem is that real tasks blend all three. Assembly, cooking, and tool use all require you to keep a tool stable in the hand, apply force through it, and keep going for a long time.

DexDrummer proposes something refreshingly concrete: **robot drumming** as a testbed that forces those three constraints into one task. A robot has to hold a drumstick with fine finger control, repeatedly strike a drum surface, and do it long enough to play a song, including transitions between different drums.

The paper is:

- Hung Chieh Fang, Amber Xie, Jennifer Grannen, Kenneth Llontop, Dorsa Sadigh
- "DexDrummer: In-Hand, Contact-Rich, and Long-Horizon Dexterous Robot Drumming" (arXiv:2603.22263)
- Code and videos: https://dexdrummer.github.io/

Sources:
- Paper: https://arxiv.org/abs/2603.22263
- Paper HTML: https://arxiv.org/html/2603.22263v1
- Code: https://github.com/hc-fang/dexdrummer

## The core idea: a hierarchy that separates structure from correction

If you ask pure reinforcement learning to learn everything end to end, you get two predictable failures:

1. **Exploration becomes impossible** for long-horizon tasks. You do not get reward until you play enough notes correctly.
2. **Contact makes dynamics messy**, which makes learning unstable and sim-to-real brittle.

DexDrummer reduces both issues using a hierarchical design:

- A **high-level system** turns musical input into a desired drumstick trajectory and then produces nominal arm commands through planning.
- A **residual reinforcement learning policy** learns corrections on top of that nominal plan, especially during fast transitions between drums.
- A **low-level dexterous policy** focuses on the hand and stick interaction, handling the messy contact dynamics required to keep the stick controlled while striking.

This pattern is worth copying: give learning a strong scaffold (a planner, a motion primitive, a trajectory generator), then use RL where it is strongest: adapting to model error, unmodeled contact, and high-frequency correction.

## Step 1: turning music into motion primitives

One subtle but important move is that DexDrummer does not try to learn musical structure from scratch. Instead, the system uses **parameterized motion primitives** to generate task-space drumstick trajectories from musical inputs.

Why this matters:

- It encodes the obvious geometry: where the drums are, where sticks should travel, what a strike looks like.
- It reduces the number of degrees of freedom that RL must explore.
- It gives you a consistent reference trajectory that can be used for both reward shaping and evaluation.

Then motion planning converts that trajectory into arm motions. The robot is not blindly flailing with a learned policy; it is executing a planned movement with learned corrections.

### Residual RL for transitions

The paper emphasizes that fast transitions between drums are where tracking errors show up.

So instead of making the planner perfect (which is often an endless rabbit hole), they learn a **residual** policy to correct the arm commands. Residual learning is a practical compromise:

- The planner gives stability and reasonable behavior even when learning is not perfect.
- The residual policy handles the mismatch between planning assumptions and real dynamics.

If you have ever fought with trajectory tracking on hardware, you know this is exactly the place where learning can buy you robustness.

## Step 2: reward design that explicitly targets contact

The low-level dexterous policy is trained to handle the contact-rich hand dynamics. The key contribution here is reward design that treats contact as a first-class signal.

DexDrummer structures rewards around two types of interactions:

1. **In-hand contacts (finger stick interaction)**
2. **External contacts (stick drum interaction)**

This is a clean decomposition that maps to how humans think about the task. You need a stable grasp and controlled finger placement, and you also need strikes that actually hit the drum.

### In-hand contact rewards

From the paper HTML, examples of in-hand reward components include:

- **Fingertip contact**: encourage multiple fingertips to make contact with the stick.
- **Fulcrum reward**: encourage thumb and index finger placement consistent with controlling the stick around a fulcrum.
- **Arm energy penalty**: discourage solving everything with big arm motions, pushing more of the control burden onto the fingers.

That last one is particularly important. Without it, a policy can become a blunt instrument that swings the arm to compensate for poor hand control. Penalizing arm motion is a way to force the learning problem into the dexterous regime.

### External contact rewards

External contact is the point of drumming, but it is also the most destabilizing part of learning. Impacts introduce high accelerations, friction changes, and discontinuous events.

DexDrummer uses:

- **Trajectory guidance**: encourage the stick tip to follow a target strike trajectory.
- **A contact curriculum**: gradually introduce drum contact during training.

This is the part that generalizes beyond drumming. Many contact tasks fail because you introduce full impacts too early, the policy panics, and learning collapses. A curriculum that gradually increases contact difficulty is one of the highest leverage tricks in contact-rich RL.

## Why the benchmark matters: long horizon and repeated impact

A lot of dexterous manipulation demos look impressive but are short. One reorientation, one grasp, one flip, then reset.

Drumming is different:

- It is **repetitive**: success requires consistent strikes.
- It is **unstable by default**: each strike tries to knock the stick out of the grasp.
- It is **long horizon**: you have to keep it together across many contacts and transitions.

That makes it a good stress test for the type of dexterity people actually need for tools. A screwdriver, spatula, whisk, or mallet has the same issue: you must maintain a stable in-hand configuration while repeatedly applying forces to the environment.

## How DexDrummer measures success

The abstract reports a simple but telling metric: **F1 score** for note events.

In simulation:

- The reactive dexterous policy outperforms a fixed grasp baseline by **1.87x** on easier songs and **1.22x** on harder songs.

On real hardware:

- The system can play the training song and an extended version with **F1 = 1.0**.

Using an F1 score is a practical choice because it captures two key failure modes:

- Missing strikes (low recall)
- Extra unintended strikes (low precision)

For robotics benchmarks, metrics matter. If you want to compare methods, you need something more objective than a highlight reel.

## Sim-to-real: what transfers and why

DexDrummer is trained in simulation and then deployed on a real setup.

The paper describes it as zero-shot transfer in the abstract. Even if you treat that claim cautiously, the high-level point is credible: the hierarchy helps transfer because:

- The planner and trajectory generator impose structure.
- The residual policy only needs to learn corrections, not the full solution.
- The contact-targeted rewards shape behaviors that correspond to physical interactions, not just simulator quirks.

A practical takeaway is that sim-to-real often succeeds when you **do not ask RL to discover everything**. Constrain the problem with geometry, planning, and task structure, then let learning handle the last-mile uncertainty.

## Engineering takeaways you can reuse

DexDrummer is a drumming project, but the architecture is a template for many manipulation problems.

### 1) Use planners for the obvious geometry

If there is an obvious trajectory family (approach, strike, retract, move to next target), do not waste samples learning it.

Encode it as:

- Motion primitives
- Parameterized trajectories
- A controller stack with planning at the top

Then let RL learn corrections.

### 2) Reward contact, not just pose

For contact tasks, a reward that only measures pose error tends to produce brittle solutions. You want rewards that correspond to physical interaction states:

- number of stable contacts
- location of key contacts (thumb index fulcrum)
- tool tip contact events
- energy penalties that prevent cheating

DexDrummer explicitly models finger stick and stick drum interactions, which is exactly the mindset you want.

### 3) Curriculum is not optional for impacts

Impacts are hard. They destabilize learning and amplify model mismatch.

A curriculum that starts with light or partial contact and ramps up to full contact is often the difference between a policy that learns and one that never leaves random exploration.

### 4) Penalize the easy escape routes

If you want dexterous finger control, penalize arm motion enough that the policy cannot solve everything by swinging the arm.

This idea generalizes to many systems:

- penalize base motion if you want manipulation skill
- penalize grasp force if you want gentle handling
- penalize torque spikes if you want hardware-safe behavior

## Where this approach could go next

DexDrummer is a good benchmark, but it also exposes what is still missing in dexterous robotics.

### Scaling beyond a fixed song library

If the high-level layer takes musical input, you can imagine generalizing to a much wider distribution of songs. That would stress test the ability to combine planning with learned correction under varied tempo, style, and strike patterns.

### More varied tools and tasks

Drumsticks are a tool. The next step is to apply the same framework to:

- cooking utensils
- hammers and mallets
- assembly tools
- long-horizon wiping or scrubbing

All of these require the same three properties: in-hand control, contact-rich interaction, and long-horizon robustness.

### Better system identification for contact

Residual RL is a pragmatic fix for model mismatch. Another direction is to combine it with online system identification or learned contact models, especially if you want higher-speed impacts with less conservative safety margins.

## A concrete recipe: how to apply DexDrummer ideas to your project

If you are building a dexterous manipulation system and want to borrow the DexDrummer pattern, here is a practical recipe.

1. **Define a structured trajectory family** for the task (even a crude one).
2. **Use planning to produce nominal commands** that are stable and interpretable.
3. **Train a residual policy** to correct tracking errors.
4. **Design contact-targeted rewards** that explicitly represent in-hand and external contact events.
5. **Introduce contact gradually** with a curriculum.
6. **Use an event-based metric** (like F1 for strikes) that captures both misses and false positives.

This will usually beat pure end to end RL on hardware, because it aligns with how real robots fail: not by being globally wrong, but by being locally brittle under contact.

## Conclusion

DexDrummer is not just a fun demo. It is a clean argument that dexterous manipulation needs benchmarks that are simultaneously in-hand, contact-rich, and long-horizon.

More importantly, it shows an engineering style that is likely to scale:

- structure from planning and motion primitives
- robustness from residual RL
- stability from contact-aware reward design and curricula

If your goal is real-world tool use, this combination is a strong blueprint.
