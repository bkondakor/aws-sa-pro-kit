# AWS Compute Services Comparison: EC2 vs Lambda vs Fargate

## Overview

This guide compares the three primary AWS compute services for the Solutions Architect Professional exam. Understanding when to choose each service is critical for making optimal architectural decisions on the exam.

## Services Covered

### Amazon EC2 (Elastic Compute Cloud)
**What it is:** Virtual servers in the cloud with full control over the computing environment.

**Key Characteristics:**
- Full control over operating system, runtime, and configuration
- Multiple instance types optimized for different workloads
- Supports persistent storage with EBS volumes
- Can run any application or workload
- Charged per second (minimum 60 seconds) when running
- Supports Reserved Instances and Savings Plans for cost optimization

**When to Use:**
- Legacy applications that can't be containerized or refactored
- Applications requiring specific OS configurations or kernel access
- Workloads needing GPU, high-performance computing, or specialized hardware
- Long-running, persistent applications (24/7 workloads)
- Applications requiring full control over the runtime environment
- Lift-and-shift migrations

---

### AWS Lambda
**What it is:** Serverless compute service that runs code in response to events without managing servers.

**Key Characteristics:**
- Completely serverless - no infrastructure management
- Automatic scaling from zero to thousands of concurrent executions
- Pay only for compute time consumed (charged per 100ms)
- Maximum execution time: 15 minutes
- Supports multiple runtimes (Python, Node.js, Java, Go, .NET, Ruby, custom)
- Event-driven architecture
- Cold start latency for infrequently used functions

**When to Use:**
- Event-driven workloads (S3 uploads, DynamoDB changes, API requests)
- Microservices and API backends
- Short-duration tasks (< 15 minutes)
- Unpredictable or highly variable traffic patterns
- Cost optimization for sporadic workloads
- Real-time file/stream processing
- Scheduled tasks via EventBridge

---

### AWS Fargate
**What it is:** Serverless compute engine for containers that works with ECS and EKS.

**Key Characteristics:**
- Serverless container execution - no EC2 instance management
- Works with both Amazon ECS and Amazon EKS
- Pay for vCPU and memory resources used
- No time limits on task execution
- Right-sized resource allocation per task
- Integrates with VPC networking for security
- Supports both Linux and Windows containers

**When to Use:**
- Containerized applications without infrastructure management
- Microservices architectures
- Batch processing jobs with containers
- Applications needing more than 15 minutes execution time
- Workloads with predictable resource requirements
- When you want container benefits without managing cluster infrastructure
- CI/CD pipelines and build environments

---

## Detailed Comparison Table

| Feature | EC2 | Lambda | Fargate |
|---------|-----|--------|---------|
| **Infrastructure Management** | Full control, you manage OS and runtime | Fully managed, no servers | Managed container orchestration, no EC2 management |
| **Scaling** | Manual or Auto Scaling (minutes) | Automatic (milliseconds) | Automatic via ECS/EKS |
| **Pricing Model** | Per second (min 60s) when running | Per 100ms of execution + requests | Per second of vCPU/memory used |
| **Execution Time Limit** | No limit | 15 minutes max | No limit |
| **Startup Time** | Minutes (instance launch) | Milliseconds to seconds (cold start) | Seconds to minutes (container start) |
| **State Management** | Persistent (stateful) | Stateless (ephemeral) | Can be stateful or stateless |
| **Use Case** | Traditional apps, 24/7 workloads | Event-driven, short tasks | Containerized apps, batch jobs |
| **Memory Limit** | Up to 24 TiB (u-24tb1.metal) | Up to 10 GB | Up to 120 GB |
| **Storage** | EBS, instance store, EFS | /tmp (10 GB max), EFS | EBS (via ECS/EKS), EFS |
| **Network** | Full VPC control, public/private | VPC Lambda, public endpoint | Full VPC integration |
| **Cold Start** | Instance launch time | Yes (100ms-5s depending on runtime) | Container start time |
| **Best for Traffic Pattern** | Steady, predictable load | Sporadic, unpredictable | Variable but containerized |
| **Concurrency** | Instance capacity | Up to 1000 concurrent (default, adjustable) | Cluster capacity |
| **Deployment** | AMIs, user data scripts | ZIP file, container image | Container images |
| **Integration** | Any AWS service | 200+ event sources, API Gateway | ECS/EKS, ALB, NLB |
| **Monitoring** | CloudWatch + detailed monitoring | CloudWatch Logs, X-Ray | CloudWatch Container Insights |

---

## Decision Tree: When to Choose Each Service

### Choose EC2 When:
```
✓ You need full OS-level control
✓ Application requires specific kernel modules or drivers
✓ Legacy application can't be containerized
✓ Workload runs 24/7 with predictable load
✓ Application needs GPU or specialized hardware
✓ Lift-and-shift migration scenario
✓ Licensing requires specific CPU/core counts
✓ Need maximum performance (no cold starts)
✓ Application maintains local state
✓ Long-running batch jobs with no time limit
```

### Choose Lambda When:
```
✓ Event-driven architecture (S3, DynamoDB, SNS, SQS, etc.)
✓ Short-duration tasks (< 15 minutes)
✓ Unpredictable or sporadic traffic
✓ Want to minimize operational overhead
✓ Need automatic scaling from zero
✓ Cost optimization for low-usage scenarios
✓ Microservices with API Gateway
✓ Real-time file/stream processing
✓ Scheduled cron jobs
✓ Stateless application logic
```

### Choose Fargate When:
```
✓ Containerized applications
✓ Want container benefits without managing EC2
✓ Microservices architecture
✓ Batch processing (longer than 15 minutes)
✓ Need consistent runtime environment
✓ Variable workload but predictable per-task resources
✓ CI/CD build environments
✓ Want ECS/EKS without cluster management
✓ Modern cloud-native applications
✓ Need more resources than Lambda offers
```

---

## Common Exam Scenarios with Explanations

### Scenario 1: Real-time Image Processing
**Question Pattern:** "A company needs to resize images uploaded to S3. Users upload 10-100 images per day. What's the most cost-effective solution?"

**Answer: Lambda**

**Why:**
- Event-driven (S3 upload trigger)
- Sporadic workload (10-100/day)
- Short task duration (seconds)
- Pay only when images are uploaded
- Automatic scaling

⚠️ **EXAM TIP:** Keywords like "event-driven," "S3 upload," and "sporadic" point to Lambda. EC2 would cost more running 24/7 for occasional processing.

---

### Scenario 2: Monolithic E-commerce Application
**Question Pattern:** "A company wants to migrate an existing e-commerce platform to AWS. The application runs on Linux servers, requires 16 GB RAM, uses local session storage, and runs 24/7."

**Answer: EC2**

**Why:**
- Monolithic application (not containerized)
- Requires persistent state (session storage)
- Runs continuously (24/7)
- Specific resource requirements
- Traditional architecture

⚠️ **EXAM TIP:** Keywords like "existing application," "monolithic," "local storage," and "24/7" indicate EC2. Lambda is stateless and has time limits.

---

### Scenario 3: Microservices-based Application
**Question Pattern:** "A company is building a microservices architecture using Docker containers. They want to minimize operational overhead and don't want to manage cluster infrastructure. The services handle variable but consistent traffic."

**Answer: Fargate**

**Why:**
- Containerized (Docker)
- No infrastructure management desired
- Microservices architecture
- Variable but consistent workload
- Longer-running services

⚠️ **EXAM TIP:** Keywords "Docker," "microservices," "minimize operational overhead," and "no cluster management" point to Fargate over EC2 with ECS.

---

### Scenario 4: Video Transcoding Pipeline
**Question Pattern:** "A media company needs to transcode videos uploaded to S3. Videos range from 1-60 minutes in length. Processing takes 10-120 minutes per video. What compute service should be used?"

**Answer: Fargate (or EC2 for very long jobs)**

**Why:**
- Processing exceeds Lambda's 15-minute limit
- Event-driven trigger (S3 upload)
- Variable processing time
- Batch processing workload
- Can use containers for transcoding tools

**Alternative Consideration:** EC2 with Batch for very long jobs or when GPU acceleration is needed.

⚠️ **EXAM TIP:** Time limits are critical! Lambda max = 15 minutes. Anything longer needs Fargate, EC2, or Batch.

---

### Scenario 5: API Backend with Unpredictable Traffic
**Question Pattern:** "A startup is building a REST API that may receive anywhere from 0-10,000 requests per day. The API performs database lookups and returns JSON responses in under 3 seconds. What's the most cost-effective solution?"

**Answer: Lambda with API Gateway**

**Why:**
- Unpredictable traffic (0-10,000)
- Short execution time (< 3 seconds)
- Stateless API logic
- Pay per request model
- Automatic scaling
- No cost when idle

⚠️ **EXAM TIP:** "Unpredictable traffic" with "short duration" and "cost-effective" = Lambda. EC2 charges even with zero traffic.

---

### Scenario 6: Long-running Data Processing
**Question Pattern:** "A research company runs genome sequencing jobs that take 2-48 hours to complete. Jobs are submitted 5-10 times per week. The application is containerized and requires 32 vCPUs and 64 GB RAM."

**Answer: Fargate or EC2 with AWS Batch**

**Why:**
- Very long execution time (hours)
- Containerized workload
- Sporadic schedule (5-10/week)
- High resource requirements
- Batch processing pattern

**Best Solution:** AWS Batch with Fargate or EC2 compute environment

⚠️ **EXAM TIP:** Long-running + containerized + batch = AWS Batch with Fargate. Lambda is excluded due to time limit.

---

### Scenario 7: High-Performance Computing (HPC)
**Question Pattern:** "A financial services company needs to run complex simulations requiring GPU acceleration, low-latency networking, and completion within 30 minutes. Simulations run every hour during business hours."

**Answer: EC2 (GPU instances with Cluster Placement Groups)**

**Why:**
- GPU acceleration required
- Low-latency networking (Elastic Fabric Adapter)
- Specialized hardware needs
- High-performance requirements
- Regular schedule but not 24/7

**Instance Types:** P4, P3, G5 instances with placement groups

⚠️ **EXAM TIP:** "GPU," "specialized hardware," or "HPC" = EC2. Lambda and Fargate don't support GPU (though Lambda can use Inf1 for inference).

---

### Scenario 8: Serverless Data Pipeline
**Question Pattern:** "A company wants to process IoT sensor data. Sensors send data every 5 minutes to Kinesis. Processing takes 30-45 seconds per batch. The pipeline should automatically scale and minimize costs."

**Answer: Lambda (with Kinesis trigger)**

**Why:**
- Event-driven (Kinesis stream)
- Short processing time (< 1 minute)
- Automatic scaling required
- Serverless architecture
- Pay per execution

⚠️ **EXAM TIP:** "IoT," "stream processing," "automatic scale," and processing time < 15 min = Lambda with Kinesis.

---

### Scenario 9: Machine Learning Inference
**Question Pattern:** "A company has a trained ML model that needs to provide predictions via API. Traffic is variable (100-1000 requests/hour). Inference takes 200-500ms. What's the best deployment option?"

**Answer: Lambda (for variable traffic) or Fargate (for consistent traffic)**

**Why Lambda:**
- Variable traffic pattern
- Fast inference time (< 1 second)
- Cost-effective for variable load
- Serverless scaling

**Why Fargate (alternative):**
- If using model server (TensorFlow Serving, TorchServe)
- Larger model sizes
- More consistent traffic
- Lower cold start latency

⚠️ **EXAM TIP:** For ML inference, consider traffic pattern and latency requirements. Variable = Lambda, Consistent with low latency = Fargate/EC2.

---

### Scenario 10: Scheduled Maintenance Tasks
**Question Pattern:** "A company needs to run database maintenance scripts every night at 2 AM. Tasks take 5-10 minutes to complete and run Monday-Friday only."

**Answer: Lambda with EventBridge (CloudWatch Events)**

**Why:**
- Scheduled task (cron pattern)
- Short duration (< 15 minutes)
- Runs infrequently (5 days/week)
- No need for persistent infrastructure
- Cost-effective

⚠️ **EXAM TIP:** "Scheduled," "short duration," "infrequent" = Lambda with EventBridge. No need to pay for EC2 running 24/7.

---

## Key Differences Summary

### Cost Optimization Perspective

**Lambda is cheapest when:**
- Traffic is sporadic or unpredictable
- Execution time is short
- Application can scale to zero
- Example: Processing 100 requests/day vs running EC2 24/7

**EC2 is cheapest when:**
- Workload runs 24/7 (use Reserved Instances or Savings Plans)
- Steady, predictable load
- Can consolidate multiple workloads on single instance
- Example: Constant traffic requiring 2 vCPUs continuously

**Fargate is cheapest when:**
- Workload doesn't run 24/7 but needs containers
- Variable traffic patterns with containers
- Want to avoid EC2 management overhead
- Example: Batch jobs running 8 hours/day

⚠️ **EXAM TIP:** Cost questions require understanding usage patterns. Sporadic = Lambda, Steady 24/7 = EC2 RI, Variable containerized = Fargate.

---

### Scaling Characteristics

| Service | Scale Out Time | Scale In | Max Concurrency | Scaling Trigger |
|---------|---------------|----------|-----------------|-----------------|
| **EC2** | Minutes (instance launch) | Manual or Auto Scaling | Instance limit | CloudWatch metrics |
| **Lambda** | Milliseconds | Automatic to zero | 1000 (default, configurable) | Event-driven |
| **Fargate** | Seconds to minutes | Automatic via ECS/EKS | Task definition limit | Service metrics |

⚠️ **EXAM TIP:** Fastest scaling = Lambda. Ability to scale to zero = Lambda and Fargate (via service count).

---

### State and Persistence

**EC2:**
- ✓ Stateful by default
- ✓ Persistent EBS storage
- ✓ Instance store for ephemeral data
- ✓ Local databases, caching

**Lambda:**
- ✗ Stateless by design
- ✓ /tmp storage (10 GB, ephemeral)
- ✓ EFS mounting for persistent files
- ✗ No persistent local storage

**Fargate:**
- ± Depends on design
- ✓ Ephemeral task storage (20 GB default)
- ✓ EFS integration for persistence
- ✓ Can use external databases

⚠️ **EXAM TIP:** If the scenario mentions "stateful," "session storage," or "local files," lean toward EC2 or Fargate with EFS. Lambda is stateless.

---

### Integration and Event Sources

**EC2:**
- Can integrate with any AWS service via SDK/API
- Requires application-level integration
- Pull-based model for most services

**Lambda:**
- 200+ native event sources
- Push-based model (S3, SNS, SQS, DynamoDB, Kinesis, etc.)
- Synchronous (API Gateway, ALB) and asynchronous invocation
- Event-driven by design

**Fargate:**
- Integrates via ECS/EKS services
- Load balancer integration (ALB, NLB)
- Service discovery via Cloud Map
- Event-driven via EventBridge (for ECS tasks)

⚠️ **EXAM TIP:** If the scenario emphasizes "event-driven" with specific event sources (S3, DynamoDB, etc.), Lambda is usually the answer.

---

### Security and Compliance

**EC2:**
- Security Groups (instance-level firewall)
- IAM instance profiles
- NACLs (subnet-level)
- Full OS-level security control
- Dedicated Hosts for compliance
- Instance Metadata Service (IMDSv2)

**Lambda:**
- IAM execution roles
- Resource-based policies
- VPC integration for private resources
- No OS access (reduced attack surface)
- Function-level isolation
- Supports PrivateLink for VPC endpoints

**Fargate:**
- Task-level IAM roles
- Security Groups at task level
- VPC integration (awsvpc network mode)
- No EC2 instance access
- Container isolation
- Secrets Manager / Systems Manager integration

⚠️ **EXAM TIP:** For compliance requiring dedicated hardware = EC2 Dedicated Hosts. For reducing attack surface with serverless = Lambda or Fargate.

---

### Networking Considerations

**EC2:**
- Multiple ENIs possible
- Elastic IPs for static public IPs
- Placement Groups for low latency
- Enhanced networking (up to 100 Gbps)
- Full control over network configuration

**Lambda:**
- VPC Lambda for private resource access
- No public IP by default (use NAT for internet)
- Can invoke from VPC or public endpoint
- PrivateLink support
- Fixed network performance

**Fargate:**
- Each task gets its own ENI (awsvpc mode)
- Task-level security groups
- VPC integration required
- Supports IPv4 and IPv6
- Can assign public IPs to tasks

⚠️ **EXAM TIP:** If scenario requires "static IP" or "multiple network interfaces," EC2 is the answer. Lambda doesn't support static public IPs directly.

---

## Common Misconceptions

### Misconception 1: "Lambda is always cheaper"
**Reality:** Lambda is cheaper for sporadic workloads. For constant 24/7 workloads, EC2 Reserved Instances or Savings Plans are often more cost-effective.

**Example:**
- Lambda running continuously: $44.21/month (1 vCPU, 1792 MB)
- EC2 t3.small Reserved (1 year): $11.12/month

⚠️ **EXAM TIP:** Always consider usage pattern for cost comparisons. Constant = EC2 RI, Sporadic = Lambda.

---

### Misconception 2: "Fargate is just Lambda for containers"
**Reality:** Fargate is for long-running containerized applications without time limits. Lambda supports containers but has 15-minute max execution time.

**Key Difference:** Fargate tasks run continuously, Lambda functions are invoked and terminate.

⚠️ **EXAM TIP:** Time limit is the key differentiator. > 15 minutes = Fargate or EC2, not Lambda.

---

### Misconception 3: "You can't use Lambda with VPC resources"
**Reality:** Lambda supports VPC integration for accessing private resources (RDS, ElastiCache, internal ALBs). It uses ENIs for VPC access.

**Note:** VPC Lambda has enhanced networking (no cold start increase since 2019).

⚠️ **EXAM TIP:** Lambda CAN access VPC resources. Don't eliminate Lambda just because it needs to access RDS or other private resources.

---

### Misconception 4: "EC2 Auto Scaling is as fast as Lambda"
**Reality:** EC2 Auto Scaling takes minutes (instance launch, initialization). Lambda scales in milliseconds to seconds.

**EC2 Auto Scaling:** 2-5 minutes typical
**Lambda Scaling:** < 1 second for warm starts, 1-5 seconds for cold starts

⚠️ **EXAM TIP:** For "rapid scaling" or "sudden traffic spikes," Lambda scales faster than EC2.

---

### Misconception 5: "Fargate is always serverless and doesn't need configuration"
**Reality:** Fargate still requires ECS/EKS configuration, task definitions, service definitions, and resource allocation. It's "serverless" in that you don't manage EC2 instances.

**You Still Configure:**
- vCPU and memory allocation
- Container images
- Networking (VPC, subnets, security groups)
- IAM roles
- Logging and monitoring

⚠️ **EXAM TIP:** Fargate eliminates EC2 management, not container orchestration configuration.

---

### Misconception 6: "Lambda cold starts make it unsuitable for latency-sensitive apps"
**Reality:** While cold starts exist (100ms-5s), they're rare for frequently invoked functions. Provisioned Concurrency eliminates cold starts for critical functions.

**Mitigation Strategies:**
- Provisioned Concurrency
- Keep functions warm (scheduled invocations)
- Optimize package size
- Use arm64 (Graviton2) for faster cold starts

⚠️ **EXAM TIP:** Don't eliminate Lambda solely due to cold starts. Consider Provisioned Concurrency for latency-sensitive workloads.

---

### Misconception 7: "You can't run Windows on Fargate"
**Reality:** Fargate supports both Linux and Windows containers (Windows Server 2019 and later).

**Note:** Windows on Fargate has higher minimum resource requirements than Linux.

⚠️ **EXAM TIP:** Fargate supports Windows containers. Don't default to EC2 just because the scenario mentions Windows.

---

## Exam Strategy: Keywords to Watch For

### Keywords That Suggest EC2:
- "Full control"
- "Specific OS configuration"
- "Legacy application"
- "Lift-and-shift"
- "GPU required"
- "Dedicated hosts" (compliance)
- "Persistent local storage"
- "24/7 workload"
- "Reserved capacity"
- "Specific licensing requirements"
- "Kernel modules"
- "Custom drivers"

### Keywords That Suggest Lambda:
- "Event-driven"
- "Serverless"
- "S3 trigger," "DynamoDB stream"
- "Short duration" (< 15 min)
- "Sporadic workload"
- "Unpredictable traffic"
- "Scale to zero"
- "Cost optimization" (for variable load)
- "Real-time processing"
- "API Gateway"
- "Scheduled tasks"
- "No infrastructure management"

### Keywords That Suggest Fargate:
- "Containerized" or "Docker"
- "No cluster management"
- "Microservices"
- "Longer than 15 minutes"
- "Variable containerized workload"
- "ECS" or "EKS" with "serverless"
- "Minimize operational overhead"
- "Batch processing" (with containers)
- "CI/CD pipeline"
- "Right-sized resources per task"

---

## Quick Reference Cheat Sheet

### EC2 Quick Facts
```
✓ Compute Type: Virtual Machines
✓ Management: User manages OS and runtime
✓ Scaling: Manual or Auto Scaling (minutes)
✓ Pricing: Per second (min 60s)
✓ Max Duration: Unlimited
✓ Max Memory: Up to 24 TiB
✓ Storage: EBS, instance store, EFS
✓ Best For: Traditional apps, 24/7 workloads, full control
✓ State: Stateful
✓ Startup: Minutes
```

### Lambda Quick Facts
```
✓ Compute Type: Serverless Functions
✓ Management: Fully managed
✓ Scaling: Automatic (milliseconds)
✓ Pricing: Per 100ms + requests
✓ Max Duration: 15 minutes
✓ Max Memory: 10 GB
✓ Storage: /tmp (10 GB), EFS
✓ Best For: Event-driven, short tasks, variable load
✓ State: Stateless
✓ Startup: Milliseconds (cold: 1-5s)
```

### Fargate Quick Facts
```
✓ Compute Type: Serverless Containers
✓ Management: Managed container orchestration
✓ Scaling: Automatic via ECS/EKS
✓ Pricing: Per second of vCPU/memory
✓ Max Duration: Unlimited
✓ Max Memory: 120 GB
✓ Storage: Ephemeral (20 GB), EFS
✓ Best For: Containerized apps, microservices
✓ State: Can be stateful or stateless
✓ Startup: Seconds to minutes
```

---

## Advanced Exam Scenarios

### Hybrid: Lambda + EC2
**Scenario:** API Gateway → Lambda (lightweight logic) → EC2 (heavy processing)

**When:**
- API needs immediate response
- Background processing is resource-intensive
- Want to optimize costs by using Lambda for API and EC2 for processing

⚠️ **EXAM TIP:** Hybrid architectures are valid! Don't assume it's always one service.

---

### Hybrid: Lambda + Fargate
**Scenario:** EventBridge → Lambda (orchestration) → ECS Fargate (batch job)

**When:**
- Need event-driven orchestration (Lambda)
- Processing exceeds 15 minutes (Fargate)
- Containerized workload

**Example:** Video processing where Lambda receives S3 event and starts Fargate task for transcoding.

⚠️ **EXAM TIP:** Lambda can orchestrate Fargate tasks via ECS API. Look for "orchestration" + "long-running" patterns.

---

### Hybrid: EC2 + Fargate (ECS Mixed)
**Scenario:** ECS cluster with both EC2 and Fargate capacity providers

**When:**
- Some workloads need full instance control (EC2)
- Other workloads benefit from Fargate (serverless)
- Cost optimization by mixing instance types

**Example:** Production traffic on Fargate, batch jobs on EC2 Spot instances.

⚠️ **EXAM TIP:** ECS supports mixed capacity providers. Fargate for flexibility, EC2 for cost or control.

---

## Cost Comparison Examples

### Example 1: API with 1 Million Requests/Month

**Scenario:** Each request takes 200ms, uses 512 MB memory

**Lambda Cost:**
- Requests: 1M × $0.20/1M = $0.20
- Duration: 1M × 0.2s × 512MB = 100,000 GB-seconds
- Compute: 100,000 × $0.0000166667 = $1.67
- **Total: $1.87/month**

**EC2 t3.small (24/7):**
- On-Demand: ~$15/month
- Reserved (1-year): ~$11/month
- **Total: $11-15/month**

**Verdict:** Lambda is 6-8× cheaper for this sporadic workload.

⚠️ **EXAM TIP:** Calculate whether the workload runs continuously or sporadically for accurate cost analysis.

---

### Example 2: Continuous Processing (24/7)

**Scenario:** 2 vCPU, 4 GB RAM, runs 24/7

**Lambda (simulated as always running):**
- 730 hours/month = 2,628,000 seconds
- 2,628,000s × 4 GB = 10,512,000 GB-seconds
- 10,512,000 × $0.0000166667 = $175.20/month
- **Total: ~$175/month**

**EC2 t3.medium:**
- On-Demand: ~$30/month
- Reserved (1-year): ~$18/month
- **Total: $18-30/month**

**Fargate (24/7):**
- vCPU: 2 × $0.04048 × 730h = $59.10
- Memory: 4GB × $0.004445 × 730h = $12.98
- **Total: ~$72/month**

**Verdict:** For 24/7, EC2 Reserved is cheapest, then Fargate, then Lambda.

⚠️ **EXAM TIP:** For constant workloads, EC2 Reserved Instances provide the best cost optimization.

---

### Example 3: Batch Processing (8 hours/day)

**Scenario:** 4 vCPU, 8 GB RAM, runs 8 hours/day, 5 days/week = ~173 hours/month

**EC2 t3.xlarge:**
- On-Demand: ~$60/month (even though only used 173/730 hours)
- **Effective hourly: $0.35/hour (waste: 76% of cost)**

**Fargate:**
- vCPU: 4 × $0.04048 × 173h = $28.01
- Memory: 8GB × $0.004445 × 173h = $6.15
- **Total: ~$34/month**

**Verdict:** Fargate is ~44% cheaper for this intermittent batch workload.

⚠️ **EXAM TIP:** For workloads that don't run 24/7, Fargate and Lambda can be more cost-effective than EC2.

---

## Integration Patterns

### EC2 Integration Patterns:
```
✓ ALB/NLB → EC2 (web tier)
✓ CloudFront → EC2 (origin server)
✓ Direct Connect → EC2 (hybrid connectivity)
✓ RDS → EC2 (application tier)
✓ S3 → EC2 (batch processing via SDK)
```

### Lambda Integration Patterns:
```
✓ API Gateway → Lambda (REST/HTTP API)
✓ ALB → Lambda (HTTP endpoint)
✓ S3 → Lambda (event trigger)
✓ DynamoDB Streams → Lambda (change data capture)
✓ Kinesis → Lambda (stream processing)
✓ SQS → Lambda (queue processing)
✓ SNS → Lambda (pub/sub)
✓ EventBridge → Lambda (event routing)
✓ CloudFront → Lambda@Edge (edge computing)
```

### Fargate Integration Patterns:
```
✓ ALB → Fargate (ECS services)
✓ NLB → Fargate (TCP/UDP services)
✓ EventBridge → Fargate (scheduled tasks)
✓ Step Functions → Fargate (workflow orchestration)
✓ CloudWatch Events → Fargate (event-driven tasks)
✓ API Gateway → NLB → Fargate (private API)
```

---

## Performance Characteristics

### Latency Considerations:

**EC2:**
- No cold starts (if running)
- Predictable performance
- Can use placement groups for low latency between instances
- Enhanced networking up to 100 Gbps

**Lambda:**
- Cold start: 100ms-5s (depends on runtime, package size)
- Warm start: < 100ms
- Provisioned Concurrency: No cold start
- Network: VPC Lambda uses ENIs (no latency increase post-2019)

**Fargate:**
- Container start time: 30s-2min (depends on image size)
- No cold starts for running tasks
- Predictable performance once running
- Network: Task-level ENI

⚠️ **EXAM TIP:** For "sub-second latency requirement with no cold starts," consider EC2 or Lambda with Provisioned Concurrency.

---

### Throughput Considerations:

**EC2:**
- Depends on instance type
- Up to 100 Gbps network (certain instance types)
- Can scale horizontally with Auto Scaling
- Limited by instance limits and scaling speed

**Lambda:**
- 1000 concurrent executions (default, can increase)
- Automatic scaling to handle bursts
- Throttles at concurrency limit (429 error)
- Regional limit across all functions

**Fargate:**
- Depends on task resource allocation
- Scales based on service configuration
- Limited by ENI limits per subnet
- Can handle sustained high throughput

⚠️ **EXAM TIP:** For "burst traffic" or "sudden spikes," Lambda handles this best with automatic scaling.

---

## Reliability and Availability

### EC2:
- **Multi-AZ:** Deploy instances across multiple AZs
- **Auto Scaling:** Automatically replace unhealthy instances
- **ELB Health Checks:** Route traffic only to healthy instances
- **SLA:** 99.99% for Multi-AZ deployments

### Lambda:
- **Built-in redundancy:** Automatically runs across multiple AZs
- **No instance failures:** AWS manages infrastructure
- **Automatic retry:** Built-in for asynchronous invocations
- **SLA:** 99.95% monthly uptime

### Fargate:
- **Multi-AZ:** Deploy tasks across multiple AZs
- **ECS Service:** Automatically maintains desired task count
- **Health Checks:** ELB and ECS health checks
- **SLA:** 99.99% for Multi-AZ deployments

⚠️ **EXAM TIP:** All three can achieve high availability with Multi-AZ deployments. Lambda has built-in redundancy.

---

## Disaster Recovery Patterns

### EC2:
- AMI snapshots for backup
- Cross-region AMI copy
- Multi-region deployments with Route 53
- Automated backups with AWS Backup

### Lambda:
- Function code in S3 (versioned)
- Multi-region deployment via SAM/CloudFormation
- Alias and version management
- Infrastructure as Code (IaC)

### Fargate:
- Container images in ECR (replicated)
- Task definitions versioned
- Multi-region ECS clusters
- Infrastructure as Code

⚠️ **EXAM TIP:** Lambda and Fargate are easier to deploy cross-region (container images, code artifacts) vs EC2 (AMI copies).

---

## Monitoring and Observability

### EC2 Monitoring:
```
✓ CloudWatch Metrics (CPU, network, disk)
✓ Detailed monitoring (1-minute intervals)
✓ Custom metrics via CloudWatch agent
✓ CloudWatch Logs for application logs
✓ Systems Manager for fleet management
✓ Third-party APM tools
```

### Lambda Monitoring:
```
✓ CloudWatch Metrics (invocations, duration, errors, throttles)
✓ CloudWatch Logs (automatic logging)
✓ X-Ray for distributed tracing
✓ CloudWatch Insights for log analysis
✓ Lambda Insights for enhanced metrics
✓ Third-party observability platforms
```

### Fargate Monitoring:
```
✓ CloudWatch Container Insights
✓ Task-level metrics (CPU, memory, network)
✓ CloudWatch Logs via awslogs driver
✓ X-Ray for distributed tracing
✓ ECS Events for task state changes
✓ Third-party container monitoring
```

⚠️ **EXAM TIP:** Lambda and Fargate have built-in CloudWatch integration. EC2 requires CloudWatch agent installation.

---

## Security Best Practices

### EC2 Security:
```
✓ Security Groups (stateful firewall)
✓ NACLs (stateless subnet firewall)
✓ IAM instance profiles (never embed credentials)
✓ IMDSv2 (prevent SSRF attacks)
✓ Systems Manager Session Manager (no SSH keys)
✓ Regular patching (OS and applications)
✓ Encryption at rest (EBS encryption)
✓ Encryption in transit (TLS)
```

### Lambda Security:
```
✓ IAM execution roles (least privilege)
✓ Resource-based policies (who can invoke)
✓ VPC integration for private resources
✓ Environment variables encryption (KMS)
✓ Secrets Manager integration
✓ No OS to patch (reduced attack surface)
✓ Function-level isolation
✓ Code signing for trusted deployment
```

### Fargate Security:
```
✓ Task IAM roles (least privilege)
✓ Task-level security groups
✓ Secrets Manager / SSM Parameter Store
✓ IAM roles for service accounts (EKS)
✓ No EC2 instance access (reduced attack surface)
✓ Container image scanning (ECR)
✓ Network isolation (awsvpc mode)
✓ Read-only root filesystem
```

⚠️ **EXAM TIP:** Serverless (Lambda, Fargate) reduces operational security burden (no OS patching, no SSH management).

---

## Compliance Considerations

### EC2:
- **Dedicated Hosts:** Compliance requiring dedicated physical servers
- **Dedicated Instances:** Single-tenant hardware
- **BYOL:** Bring your own licenses
- **Hardware compliance:** Control over physical hardware

### Lambda:
- **Shared infrastructure:** Multi-tenant by default
- **No dedicated option:** Cannot guarantee physical isolation
- **Compliance frameworks:** HIPAA, PCI DSS, SOC, ISO certified
- **Data residency:** Regional data storage

### Fargate:
- **Task isolation:** Container-level isolation
- **No host access:** Cannot access underlying EC2
- **Compliance frameworks:** HIPAA, PCI DSS, SOC, ISO certified
- **Shared infrastructure:** No dedicated option

⚠️ **EXAM TIP:** If compliance requires "dedicated physical servers" or "hardware isolation," you need EC2 Dedicated Hosts.

---

## Migration Strategies

### Migrating to EC2 (Lift-and-Shift):
```
1. Rehost: AWS Application Migration Service (MGN)
2. Minimal changes to existing applications
3. Quick migration timeline
4. Allows optimization later (re-platform, re-architect)
```

### Migrating to Lambda (Re-architect):
```
1. Break monolith into microservices
2. Identify event-driven components
3. Refactor to stateless architecture
4. Requires significant development effort
5. Long-term benefits: cost, scalability, operational efficiency
```

### Migrating to Fargate (Re-platform):
```
1. Containerize existing applications
2. Define task definitions and services
3. Moderate development effort
4. Middle ground between lift-and-shift and re-architect
5. Benefits: portability, reduced operational overhead
```

⚠️ **EXAM TIP:** Migration strategy questions:
- **Fast migration, minimal changes:** EC2 (lift-and-shift)
- **Moderate effort, containerization:** Fargate (re-platform)
- **Long-term optimization, microservices:** Lambda (re-architect)

---

## Final Exam Tips

### 1. Read for Time Limits
- Task < 15 minutes → Lambda is an option
- Task > 15 minutes → Fargate or EC2

### 2. Identify Traffic Patterns
- Sporadic/unpredictable → Lambda
- Steady 24/7 → EC2 (with RI/Savings Plans)
- Variable but containerized → Fargate

### 3. Look for State Requirements
- Stateful with local storage → EC2
- Stateless → Lambda
- Containerized with state → Fargate + EFS or external DB

### 4. Check for Event-Driven Keywords
- "S3 upload," "DynamoDB stream," "SQS message" → Lambda
- "API Gateway," "scheduled task" → Lambda
- "Long-running batch job" → Fargate or EC2

### 5. Consider Cost Optimization
- Variable load → Lambda or Fargate
- Constant load → EC2 Reserved Instances
- Batch workload (not 24/7) → Fargate or Lambda

### 6. Infrastructure Management
- "No infrastructure management" → Lambda
- "Minimize operational overhead" → Lambda or Fargate
- "Full control" → EC2

### 7. Performance Requirements
- "Sub-second latency, no cold starts" → EC2 or Lambda with Provisioned Concurrency
- "GPU required" → EC2
- "Rapid scaling" → Lambda

### 8. Compliance and Security
- "Dedicated hosts" → EC2 Dedicated Hosts
- "Reduce attack surface" → Lambda or Fargate
- "Full OS control for security" → EC2

### 9. Integration Requirements
- Multiple AWS event sources → Lambda
- Load balancer integration → All three (ALB/NLB)
- CloudFront origin → EC2 or Lambda@Edge

### 10. Hybrid Architectures
- Don't assume single service
- Lambda for orchestration + Fargate for processing is valid
- API Gateway + Lambda + EC2 is valid

---

## Summary Table: When to Choose Each Service

| Requirement | EC2 | Lambda | Fargate |
|-------------|-----|--------|---------|
| **Event-driven architecture** | ❌ | ✅ | ± |
| **Execution > 15 minutes** | ✅ | ❌ | ✅ |
| **Stateful application** | ✅ | ❌ | ± |
| **Full OS control** | ✅ | ❌ | ❌ |
| **GPU/specialized hardware** | ✅ | ❌ | ❌ |
| **Containerized workload** | ± | ± | ✅ |
| **24/7 steady workload** | ✅ | ❌ | ± |
| **Sporadic/variable traffic** | ❌ | ✅ | ± |
| **Cost optimization (variable)** | ❌ | ✅ | ✅ |
| **Cost optimization (steady)** | ✅ | ❌ | ❌ |
| **No infrastructure management** | ❌ | ✅ | ✅ |
| **Fastest scaling** | ❌ | ✅ | ± |
| **Scale to zero** | ❌ | ✅ | ✅ |
| **Compliance (dedicated)** | ✅ | ❌ | ❌ |
| **Sub-second latency** | ✅ | ± | ✅ |

**Legend:** ✅ = Best fit, ± = Can work, ❌ = Not ideal

---

## Conclusion

Understanding when to choose EC2, Lambda, or Fargate is fundamental for the AWS Solutions Architect Professional exam. Remember:

- **EC2:** Full control, steady workloads, specialized requirements
- **Lambda:** Event-driven, short tasks, variable/sporadic traffic
- **Fargate:** Containerized apps without infrastructure management

Focus on the scenario's keywords, traffic patterns, time limits, and cost considerations. Many questions will test your ability to choose the most cost-effective and architecturally appropriate solution.

⚠️ **Final Exam Tip:** When in doubt, consider the trade-offs:
- Control vs. Management overhead
- Cost optimization vs. Operational complexity
- Performance vs. Scalability

Good luck on your AWS Solutions Architect Professional exam!
