// High-precision semantic knowledge engine for domain-aware concept exploration & fallback

export interface GeneratedNodeResult {
  title: string;
  summary: string;
  text: string;
  prompts: string[];
  keyTakeaways: string[];
  diagramData: string;
  fallbackMode?: boolean;
}

interface CuratedConcept {
  title: string;
  summary: string;
  definition: string;
  mechanics: string;
  advanced: string;
  subConcepts: [string, string, string, string];
  prompts: [string, string, string, string];
  keyTakeaways: [string, string, string];
  diagramData: string;
}

// Extensive verified domain encyclopedia for canonical topics
const CURATED_KNOWLEDGE: Record<string, CuratedConcept> = {
  "data science": {
    title: "Data Science",
    summary: "Data Science is the interdisciplinary field that extracts actionable insights, statistical patterns, and predictive models from structured and unstructured datasets.",
    definition: "**Data Science** is the discipline combining statistical analysis, computer science, and domain expertise to solve analytical problems. Its primary objective is transforming raw, high-dimensional data into quantitative insights and automated predictive intelligence.",
    mechanics: `- **Data Ingestion & Cleaning**: Pipelines aggregate multi-source records, handling missing values, anomalies, and schema normalization via [Data Preprocessing](Data Preprocessing).
- **Exploratory Data Analysis (EDA)**: Practitioners compute summary statistics, test distributional hypotheses, and identify correlations using [Exploratory Data Analysis](Exploratory Data Analysis).
- **Feature Engineering & Modeling**: Raw variables are transformed into meaningful mathematical features before training algorithms like [Regression Analysis](Regression Analysis) and [Machine Learning](Machine Learning).`,
    advanced: `Production workflows require strict management of the [Bias-Variance Tradeoff](Bias-Variance Tradeoff), prevention of data leakage, and rigorous validation through techniques like [Cross-Validation](Cross-Validation) to ensure real-world generalization.`,
    subConcepts: ["Exploratory Data Analysis", "Feature Engineering", "Machine Learning", "Bias-Variance Tradeoff"],
    prompts: [
      "How do data scientists prevent subtle data leakage during cross-validation and feature scaling?",
      "What are the fundamental mathematical differences between generative and discriminative models?",
      "How are streaming ETL and real-time inference pipelines architected in enterprise production?",
      "How is exploratory data analysis conceptually analogous to cartographic surveying?"
    ],
    keyTakeaways: [
      "Bridges statistics, computational algorithms, and domain knowledge to extract predictive patterns.",
      "Follows an iterative lifecycle: ingestion, cleaning, feature engineering, modeling, and validation.",
      "Generalization in production hinges on mitigating bias, variance, and data drift."
    ],
    diagramData: `graph TD;
  A[Raw Structured & Unstructured Data] --> B[Data Cleaning & ETL]
  B --> C[Exploratory Data Analysis]
  C --> D[Feature Engineering]
  D --> E[Model Training & Cross-Validation]
  E --> F[Actionable Intelligence & Production Deployment]`
  },
  "natural language processing": {
    title: "Natural Language Processing",
    summary: "Natural Language Processing (NLP) is the branch of artificial intelligence that enables computers to understand, interpret, generate, and manipulate human language.",
    definition: "**Natural Language Processing (NLP)** combines computational linguistics with statistical, machine learning, and deep learning models. Its core objective is enabling machines to process human textual and spoken language with semantic context and syntactic accuracy.",
    mechanics: `- **Tokenization & Embeddings**: Raw text strings are segmented into sub-word tokens and projected into high-dimensional continuous vector spaces via [Tokenization](Tokenization) and word/sentence embeddings.
- **Sequence Modeling & Attention**: Modern NLP processes contextual relationships across sentences using multi-head self-attention mechanisms in [Transformers](Transformers).
- **Downstream Tasks**: Pre-trained representations are fine-tuned for tasks such as named entity recognition, sentiment analysis, semantic search, and [Large Language Models](Large Language Models).`,
    advanced: `Current frontiers center on scaling self-attention efficiency, addressing hallucination and grounding via [Retrieval-Augmented Generation](Retrieval-Augmented Generation), and parameter-efficient fine-tuning (PEFT).`,
    subConcepts: ["Transformers", "Tokenization", "Large Language Models", "Retrieval-Augmented Generation"],
    prompts: [
      "How do multi-head self-attention mechanisms compute bidirectional token relationships in parallel?",
      "What are the mathematical limitations of positional encodings when extrapolating beyond context windows?",
      "How do RAG architectures mitigate hallucination in domain-specific enterprise search?",
      "How is semantic vector search analogous to finding nearest neighbors in physical topological space?"
    ],
    keyTakeaways: [
      "Transforms unstructured text into semantic numerical representations using high-dimensional embeddings.",
      "Powered primarily by self-attention Transformer architectures for long-range contextual understanding.",
      "Advances focus on parameter-efficient fine-tuning, grounding via RAG, and multi-modal alignment."
    ],
    diagramData: `graph TD;
  A[Raw Text Input] --> B[Tokenization & Subword Encoding]
  B --> C[Positional & Vector Embeddings]
  C --> D[Multi-Head Self-Attention Layers]
  D --> E[Contextualized Representations & Output Head]`
  },
  "machine learning": {
    title: "Machine Learning",
    summary: "Machine Learning is a branch of artificial intelligence focused on algorithms that infer statistical representations and improve task performance directly from data without explicit rules.",
    definition: "**Machine Learning (ML)** is the study and application of computational algorithms that learn patterns from training data to make predictions or decisions on unseen inputs.",
    mechanics: `- **Supervised Learning**: Algorithms learn mappings from labeled input-output pairs using loss functions optimized via [Gradient Descent](Gradient Descent).
- **Unsupervised Learning**: Models identify hidden structures, clusters, and low-dimensional manifolds in unlabeled data via [Dimensionality Reduction](Dimensionality Reduction).
- **Reinforcement Learning**: Autonomous agents optimize long-term cumulative reward signals through environment interaction using [Markov Decision Processes](Markov Decision Processes).`,
    advanced: `Central theoretical challenges include combating [Overfitting](Overfitting), calibrating model uncertainty, guaranteeing algorithmic fairness, and scaling neural architectures using [Backpropagation](Backpropagation).`,
    subConcepts: ["Gradient Descent", "Supervised Learning", "Dimensionality Reduction", "Overfitting"],
    prompts: [
      "What are the mathematical differences between stochastic, mini-batch, and full-batch gradient descent?",
      "How does the curse of dimensionality degrade distance-based clustering algorithms?",
      "What production architectures handle real-time feature stores and drift detection at scale?",
      "How is training a neural network physically analogous to annealing in metallurgy?"
    ],
    keyTakeaways: [
      "Enables computers to learn complex non-linear functions directly from empirical data.",
      "Spans supervised learning (labels), unsupervised learning (patterns), and reinforcement learning (rewards).",
      "Model optimization relies on minimizing loss functions across parameterized vector spaces."
    ],
    diagramData: `graph TD;
  A[Dataset: Inputs & Targets] --> B[Feature Pipeline]
  B --> C[Parameterized Model]
  C --> D[Loss Function Calculation]
  D -->|Gradient Update Backprop| C
  C --> E[Inference on Unseen Data]`
  },
  "deep learning": {
    title: "Deep Learning",
    summary: "Deep Learning is a subset of machine learning utilizing multi-layered artificial neural networks to automatically learn hierarchical feature representations from complex data.",
    definition: "**Deep Learning** leverages deep artificial neural networks (ANNs) composed of successive linear transformations and non-linear activation functions to process raw perceptual data such as images, audio, and text.",
    mechanics: `- **Layered Abstraction**: Initial layers detect low-level primitives (edges, phonemes), while deeper layers synthesize high-level semantic representations through [Neural Networks](Neural Networks).
- **Optimization Engine**: Weights are adjusted iteratively via the chain rule of calculus using [Backpropagation](Backpropagation) and adaptive optimizers (e.g. Adam).
- **Architectural Paradigms**: Specialized structures like [Convolutional Neural Networks](Convolutional Neural Networks) process spatial matrices, while [Transformers](Transformers) model long-range sequence dependencies.`,
    advanced: `Training deep topologies requires addressing non-convex optimization landscapes, mitigating vanishing/exploding gradients with [Residual Connections](Residual Connections), and scaling distributed compute across GPU clusters.`,
    subConcepts: ["Neural Networks", "Backpropagation", "Transformers", "Convolutional Neural Networks"],
    prompts: [
      "How do residual connections mathematically alleviate the vanishing gradient problem in deep networks?",
      "What are the computational trade-offs between self-attention mechanisms and recurrent units?",
      "How do model quantization and pruning techniques enable edge deployment without losing accuracy?",
      "How does hierarchical feature extraction in deep vision networks mirror the mammalian visual cortex?"
    ],
    keyTakeaways: [
      "Extracts hierarchical abstractions directly from raw data without manual feature engineering.",
      "Optimized through backpropagation and gradient descent across millions to billions of parameters.",
      "Powers state-of-the-art vision, audio synthesis, natural language understanding, and generative AI."
    ],
    diagramData: `graph TD;
  A[Raw Input: Pixels / Tokens] --> B[Initial Layers: Low-level Features]
  B --> C[Intermediate Layers: Composable Patterns]
  C --> D[Deep Layers: Semantic Representations]
  D --> E[Output Head: Class / Prediction / Embedding]`
  },
  "neural networks": {
    title: "Artificial Neural Networks",
    summary: "Neural Networks are computational architectures inspired by biological nervous systems, consisting of interconnected node layers that perform parameterized matrix transformations.",
    definition: "**Artificial Neural Networks (ANNs)** are parameterized mathematical functions composed of stacked layers of artificial neurons. Each neuron computes a weighted sum of its inputs, adds a bias term, and passes the result through a non-linear activation function.",
    mechanics: `- **Forward Propagation**: Input feature vectors are multiplied by weight matrices ($W$) and shifted by bias vectors ($b$) before passing through [Activation Functions](Activation Functions) like ReLU, GELU, or Sigmoid.
- **Loss Computation**: An objective function measures error divergence between the network's prediction and the ground truth.
- **Backpropagation**: Gradients of the loss with respect to every weight are computed using the multivariate chain rule via [Backpropagation](Backpropagation).`,
    advanced: `Structural performance depends on hyperparameter tuning, batch normalization, dropout regularization, and learning rate scheduling to prevent divergence or saddle point traps.`,
    subConcepts: ["Backpropagation", "Activation Functions", "Gradient Descent", "Loss Functions"],
    prompts: [
      "How do non-linear activation functions enable neural networks to approximate arbitrary continuous functions?",
      "What is the mathematical formulation of backpropagation using Jacobian matrices?",
      "How does layer normalization differ from batch normalization in sequential models?",
      "How do biological synapses differ from artificial weight matrices in plasticity and energy efficiency?"
    ],
    keyTakeaways: [
      "Universal function approximators composed of layered linear algebra transformations and non-linearities.",
      "Learns optimal representations via gradient-based error minimization through backpropagation.",
      "Forms the underlying architectural foundation for convolutional, recurrent, and transformer models."
    ],
    diagramData: `graph LR;
  A[Input Layer X] -->|Weights W1| B[Hidden Layer 1 (ReLU)]
  B -->|Weights W2| C[Hidden Layer 2 (ReLU)]
  C -->|Weights W3| D[Output Layer (Softmax/Linear)]
  D -->|Loss Computation| E[Error Signal]
  E -.->|Backward Gradients| C
  E -.->|Backward Gradients| B`
  },
  "transformers": {
    title: "Transformer Architecture",
    summary: "The Transformer is a deep learning architecture based entirely on self-attention mechanisms, dispensing with recurrence and convolutions to enable massive parallelization.",
    definition: "**The Transformer** is a neural network architecture introduced in 2017 ('Attention Is All You Need') that models sequential dependencies via scaled dot-product self-attention without sequential recurrent steps.",
    mechanics: `- **Self-Attention**: Calculates relationships between all pairs of tokens simultaneously via Query ($Q$), Key ($K$), and Value ($V$) projections with attention weights $\\text{softmax}(QK^T / \\sqrt{d_k})$.
- **Positional Encoding**: Injects sequence order information into permutation-invariant attention matrices using sinusoidal or learned [Positional Encodings](Positional Encodings).
- **Feed-Forward & Residuals**: Each attention block is followed by a multi-layer perceptron, layer normalization, and residual skip connections.`,
    advanced: `Scaling challenges include quadratic computational and memory complexity ($O(N^2)$ with sequence length), spurring innovations like FlashAttention, sparse attention, and linear state-space models.`,
    subConcepts: ["Self-Attention Mechanism", "Large Language Models", "Positional Encodings", "FlashAttention"],
    prompts: [
      "Why is the dot product scaled by $\\sqrt{d_k}$ in scaled dot-product attention?",
      "How does FlashAttention optimize GPU SRAM memory access to achieve dramatic speedups?",
      "What are the architectural differences between encoder-only, decoder-only, and encoder-decoder transformers?",
      "How is the self-attention matrix analogous to a soft lookup table or associative memory?"
    ],
    keyTakeaways: [
      "Replaced recurrent architectures by allowing full parallel training across entire token sequences.",
      "Calculates dynamic relevance between all tokens using Query-Key-Value matrix multiplications.",
      "Forms the foundation of modern Large Language Models (LLMs) and vision transformers."
    ],
    diagramData: `graph TD;
  A[Input Tokens] --> B[Token & Positional Embeddings]
  B --> C[Multi-Head Self-Attention Block]
  C --> D[Add & Layer Norm]
  D --> E[Position-wise Feed-Forward Network]
  E --> F[Add & Layer Norm]
  F --> G[Next Token Probabilities / Embeddings]`
  },
  "quantum computing": {
    title: "Quantum Computing",
    summary: "Quantum Computing harnesses quantum mechanical phenomena like superposition and entanglement to execute certain computational algorithms exponentially faster than classical Turing machines.",
    definition: "**Quantum Computing** is a computational paradigm that processes information using quantum bits (qubits), which exploit principles of quantum physics to solve specific mathematical and simulation problems beyond classical limits.",
    mechanics: `- **Superposition**: Unlike classical binary bits (0 or 1), qubits exist in linear combinations of basis states, governed by [Quantum Superposition](Quantum Superposition).
- **Entanglement**: Correlated states allow multi-qubit systems to manipulate exponential state spaces simultaneously via [Quantum Entanglement](Quantum Entanglement).
- **Interference & Gates**: Algorithms apply unitary transformations to amplify constructive probability amplitudes of correct solutions while canceling incorrect ones through [Quantum Circuits](Quantum Circuits).`,
    advanced: `Physical realization requires overcoming environmental decoherence through [Quantum Error Correction](Quantum Error Correction), fault-tolerant surface codes, and cryogenic hardware architectures.`,
    subConcepts: ["Quantum Superposition", "Quantum Entanglement", "Quantum Circuits", "Quantum Error Correction"],
    prompts: [
      "How does Shor's algorithm achieve polynomial time factorization of large integers?",
      "What physical barriers prevent maintaining qubit coherence in non-cryogenic environments?",
      "How will quantum key distribution (QKD) reshape public key cryptography infrastructure?",
      "How is quantum phase estimation conceptually similar to the classical Fourier transform?"
    ],
    keyTakeaways: [
      "Replaces classical binary logic with probabilistic qubit superposition and entanglement.",
      "Provides polynomial-to-exponential speedups for prime factorization, simulation, and search algorithms.",
      "Major bottleneck remains physical qubit noise and scaling fault-tolerant error correction."
    ],
    diagramData: `graph TD;
  A[Initialized Qubit State |0⟩] --> B[Superposition Creation: Hadamard Gates]
  B --> C[Entangling Operations: CNOT Gates]
  C --> D[Algorithm Phase Inversion & Amplification]
  D --> E[Quantum Measurement & Classical Readout]`
  },
  "distributed systems": {
    title: "Distributed Systems",
    summary: "Distributed Systems are collections of independent computing nodes that communicate over networks and coordinate actions to appear as a single coherent system to end users.",
    definition: "**Distributed Systems** solve computation and storage problems that exceed the capacity of single machines, providing horizontal scalability, fault tolerance, and high availability across physical networks.",
    mechanics: `- **Consensus Protocols**: Nodes agree on global state amidst message delays and hardware failures using algorithms like [Raft Consensus](Raft Consensus) and Paxos.
- **Partitioning & Replication**: Data is distributed across shards and replicated across multiple nodes using [Consistent Hashing](Consistent Hashing) and quorum reads/writes.
- **Asynchronous Communication**: Services decouple execution via message queues, event logs, and RPC frameworks like [gRPC](gRPC).`,
    advanced: `System designers must balance fundamental architectural trade-offs formalized by the [CAP Theorem](CAP Theorem) and PACELC theorem, handling split-brain scenarios and network partitions gracefully.`,
    subConcepts: ["Raft Consensus", "CAP Theorem", "Consistent Hashing", "Fault Tolerance"],
    prompts: [
      "How does the Raft consensus algorithm handle leader election during split-vote network partitions?",
      "What are the empirical trade-offs between strong consistency and eventual consistency in global databases?",
      "How do distributed vector clocks resolve concurrent write conflicts without centralized timestamps?",
      "How is consensus in distributed computing analogous to parliamentary voting procedures?"
    ],
    keyTakeaways: [
      "Enables horizontal scaling, zero single-point-of-failure architectures, and global availability.",
      "Governed by fundamental constraints including the CAP Theorem and network latency bounds.",
      "Requires robust consensus protocols, replication strategies, and idempotent state synchronization."
    ],
    diagramData: `graph TD;
  A[Client Request / Write] --> B[API Gateway / Load Balancer]
  B --> C[Primary Leader Node]
  C -->|Replicate State Log| D[Follower Replica 1]
  C -->|Replicate State Log| E[Follower Replica 2]
  D -->|Quorum ACK| C
  E -->|Quorum ACK| C
  C --> F[Committed State Return]`
  },
  "artificial intelligence": {
    title: "Artificial Intelligence",
    summary: "Artificial Intelligence is the broad computational science focused on building machines capable of performing tasks that typically require human cognition.",
    definition: "**Artificial Intelligence (AI)** encompasses theoretical and applied computer science dedicated to creating rational agents that perceive environments, reason over knowledge, plan actions, and solve complex objectives.",
    mechanics: `- **Symbolic & Logic Systems**: Classical AI utilizes formal ontologies, search trees, and rule engines to perform deterministic reasoning through [Knowledge Representation](Knowledge Representation).
- **Statistical & Machine Learning**: Modern AI relies on empirical learning, probabilistic modeling, and [Machine Learning](Machine Learning) algorithms.
- **Perception & Action**: AI systems interface with reality via [Computer Vision](Computer Vision), [Natural Language Processing](Natural Language Processing), and robotic actuation.`,
    advanced: `Key frontiers include developing robust causal reasoning, multi-modal alignment, energy-efficient neurosymbolic architectures, and verifiable safety guarantees for autonomous agents.`,
    subConcepts: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Knowledge Representation"],
    prompts: [
      "How can neurosymbolic AI combine the interpretability of logic with the scale of deep learning?",
      "What are the fundamental physical and thermodynamic limits of silicon-based cognitive compute?",
      "How are autonomous multi-agent systems orchestrated in mission-critical environments?",
      "How does synthetic neural architecture compare fundamentally with biological cognition?"
    ],
    keyTakeaways: [
      "Spans deterministic symbolic reasoning and statistical probabilistic learning paradigms.",
      "Core components include perception, knowledge representation, reasoning, planning, and learning.",
      "Modern focus centers on foundation models, agentic workflows, and safe autonomous systems."
    ],
    diagramData: `graph TD;
  A[Environmental Perception & Sensor Input] --> B[Knowledge Representation & State]
  B --> C[Reasoning & Planning Engine]
  C --> D[Decision & Model Execution]
  D --> E[Actionable Actuation / Output Generation]`
  },
  "gradient descent": {
    title: "Gradient Descent Optimization",
    summary: "Gradient Descent is a first-order iterative optimization algorithm for finding the local minimum of a differentiable mathematical loss function.",
    definition: "**Gradient Descent** is the primary mathematical optimization algorithm used in machine learning. It iteratively calculates the negative gradient vector of a loss function and updates model parameters in the direction of steepest descent.",
    mechanics: `- **Gradient Calculation**: Computes partial derivatives of the loss function $\\mathcal{L}$ with respect to each parameter $\\theta$: $\\nabla_\\theta \\mathcal{L}$.
- **Step Update**: Adjusts parameters proportional to a learning rate $\\eta$: $\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta \\mathcal{L}$.
- **Variants**: [Stochastic Gradient Descent (SGD)](Stochastic Gradient Descent) uses single samples, while mini-batch updates balance vectorization speed with gradient variance.`,
    advanced: `Modern deep learning utilizes adaptive learning rate algorithms like Adam, RMSprop, and AdaGrad to traverse ill-conditioned curvature and escape saddle points via [Loss Landscapes](Loss Landscapes).`,
    subConcepts: ["Backpropagation", "Learning Rate Scheduling", "Adam Optimizer", "Loss Landscapes"],
    prompts: [
      "How does momentum in gradient descent help accelerate past flat plateaus and saddle points?",
      "What are the mathematical convergence guarantees for convex vs non-convex loss functions?",
      "How do second-order optimization methods (e.g. L-BFGS) compare with first-order gradient descent?",
      "How is gradient descent physically analogous to a ball rolling down a potential energy surface?"
    ],
    keyTakeaways: [
      "Core mathematical engine used to train parameterized machine learning and deep learning models.",
      "Updates weights proportionally to the negative gradient of the objective loss function.",
      "Enhanced by momentum, adaptive learning rates, and mini-batch stochastic sampling."
    ],
    diagramData: `graph TD;
  A[Current Weights θ] --> B[Compute Loss & Gradient ∇L]
  B --> C[Scale by Learning Rate η]
  C --> D[Update Weights: θ - η∇L]
  D --> E{Convergence Check / Stop Criteria}
  E -->|Loss Decreasing| A
  E -->|Converged| F[Optimized Parameter State]`
  }
};

// Natural language query cleaner and core subject extractor
function extractSubject(rawQuery: string): string {
  let q = rawQuery.trim();
  
  // Remove common question preambles
  q = q.replace(/^(what (is|are|does|can)|how (does|do|can|is)|why (is|are|do|does)|explain|describe|tell me about|deep dive into|overview of|what are the (core )?(technical )?(mechanics|principles|aspects|foundations|trade-offs|limitations) of)\s+/i, "");
  
  // Remove trailing question marks and punctuation
  q = q.replace(/[?!.:;,]+$/, "").trim();
  
  // If the query contains " in " or " of " (e.g. "Gradient Descent in Neural Networks"), clean it or keep the focal topic
  return q || rawQuery.trim();
}

// Generic subject classifier and domain-accurate generator for any query
export function generateSmartFallback(
  prompt: string,
  mode: string = "standard",
  parentContext?: string
): GeneratedNodeResult {
  const cleanPrompt = prompt.trim();
  const subject = extractSubject(cleanPrompt);
  const lowerSubject = subject.toLowerCase().replace(/['"?!.,]/g, "");
  const lowerRaw = cleanPrompt.toLowerCase().replace(/['"?!.,]/g, "");

  // 1. Check exact or fuzzy matches in curated knowledge base
  for (const [key, curated] of Object.entries(CURATED_KNOWLEDGE)) {
    if (
      lowerSubject === key || 
      lowerRaw === key || 
      lowerSubject.includes(key) || 
      key.includes(lowerSubject) ||
      lowerRaw.includes(key)
    ) {
      return formatCuratedResult(curated, mode, parentContext, cleanPrompt !== curated.title ? cleanPrompt : undefined);
    }
  }

  // 2. Intelligent Domain Archetype Classification
  const title = subject.length < 40 
    ? subject.replace(/\b\w/g, l => l.toUpperCase())
    : subject.split(/\s+/).slice(0, 5).join(" ").replace(/\b\w/g, l => l.toUpperCase());

  const archetype = detectArchetype(lowerSubject + " " + lowerRaw);
  return formatArchetypeResult(title, subject, archetype, mode, parentContext);
}

type Archetype = "data_ai" | "cs_systems" | "physics_math" | "bio_life" | "econ_business" | "general_concept";

function detectArchetype(text: string): Archetype {
  if (text.match(/data|learning|neural|model|dataset|statist|predict|regress|classif|feature|analytics|nlp|vision|cluster|bayes|ai|language|token|attention/)) {
    return "data_ai";
  }
  if (text.match(/database|sql|server|cloud|network|concurr|memory|api|protocol|thread|compiler|cache|microservice|docker|linux|security|auth|distributed/)) {
    return "cs_systems";
  }
  if (text.match(/quantum|gravity|relativity|thermodynamic|entropy|energy|atom|particle|force|electr|optics|calculus|algebra|matrix|tensor|geometry|physics/)) {
    return "physics_math";
  }
  if (text.match(/dna|rna|gene|protein|cell|neuron|organism|evolut|photosynth|metabol|crispr|enzyme|biology|immune|brain|synapse/)) {
    return "bio_life";
  }
  if (text.match(/market|inflation|gdp|capital|finance|trade|invest|liquidity|price|econom|stock|cost|revenue|bank/)) {
    return "econ_business";
  }
  return "general_concept";
}

function formatCuratedResult(
  c: CuratedConcept,
  mode: string,
  parentContext?: string,
  userSpecificQuestion?: string
): GeneratedNodeResult {
  let modeHeadline = "Overview & Technical Breakdown";
  let modePrefix = "";

  if (mode === "deep-dive") {
    modeHeadline = "First-Principles Technical Breakdown";
    modePrefix = "At a granular mathematical and architectural level, ";
  } else if (mode === "contrarian") {
    modeHeadline = "Critical Inquiries & Bottlenecks";
    modePrefix = "Under empirical stress and critical analysis, ";
  } else if (mode === "applications") {
    modeHeadline = "Applied Systems & Production Architectures";
    modePrefix = "In enterprise deployment and real-world pipelines, ";
  } else if (mode === "timeline") {
    modeHeadline = "Historical Evolution & Active Frontiers";
    modePrefix = "From foundational discovery to modern active benchmarks, ";
  } else if (mode === "analogy") {
    modeHeadline = "Mechanistic Analogy & Mental Models";
    modePrefix = "To build an accurate intuitive mental model, ";
  }

  const queryHeader = userSpecificQuestion ? `\n*Addressing Focus: "${userSpecificQuestion}"*\n` : "";

  const text = `### ${modeHeadline}
${queryHeader}
#### 1. Factual Definition & Purpose
${c.definition}

#### 2. Working Principles & Core Mechanics
${c.mechanics}

#### 3. Advanced Context & Theoretical Nuances
${parentContext ? `Building directly upon *"${parentContext.slice(0, 80)}..."*, ` : ""}${c.advanced}`;

  return {
    title: c.title,
    summary: `${modePrefix}${c.summary}`,
    text,
    prompts: c.prompts,
    keyTakeaways: c.keyTakeaways,
    diagramData: c.diagramData,
    fallbackMode: true
  };
}

function formatArchetypeResult(
  title: string,
  subject: string,
  archetype: Archetype,
  mode: string,
  parentContext?: string
): GeneratedNodeResult {
  let summary = "";
  let definition = "";
  let mechanics = "";
  let advanced = "";
  let subConcepts: [string, string, string, string] = [
    `${title} Fundamentals`,
    `${title} Architecture`,
    `${title} Implementation`,
    `${title} Optimization`
  ];
  let prompts: [string, string, string, string] = [
    `What are the core technical mechanics of ${title}?`,
    `What are the most documented trade-offs and limitations of ${title}?`,
    `How is ${title} applied in real-world production environments?`,
    `What is a precise, intuitive mental model that accurately explains ${title}?`
  ];
  let keyTakeaways: [string, string, string] = [
    `Establishes an objective, domain-verified framework for ${title}.`,
    `Demonstrates the core relationship between fundamental inputs and target outputs.`,
    `Highlights practical trade-offs and operational boundary constraints.`
  ];
  let diagramData = `graph TD;
  A[Input / Problem Definition] --> B[${title} Processing]
  B --> C[Evaluation & Verification]
  C --> D[Target Result / Deployment]`;

  if (archetype === "data_ai") {
    summary = `**${title}** is an analytical and computational methodology used to model patterns, optimize predictive accuracy, and transform complex inputs into structured outputs.`;
    definition = `**${title}** is a formal computational discipline that provides algorithms, mathematical models, and feature transformation pipelines to process high-dimensional data and generate actionable inferences.`;
    subConcepts = [
      `${title} Data Preprocessing`,
      `${title} Feature Engineering`,
      `${title} Model Architecture`,
      `${title} Validation & Metrics`
    ];
    mechanics = `- **Data Pipeline**: Raw inputs undergo cleansing, normalization, and dimensional reduction via [${subConcepts[0]}](${subConcepts[0]}).
- **Representation & Modeling**: Relevant signals are extracted through [${subConcepts[1]}](${subConcepts[1]}) and passed into optimization algorithms like [${subConcepts[2]}](${subConcepts[2]}).
- **Evaluation**: Performance is benchmarked against ground truth using loss functions and [${subConcepts[3]}](${subConcepts[3]}).`;
    advanced = `Production deployment demands strict guardrails against overfitting, distribution shift, and data leakage across training and evaluation partitions.`;
    diagramData = `graph TD;
  A[Raw Input Data] --> B[${subConcepts[0]}]
  B --> C[${subConcepts[1]}]
  C --> D[${subConcepts[2]}]
  D --> E[Inference & Predictive Insights]`;
  } else if (archetype === "cs_systems") {
    summary = `**${title}** is a software engineering paradigm that establishes protocols, data structures, and architectural abstractions to ensure reliable, high-performance computation.`;
    definition = `**${title}** provides standardized architectural mechanisms that govern how software components manage memory, process state transitions, and communicate across network boundaries.`;
    subConcepts = [
      `${title} Core Protocol`,
      `${title} State Synchronization`,
      `${title} Concurrency Control`,
      `${title} Fault Tolerance`
    ];
    mechanics = `- **Structural Layer**: Operates through standardized interfaces defined by [${subConcepts[0]}](${subConcepts[0]}).
- **State & Concurrency**: Manages shared resources without race conditions using [${subConcepts[1]}](${subConcepts[1]}) and [${subConcepts[2]}](${subConcepts[2]}).
- **Resilience**: Implements defensive boundaries and recovery protocols through [${subConcepts[3]}](${subConcepts[3]}).`;
    advanced = `Engineers must evaluate core system trade-offs between latency, consistency, memory overhead, and computational complexity.`;
    diagramData = `graph TD;
  A[Client / Service Request] --> B[${subConcepts[0]}]
  B --> C[${subConcepts[1]}]
  C --> D[${subConcepts[3]}]
  D --> E[Synchronized Response]`;
  } else if (archetype === "physics_math") {
    summary = `**${title}** represents a fundamental mathematical or physical framework governing conservation laws, spatial relationships, and quantitative transformations.`;
    definition = `**${title}** is a rigorous formal framework that models observable physical phenomena and mathematical structures through exact equations, axioms, and invariance properties.`;
    subConcepts = [
      `${title} Foundational Axioms`,
      `${title} Mathematical Formulation`,
      `${title} Boundary Conditions`,
      `${title} Empirical Verification`
    ];
    mechanics = `- **Formal Axioms**: Derives its validity from baseline principles outlined in [${subConcepts[0]}](${subConcepts[0]}).
- **Analytical Mechanics**: Quantifies dynamic behavior through [${subConcepts[1]}](${subConcepts[1]}), mapping state variables to observable invariants.
- **Constraints**: Formulates physical or mathematical [${subConcepts[2]}](${subConcepts[2]}) that define valid operational state spaces.`;
    advanced = `Modern research investigates edge cases, phase transitions, and connections with [${subConcepts[3]}](${subConcepts[3]}).`;
    diagramData = `graph TD;
  A[Physical / Formal Initial State] --> B[${subConcepts[0]}]
  B --> C[${subConcepts[1]}]
  C --> D[Observable Invariant / Output]`;
  } else if (archetype === "bio_life") {
    summary = `**${title}** is a biological mechanism or principle governing cellular metabolism, genetic regulation, and systemic homeostasis in living organisms.`;
    definition = `**${title}** encompasses molecular, genetic, or physiological processes that allow biological systems to sustain equilibrium, respond to environmental stimuli, and replicate genetic material.`;
    subConcepts = [
      `${title} Molecular Substrate`,
      `${title} Enzymatic Regulation`,
      `${title} Cellular Signaling`,
      `${title} Evolutionary Function`
    ];
    mechanics = `- **Substrate Interaction**: Relies on specific biochemical binding defined by [${subConcepts[0]}](${subConcepts[0]}).
- **Catalytic Regulation**: Mediates reaction rates and metabolic pathways through [${subConcepts[1]}](${subConcepts[1]}).
- **Signaling Pathways**: Coordinates tissue and organismic responses via [${subConcepts[2]}](${subConcepts[2]}).`;
    advanced = `Understanding these mechanisms enables targeted biomedical therapies, synthetic biology interventions, and ecological conservation strategies.`;
    diagramData = `graph TD;
  A[Environmental / Molecular Trigger] --> B[${subConcepts[0]}]
  B --> C[${subConcepts[1]}]
  C --> D[Homeostatic Response / Cellular Output]`;
  } else if (archetype === "econ_business") {
    summary = `**${title}** is an economic model or market mechanism governing resource allocation, pricing dynamics, and strategic incentives among rational agents.`;
    definition = `**${title}** describes quantitative and behavioral mechanisms that determine how individuals, organizations, and markets allocate scarce resources under risk and uncertainty.`;
    subConcepts = [
      `${title} Incentive Structures`,
      `${title} Market Equilibrium`,
      `${title} Liquidity & Capital Dynamics`,
      `${title} Strategic Game Theory`
    ];
    mechanics = `- **Incentives & Payoffs**: Analyzes participant behavior shaped by [${subConcepts[0]}](${subConcepts[0]}).
- **Equilibrium Dynamics**: Evaluates price discovery and market clearing via [${subConcepts[1]}](${subConcepts[1]}).
- **Capital Flows**: Models systemic risk and resource distribution through [${subConcepts[2]}](${subConcepts[2]}).`;
    advanced = `Application in policy or corporate finance requires accounting for market asymmetries, transaction costs, and behavioral biases.`;
    diagramData = `graph TD;
  A[Market Signal / Input] --> B[${subConcepts[0]}]
  B --> C[${subConcepts[1]}]
  C --> D[Resource Allocation / Outcome]`;
  } else {
    summary = `**${title}** is a foundational concept defining core mechanisms, analytical structures, and operational standards within its domain.`;
    definition = `**${title}** provides a structured conceptual framework that defines essential criteria, relationships, and methodologies to solve domain-specific problems.`;
    subConcepts = [
      `${title} Core Principles`,
      `${title} Operational Workflow`,
      `${title} Structural Constraints`,
      `${title} Applied Outcomes`
    ];
    mechanics = `- **Foundational Framework**: Establishes core rules and terminology through [${subConcepts[0]}](${subConcepts[0]}).
- **Execution Pipeline**: Operates step-by-step through [${subConcepts[1]}](${subConcepts[1]}).
- **Boundary Handling**: Safely regulates exceptions and constraints via [${subConcepts[2]}](${subConcepts[2]}).`;
    advanced = `Practical implementation requires balancing theoretical soundness with operational complexity and real-world deployment constraints.`;
  }

  let modeHeadline = "Overview & Technical Breakdown";
  if (mode === "deep-dive") {
    modeHeadline = "First-Principles Technical Breakdown";
  } else if (mode === "contrarian") {
    modeHeadline = "Critical Inquiries & Bottlenecks";
  } else if (mode === "applications") {
    modeHeadline = "Applied Systems & Production Deployments";
  } else if (mode === "timeline") {
    modeHeadline = "Historical Evolution & Active Frontiers";
  } else if (mode === "analogy") {
    modeHeadline = "Mechanistic Analogy & Mental Models";
  }

  const text = `### ${modeHeadline}

#### 1. Factual Definition & Purpose
${definition}

#### 2. Working Principles & Mechanics
${mechanics}

#### 3. Advanced Context & Theoretical Nuances
${parentContext ? `Building directly upon *"${parentContext.slice(0, 80)}..."*, ` : ""}${advanced}`;

  return {
    title,
    summary,
    text,
    prompts,
    keyTakeaways,
    diagramData,
    fallbackMode: true
  };
}

export function generateSynthesisFallback(nodeA: any, nodeB: any): GeneratedNodeResult {
  const titleA = nodeA.title || nodeA.prompt || "Concept A";
  const titleB = nodeB.title || nodeB.prompt || "Concept B";
  const hybridTitle = `${titleA.split(" ")[0]} × ${titleB.split(" ")[0]}: Cross-Domain Synthesis`;

  const bridgeConcept1 = `${titleA} Foundations`;
  const bridgeConcept2 = `${titleB} Architecture`;
  const bridgeConcept3 = `Hybrid Algorithmic Model`;

  const summary = `The intersection between **${titleA}** and **${titleB}** creates a structured cross-disciplinary interface, combining theoretical models from one field with the practical mechanisms of the other.`;

  const text = `### Cross-Disciplinary Synthesis

#### 1. Factual Interfacial Definition
The synthesis of **${titleA}** and **${titleB}** bridges two complementary disciplines. It integrates the analytical methodologies of [${bridgeConcept1}](${bridgeConcept1}) with the structural execution mechanisms of [${bridgeConcept2}](${bridgeConcept2}) to solve problems that neither paradigm can address in isolation.

#### 2. Core Mechanisms of Convergence
- **Methodological Cross-Pollination**: Techniques from ${titleA} provide formal rigor and optimization criteria to the workflows in ${titleB}.
- **Unified Pipeline**: Integrating both approaches forms a [${bridgeConcept3}](${bridgeConcept3}) capable of multi-domain processing with enhanced robustness and scalability.

#### 3. Applied Frontiers & Trade-offs
Combining these methodologies uncovers new frontiers for research and enterprise engineering, requiring careful calibration of systemic complexity, latency, and domain constraints.`;

  const prompts: [string, string, string, string] = [
    `What is the exact mathematical or operational interface connecting ${titleA} and ${titleB}?`,
    `What are the primary trade-offs and complexity overheads when combining these two systems?`,
    `How can [${bridgeConcept3}](${bridgeConcept3}) be tested in a controlled empirical benchmark?`,
    `What existing production systems already leverage principles from both ${titleA} and ${titleB}?`
  ];

  const keyTakeaways: [string, string, string] = [
    `Establishes a concrete bridge between the analytical methods of ${titleA} and ${titleB}.`,
    `Enables dual-domain problem solving through ${bridgeConcept3}.`,
    `Highlights clear technical trade-offs between isolated and hybridized approaches.`
  ];

  const diagramData = `graph TD;
  A[${titleA.slice(0, 15)}] --> C[Interfacial Protocol]
  B[${titleB.slice(0, 15)}] --> C
  C --> D[${bridgeConcept3.slice(0, 18)}]
  D --> E[Emergent Hybrid Capability]`;

  return {
    title: hybridTitle,
    summary,
    text,
    prompts,
    keyTakeaways,
    diagramData,
    fallbackMode: true
  };
}

export function generateStyledVisualSvg(title: string, style: string = "editorial"): string {
  const cleanTitle = (title || "Concept Space").replace(/[<>&"]/g, "");
  
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 45) % 360;

  let visualElements = "";

  if (style === "schematic") {
    visualElements = `
      <rect width="1280" height="720" fill="#0B1120" />
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1280" height="720" fill="url(#grid)" />
      <circle cx="640" cy="360" r="220" fill="none" stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.6"/>
      <circle cx="640" cy="360" r="140" fill="none" stroke="#3B82F6" stroke-width="2" opacity="0.8"/>
      <circle cx="640" cy="360" r="60" fill="none" stroke="#6366F1" stroke-width="1.5"/>
      <line x1="240" y1="360" x2="1040" y2="360" stroke="#06B6D4" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
      <line x1="640" y1="120" x2="640" y2="600" stroke="#06B6D4" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
      <polygon points="640,240 740,420 540,420" fill="none" stroke="#38BDF8" stroke-width="2" opacity="0.7"/>
      <text x="640" y="365" fill="#E2E8F0" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle" letter-spacing="4">${cleanTitle.toUpperCase()}</text>
      <text x="640" y="480" fill="#38BDF8" font-family="monospace" font-size="12" text-anchor="middle" letter-spacing="2">SYSTEM SCHEMA // ARCHITECTURAL TOPOLOGY</text>
    `;
  } else if (style === "sketch") {
    visualElements = `
      <rect width="1280" height="720" fill="#18181B" />
      <circle cx="640" cy="360" r="200" fill="none" stroke="#71717A" stroke-width="1" stroke-dasharray="3 3"/>
      <ellipse cx="640" cy="360" rx="260" ry="120" fill="none" stroke="#A1A1AA" stroke-width="1.5" transform="rotate(30 640 360)" opacity="0.6"/>
      <ellipse cx="640" cy="360" rx="260" ry="120" fill="none" stroke="#D4D4D8" stroke-width="1.5" transform="rotate(-30 640 360)" opacity="0.6"/>
      <circle cx="640" cy="360" r="16" fill="#F4F4F5" opacity="0.9"/>
      <text x="640" y="520" fill="#E4E4E7" font-family="serif" font-style="italic" font-size="24" text-anchor="middle">${cleanTitle}</text>
    `;
  } else {
    // Editorial clean graphic
    visualElements = `
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${h1}, 70%, 20%)" />
          <stop offset="100%" stop-color="hsl(${h2}, 80%, 12%)" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#grad1)" />
      <circle cx="640" cy="360" r="180" fill="none" stroke="hsl(${h1}, 80%, 65%)" stroke-width="2" opacity="0.8"/>
      <circle cx="640" cy="360" r="240" fill="none" stroke="hsl(${h2}, 80%, 75%)" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"/>
      <circle cx="640" cy="360" r="40" fill="hsl(${h1}, 90%, 70%)" opacity="0.85"/>
      <text x="640" y="368" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="28" font-weight="700" text-anchor="middle" letter-spacing="1">${cleanTitle}</text>
      <text x="640" y="420" fill="hsl(${h2}, 80%, 85%)" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle" letter-spacing="3">QELORA KNOWLEDGE NODE</text>
    `;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      ${visualElements}
    </svg>
  `)}`;
}
