---
title: "MolmoAct 2 Explained: An Open VLA Stack and 720 Hours of Bimanual Robot Data"
slug: "molmoact2-open-vla-bimanual-dataset"
date: "2026-05-28"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "VLA", "open-source", "bimanual-manipulation", "datasets", "embodied-ai", "flow-matching"]
excerpt: "A practical, technical look at MolmoAct 2—Ai2’s open vision-language-action model—plus what its 720-hour bimanual dataset and open action tokenizer mean for reproducible robot learning."
featured: true
published: true
seo:
  title: "MolmoAct 2 Explained: Open VLA + 720h Bimanual Dataset"
  description: "MolmoAct 2 is an open vision-language-action model from Ai2 with a 720-hour bimanual dataset and open action tokenizer. Learn the architecture, tradeoffs, and how to use it."
  keywords: ["MolmoAct 2", "vision-language-action model", "bimanual manipulation dataset", "open robotics foundation model", "Ai2", "robot action tokenizer"]
---

## The big deal: a robotics foundation model you can actually reproduce

Robotics has had a repeating problem for the last two years: the models look impressive, but the *recipe*—data, tokenizers, preprocessing, and training code—often stays closed. That makes it hard to answer basic engineering questions:

- If performance is great, **which part mattered most** (data, architecture, action representation, or post-training)?
- If it fails on your robot, **what should you change first**?
- If you want to publish research, **can anyone replicate your result** without being on the same hardware stack?

On **May 5, 2026**, the Allen Institute for AI (Ai2) released **MolmoAct 2**, positioning it as an “open foundation for robots that work in the real world,” with **model weights, datasets, and a full VLA pipeline** intended for the community to study and build on. Ai2 also released the **MolmoAct 2-Bimanual YAM dataset**, described as the largest open-source bimanual tabletop manipulation dataset, totaling **720+ hours** of demonstrations. The blog post highlights a key practical claim: **up to 37× faster inference** than the prior MolmoAct generation—moving these models closer to closed-loop control rather than “think…pause…move.”

Primary sources:

- Ai2 announcement: <https://allenai.org/blog/molmoact2>
- Models/datasets collections: <https://huggingface.co/collections/allenai/molmoact2-models> and <https://huggingface.co/collections/allenai/molmoact2-datasets>
- Project repo (code + links): <https://github.com/allenai/molmoact>
- Technical paper (arXiv): <https://arxiv.org/abs/2605.02881>

This post breaks MolmoAct 2 down like an engineer would: what’s new, why it matters, where it can break, and how you can evaluate it without fooling yourself.

---

## What MolmoAct 2 is (and how it differs from “LLM controlling a robot”)

MolmoAct 2 is a **vision-language-action (VLA)** policy: it takes in **images** and a **natural-language instruction**, then outputs **robot actions**—not text.

Most “robot + LLM” demos are *planner/controller stacks* where:

1. A language model produces a plan in text.
2. A separate controller (often traditional robotics or RL) executes motions.

A VLA policy tries to compress more of that loop into one model family: it learns a mapping from perception + instruction → control. The upside is simpler integration and broad generalization *when it works*. The downside is that you’re now relying on a learned policy to be stable under contact, latency, calibration errors, and novel configurations.

Ai2 frames MolmoAct as an “Action Reasoning Model (ARM)”—a VLA that **reasons about spatial structure before acting**, aiming to reduce the common failure mode where the model can describe a scene but can’t reliably act in it.

Source: <https://allenai.org/blog/molmoact2>

---

## Architecture: Molmo2-ER + an action expert + a KV-cache bridge

Ai2’s write-up emphasizes three linked ideas:

1. **A spatial/embodied reasoning backbone (Molmo 2-ER).**
2. **An action expert** that produces control with a **flow-matching** style generator.
3. A **KV-cache bridge** that lets the action expert reuse backbone activations for speed.

### 1) Molmo 2-ER: training the backbone to think spatially

MolmoAct 2 isn’t built on a generic VLM; it uses **Molmo 2-ER**, an embodied-reasoning variant trained with an additional ~3 million examples spanning pointing, object detection, multi-image reasoning, ego-exo correspondence, and spatial QA.

Why this matters: many robot failures are not “object recognition” failures. They’re geometry failures:

- The object is recognized, but the grasp pose is wrong.
- The model doesn’t properly account for camera viewpoint or reachability.
- The robot collides because it lacks a usable concept of free space.

If the backbone is trained on tasks that force spatial reasoning, you’re more likely to get action predictions that remain grounded when the scene differs slightly from training.

Source: <https://allenai.org/blog/molmoact2>

### 2) Flow matching for actions (why it’s showing up everywhere)

Ai2 connects the backbone to an action generator using **flow matching** (a family of continuous-time generative modeling methods that has become popular in robotics policy learning because it can be stable and sample-efficient in some regimes).

If you’ve been following diffusion policies and flow-matching policies in robotics, you’ve seen a trend: rather than predicting a single next action directly, these models learn a process that maps noise → an action distribution conditioned on observations.

MolmoAct 2 fits into that broader wave, but combines it with a strong spatial VLM backbone.

Source: <https://arxiv.org/abs/2605.02881>

### 3) KV-cache bridge: the “latency tax” of VLA models

VLA models tend to be computationally heavy because the perception + language backbone is large and is often re-evaluated at each control step. Ai2 claims MolmoAct 2 dramatically reduces that cost via a **key-value cache bridge**: the action expert reuses previously computed information from the backbone rather than recomputing attention from scratch.

Ai2 reports a representative speed comparison (in a LIBERO evaluation environment on an NVIDIA H100):

- ~6,700 ms per action call (MolmoAct)
- ~180 ms per action call (MolmoAct 2 base)
- ~790 ms per action call (MolmoAct 2 with adaptive depth reasoning)

Even if your exact numbers differ, the qualitative point is important: **sub-second response is the difference between a robot that visibly “hesitates” and one that can plausibly recover** during a task.

Source: <https://allenai.org/blog/molmoact2>

---

## MolmoAct 2-Think: depth tokens, but only when needed

MolmoAct 2 introduces **MolmoAct 2-Think**, which augments the model with depth-related tokens to support explicit 3D reasoning. The key engineering challenge is cost: predicting depth everywhere, every timestep, is expensive.

Ai2’s solution is an **adaptive-depth mechanism** that routes depth prediction only when it’s likely to help, focusing on regions with dynamic changes.

Think of it as a budgeted “spend compute on the parts of the scene that are changing” system. For manipulation, that often means the object, gripper, and local contact region—not the whole background.

Source: <https://allenai.org/blog/molmoact2>

---

## The dataset release: why 720 hours of bimanual data changes the baseline

MolmoAct 2 ships with the **MolmoAct 2-Bimanual YAM dataset**, described by Ai2 as:

- **720+ hours**
- **34,500 teleoperated demonstrations** (as summarized in secondary coverage)
- **two-arm tabletop tasks** like folding, scanning groceries, charging a phone, and table bussing

For context, bimanual manipulation is a harder regime than single-arm tabletop because:

- You need coordination between arms.
- Occlusion is constant.
- Error recovery often requires regrasping and replanning.
- Contact is frequent and multi-point.

Large-scale bimanual datasets are historically scarce and proprietary. Making one open is valuable even if you never use the model weights, because it enables:

- Better pretraining for other policies.
- More realistic benchmarking.
- Research on action tokenization and long-horizon success metrics.

Sources:

- Ai2 dataset announcement: <https://allenai.org/blog/molmoact2>
- Datasets collection: <https://huggingface.co/collections/allenai/molmoact2-datasets>
- Repo: <https://github.com/allenai/molmoact>

---

## The under-discussed part: an *open* action tokenizer

Robots don’t naturally speak tokens. They produce continuous joint targets, end-effector deltas, gripper commands, and impedance parameters at high frequency.

To train transformer-like architectures effectively, many teams compress continuous actions into a discrete vocabulary using an **action tokenizer**.

Ai2 emphasizes MolmoAct 2-FAST, their **open action tokenizer**, and explicitly contrasts it with Physical Intelligence’s FAST tokenizer—useful, but not fully reproducible because the training data distribution isn’t fully open.

Why you should care:

- Tokenizers are not neutral. They bake in inductive biases: smoothness, quantization, preferred motion styles, and limits.
- If the tokenizer is closed, you can’t audit what behaviors it encourages.
- If the tokenizer is open, you can retrain it for *your* robot’s action space.

Sources:

- Ai2 blog: <https://allenai.org/blog/molmoact2>
- Repo: <https://github.com/allenai/molmoact>
- Paper: <https://arxiv.org/abs/2605.02881>

---

## Reported performance: treat numbers as signals, not truth

Ai2 reports strong results across simulation and real-world tasks, including comparisons to π0.5. A few examples from the Ai2 blog:

- On a reported real-world zero-shot Franka evaluation, Ai2 states MolmoAct 2 averages **~87.1% success** across tasks in their suite, compared to **~48.4%** for π0.5 in the same setup.
- On their MolmoBot benchmark, they report MolmoAct 2 at **~20.6%** average success vs π0.5 at **~10.3%**.

Source: <https://allenai.org/blog/molmoact2>

Here’s the pragmatic interpretation:

1. These numbers are valuable because they suggest the approach is competitive.
2. Robotics benchmarks are notoriously hard to reproduce due to hardware, calibration, and environment differences.
3. The real win is that MolmoAct 2 is attempting to publish enough artifacts that third parties can actually verify pieces of the pipeline.

If you adopt MolmoAct 2, set up your evaluation so you can answer: “Does this help *my* tasks under *my* constraints?” not “Does it beat a benchmark I can’t replicate?”

---

## Where MolmoAct 2 can still fail (and why those failures matter)

Even in Ai2’s own framing, MolmoAct 2 is not “universal robot control.” There are clear engineering limitations worth planning around.

### 1) Chunked execution can look jerky and reduces recovery

Secondary coverage and model notes describe a common pattern for VLA policies: the model predicts a **chunk** (e.g., 10–30 steps), then executes that chunk without re-inferring mid-way.

This is often a throughput optimization, but it creates a control gap:

- If the object slips mid-chunk, the robot may not adapt until the next inference.
- If contact changes unexpectedly, you can get “ballistic” motions.

Mitigation strategies (regardless of model):

- Reduce chunk size when the task enters contact.
- Add a fast reflex layer (force/torque thresholds, slip detection, collision avoidance).
- Use a watchdog that can stop the robot and request replanning.

### 2) Embodiment mismatch is still real

MolmoAct 2 is trained heavily on specific platforms (Ai2 highlights their bimanual setup and a Franka-based regime, plus inclusion of SO-100/SO-101 community arms). But moving to a humanoid, different arm kinematics, or different cameras usually requires additional data.

This is not a MolmoAct-only issue; it’s the main reason the field is investing so heavily in:

- Action tokenizers
- Standardized dataset formats
- Sim-to-real + domain randomization
- Cross-embodiment alignment

The practical takeaway: treat MolmoAct 2 as a **foundation checkpoint** and budget time for adaptation.

Sources:

- Ai2 blog: <https://allenai.org/blog/molmoact2>
- Paper: <https://arxiv.org/abs/2605.02881>

---

## A practical way to evaluate MolmoAct 2 in your lab (without overcommitting)

If you’re a startup, a university lab, or an internal robotics team, here’s a staged approach that avoids the two most common failure modes: (1) “we spent weeks integrating and learned nothing,” and (2) “we ran a demo and mistook it for reliability.”

### Stage A: sanity checks in simulation

1. Use a small task suite (5–10 tasks) that matches your domain: pick-and-place, insert, open/close, tool use.
2. Include controlled variations: lighting, distractor objects, different table textures.
3. Track not just success/fail but *trajectory quality*:
   - max joint velocity
   - collision count
   - action smoothness
   - recovery attempts

LIBERO-style task families are useful here because they encode variation and long-horizon behavior; Ai2 references LIBERO in their evaluation environment.

Source: <https://arxiv.org/abs/2605.02881>

### Stage B: “shadow mode” on the real robot

Before letting the model command motors:

- Run inference with your live camera feeds.
- Log actions to disk.
- Compare action distributions across scenes.

You are looking for instability: wild action spikes, sensitivity to small viewpoint shifts, or consistent bias.

### Stage C: gated autonomy

When you do enable execution:

- Put a safety layer in front (velocity/acceleration caps, workspace bounds).
- Start with non-contact tasks.
- Then do contact tasks with short horizon and easy recovery.

### Stage D: decide whether to invest in adaptation

If you see promise, your next fork is usually one of:

- Fine-tune on your own demonstrations.
- Retrain/adjust the action tokenizer for your robot.
- Add a depth reasoning variant (like Think) if spatial errors dominate.

The advantage of MolmoAct 2 is that, in principle, you can do these steps with fewer “mystery components,” because Ai2 is publishing a larger portion of the stack.

---

## Why this release matters beyond MolmoAct 2

MolmoAct 2 is important for performance, but it’s *more* important as a direction for the ecosystem:

1. **Open bimanual data** makes it easier for the community to train and compare.
2. **Open tokenizers** reduce hidden dependencies and allow cross-embodiment work.
3. **Speed-oriented architecture** acknowledges the reality that latency is part of “intelligence” in robotics.

If open-source robotics follows the path of open LLMs, the winners won’t be the teams that publish the biggest demo video. They’ll be the teams that ship:

- full pipelines
- reproducible training recipes
- dataset tools
- safety and evaluation harnesses

MolmoAct 2 is one of the clearest 2026 examples of that philosophy.

---

## Further reading and links

- Ai2 announcement + details: <https://allenai.org/blog/molmoact2>
- MolmoAct repository: <https://github.com/allenai/molmoact>
- MolmoAct 2 models on Hugging Face: <https://huggingface.co/collections/allenai/molmoact2-models>
- MolmoAct 2 datasets on Hugging Face: <https://huggingface.co/collections/allenai/molmoact2-datasets>
- Technical paper: <https://arxiv.org/abs/2605.02881>
