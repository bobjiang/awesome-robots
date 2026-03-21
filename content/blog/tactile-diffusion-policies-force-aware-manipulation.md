---
title: "Tactile Diffusion Policies: How Robots Learn Force Aware Manipulation"
slug: "tactile-diffusion-policies-force-aware-manipulation"
date: "2026-03-22"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "tactile sensing", "diffusion policy", "manipulation", "imitation learning", "force control"]
excerpt: "A practical guide to why touch and diffusion policies are a strong pairing for contact rich manipulation, and how recent tactile conditioned policies turn force from an accident into a controllable output."
featured: true
published: true
seo:
  title: "Tactile Diffusion Policies for Force Aware Robot Manipulation"
  description: "Learn how tactile sensing plus diffusion policies enable force aware, contact rich robotic manipulation, and what it takes to deploy these methods on real hardware."
  keywords: ["tactile diffusion policy", "force aware manipulation", "tactile sensing robotics", "diffusion policy robotics", "contact rich manipulation"]
---

## The missing piece in robot manipulation is not vision, it is force

Robot manipulation has had a very visible decade.
We went from brittle, hand tuned pipelines to learning based policies that can pick, place, pour, and assemble using cameras alone.
Yet anyone who has tried to deploy these systems in the real world runs into the same wall: **contact**.

The moment a robot has to do something that depends on friction, deformation, or small variations in geometry, vision becomes a weak supervisor.
It can tell you where the object is.
It cannot reliably tell you whether you are crushing a grape, slipping on a screw head, or applying just enough preload to seat a connector.
Humans solve this by touch.
Robots often do not.

This is why tactile sensing is having a quiet resurgence.
And it is why diffusion policies are an unexpectedly good fit.

Diffusion models were popularized in image generation, but their best property for robotics is simpler: they can generate **smooth, temporally coherent action sequences** and handle multi modal behaviors.
That matters when you need to coordinate pose, gripper aperture, and force in a way that does not jitter.

In this post, we will connect three threads:

1. **What tactile sensors actually measure** (and why they are different from force torque sensors)
2. **Why diffusion policies work well as robot controllers**
3. **How tactile conditioned diffusion policies turn force into a first class control target**

We will use the original Diffusion Policy framework as background, and then zoom into a concrete example: **Force Aware Robotic Manipulation (FARM)**, a tactile conditioned diffusion policy that explicitly predicts grip force as part of the action.

Sources used in this post:
- Diffusion Policy project page and paper links: https://diffusion-policy.cs.columbia.edu/
- FARM paper (arXiv HTML): https://arxiv.org/html/2510.13324v1
- DIGIT tactile sensor overview: https://digit.ml/digit.html
- GelSight DIGIT product page: https://www.gelsight.com/product/digit-tactile-sensor/

Note on freshness: the FARM preprint is dated 2025.
If you are looking for very recent announcements, treat this post as a tutorial style synthesis of a trend that is actively accelerating.

---

## 1) What tactile sensing gives you that cameras do not

Tactile sensors are not one thing.
But modern robotics is converging on a practical interface: **vision based tactile sensors**.
They work by embedding a soft elastomer at the contact surface and imaging how it deforms.
From the images you can infer contact geometry and estimate forces.

### Digit and the “images of touch” idea

A representative example is **Digit**, a compact, high resolution tactile sensor designed for in hand manipulation.
Digit senses contact geometry as images, which makes it immediately compatible with modern representation learning.
The Digit project describes it as a low cost, compact tactile sensor designed for robotic in hand manipulation, and notes that from the tactile images you can estimate normal forces and, with markers, shear forces (https://digit.ml/digit.html).

GelSight also positions DIGIT as a sensor that enables researchers to train models for manipulation tasks (https://www.gelsight.com/product/digit-tactile-sensor/).

The key conceptual shift is: **touch becomes pixels**.
That means you can feed tactile data into the same kinds of encoders you already use for vision.

### Why not just use force torque sensors

Force torque (F T) sensors are great.
But they usually sit at the wrist.
They tell you net wrench, not contact distribution.
For tasks like delicate grasping, slip detection, or controlling local pressure, it is often more useful to know what the contact patch looks like.

A vision based tactile sensor gives you:
- local contact geometry
- local deformation patterns
- implicit friction cues (via shear and micro slip patterns)

This is exactly what humans rely on to modulate grip forces.

---

## 2) Why diffusion policies are a good controller, not just a trendy model

A diffusion policy represents a policy as a conditional denoising diffusion process.
Instead of predicting the next action directly, it predicts and refines an entire action sequence through iterative denoising.

The Diffusion Policy project summarizes the idea like this: it represents a visuomotor policy as a conditional denoising diffusion process, benchmarks across multiple manipulation tasks, and reports strong improvements over prior methods (https://diffusion-policy.cs.columbia.edu/).

### Properties that matter for manipulation

Diffusion policies bring several properties that align with manipulation:

**(A) Sequence generation for receding horizon control**

Diffusion Policy predicts a sequence of actions, which supports receding horizon control.
This is useful because the robot can plan a smooth short horizon trajectory, execute the first part, then replan.

**(B) Smoothness and stability**

Because the model generates a trajectory, it tends to avoid high frequency twitching that shows up when models predict single step actions.
That matters a lot for contact.

**(C) Multi modality without collapsing too early**

Manipulation often has multiple valid strategies.
Diffusion policies can model multi modal action distributions and commit within a rollout, which can reduce indecisive behavior.

These properties become even more valuable once you add tactile feedback, because tactile signals change quickly at contact and you want your controller to stay stable.

---

## 3) The real challenge: force is usually an uncontrolled side effect

Many learning based manipulation systems treat force as something that “happens” when you close the gripper.
The policy outputs joint positions or gripper width.
Then the physics of the world determines the contact forces.

This works for rigid objects in clean conditions.
It breaks for:
- fragile items (fruit, thin plastics, soft packaging)
- deformable objects (cables, cloth, plants)
- insertion and assembly (tight tolerance, high friction)
- tasks with changing force requirements (start gentle, then push harder)

To solve this, you want force to be a **control target**, not an accident.

That sounds like classic control.
So why not just build a force controller.

You can.
But the hard part is deciding *what* force to apply, and *when*, in a way that is robust to variation.
That is where imitation learning plus tactile sensing becomes compelling.

---

## 4) FARM: a tactile conditioned diffusion policy that predicts grip force

Force Aware Robotic Manipulation (FARM) is an imitation learning framework that integrates high dimensional tactile data to infer tactile conditioned force signals, which define a force based action space.
The paper states that many prior approaches treat visuotactile feedback as an extra observation and leave applied forces as an uncontrolled consequence of gripper commands.
FARM makes force explicit.

### The core idea

FARM does two things at once (https://arxiv.org/html/2510.13324v1):

1. It uses a high resolution vision based tactile sensor (GelSight Mini) and force estimation to build force grounded observations.
2. It changes the policy output so the policy predicts **robot pose**, **grip width**, and **grip force** jointly.

The paper describes a diffusion policy that “jointly predicts robot pose, grip width, and grip force.”
That single design choice is huge.
It turns learning into a direct search for the right interaction, rather than hoping the kinematics produce the right force.

### Data collection: robot free demonstration with a manipulation interface

A practical obstacle in manipulation learning is demonstration collection.
If you collect demos with the real robot, you are slow.
If you collect demos with teleoperation, you need a teleop stack.

FARM uses a handheld Universal Manipulation Interface (UMI) gripper modified to integrate a GelSight Mini sensor.
An expert performs tasks with the handheld gripper, producing demonstrations with tactile data.
Then the learned policy runs on a real robot with an actuated gripper variant that matches geometry.

This is a clever middle ground:
- you get human demonstrations without the full robot in the loop
- you keep contact and force signals, not just trajectories

### Tasks: high force, low force, and force adaptation

The paper evaluates three tasks with distinct force demands:
- a high force task
- a low force task
- a task requiring dynamic force adaptation

That last one is the real test.
Many systems can do “always squeeze gently.”
Fewer can do “squeeze gently, then increase force when needed, then back off.”

---

## 5) How to think about the architecture, step by step

If you want to understand tactile diffusion policies without drowning in math, focus on the data path.

### Step 1: sensory encoding

Inputs typically include:
- RGB camera observations (scene context)
- tactile image(s) (contact patch)
- proprioception (joint state, end effector pose)

Tactile images are often processed by a CNN or ViT style encoder, just like vision.

### Step 2: action representation

Classic behavior cloning predicts actions like:
- delta end effector pose
- gripper width command

Force aware policies expand the action space:
- delta pose
- target gripper width
- target grip force

FARM explicitly includes grip force as an action dimension.

### Step 3: diffusion based sequence prediction

Instead of predicting a single action, a diffusion policy predicts a whole sequence and then executes it with receding horizon control.
This reduces jitter, which helps keep contact stable.

### Step 4: low level control and mode switching

A subtle but important detail is how the system executes predicted commands.
FARM uses a dual mode scheme where the gripper alternates between position control of grip width and closed loop force control depending on contact state.

This is not just an implementation detail.
It is a reason the approach is deployable.
Real hardware needs predictable low level behavior.

---

## 6) Practical takeaways if you are building manipulation systems in 2026

You do not need to replicate FARM to benefit from its lessons.
Here are the practical design patterns that generalize.

### Pattern A: treat touch as a control signal, not just an observation

If your policy sees tactile data but only outputs positions, you are leaving performance on the table.
It will learn correlations, but it cannot explicitly aim for a force profile.

The control objective is more aligned when force is part of the output.

### Pattern B: output trajectories, not single step actions

Contact rich manipulation is unforgiving to high frequency noise.
Diffusion based sequence generation is one way to get smoothness.
Model predictive control is another.
You can even hybridize.

### Pattern C: build data collection tools that humans can use fast

A handheld manipulation interface, instrumented with tactile sensors, is a very pragmatic solution.
If you are currently bottlenecked on data collection time, your model choice might be less important than your demonstration pipeline.

### Pattern D: separate the policy from the safety critical low level loops

Your learning policy should not be responsible for 1 kHz stability.
Let the policy pick targets.
Let well tested controllers track those targets.
FARM uses explicit mode switching between position and force control, which is exactly the kind of safety aware engineering that makes learned policies usable.

---

## 7) Where this trend is going next

Tactile diffusion policies are a sign of a bigger shift: **robot learning is moving from geometry to interaction**.

Here are a few directions that are likely to matter.

### Whole body tactile sensing

Hands are the first target, but humanoids will need touch on forearms, torso, and legs for safe contact and support.
Once you have whole body tactile fields, policies that can generate smooth multi joint trajectories while respecting force constraints become even more valuable.

### Better force estimation and calibration

Vision based tactile sensors often require careful calibration.
If force estimation improves, the action space can expand beyond “grip force scalar” to richer targets like shear force or pressure distributions.

### Sim to real with tactile

Tactile signals are hard to simulate.
Diffusion policies can learn from diverse data, but you still need a way to bridge reality gaps.
Expect to see more hybrid pipelines:
- real tactile data for fine tuning
- simulation for broad coverage

### Shared representations across vision and touch

Because tactile is now pixels, it is natural to learn joint embeddings.
The most useful models will likely treat tactile images as another camera, but with different inductive bias.

---

## 8) A mental model for engineers: force is an output, not a byproduct

If you take one idea from this post, take this:

**In contact rich manipulation, force should be represented explicitly in both learning and control.**

Diffusion policies are not magic, but they are a practical tool for generating stable action sequences.
Tactile sensors are not perfect, but they provide the missing feedback loop.
When you combine the two, you get a controller that can aim for the interaction it wants to create.

If your robot roadmap includes assembly, logistics picking, food handling, agriculture, or household assistance, force aware manipulation is no longer optional.
It is the difference between a demo and a deployment.

---

## Further reading

- Diffusion Policy project page (paper links and technical summary): https://diffusion-policy.cs.columbia.edu/
- FARM preprint and technical details: https://arxiv.org/html/2510.13324v1
- Digit tactile sensor overview and open source links: https://digit.ml/digit.html
- GelSight DIGIT product page: https://www.gelsight.com/product/digit-tactile-sensor/
