export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    content: string; // Markdown content
    category: "Blog" | "Interesting Bit" | "Research" | "Publication" | "News" | "Press";
    link?: string; // For interesting bits or external links
}

import { latexBlogs } from "./latexBlogs";

const manualBlogs: BlogPost[] = [
    // Interesting Bits
    {
        slug: "deepmind-ceo-former-mentor",
        title: "DeepMind CEO’s Former Mentor: AI is Intelligent, Not Conscious",
        excerpt: "I spoke with Tomaso Poggio about future of AGI, AI’s impact on human society, the signs of sentience in AI, and AI predictions…",
        date: "Jan 23, 2026",
        author: "External",
        category: "Interesting Bit",
        link: "https://www.youtube.com/watch?v=xQhxr5FdfEE",
        content: ""
    },
    {
        slug: "thirty-lectures-foundations-deep-learning",
        title: "Thirty Lectures on the Foundations of Deep Learning",
        excerpt: "(PDF) by Tomaso Poggio, Gemini+ChatGPT. Intelligence and its Fundamental Principles.",
        date: "Jan 20, 2026",
        author: "Tomaso Poggio, Gemini, ChatGPT",
        category: "Interesting Bit",
        link: "/assets/FoundationsDeepLearning.pdf",
        content: ""
    },
    {
        slug: "bi-229-principles-intelligence-learning",
        title: "BI 229 Tomaso Poggio: Principles of Intelligence and Learning",
        excerpt: "Tomaso Poggio on his eternal quest to discover the theoretical principles explaining intelligence and learning in brains, minds, and machines.",
        date: "Jan 14, 2026",
        author: "Tomaso Poggio",
        category: "Interesting Bit",
        link: "https://www.youtube.com/watch?v=E7h3zktojXs",
        content: ""
    },

    // Blog Posts
    {
        slug: "most-real-numbers-do-not-exist-and-why-that-matters-for-intelligence",
        title: "Most Real Numbers Do Not Exist (And Why That Matters for Intelligence)",
        date: "Jan 26, 2026",
        author: "Tomaso Poggio",
        category: "Blog",
        excerpt: "The most useful mathematical objects are the ones that aren’t real at all. We think of numbers as the foundation of science. But when we examine real numbers through the lenses of logic, computation, and physics, a striking conclusion emerges...",
        content: `
The most useful mathematical objects are the ones that aren’t real at all.

We think of numbers as the foundation of science. We measure positions, voltages, masses, probabilities, and temperatures using quantities that—at least in theory—take values in the continuum of real numbers. This continuous line underpins classical mathematics and physics.

But when we examine real numbers through the lenses of logic, computation, and physics, a striking conclusion emerges:
**Real numbers — uncountable, infinitely precise objects — do not exist in nature. They are mathematical idealizations.**

This insight is central to understanding intelligence and computation.

## 1. Logic: The Continuum Is Not a Logical Necessity

The continuum hypothesis, a fundamental question about the size of the real line, was shown by Gödel and Cohen to be undecidable from the standard axioms of mathematics. This means that the existence of a continuous infinity of real numbers is not a logical consequence of our usual foundations. It is a choice.

## 2. Computation: Almost All Real Numbers Are Uncomputable

A real number requires infinitely many bits to store exactly. But finite machines—including brains, computers, and physical systems—cannot store or generate infinite precision.

In fact:
- almost all real numbers have no finite description,
- they cannot be approximated algorithmically,
- and no Turing machine can compute them.

They lie beyond the reach of any physical or computational process.

## 3. Physics: We Never Measure Anything with Infinite Precision

The universe has finite energy, finite time, and finite resolution. No physical measuring device can produce infinitely many bits or distinguish infinitely close values.
What physicists call “continuous quantities” are idealized models, not physical objects. Nature gives us finite, discrete data.

### Why information is finite despite the infinity of rational numbers.

A common confusion arises here: if there are infinitely many rational numbers, how can information in the physical world be finite? The resolution is simple. Although rational numbers form an infinite set, a finite physical system cannot represent arbitrarily large integers or arbitrarily fine ratios. Representing a rational $p/q$ requires storing the integers $p$ and $q$, but a system with finite energy, finite volume, and finite entropy can only store a finite number of bits. Thus only finitely many rationals are physically representable, even in principle. Moreover, every real measurement has finite resolution, so the set of distinguishable values in any experiment is always a finite discrete lattice. In this precise sense, information in physics is finite even though mathematics allows infinite numerical sets.

### Maps, Not Territory

Real numbers are like maps: extraordinarily useful but ultimately simplified representations of a more complex, finite world.
They let us reason elegantly, but they are not themselves part of physical reality.

### Why This Matters for Intelligence

If the physical world does not contain real numbers, then:
- information is finite,
- computation is finite,
- and learnable functions must be finite and structured.

This ties directly into the two pillars of this blog series:

#### Sparse Compositionality
Finite computation produces hierarchical, bounded-fanin processes. There is no capacity for dense, unstructured, infinite-precision functions.

#### Genericity
Finite physical systems are noisy and stable. Thus real-world functions have detectable low-degree components, making learning feasible.
The nonexistence of real numbers is not a limitation—it is what makes intelligence and learning possible.

### A Glimpse Ahead
Some physical systems, especially chaotic dynamical systems, may not be efficiently computable even in principle. We will explore this subtle topic in a future post on chaos, prediction, and simulation.

For now, the key point is this:
**Intelligence is possible because the universe is finite. Continuous mathematics is the useful fiction that helps us understand it.**

### Technical Note: Algebraic and Transcendental Real Numbers

This appendix provides a brief mathematical background on two central classes of real numbers: algebraic and transcendental numbers. Understanding their structure clarifies why almost all real numbers are mathematically legitimate but physically meaningless.

### Algebraic Real Numbers
A real number is called algebraic if it is a root of a polynomial with integer coefficients.
Examples include:
- all rational numbers,
- $\\sqrt{2}$ (in the complex case),
- roots of any finite-degree polynomial equation.

Key facts:
1. The set of algebraic numbers is countable.
2. Every algebraic number has a finite description: it is fully determined by a finite polynomial and its degree.
3. All algebraic numbers are computable: a Turing machine can approximate them to arbitrary precision since root-finding is a constructive process.

Thus algebraic numbers form the “computational core” of the real line: they are the numbers that can sensibly arise in algorithms, physical models, and finite systems.

### Transcendental Numbers
A real number is transcendental if it is not algebraic—that is, it is not the root of any integer-coefficient polynomial. Famous examples include $\\pi$ and $e$.

The structure of the transcendental numbers is radically different:
1. The set of transcendental numbers has the same cardinality as the continuum. In fact: $|\\mathbb{R}| = |\\mathbb{C}|$ and since algebraic numbers are countable, almost all real numbers (measure 1) are transcendental.
2. Almost all transcendental numbers are uncomputable. They have no finite description, no generating algorithm, and no Turing machine that can list their digits.
3. A typical transcendental number cannot even be approximated in principle: its first million digits might encode an incompressible random string that no physical system could store.

This is the source of a paradoxical conclusion:
**Almost every real number is a perfectly valid mathematical object that cannot, even in principle, appear in physical reality.**

### Consequences for Physics and Intelligence
Because algebraic numbers are computable and finitely specifiable, they (and a small subset of computable transcendental numbers such as $\\pi$ and $e$) are the only real numbers that can arise in:
- finite physical measurements,
- digital computation,
- neural or biological systems,
- any finite-energy physical process.

Transcendental numbers of measure 1 on the real line require infinite precision, infinite entropy, and infinite memory—none of which exist in physics.

Thus:
**From the standpoint of computation and physics, the “real line” is a useful fiction. The physically meaningful numbers form a tiny, structured, computable subset.**
`
    },
    {
        slug: "the-second-pillar-genericity",
        title: "The Second Pillar: Genericity",
        date: "Jan 20, 2026",
        author: "Tomaso Poggio & Pierfrancesco Beneventano",
        category: "Blog",
        excerpt: "Why learning works at all—and why not all functions are learnable. In our last post, we explored the first pillar of intelligence: Sparse Compositionality.",
        content: `
Why learning works at all—and why not all functions are learnable.
By Tomaso Poggio & Pierfrancesco Beneventano

In our last post, we explored the first pillar of intelligence: **Sparse Compositionality**.

### 1. Functions Have a Natural Spectral Expansion

A central idea underlying the principle of Genericity is that the functions we want to learn can be decomposed into orthogonal degrees. When the input distribution is Gaussian (or close to Gaussian after whitening), the natural basis is the system of multivariate Hermite polynomials $H_k(x)$.

Every square-integrable function $f(x)$ has an expansion:
$f(x) = \\sum_{k=0}^{\\infty} c_k H_k(x)$

The Hermite degree of $H_k$ is $k$. Low-degree terms (small $k$) capture smooth, slowly varying structure; high-degree terms contain oscillatory, fragile, or highly nonlinear components.

### 2. Low-Degree Terms Produce Learnable Gradients

Genericity asserts that real-world functions possess nontrivial low-degree components. The most important is the degree-1 (linear) part.
This linear component creates a reliable global trend in the loss landscape.

If all $c_k = 0$ for $k < d$ (no linear term), gradients are much weaker and learning slows dramatically. If all coefficients of degrees 1 through $d$ vanish, no gradient-based method can recover that structure without exponentially many samples.

### 3. The Information Exponent

The information exponent, introduced in the book, formalizes this idea: it is the smallest Hermite degree for which the coefficient vector does not vanish.

Interpretation:
- $k=1$ (generic): strong linear signal; optimization is effective.
- $k=2$: quadratic structure exists but linear terms vanish.
- $k \\gg 1$ (non-generic): function behaves like parity; gradients carry almost no globally useful information.

Generic functions have small $k$. This ensures that the optimization landscape contains a global “tilt”—a weak but reliable slope guiding gradient descent.

### 4. Why Parity-Like Functions Are Pathological

Consider the parity function on $\\{\\pm 1\\}^n$ or its Gaussian analog.
Its Hermite expansion consists solely of the monomial of degree $d$. Thus:
- all $c_k = 0$ for $k < d$,
- the information exponent is $d$,
- gradients vanish in expectation,
- optimization receives no informative signal.

This illustrates the essence of non-genericity: the function is structurally “orthogonal” to all low-degree components. Learning parity requires sample complexity exponential in $d$.

### 5. Noise, Evolution, and Data Generically Reduce

In real-world systems, high-degree Hermite components are extremely fragile:
- Noise attenuates high-degree terms exponentially fast.
- Evolution eliminates computations that rely on vanishing signal.
- Physical systems enforce smoothness, suppressing high frequencies.
- Neural network training exhibits a spectral bias: low-degree coefficients are learned first.

All these mechanisms push real-world functions into the low-degree regime—precisely the generic regime where optimization works.

### 6. Why Genericity Makes Learning Possible

Combining these observations:
- Low-degree Hermite components generate large, stable gradients.
- Generic functions possess such components.
- Non-generic functions do not; they provide no learnable signal.

Thus:
**Genericity is the mathematical condition that guarantees learnability: functions possess low-degree structure strong enough to guide optimization.**

This complements the first pillar, Sparse Compositionality, which constrains the structure of the function. Genericity constrains its spectrum and ensures that optimization, whether in brains or machines, can actually find that structure.
`
    },
    {
        slug: "the-first-principle-solving-problems-with-lego",
        title: "The First Principle: Nature Builds with LEGO Bricks",
        date: "Jan 12, 2026",
        author: "Tomaso Poggio & Daniel Mitropolsky",
        category: "Blog",
        excerpt: "Why can we understand a complex world? Because it is not a random mess — it is a hierarchy of reusable parts.",
        content: "Content temporarily unavailable."
    },
    {
        slug: "the-missing-foundations-of-intelligence",
        title: "The Missing Foundations of Intelligence",
        date: "Jan 5, 2026",
        author: "Tomaso Poggio & John Gabrieli Buchet",
        category: "Blog",
        excerpt: "Modern AI works, but we don’t know why. Here is a proposal for the fundamental principles that explain it.",
        content: "Content temporarily unavailable."
    },
    {
        slug: "brains-minds-and-machines-book-epilogue",
        title: "Brains, Minds, and Machines [book epilogue]",
        date: "Nov 20, 2025",
        author: "Tomaso Poggio",
        category: "Blog",
        excerpt: "The book Brains, Minds and Machines—originally published in Italian, going to appear in English published by MIT Press—has two authors: Marco Magrini and Tomaso Poggio.",
        content: "Content temporarily unavailable."
    }
];

// Merge manual blogs with LaTeX blogs
export const blogs: BlogPost[] = [...latexBlogs, ...manualBlogs];

