# Edge of (Stochastic) Stability made simple — Part II: the mini-batch case
Date: Feb 23, 2026  
By Pierfrancesco Beneventano

← **[Part I: full-batch EOS](/blogsupdates/edge-of-stochastic-stability-part-i)** · **[Part III: practical implications](/blogsupdates/edge-of-stochastic-stability-part-iii)**

Based on **[Edge of Stochastic Stability: Revisiting the Edge of Stability for SGD (Andreyev & Beneventano, arXiv:2412.20553)](https://arxiv.org/abs/2412.20553)**; correspondence to [Pierfrancesco Beneventano](https://pierbeneventano.github.io/), [pierb@mit.edu](mailto:pierb@mit.edu).

---

<aside>
<strong><em>What this post is about:</em></strong>

<em>In <a href="/blogsupdates/edge-of-stochastic-stability-part-i">Part I</a>, “Edge of Stability” (EOS) for full-batch GD had a clean signature: sharpness rises and hovers near a stability threshold, and the loss becomes oscillatory.</em>

<em>In mini-batch training, that signature breaks twice:</em>
<ul>
  <li><em>SGD oscillates almost all the time — even when it is perfectly stable.</em></li>
  <li><em>the full-batch Hessian’s top eigenvalue usually does <strong>not</strong> sit at the relevant threshold.</em></li>
</ul>

<em>This post rebuilds the “edge” from scratch for SGD: we’ll (i) separate <strong>stable</strong> oscillations from <strong>edge-like</strong> ones, (ii) define a falsifiable <strong>checkpoint-level edge test</strong>, and (iii) introduce the curvature statistic that actually locks to <span style="white-space:nowrap;">2/η</span> in mini-batch training.</em>
</aside>

---

***Acknowledgements / lineage.***  
Part I leaned heavily on the full-batch EOS story developed by Jeremy Cohen, Alex Damian, and collaborators (and their excellent Central Flows writeups). Part II is where we pivot to the mini-batch world, following our paper with Arseniy Andreyev.

***Conceptual map (where this is going):***

- **[Part I](/blogsupdates/edge-of-stochastic-stability-part-i):** full-batch EOS: why “wrong step sizes” can still train, and the two mechanisms (local instability + progressive sharpening).
- **Part II (this post):** SGD: why the Part I diagnostic fails, what “edge” should mean for stochastic dynamics, and **Edge of Stochastic Stability (EoSS)**.
- **[Part III](/blogsupdates/edge-of-stochastic-stability-part-iii):** why any of this matters: batch-size effects, hyperparameters, flatness, and why common “SGD ≈ GD + noise” models can miss the point.

---

# Part II: the mini-batch case

In Part I we had **one landscape** and a deterministic update.  
Now we have **a distribution of mini-batch landscapes** and a stochastic update.

So the core question becomes:

> **What does it even mean to be “at the edge” when the landscape moves under your feet?**

---

## 0) The puzzle (why the Part I diagnostic fails)

In full-batch GD, a crisp story holds:
- the loss starts oscillating when you cross a curvature stability boundary;
- sharpness rises, then self-regulates near a threshold like \(2/\eta\).

In SGD, two empirical facts collide with that story:

- **Oscillations are cheap:** SGD loss wiggles even on convex quadratics with stable step sizes.
- **\(\lambda_{\max}(\nabla^2 L)\) is the wrong gauge:** the full-batch top eigenvalue often sits *below* \(2/\eta\) and depends strongly on batch size \(b\), even though training still has edge-like “events”.

So: if oscillations are always present, and \(\lambda_{\max}\) is not the saturating quantity…  
**what is the actual edge?**

---

<details>
<summary><strong>Notation (click to expand)</strong></summary>

- Dataset: \(\{z_i\}_{i=1}^N\)
- Full loss: \(L(\theta)=\frac1N\sum_{i=1}^N \ell(\theta;z_i)\)
- Mini-batch \(B\subset\{1,\dots,N\}\), \(|B|=b\)
- Mini-batch loss: \(L_B(\theta)=\frac1b\sum_{i\in B} \ell(\theta;z_i)\)
- SGD: \(\theta_{t+1}=\theta_t-\eta\,\nabla L_{B_t}(\theta_t)\)
</details>

---

## 1) One step, two kinds of “noise”: gradient noise vs curvature noise

A common mental model is: “SGD = GD + gradient noise”.

That captures *one* randomness source (the gradient estimator), but misses another:

- each step also sees a different **mini-batch Hessian** \(\nabla^2 L_{B_t}(\theta_t)\).

So the geometry is genuinely stochastic: both **directions** and **curvatures** fluctuate.

<aside>
💡 <strong>Key shift:</strong> in SGD, stability is controlled by the <em>mini-batch geometry along the direction you actually step</em>, not by the full-batch λ<sub>max</sub> alone.
</aside>

---

## 2) Oscillations are not diagnostic — because there are two kinds

Here is the clean conceptual separation that makes the rest of the story click:

## Type-1 oscillations (stable wobbling)
These are oscillations that exist **even when the dynamics is stable**.
They are driven by gradient noise with a non-vanishing step size.
They can look dramatic in the loss, but they do *not* imply edge-like instability.

## Type-2 oscillations (edge-like, curvature-driven)
These are oscillations associated with **saturating a genuine instability boundary** on a local quadratic model.
They are the stochastic analogue of EOS behavior: if you push \(\eta\) up (or \(b\) down) a little, you can trigger a runaway "catapult".

<aside>
💡 <strong>Practical warning:</strong> Type-1 and Type-2 oscillations can look similar in the loss.  
So “loss wiggles” alone can’t tell you if you’re at an edge.
</aside>

---

## 3) A falsifiable definition of “the edge” for stochastic dynamics

If we want an EOS-like concept for SGD, we should demand:

1) a criterion that actually implies instability (on the local quadratic approximation), and  
2) a quantity that empirically *saturates* during training.

This leads to a simple philosophy:

> **Edge = saturation of a valid instability criterion** (for the dynamics you run).

And the key operational tool is:

### The checkpoint-level edge test (restart + tiny destabilization)

1. Train normally to a checkpoint \(\theta_t\) with hyperparameters \((\eta,b)\).
2. Restart from \(\theta_t\) with a *slightly more aggressive* setting, e.g.
   - \(\eta \uparrow\) (increase learning rate), or
   - \(b \downarrow\) (decrease batch size).
3. Compare the continuation curves.

If you truly were saturating a tight instability boundary, the perturbed run should exhibit a **catapult**: a sudden excursion + loss spike that the baseline does not.

<pre><code># Edge test (checkpoint-level)

train with (η, b) → checkpoint θ_t

baseline: continue from θ_t with (η, b)
perturb:  continue from θ_t with (η', b') where η' > η or b' < b (small change)

if baseline is stable but perturb catapults:
    evidence: θ_t was near a tight instability boundary for SGD
else:
    whatever you measured is probably not a valid instability criterion
</code></pre>

<aside>
💡 <strong>Why this matters:</strong> it turns “training at the edge” into something falsifiable:
a saturating quantity must predict sensitivity to small destabilizing hyperparameter nudges.
</aside>

---

## 4) The tempting trap: a quantity that certifies oscillations (but not instability)

You can derive (via a second-order expansion of the full loss along an SGD step) a scalar that often sits near \(2/\eta\) and correlates with oscillatory behavior.

That scalar is sometimes called **Gradient–Noise Interaction (GNI)**, and it is genuinely useful — but for a different purpose:

- **GNI ≈ \(2/\eta\)** is a certificate that the loss is oscillatory (Type-1 oscillations can already do this).
- It is **not** a certificate that you are near a curvature instability boundary.

<aside>
💡 <strong>Main point:</strong> A "2/η saturation" is not automatically an "edge" signal.
You must ask: does it pass the edge test?
</aside>

### What goes wrong if you use GNI as the “edge”
- GNI can hit \(2/\eta\) quickly, *without* any progressive sharpening.
- If you increase \(\eta\) slightly while still in a stable Type-1 regime, you may just get a bigger wobble — no catapult.

So: **GNI is an oscillation meter, not an instability boundary.**

---

## 5) The quantity SGD actually “feels”: directional curvature of the mini-batch step

SGD steps along \(g_B(\theta):=\nabla L_B(\theta)\).  
So the curvature that matters on that step is the **Rayleigh quotient** of the mini-batch Hessian along that mini-batch gradient:

\[
\mathrm{StepSharpness}_B(\theta)
:=\frac{g_B(\theta)^\top \nabla^2 L_B(\theta)\, g_B(\theta)}{\|g_B(\theta)\|^2}.
\]

Now average over batch sampling:

\[
\textbf{BatchSharpness}(\theta)
:=\mathbb{E}_{B}\!\left[
\frac{\nabla L_B(\theta)^\top \nabla^2 L_B(\theta)\nabla L_B(\theta)}
{\|\nabla L_B(\theta)\|^2}
\right].
\]

<aside>
💡 <strong>Interpretation:</strong> Batch Sharpness is the <em>expected curvature you see</em> along the <em>direction you actually step</em>, on the <em>mini-batch landscape you actually trained on</em>.
</aside>

---

## 6) Edge of Stochastic Stability (EoSS): what actually saturates at \(2/\eta\)

Here is the empirical headline:

<aside>
<strong>Edge of Stochastic Stability (EoSS):</strong><br/>
<strong>Batch Sharpness progressively increases (progressive sharpening) and then hovers near 2/η.</strong>
</aside>

And this resolves the earlier puzzle:

- The full-batch \(\lambda_{\max}(\nabla^2 L(\theta))\) typically plateaus **below** \(2/\eta\), and the plateau depends on batch size.
- Yet **Batch Sharpness** is the quantity that locks to \(2/\eta\) across batch sizes.

### A sharper (and subtle) consequence: what happens to \(\lambda_{\max}\) once EoSS is reached
Empirically, a phase transition occurs:
- **\(\lambda_{\max}\) increases only as long as Batch Sharpness increases.**
- Once Batch Sharpness plateaus at \(2/\eta\), **\(\lambda_{\max}\) stops increasing** (and if it moves, it tends to decrease).
- If you change hyperparameters mid-training, the “location” (hence \(\lambda_{\max}\)) can be path-dependent — Batch Sharpness reacts immediately and then re-saturates.

<aside>
💡 <strong>Takeaway:</strong> in mini-batch training, the stable region is governed by the mini-batch geometry.
The full-batch λ<sub>max</sub> is a downstream consequence, not the control knob.
</aside>

---

<details>
<summary><strong>Cheat-sheet: four “sharpness-like” quantities (click to expand)</strong></summary>

- **Full-batch sharpness:** \(\lambda_{\max}(\nabla^2 L)\)
- **IAS (Interaction-Aware Sharpness):** directional curvature of the full-batch Hessian along mini-batch gradient directions
- **GNI:** a directional “oscillation certifier” from a second-order loss expansion (tracks Type-1 oscillations)
- **Batch Sharpness:** directional curvature of mini-batch Hessians along their own gradients (the EoSS object)

EoSS is specifically the statement about **Batch Sharpness**.
</details>

---

## 7) Catapults: why stochasticity makes the edge feel “spiky”

In full-batch EOS, the stabilizing mechanism is deterministic.

In EoSS, what stabilizes is an **expectation**. So per-step randomness matters:

- most steps hover near-threshold;
- occasionally, you sample a “streak” of unusually sharp mini-batches;
- those steps overshoot, triggering a **catapult**: a large excursion + a loss spike.

Then, often:
- the trajectory re-enters a region where Batch Sharpness is below \(2/\eta\),
- progressive sharpening resumes,
- and the process returns to the hovering regime.

<aside>
💡 <strong>Mental picture:</strong> EoSS is a hovering regime with intermittent “lightning strikes”.
</aside>

---

## 8) A short theory interlude: why \(2/\eta\) shows up again (but differently)

In Part I, \(2/\eta\) came from stability of \(I-\eta H\) on a quadratic.

In SGD, \(2/\eta\) reappears because the same second-order algebra applies **along the mini-batch step direction**.
The local instability certificate becomes directional and batch-dependent.

One blog-friendly way to remember it:

<aside>
💡 <strong>One-line theorem statement (informal):</strong><br/>
On the local quadratic model, if Batch Sharpness crosses (2+ε)/η, then the SGD dynamics admits a one-sided instability certificate: mini-batch gradient norms begin to grow (in a multiplicative drift sense), leading to a catapult / loss spike.
</aside>

(We keep the proof details in the paper; the important point here is: this is an <em>instability criterion</em>, not just an oscillation meter.)

---

## 9) What this changes conceptually (previewing Part III)

EoSS is not just “one more sharpness metric”. It forces a conceptual reframe:

- **It’s not about minima:** stabilization can happen in regions with no stationary points.
- **Location becomes distributional:** what matters is the distribution of mini-batch Hessians, not only the mean/full-batch Hessian.
- **“Flatness” becomes stability-grounded:** curvature proxies only matter insofar as they relate to Batch Sharpness along the trajectory.

And it also clarifies why some common proxies for SGD can fail:

- If the governing object is batch-dependent curvature, then “GD + generic noise” (or standard SDE models) can be a different dynamical system unless they preserve the relevant mini-batch geometry.

Part III is where we make this fully practical: hyperparameter tuning, diagnostics, and what modeling assumptions break.

→ **Next:** [Part III: Getting practical](/blogsupdates/edge-of-stochastic-stability-part-iii)

---

## 10) Summary (the things to remember)

<aside>
<strong><em>If you only remember four bullets from Part II:</em></strong>

<ul>
  <li><strong>Oscillations are not diagnostic in SGD.</strong> There are stable (Type-1) oscillations and edge-like (Type-2) oscillations.</li>
  <li><strong>“Edge” should be defined by a falsifiable instability boundary.</strong> Use the checkpoint restart + small destabilization edge test.</li>
  <li><strong>GNI certifies oscillations, not instability.</strong> It can saturate near <span style="white-space:nowrap;">2/η</span> even in stable regimes.</li>
  <li><strong>EoSS:</strong> Batch Sharpness sharpens and then hovers near <span style="white-space:nowrap;">2/η</span>, while full-batch λ<sub>max</sub> is suppressed and batch-size-dependent.</li>
</ul>
</aside>

---

# Appendix: measuring Batch Sharpness in practice (optional)

**Goal:** estimate
\[
\mathbb{E}_{B}\left[
\frac{g_B^\top H_B g_B}{\|g_B\|^2}
\right]
\quad\text{where}\quad
g_B=\nabla L_B(\theta),\ \ H_B=\nabla^2 L_B(\theta).
\]

Practical Monte Carlo estimator (no explicit Hessian needed):

<pre><code># Batch Sharpness estimator at θ
input: θ, sampler for batches B ~ P_b, num_samples M

vals = []
for m in 1..M:
    B  = sample_batch()
    g  = grad(L_B(θ))
    Hg = hvp(L_B, θ, v=g)          # Hessian-vector product
    vals.append( dot(g, Hg) / dot(g, g) )

return mean(vals)
</code></pre>

**Tip:** if you want a quick-and-dirty “edge test” for your own run:
- log Batch Sharpness over training,
- checkpoint near saturation,
- restart with a small \(\eta\uparrow\) or \(b\downarrow\),
- check if the perturbed continuation catapults.

---

# References / further reading

- **Cohen et al. (2021):** Gradient Descent on Neural Networks Typically Occurs at the Edge of Stability — <a href="https://arxiv.org/abs/2103.00065">https://arxiv.org/abs/2103.00065</a>
- **Andreyev & Beneventano (2025):** Edge of Stochastic Stability — <a href="https://arxiv.org/abs/2412.20553">https://arxiv.org/abs/2412.20553</a>