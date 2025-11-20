# AWS Compute Services Comparison

## High-Level Overview

### Amazon EC2 (Elastic Compute Cloud)
**Core Concept**: Virtual servers in the cloud with complete control over the operating system and configuration.

**Key Characteristics**:
- Full control over instances (root/administrator access)
- Multiple instance types optimized for different workloads
- Supports multiple purchasing options (On-Demand, Reserved, Spot, Dedicated)
- Requires OS management, patching, and security updates
- Persistent instances that run until terminated
- Can attach EBS volumes, instance store, and network interfaces
- Supports Auto Scaling for elasticity

**Best For**:
- Applications requiring specific OS configurations
- Long-running applications with consistent workload
- Applications requiring persistent local storage
- Legacy applications requiring lift-and-shift migration
- Workloads with specialized hardware requirements (GPUs, high memory)

### AWS Lambda
**Core Concept**: Serverless compute service that runs code in response to events without managing servers.

**Key Characteristics**:
- Zero server management - AWS handles infrastructure
- Automatic scaling (0 to thousands of concurrent executions)
- Pay only for compute time consumed (per millisecond)
- Maximum execution timeout: 15 minutes
- Supports multiple runtime environments (Python, Node.js, Java, Go, .NET, Ruby, custom runtimes)
- Event-driven architecture with native AWS service integrations
- Stateless execution model (ephemeral storage)
- Cold start latency for infrequently invoked functions

**Best For**:
- Event-driven applications (S3 triggers, API Gateway, DynamoDB Streams)
- Microservices architectures
- Real-time file processing
- Scheduled tasks/cron jobs
- Applications with variable or unpredictable traffic
- Backend for mobile/web applications

### Amazon ECS (Elastic Container Service)
**Core Concept**: Fully managed container orchestration service for Docker containers.

**Key Characteristics**:
- Native AWS service with deep integration
- Two launch types: EC2 (you manage instances) and Fargate (serverless)
- Task definitions define container configurations
- Services maintain desired number of tasks
- Supports both Linux and Windows containers
- Integration with ALB/NLB, Service Discovery, CloudWatch
- No additional orchestration charges (pay only for resources)
- Blue/green deployments with CodeDeploy

**Best For**:
- Docker-based applications requiring AWS service integration
- Microservices architectures with mixed workload types
- Applications requiring cost optimization through EC2 launch type
- Teams already familiar with AWS ecosystem
- Hybrid architectures (ECS Anywhere)

### Amazon EKS (Elastic Kubernetes Service)
**Core Concept**: Managed Kubernetes service compatible with standard Kubernetes tooling.

**Key Characteristics**:
- Certified Kubernetes conformant (portable workloads)
- Control plane managed by AWS (highly available across AZs)
- Two compute options: Self-managed nodes (EC2) and Fargate
- Integration with AWS services (IAM, VPC, CloudWatch)
- Supports Kubernetes ecosystem tools (Helm, kubectl, operators)
- Additional control plane charges (~$0.10/hour per cluster)
- Supports both Linux and Windows nodes
- Multi-tenancy with namespaces

**Best For**:
- Organizations standardized on Kubernetes
- Multi-cloud or hybrid deployments requiring portability
- Complex microservices requiring advanced orchestration
- Applications using Kubernetes-specific features (StatefulSets, DaemonSets)
- Teams with existing Kubernetes expertise

### AWS Fargate
**Core Concept**: Serverless compute engine for containers (works with both ECS and EKS).

**Key Characteristics**:
- No server or cluster management required
- Pay for vCPU and memory resources used by containers
- Automatic scaling without provisioning instances
- Task-level isolation for enhanced security
- No upfront costs or minimum fees
- Integration with VPC networking (ENI per task)
- Supports both Linux and Windows containers
- Higher per-resource cost than EC2 launch type

**Best For**:
- Organizations wanting to eliminate server management
- Applications with variable or unpredictable traffic
- Batch processing workloads
- Development and test environments
- Microservices requiring strong isolation
- Teams focused on application logic rather than infrastructure

### AWS Batch
**Core Concept**: Fully managed batch processing service that dynamically provisions compute resources.

**Key Characteristics**:
- Designed specifically for batch computing workloads
- Automatic provisioning and scaling based on job volume
- Supports multi-node parallel jobs
- Job scheduling with priorities and dependencies
- Runs on EC2 or Fargate compute environments
- Integration with CloudWatch and EventBridge
- No additional charges (pay only for underlying resources)
- Supports Spot Instances for cost optimization

**Best For**:
- Large-scale batch processing (data analytics, rendering, simulations)
- ETL workloads with dependencies
- High-performance computing (HPC) applications
- Jobs requiring specific compute resources at specific times
- Financial services modeling and risk analysis
- Scientific computing and research workloads

### Amazon Lightsail
**Core Concept**: Simplified compute service with predictable pricing for simple applications.

**Key Characteristics**:
- Bundled compute, storage, and networking for fixed monthly price
- Pre-configured application stacks (WordPress, LAMP, Node.js)
- Simplified management console
- Automatic backups and snapshots
- Built-in static IP addresses and DNS management
- Load balancing and database options available
- Limited scalability compared to EC2
- Not suitable for complex architectures

**Best For**:
- Simple web applications and websites
- Development and test environments
- Small business applications
- Learning and experimentation
- Prototypes and MVPs
- Applications with predictable, steady-state workloads

---

## Detailed Comparison Table

| Aspect | EC2 | Lambda | ECS | EKS | Fargate | Batch | Lightsail |
|--------|-----|--------|-----|-----|---------|-------|-----------|
| **Management Complexity** | High (OS, patching, scaling) | Very Low (serverless) | Medium (container orchestration) | High (Kubernetes knowledge) | Low (serverless containers) | Low (batch-focused) | Very Low (simplified) |
| **Scaling** | Manual/Auto Scaling Groups | Automatic (0-1000s concurrent) | Automatic with services | Automatic with HPA/CA | Automatic per task | Automatic based on jobs | Manual or limited auto-scaling |
| **Minimum Execution** | Hours/Days (long-running) | Milliseconds (ephemeral) | Minutes/Hours (task-based) | Minutes/Hours (pod-based) | Minutes/Hours (task-based) | Minutes/Hours (job-based) | Hours/Days (persistent) |
| **Maximum Execution** | Unlimited | 15 minutes | Unlimited | Unlimited | Unlimited | Unlimited | Unlimited |
| **Pricing Model** | Per hour/second | Per 100ms + requests | Resources used (EC2/Fargate) | Control plane + resources | Per second (vCPU + memory) | Underlying resources only | Fixed monthly bundles |
| **Cold Start** | Minutes (boot time) | Yes (1-5 seconds) | Moderate (container start) | Moderate (pod start) | Moderate (task start) | Depends on compute type | Minutes (boot time) |
| **State Management** | Persistent (EBS volumes) | Stateless (ephemeral) | Configurable (volumes) | Configurable (PVs) | Configurable (volumes) | Stateless (S3 for data) | Persistent (included storage) |
| **Concurrency** | Limited by instance count | Soft limit 1000 concurrent | Limited by cluster capacity | Limited by node capacity | Unlimited (within limits) | Unlimited (within limits) | Limited by instance |
| **Use Case Fit** | General purpose compute | Event-driven, short tasks | Containerized applications | Complex orchestration | Serverless containers | Batch processing | Simple applications |
| **Deployment Speed** | Minutes | Seconds | Seconds to minutes | Minutes | Seconds to minutes | Minutes | Minutes |
| **Operating System Access** | Full root access | No access (runtime only) | Limited (container) | Limited (container) | Limited (container) | Limited (container) | Full root access |
| **Networking** | ENI, multiple IPs | VPC integration | VPC networking | VPC CNI | VPC ENI per task | VPC integration | Simplified networking |
| **Monitoring** | CloudWatch + detailed | CloudWatch Logs/Metrics | CloudWatch + Container Insights | CloudWatch + Container Insights | CloudWatch + Container Insights | CloudWatch integration | Simplified metrics |
| **Storage Options** | EBS, Instance Store, EFS | /tmp (512MB-10GB) | EBS, EFS, FSx | EBS, EFS, FSx | Ephemeral (20-200GB) | EFS, S3 | Included SSD storage |
| **Ideal Workload Size** | Medium to large | Micro to small | Small to large | Medium to very large | Small to large | Large batch jobs | Small to medium |
| **Compliance/Control** | Very high | Limited (managed runtime) | High | High | Medium | Medium | Medium |
| **Learning Curve** | Low to medium | Low | Medium | High | Low to medium | Low | Very low |
| **Cost at Scale** | Variable (optimize with RI) | Cost-effective for variable | Lower with EC2 launch | Higher (control plane fees) | Higher per resource | Cost-effective with Spot | Predictable, limited scale |

---

## Decision Tree

```
START: Which compute service should I use?

├─ Do you need to run batch processing workloads?
│  └─ YES → **AWS Batch**
│      └─ Use Fargate for serverless or EC2 for cost optimization
│
├─ Is this a simple application with predictable traffic?
│  └─ YES → Are you new to AWS or need fixed pricing?
│      └─ YES → **Lightsail**
│      └─ NO → Continue evaluation
│
├─ Does the task complete in under 15 minutes?
│  └─ YES → Is it event-driven or has variable traffic?
│      └─ YES → **Lambda**
│      └─ NO → Continue evaluation
│
├─ Are you using containers?
│  └─ YES →
│  │   ├─ Do you need Kubernetes specifically?
│  │   │   └─ YES → **EKS**
│  │   │       ├─ Want to manage infrastructure? → EKS on EC2
│  │   │       └─ Want serverless? → EKS on Fargate
│  │   │
│  │   └─ NO → Prefer AWS-native orchestration?
│  │       └─ YES → **ECS**
│  │           ├─ Need cost optimization/control? → ECS on EC2
│  │           └─ Want serverless/simplicity? → ECS on Fargate
│  │
│  └─ NO → Continue evaluation
│
├─ Do you need complete control over the OS?
│  └─ YES → **EC2**
│      ├─ Steady-state workload? → Reserved Instances
│      ├─ Fault-tolerant/flexible? → Spot Instances
│      └─ Unpredictable? → On-Demand Instances
│
└─ DEFAULT → Consider containerization for better resource utilization
    └─ Start with ECS/Fargate for simplicity
```

### Decision Factors by Priority

**Choose Lambda when**:
1. Execution time < 15 minutes
2. Event-driven workload (S3, DynamoDB, API Gateway triggers)
3. Unpredictable or sporadic traffic patterns
4. Zero infrastructure management desired
5. Cost optimization for low-utilization workloads

**Choose EC2 when**:
1. Need complete OS control
2. Long-running applications (24/7 services)
3. Specialized hardware requirements (GPU, FPGA)
4. Legacy applications requiring lift-and-shift
5. Consistent, predictable workloads (Reserved Instance savings)

**Choose ECS when**:
1. Using Docker containers
2. Want deep AWS service integration
3. Don't need Kubernetes portability
4. Cost is a primary concern (no control plane fees)
5. Simpler orchestration requirements

**Choose EKS when**:
1. Kubernetes is organizational standard
2. Multi-cloud or hybrid deployment strategy
3. Need advanced Kubernetes features
4. Existing Kubernetes expertise
5. Complex microservices architectures

**Choose Fargate when**:
1. Want container benefits without infrastructure management
2. Variable or unpredictable container workloads
3. Strong task isolation requirements
4. Faster time to market priority
5. Small to medium scale workloads

**Choose Batch when**:
1. Large-scale batch processing requirements
2. Jobs with complex dependencies
3. HPC or scientific computing workloads
4. Need automatic resource provisioning for jobs
5. Financial modeling, rendering, or simulations

**Choose Lightsail when**:
1. Simple web applications or websites
2. New to AWS, need simplicity
3. Predictable pricing required
4. Small business applications
5. Development/testing environments

---

## Common Exam Scenarios

### Scenario 1: Event-Driven Image Processing
**Question**: A company needs to process images uploaded to S3 by applying filters and generating thumbnails. The processing takes 2-5 minutes per image, and upload frequency varies significantly throughout the day.

**Analysis**:
- Event-driven trigger (S3 upload)
- Variable workload
- Processing time < 15 minutes
- No infrastructure management desired

**⚠️ EXAM TIP**: Look for keywords: "event-driven," "variable traffic," "S3 trigger," "no server management"

**Answer**: **Lambda** - Perfect fit for event-driven, variable workload with execution under 15 minutes.

**Why not others?**:
- EC2: Over-provisioning for variable load, management overhead
- ECS/Fargate: More complex than needed for simple processing
- Batch: Overkill for independent image processing tasks

---

### Scenario 2: Long-Running Data Analytics Platform
**Question**: A financial services company needs to run a 24/7 data analytics platform that processes market data continuously. The application requires specific GPU instances and custom machine learning libraries with precise version control.

**Analysis**:
- Long-running (24/7)
- Specialized hardware (GPU)
- Custom dependencies
- Predictable workload

**⚠️ EXAM TIP**: Keywords: "24/7," "specialized hardware," "custom dependencies," "continuous processing"

**Answer**: **EC2 with Reserved Instances** - Provides OS control, GPU support, and cost savings for steady-state workload.

**Why not others?**:
- Lambda: 15-minute execution limit
- Fargate: Limited GPU support, higher cost for continuous workload
- Lightsail: No GPU support, limited scaling

---

### Scenario 3: Microservices Migration to Cloud
**Question**: A company wants to migrate their Docker-based microservices application to AWS. They have 20+ microservices, use service discovery, and need seamless integration with AWS load balancers and monitoring. They don't use Kubernetes currently.

**Analysis**:
- Containerized workload (Docker)
- Multiple microservices
- Need AWS integration
- No Kubernetes requirement

**⚠️ EXAM TIP**: Keywords: "Docker," "microservices," "AWS integration," "not using Kubernetes"

**Answer**: **ECS with Fargate** - AWS-native container orchestration with excellent AWS service integration, no Kubernetes complexity.

**Why not others?**:
- EKS: Unnecessary Kubernetes complexity and cost
- Lambda: Not suitable for long-running microservices
- EC2: More management overhead than needed

---

### Scenario 4: Kubernetes-Based Multi-Cloud Strategy
**Question**: An enterprise wants to run containerized applications across AWS and on-premises data centers using the same orchestration platform. They have a team experienced with Kubernetes and need workload portability.

**Analysis**:
- Multi-cloud/hybrid requirement
- Kubernetes expertise exists
- Workload portability needed
- Organizational standard

**⚠️ EXAM TIP**: Keywords: "multi-cloud," "hybrid," "Kubernetes," "portability," "standard platform"

**Answer**: **EKS** - Managed Kubernetes service providing portability and standard tooling.

**Why not others?**:
- ECS: AWS-specific, no portability
- Lambda: Not suitable for complex orchestration
- EC2: Requires self-managing Kubernetes

---

### Scenario 5: Nightly ETL Processing
**Question**: A company needs to run ETL jobs every night that process data from multiple sources. Jobs have dependencies (Job B starts after Job A completes), and processing volume varies significantly between 1-100 GB daily. Jobs run for 1-4 hours.

**Analysis**:
- Batch processing workload
- Job dependencies
- Variable resource requirements
- Scheduled execution

**⚠️ EXAM TIP**: Keywords: "batch," "ETL," "dependencies," "variable resource requirements," "scheduled"

**Answer**: **AWS Batch** - Purpose-built for batch processing with dependency management and automatic resource provisioning.

**Why not others?**:
- Lambda: 15-minute execution limit
- EC2: Manual resource management, over-provisioning
- ECS: More complex than needed, no native dependency management

---

### Scenario 6: WordPress Blog for Small Business
**Question**: A small business owner with minimal AWS experience wants to host a WordPress blog. They expect 100-500 visitors daily and want predictable monthly costs around $10-20. They don't want to manage complex infrastructure.

**Analysis**:
- Simple application
- Low traffic, predictable
- Minimal AWS expertise
- Cost-sensitive
- Low management overhead desired

**⚠️ EXAM TIP**: Keywords: "simple application," "small business," "minimal experience," "predictable cost," "WordPress"

**Answer**: **Lightsail** - Pre-configured WordPress blueprint with predictable pricing and simplified management.

**Why not others?**:
- EC2: More complex, harder to predict costs
- Lambda: Not suitable for WordPress (stateful, long-running)
- ECS: Overkill for simple website

---

### Scenario 7: Real-Time Data Transformation Pipeline
**Question**: A company receives data in DynamoDB Streams and needs to transform and enrich this data in real-time before storing it in S3 for analytics. Processing takes 30-60 seconds per record, and traffic spikes are unpredictable.

**Analysis**:
- Event-driven (DynamoDB Streams)
- Real-time processing
- Under 15 minutes execution
- Variable traffic

**⚠️ EXAM TIP**: Keywords: "DynamoDB Streams," "real-time," "event-driven," "unpredictable traffic"

**Answer**: **Lambda** - Native integration with DynamoDB Streams, automatic scaling, pay-per-use pricing.

**Why not others?**:
- EC2: Over-provisioning for variable load
- Batch: Not real-time, designed for scheduled jobs
- ECS: More complex for simple transformation logic

---

### Scenario 8: Genomics Research Computation
**Question**: A research institution needs to run thousands of parallel genomics analysis jobs. Each job processes one genome sample and takes 2-8 hours. Jobs are submitted sporadically throughout the day, and cost optimization is critical. Jobs can tolerate interruptions.

**Analysis**:
- Large-scale parallel processing
- Long-running jobs (2-8 hours)
- Variable job submission
- Cost-sensitive
- Fault-tolerant

**⚠️ EXAM TIP**: Keywords: "parallel processing," "thousands of jobs," "cost optimization," "can tolerate interruptions"

**Answer**: **AWS Batch with Spot Instances** - Designed for large-scale batch processing with automatic provisioning and Spot support for cost savings.

**Why not others?**:
- Lambda: 15-minute execution limit
- Fargate: More expensive than Spot Instances for long-running jobs
- ECS: Requires more manual orchestration for batch patterns

---

### Scenario 9: Stateful Application with Session Management
**Question**: A company runs a stateful application that maintains user sessions in memory and requires sticky sessions. The application runs 24/7 and needs to persist data to local NVMe SSDs for performance. They need to scale from 10 to 50 instances based on CPU utilization.

**Analysis**:
- Stateful application
- Long-running (24/7)
- Local storage requirements
- Auto-scaling needed
- Session affinity

**⚠️ EXAM TIP**: Keywords: "stateful," "session management," "local storage," "NVMe," "sticky sessions"

**Answer**: **EC2 with Auto Scaling Groups and Instance Store** - Provides persistent instances, local NVMe storage, and sticky session support with ALB.

**Why not others?**:
- Lambda: Stateless, no local storage
- Fargate: Limited persistent local storage
- Lightsail: Limited auto-scaling capabilities

---

### Scenario 10: CI/CD Build Pipeline
**Question**: A development team needs to run automated build and test pipelines triggered by code commits. Each build takes 5-15 minutes and requires 4 GB of memory. The team makes 50-200 commits daily, primarily during business hours.

**Analysis**:
- Event-driven (code commits)
- Variable frequency (50-200/day)
- Execution time 5-15 minutes
- Specific resource requirements

**⚠️ EXAM TIP**: Keywords: "CI/CD," "triggered by commits," "variable frequency," "5-15 minutes"

**Answer**: **Lambda** or **Fargate** - Lambda works if execution stays under 15 minutes; Fargate provides more resources and unlimited execution time.

**Best Practice**: Use **Fargate** for flexibility, especially if builds might exceed 15 minutes as complexity grows.

**Why not others?**:
- EC2: Over-provisioning for variable build frequency
- Batch: Designed for larger-scale batch processing
- Lightsail: Not suitable for automated pipelines

---

## Key Differences Summary

### EC2 vs. Lambda
| Factor | EC2 | Lambda |
|--------|-----|--------|
| **Infrastructure** | Manage instances, OS, patches | Fully managed, no servers |
| **Pricing** | Pay for running instances (hourly/per second) | Pay per invocation and duration (milliseconds) |
| **Scaling** | Manual or Auto Scaling Groups | Automatic (0 to thousands) |
| **Execution** | Unlimited duration | Maximum 15 minutes |
| **Use Case** | Long-running, stateful applications | Short-lived, event-driven tasks |
| **Cold Start** | Instance boot time (minutes) | Function initialization (seconds) |

**⚠️ EXAM TIP**: If the scenario mentions "15 minutes" or "execution timeout," it's likely testing Lambda's time limitation.

---

### ECS vs. EKS
| Factor | ECS | EKS |
|--------|-----|-----|
| **Orchestration** | AWS-proprietary | Standard Kubernetes |
| **Portability** | AWS-specific | Portable across clouds |
| **Complexity** | Simpler, AWS-native | More complex, Kubernetes knowledge required |
| **Cost** | No orchestration fees | ~$0.10/hour per cluster control plane |
| **Integration** | Deep AWS integration | AWS integration + Kubernetes ecosystem |
| **Learning Curve** | Lower | Higher |

**⚠️ EXAM TIP**: Choose EKS when the scenario mentions "Kubernetes," "multi-cloud," or "portability." Choose ECS for AWS-native simplicity.

---

### ECS/EKS on EC2 vs. Fargate
| Factor | EC2 Launch Type | Fargate |
|--------|-----------------|---------|
| **Management** | Manage EC2 instances | Serverless, no instance management |
| **Cost** | Lower (direct EC2 pricing) | Higher per resource (convenience premium) |
| **Control** | Full instance access | Task-level only |
| **Scaling** | Cluster capacity planning needed | Automatic, no capacity planning |
| **Isolation** | Container-level | Task-level with dedicated ENI |
| **Best For** | Large-scale, cost-sensitive workloads | Variable workloads, simplicity |

**⚠️ EXAM TIP**: Choose Fargate when "no infrastructure management" or "serverless containers" is mentioned. Choose EC2 launch type for "cost optimization" at scale.

---

### Lambda vs. Fargate
| Factor | Lambda | Fargate |
|--------|--------|---------|
| **Execution Time** | Maximum 15 minutes | Unlimited |
| **Container Support** | Custom runtimes only | Full Docker support |
| **Packaging** | ZIP or container image (up to 10 GB) | Any Docker image |
| **Cold Start** | Faster (typically 1-5 seconds) | Slower (typically 30-60 seconds) |
| **Memory** | 128 MB to 10 GB | 512 MB to 30 GB (ECS), up to 120 GB (EKS) |
| **Pricing** | Per request + duration | Per second (vCPU + memory) |

**⚠️ EXAM TIP**: If execution time can exceed 15 minutes or requires more than 10 GB memory, Lambda is automatically ruled out.

---

### Batch vs. Lambda
| Factor | Batch | Lambda |
|--------|-------|--------|
| **Job Duration** | Unlimited | Maximum 15 minutes |
| **Scheduling** | Job queues with priorities | Event-driven triggers |
| **Dependencies** | Native job dependencies | Requires Step Functions |
| **Parallel Processing** | Multi-node parallel jobs | Concurrent invocations |
| **Best For** | Large-scale batch workloads | Event-driven, short tasks |

**⚠️ EXAM TIP**: Choose Batch for "batch processing," "job dependencies," or "HPC workloads."

---

### EC2 vs. Lightsail
| Factor | EC2 | Lightsail |
|--------|-----|-----------|
| **Complexity** | Full AWS service | Simplified, beginner-friendly |
| **Pricing** | Variable (multiple factors) | Fixed monthly bundles |
| **Scalability** | Highly scalable | Limited scaling |
| **Features** | Full AWS feature set | Subset of features |
| **Integration** | Deep AWS integration | Limited AWS service integration |
| **Target User** | AWS experienced users | Beginners, small projects |

**⚠️ EXAM TIP**: Lightsail appears in scenarios with "small business," "simple," "predictable cost," or "minimal AWS experience."

---

## Common Misconceptions

### Misconception 1: "Lambda is always cheaper than EC2"
**Reality**: Lambda is cost-effective for variable or low-utilization workloads. For consistently high utilization (>50% of the time), EC2 Reserved Instances are often cheaper.

**Calculation Example**:
- Lambda: 1M invocations at 1 second each = 277 hours = ~$4.60
- EC2 t3.small: 730 hours = ~$15 (On-Demand) or ~$10 (Reserved)

For workloads running >150 hours/month, EC2 becomes more cost-effective.

---

### Misconception 2: "EKS is always better than ECS because it's Kubernetes"
**Reality**: EKS adds complexity and cost. Use EKS only when you need Kubernetes portability, have Kubernetes expertise, or require specific Kubernetes features. ECS is simpler and more cost-effective for AWS-native workloads.

**Cost Comparison**:
- ECS: $0 orchestration fees (pay only for compute)
- EKS: ~$73/month per cluster + compute costs

---

### Misconception 3: "Fargate is always more expensive than EC2"
**Reality**: While Fargate has higher per-resource costs, it eliminates waste from over-provisioning. For variable workloads or small deployments, Fargate can be more cost-effective when factoring in operational efficiency.

---

### Misconception 4: "You can't run stateful applications on containers"
**Reality**: Both ECS and EKS support persistent volumes (EBS, EFS, FSx). You can run stateful applications like databases, though managed services (RDS, DynamoDB) are usually better choices.

---

### Misconception 5: "Lambda cold starts make it unsuitable for production"
**Reality**: Cold starts typically last 1-5 seconds. For most use cases, this is acceptable. Use Provisioned Concurrency for latency-sensitive applications to eliminate cold starts.

---

### Misconception 6: "Batch is just for big data"
**Reality**: Batch is for any batch processing workload - ETL, rendering, simulations, financial modeling, log analysis, and more. It's about the pattern (batch jobs) not the data size.

---

### Misconception 7: "Lightsail is a toy service"
**Reality**: Lightsail is production-ready for appropriate use cases. It's AWS's answer to simplified hosting for small applications, offering the same underlying infrastructure as EC2 with a simplified interface.

---

## Exam Strategy: Keywords to Watch

### Lambda Indicators:
- "Event-driven"
- "Under 15 minutes"
- "Variable traffic"
- "No server management"
- "Pay per invocation"
- "S3 trigger," "DynamoDB Stream," "API Gateway"
- "Serverless"
- "Real-time processing"

### EC2 Indicators:
- "Long-running"
- "24/7"
- "Full OS control"
- "Custom kernel modules"
- "Specialized hardware" (GPU, FPGA)
- "Legacy application"
- "Lift-and-shift"
- "Predictable workload" (with Reserved Instances)
- "Root access required"

### ECS Indicators:
- "Docker containers"
- "AWS-native"
- "Microservices"
- "Not using Kubernetes"
- "Cost optimization" (vs EKS)
- "Service discovery"
- "Task definitions"

### EKS Indicators:
- "Kubernetes"
- "Multi-cloud"
- "Hybrid deployment"
- "Portability"
- "Organizational standard"
- "kubectl," "Helm"
- "StatefulSets," "DaemonSets"

### Fargate Indicators:
- "Serverless containers"
- "No infrastructure management"
- "Task isolation"
- "Variable container workloads"
- "ECS/EKS" + "serverless"

### Batch Indicators:
- "Batch processing"
- "Job dependencies"
- "Job queues"
- "HPC workloads"
- "ETL" (with complex dependencies)
- "Scheduled jobs" (with auto-provisioning)
- "Multi-node parallel"
- "Dynamic resource provisioning"

### Lightsail Indicators:
- "Simple application"
- "Small business"
- "Predictable pricing"
- "Minimal AWS experience"
- "WordPress," "LAMP stack"
- "Fixed monthly cost"
- "Learning AWS"

---

## Quick Reference Cheat Sheet

### Execution Time Limits
| Service | Maximum Execution Time |
|---------|------------------------|
| Lambda | 15 minutes |
| EC2 | Unlimited |
| ECS/EKS | Unlimited |
| Fargate | Unlimited |
| Batch | Unlimited |
| Lightsail | Unlimited |

### Pricing Models
| Service | Pricing Model |
|---------|---------------|
| Lambda | Per invocation + GB-seconds |
| EC2 | Per hour/second (instance type) |
| ECS | Underlying compute only (EC2 or Fargate) |
| EKS | $0.10/hour per cluster + compute |
| Fargate | Per second (vCPU + memory) |
| Batch | Underlying compute only |
| Lightsail | Fixed monthly bundles |

### Management Overhead (Low to High)
1. **Lambda** - Lowest (fully managed)
2. **Lightsail** - Very Low (simplified)
3. **Fargate** - Low (serverless containers)
4. **Batch** - Low (purpose-built)
5. **ECS** - Medium (container orchestration)
6. **EC2** - High (full instance management)
7. **EKS** - Highest (Kubernetes + infrastructure)

### Scaling Characteristics
| Service | Scaling Type | Speed | Limit |
|---------|--------------|-------|-------|
| Lambda | Automatic | Instant | 1000 concurrent (soft limit) |
| EC2 | Auto Scaling Groups | Minutes | Account limits |
| ECS | Service auto scaling | Minutes | Cluster capacity |
| EKS | HPA + Cluster Autoscaler | Minutes | Cluster capacity |
| Fargate | Automatic per task | Seconds | Account limits |
| Batch | Job-based automatic | Minutes | Account limits |
| Lightsail | Manual/limited auto | Minutes | Instance limits |

### Memory Limits
| Service | Minimum | Maximum |
|---------|---------|---------|
| Lambda | 128 MB | 10 GB |
| EC2 | Varies by type | 24 TB (u-24tb1.metal) |
| ECS (Fargate) | 512 MB | 30 GB |
| EKS (Fargate) | 512 MB | 120 GB |
| Batch | Depends on compute | Depends on compute |
| Lightsail | 512 MB | 32 GB |

### Storage Options
| Service | Ephemeral Storage | Persistent Storage |
|---------|-------------------|-------------------|
| Lambda | /tmp (512 MB - 10 GB) | EFS |
| EC2 | Instance Store | EBS, EFS, FSx |
| ECS | Task ephemeral | EBS, EFS, FSx |
| EKS | Pod ephemeral | EBS, EFS, FSx |
| Fargate | 20-200 GB ephemeral | EFS, FSx |
| Batch | Depends on compute | EFS, S3 |
| Lightsail | N/A | Included SSD storage |

### Cost Optimization Strategies
| Service | Strategy |
|---------|----------|
| Lambda | Right-size memory, use Provisioned Concurrency selectively |
| EC2 | Reserved Instances for steady workloads, Spot for flexible |
| ECS | Use EC2 launch type for predictable loads |
| EKS | Cluster consolidation, Fargate Spot |
| Fargate | Use Fargate Spot, right-size task resources |
| Batch | Use Spot Instances in compute environments |
| Lightsail | Choose appropriate bundle size |

---

## Real-World Examples

### Example 1: Netflix-Style Video Streaming Platform
**Architecture**:
- **EC2 Auto Scaling Groups**: Origin servers for video content (24/7 availability)
- **Lambda**: Thumbnail generation when videos are uploaded to S3
- **ECS on Fargate**: Transcoding pipeline for converting videos to multiple formats
- **CloudFront + Lambda@Edge**: Edge computing for personalization

**Why this mix?**:
- EC2 for consistent, high-traffic origin servers (cost-effective with Reserved Instances)
- Lambda for event-driven thumbnail creation (variable frequency)
- Fargate for transcoding (variable workload, no infrastructure management)

---

### Example 2: Financial Trading Platform
**Architecture**:
- **EC2 with Enhanced Networking**: Ultra-low latency trading engine
- **Batch**: End-of-day risk analysis and reporting
- **Lambda**: Real-time trade validation and notification
- **ECS**: Market data processing microservices

**Why this mix?**:
- EC2 for latency-critical trading (specialized instances, dedicated tenancy)
- Batch for resource-intensive nightly computations
- Lambda for quick validations and alerts
- ECS for scalable microservices processing market data

---

### Example 3: E-Commerce Platform
**Architecture**:
- **Lambda**: Product search API (API Gateway + Lambda)
- **ECS on Fargate**: Order processing microservices
- **EC2**: Legacy inventory management system (lift-and-shift)
- **Batch**: Nightly sales reporting and analytics

**Why this mix?**:
- Lambda for search API (variable traffic, pay-per-use)
- Fargate for order processing (containerized, auto-scaling)
- EC2 for legacy system (minimal changes during migration)
- Batch for scheduled analytics jobs

---

### Example 4: Scientific Research Lab
**Architecture**:
- **Batch with Spot Instances**: Protein folding simulations (thousands of parallel jobs)
- **EFS**: Shared file system for research data
- **Lambda**: Data ingestion from lab instruments
- **Lightsail**: Internal lab wiki and documentation

**Why this mix?**:
- Batch + Spot for cost-effective large-scale parallel computing
- EFS for shared access to datasets
- Lambda for automated data collection
- Lightsail for simple internal tools

---

### Example 5: SaaS Application Startup
**Architecture**:
- **ECS on Fargate**: Multi-tenant application (isolated tasks per tenant)
- **Lambda**: Background job processing (email, notifications)
- **RDS**: PostgreSQL database
- **CloudFront + S3**: Static website hosting

**Why this mix?**:
- Fargate for easy deployment and scaling without infrastructure management
- Lambda for async background tasks
- Focus on application development, not infrastructure

---

## Advanced Considerations for Solutions Architect Professional

### Cross-Service Integration Patterns

#### Pattern 1: Event-Driven Architecture
**Components**:
- EventBridge (central event bus)
- Lambda (event processors)
- ECS/Fargate (long-running consumers)
- SQS/SNS (decoupling)

**Use Case**: Order processing system where different microservices react to order events.

---

#### Pattern 2: Hybrid Compute
**Components**:
- ECS Anywhere / EKS Anywhere (on-premises)
- AWS Outposts (local AWS infrastructure)
- Lambda with VPN (extend to on-premises)

**Use Case**: Gradual cloud migration while maintaining on-premises workloads.

---

#### Pattern 3: Batch + Real-Time Processing
**Components**:
- Lambda (real-time ingestion)
- Kinesis Data Streams (streaming buffer)
- Batch (heavy analytical processing)
- S3 (data lake)

**Use Case**: IoT data pipeline with real-time alerts and batch analytics.

---

### Cost Optimization Strategies

#### Compute Savings Plans
- **EC2 Instance Savings Plans**: Commit to specific instance family
- **Compute Savings Plans**: Flexibility across EC2, Fargate, Lambda
- **Savings**: Up to 72% vs On-Demand

**⚠️ EXAM TIP**: Compute Savings Plans provide the most flexibility across compute services.

---

#### Spot Instance Strategies
**Services Supporting Spot**:
- EC2: Spot Instances (up to 90% savings)
- ECS: EC2 Spot instances in clusters
- EKS: Spot node groups
- Fargate: Fargate Spot (70% savings)
- Batch: Spot compute environments

**Best Practices**:
- Use for fault-tolerant workloads
- Implement graceful shutdown (2-minute warning)
- Diversify instance types for availability

---

#### Right-Sizing Recommendations
- Use **AWS Compute Optimizer** for EC2, Lambda, ECS/Fargate recommendations
- Monitor CloudWatch metrics (CPU, memory, network)
- Start larger, then optimize down
- Regular review (monthly/quarterly)

---

### Security Considerations

#### IAM Roles for Compute Services
| Service | IAM Concept |
|---------|-------------|
| EC2 | Instance Profile (IAM role attached to instance) |
| Lambda | Execution Role (assumed by function) |
| ECS | Task Role (per task) + Execution Role (ECS agent) |
| EKS | IRSA (IAM Roles for Service Accounts) |
| Fargate | Task Role + Execution Role |
| Batch | Job Role |

**⚠️ EXAM TIP**: Understand the difference between Task Role (application permissions) and Execution Role (ECS agent permissions) for ECS/Fargate.

---

#### Network Isolation
- **Lambda**: VPC integration for private resource access
- **EC2**: Security groups, NACLs, VPC isolation
- **ECS/EKS**: Task/pod-level security groups
- **Fargate**: Each task gets its own ENI for isolation

---

#### Secrets Management
- **AWS Secrets Manager**: Automatic rotation, auditing
- **Systems Manager Parameter Store**: Simple key-value storage
- **Lambda**: Native integration via environment variables
- **ECS/EKS**: Secrets as environment variables or mounted volumes

---

### High Availability and Disaster Recovery

#### Multi-AZ Deployment Strategies
| Service | HA Strategy |
|---------|-------------|
| EC2 | Auto Scaling Groups across AZs |
| Lambda | Automatically multi-AZ |
| ECS | Service deployment across AZs |
| EKS | Control plane is multi-AZ, deploy pods across AZs |
| Fargate | Automatic distribution |
| Batch | Compute environments can span AZs |

---

#### Regional Failover
- **EC2**: AMI copying, Route 53 health checks
- **Lambda**: Deploy to multiple regions, Route 53 routing
- **ECS/EKS**: Multi-region clusters with Route 53 failover
- **Batch**: Multi-region job queues

---

### Monitoring and Observability

#### CloudWatch Integration
| Service | Metrics | Logs | Insights |
|---------|---------|------|----------|
| EC2 | Basic + detailed | CloudWatch agent | Container Insights |
| Lambda | Invocations, duration, errors | Lambda logs | Lambda Insights |
| ECS | Task-level metrics | awslogs driver | Container Insights |
| EKS | Node + pod metrics | Fluent Bit/Fluentd | Container Insights |
| Fargate | Task-level metrics | awslogs driver | Container Insights |
| Batch | Job metrics | CloudWatch logs | N/A |

**⚠️ EXAM TIP**: Container Insights provides enhanced monitoring for ECS, EKS, and Fargate.

---

#### Distributed Tracing
- **AWS X-Ray**: Lambda (native), EC2 (agent), ECS/EKS (sidecar)
- Use for troubleshooting microservices architectures
- Identify performance bottlenecks

---

### Migration Strategies

#### The 6 Rs of Migration
1. **Rehost (Lift and Shift)**: EC2, Lightsail
2. **Replatform**: ECS, RDS (minimal changes)
3. **Refactor**: Lambda, Fargate (cloud-native)
4. **Repurchase**: SaaS alternatives
5. **Retire**: Decommission
6. **Retain**: Keep on-premises

**Compute Service Selection**:
- **Rehost**: EC2 (quickest path)
- **Replatform**: ECS if containerizing
- **Refactor**: Lambda for event-driven, Fargate for containers

---

## Exam Prep: Practice Scenarios

### Scenario A: Cost Optimization
**Question**: A company runs 20 microservices on ECS with Fargate. Each service averages 70% CPU utilization 24/7. The CTO wants to reduce compute costs by 40%. What should you recommend?

**Answer**: Migrate to ECS on EC2 with Reserved Instances or Compute Savings Plan. At 70% sustained utilization, EC2 is more cost-effective than Fargate, and Reserved Instances provide additional savings.

---

### Scenario B: Latency Sensitivity
**Question**: A trading application requires sub-millisecond latency between compute and database. The application processes trades 24/7. Which compute service should you use?

**Answer**: EC2 with cluster placement group and enhanced networking. Lambda has cold starts, and containerized options add latency. EC2 with optimized networking provides the lowest latency.

---

### Scenario C: Compliance and Isolation
**Question**: A healthcare application must ensure complete isolation between patient data. Each patient's data processing must run in an isolated environment. The processing is triggered by form submissions and takes 5-10 minutes.

**Answer**: ECS/Fargate or Lambda with VPC isolation. Fargate provides task-level isolation with dedicated ENI per task. Lambda provides function-level isolation. Given the 5-10 minute duration (under 15 minutes), either works, but Fargate provides stronger isolation guarantees.

---

### Scenario D: Multi-Region Active-Active
**Question**: An e-commerce platform needs to run active-active in two regions for disaster recovery. The application uses containers and requires automatic failover with Route 53.

**Answer**: ECS or EKS with services deployed in both regions, Application Load Balancers in each region, and Route 53 with health checks for automatic failover. Choose ECS for simplicity or EKS if Kubernetes is required.

---

### Scenario E: Machine Learning Inference
**Question**: A company needs to run ML inference on images uploaded to S3. Inference takes 30 seconds per image using a custom TensorFlow model. They receive 1000-5000 images per day at unpredictable times.

**Answer**: Lambda with container image support (up to 10 GB). The unpredictable, event-driven nature and execution time under 15 minutes make Lambda ideal. Use container images to package the TensorFlow model.

---

## Final Exam Tips

### Time Allocation Strategy
1. **Read carefully**: Identify key requirements and constraints
2. **Eliminate wrong answers**: Remove obviously incorrect options
3. **Identify keywords**: Look for service-specific indicators
4. **Consider cost**: When multiple options work, choose the most cost-effective
5. **Think operational overhead**: Prefer managed services when requirements permit

### Common Traps
1. **Over-engineering**: Don't choose complex solutions (EKS) when simple ones work (ECS, Lambda)
2. **Ignoring constraints**: Pay attention to execution time limits, memory requirements
3. **Missing keywords**: "Kubernetes" = EKS, "event-driven" = Lambda
4. **Cost blindness**: Consider both upfront and ongoing operational costs
5. **Portability assumptions**: Don't assume portability is always required

### Quick Decision Matrix
```
Event-driven + <15 min? → Lambda
Containers + Kubernetes? → EKS
Containers + AWS-native? → ECS
Serverless containers? → Fargate
Batch processing? → Batch
Long-running + full control? → EC2
Simple + beginner? → Lightsail
```

---

## Summary

AWS provides a comprehensive compute portfolio for every workload type. Success on the Solutions Architect Professional exam requires understanding not just what each service does, but when to use it and why. Focus on:

1. **Execution time constraints** (Lambda's 15-minute limit)
2. **Management overhead** (serverless vs. managed vs. self-managed)
3. **Cost implications** (variable vs. steady-state workloads)
4. **Architectural patterns** (event-driven, microservices, batch)
5. **Organizational requirements** (Kubernetes standard, multi-cloud)

The exam will present scenarios requiring you to balance technical requirements, cost, operational complexity, and business constraints. Use this comparison as a foundation for understanding the trade-offs between AWS compute services.

**Remember**: There's rarely a single "correct" answer—choose the **best** option given the specific requirements and constraints in each scenario.

---

*Last Updated: 2025-11-20*
*For AWS Solutions Architect Professional Exam Preparation*
