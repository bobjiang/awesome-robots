---
title: "Control Barrier Function Safety Filters: When Safe Controllers Become Unstable (and How to Fix It)"
slug: "control-barrier-functions-safety-filters-stability"
date: "2026-04-03"
author: "bob-jiang"
category: "tutorials"
tags: ["robotics", "safety", "control", "CBF", "MPC", "humanoid robots", "autonomy"]
excerpt: "Control Barrier Function (CBF) safety filters can keep robots inside safe sets, but they can also introduce spurious equilibria or unstable behavior; this post explains why and what recent theory says to do about it."
featured: true
published: true
seo:
  title: "CBF Safety Filters in Robotics: Stability, Spurious Equilibria, Fixes"
  description: "A practical guide to Control Barrier Function safety filters for robots: how the QP works, why closed loop dynamics can become unstable, and how recent results help you design stable filters."
  keywords: ["control barrier function", "CBF safety filter", "robot safety", "quadratic program", "safety critical control", "humanoid robot control"]
---

## The promise (and trap) of CBF safety filters

If you work on robots that share space with people, you end up with a brutal requirement:

- Your controller must achieve the task (tracking, manipulation, locomotion).
- It must **never** violate safety constraints (joint limits, collision distance, tipping risk, speed limits, keep out zones).

Control Barrier Functions (CBFs) became popular because they offer a clean engineering story:

1. Design any nominal controller you like (RL policy, MPC, LQR, a hand tuned whole body controller).
2. Wrap it in a **safety filter** that makes the minimal change needed to satisfy safety constraints.
3. Solve a small quadratic program (QP) at each timestep.

In practice, this pattern shows up everywhere: mobile robots around humans, manipulators near workcells, and yes, humanoid robots.

But there is a subtle trap: **the filter changes the dynamics**. It can keep the state inside the safe set and still create behavior you did not intend:

- New equilibria that did not exist in the nominal system (the robot gets stuck).
- Limit cycles (the robot oscillates on a safety boundary).
- Worse: trajectories that become unbounded or unstable once the filter activates.

A March 2026 letter from Caltech, *Dynamical Properties of Safety Filters for Linear Systems and Affine Control Barrier Functions* (arXiv:2603.17401), puts sharp conditions on when these issues happen for an important special case: **linear dynamics with an affine barrier constraint**. Even if your robot is nonlinear, the linear case matters because many safety filters run on linearizations and local models.

Sources:
- Caltech letter (Mar 2026): https://arxiv.org/abs/2603.17401
- HTML version: https://arxiv.org/html/2603.17401v1

## CBF basics in 5 minutes (enough to reason about stability)

A CBF defines a **safe set**:

- State: \(x\)
- Safe set: \(\mathcal{C} = \{x : h(x) \ge 0\}\)

Intuition: \(h(x)\) is positive inside the safe region and negative outside.

For a control affine system:

\[\dot{x} = f(x) + g(x)u\]

CBF theory gives a sufficient condition that makes \(\mathcal{C}\) forward invariant (once inside, always inside). A common form for relative degree 1 is:

\[\dot{h}(x,u) \ge -\alpha(h(x))\]

with \(\alpha\) a class \(\mathcal{K}\) function (often \(\alpha(h)=\gamma h\)).

### The safety filter pattern

Given a nominal controller \(k(x)\), you compute a safe control \(u^*(x)\) by solving:

\[u^*(x) = \arg\min_u \frac{1}{2}\lVert u-k(x)\rVert_G^2\]

subject to the CBF inequality. When the constraint is inactive, \(u^*(x)=k(x)\). When it is active, the control is projected onto the safe side.

Engineers love this because it is modular: swap in a new nominal controller and keep the same safety wrapper.

## Why safety can break stability

Here is the key point that many teams learn the hard way:

> The QP enforces a constraint. It does not inherently preserve the nominal controller stability properties.

Even if \(k(x)\) is globally stabilizing, the filtered controller can:

- Create **piecewise** dynamics with different modes.
- Introduce discontinuities or sharp corners (even if the solution is Lipschitz, the closed loop can still have new equilibria).
- Push the system into an active constraint mode whose dynamics are unstable.

The Caltech letter studies exactly this: what can be said about equilibria, boundedness, and global exponential stability for the filtered closed loop.

## The March 2026 result: linear systems + affine barrier constraints

The setup is:

- Linear dynamics: \(\dot{x}=Ax+Bu\)
- Affine barrier: \(h(x)=c^\top x + d\) with \(d>0\) so the origin is safe

When you apply a CBF safety filter (QP), the closed loop becomes a **hybrid or piecewise** linear system:

- A nominal mode (constraint inactive)
- A filtered mode (constraint active)

The paper derives a closed form solution for the active mode and shows how its matrix eigenstructure governs behavior.

### Undesired equilibria: the robot can get stuck in a new steady state

A common failure pattern in robotics looks like this:

- The nominal controller wants to go through a region that violates the barrier.
- The safety filter pushes back.
- The robot ends up on or near the boundary and stops making progress.

Mathematically, that is a **spurious equilibrium**: an equilibrium of the filtered system that is not an equilibrium of the nominal system.

The letter characterizes when such undesired equilibria can exist in the linear affine case, and relates it to the parity of the number of positive real eigenvalues of the active mode matrix.

You do not need the full proof to take the lesson:

- If you do not check the active mode dynamics, the filter can create new stable points.
- Your robot can become safe and useless at the same time.

### Unbounded trajectories: yes, a safety filter can blow up the state

The more alarming result is about boundedness.

The letter shows a strong dichotomy (in the studied case):

- If the active mode matrix is Hurwitz, the origin is globally exponentially stable.
- If it has eigenvalues with positive real part, the closed loop can have unbounded trajectories.

This is not a contradiction with safety (staying inside \(h(x)\ge 0\)). You can stay inside a half space and still go to infinity.

Think of a simple constraint like \(x_1 \ge -d\). The filter might keep you on the correct side of the plane and still allow \(\lVert x \rVert \to \infty\) in other directions.

For humanoid robots, this maps to real problems:

- A filter enforces foot placement or friction constraints but destabilizes torso dynamics.
- A filter enforces collision distance but drives joint velocities into saturation.
- A filter protects one constraint while pushing energy into another subsystem.

## A mental model: the active mode is a new controller

When the constraint is active, the QP solution is effectively a different controller.

If you only test your nominal policy in simulation without frequent constraint activation, you can miss the real closed loop behavior.

Practical takeaways:

1. **Log constraint activation rate**. If it is active a lot, you are mostly running the active mode controller.
2. **Stress test with adversarial initial states** near the barrier.
3. **Analyze eigenvalues** of the linearized active mode if you use linear models, or at least check local Lyapunov behavior.

## Connection to invariant zeros (why some systems are cursed)

One elegant part of the Caltech letter is an interpretation in terms of invariant zeros of a derived SISO system.

Translation for practitioners: there are structural properties of \((A,B,c)\) that can make it hard to find a nominal controller that stays well behaved under filtering.

This matters for robotics stacks where:

- The barrier is defined on a particular output (distance to obstacle, ZMP margin, velocity bound).
- The nominal controller is designed on a different set of objectives.

If the system has problematic zeros, the filter can fight the nominal controller in a way that makes the active mode unstable.

## How to design safer safety filters (practical checklist)

CBFs are still useful. You just need to treat the filter as part of the controller design, not a bolt on.

### 1) Pick barrier functions that align with the task dynamics

Bad pattern:

- Nominal controller tries to regulate a quantity that the barrier directly constrains.
- The filter constantly overrides the nominal input.

Better pattern:

- Use barrier functions that reflect physical constraints but do not contradict your main regulation objective.
- If the contradiction is fundamental, redesign the nominal controller so it is naturally safe most of the time.

### 2) Tune the class K gain with stability in mind

Many implementations set \(\alpha(h)=\gamma h\) and crank \(\gamma\) up.

That can reduce violations, but it can also:

- Increase stiffness of the closed loop.
- Create oscillations near the boundary.
- Increase the chance that the active mode becomes unstable.

Treat \(\gamma\) like a feedback gain that needs a stability check, not like a magic safety knob.

### 3) Prefer smooth relaxations over hard switching when possible

Hard activation boundaries create piecewise dynamics.

Mitigations:

- Use soft constraints (slack variables) when strict safety is not required.
- Use higher order CBFs carefully to avoid chattering.
- Use filtered measurements and consistent discretization.

### 4) Check for spurious equilibria explicitly

In the linear affine case, the paper gives a characterization. In nonlinear systems, you can still do a pragmatic version:

- Sample the boundary region.
- Solve the QP.
- Check whether \(\dot{x}\) is near zero in places where the nominal controller is not.

If you find a stuck point, you can:

- Modify the barrier (rotate the half space, change d).
- Change the nominal controller so its action is tangent to the boundary.
- Add a higher level planner that avoids driving directly into the constraint.

### 5) Combine CBFs with MPC thoughtfully

MPC can help because it reasons about future constraint activation, but it also increases computational load.

A related 2026 paper discusses probabilistic safety guarantees for learned barrier functions and highlights the real time constraints (for example, sub 20 ms solve time at 50 Hz) and uncertainty propagation challenges:

- MDPI (Jan 2026): https://www.mdpi.com/2227-7390/14/3/516

Even if you do not use their full theory, the engineering message is clear:

- Do not ignore model uncertainty.
- Do not ignore solver timing.
- A safety method that misses deadlines is not safe.

## Worked example (conceptual): stable nominal controller, unstable filtered mode

Imagine a 2D linear system where the nominal controller stabilizes the origin quickly.

Now add a barrier that enforces a half space constraint, like staying on one side of a line.

When you hit that line, the QP projects the control onto the safe side. Geometrically that is a projection. Dynamically it is a new feedback law.

If that projected feedback induces an unstable eigenvalue in the active mode, the system can accelerate away while still respecting the half space.

This is why teams sometimes see a robot that:

- Never violates the safety constraint
- But drifts, spins up velocities, or explodes in some unmonitored state

The fix is not to delete the safety filter. The fix is to redesign the full closed loop so the active mode is stable.

## What you should do this week if you ship robots

1. **Add logging**: barrier value h(x), whether the constraint is active, QP solve status, and norm of control modification \(\lVert u^* - k(x) \rVert\).
2. **Run a constraint activation test suite**: random initial states near the boundary, with disturbances.
3. **Inspect for spurious equilibria**: does the robot stop near the boundary when it should slide along it.
4. **Perform local stability checks**: linearize your closed loop under active constraints and check eigenvalues.
5. **Document safety scope**: what is guaranteed (forward invariance of h(x) >= 0) and what is not (stability, boundedness, task completion).

## Closing thought

CBF safety filters are a powerful idea because they convert safety into a constraint and solve it at runtime. The danger is the same as their appeal: the filter is a controller.

If you treat it as an afterthought, you can end up with a system that is technically safe and practically broken.

The good news is that results like arXiv:2603.17401 are turning the folk wisdom into checkable conditions. Use them as a forcing function: analyze the active mode, not just the nominal policy.
