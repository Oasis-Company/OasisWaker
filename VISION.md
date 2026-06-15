<pre>
╔═════════════════════════════════════════════════════════════════╗
║                 OASISWAKER — IDEAL STATE VISION                  ║
║               "The World Computer, Built by Everyone"               ║
╚═════════════════════════════════════════════════════════════════╝
</pre>

> This file describes what OasisWaker looks like when it works.
> Not features. Not architecture. **The experience.**
>
> Read this when development feels stuck. This is the target.

---

## SECTION 0 — THE CORE INSIGHT (why this exists)

Today, cloud infrastructure is a feudal system.

Three companies (AWS, Google, Microsoft) own the ground.
Everyone else pays rent to build on it.

OasisWaker asks a different question:

```
What if the infrastructure itself was crowdsourced?
What if every developer's free-tier cloud quota became
one tile in a global distributed system?
```

Not "buy compute from Amazon."
Not "trust a blockchain."
But: **"plug your free Cloudflare/Vercel/Supabase account
      into a shared mesh, and get storage that no single
      company controls."**

The ideal state is not a product.
It is a new layer of the internet stack.

---

## SECTION 1 — THE USER EXPERIENCE (what it feels like)

### 1.1 For the person storing data

```
┌──────────────────────────────────────────────────────┐
│  $ oasiswaker login --cloudflare                    │
│  ✓ Connected. Your free-tier quota:                 │
│    100,000 req/day  |  100 MB R2 storage           │
│                                                      │
│  $ oasiswaker store ./my-file.tar.gz               │
│  ✓ Stored. Replicated across 7 nodes.              │
│    Cost to you: $0.00 (paid by network credits)     │
│                                                      │
│  $ oasiswaker retrieve my-file.tar.gz ./restore/   │
│  ✓ Retrieved from 3 nearest nodes (avg 120ms).      │
└──────────────────────────────────────────────────────┘
```

That's it. No account creation. No credit card.
The file is encrypted client-side, split into erasure-coded
shards, and stored across nodes run by strangers who have
volunteered their free-tier cloud quota.

If three of those nodes go offline, the file is still
recoverable. **The network heals itself.**

### 1.2 For the person contributing resources

```
┌──────────────────────────────────────────────────────┐
│  $ oasiswaker contribute --cloudflare              │
│                                                      │
│  Your Cloudflare Worker is now a OasisWaker node.  │
│  Storing: 73.2 MB across 1,847 blocks             │
│  Serving: 1,203 requests this month                │
│  Earned: 4,720 credits                             │
│    (enough to store ~500 MB for 30 days)           │
│                                                      │
│  Your contribution: 0.0003% of the network.        │
│  Thank you.                                         │
└──────────────────────────────────────────────────────┘
```

You are not "mining." You are not "staking."
You are contributing spare capacity and getting proportional
credit to use the network. Like BitTorrent, but the
"seeds" are edge compute nodes and the "files" persist
until you delete them.

### 1.3 For the developer building on top of it

```typescript
import { OasisWaker } from '@oasiswaker/sdk'

const oasis = new OasisWaker()
await oasis.put('user:42:avatar', avatarBuffer)
// stored across the network
// costs $0.0001 per month
// survives any single provider outage
```

One SDK. Every edge provider abstracted away.
Your app stores data on a network that:
- Has no single point of failure
- Has no vendor lock-in
- Costs 100× less than AWS S3
- Works in China, in Europe, in places AWS doesn't serve

---

## SECTION 2 — THE NETWORK STATE (what the system looks like)

Ideal topology:

```
          ┌──────────┐
          │  Browser  │  ← you are here
          └─────┬────┘
                │
          ┌───────┴───────────┐
          │   DHT (Kademlia)   │  ← peer discovery
          │   ~10,000 nodes     │
          └───────┬───────────┘
                │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
  ┌─────┐   ┌─────┐   ┌─────┐
  │ CF  │   │ Verc│   │ SB  │   ← edge nodes (free tier)
  │Worker│   │Edge │   │Edge │
  └──┬──┘   └──┬──┘   └──┬──┘
    │           │           │
    ▼           ▼           ▼
  ┌─────────────────────────────┐
  │  R2 / Blob / Storage bucket  │  ← actual data
  │  encrypted, erasure-coded    │
  └─────────────────────────────┘
```

Key properties of the ideal network:

- **[P2P DISCOVERY]**  Nodes find each other without a central directory.
  DHT provides O(log N) lookup. Bootstrap nodes
  from `oasisbio.com` help cold-start, but the network
  survives if `oasisbio.com` disappears.

- **[ERASURE CODING]**  Data is split into K shards with N-K redundancy.
  With 7 shards and 4 redundancy, the file survives
  any 3 node failures. Like RAID, but across the internet.

- **[ENCRYPTION]**  Client-side AES-256-GCM. The network stores ciphertext.
  Node operators cannot read what they store.
  OasisBio (the company) cannot read it either.

- **[REPLICATION]**  Hot data self-replicates to fast nodes.
  Cold data migrates to cheap storage.
  The network has its own supply/demand economics.

- **[SYBIL RESISTANCE]**  One OAuth account = one node registration.
  Proof-of-Work required for node ID generation.
  Reputation system: nodes that go offline
  frequently lose priority in the DHT routing table.

---

## SECTION 3 — THE NUMBERS (what success looks like in metrics)

Target metrics for the ideal v2.0 network:

| METRIC                 | TARGET    | NOTES          |
|------------------------|-----------|----------------|
| Active nodes            | > 10,000  | globally       |
| Countries represented    | > 50      |                |
| Total storage capacity   | > 10 TB   | aggregated     |
| PUT latency (p50)      | < 200ms   | edge→edge      |
| GET latency (p50)      | < 100ms   | cached         |
| Data durability         | 99.999%  | 5 nines        |
| Single-provider outage  | no impact | by design      |
| Cost vs AWS S3         | ~ 1%      | free-tier      |
| Zero-knowledge property | ✓         | client-side    |

These numbers are not random. They mean:

- **> 10,000 nodes** → The network is resilient. Any single
  jurisdiction can't shut it down.

- **< 200ms PUT** → It feels like a normal API. Not "blockchain slow."
  Fast enough for real applications.

- **99.999% durable** → Losing data is not an option. Erasure coding
  with geographic distribution achieves this.

- **1% of AWS cost** → The economic disruption. If storage is
  nearly free, what new applications become possible?

---

## SECTION 4 — THE PHILOSOPHICAL DIFFERENCE (why it matters)

Most "decentralized storage" projects get this wrong:

- ❌ **IPFS** — Needs you to run a daemon. Not accessible
  to normal users. Content addressing is clever
  but adoption is stalled at ~researchers.

- ❌ **Filecoin** — Blockchain incentives. Complex. Mining requires
  serious hardware. Not "crowdsourced."

- ❌ **Storj** — More centralized than claimed. Company runs
  the bootstrap infrastructure.

- ✅ **OasisWaker ideal:**

  **"Your existing free-tier cloud accounts ARE the network."**

  No new account. No new software to install (beyond the CLI).
  No mining. No tokens. Just: contribute spare capacity,
  get credits, store data.

The philosophical difference:

> OasisWaker is not trying to replace cloud providers.
> It is trying to make their free tiers work together.

Cloudflare gives you 100K req/day for free.
Vercel gives you 100K invocations for free.
Supabase gives you 500K edge calls for free.

One person can't do much with those.
But 10,000 people, aggregated — **that's a real infrastructure.**

OasisWaker is the protocol that makes "free tier" additive
instead of fragmented.

---

## SECTION 5 — THE CONCRETE SCENARIOS (who uses this and why)

### Scenario A: The Independent Developer in a Sanctioned Region

> "I want to build an app. But AWS/Azure don't operate in my
>  country. And even if they did, I don't have a credit card
>  that works internationally."

With OasisWaker:
- They use their GitHub OAuth (available globally)
- They contribute their own free-tier quota (even if small)
- They get credits to store their app's data
- Their app works. No credit card. No sanctions wall.

### Scenario B: The Open-Source Project That Needs Reliable Storage

> "Our open-source wiki has 50GB of documentation images.
>  Hosting them on GitHub LFS is expensive. IPFS is unreliable
>  (pinning services go down)."

With OasisWaker:
- The project's contributors each run `oasiswaker contribute`
- The images are stored across all their free-tier accounts
- If the project maintainer goes away, the data is still there
- Cost: $0/month. Reliability: better than any single free host.

### Scenario C: The Privacy-Conscious User

> "I don't want to store my personal files on Google Drive.
>  I don't want to trust ProtonDrive (what if they get raided?).
>  I want to own my infrastructure."

With OasisWaker:
- They run their own node (full control)
- They also store shards on the network (redundancy)
- The encryption key never leaves their device
- Not even OasisBio (the company) can decrypt their files
- True self-sovereign storage, with the network as backup

---

## SECTION 6 — THE NON-GOALS (what OasisWaker is NOT trying to be)

Writing down what we are NOT building is as important as
writing down what we are building. It prevents scope creep.

- ❌ **NOT a blockchain.** No ledger. No consensus mechanism.
  (Distributed hash table ≠ blockchain. Learn the difference.)

- ❌ **NOT a CDN.** CDNs optimize for cacheability of public content.
  OasisWaker optimizes for private, encrypted, persistent storage.
  (Though a CDN layer could be built on top later.)

- ❌ **NOT a competitor to AWS/Azure/GCP for enterprise workloads.**
  Those need SLA guarantees, dedicated support, compliance certs.
  OasisWaker is for workloads that are OK with "best-effort
  decentralized" in exchange for 100× cost reduction.

- ❌ **NOT a "decentralized AWS."** That's too big a scope.
  OasisWaker is a decentralized S3 (object storage).
  Maybe, eventually, a decentralized Lambda (compute).
  But not both at once. Storage first. Compute later.

- ❌ **NOT anonymous.** OAuth login means the network knows
  which GitHub/Google account owns which node.
  (The network does NOT know what data is stored — encryption.)
  This is deliberate: it prevents anonymous abuse while
  preserving data privacy. Trade-off. Accept it.

---

## SECTION 7 — THE TECHNICAL LEAP (what v1.0 → v2.0 actually is)

**v1.0 (what's built):** Star topology.
```
CLI → OasisBio server → edge nodes.
```
OasisBio server is the single point of failure.
(This is fine for proving the concept.)

**v2.0 (the leap):** Mesh topology.
```
CLI ←→ DHT ←→ edge nodes.
```
OasisBio server is just a bootstrap helper.
The network routes around outages.

---

The leap is not incremental. It is architectural.
This is why it feels like a bottleneck — because it IS a bottleneck.

The way through is to build v2.0 in layers:

```
Layer 1:  Replace "OasisBio server" with a DHT.
          (Phase 2 of the plan.)

Layer 2:  Add erasure coding so data survives node churn.
          (Phase 3.)

Layer 3:  Add credit accounting so the network is incentive-compatible.
          (Phase 4.)
```

Each layer is a publishable milestone. Each layer proves the concept
a bit more. Don't try to build all three at once.

---

## SECTION 8 — THE PERSONAL MOTIVATION (why YOU are building this)

*(This section is for you, the developer. Fill it in yourself.)*

Possible reasons this matters:

> "I believe infrastructure should be a commons, not a product."

> "I want to build something that outlasts any single company."

> "I want to understand distributed systems deeply, by building one."

> "The current internet feels increasingly fragile and centralized.
>  I want to be part of building the alternative."

Write your reason. When the bottleneck feels permanent,
read it again.

---

## SECTION 9 — THE FIRST CONCRETE STEP (what to do after reading this)

The vision is overwhelming. The gap between "here" (v1.0 CLI tool)
and "there" (10,000-node P2P network) is large.

The way to close a large gap is not to jump.
It is to build a bridge, one plank at a time.

**The next plank:**

- [ ] **Phase 0 of PLAN.md** — fix the security issues in v1.0
  - Why: you can't ask people to join a network that
        leaks their OAuth tokens via hardcoded secrets.
  - Time: ~ 2 weeks.

- [ ] **After Phase 0: build a 3-node DHT demo on CLI daemons**
  - Why: proves the P2P concept without touching Workers
  - Time: ~ 1 week spike.
  - If it works: proceed to Phase 2.
  - If it doesn't: rethink the architecture before committing.

---

The vision tells you where you're going.
The plan tells you the next step.
The bottleneck is temporary. The direction is correct.

---

*This file is not finished. It is a living document.*
*When the vision becomes clearer (because you built more of it),*
*update this file. When someone asks "what is OasisWaker,"*
*show them this file.*

- **Version:** 1.0
- **Last updated:** 2026-06-04
- **Next review:** after Phase 0 completion
