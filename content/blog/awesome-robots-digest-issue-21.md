---
title: "Awesome Robots Digest Issue 21: Humanoid Mega-Rounds, Open Hardware Arms, and BCI-to-Robot Control"
slug: "awesome-robots-digest-issue-21"
date: "2026-03-06"
author: "bob-jiang"
category: "digest"
tags: ["robotics", "AI", "humanoid robots", "robot learning", "funding", "open source", "weekly digest"]
excerpt: "This week: humanoid robotics funding hits new highs, China’s fast-iteration hardware stack keeps setting the pace, and open-source tooling plus open hardware make robot learning more accessible."
featured: true
published: true
seo:
  title: "Awesome Robots Digest Issue 21 (Mar 6, 2026)"
  description: "Weekly robotics roundup covering Neura’s reported €1B raise, China’s humanoid lead, open-source robot learning tools, and new BCI-driven robot control research."
  keywords: ["robotics news", "humanoid robots", "robotics funding", "Neura Robotics", "robot learning", "open-source robotics", "IROS 2026"]
---

## TL;DR

- **Humanoid funding is entering “infrastructure scale.”** Neura Robotics is reportedly in talks for a **€1B** raise, while China’s embodied-intelligence players increasingly treat **~¥1B B-rounds** as the new baseline for serious commercialization.
- **The “fast iteration” advantage is compounding.** China’s EV-hardened supply chain (sensors, batteries, manufacturing) is translating into cheaper robots, quicker model refreshes, and more real-world pilots.
- **Robot learning is getting easier to adopt.** New open-source stacks (and open hardware arms) are converging on a practical workflow: teleop → dataset → training → deployment.

## Introduction

This week’s theme is scale—capital scale, manufacturing scale, and (in a quieter way) developer-tool scale.

On one end, the humanoid race is being fueled by funding rounds that look more like late-stage infrastructure bets than “robotics startup” checks. On the other end, the open ecosystem is pushing in the opposite direction: lowering the barrier to run serious robot-learning experiments at home or in small labs.

If 2025 was the year of “wow, this robot can move,” early 2026 is starting to look like the year of “can you build, ship, and support it—repeatedly?”

## Top News & Breakthroughs 📰

### 1) Neura Robotics reportedly in talks for a €1B raise (with Tether rumored as a backer)

SiliconANGLE reports that Germany-based **Neura Robotics** is in talks to raise **~€1 billion (~$1.2B)**, citing Bloomberg. The piece also notes earlier rumors about a much higher valuation range, versus Bloomberg’s reported **~€4B** valuation.

Why it matters:
- At this size, funding isn’t just for R&D—it’s for **manufacturing readiness**, supply-chain commitments, acquisitions, and go-to-market execution.
- The “humanoid” category is starting to attract **non-traditional capital** with different time horizons (and different risk appetites).

Read (SiliconANGLE):
https://siliconangle.com/2026/03/04/humanoid-robot-maker-neura-robotics-reportedly-raising-1-2b-funding/

### 2) China’s humanoid ecosystem is winning early market share via iteration speed and supply chain depth

TechCrunch frames China’s early lead as a combination of (1) a robust hardware supply chain built through EV manufacturing, (2) faster iteration cycles, and (3) policy/industrial strategy that pushes automation upgrades. The article also highlights a shift from “demo-driven excitement” to “operations-driven adoption.”

Why it matters:
- For humanoids, **unit economics + reliability** will dominate the next phase. Fast iteration helps—until it collides with safety and support realities.
- The article calls out a core constraint everyone shares: **data scarcity**. Unlike LLMs, embodied models can’t scrape the internet for “next physical state” examples at scale.

Read (TechCrunch):
https://techcrunch.com/2026/02/28/why-chinas-humanoid-robot-industry-is-winning-the-early-market/

### 3) B-rounds in China’s embodied-intelligence sector are clustering around “~¥1B or you’re not in the game”

Gasgoo describes a surge of **high-value B-rounds** across embodied robotics—highlighting **Noetix Robotics’** announcement of a **nearly ¥1B** B-round (March 2), and similar “billion-yuan level” rounds across multiple peers.

Why it matters:
- B-round has become the transition from “tech validation” to **commercial expansion**, which implies real spend: compute, data pipelines, manufacturing capacity, and scenario deployment.
- Industrial and state capital involvement (e.g., CATL-related platforms, strategic investors with real deployment surfaces) is a signal that the category is being treated as **strategic industrial capability**, not just a venture bet.

Read (Gasgoo):
https://autonews.gasgoo.com/articles/market-industry/embodied-robotics-no-b-round-without-1-billion-yuan-2029151246974296065

### 4) Honor says it will unveil its first humanoid service robot at Mobile World Congress 2026

CNET reports that phone-maker **Honor** plans to unveil its first humanoid service robot at **MWC in Barcelona (March 1)**. Details are limited, but it’s notable as a consumer-electronics brand stepping more explicitly into robotics as “device + agent” narratives accelerate.

Why it matters:
- Consumer brands entering robotics may push the market toward **service scenarios** and high-volume hardware disciplines (productization, supply chain, support, UX).
- Even if early prototypes are limited, these launches shape expectations around **human-robot interaction** and what “everyday robotics” should feel like.

Read (CNET):
https://www.cnet.com/tech/computing/honor-will-unveil-humanoid-robot-at-mobile-world-congress-2026/

### 5) Carnegie Mellon opens a Robotics Innovation Center to accelerate research-to-real-world impact

CMU’s announcement highlights the official opening of the **Robotics Innovation Center (RIC)**, positioned as a facility to accelerate robotics, automation, and AI breakthroughs with real-world impact—while reinforcing Pittsburgh’s role as a robotics commercialization hub.

Why it matters:
- The biggest robotics bottleneck is often not “a clever model,” but **integration capacity**: testbeds, partnerships, and the ability to run long, boring reliability loops.
- Dedicated centers like this tend to amplify both research output and startup formation—especially around applied robotics and autonomy.

Read (CMU):
https://www.cmu.edu/news/stories/archives/2026/february/digital-toolkit-cmu-robotics-and-innovation

## Research Spotlight 🔬

### 6) EEG-based hybrid visual + motor imagery for real-time grasp-and-place

A new arXiv paper presents a framework that uses **EEG** signals for “cue-free” **visual imagery (VI)** and **motor imagery (MI)** to control a robot’s grasp-and-place behavior—decoding *what to grasp* and *where to place* as two channels of intent. The authors report online decoding accuracies of **40.23% (VI)** and **62.59% (MI)**, with an end-to-end task success rate of **20.88%** on a real robot.

Why it matters:
- In practical human-robot collaboration, high-level intent (choose object, choose placement) is often more valuable than low-level continuous control.
- The results also underline a hard truth: BCI-to-robot is promising, but today it’s still constrained by noise, calibration, and robustness requirements.

Paper (arXiv):
https://arxiv.org/abs/2603.03181

## Event Horizon 📅

### IROS 2026: paper submission window and key deadlines (March)

If you’re targeting IROS 2026, note the near-term timeline:
- **Paper submissions deadline:** March 2, 2026
- **Submissions may be modified (but not started) through:** **March 5, 2026**
- **Paper video submissions deadline:** March 7, 2026
- **Workshop/Tutorial proposals deadline:** March 16, 2026

Important dates (IROS 2026):
https://2026.ieee-iros.org/about/important-dates/

## Tool/Resource of the Week 🛠️

### LeRobot (Hugging Face): an open-source library for end-to-end robot learning

A fresh arXiv release introduces **LeRobot**, an open-source library intended to cover the full robot-learning loop: low-level communication for motor control, dataset collection/storage/streaming, and implementations of multiple learning paradigms—plus an asynchronous inference stack.

Why it’s useful:
- It’s designed to reduce the “glue code tax” that slows down real-world robot learning.
- It matches the direction the field is taking: **data + scalable learning** over hand-tuned pipelines.

Read (arXiv):
https://arxiv.org/abs/2602.22818

Project link (GitHub):
https://github.com/huggingface/lerobot

## Community Corner 👥

### 1) Open hardware is meeting real software support: Seeed’s reBot Arm B601

Hackster reports that **Seeed Studio** is releasing an affordable, open-source robotic arm design: **reBot Arm B601** (6-DoF + gripper) targeting a sub-$1,000 build, with claimed **650mm reach**, **≥1.5kg payload**, and **<0.2mm repeatability**.

What stands out isn’t only the specs—it’s the plan for a full software + docs stack (ROS 2, LeRobot, Pinocchio, Isaac Sim, Python SDK, and training materials). That’s exactly what open hardware needs to become a reliable learning platform instead of a weekend project.

Read (Hackster):
https://www.hackster.io/news/seeed-studio-releases-their-own-affordable-and-open-source-robotic-arm-3403f854a281

Repo:
https://github.com/Seeed-Projects/reBot-DevArm/

### 2) “Teleop → dataset → policy” is becoming the default on-ramp

Between open-source stacks like LeRobot and open, documented hardware platforms, we’re seeing a clearer community consensus on the quickest way to get useful robot behavior:

- Teleoperate a simple arm reliably.
- Capture clean demonstrations.
- Train a policy (and measure failure modes, not just success clips).
- Iterate with better data rather than endless controller tweaks.

In 2026, the teams that win won’t just have bigger models—they’ll have better **data flywheels** and tighter **evaluation loops**.

## Conclusion 🎯

This week’s signal is strong: humanoid robotics is no longer being funded like a novelty category. It’s being funded like an industrial platform, with billion-euro and billion-yuan rounds increasingly tied to commercialization, scenario deployment, and manufacturing muscle.

At the same time, the open ecosystem is doing something equally important: making robot learning feel less like an elite research workflow and more like a repeatable developer practice.

If those trends keep converging—capital for scale, and tooling for accessibility—2026 may be the year robotics starts to look less like a collection of demos and more like a real software-and-hardware industry.

## Stay Connected

- Subscribe: https://awesomerobotsxyz.substack.com/
- Follow on X: https://x.com/awesome__robots
- Website: https://www.awesomerobots.xyz/
