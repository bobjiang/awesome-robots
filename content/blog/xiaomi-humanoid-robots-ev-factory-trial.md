---
title: "Xiaomi Puts Humanoid Robots on an EV Assembly Line: What a 90 Percent Trial Reveals About Physical AI"
slug: "xiaomi-humanoid-robots-ev-factory-trial-physical-ai"
date: "2026-03-11"
author: "bob-jiang"
category: "news"
tags: ["humanoid robots", "manufacturing", "physical AI", "vision-language-action", "tactile sensing", "factory automation", "robot safety", "sensor fusion"]
excerpt: "Xiaomi is trialing humanoid robots on an EV assembly line with a 76 second takt time and a reported 90.2 percent success rate, offering a rare look at what it takes to make embodied AI work in production."
featured: true
published: true
seo:
  title: "Xiaomi humanoid robots in EV factory: physical AI lessons"
  description: "A deep dive into Xiaomis humanoid-robot factory trial, including VLA control, tactile sensing, takt time constraints, safety, and what it means for industrial robotics."
  keywords: ["Xiaomi humanoid robots", "EV factory automation", "physical AI", "vision language action model", "tactile sensing", "industrial robotics"]
---

## Why this trial matters

Humanoid robots have had no shortage of demos: walking in a lab, sorting objects on a table, or doing staged tasks that look impressive on video. What is much rarer is a concrete report of humanoids running inside a real production line, with a takt time, yield targets, and all the messy constraints that make factories unforgiving.

That is why recent reporting about Xiaomi deploying two humanoid robots on an electric vehicle (EV) assembly workstation is worth attention. In interviews at Mobile World Congress, Xiaomi leadership described the trial as early stage, even calling the robots more like interns than full workers. Still, the details are unusually specific: a 76 second cycle time for the assembly line, several hours of continuous operation, and a task that looks simple until you try to make it reliable under industrial constraints.

Two separate writeups provide the core facts:

- CNBC reported that Xiaomi trialed two humanoid robots in its EV production plants, highlighted the 76 second line pace, and quoted Xiaomi president Lu Weibing on the challenge of keeping up with that pace. It also described tasks like installing nuts and moving materials. Source: <https://www.cnbc.com/2026/03/04/xiaomi-humanoid-robots-ev-factory-.html>
- Robotics and Automation News summarized a company blog description of early experiments: installing self tapping nuts, achieving a 90.2 percent success rate over three hours of continuous autonomous operation, and meeting the 76 second cycle requirement. It also named internal AI systems Xiaomi says it used, including a vision language action model and a tactile learning network. Source: <https://roboticsandautomationnews.com/2026/03/10/xiaomi-tests-humanoid-robots-on-electric-production-line-in-automotive-factory/99418/>

This post breaks down what is technically interesting about the trial, what it suggests about the direction of physical AI, and how to evaluate these announcements with the right mix of excitement and skepticism.

## A quick recap of the reported setup

Based on the reporting above, the trial looks like this:

- Platform: two humanoid robots (Xiaomi has previously shown its CyberOne humanoid, and the trial appears to use related technology).
- Environment: an automotive assembly workstation in an EV factory.
- Task: pick self tapping nuts from an automated feeder, place them into a tightening fixture, then the station completes the fastening process.
- Production constraints: the trial reportedly met a 76 second cycle requirement.
- Performance: Xiaomi reported a 90.2 percent success rate during three hours of continuous autonomous operation.

Even if you only take these numbers as indicative, the combination of takt time and continuous operation is meaningful. Many lab demos can tolerate retries, pauses, and resets. A line station with a 76 second cycle is the opposite: failures have a cost, retries are constrained, and you quickly discover every corner case.

## Why installing a nut is not a toy problem

On paper, picking a nut and placing it into a fixture is a classic industrial automation problem. Specialized automation has done variations of it for decades. But there are three reasons it becomes a different class of problem when you ask a humanoid to do it:

1. **Tolerances and alignment are brutal.** Xiaomi reportedly called out an inner spline structure, variation in grips, and magnetic attraction from positioning pins as causes of misalignment and failures. Those are exactly the kinds of small physical effects that overwhelm purely vision based control.

2. **The robot is general purpose.** A humanoid arm and hand is not a purpose built feeder mechanism. That flexibility is the whole point, but it is also why you need better perception and control to achieve comparable reliability.

3. **The station is part of a system.** In a factory, the robot does not own the environment. Tools, fixtures, feeders, conveyors, human operators, and upstream variation all interact. The robot must work inside constraints rather than redesigning the world.

A good mental model is: traditional automation wins by simplifying the world, while physical AI tries to understand and adapt to the world. In manufacturing, you need both.

## The core technical story: perception plus action under time pressure

Xiaomi says it used two internal AI components:

- **Xiaomi-Robotics-0**, described as a large vision language action (VLA) model.
- **TacRefineNet**, described as a haptic perception system that uses tactile feedback during manipulation.

Those names may be proprietary, but the architecture pattern is familiar in modern robotics: learn a policy that maps multimodal observations to actions, and include contact rich sensing for manipulation reliability.

### Vision language action models in a factory context

A VLA model typically implies a system that:

- Ingests visual input (camera images, potentially depth).
- Can be conditioned on language or structured goals.
- Outputs actions (end effector motions, grasp choices, or higher level primitives).

In a factory station, language is less important than **action grounding** and **robustness to distribution shift**. Lighting changes, reflections, partial occlusions, and small pose changes all happen constantly. If the robot depends on high quality vision alone, yield will suffer.

One practical value of a VLA style policy is that it can unify many small decision points:

- Which nut is reachable right now?
- Is the nut properly seated in the gripper?
- Is the fixture ready?
- Is the insertion aligned?
- Should the robot regrasp, adjust pose, or abort?

A classical pipeline can do these, but it often becomes brittle with hand tuned thresholds. Learned policies can be more graceful, provided the training data covers enough variation and the system has good sensing.

### Tactile sensing is a reliability multiplier

Xiaomi emphasized tactile feedback as a complement to vision. That matches what many manipulation teams have learned over the last decade: contact rich tasks demand contact sensing.

Vision can tell you where something should be. Tactile can tell you what is actually happening.

In the nut placement sequence, tactile feedback can help with:

- Detecting slip during pickup.
- Measuring whether the nut is seated against a fingertip or held at an angle.
- Recognizing first contact with the fixture.
- Detecting a jam or unexpected collision early.

If the trial really reached a 90.2 percent success rate over hours of operation, tactile sensing is a plausible contributor.

### Multimodal fusion: cameras, touch, and proprioception

Robotics and Automation News reported that Xiaomi combined camera input, tactile sensors, and joint motion sensors, and highlighted why single modality approaches fail in factories.

This is a key point. Robust physical AI is less about a single big model and more about system design:

- **Vision** is global but noisy.
- **Touch** is local but high signal at the moment of contact.
- **Proprioception** (joint angles, torque, motor currents) is always available and can indicate contact events even without dedicated tactile hardware.

Fusing these signals well is often what separates a demo from a deployable system.

## Control strategy: mixing classical optimization and reinforcement learning

Xiaomi also described a hybrid full body control approach:

- Classical optimization based control for stability and safety constraints.
- Reinforcement learning (RL) trained in simulation with many disturbances to improve balance.

This hybrid approach is becoming a standard recipe for legged and humanoid robotics.

Pure RL can produce impressive motions, but factories demand predictable behavior and hard safety constraints. Optimization based controllers, especially model predictive control variants, are good at respecting constraints when the model is accurate. Combining them aims to get the best of both worlds: learned robustness and classical reliability.

A subtle but important detail is that the trial appears to focus on an arm manipulation task at a workstation rather than dynamic walking around the factory. That is a sensible starting point. A humanoid does not need to walk to be useful; if it can operate at a station, it can already cover a surprising range of tasks.

## A broader trend: the stack is shifting toward end to end physical AI

The Xiaomi trial lines up with a broader industry push: making the full humanoid stack more production ready, especially around sensing and safety.

For example, a recent announcement described Texas Instruments (TI) collaborating with Nvidia to integrate TI mmWave radar sensing with Nvidia Jetson Thor and the Holoscan ecosystem, aiming for low latency 3D perception and better safety awareness in humanoid robots. Source: <https://roboticsandautomationnews.com/2026/03/09/texas-instruments-and-nvidia-partner-to-accelerate-humanoid-robot-development/99374/>

Radar plus cameras is particularly relevant in industrial and semi structured environments:

- Cameras struggle with glare, low light, and transparent obstacles.
- Radar can be robust to dust, fog, and lighting, and can detect some objects that are visually hard.

When people say physical AI is arriving, this is part of what they mean: not only better policies, but better sensor stacks and better integration between perception, control, and safety.

## Safety and standards: the hard part of real deployment

Any discussion of humanoids in factories should include safety, because the whole promise is to operate near humans and inside human designed environments.

A useful reference point is ISO guidance for collaborative robot systems. ISO/TS 15066:2016 specifies safety requirements for collaborative industrial robot systems and supplements the collaborative operation guidance in ISO 10218-1 and ISO 10218-2. Source: <https://www.iso.org/standard/62996.html>

Even if a humanoid is not classified as an industrial robot in the same way as a fixed arm in a cage, the safety principles still matter:

- Risk assessment for the task and environment.
- Limits on force and speed in collaborative modes.
- Safe stopping behavior.
- Monitoring and separation.

A factory trial that meets takt time is only half the story. The other half is: can the system operate safely, day after day, with predictable failure modes and recovery behavior.

## How to interpret the 90.2 percent number

A 90.2 percent success rate sounds high for an early stage humanoid deployment, but it also means failures are still frequent in production terms.

To see why, do a rough thought experiment. If the line is truly at a 76 second cycle time, then in three hours you have about:

- 3 hours = 10,800 seconds
- 10,800 / 76 ≈ 142 cycles

A 90.2 percent success rate over roughly 142 cycles implies roughly 14 failures. That might be acceptable for a pilot, but it is far from the defect rates required for mass production without significant human intervention.

This is not a criticism. It is a reminder that the path from pilot to deployment is mostly about:

- Reducing the tail of rare failures.
- Making failures safe.
- Making recovery fast.
- Proving reliability across shifts, operators, and environmental variation.

Factories can tolerate novelty for a pilot. They demand boring reliability for deployment.

## Why a humanoid, not a conventional robot arm?

If you already have an automated feeder and a fixture, why not use a fixed industrial arm, or a custom mechanism?

There are three strategic answers:

1. **Reconfigurability.** A humanoid could, in theory, be moved to a new station and taught a new task faster than designing new hard automation.

2. **Handling long tail tasks.** Many factories have a handful of tasks that are not worth custom automation but still consume human labor.

3. **Future proofing.** Companies like Xiaomi may see humanoids as a platform investment, similar to how an EV manufacturer invests in battery and power electronics expertise.

The counterargument is just as important: in many stations, a humanoid may be a worse solution than a robot arm. Humanoids have more degrees of freedom, more failure modes, and typically higher costs.

The best near term value is likely in stations where you need human like reach and dexterity, but the task is still constrained enough to be engineered.

## What to watch next

Over the next year, expect more factory pilots to publish real metrics like takt time, uptime, and intervention rate instead of only videos. Technically, the stack will likely move toward richer sensing (touch, torque, radar plus cameras) and tighter integration between learned policies and engineered safety and timing constraints. The winners will be the teams that turn pilot failures into a fast improvement loop, without compromising safety.

## The bigger picture: physical AI is becoming measurable

Humanoid robots in factories are no longer a purely speculative narrative. Xiaomi reporting a takt time and a success rate is part of a shift toward measurable performance.

It does not mean humanoids are ready to replace large numbers of workers today. It means the field is beginning to meet the factory on its own terms: seconds, yields, safety, and uptime.

If Xiaomi follows this pilot with more stations and longer runs, it will become one of the more informative real world tests of physical AI. For the rest of the industry, the message is clear: the next wave of robotics progress will be judged less by what a robot can do once, and more by what it can do reliably, safely, and repeatedly.

## Sources

- CNBC: Xiaomi trials humanoid robots in its EV factory — says they are like interns. <https://www.cnbc.com/2026/03/04/xiaomi-humanoid-robots-ev-factory-.html>
- Robotics and Automation News: Xiaomi tests humanoid robots on electric vehicle production line in automotive factory. <https://roboticsandautomationnews.com/2026/03/10/xiaomi-tests-humanoid-robots-on-electric-production-line-in-automotive-factory/99418/>
- Robotics and Automation News: Texas Instruments and Nvidia partner to accelerate humanoid robot development. <https://roboticsandautomationnews.com/2026/03/09/texas-instruments-and-nvidia-partner-to-accelerate-humanoid-robot-development/99374/>
- ISO: ISO/TS 15066:2016 Robots and robotic devices — Collaborative robots. <https://www.iso.org/standard/62996.html>
