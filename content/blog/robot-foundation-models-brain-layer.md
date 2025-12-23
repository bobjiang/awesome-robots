---
title: "Robot Foundation Models: Who's Building the 'Brain' Layer?"
slug: "robot-foundation-models-brain-layer"
author: "bob-jiang"
date: "2025-12-22"
category: "news"
tags: ["foundation-models", "skild-ai", "physical-intelligence", "google-deepmind", "tesla-optimus", "vla-models", "general-purpose-ai", "robot-intelligence", "ai-research", "embodied-ai"]
excerpt: "A comprehensive analysis of the race to build foundation models for robots in 2025. Exploring Skild Brain's omni-bodied vision, Physical Intelligence's open-source π0, Google's Gemini Robotics, and what 'general-purpose' really means in robotics AI."
featured: true
published: true
seo:
  title: "Robot Foundation Models 2025: Skild AI, Physical Intelligence, Google - Who's Building the Brain Layer?"
  description: "Deep dive into robot foundation models: Skild Brain ($14B valuation), Physical Intelligence π0 (open-sourced), Google Gemini Robotics, Tesla Optimus AI, GEN-0. Analysis of VLA architectures, $470M+ funding, technical approaches, and what general-purpose robotics AI actually means in 2025."
  keywords: ["robot foundation models", "skild ai brain", "physical intelligence pi0", "google gemini robotics", "VLA models", "vision language action", "general purpose robotics", "embodied ai", "robot intelligence", "foundation model funding", "dual system architecture", "omni-bodied intelligence"]
---

The hardware problem in robotics is largely solved—or at least, it's solving itself. Humanoid robots can walk, grasp, and navigate. Quadrupeds climb stairs and traverse rough terrain. Manipulator arms achieve sub-millimeter precision. Yet walk into any warehouse deploying "advanced" robots and you'll find systems that excel at exactly one task, learned through painstaking manual programming or months of reinforcement learning training. Change the task, change the object, change the environment, and you start from scratch.

The bottleneck has shifted from bodies to brains. More precisely: from hardware to the intelligence layer that transforms capable robotic platforms into truly general-purpose systems. This is the frontier where [billions of dollars in capital](https://tracxn.com/d/sectors/foundation-model-for-robots/__TkCNTbGzBgOQD-gvXouaw9wsjiwyjX4SRvDRtMq0e9s) and some of the sharpest minds in AI are now focused. The race to build foundation models for robots—systems that can learn once and apply broadly across tasks, embodiments, and environments—defines robotics AI in 2025.

But what does "general-purpose" actually mean when applied to robot intelligence? And who's closest to delivering it? The answers are more nuanced—and the timeline longer—than the breathless announcements suggest.

## Defining "General-Purpose": Three Dimensions

"General-purpose" has become robotics AI's favorite marketing term and most abused promise. To cut through the hype, it helps to decompose the concept into three distinct dimensions of generalization:

**Task Generalization**: This is the ability to execute diverse, unrelated tasks without task-specific training. [The vision](https://arxiv.org/html/2312.08782v3) is a robot that can fold laundry, clean surfaces, organize groceries, and assemble products—all from natural language instructions, without separate models for each task. Current reality is more modest: most "general-purpose" systems handle 20-70 related tasks within a domain. A robot that folds five types of shirts has achieved narrow task generalization; a robot that can fold shirts, wash dishes, and reorganize shelves has achieved broader task generalization. True task generalization—arbitrary task execution from natural language alone—remains aspirational.

**Embodiment Generalization** (what [Skild AI calls "omni-bodied intelligence"](https://www.skild.ai/blogs/building-the-general-purpose-robotic-brain)): This is perhaps the most economically compelling dimension. The same foundation model should work on quadruped robots, humanoid robots, mobile manipulators, tabletop arms, and bimanual systems. Different morphologies present different action spaces, joint configurations, and physical capabilities, yet the underlying intelligence should transfer. Why does this matter? Economics. Training a foundation model costs tens to hundreds of millions of dollars. If that investment must be repeated for each robot form factor, the business case collapses. Embodiment generalization amortizes development cost across the entire robotics market.

**Environment Generalization**: Can a model trained in structured warehouses operate in chaotic homes? Can it handle known objects and also adapt to novel objects it's never encountered? This dimension separates controlled industrial deployment from the genuine "household robot" vision. Current systems excel in structured environments with constrained object sets. Unstructured environments—where furniture varies, objects are unfamiliar, lighting changes, and humans unpredictably intervene—remain significantly more challenging.

The crucial insight: "General-purpose" exists on a multidimensional spectrum, not as a binary achievement. Every player in the foundation model space makes different tradeoffs across these three dimensions.

## The Major Players: Five Approaches to Robot Brains

### Skild AI: The Omni-Bodied Vision

[Skild AI emerged from stealth](https://www.skild.ai/blogs/announcing-our-300m-series-a) in 2024 with a $300 million Series A and an audacious claim: building a single foundation model that works across any robot embodiment, in any environment, for any task. By December 2025, [reports suggested SoftBank and Nvidia were in talks to fund the company at a $14 billion valuation](https://techcrunch.com/2025/12/08/softbank-and-nvidia-reportedly-in-talks-to-fund-skildai-at-14b-nearly-tripling-its-value/)—nearly tripling its value in 18 months.

The technical approach combines massive-scale simulation with internet video pre-training. Rather than collecting millions of hours of expensive robot teleoperation data, Skild leverages the billions of hours of human demonstrations already available on YouTube and elsewhere. This pre-training creates a foundation of what tasks look like and how objects behave. The model is then post-trained with targeted real-world robot data to ground these representations in actual robotic action spaces.

[In July 2025, Skild provided its first public demonstration](https://www.businesswire.com/news/home/20250729431330/en/Skild-AI-Provides-First-Look-at-Its-General-Purpose-Robotic-Brain), showcasing the Skild Brain operating across quadrupeds, humanoids, tabletop arms, and mobile manipulators. The demonstration emphasized safety—end-to-end AI models trained to apply low forces—and adaptability to disturbances and human interactions.

Crucially, Skild isn't building hardware. The business model is robot-agnostic foundation model licensing to robot manufacturers. This positions Skild as the potential "Android of robotics"—a shared intelligence layer that hardware manufacturers can license rather than develop internally. [In March 2025, the company partnered with HPE](https://www.hpe.com/us/en/newsroom/press-release/2025/03/skild-ai-accelerates-development-of-human-like-robot-brain-with-ai-solutions-from-hewlett-packard-enterprise.html) for secure, private AI-as-a-service infrastructure comprising AI servers and storage solutions to power an exponential expansion of its engineering operations.

The reality check: Deployment data remains limited. The July 2025 demo showed capability breadth, but not deployment depth. Customer announcements have been sparse. As with many foundation model companies, the gap between compelling demonstrations and scaled commercial deployment is the defining challenge of 2026-2027.

### Physical Intelligence (π0): The Open-Source Play

[Physical Intelligence](https://www.physicalintelligence.company/) took a different strategic path: open-sourcing its foundation model to accelerate ecosystem development and data collection. With [$470 million in total funding](https://tracxn.com/d/sectors/foundation-model-for-robots/__TkCNTbGzBgOQD-gvXouaw9wsjiwyjX4SRvDRtMq0e9s)—the highest in the foundation model for robots sector—the San Francisco startup has the resources for a long-term play.

[In February 2025, Physical Intelligence open-sourced π0 and π0-FAST](https://www.therobotreport.com/physical-intelligence-open-sources-pi0-robotics-foundation-model/), releasing code and model weights via its experimental GitHub repository. This marked a significant shift from proprietary development to community-driven iteration. The models employ flow matching to produce smooth, real-time action trajectories at 50Hz, making them highly efficient and precise for real-world deployment.

π0 was trained on data from seven robotic platforms executing 68 unique tasks, demonstrating strong zero-shot and fine-tuned performance on complex scenarios: laundry folding, table bussing, coffee bean scooping, grocery bagging, box assembly. [The company claims 1-20 hours of data is sufficient to fine-tune π0 to new tasks](https://www.physicalintelligence.company/blog/pi0)—a remarkable promise if it holds across truly novel task distributions.

The strategic logic of open-sourcing is clear: by making the model freely available, Physical Intelligence can crowdsource both improvements and deployment data. As researchers and companies fine-tune π0 for their specific applications, Physical Intelligence gains visibility into what works, what fails, and where the next research priorities lie. The bet is that being the foundation of an open ecosystem creates more value than keeping the model proprietary.

The risk: open-sourcing commoditizes the foundation model itself. If value accrues to fine-tuned, domain-specific versions or to proprietary data pipelines rather than to the base model, Physical Intelligence's strategic moat may prove thinner than anticipated.

### Google DeepMind: The Research Powerhouse

Google DeepMind's approach to robot foundation models has evolved through several generations: [RT-1, RT-2, RT-X, and most recently, Gemini Robotics](https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/). The progression illustrates both the promise and the challenge of translating cutting-edge AI research into deployed robot systems.

[RT-2](https://deepmind.google/blog/rt-2-new-model-translates-vision-and-language-into-action/), introduced in 2023, demonstrated the power of vision-language-action (VLA) architecture. By training on both internet-scale text and images plus robot demonstration data, RT-2 achieved 62% success rates on previously unseen scenarios—nearly double RT-1's 32% performance. More impressively, RT-2 could perform semantic reasoning: when asked to choose an improvised hammer, it selected a rock; when asked for the best drink for a tired person, it chose an energy drink. The model generalized from web knowledge to robotic action.

[RT-X extended this paradigm to cross-embodiment learning](https://deepmind.google/blog/scaling-up-learning-across-many-different-robot-types/). Collaborating with 33 academic labs, DeepMind pooled data from 22 different robot types into the Open X-Embodiment dataset. RT-2-X, the resulting 55-billion-parameter model, demonstrated three times better performance on emergent skills compared to single-embodiment training. The insight: diverse data from many robots generalizes better than massive data from one robot.

[In March 2025, Google introduced Gemini Robotics](https://arxiv.org/abs/2503.20020), built on the Gemini 2.0 foundation. This advanced VLA model executes smooth, reactive movements while remaining robust to variations in object types and positions. The architecture pairs reasoning capabilities with learned low-level actions, enabling highly dexterous manipulation tasks. It represents the state of the art in research demonstrations.

Yet commercial deployment remains unclear. Google has shown no indication of licensing these models to robot manufacturers, nor of building its own commercial robot products. The research continues to advance the field—the Open X-Embodiment dataset has become a community resource—but the path from DeepMind's labs to factory floors or living rooms remains undefined. For investors seeking near-term commercial returns, this is research infrastructure, not a product company.

### Generalist AI (GEN-0): The Data Scale Play

[In November 2025, Generalist AI introduced GEN-0](https://generalistai.com/blog/nov-04-2025-GEN-0), positioning it as "a new class of embodied foundation models built for multimodal training directly on high-fidelity raw physical interaction." The key differentiation: while competitors emphasize simulation and internet video for pre-training, Generalist AI emphasizes real-world data scale.

GEN-0 is trained on 270,000 hours of real-world manipulation trajectories collected across thousands of homes, warehouses, and workplaces worldwide. This represents a massive data collection effort—roughly 30 years of continuous robot operation. The claim: physical interaction data contains essential information that cannot be fully captured through vision and language alone. Haptic feedback, force dynamics, contact mechanics, and temporal dynamics of manipulation are fundamentally different from passive observation.

The approach is capital-intensive: collecting 270,000 hours of real-world data requires significant infrastructure investment. But if the bet is correct—if embodied AI fundamentally requires embodied data at scale—then this investment creates a durable moat. Competitors relying primarily on simulation or internet video may hit capability ceilings that only real-world data can overcome.

The model launched recently, and deployment data remains scarce. GEN-0 represents a testable hypothesis: that data quality and source (real-world physical interaction) matters more than the clever architectural innovations or simulation scale that other players emphasize. The next 12-18 months will reveal whether this hypothesis holds.

### Tesla Optimus: The Vertical Integration Bet

Tesla's approach to robot intelligence differs fundamentally from every other player: vertical integration of hardware, software, training infrastructure, and deployment environment. This creates unique advantages and unique constraints.

The technical foundation is Tesla's "neural world simulator," [a system trained on massive video data from the Tesla vehicle fleet](https://www.notateslaapp.com/news/2998/an-in-depth-look-at-how-teslas-optimus-learns-digital-dreams-and-ai-simulation). This simulator learns to predict future states of the world in response to actions, functioning as a scalable world model. Tesla uses this infrastructure to generate "digital dreams"—synthetic environments where Optimus can practice tasks millions of times before a single physical servo moves.

[The training process has three stages](https://www.shop4tesla.com/en/blogs/news/tesla-optimus-digitale-traeume-ki-training): First, ingest training videos of human demonstrations (first-person and third-person views). Second, train Optimus in virtual environments synthesized by the world simulator. Third, deploy physically for fine-tuning. Tesla has shifted toward a [vision-only approach](https://www.webpronews.com/tesla-shifts-optimus-robot-training-to-vision-only-ai-approach/), filming employees performing everyday tasks to generate training data rather than using motion capture suits or teleoperation rigs.

The advantage: Tesla controls the full stack. The simulator, the robot hardware, the deployment environment (Tesla factories initially), and the data pipeline are all internal. This enables tight integration and rapid iteration. Moreover, Tesla's end-to-end neural networks transfer seamlessly from Full Self-Driving development to Optimus—vehicle autonomy and humanoid autonomy share fundamental perception and planning challenges.

The constraint: Tesla is building for Tesla. While the company may eventually license its models, near-term development is focused on internal deployment. This limits data diversity—Tesla factories are structured environments with known objects—which may create capability gaps when Optimus attempts tasks in less controlled settings.

Deployment reality: As of late 2025, Optimus operates only in Tesla's internal facilities. External pilot programs remain scheduled for 2026. The gap between Elon Musk's production projections (5,000 units by end of 2025, 100,000 by 2026) and actual deployment continues to widen.

## The Technical Architecture Convergence: VLA Models

Across different companies and approaches, a technical architecture consensus is emerging: Vision-Language-Action (VLA) models have become the dominant paradigm for robot foundation models in 2025.

[VLA models unify vision, language, and action data at scale](https://vla-survey.github.io/), learning policies that generalize across tasks, objects, embodiments, and environments. The architecture typically comprises a vision-language encoder (often based on pre-trained models like CLIP or Gemini) paired with an action decoder that transforms high-level representations into continuous robot actions.

Three major architectural patterns have emerged:

**Dual-System Architecture** has become dominant in 2025. This approach separates high-level reasoning from low-level control:
- **System 2**: An internet-scale vision-language model handles scene understanding, task planning, and semantic reasoning
- **System 1**: A visuomotor policy module translates those high-level representations into continuous action trajectories at 50Hz or faster

[Figure AI's Helix](https://www.figure.ai/news/helix), introduced in February 2025, exemplifies this architecture for humanoid control. System 2 processes visual input and natural language instructions to understand "what" and "why." System 1 executes the "how"—the precise motor commands needed to achieve the goal. [NVIDIA's GR00T N1](https://www.nvidia.com/en-us/customer-stories/skild-ai/), released in March 2025, adopts the same dual-system structure.

The advantage is clear: System 2 can leverage massive pre-training on internet data (billions of images, trillions of tokens) without needing to be fast enough for real-time control. System 1 can be optimized for speed and precision without needing to understand arbitrary language or reason about novel scenarios. The architecture balances broad generalization with fast, precise execution.

**Early Fusion Models** take a different approach, fusing vision and language representations at the input stage before passing them to the policy module. This architecture retains the representational alignment from models like CLIP, potentially improving grounding of language in visual observations. Examples include EF-VLA presented at ICLR 2025.

**Self-Correcting Frameworks** represent an emerging third pattern, integrating feedback loops that allow the model to detect and correct its own errors. This addresses a critical limitation of current systems: they often fail silently, continuing to execute incorrect actions rather than recognizing failure and requesting human assistance or trying alternative approaches.

Regardless of specific architecture, certain technical requirements have become standard: continuous control output at 50Hz minimum, multimodal input processing, and the ability to ground natural language instructions in physical actions. The challenge remains grounding—translating high-level semantic understanding into precise, physically feasible motor commands. Progress is steady but incremental.

## The Data Challenge: Quality, Quantity, Diversity

Architecture matters, but data determines capability. The fundamental bottleneck in robot foundation models isn't model design—it's training data. And unlike language models, where the internet provides effectively infinite text, robot data must be purpose-collected.

Four data strategies have emerged, each with distinct tradeoffs:

**Simulation** (Skild AI and Tesla's primary approach): Generate unlimited training data in virtual environments. Simulation offers perfect labels, controllable scenarios, and essentially zero marginal cost per data point. The challenge: sim-to-real transfer. Simulated physics, object properties, and sensorimotor dynamics never perfectly match reality. Policies trained purely in simulation often fail on real robots. Tesla's unique advantage is using real-world fleet data to ground its simulator—the neural world simulator learns physical dynamics from billions of miles of actual driving, making its synthetic data more realistic than purely procedural simulation.

**Internet Video** (Google and Skild's approach): Leverage billions of hours of human demonstrations available on YouTube and similar platforms. Humans folding laundry, cooking meals, organizing spaces—this data teaches what tasks look like and how objects behave. The gap: no action labels. The robot can observe what should happen but must infer or separately learn how to make it happen. Pre-training on internet video creates useful representations, but real robot data is still required for action grounding.

**Real-World Robot Teleoperation** (Physical Intelligence, GEN-0 approach): Collect high-quality, labeled robot trajectories by having humans control robots via teleoperation. This produces the highest-quality training data—actual robot actions in real environments with real objects. The limitation: expense. [GEN-0's 270,000 hours of data](https://generalistai.com/blog/nov-04-2025-GEN-0) represents massive investment in collection infrastructure. Scaling to millions of hours would require industrial-scale data operations.

**Cross-Embodiment Pooling** (Google RT-X approach): Pool data from many different robot types and research groups. [The Open X-Embodiment dataset](https://deepmind.google/blog/scaling-up-learning-across-many-different-robot-types/) represents 33 labs and 22 robot types. The insight from RT-X results: diverse data from multiple embodiments generalizes better than larger quantities of data from a single robot. This suggests that data diversity may matter more than pure volume—though both clearly help.

The most promising result from recent research is Physical Intelligence's claim that π0 can be fine-tuned to new tasks with [just 1-20 hours of data](https://www.physicalintelligence.company/blog/pi0). If this holds across truly novel tasks (not just variations on training distribution), it suggests that pre-training does the heavy computational and data-intensive lifting. Deployment customization could then be remarkably cheap—economically viable even for narrow use cases.

The reality check: that 1-20 hour claim likely applies to tasks similar to the 68 tasks π0 was trained on. Radically novel tasks—ones requiring fundamentally different manipulation strategies or object interactions—probably require more data. The question is: how much more?

## The Market Reality: Funding, Valuations, and Deployment

The foundation model for robots sector attracted [$222 million in equity funding across four rounds through July 2025](https://tracxn.com/d/sectors/foundation-model-for-robots/__TkCNTbGzBgOQD-gvXouaw9wsjiwyjX4SRvDRtMq0e9s)—down 40% from the $372 million raised in the same period of 2024. But topline funding numbers obscure the real story: premium valuations and strategic capital.

[AI-native robotics companies command median revenue multiples of 39.0x](https://www.scalevp.com/insights/robotic-foundation-models-are-changing-the-way-we-build-buy-and-fund-robotics/) at Series A and B stages—extraordinary compared to traditional robotics companies. These valuations price in significant future capability, not current revenue. Investors are betting that foundation models will unlock robot capabilities that justify the valuations years from now.

The funding distribution reveals strategic concentration. [Physical Intelligence leads with $470 million in total funding.](https://tracxn.com/d/sectors/foundation-model-for-robots/__TkCNTbGzBgOQD-gvXouaw9wsjiwyjX4SRvDRtMq0e9s) [Skild AI's reported $14 billion valuation](https://techcrunch.com/2025/12/08/softbank-and-nvidia-reportedly-in-talks-to-fund-skildai-at-14b-nearly-tripling-its-value/)—though not yet closed—would make it one of the most valuable private AI companies globally. Sequoia Capital tops the investor list by number of companies backed, but strategic investors SoftBank, Nvidia, and OpenAI are backing multiple players, hedging across different technical approaches.

Geographically, [the United States has attracted $900 million in total funding](https://tracxn.com/d/sectors/foundation-model-for-robots/__TkCNTbGzBgOQD-gvXouaw9wsjiwyjX4SRvDRtMq0e9s) for foundation model companies over the past decade, overwhelmingly dominating this specific segment despite China's aggressive push in robot hardware.

Yet deployment remains limited across the board. Google continues to publish research demonstrations but shows no commercial product. Physical Intelligence open-sourced its model—deployment partners have not been disclosed. Skild showcased capabilities in July 2025; customer deployments remain unannounced. Tesla operates Optimus purely internally. The gap between funding, valuation, and actual deployed robots generating revenue is stark.

This is 2025's equivalent of the GPT-2 era (2019) for large language models. The technology works in demonstrations. The scaling laws suggest dramatic improvement is possible. Significant capital is backing rapid development. But the path to profitable products remains unclear, and the timeline to meaningful revenue is measured in years, not quarters.

Business model uncertainty compounds the deployment gap. Should foundation model companies license to hardware manufacturers (Skild's approach)? Build vertically integrated systems (Tesla)? Create open-source ecosystems (Physical Intelligence)? Or remain research platforms (Google)? Which model captures long-term value is genuinely unclear. Different players are testing different hypotheses.

The bull case: Foundation models will accelerate robot capability development far faster than hardware iteration, and the brain layer will capture most of the value stack. The bear case: robots need better bodies before better brains matter, and commoditization will push value to application-specific integration, not to the foundation model itself.

Current evidence suggests both factors—better bodies and better brains—are gating factors. Neither alone is sufficient. The companies that crack the integration of capable hardware with genuinely general-purpose intelligence will define the next decade of robotics.

## What "General-Purpose" Really Means in 2025

Strip away the marketing and the reality of "general-purpose" robot intelligence in 2025 becomes clearer. When companies claim they've built general-purpose systems, they typically mean: "Works on 20-70 tasks across 3-7 embodiments in controlled environments with structured object sets."

That's not dismissive—it represents genuine progress. But it's a far cry from the science fiction version of general-purpose (arbitrary task execution in arbitrary environments) or even the practical household robot version (can do most tasks a human would do in a typical home).

**What actually works in 2025:**
- Task transfer within domains: A model trained on folding shirts can fold towels, pants, and other fabric items with varying success
- Embodiment transfer with similar morphologies: A model trained on one humanoid can often transfer to another humanoid with similar joint structure
- Fine-tuning to new tasks with modest data: 1-20 hours of demonstrations for tasks similar to training distribution
- Natural language task specification: For task categories the model has seen, users can specify goals in plain language

**What doesn't work yet (or works poorly):**
- True zero-shot novel task execution: Tasks requiring entirely new manipulation strategies or object interactions typically fail
- Unstructured home environments: Arbitrary furniture, unknown objects, variable lighting, and unpredictable human interventions remain significantly harder than structured warehouses
- Long-horizon multi-step planning: Breaking down complex goals into sequences of atomic actions, with error recovery when steps fail
- Safety guarantees in human-shared spaces: Ensuring robots won't injure humans or damage property even when faced with scenarios outside training distribution

The "foundation" in foundation model makes a specific claim: that pre-training on diverse data creates representations that transfer broadly, dramatically reducing the data and compute required to adapt to new tasks. This worked spectacularly for language models (GPT-3 could do tasks it was never explicitly trained for) and for vision models (CLIP could classify images of objects it had never seen).

The bet is that transfer learning works similarly in robotics. The risk is that embodied AI—where physical contact has irreversible consequences—may require fundamentally different approaches than perception or language tasks. A language model can hallucinate and just generate wrong text. A robot that hallucinates and swings a heavy arm unpredictably can injure people.

Realistic timelines based on current progress:
- **2025**: Proof of concept—limited task sets in controlled environments, heavy supervision
- **2027-2028**: Expanded task repertoires (hundreds of tasks), early commercial deployments in structured settings, reduced supervision requirements
- **2030+**: Genuinely general-purpose home robots capable of most household tasks with minimal human intervention

Key dependencies for these timelines: continued scaling of training data (which requires solving collection economics), improved sim-to-real transfer, safety validation methodologies that satisfy regulators and consumers, and cost reductions that make deployment economically viable.

## Conclusion: Building the Brain, One Layer at a Time

What 2025 demonstrated: Foundation models for robotics have transitioned from research curiosities to serious commercial pursuits. Multiple viable technical approaches are being actively developed. Billions in strategic capital back these efforts. Physical Intelligence's decision to open-source π0 signals growing confidence that community development will accelerate progress faster than proprietary secrecy.

What 2025 didn't demonstrate: Deployed general-purpose robots at meaningful scale. Clear paths to profitability for foundation model companies. Solved sim-to-real transfer that eliminates the need for expensive real-world data collection. Safety validation protocols that enable widespread deployment in human-shared environments.

The brain layer architecture is taking shape. VLA models—particularly dual-system architectures that separate high-level reasoning from low-level control—have become the standard paradigm. Pre-training on diverse data sources (simulation, internet video, cross-embodiment robot data) combined with fine-tuning on targeted real-world data appears to be the consensus approach. Different companies weight these data sources differently, but the basic recipe has stabilized.

For investors and executives, the key insight is recognizing where we are in the development curve. This is the research-to-product transition. Foundation models will very likely enable significant robot capabilities—but on a 3-5 year timeline, not 12-24 months. Multiple technical approaches may succeed, supporting different business models: licensing platforms, vertical integration, and open-source ecosystems each have viable paths. Current valuations price in substantial future capability—the central risk is delivery timeline, not ultimate feasibility.

The race to build the robot brain is less about who builds the first "general-purpose" model and more about who builds the first model that's general *enough* to justify the economics of robot deployment. The threshold isn't arbitrary task execution—it's economic viability. Can the robot do enough tasks, across enough environments, with little enough supervision, to deliver positive ROI?

Skild AI bets on omni-bodied licensing. Physical Intelligence bets on open-source ecosystem development. Google bets on research infrastructure advancing the field broadly. Tesla bets on vertical integration and internal deployment. Generalist AI bets on real-world data quality over simulation quantity.

They're all building toward the same threshold from different directions, with different timelines, and with different assumptions about what "enough" means. 2025 was the year the race became credible. 2026-2027 will reveal who crosses the finish line first—and whether the finish line is where they thought it was.

---

## Sources

- [Skild AI - Building the general-purpose robotic brain](https://www.skild.ai/blogs/building-the-general-purpose-robotic-brain)
- [Skild AI - Announcing $300M Series A Funding](https://www.skild.ai/blogs/announcing-our-300m-series-a)
- [TechCrunch - SoftBank and Nvidia reportedly in talks to fund Skild AI at $14B](https://techcrunch.com/2025/12/08/softbank-and-nvidia-reportedly-in-talks-to-fund-skildai-at-14b-nearly-tripling-its-value/)
- [Business Wire - Skild AI Provides First Look at Its General-Purpose Robotic Brain](https://www.businesswire.com/news/home/20250729431330/en/Skild-AI-Provides-First-Look-at-Its-General-Purpose-Robotic-Brain)
- [HPE - Skild AI accelerates development with AI solutions from HPE](https://www.hpe.com/us/en/newsroom/press-release/2025/03/skild-ai-accelerates-development-of-human-like-robot-brain-with-ai-solutions-from-hewlett-packard-enterprise.html)
- [The Robot Report - Physical Intelligence open-sources Pi0 robotics foundation model](https://www.therobotreport.com/physical-intelligence-open-sources-pi0-robotics-foundation-model/)
- [Physical Intelligence - Our First Generalist Policy (π0)](https://www.physicalintelligence.company/blog/pi0)
- [Physical Intelligence - Open Sourcing π0](https://www.physicalintelligence.company/blog/openpi)
- [Google DeepMind - RT-2: New model translates vision and language into action](https://deepmind.google/blog/rt-2-new-model-translates-vision-and-language-into-action/)
- [Google DeepMind - Scaling up learning across many different robot types](https://deepmind.google/blog/scaling-up-learning-across-many-different-robot-types/)
- [Google DeepMind - Gemini Robotics brings AI into the physical world](https://deepmind.google/blog/gemini-robotics-brings-ai-into-the-physical-world/)
- [arXiv - Gemini Robotics: Bringing AI into the Physical World](https://arxiv.org/abs/2503.20020)
- [Generalist AI - GEN-0 / Embodied Foundation Models](https://generalistai.com/blog/nov-04-2025-GEN-0)
- [Not a Tesla App - How Tesla's Optimus Learns: Digital Dreams and AI Simulation](https://www.notateslaapp.com/news/2998/an-in-depth-look-at-how-teslas-optimus-learns-digital-dreams-and-ai-simulation)
- [WebProNews - Tesla Shifts Optimus Robot Training to Vision-Only AI Approach](https://www.webpronews.com/tesla-shifts-optimus-robot-training-to-vision-only-ai-approach/)
- [Vision-Language-Action Models for Robotics Survey](https://vla-survey.github.io/)
- [Figure AI - Helix: A Vision-Language-Action Model for Generalist Humanoid Control](https://www.figure.ai/news/helix)
- [NVIDIA - Skild AI Builds Omni-Bodied Robot Brain With NVIDIA](https://www.nvidia.com/en-us/customer-stories/skild-ai/)
- [arXiv - Toward General-Purpose Robots via Foundation Models](https://arxiv.org/html/2312.08782v3)
- [Sage Journals - Foundation models in robotics: Applications, challenges, and the future](https://journals.sagepub.com/doi/10.1177/02783649241281508)
- [Tracxn - Foundation Model for Robots - 2025 Market & Investment Trends](https://tracxn.com/d/sectors/foundation-model-for-robots/__TkCNTbGzBgOQD-gvXouaw9wsjiwyjX4SRvDRtMq0e9s)
- [Scale Venture Partners - Robotic Foundation Models are changing the way we build, buy, and fund robotics](https://www.scalevp.com/insights/robotic-foundation-models-are-changing-the-way-we-build-buy-and-fund-robotics/)
