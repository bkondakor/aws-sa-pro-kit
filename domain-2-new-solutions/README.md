---
title: "Domain 2: Design for New Solutions"
domain: 2
domain_name: "Design for New Solutions"
weight: "29%"
exam_questions: "~22 out of 75"
file_type: "domain-overview"
exam_topics:
  - deployment-strategy
  - business-continuity
  - security-controls
  - reliability
  - performance
  - cost-optimization
status: complete
last_updated: "2025-11-18"
---

# Domain 2: Design for New Solutions (29%)

## Overview

Domain 2 focuses on designing robust, scalable, and secure solutions for new workloads on AWS. This domain represents **29% of the SAP-C02 exam** (the highest weight) and tests your ability to:
- Design deployment strategies that meet business requirements
- Ensure business continuity through proper architecture
- Implement appropriate security controls
- Meet reliability requirements through resilient design
- Optimize performance across all layers
- Balance cost with performance and reliability

---

## Domain Structure

### Task Statements

1. **Task 2.1: Design a deployment strategy to meet business requirements** (~17% of domain)
2. **Task 2.2: Design a solution to ensure business continuity** (~17% of domain)
3. **Task 2.3: Determine security controls based on requirements** (~16% of domain)
4. **Task 2.4: Design a strategy to meet reliability requirements** (~17% of domain)
5. **Task 2.5: Design a solution to meet performance objectives** (~17% of domain)
6. **Task 2.6: Determine a cost optimization strategy** (~16% of domain)

---

## Study Materials

### Deep Dive Guides
- [Task 2.1 - Deployment Strategy](./task-2.1-deployment-strategy.md)
- [Task 2.2 - Business Continuity](./task-2.2-business-continuity.md)
- [Task 2.3 - Security Controls](./task-2.3-security-controls.md)
- [Task 2.4 - Reliability Requirements](./task-2.4-reliability-requirements.md)
- [Task 2.5 - Performance Objectives](./task-2.5-performance-objectives.md)
- [Task 2.6 - Cost Optimization](./task-2.6-cost-optimization.md)

### Practice Materials
- [Tricky Scenarios & Edge Cases](./tricky-scenarios.md)
- [Service Comparison Matrix](./service-comparisons.md)
- [Hands-On Labs](./hands-on-labs.md)

---

## Key AWS Services for Domain 2

### Compute Services
- **Amazon EC2** - Virtual servers with various instance types and families
- **AWS Lambda** - Serverless compute for event-driven workloads
- **Amazon ECS** - Container orchestration (AWS-native)
- **Amazon EKS** - Managed Kubernetes service
- **AWS Fargate** - Serverless container compute
- **AWS Batch** - Batch computing at any scale
- **AWS App Runner** - Deploy containerized web apps without infrastructure management
- **AWS Elastic Beanstalk** - PaaS for web applications

### Storage Services
- **Amazon S3** - Object storage with multiple storage classes
  - S3 Standard, S3 Intelligent-Tiering, S3 Standard-IA, S3 One Zone-IA
  - S3 Glacier Instant Retrieval, S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive
- **Amazon EBS** - Block storage for EC2 instances
  - gp3/gp2 (General Purpose SSD), io2/io1 (Provisioned IOPS SSD)
  - st1 (Throughput Optimized HDD), sc1 (Cold HDD)
- **Amazon EFS** - Elastic file system (NFS)
- **Amazon FSx** - Managed file systems
  - FSx for Windows File Server, FSx for Lustre, FSx for NetApp ONTAP, FSx for OpenZFS
- **AWS Storage Gateway** - Hybrid cloud storage integration
- **AWS Backup** - Centralized backup service

### Database Services
- **Amazon RDS** - Managed relational databases
  - MySQL, PostgreSQL, MariaDB, Oracle, SQL Server
  - Multi-AZ deployments, Read Replicas, automated backups
- **Amazon Aurora** - MySQL and PostgreSQL-compatible database
  - Aurora Provisioned, Aurora Serverless v2, Aurora Global Database
- **Amazon DynamoDB** - NoSQL key-value and document database
  - DynamoDB Standard, DynamoDB Standard-IA, DynamoDB Global Tables
- **Amazon ElastiCache** - In-memory caching
  - Redis (persistence, complex data structures, pub/sub)
  - Memcached (simple caching, multi-threaded)
- **Amazon MemoryDB for Redis** - Redis-compatible, durable, in-memory database
- **Amazon Neptune** - Graph database
- **Amazon DocumentDB** - MongoDB-compatible document database
- **Amazon Timestream** - Time series database
- **Amazon Keyspaces** - Cassandra-compatible database
- **Amazon QLDB** - Ledger database with immutable journal

### Networking & Content Delivery
- **Amazon VPC** - Virtual private cloud networking
- **Elastic Load Balancing**
  - Application Load Balancer (ALB) - Layer 7, HTTP/HTTPS
  - Network Load Balancer (NLB) - Layer 4, TCP/UDP, ultra-low latency
  - Gateway Load Balancer (GWLB) - Layer 3, third-party virtual appliances
- **Amazon Route 53** - DNS and traffic management
  - Health checks, routing policies (simple, weighted, latency, failover, geolocation, geoproximity, multi-value)
- **Amazon CloudFront** - Content delivery network (CDN)
- **AWS Global Accelerator** - Network performance optimization using AWS global network
- **Amazon API Gateway** - RESTful and WebSocket APIs
- **AWS App Mesh** - Service mesh for microservices
- **AWS PrivateLink** - Private connectivity to services

### Integration & Messaging
- **Amazon SQS** - Managed message queuing
  - Standard queues (best-effort ordering, at-least-once delivery)
  - FIFO queues (strict ordering, exactly-once processing)
- **Amazon SNS** - Pub/sub messaging and mobile notifications
- **Amazon EventBridge** - Serverless event bus
- **AWS Step Functions** - Serverless workflow orchestration
- **Amazon MQ** - Managed message brokers (ActiveMQ, RabbitMQ)
- **AWS AppSync** - Managed GraphQL service
- **Amazon Kinesis** - Real-time data streaming
  - Kinesis Data Streams, Kinesis Data Firehose, Kinesis Data Analytics

### DevOps & Deployment
- **AWS CloudFormation** - Infrastructure as Code (IaC)
- **AWS CDK** - Cloud Development Kit for IaC using programming languages
- **AWS CodePipeline** - Continuous delivery service
- **AWS CodeBuild** - Managed build service
- **AWS CodeDeploy** - Automated deployment service
  - Supports EC2, Lambda, ECS, on-premises
  - Deployment configurations: AllAtOnce, HalfAtATime, OneAtATime, Canary, Linear
- **AWS Systems Manager** - Operations management
  - Parameter Store, Session Manager, Patch Manager, Run Command, State Manager

### Monitoring & Observability
- **Amazon CloudWatch** - Monitoring and observability
  - Metrics, Logs, Events, Alarms, Dashboards
  - CloudWatch Logs Insights, CloudWatch Contributor Insights
- **AWS X-Ray** - Distributed tracing
- **AWS CloudTrail** - API activity logging and governance

### Security Services
- **AWS KMS** - Key management service
- **AWS Secrets Manager** - Secrets rotation and management
- **AWS WAF** - Web application firewall
- **AWS Shield** - DDoS protection
  - Shield Standard (automatic, free), Shield Advanced (enhanced, paid)
- **Amazon GuardDuty** - Threat detection
- **AWS Security Hub** - Security posture management
- **AWS Certificate Manager (ACM)** - SSL/TLS certificate management

---

## Critical Concepts to Master

### 1. Deployment Strategies

Understanding different deployment patterns and when to use each:

| Strategy | Risk | Speed | Rollback | Cost | Best For |
|----------|------|-------|----------|------|----------|
| **All-at-Once** | High | Fast | Difficult | Low | Dev/test, small applications |
| **Rolling** | Medium | Medium | Medium | Low | Standard production deployments |
| **Blue/Green** | Low | Fast (switch) | Instant | High (2x resources) | Zero-downtime requirements |
| **Canary** | Very Low | Slow | Easy | Medium | Risk-averse, gradual rollout |
| **Linear** | Low | Slow | Easy | Medium | Steady traffic shift |
| **Immutable** | Low | Slow | Instant | High (temp resources) | Configuration changes |

**Key Decision Factors:**
- **Downtime tolerance** - Zero downtime requires Blue/Green or Rolling
- **Risk tolerance** - Lower risk needs Canary or Linear
- **Cost constraints** - All-at-Once and Rolling are most cost-effective
- **Rollback requirements** - Blue/Green has instant rollback
- **Traffic management** - Canary/Linear provide fine-grained control

### 2. RTO and RPO Requirements

**Recovery Time Objective (RTO):** Maximum acceptable downtime
**Recovery Point Objective (RPO):** Maximum acceptable data loss

| Pattern | RTO | RPO | Cost | Use Case |
|---------|-----|-----|------|----------|
| **Backup & Restore** | Hours | Hours | $ | Cost-sensitive, non-critical |
| **Pilot Light** | 10s of minutes | Minutes | $$ | Small critical systems |
| **Warm Standby** | Minutes | Seconds | $$$ | Business-critical applications |
| **Multi-Site Active/Active** | Real-time | Near-zero | $$$$ | Mission-critical, no tolerance |

**Implementation Patterns:**

**Backup & Restore:**
- S3 for data backups, AMIs for EC2 instances
- AWS Backup for centralized backup management
- Restore when disaster occurs
- **RTO:** 4-24 hours, **RPO:** Hours

**Pilot Light:**
- Core infrastructure running in DR region (minimal)
- Data replication active (RDS read replicas, DynamoDB global tables)
- Scale up infrastructure when disaster occurs
- **RTO:** 10-30 minutes, **RPO:** Minutes

**Warm Standby:**
- Scaled-down but fully functional environment in DR region
- Continuous data replication
- Scale up when disaster occurs
- **RTO:** Minutes, **RPO:** Seconds

**Multi-Site Active/Active:**
- Full production environment in multiple regions
- Active-active data replication
- Route 53 health checks with automatic failover
- **RTO:** Seconds, **RPO:** Near-zero

### 3. Load Balancer Selection

Critical for the exam - know when to use each type:

| Type | OSI Layer | Protocol | Use Cases | Features |
|------|-----------|----------|-----------|----------|
| **ALB** | Layer 7 | HTTP/HTTPS | Web apps, microservices, containers | Content-based routing, host/path routing, Lambda targets, authentication |
| **NLB** | Layer 4 | TCP/UDP/TLS | High performance, static IP, non-HTTP | Ultra-low latency, millions of req/sec, static IP, PrivateLink |
| **GWLB** | Layer 3 | IP | Third-party appliances (firewalls, IDS/IPS) | Transparent network gateway, GENEVE protocol |
| **CLB** | Layer 4/7 | HTTP/TCP | Legacy (use ALB/NLB instead) | Classic (being phased out) |

**Decision Tree:**
- Need content-based routing, path-based routing, or host-based routing? → **ALB**
- Need to terminate SSL? → **ALB or NLB**
- Need static IP addresses or Elastic IPs? → **NLB**
- Need extreme performance (millions of requests per second)? → **NLB**
- Need to integrate third-party virtual appliances? → **GWLB**
- Need to route traffic based on URL path or host header? → **ALB**
- Need WebSocket support? → **ALB or NLB**
- Need to invoke Lambda functions? → **ALB**

### 4. Database Selection Framework

**Relational (ACID requirements):**
- **RDS MySQL/PostgreSQL** - General-purpose relational
- **Aurora** - High performance, MySQL/PostgreSQL compatible
  - 3x-5x faster than RDS MySQL/PostgreSQL
  - Up to 128 TB storage, 15 read replicas
  - Aurora Serverless v2 for variable workloads
- **RDS Oracle/SQL Server** - Enterprise database requirements

**NoSQL (Flexible schema, horizontal scaling):**
- **DynamoDB** - Key-value, microsecond latency, serverless
- **DocumentDB** - MongoDB-compatible
- **Keyspaces** - Cassandra-compatible
- **Neptune** - Graph relationships

**Caching:**
- **ElastiCache Redis** - Complex data structures, persistence, pub/sub, replication
- **ElastiCache Memcached** - Simple caching, multi-threaded
- **MemoryDB for Redis** - Durable Redis with microsecond reads, single-digit millisecond writes
- **DynamoDB DAX** - DynamoDB-specific caching (microsecond latency)

**Specialized:**
- **Timestream** - Time series data (IoT, DevOps, analytics)
- **QLDB** - Immutable, cryptographically verifiable ledger
- **Neptune** - Graph queries, relationships

**Decision Factors:**
- **Query patterns** - Known queries (DynamoDB), complex queries (RDS/Aurora)
- **Scale requirements** - Massive scale (DynamoDB), moderate (Aurora), small (RDS)
- **Consistency needs** - Strong consistency (RDS/Aurora), eventual ok (DynamoDB)
- **Data structure** - Relational (RDS/Aurora), document (DocumentDB), key-value (DynamoDB)

### 5. Caching Strategies

**Multi-Layer Caching Approach:**

1. **Edge Caching (CloudFront)**
   - Static content (images, CSS, JS, videos)
   - Dynamic content with TTL
   - Lambda@Edge for edge compute
   - Use when: Global users, static/semi-static content

2. **Application Load Balancer Caching**
   - Limited built-in caching (sticky sessions)
   - Use CloudFront in front of ALB for better caching

3. **Application-Level Caching (ElastiCache/DAX)**
   - Database query results
   - Session data
   - Computed data
   - Use when: Reduce database load, improve response time

4. **Database Caching**
   - RDS read replicas (read scaling)
   - Aurora read replicas (up to 15)
   - DynamoDB DAX (microsecond latency)
   - Use when: Read-heavy workloads

**Cache Invalidation Strategies:**
- **TTL-based** - Simple, can serve stale data
- **Event-driven** - CloudFront invalidation via Lambda
- **Write-through** - Update cache on write
- **Write-behind** - Async cache update

**Cache Hit Ratio Targets:**
- 80%+ is good
- 90%+ is excellent
- <70% may indicate poor cache key design or TTL settings

### 6. Auto Scaling Strategies

**Types of Scaling:**

**Target Tracking Scaling (Recommended):**
- Maintain a specific metric target (e.g., CPU at 70%)
- Automatically adjusts capacity
- Simple to configure
- **Best for:** Most use cases

**Step Scaling:**
- Add/remove capacity based on CloudWatch alarms
- Different actions for different thresholds
- **Best for:** Complex scaling requirements

**Scheduled Scaling:**
- Scale based on predictable patterns
- Time-based scaling actions
- **Best for:** Known traffic patterns (business hours)

**Predictive Scaling:**
- ML-based forecasting
- Proactive scaling before traffic arrives
- **Best for:** Recurring traffic patterns

**Key Configuration Options:**
- **Cooldown periods** - Prevent thrashing (default 300 seconds)
- **Warm-up time** - Allow instances to fully initialize before receiving traffic
- **Health check grace period** - Time before health checks start
- **Scaling policies** - Min, max, desired capacity

**Best Practices:**
- Use target tracking for CPU, network, or request count
- Combine scheduled scaling with target tracking
- Set appropriate cooldown periods (longer for app startup)
- Use multiple metrics for more robust scaling
- Test scaling policies under load

### 7. Storage Selection Guide

**Block Storage (EBS):**
- **gp3** - General purpose, cost-effective, 3,000-16,000 IOPS
- **gp2** - Legacy general purpose, IOPS scales with size
- **io2/io1** - Provisioned IOPS, up to 64,000 IOPS, 99.999% durability
- **st1** - Throughput optimized, big data, data warehouses
- **sc1** - Cold storage, infrequently accessed

**File Storage:**
- **EFS** - Elastic file system, Linux, NFS, automatic scaling
  - Standard, Infrequent Access (IA) storage classes
  - Regional availability (Multi-AZ)
- **FSx for Windows** - Windows file server, SMB, Active Directory integration
- **FSx for Lustre** - High-performance computing, machine learning, POSIX-compliant
- **FSx for NetApp ONTAP** - NetApp features, multi-protocol (NFS, SMB, iSCSI)
- **FSx for OpenZFS** - OpenZFS file system, up to 1 million IOPS

**Object Storage (S3):**
- **S3 Standard** - Frequently accessed, low latency
- **S3 Intelligent-Tiering** - Automatic tiering, unknown access patterns
- **S3 Standard-IA** - Infrequent access, lower cost than Standard
- **S3 One Zone-IA** - Single AZ, 20% cheaper than Standard-IA
- **S3 Glacier Instant Retrieval** - Archive, millisecond retrieval
- **S3 Glacier Flexible Retrieval** - Archive, minutes-hours retrieval
- **S3 Glacier Deep Archive** - Lowest cost, 12-hour retrieval

**Decision Matrix:**
- **Need file system interface?** → EFS or FSx
- **Windows workloads?** → FSx for Windows
- **High-performance computing?** → FSx for Lustre
- **Database storage?** → EBS (io2 for high IOPS)
- **Web content, backups, data lakes?** → S3
- **Shared file system across instances?** → EFS or FSx
- **Single instance only?** → EBS

### 8. Serverless vs Containers vs EC2

**Decision Framework:**

| Factor | Lambda | Fargate | ECS on EC2 | EKS | EC2 |
|--------|--------|---------|------------|-----|-----|
| **Management** | Lowest | Low | Medium | High | Highest |
| **Cost (idle)** | $0 | Per task | Per instance | Per instance | Per instance |
| **Cold start** | 100ms-few sec | 0 | 0 | 0 | 0 |
| **Max duration** | 15 min | Unlimited | Unlimited | Unlimited | Unlimited |
| **Scaling speed** | Fastest | Fast | Medium | Medium | Slow |
| **State** | Stateless | Can be stateful | Can be stateful | Can be stateful | Stateful |

**Use Lambda when:**
- Event-driven, short-duration workloads
- Variable traffic with idle periods
- Want zero management overhead
- Execution time < 15 minutes
- Stateless operations

**Use Fargate when:**
- Long-running containers
- Want serverless containers
- Don't want to manage EC2 instances
- Batch jobs, microservices

**Use ECS on EC2 when:**
- Need more control over instances
- High utilization workloads (cost-effective)
- Specific instance type requirements
- Reserved Instance or Savings Plans

**Use EKS when:**
- Need Kubernetes ecosystem
- Multi-cloud or hybrid strategy
- Complex orchestration requirements
- Large team with K8s experience

**Use EC2 when:**
- Legacy applications
- Licensing requirements (BYOL)
- Specific hardware or GPU requirements
- Long-running, stateful workloads

---

## Exam Focus Areas

### Heavily Tested Topics
1. **Load balancer selection** - ALB vs NLB vs GWLB use cases
2. **Deployment strategies** - Blue/Green vs Canary vs Rolling
3. **RTO/RPO** - Disaster recovery pattern selection
4. **Database selection** - RDS vs Aurora vs DynamoDB matching
5. **Caching strategies** - Multi-layer caching implementation
6. **Auto Scaling** - Policies, cooldowns, and target tracking
7. **Storage classes** - S3, EBS, EFS, FSx selection criteria
8. **Serverless patterns** - Lambda vs Fargate vs EC2 trade-offs
9. **Multi-Region architecture** - Route 53 failover, global tables
10. **Cost optimization** - Right-sizing, reserved capacity, storage tiering

### Common Tricky Scenarios
1. **When to use ALB vs NLB** - Protocol and feature requirements
2. **Aurora vs DynamoDB** - Relational vs NoSQL decision factors
3. **ElastiCache Redis vs Memcached** - Feature differences
4. **EFS vs FSx variants** - File system selection by workload
5. **Lambda timeout and memory** - Performance tuning
6. **RDS Multi-AZ vs Read Replicas** - HA vs read scaling
7. **CloudFront vs Global Accelerator** - HTTP vs TCP/UDP
8. **SQS Standard vs FIFO** - Ordering and deduplication
9. **Step Functions vs SWF** - Modern vs legacy orchestration
10. **Blue/Green vs Canary** - Instant switch vs gradual rollout

### Services Often Confused

| Service Pair | Key Differentiator |
|--------------|-------------------|
| **ALB vs NLB** | Layer 7 (HTTP) vs Layer 4 (TCP/UDP), features vs performance |
| **Aurora vs RDS** | Higher performance, more features, but higher cost |
| **DynamoDB vs Aurora** | NoSQL serverless vs relational managed service |
| **ElastiCache Redis vs Memcached** | Persistence, data structures, replication vs simple caching |
| **EFS vs FSx for Lustre** | General purpose file system vs HPC-optimized |
| **Lambda vs Fargate** | Function-based, 15-min limit vs container-based, unlimited |
| **SQS vs SNS** | Queue (pull) vs pub/sub (push) |
| **SQS vs Kinesis** | Message queue vs streaming data |
| **EventBridge vs SNS** | Event bus, filtering vs simple pub/sub |
| **Step Functions vs SWF** | Modern serverless orchestration vs legacy |
| **CloudFront vs Global Accelerator** | CDN for HTTP/HTTPS vs TCP/UDP acceleration |
| **S3 Standard-IA vs One Zone-IA** | Multi-AZ vs single AZ (20% cheaper) |
| **Blue/Green vs Canary** | Instant switch vs gradual traffic shift |

---

## Study Approach for Domain 2

### Week 1: Compute & Deployment
- [ ] Study EC2 instance types, families, and placement strategies
- [ ] Learn Lambda functions, triggers, and performance tuning
- [ ] Understand ECS vs EKS vs Fargate
- [ ] Deep dive into deployment strategies (Blue/Green, Canary, Rolling)
- [ ] Practice: Deploy application using CodeDeploy with different strategies

### Week 2: Storage & Database
- [ ] Master S3 storage classes and lifecycle policies
- [ ] Study EBS types and use cases
- [ ] Learn EFS vs FSx variants
- [ ] Deep dive into RDS, Aurora, and DynamoDB
- [ ] Practice: Set up RDS Multi-AZ with read replicas, configure DynamoDB

### Week 3: Networking & Content Delivery
- [ ] Study VPC networking fundamentals
- [ ] Master load balancer types (ALB, NLB, GWLB)
- [ ] Learn Route 53 routing policies and health checks
- [ ] Understand CloudFront and Global Accelerator
- [ ] Practice: Create multi-tier VPC with load balancers

### Week 4: Reliability & Performance
- [ ] Study disaster recovery patterns (Backup & Restore to Multi-Site)
- [ ] Learn Auto Scaling strategies
- [ ] Understand caching strategies across all layers
- [ ] Master RTO/RPO calculations
- [ ] Practice: Implement multi-region architecture with failover

### Week 5: Security & Integration
- [ ] Study encryption (KMS, CloudHSM)
- [ ] Learn WAF, Shield, and DDoS mitigation
- [ ] Understand SQS, SNS, EventBridge, Kinesis
- [ ] Master API Gateway and Step Functions
- [ ] Practice: Build event-driven architecture with SQS and Lambda

### Week 6: Cost Optimization & Practice
- [ ] Study cost optimization strategies
- [ ] Learn Reserved Instances, Savings Plans, Spot Instances
- [ ] Understand storage tiering and lifecycle policies
- [ ] Complete 150+ practice questions for Domain 2
- [ ] Practice: Build complete multi-tier application with all components

---

## Quick Reference Tables

### Compute Service Comparison

| Service | Type | Management | Scaling | Cost Model | Best For |
|---------|------|------------|---------|------------|----------|
| **EC2** | VMs | Self-managed | Manual/Auto Scaling | Per hour/second | Full control, persistent |
| **Lambda** | Functions | Fully managed | Automatic | Per request + duration | Event-driven, sporadic |
| **Fargate** | Containers | Fully managed | Manual/Service Auto Scaling | Per vCPU/memory/duration | Containers, no instance mgmt |
| **ECS on EC2** | Containers | Self-managed infra | Cluster Auto Scaling | Per EC2 instance | Cost-optimized containers |
| **EKS** | Kubernetes | Managed control plane | K8s-based | Per hour + EC2/Fargate | Kubernetes workloads |
| **Elastic Beanstalk** | PaaS | Fully managed | Automatic | Per underlying resource | Quick app deployment |
| **App Runner** | Containers | Fully managed | Automatic | Per vCPU/memory + requests | Simple container apps |

### Database Service Comparison

| Service | Type | Scaling | Consistency | Use Cases |
|---------|------|---------|-------------|-----------|
| **RDS** | Relational | Vertical (instance size) | Strong (ACID) | Traditional SQL apps |
| **Aurora** | Relational | Vertical + Read replicas (15) | Strong (ACID) | High-performance SQL |
| **DynamoDB** | NoSQL | Automatic horizontal | Eventual/Strong | Massive scale, key-value |
| **DocumentDB** | Document | Vertical + Read replicas (15) | Strong | MongoDB compatibility |
| **ElastiCache** | In-memory | Cluster-based | Strong (Redis) / Eventual | Caching, sub-ms latency |
| **MemoryDB** | In-memory | Cluster-based | Strong | Durable Redis, primary DB |
| **Neptune** | Graph | Vertical + Read replicas (15) | Strong | Graph relationships |
| **Timestream** | Time series | Automatic | Strong | IoT, metrics, events |
| **QLDB** | Ledger | Automatic | Strong | Immutable audit trail |

### Storage Service Comparison

| Service | Type | Access | Throughput | IOPS | Durability | Use Cases |
|---------|------|--------|------------|------|------------|-----------|
| **S3 Standard** | Object | HTTP API | High | N/A | 99.999999999% | Frequent access, hot data |
| **S3 IA** | Object | HTTP API | High | N/A | 99.999999999% | Infrequent access, backups |
| **S3 Glacier** | Object | HTTP API | Low (retrieval) | N/A | 99.999999999% | Archive, compliance |
| **EBS gp3** | Block | Direct attach | 1000 MiB/s | 16,000 | 99.8-99.9% | General purpose, boot |
| **EBS io2** | Block | Direct attach | 4000 MiB/s | 64,000 | 99.999% | High-performance DBs |
| **EFS** | File (NFS) | Network | 10+ GiB/s | 500k+ | 99.999999999% | Shared file system, Linux |
| **FSx Windows** | File (SMB) | Network | 2 GiB/s | 100k | 99.999999% | Windows workloads |
| **FSx Lustre** | File | Network | 1+ TB/s | Millions | 99.999999% | HPC, ML training |
| **FSx ONTAP** | File | Network | 2 GiB/s | N/A | 99.999999% | Multi-protocol, hybrid |

### Load Balancer Comparison

| Feature | ALB | NLB | GWLB | CLB (Legacy) |
|---------|-----|-----|------|--------------|
| **OSI Layer** | Layer 7 | Layer 4 | Layer 3 | Layer 4/7 |
| **Protocols** | HTTP, HTTPS, gRPC | TCP, UDP, TLS | IP | HTTP, HTTPS, TCP |
| **Static IP** | No | Yes | Yes | No |
| **Elastic IP** | No | Yes | No | No |
| **PrivateLink** | No | Yes | Yes | No |
| **WebSockets** | Yes | Yes | No | Yes |
| **Path routing** | Yes | No | No | No |
| **Host routing** | Yes | No | No | No |
| **Lambda targets** | Yes | No | No | No |
| **SNI** | Yes | Yes | No | No |
| **Performance** | Good | Extreme | High | Medium |
| **Use cases** | Web apps, microservices | High perf, static IP | Firewalls, IDS/IPS | Legacy |

---

## Architecture Patterns

### 1. Multi-Tier Web Application (Classic Pattern)

```
Users
  ↓
CloudFront (CDN)
  ↓
Route 53 (DNS)
  ↓
ALB (Load Balancer)
  ↓
Auto Scaling Group (Web Tier)
  ↓
Internal ALB or NLB
  ↓
Auto Scaling Group (App Tier)
  ↓
ElastiCache (Caching Layer)
  ↓
RDS Multi-AZ (Database)
  ↓
S3 (Static Assets, Backups)
```

**Key Components:**
- CloudFront for global distribution
- Route 53 for DNS and health-based routing
- ALB for Layer 7 routing
- Auto Scaling for elasticity
- ElastiCache for database offload
- RDS Multi-AZ for high availability
- S3 for storage and backups

### 2. Serverless Application Pattern

```
Users/Clients
  ↓
CloudFront + S3 (Static Frontend)
  ↓
API Gateway (REST/HTTP API)
  ↓
Lambda Functions (Business Logic)
  ↓
DynamoDB (Database)
  ↓
S3 (File Storage)
  ↓
SQS/SNS/EventBridge (Async Processing)
```

**Key Benefits:**
- Zero server management
- Pay per use
- Automatic scaling
- High availability built-in

### 3. Microservices on Containers Pattern

```
Users
  ↓
Route 53
  ↓
ALB (Service Load Balancer)
  ↓
ECS/EKS with Fargate (Container Orchestration)
  ↓
App Mesh (Service Mesh)
  ↓
ElastiCache (Caching)
  ↓
Aurora Serverless (Database)
  ↓
SQS/SNS (Inter-service Communication)
  ↓
X-Ray (Distributed Tracing)
```

**Key Features:**
- Service discovery
- Circuit breakers
- Load balancing per service
- Independent scaling
- Polyglot architecture support

### 4. Event-Driven Architecture Pattern

```
Event Sources (API GW, S3, DynamoDB Streams, etc.)
  ↓
EventBridge (Event Bus)
  ↓
Rules + Targets
  ↓
Lambda Functions / Step Functions (Processing)
  ↓
SQS/SNS (Async Communication)
  ↓
Multiple Targets (Services, Databases, Analytics)
```

**Key Advantages:**
- Loose coupling
- Scalability
- Flexibility
- Easy to add new services

### 5. Multi-Region Active-Active Pattern

```
Route 53 (Latency/Geoproximity Routing)
  ↓
┌─────────────────────┬─────────────────────┐
Region 1              Region 2
CloudFront            CloudFront
ALB                   ALB
Application           Application
Aurora Global DB      Aurora Global DB (Replica)
DynamoDB Global       DynamoDB Global
  ↓                     ↓
S3 Cross-Region Replication
```

**Key Requirements:**
- Route 53 health checks
- Aurora Global Database or DynamoDB Global Tables
- S3 Cross-Region Replication
- Data consistency strategy
- Regional failover procedures

---

## Important Exam Patterns

### Pattern Recognition for Question Analysis

**High Availability Signals:**
- "ensure high availability"
- "minimize downtime"
- "fault-tolerant"
→ **Consider:** Multi-AZ, Auto Scaling, ELB, Route 53 health checks, Multi-Region

**Low Latency Signals:**
- "minimize latency"
- "improve response time"
- "global users"
→ **Consider:** CloudFront, Global Accelerator, ElastiCache, DAX, read replicas, edge locations

**Cost Optimization Signals:**
- "MOST cost-effective"
- "minimize costs"
- "reduce expenses"
→ **Consider:** Spot Instances, Lambda, S3 IA/Glacier, Reserved Instances, Auto Scaling

**Scalability Signals:**
- "handle variable load"
- "scale automatically"
- "millions of users"
→ **Consider:** Auto Scaling, DynamoDB, Lambda, SQS, Kinesis, CloudFront

**Security Signals:**
- "data encryption"
- "compliance requirements"
- "secure communication"
→ **Consider:** KMS, SSL/TLS, VPC security groups, WAF, Shield, encrypted storage

**Performance Signals:**
- "high throughput"
- "millions of IOPS"
- "real-time processing"
→ **Consider:** Provisioned IOPS (io2), ElastiCache, DynamoDB, NLB, Kinesis

---

## AWS Well-Architected Framework - Design Principles

Apply these principles to all solution designs:

### Operational Excellence
- Perform operations as code (IaC)
- Make frequent, small, reversible changes
- Refine operations procedures frequently
- Anticipate failure
- Learn from operational failures

### Security
- Implement strong identity foundation
- Enable traceability
- Apply security at all layers
- Automate security best practices
- Protect data in transit and at rest
- Keep people away from data
- Prepare for security events

### Reliability
- Automatically recover from failure
- Test recovery procedures
- Scale horizontally
- Stop guessing capacity
- Manage change in automation

### Performance Efficiency
- Democratize advanced technologies
- Go global in minutes
- Use serverless architectures
- Experiment more often
- Consider mechanical sympathy

### Cost Optimization
- Implement cloud financial management
- Adopt a consumption model
- Measure overall efficiency
- Stop spending money on undifferentiated heavy lifting
- Analyze and attribute expenditure

### Sustainability
- Understand your impact
- Establish sustainability goals
- Maximize utilization
- Anticipate and adopt new, more efficient hardware and software
- Use managed services
- Reduce the downstream impact of your cloud workloads

---

## Next Steps

1. **Start with Task 2.1** - Understanding deployment strategies is foundational
2. **Practice service comparisons** - Know when to use ALB vs NLB, Aurora vs DynamoDB
3. **Build hands-on experience** - Deploy multi-tier applications in your AWS account
4. **Master RTO/RPO calculations** - Practice disaster recovery pattern selection
5. **Review Well-Architected Framework** - Understand design principles deeply
6. **Complete practice questions** - Target 200+ questions for Domain 2

---

## Important Reminders

### Exam Mindset for Domain 2
- **Match service to requirements** - Every scenario has constraints (cost, performance, reliability)
- **Think multi-layered** - Caching at edge, application, and database layers
- **Consider trade-offs** - Cost vs performance vs reliability vs complexity
- **AWS managed services preferred** - Less operational overhead is usually the right answer
- **Start simple, scale up** - Don't over-engineer solutions
- **Security by default** - Encryption, least privilege, defense in depth

### Common Mistakes to Avoid
- Choosing EC2 when Lambda would work (serverless is often preferred)
- Using ALB when NLB is required (protocol requirements)
- Ignoring RTO/RPO requirements in architecture design
- Over-provisioning resources (cost inefficiency)
- Not considering global users (missing CloudFront, Global Accelerator)
- Single AZ deployments for production (no high availability)
- Not using caching layers (performance bottleneck)
- Choosing complex solutions when simple ones exist

### Key Formulas to Remember

**Auto Scaling Cooldown:**
```
Cooldown Period should be ≥ Instance Warm-up Time
Default: 300 seconds
Adjust based on application startup time
```

**RTO/RPO Calculation:**
```
Total RTO = Detection Time + Recovery Time + Restoration Time
Total RPO = Last Backup + Replication Lag
```

**Cost Comparison (EC2 vs Lambda):**
```
Lambda break-even ≈ 30% utilization
If usage < 30% of time → Lambda cheaper
If usage > 30% of time → EC2 cheaper
(Varies by region and instance type)
```

---

*Last Updated: 2025-11-18*
*Always verify current AWS service capabilities as features evolve rapidly*
*Use AWS MCP tools to get the most up-to-date information*
