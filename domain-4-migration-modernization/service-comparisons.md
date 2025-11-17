# Domain 4: Service Comparison Matrix

## Overview

This document provides **detailed comparison tables** for migration and modernization services to help you quickly identify the right tool for each scenario.

---

## Server Migration Services

### AWS MGN vs SMS

| Feature | AWS Application Migration Service (MGN) | AWS Server Migration Service (SMS) |
|---------|----------------------------------------|-------------------------------------|
| **Status** | ✅ Current, recommended | ⚠️ Legacy, end-of-support planned |
| **Approach** | Application-centric | Server-centric |
| **Replication Method** | Continuous block-level | Incremental snapshots (scheduled) |
| **Replication Frequency** | Real-time (< 1 min lag) | Scheduled (hourly, daily) |
| **Testing** | Non-disruptive testing anytime | Limited testing capability |
| **Downtime** | Minimal (15-30 minutes) | Higher (hours typical) |
| **Cutover Control** | Precise, on-demand | Less flexible |
| **Supported Platforms** | Physical, VMware, Hyper-V, Azure, AWS | Primarily VMware |
| **Cost** | Free for 90 days/server (2160 hours) | Free (being sunset) |
| **Post-Migration** | Automated optimization recommendations | Manual |
| **Use Case** | ✅ **All new server migrations** | ❌ Legacy only (avoid for new projects) |

**Exam Tip:** Always choose MGN over SMS for new migrations

---

## Database Migration Services

### DMS: Homogeneous vs Heterogeneous

| Aspect | Homogeneous Migration | Heterogeneous Migration |
|--------|----------------------|-------------------------|
| **Definition** | Same database engine (Oracle → RDS Oracle) | Different engines (Oracle → Aurora PostgreSQL) |
| **Tools Required** | DMS only | **SCT + DMS** |
| **Schema Conversion** | Not needed (compatible) | **Required** (SCT converts schema) |
| **Complexity** | Lower (straightforward) | Higher (conversion + testing) |
| **Duration** | Faster (no conversion phase) | Longer (conversion + migration) |
| **Risk** | Lower (proven compatibility) | Higher (conversion issues possible) |
| **Testing Effort** | Moderate | High (validate all converted objects) |
| **Examples** | MySQL → Aurora MySQL, SQL Server → RDS SQL Server | Oracle → Aurora PostgreSQL, SQL Server → Aurora MySQL |
| **Typical Success Rate** | 95%+ auto-migration | 70-90% auto-conversion (SCT), 10-30% manual work |

**Key Difference:** Heterogeneous requires SCT for schema conversion BEFORE DMS data migration

### Database Migration Tool Selection

| Source | Target | Best Tool | Alternative | Notes |
|--------|--------|-----------|-------------|-------|
| Oracle | RDS Oracle | DMS | Native tools | Homogeneous, straightforward |
| Oracle | Aurora PostgreSQL | **SCT + DMS** | - | Heterogeneous, SCT required |
| SQL Server | RDS SQL Server | DMS | Native backup/restore | Homogeneous |
| SQL Server | Aurora PostgreSQL | **SCT + DMS** or **Babelfish** | - | Babelfish if minimal code changes desired |
| MySQL | Aurora MySQL | DMS | Native replication | Homogeneous, excellent compatibility |
| PostgreSQL | Aurora PostgreSQL | DMS | Native pg_dump/pg_restore | Homogeneous |
| Any (>10 TB) | Any | **Snowball Edge + DMS CDC** | - | Large databases, limited bandwidth |
| MongoDB | DocumentDB | DMS | Native tools | Document database migration |

---

## Data Transfer Services

### DataSync vs Transfer Family vs Snow Family

| Feature | AWS DataSync | AWS Transfer Family | AWS Snow Family |
|---------|-------------|--------------------|-----------------
|
| **Transfer Method** | Online (internet or Direct Connect) | Online (SFTP/FTPS/FTP/AS2) | Offline (physical device shipment) |
| **Speed** | Up to 10 Gbps per agent | Varies by connection | 10-100 Gbps (device local transfer) |
| **Best For** | File system/object migration | Partner file exchange | Large datasets, limited bandwidth |
| **Protocols** | NFS, SMB, HDFS, S3 API | SFTP, FTPS, FTP, AS2 | S3 API, NFS |
| **Use Case** | Migrate file servers, ongoing sync | SFTP endpoint for partners | 10 TB - 100 PB migrations |
| **Frequency** | One-time or recurring (scheduled) | Ongoing (always available) | One-time or periodic (order devices) |
| **Cost Model** | Per GB transferred | Per hour + per GB | Device rental + shipping |
| **Typical Cost** | $0.0125/GB | $0.30/hr + $0.04/GB | $300-$500 per device + shipping |
| **Setup Time** | Minutes (deploy agent) | Minutes (configure endpoint) | Days (order, ship, setup) |
| **Data Size** | < 10 TB (online practical) | Any (ongoing) | > 10 TB (offline practical) |
| **Latency** | Network dependent | Network dependent | Days (shipping time) |
| **Encryption** | TLS in transit, AES-256 at rest | TLS for SFTP/FTPS | Hardware encryption (256-bit) |

**Decision Tree:**
- **Ongoing partner file exchange (SFTP):** Transfer Family
- **File migration, good network (< 10 TB):** DataSync
- **Large dataset (> 10 TB), limited bandwidth:** Snow Family
- **Recurring sync (NFS/SMB):** DataSync with scheduled tasks

### Snow Family Device Comparison

| Feature | Snowcone | Snowball Edge Storage | Snowball Edge Compute | Snowmobile |
|---------|----------|----------------------|----------------------|------------|
| **Storage Capacity** | 8 TB HDD or 14 TB SSD | 80 TB usable (100 TB total) | 28 TB usable (42 TB SSD) | Up to 100 PB |
| **Compute** | 2 vCPUs, 4 GB RAM | 40 vCPUs, 80 GB RAM (optional) | 104 vCPUs, 416 GB RAM, GPU | N/A |
| **Size/Weight** | 9" × 6" × 3", 4.5 lbs | Suitcase size, 65 lbs | Suitcase size, 65 lbs | 45-ft shipping container |
| **Network** | 10 Gbps wired, Wi-Fi | 10/25/40/100 Gbps | 10/25/40/100 Gbps | Multiple 100 Gbps+ |
| **Power** | USB-C (12W) | Standard AC power | Standard AC power | Industrial power |
| **Use Case** | Edge computing, small data | Medium migrations (10-80 TB) | Edge ML, video processing | Exabyte-scale (> 10 PB) |
| **Clustering** | No | Yes (5-10 devices) | Yes (5-10 devices) | N/A |
| **Portability** | Highly portable (backpack) | Portable (carry-on size) | Portable (carry-on size) | Not portable (truck-based) |
| **Cost** | Lower (smaller device) | Medium | Higher (more compute) | Very high (but lowest $/PB) |
| **Typical Timeline** | 5-7 days total | 7-10 days total | 7-10 days total | Weeks to months |

**Selection Guide:**
- **< 8 TB, edge location, remote:** Snowcone
- **10-80 TB, datacenter:** Snowball Edge Storage Optimized
- **Need edge compute (ML inference, video):** Snowball Edge Compute Optimized
- **> 10 PB, single location:** Snowmobile

---

## Container Platforms

### ECS vs EKS

| Feature | Amazon ECS | Amazon EKS |
|---------|-----------|------------|
| **Container Orchestration** | AWS proprietary | Kubernetes (CNCF certified) |
| **Learning Curve** | Low (AWS-familiar concepts) | High (Kubernetes complexity) |
| **Portability** | AWS-specific | Multi-cloud (Kubernetes runs anywhere) |
| **Control Plane Cost** | **$0** | **$0.10/hour (~$73/month)** per cluster |
| **Integration** | Deep AWS integration | Good AWS integration + K8s ecosystem |
| **Tooling** | AWS CLI, Console, CloudFormation | kubectl, Helm, Kubernetes ecosystem |
| **Service Mesh** | AWS App Mesh | Istio, Linkerd, App Mesh |
| **Auto Scaling** | AWS Auto Scaling | Kubernetes HPA, Cluster Autoscaler, Karpenter |
| **Updates** | Managed by AWS | Kubernetes version upgrades needed |
| **Team Skills Required** | AWS experience | Kubernetes expertise |
| **When to Use** | AWS-native, simpler operations, cost-conscious | Kubernetes requirement, multi-cloud, complex orchestration |

**Exam Decision Factors:**
- **"Kubernetes"** explicitly mentioned → EKS
- **Multi-cloud or portability** → EKS
- **Simplicity and AWS-native** → ECS
- **"Minimize costs"** → ECS (no control plane fee)

### Fargate vs EC2 Launch Type

| Feature | AWS Fargate | ECS/EKS with EC2 |
|---------|-------------|------------------|
| **Server Management** | None (serverless) | You manage EC2 instances |
| **Pricing Model** | Per vCPU-second and GB-second | EC2 instance pricing |
| **Cost for Steady Workload** | Higher (~5x more than EC2 RI) | Lower (with Reserved Instances) |
| **Cost for Variable Workload** | Lower (pay only for use) | Higher (pay for provisioned capacity) |
| **Capacity Limits** | Up to 16 vCPU, 120 GB memory per task | Full EC2 instance sizes (up to 128+ vCPU) |
| **Cold Start** | ~1-2 seconds | Instant (instances pre-warmed) |
| **GPU Support** | Limited (ECS with Fargate supports GPU in some regions) | Full GPU instance types available |
| **Host-Level Access** | No access | Full SSH/RDP access |
| **Isolation** | Dedicated kernel per task (strong) | Shared host (good) |
| **Patching** | AWS manages | You manage OS patches |
| **Use Case** | Variable traffic, zero ops, small containers | Steady workload, large containers, GPU, cost optimization |

**Exam Decision Factors:**
- **"Zero server management"** → Fargate
- **"Minimize operational overhead"** → Fargate
- **"Cost optimization, steady 24/7"** → EC2 with Reserved Instances
- **"Large containers (> 16 vCPU)"** → EC2
- **"GPU required"** → EC2 (mostly)

---

## Serverless Compute

### Lambda vs Fargate vs EC2

| Feature | AWS Lambda | AWS Fargate | Amazon EC2 |
|---------|-----------|-------------|------------|
| **Execution Model** | Event-driven functions | Long-running containers | Long-running instances |
| **Maximum Duration** | 15 minutes | Unlimited | Unlimited |
| **Startup Time** | Milliseconds (warm) to seconds (cold) | 1-2 seconds | Seconds to minutes |
| **Scaling** | Automatic (0 to 1000s instantly) | Automatic (slower than Lambda) | Manual or Auto Scaling |
| **Pricing** | Per invocation + GB-second | Per vCPU-second + GB-second | Per hour (or second) |
| **Idle Cost** | $0 | $0 (if scaled to zero, rare) | Full cost (always running) |
| **State** | Stateless | Stateless (but container-based) | Can be stateful |
| **Use Case** | Event processing, APIs, short tasks | Long tasks (> 15 min), containers, no server mgmt | Custom requirements, steady workloads, full control |
| **Cold Start** | 100ms-10s (varies by runtime, size) | 1-2 seconds | N/A (always on) |

**Selection Guide:**
- **< 15 minutes, event-driven:** Lambda
- **> 15 minutes, still want serverless:** Fargate
- **Steady 24/7, cost-critical:** EC2 with Reserved Instances
- **Need full OS control:** EC2

---

## Event Services

### SNS vs SQS vs EventBridge vs Kinesis

| Feature | Amazon SNS | Amazon SQS | Amazon EventBridge | Amazon Kinesis |
|---------|-----------|------------|-------------------|----------------|
| **Pattern** | Pub/Sub (fan-out) | Queue (point-to-point) | Event bus (routing) | Stream (ordered, replay) |
| **Message Model** | Push (to subscribers) | Pull (consumers poll) | Push (to targets) | Pull (consumers poll) |
| **Subscribers** | Multiple (fan-out) | Single consumer per message | Multiple (rules route) | Multiple (shard-based) |
| **Message Retention** | None (must subscribe) | 1-14 days (default 4 days) | 24 hours (archive to S3 longer) | 1-365 days |
| **Ordering** | No | FIFO queue only | No | Yes (per shard) |
| **Delivery** | At-least-once | At-least-once (Standard), Exactly-once (FIFO) | At-least-once | At-least-once |
| **Use Case** | Fan-out notifications | Decouple producers/consumers, buffering | Complex routing, SaaS integration, event-driven | Real-time data streams, analytics, replay |
| **Targets** | HTTP, email, SMS, Lambda, SQS, Kinesis | Lambda, EC2, ECS (pull) | 20+ AWS services, Lambda, SQS, Kinesis, HTTP | Lambda, Kinesis Data Analytics, Kinesis Data Firehose |
| **Filtering** | Limited (subscription filter) | None (application-level) | Rich (content-based routing) | Consumer-side |
| **Throughput** | High (100K+ TPS) | High (3K+ TPS standard, 300-3K FIFO) | High (varies) | Very high (1 MB/sec per shard) |
| **Cost** | $0.50/million requests | $0.40/million requests | $1/million events + target costs | $0.015/hour per shard + data ingestion |

**Decision Tree:**
- **Fan-out (1 message → many receivers):** SNS or EventBridge
- **Queue (buffer, decouple):** SQS
- **Complex event routing:** EventBridge
- **Real-time streaming, ordered:** Kinesis
- **Replay capability needed:** Kinesis (SQS discards after processing)

---

## Database Services

### Aurora vs RDS vs DynamoDB

| Feature | Aurora (PostgreSQL/MySQL) | RDS (Multiple Engines) | DynamoDB |
|---------|--------------------------|----------------------|----------|
| **Database Type** | Relational (SQL) | Relational (SQL) | NoSQL (Key-Value/Document) |
| **Engines** | PostgreSQL, MySQL compatible | PostgreSQL, MySQL, MariaDB, Oracle, SQL Server | N/A (proprietary) |
| **Performance** | Up to 5x MySQL, 3x PostgreSQL | Standard engine performance | Single-digit ms latency |
| **Scaling** | Up to 128 TB, 15 read replicas | Up to 64 TB (engine-dependent), 5-15 read replicas | Unlimited (auto-scales) |
| **High Availability** | Multi-AZ (6 copies across 3 AZs) | Multi-AZ (synchronous replica) | 3 AZs by default |
| **Read Scaling** | Up to 15 read replicas | Up to 15 read replicas (varies by engine) | Unlimited read capacity |
| **Pricing** | Higher than RDS (but better performance) | Engine licensing varies | On-demand or provisioned |
| **Serverless** | Aurora Serverless v2 | No | Yes (on-demand mode) |
| **Global Tables** | Aurora Global Database | Cross-region read replicas | DynamoDB Global Tables |
| **Use Case** | High-performance relational, cloud-native | Standard relational, engine-specific features | Massive scale, key-value, low latency |

**Selection Guide:**
- **SQL + high performance + cloud-native:** Aurora
- **SQL + specific engine version/features:** RDS
- **Simple access patterns, massive scale:** DynamoDB

### Aurora Serverless v1 vs v2

| Feature | Aurora Serverless v1 | Aurora Serverless v2 |
|---------|---------------------|---------------------|
| **Scaling Speed** | Minutes (pause/resume) | Seconds (instant, fraction of a second) |
| **Scaling Range** | 1-256 ACU (2 GB - 512 GB) | 0.5-128 ACU (1 GB - 256 GB) |
| **Pause/Resume** | Yes (auto-pause after inactivity) | No (stays at minimum ACU) |
| **Availability** | Single-AZ during scaling | Multi-AZ always |
| **Read Replicas** | No | Yes (up to 15) |
| **Global Database** | No | Yes |
| **Connection Persistence** | Lost during scaling | Maintained |
| **Use Case** | Infrequent, intermittent workloads | Variable, unpredictable workloads, production |
| **Status** | Legacy (still available) | ✅ Recommended for new projects |

**Exam Tip:** Aurora Serverless v2 is the modern choice (v1 legacy)

---

## Modernization Services

### AWS App2Container vs Manual Containerization

| Aspect | AWS App2Container | Manual Containerization |
|--------|------------------|------------------------|
| **Status** | ⚠️ No longer open to new customers (as of Nov 2025) | ✅ Always available |
| **Automation** | High (auto-generates Dockerfile, manifests) | Low (manual Dockerfile creation) |
| **Supported Apps** | Java, .NET Framework, ASP.NET | Any application |
| **Learning Curve** | Low (guided process) | Medium-High (Docker knowledge needed) |
| **Dependency Discovery** | Automatic | Manual analysis |
| **Time to Containerize** | Hours | Days to weeks |
| **Customization** | Limited (generated artifacts) | Full control |
| **Migration to EKS** | Supported (EC2 only, not Fargate) | Full flexibility |
| **Current Recommendation** | **AWS Transform** for .NET | Manual or AWS Transform |

**Exam Context:** Questions may reference App2Container (understand concept), but know it's being replaced

---

## Summary Comparison Tables

### Migration Tool Selection Matrix

| Workload Type | < 10 TB | 10-100 TB | > 100 TB | Tool |
|---------------|---------|-----------|----------|------|
| **Servers** | Any size | Any size | Any size | **AWS MGN** |
| **Databases (same engine)** | DMS | DMS or Snowball+DMS | Snowball+DMS CDC | **DMS** or **Snowball+DMS** |
| **Databases (different engine)** | SCT+DMS | SCT+DMS or Snowball | Snowball+DMS CDC | **SCT+DMS** or **Snowball+DMS** |
| **File Systems** | DataSync | DataSync or Snowball | Snowball Edge | **DataSync** or **Snowball** |
| **Object Storage** | S3 API, DataSync | DataSync or Snowball | Snowball Edge/Snowmobile | **DataSync** or **Snow** |

### Architecture Pattern Selection

| Requirement | Pattern | AWS Services |
|-------------|---------|--------------|
| **Event-driven processing** | Event-driven | Lambda + EventBridge/SNS/SQS |
| **API backend** | Serverless or containers | API Gateway + Lambda or ECS/EKS |
| **Long-running tasks (> 15 min)** | Containers or Batch | ECS Fargate or AWS Batch |
| **Microservices** | Containers | ECS or EKS with service mesh |
| **Workflow orchestration** | Step Functions | Step Functions + Lambda |
| **Real-time data** | Streaming | Kinesis + Lambda/Firehose |
| **Scheduled jobs** | Serverless | EventBridge Scheduler + Lambda |

---

*Last Updated: 2025-11-17*
*Use these comparison tables for quick reference during exam preparation*
