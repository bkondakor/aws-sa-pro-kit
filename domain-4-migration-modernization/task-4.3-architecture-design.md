---
title: "Task 4.3: Determine a New Architecture for Existing Workloads"
domain: 4
domain_name: "Accelerate Workload Migration and Modernization"
task: 4.3
weight: "20%"
task_weight: "~25% of domain"
exam_topics:
  - architecture-redesign
  - containerization
  - ecs
  - eks
  - fargate
  - serverless
  - microservices
  - event-driven
status: complete
last_updated: "2025-11-18"
---

# Task 4.3: Determine a New Architecture for Existing Workloads

## Overview

Task 4.3 focuses on **redesigning application architectures** as part of migration to leverage cloud-native capabilities. This represents approximately **25% of Domain 4** questions on the exam.

**Key Objectives:**
- Design containerized architectures using ECS, EKS, and Fargate
- Architect serverless solutions with Lambda and Step Functions
- Decompose monoliths into microservices
- Implement event-driven architectures
- Apply API-first design principles
- Choose appropriate architecture patterns for workload characteristics

---

## Containerization Strategies

### Why Containerize?

**Benefits:**
- **Portability:** Run anywhere (on-prem, AWS, multi-cloud)
- **Consistency:** Same environment dev through production
- **Density:** Better resource utilization than VMs
- **Speed:** Fast startup, deployment, scaling
- **Isolation:** Application dependencies contained
- **Microservices-ready:** Natural fit for distributed architectures

**When to Containerize:**
- Microservices architecture desired
- Need consistent environments across stages
- Want infrastructure as code for applications
- Require rapid scaling (seconds vs minutes)
- Multiple versions of same app running simultaneously

### AWS App2Container (A2C)

**IMPORTANT UPDATE (2025):** AWS App2Container is no longer open to new customers as of November 7, 2025. **AWS Transform** is now the recommended alternative for .NET applications.

**What App2Container Did:**
- Automated containerization of Java and .NET apps
- Discovered application dependencies
- Generated Dockerfiles automatically
- Created deployment artifacts (ECS/EKS task definitions)
- No code changes required

**Replacement: AWS Transform**
- Agentic AI service for enterprise modernization
- Focused on .NET applications
- More intelligent dependency analysis
- Enhanced automation capabilities

**Legacy App2Container Process (for exam context):**
1. Install A2C on source server or worker machine
2. Inventory applications: `app2container inventory`
3. Analyze specific app: `app2container analyze --application-id <id>`
4. Generate deployment artifacts: `app2container containerize`
5. Deploy to ECS or EKS: `app2container generate app-deployment`

**Supported Source Environments:**
- Windows: IIS-hosted ASP.NET, .NET Framework
- Linux: Java applications (Tomcat, JBoss)

**Deployment Targets:**
- Amazon ECS with Fargate (Linux and Windows)
- Amazon ECS with EC2
- Amazon EKS with EC2 (Fargate not supported by A2C for EKS)
- AWS App Runner

### Container Platform Selection: ECS vs EKS

| Factor | Amazon ECS | Amazon EKS |
|--------|------------|------------|
| **Ease of Use** | Simpler, AWS-native | More complex, Kubernetes learning curve |
| **Kubernetes Compatibility** | No | Yes, CNCF-certified |
| **Multi-Cloud Portability** | AWS-specific | Kubernetes runs anywhere |
| **Team Skills** | AWS experience sufficient | Requires Kubernetes expertise |
| **Ecosystem** | AWS-focused integrations | Vast Kubernetes ecosystem |
| **Cost** | No control plane charge | $0.10/hour per cluster |
| **Use Case** | AWS-native apps, simpler workloads | Kubernetes requirement, complex orchestration |
| **Service Mesh** | AWS App Mesh | Istio, Linkerd, or App Mesh |
| **Auto Scaling** | AWS Auto Scaling | Kubernetes HPA, Cluster Autoscaler, Karpenter |

**Decision Criteria:**

**Choose ECS when:**
- Team is AWS-focused, limited Kubernetes experience
- Want simpler operations and management
- AWS-native integrations sufficient
- Cost-conscious (no control plane fees)
- Faster time to production desired
- Standard container workloads

**Choose EKS when:**
- Need Kubernetes ecosystem (Helm charts, operators)
- Multi-cloud or hybrid cloud strategy
- Team has Kubernetes expertise
- Complex orchestration requirements
- Third-party tools require Kubernetes
- Portability is strategic requirement

**Exam Tip:** ECS for AWS-native simplicity, EKS for Kubernetes requirement or portability

### Fargate vs EC2 Launch Type

**AWS Fargate** (Serverless containers)

**Characteristics:**
- No server management
- Pay per vCPU and memory per second
- Automatic infrastructure provisioning
- Isolated compute per task
- Simplified operations

**When to Use Fargate:**
- Variable or unpredictable workloads
- Want zero server management
- Small to medium containers (up to 16 vCPU, 120 GB memory)
- Don't need host-level customization
- Security isolation important (dedicated kernel per task)
- Batch jobs, sporadic workloads

**Cost Pattern:** Higher per-resource cost, but pay only for use

**EC2 Launch Type**

**Characteristics:**
- You manage EC2 instances
- More control over infrastructure
- Can use Reserved Instances / Savings Plans
- GPU support available
- Larger instance types (up to 128 vCPU+)
- Host-level visibility and control

**When to Use EC2:**
- Steady-state, predictable workloads (leverage RIs)
- Need GPU, specialized instances
- Require host-level access (monitoring agents, customization)
- Large containers (> 16 vCPU or > 120 GB memory)
- Cost optimization through RIs/Savings Plans
- Windows containers on EKS (Fargate doesn't support)

**Cost Pattern:** Lower per-resource cost if utilizing well, but pay for provisioned capacity

**Mixed Approach:**
- Use Fargate for variable workloads (web tier)
- Use EC2 for steady workloads (background processing)
- Optimize costs with workload-appropriate launch types

**Exam Scenario:**
- **Q:** "Unpredictable traffic, zero server management, small containers"
- **A:** ECS or EKS with Fargate
- **Q:** "Steady 24/7 workload, cost-conscious, large containers"
- **A:** ECS or EKS with EC2 + Reserved Instances

### Containerization Architecture Pattern

**Monolith → Microservices Container Migration:**

**Phase 1: Containerize Monolith**
```
Original: Monolith on VM
↓
Containerized: Monolith in single container
├── Deploy to ECS/EKS
├── Prove container operations
└── Same functionality, containerized
```

**Phase 2: Extract Services (Strangler Fig)**
```
Containerized Monolith
├── Extract Service 1 (e.g., authentication) → Container 1
├── Extract Service 2 (e.g., payments) → Container 2
├── Extract Service 3 (e.g., notifications) → Container 3
└── Remaining monolith (shrinking) → Container 4
```

**Phase 3: Full Microservices**
```
Independent Microservices:
├── Auth Service → Container(s) + ALB
├── User Service → Container(s) + ALB
├── Product Service → Container(s) + ALB
├── Order Service → Container(s) + ALB
└── Communication via API Gateway, EventBridge
```

**Benefits of Phased Approach:**
- Reduced risk (incremental changes)
- Team learns container operations
- Business continuity maintained
- Can stop at any phase if desired

---

## Serverless Refactoring Patterns

### Serverless Benefits

**Operational:**
- Zero server management
- Automatic scaling (zero to thousands)
- Built-in high availability
- Pay only for execution time

**Development:**
- Focus on code, not infrastructure
- Faster deployment cycles
- Natural microservices fit
- Event-driven by design

**Cost:**
- No idle capacity costs
- Sub-second billing
- Free tier generous (1M requests/month)
- Can be cheaper for variable workloads

### AWS Lambda Fundamentals

**Execution Model:**
- Event-driven execution
- Stateless functions
- Maximum timeout: 15 minutes
- Memory: 128 MB to 10 GB
- Ephemeral storage: Up to 10 GB (/tmp)
- Concurrent executions: Account-level quota (default 1000, can increase)

**Invocation Types:**
1. **Synchronous:** Caller waits for response (API Gateway, ALB)
2. **Asynchronous:** Fire-and-forget (S3, SNS, EventBridge)
3. **Polling:** Lambda polls source (SQS, DynamoDB Streams, Kinesis)

**Best Practices for Lambda:**
- **Single Responsibility:** One function, one purpose
- **Idempotency:** Design for retries (failures cause automatic retries)
- **Warm Start Optimization:** Initialize outside handler (DB connections, SDK clients)
- **Environment Variables:** Configuration outside code
- **Dead Letter Queue:** Capture failed invocations
- **Observability:** CloudWatch Logs, X-Ray for tracing

### Serverless Architecture Patterns

**Pattern 1: API-Driven Applications**

**Architecture:**
```
Client (Web, Mobile)
    ↓
Amazon API Gateway (REST or HTTP API)
    ↓ (Invokes)
AWS Lambda Functions
    ↓ (Access)
DynamoDB / RDS / Other AWS Services
```

**Use Cases:**
- RESTful APIs
- Mobile backends
- Webhooks
- GraphQL APIs (with AppSync)

**Benefits:**
- Auto-scaling to any load
- Pay per request
- Global edge optimization (API Gateway edge-optimized)

**Migration from Traditional:**
```
Before: EC2 running Express/Django/Spring Boot
After: Lambda functions per API endpoint + API Gateway
```

**Pattern 2: Event-Driven Processing**

**Architecture:**
```
Event Source (S3, DynamoDB, SNS, EventBridge, SQS)
    ↓ (Triggers)
Lambda Function
    ↓ (Processes and optionally emits events)
Downstream Services or Storage
```

**Use Cases:**
- File processing (S3 upload → Lambda → process)
- Stream processing (Kinesis → Lambda → analytics)
- Database triggers (DynamoDB Streams → Lambda → update search index)
- IoT data processing (IoT Core → Lambda → store/analyze)

**Benefits:**
- Real-time processing
- No polling overhead
- Automatic parallelization (many events = many Lambda invocations)

**Migration from Traditional:**
```
Before: Cron job on EC2 polling S3 every 5 minutes
After: S3 event triggers Lambda immediately on upload (real-time, cheaper)
```

**Pattern 3: Scheduled Automation**

**Architecture:**
```
Amazon EventBridge Scheduler
    ↓ (Cron expression or rate)
Lambda Function
    ↓ (Performs task)
AWS Services (backups, reports, cleanup)
```

**Use Cases:**
- Scheduled reports
- Database backups
- Data cleanup/archival
- Batch processing

**Benefits:**
- No servers running 24/7 for periodic tasks
- Pay only during execution
- Managed scheduling (no cron server needed)

**Migration from Traditional:**
```
Before: Cron jobs on always-running EC2 instance
After: EventBridge schedule → Lambda (pay only for execution seconds)
```

**Pattern 4: Asynchronous Workflows**

**Architecture:**
```
Client Request
    ↓
API Gateway → Lambda (initiates workflow)
    ↓ (Publishes message)
Amazon SQS or SNS
    ↓ (Triggers)
Lambda Function(s) (background processing)
    ↓ (Update status)
Database (DynamoDB for status tracking)
```

**Use Cases:**
- Video transcoding (long-running)
- Report generation
- Email sending (bulk)
- Image processing pipelines

**Benefits:**
- Decoupled architecture
- Handles failures gracefully (SQS retries)
- Scales independently (queue absorbs spikes)

**Migration from Traditional:**
```
Before: Synchronous request-response (user waits for processing)
After: Return job ID immediately, process asynchronously, notify on completion
```

**Pattern 5: Orchestrated Workflows (Step Functions)**

**Architecture:**
```
Trigger (API Gateway, EventBridge, Manual)
    ↓
AWS Step Functions State Machine
    ├── Lambda Function 1 (Validate)
    ├── Lambda Function 2 (Process)
    ├── Lambda Function 3 (Notify)
    ├── Error Handling (Retry, Catch)
    └── Parallel Execution (where applicable)
```

**Use Cases:**
- Multi-step business processes (order fulfillment)
- Complex error handling and retries
- Human approval workflows
- ETL pipelines
- Saga pattern (distributed transactions)

**Benefits:**
- Visual workflow designer
- Built-in error handling, retries
- State persistence
- Coordination of multiple services

**Step Functions Types:**
- **Standard:** Up to 1 year execution, exactly-once, audit trail
- **Express:** Up to 5 minutes, high-volume (100K+ TPS), at-least-once

**Migration from Traditional:**
```
Before: Monolithic batch job with complex logic
After: Step Functions orchestrating focused Lambda functions
```

### Lambda Anti-Patterns (2025 Best Practices)

**❌ Monolithic Lambda Functions**
- Problem: Single Lambda does too many things
- Issue: Hard to maintain, test, scale independently
- Solution: Decompose into micro-lambdas (one per API endpoint or task)

**❌ Using EventBridge Rules for Schedules**
- Problem: Legacy approach
- Issue: EventBridge Scheduler is better for scheduled tasks
- Solution: Use EventBridge Scheduler (supports one-time, cron, flexible windows)

**❌ Synchronous Chains**
- Problem: Lambda 1 → Lambda 2 → Lambda 3 (synchronous)
- Issue: Timeout accumulation, tight coupling
- Solution: Use Step Functions or asynchronous messaging (SQS, SNS, EventBridge)

**❌ Storing State in /tmp**
- Problem: Assuming /tmp persists across invocations
- Issue: Lambda containers reused but not guaranteed
- Solution: Use DynamoDB, ElastiCache, or S3 for state

**❌ Not Handling Cold Starts**
- Problem: First invocation slow (10s+) for large functions
- Issue: Poor user experience for latency-sensitive apps
- Solution: Provisioned Concurrency, optimize package size, warm-up strategies

### Serverless Database Patterns

**Traditional Monolith:**
```
Application Server ← → Relational Database (many connections)
```

**Serverless Challenge:**
- Lambda scales to 1000s of concurrent executions
- Each creates database connection
- Traditional databases (MySQL, PostgreSQL) have connection limits (100-500)
- Result: Connection pool exhaustion

**Solutions:**

**Solution 1: RDS Proxy**
```
Lambda Functions (1000s)
    ↓ (Connection pooling)
Amazon RDS Proxy (manages connections)
    ↓ (Efficient reuse)
Amazon RDS/Aurora (limited connections, but proxy manages)
```

**Benefits:**
- Connection pooling and reuse
- IAM authentication support
- Failover handling
- Reduced database connection overhead

**Solution 2: Aurora Serverless v2**
```
Lambda Functions
    ↓
Aurora Serverless v2 (auto-scales capacity)
```

**Benefits:**
- Scales capacity automatically (0.5 ACU to 128 ACUs)
- Instant scaling (seconds)
- Pay for actual usage
- Compatible with RDS Proxy

**Solution 3: DynamoDB (NoSQL)**
```
Lambda Functions
    ↓ (HTTP API, no connections)
Amazon DynamoDB (auto-scales, unlimited concurrent requests)
```

**Benefits:**
- Unlimited concurrent reads/writes
- No connection management
- Millisecond latency
- Auto-scaling built-in
- Best fit for serverless

**Exam Tip:**
- Serverless + SQL database → Use RDS Proxy or Aurora Serverless
- Serverless + NoSQL database → DynamoDB is natural fit

---

## Microservices Decomposition

### Monolith vs Microservices

**Monolithic Architecture:**
- Single codebase, single deployment
- All features in one application
- Shared database
- Scales as one unit

**Microservices Architecture:**
- Multiple independent services
- Each service owns its data
- Communicate via APIs/events
- Scale independently

### When to Decompose to Microservices

**Good Candidates:**
- Large monolith with scaling issues
- Frequent deployments needed
- Multiple teams working on same codebase (contention)
- Different scaling requirements per feature
- Want to use different tech stacks per service

**Poor Candidates:**
- Small applications (< 10 KLOC)
- Stable, infrequently changing apps
- Single small team
- No clear service boundaries
- Distributed systems skills lacking

**Exam Tip:** Don't microservice everything; consider operational overhead

### Decomposition Strategies

**Strategy 1: Domain-Driven Design (DDD)**

Identify bounded contexts (distinct business capabilities):

**Example E-Commerce:**
```
Monolith
    ├── User Management → User Service
    ├── Product Catalog → Product Service
    ├── Shopping Cart → Cart Service
    ├── Order Processing → Order Service
    ├── Payment → Payment Service
    ├── Shipping → Shipping Service
    └── Notifications → Notification Service
```

**Each service:**
- Owns its database/data
- Has clear business responsibility
- Independent deployment
- Can scale independently

**Strategy 2: Strangler Fig Pattern**

Gradually replace monolith pieces without full rewrite:

**Phase 1: Proxy Layer**
```
API Gateway or ALB
    ├── Route /users/* → New User Service (microservice)
    └── Route /* → Legacy Monolith
```

**Phase 2: Extract More Services**
```
API Gateway
    ├── Route /users/* → User Service
    ├── Route /products/* → Product Service
    └── Route /* → Legacy Monolith (shrinking)
```

**Phase 3: Complete**
```
API Gateway
    ├── Route /users/* → User Service
    ├── Route /products/* → Product Service
    ├── Route /orders/* → Order Service
    └── Monolith retired
```

**Benefits:**
- Incremental, low-risk
- Business continuity maintained
- Can pause at any point
- Teams learn microservices gradually

**Strategy 3: Database Decomposition**

**Shared Database (Anti-pattern in microservices):**
```
User Service ↘
                Shared DB
Order Service ↗
```

**Problem:** Services tightly coupled via database

**Proper Pattern: Database per Service**
```
User Service → User DB
Order Service → Order DB (denormalizes user data if needed)
```

**Communication:**
- Synchronous: REST API, gRPC
- Asynchronous: Events (EventBridge, SNS, SQS)

**Data Consistency:**
- **Saga Pattern:** Distributed transactions via events
- **Event Sourcing:** Store events, rebuild state
- **CQRS:** Separate read and write models

### Microservices Communication Patterns

**Pattern 1: Synchronous (Request-Response)**

**REST APIs:**
```
Service A → (HTTP GET/POST) → Service B
```

**Tools:** API Gateway, ALB, App Mesh

**When to Use:**
- Need immediate response
- Strong consistency required
- Simple request-reply patterns

**Tradeoffs:**
- Tight coupling (if Service B down, Service A affected)
- Latency accumulation (chain of calls)

**Pattern 2: Asynchronous (Event-Driven)**

**Pub/Sub:**
```
Service A → (Publish event) → SNS Topic → (Subscribe) → Service B, C, D
```

**Event Bus:**
```
Service A → (Emit event) → EventBridge → (Rules) → Service B (specific event type)
```

**Message Queue:**
```
Service A → (Send message) → SQS Queue → (Poll) → Service B
```

**When to Use:**
- Don't need immediate response
- Want decoupling
- Fan-out pattern (one event, many consumers)
- Eventual consistency acceptable

**Benefits:**
- Loose coupling
- Services can be down temporarily (messages queued)
- Natural scaling (queue absorbs spikes)

**Exam Scenario:**
- **Q:** "Service needs to notify multiple other services when event occurs"
- **A:** Publish event to SNS or EventBridge (fan-out pattern)

---

## Event-Driven Architecture Patterns

### Event-Driven Benefits

- **Decoupling:** Services don't need to know about each other
- **Scalability:** Each service scales independently based on events
- **Resilience:** Failures don't cascade (queues buffer)
- **Flexibility:** Easy to add new event consumers

### AWS Event Services Comparison

| Service | Pattern | Use Case | Message Delivery |
|---------|---------|----------|------------------|
| **SNS** | Pub/Sub | Fan-out to multiple subscribers | Push (HTTP, email, Lambda, SQS) |
| **SQS** | Queue | Decouple producers/consumers | Poll (application pulls) |
| **EventBridge** | Event Bus | Complex event routing, filtering | Push (14+ AWS service targets) |
| **Kinesis** | Stream | Real-time data streaming, ordering | Poll (Shard-based ordering) |

**Decision Tree:**

**Simple Pub/Sub (1 → many):**
- Use SNS

**Queue with retries (1 → 1, asynchronous):**
- Use SQS

**Complex routing, third-party SaaS integrations:**
- Use EventBridge

**Ordered stream, real-time analytics:**
- Use Kinesis

### EventBridge Patterns

**Pattern 1: Service-to-Service Decoupling**

```
Order Service
    ↓ (Emits "OrderPlaced" event)
EventBridge Event Bus (default or custom)
    ↓ (Rules match event pattern)
    ├→ Inventory Service (decrease stock)
    ├→ Notification Service (email customer)
    ├→ Analytics Service (update reports)
    └→ Shipping Service (prepare shipment)
```

**Benefits:**
- Order Service doesn't know about downstream services
- Easy to add new services (just add rule)
- Each service scales independently

**Pattern 2: SaaS Integration**

```
Shopify (SaaS)
    ↓ (Webhook to EventBridge)
EventBridge (partner event source)
    ↓ (Rules)
Lambda Function (process new order)
```

**Supported Partners:** Shopify, Zendesk, Auth0, Datadog, MongoDB, PagerDuty, etc.

**Pattern 3: Scheduled Events (2025 Best Practice)**

**Use EventBridge Scheduler (not rules):**
```
EventBridge Scheduler
    ├→ One-time schedule (specific date/time)
    ├→ Recurring (cron: 0 9 * * ? *)
    ├→ Rate-based (every 5 minutes)
    └→ Flexible time windows (start within 1-hour window)
```

**Benefits over EventBridge Rules:**
- Supports one-time schedules
- Flexible time windows
- Better for complex scheduling
- Can target 270+ services

### SQS for Resilient Architectures

**Pattern: Queue-Based Load Leveling**

```
Client (variable load, 1000 req/sec spike)
    ↓
API Gateway → Lambda (writes to SQS)
    ↓
SQS Queue (buffers messages)
    ↓ (Controlled polling)
Lambda or ECS (processes at sustainable rate, 100 req/sec)
```

**Benefits:**
- Queue absorbs traffic spikes
- Backend processes at consistent rate
- No overwhelm backend
- Messages retained if processing temporarily fails

**SQS Features:**
- **Visibility Timeout:** Message hidden while processing (prevents duplicate processing)
- **Dead Letter Queue:** Failed messages move to DLQ for troubleshooting
- **Long Polling:** Efficient polling (reduces API calls, cost)
- **FIFO Queue:** Guaranteed ordering, exactly-once delivery (when needed)

**Exam Scenario:**
- **Q:** "Unpredictable spike in requests, need to protect backend database"
- **A:** API Gateway → SQS → Lambda/ECS polling SQS (queue buffers)

---

## API-First Design

### What is API-First?

**Philosophy:** Design APIs before implementation.

**Benefits:**
- Clear contracts between services
- Parallel development (teams work independently)
- Better documentation
- Easier testing
- Future-proof (internal implementation can change without breaking API)

### Amazon API Gateway

**Types:**

**1. REST API**
- Full-featured API management
- API keys, usage plans, throttling
- Request/response transformation
- Caching available
- More expensive

**2. HTTP API**
- Lighter-weight, cheaper (70% less cost)
- Faster performance (lower latency)
- OIDC and OAuth 2.0 support
- No caching, fewer features
- Modern choice for most use cases

**3. WebSocket API**
- Persistent connections
- Real-time bidirectional communication
- Chat applications, live updates

**Exam Tip:** HTTP API for modern RESTful APIs (cheaper, faster), REST API if need caching/transformations

### API Gateway Integration Types

**Lambda Integration:**
```
Client → API Gateway → Lambda → DynamoDB/other services
```

**HTTP Integration:**
```
Client → API Gateway → HTTP endpoint (backend service, third-party API)
```

**AWS Service Integration:**
```
Client → API Gateway → DynamoDB (direct, no Lambda)
```

**Benefits:** Lower cost, lower latency (no Lambda)
**Tradeoff:** Limited business logic (simple CRUD only)

### API Versioning Strategies

**Strategy 1: Path-Based**
```
/v1/users
/v2/users
```

**Strategy 2: Header-Based**
```
GET /users
Header: Accept: application/vnd.api.v1+json
```

**Strategy 3: Separate API Gateway Stages**
```
API Gateway Stage "v1" → Lambda v1
API Gateway Stage "v2" → Lambda v2
```

**Best Practice:** Path-based for simplicity, separate stages for isolated deployments

---

## Architecture Decision Examples

### Example 1: Modernize E-Commerce Monolith

**Current State:**
- PHP monolith on EC2 Auto Scaling Group
- MySQL on RDS
- Redis for sessions
- 100K users, variable traffic (10x on sales)

**Target Architecture:**
```
CloudFront (CDN)
    ↓
S3 (Static assets: HTML, CSS, JS)
    ↓
API Gateway (HTTP API)
    ├→ Lambda (User Service)
    ├→ Lambda (Product Service)
    ├→ Lambda (Cart Service)
    ├→ Lambda (Order Service)
    └→ Lambda (Payment Service)

Databases:
├→ DynamoDB (Products, Carts - high read volume)
├→ Aurora Serverless v2 (Orders - transactional)
└→ ElastiCache (Session cache)

Async Processing:
├→ EventBridge (Order events)
└→ SQS + Lambda (Email notifications, inventory updates)
```

**Benefits:**
- Auto-scales to any traffic (serverless)
- Pay only for use (cost-effective for variable load)
- Independent service deployments
- Global edge caching (CloudFront)

### Example 2: Batch Processing Modernization

**Current State:**
- Cron job on EC2 (running 24/7)
- Processes files from S3 once per hour
- 5-minute processing time
- EC2 idle 95% of time

**Target Architecture:**
```
S3 Bucket
    ↓ (S3 event on upload)
Lambda or Fargate (triggered by event)
    ↓ (Process file)
DynamoDB or S3 (results)
```

**Benefits:**
- Zero idle cost (pay only during processing)
- Real-time processing (not hourly)
- Automatic parallelization (multiple files = multiple invocations)
- Estimated savings: 95%+ (idle time eliminated)

### Example 3: Containerize Legacy Java App

**Current State:**
- Java Spring Boot on Tomcat
- Deployed on EC2
- Manual deployments, slow updates

**Target Architecture:**
```
Application Load Balancer
    ↓
ECS with Fargate (Auto Scaling)
    ├→ Container 1: Spring Boot app
    ├→ Container 2: Spring Boot app (auto-scaled)
    └→ Container N
    ↓
RDS (existing database, minimal changes)
```

**Migration Path:**
1. Containerize with Dockerfile (or AWS Transform for automated)
2. Push image to ECR
3. Create ECS task definition
4. Deploy to Fargate
5. Configure ALB
6. Shift traffic from EC2 to ECS
7. Decommission EC2

**Benefits:**
- No server management (Fargate)
- Easy rollbacks (versioned containers)
- CI/CD friendly (automated deployments)
- Scales based on traffic

---

## Summary: Architecture Pattern Selection

### Quick Decision Guide

| Scenario | Architecture Choice |
|----------|-------------------|
| Variable traffic, low operational overhead | **Serverless** (Lambda + API Gateway) |
| Need Kubernetes, multi-cloud | **EKS** |
| AWS-native containers, simpler | **ECS** |
| Steady workload, cost optimization | **ECS with EC2** + Reserved Instances |
| Unpredictable containers | **ECS/EKS with Fargate** |
| Multiple independent services | **Microservices** (containers or serverless) |
| Complex workflows, multiple steps | **Step Functions** orchestrating Lambdas |
| Event-driven processing | **Lambda** + EventBridge/SNS/SQS |
| Real-time stream processing | **Lambda** + Kinesis |
| API-centric application | **API Gateway** + Lambda or containers |
| Legacy app, fast containerization | **AWS Transform** (.NET) or manual Dockerfile |

### Key Exam Patterns

**Pattern Recognition:**
- "Minimize operational overhead" → **Serverless or Fargate**
- "Kubernetes required" → **EKS**
- "Optimize costs, steady workload" → **EC2 with RIs**, not Fargate
- "Decouple services" → **EventBridge, SNS, or SQS**
- "Complex multi-step process" → **Step Functions**
- "Modernize monolith" → **Strangler Fig** pattern
- "Fan-out to multiple services" → **SNS or EventBridge**
- "Buffer traffic spikes" → **SQS queue**
- "Real-time, ordered processing" → **Kinesis**

### Common Mistakes to Avoid

❌ **Over-complicating:** Don't microservice a small app
❌ **Wrong serverless fit:** Don't use Lambda for long-running tasks (> 15 min)
❌ **Ignoring costs:** Fargate more expensive than EC2 for steady workloads
❌ **Tight coupling:** Microservices calling each other synchronously (use events)
❌ **No retry logic:** Serverless functions should handle retries and idempotency
❌ **Monolithic Lambda:** One Lambda doing too much (decompose)
❌ **Ignoring cold starts:** Latency-sensitive apps need Provisioned Concurrency or alternative

---

*Last Updated: 2025-11-17*
*Always verify current AWS service capabilities and best practices*
