---
title: "Domain 4: Tricky Scenarios & Edge Cases"
domain: 4
domain_name: "Accelerate Workload Migration and Modernization"
weight: "20%"
file_type: "practice-scenarios"
exam_topics:
  - complex-scenarios
  - edge-cases
  - exam-preparation
status: complete
last_updated: "2025-11-18"
---

# Domain 4: Tricky Scenarios & Edge Cases

## Overview

This document covers **tricky exam scenarios**, **common pitfalls**, and **edge cases** specific to Domain 4 (Migration and Modernization). These are designed to help you avoid common mistakes and understand nuanced decision-making.

---

## Migration Strategy (7 R's) - Tricky Scenarios

### Scenario 1: The "Just Upgraded" Trap

**Situation:**
- Company upgraded on-premises Oracle database 3 months ago
- New hardware, 5-year support contract
- Datacenter contract expires in 6 months
- Question asks: "What migration strategy?"

**Common Wrong Answer:** Rehost to EC2 immediately

**Correct Thinking:**
- Recently invested capital (sunk cost)
- Datacenter exit required, but database investment recent
- **Better Answer:** **Retain** database on-premises (co-location or extend datacenter), migrate other applications
- Alternative: Negotiate early termination, **replatform** to RDS/Aurora to eliminate future overhead

**Exam Tip:** Watch for recent investments that make immediate migration wasteful

### Scenario 2: Application with "Zero Usage"

**Situation:**
- Application has 0 users in last 90 days
- Contains customer data requiring 10-year retention (compliance)
- License renewal coming up ($50K/year)

**Common Wrong Answer:** Retain the application running

**Correct Answer:** **Retire** the application
- Archive data to S3 Glacier Deep Archive (compliant, $1/TB/month)
- Decommission application infrastructure
- Cancel license renewal
- Savings: ~$50K/year license + infrastructure costs

**Pitfall:** Students often confuse "retain data" with "retain application"

### Scenario 3: VMware with "Need Cloud Benefits"

**Situation:**
- 300 VMware VMs
- Want to migrate to AWS
- Want "cloud benefits" like auto-scaling, managed services
- Team has strong VMware expertise

**Common Wrong Answer:** Relocate to VMware Cloud on AWS

**Correct Thinking:**
- **Relocate** maintains VMware (fast, familiar)
- But: Doesn't provide native AWS benefits (auto-scaling, managed services)
- **Better Answer:** **Rehost** to EC2 with Auto Scaling, or **Replatform** to managed services
- **Trade-off:** Faster migration (Relocate) vs. more cloud benefits (Rehost/Replatform)

**Exam Tip:** Clarify if "cloud benefits" means infrastructure benefits or cloud-native features

---

## Migration Tools - Edge Cases

### Scenario 4: MGN vs DMS for Database Servers

**Situation:**
- Physical server running SQL Server database
- 5 TB database
- Minimal downtime required

**Common Wrong Answer:** Use MGN only (server migration)

**Correct Thinking:**
- MGN migrates entire server (OS + database files)
- Works, but block-level replication of 5 TB database files is slow
- **Better Answer:** **DMS for database** (efficient, continuous CDC) + MGN for application tier if separate

**Alternative:** If database and app on same server, use **MGN for server** OR **DMS for data** + fresh RDS instance

**Exam Tip:** MGN migrates servers; DMS migrates databases more efficiently

### Scenario 5: DMS Replication Lag Spike

**Situation:**
- DMS replication running for Oracle → Aurora migration
- CDC lag usually < 5 seconds
- Suddenly spikes to 300 seconds
- Source database experiencing high transaction volume (batch job running)

**Common Wrong Answer:** Increase DMS replication instance size immediately

**Correct Thinking:**
- Lag spike during batch job is temporary
- DMS will catch up after batch completes
- Monitor: If lag stays high after batch, then investigate
- **Correct Actions:**
  1. Wait for batch job to complete
  2. Monitor if lag recovers
  3. If sustained high lag (after batch), then increase instance size
  4. If batch jobs regular, schedule cutover when no batch running

**Exam Tip:** Don't panic-scale for temporary spikes; understand workload patterns

### Scenario 6: Snowball for "Small" Large Databases

**Situation:**
- 15 TB SQL Server database
- 1 Gbps network connection
- Need to migrate with minimal downtime

**Common Wrong Answers:**
- DMS only (students think 15 TB is small enough for network)
- Snowball only (students forget about CDC)

**Calculation:**
```
Transfer Time = (15 TB × 8,000 GB) / (1 Gbps × 86,400 sec/day × 0.8 efficiency)
             = 120,000 GB / 69,120 Gbps-sec
             = ~1.7 days (theoretical)
             = ~3-4 days (real-world)
```

**Correct Answer:** **Snowball Edge + DMS CDC**
1. Export database to Snowball Edge
2. Ship to AWS
3. Import to RDS
4. Start DMS CDC from source (captures changes during shipment)
5. Cutover when CDC lag reaches zero

**Exam Tip:** For databases > 10 TB, consider Snowball + DMS even with decent network

### Scenario 7: DataSync vs Transfer Family Confusion

**Situation:**
- Partner uploads files via SFTP daily
- Want to migrate SFTP server to AWS
- Files should land in S3

**Common Wrong Answer:** Use DataSync to migrate file server

**Correct Answer:** **AWS Transfer Family (SFTP)**
- Transfer Family provides SFTP endpoint
- Files go directly to S3
- Partner continues using SFTP (no change)

**Why Not DataSync:**
- DataSync is for bulk data migration/sync
- Doesn't provide SFTP endpoint
- Partner would need to change to different protocol

**Exam Tip:** DataSync = bulk transfer; Transfer Family = SFTP/FTPS endpoint

---

## Architecture Design - Common Pitfalls

### Scenario 8: Lambda for Long-Running Tasks

**Situation:**
- Video transcoding workload
- Processing time: 20-45 minutes per video
- Want to modernize batch job

**Common Wrong Answer:** Use Lambda to process videos

**Pitfall:** Lambda has 15-minute maximum timeout

**Correct Answers:**
- **ECS Fargate:** Serverless containers, no time limit
- **AWS Batch:** Managed batch processing
- **Step Functions + Lambda:** Break into < 15-min chunks (if possible)

**Exam Tip:** Lambda max 15 minutes; longer tasks need containers or Batch

### Scenario 9: RDS for Serverless Application

**Situation:**
- Lambda-based API (1000 concurrent executions possible)
- MySQL database on RDS (max 150 connections)

**Common Wrong Answer:** Use RDS directly from Lambda

**Problem:** Connection exhaustion
- 1000 Lambdas try to connect
- RDS supports 150 connections
- 850 Lambda invocations fail

**Correct Answers:**
- **RDS Proxy:** Connection pooling (prevents exhaustion)
- **Aurora Serverless v2:** Better scaling, still needs RDS Proxy
- **DynamoDB:** No connection limit (best for serverless)

**Exam Tip:** Serverless apps + SQL databases = use RDS Proxy

### Scenario 10: ECS vs EKS for "Simple" Containerized App

**Situation:**
- Single containerized Java application
- Team has limited Kubernetes experience
- Want to deploy to AWS

**Common Wrong Answer:** Use EKS (students think Kubernetes is always better)

**Correct Thinking:**
- EKS: $0.10/hour cluster cost + complexity
- ECS: No control plane cost, simpler
- No Kubernetes requirement stated
- Team lacks K8s experience

**Correct Answer:** **ECS** (simpler, cheaper, sufficient)

**When to Choose EKS:**
- Requirement explicitly mentions Kubernetes
- Multi-cloud portability needed
- Team has Kubernetes expertise
- Complex orchestration requirements

**Exam Tip:** Don't default to EKS; ECS is simpler for AWS-native use cases

### Scenario 11: Microservices for Small Application

**Situation:**
- Simple CRUD application
- 5,000 users
- Single development team (3 developers)
- Want to "modernize" to microservices

**Common Wrong Answer:** Decompose to microservices immediately

**Correct Thinking:**
- Application is small (doesn't need microservices complexity)
- Single small team (no coordination benefits)
- No scaling mismatch
- **Better Answer:** Containerize as monolith on ECS/EKS
- Microservices add complexity without clear benefit

**When Microservices Make Sense:**
- Large application with scaling mismatches
- Multiple teams (coordination issues)
- Frequent independent deployments needed
- Different technology stacks desired

**Exam Tip:** Don't over-engineer; monolith isn't always wrong

---

## Database Migration - Tricky Cases

### Scenario 12: Heterogeneous Migration Missing SCT

**Situation:**
- Migrate Oracle to Aurora PostgreSQL
- Question describes using DMS
- No mention of schema conversion

**Common Wrong Answer:** DMS is sufficient

**Correct Thinking:**
- Oracle → Aurora PostgreSQL is **heterogeneous** (different engines)
- Requires schema conversion (stored procedures, functions, data types differ)
- **Missing Step:** Use **AWS SCT** (Schema Conversion Tool) first
- Process: SCT converts schema → DMS migrates data

**Exam Tip:** Heterogeneous migration = SCT + DMS (two tools)

### Scenario 13: Babelfish Limitations

**Situation:**
- SQL Server application with extensive CLR (Common Language Runtime) code
- .NET assemblies in database
- Want minimal migration effort

**Common Wrong Answer:** Aurora PostgreSQL with Babelfish

**Pitfall:** Babelfish doesn't support CLR

**Correct Thinking:**
- Babelfish supports T-SQL, but not CLR/.NET assemblies
- Options:
  1. **RDS for SQL Server** (keeps CLR support, still licensed)
  2. **Refactor CLR** out of database (move to application layer)
  3. **Rewrite CLR** code in PostgreSQL (significant effort)

**Exam Tip:** Babelfish great for T-SQL, but check limitations (no CLR, some edge cases)

### Scenario 14: DynamoDB for Complex Queries

**Situation:**
- Relational database with ad-hoc queries
- Users run complex joins, aggregations
- Want to migrate to DynamoDB for "scale"

**Common Wrong Answer:** Migrate to DynamoDB

**Problem:** DynamoDB is key-value/document store
- No joins (denormalize data)
- No complex aggregations (pre-calculate)
- Query patterns must be known upfront

**Correct Thinking:**
- Ad-hoc complex queries → **Keep relational** (Aurora, Redshift for analytics)
- DynamoDB for: known access patterns, key-value lookups, massive scale

**Exam Tip:** DynamoDB excellent for its use case, but not a relational database replacement

---

## Modernization - Edge Cases

### Scenario 15: Serverless with "Steady 24/7 Workload"

**Situation:**
- Application processes 1000 requests/hour, 24/7 (constant load)
- Want to "modernize" to serverless

**Common Wrong Answer:** Lambda + API Gateway

**Correct Thinking:**
- Serverless pricing: per request/execution time
- Steady load: containers or EC2 with Reserved Instances cheaper
- **Cost Comparison:**
  - Lambda: $0.20 per 1M requests × (24K requests/day × 30 days) = ~$144/month
  - ECS Fargate (1 task): ~$30/month continuously
  - ECS with EC2 (t3.medium RI): ~$20/month

**Correct Answer:** **ECS with EC2 Reserved Instance** (cheapest for steady load)

**When Lambda Makes Sense:**
- Variable load (spiky traffic)
- Intermittent workload
- Event-driven (sporadic events)

**Exam Tip:** Serverless isn't always cheaper; analyze workload pattern

### Scenario 16: Data Lake with "Real-Time Queries"

**Situation:**
- Want to build data lake on S3
- Requirement: Sub-second query latency

**Common Wrong Answer:** Athena to query S3

**Problem:** Athena is for ad-hoc analytics (seconds to minutes), not real-time

**Correct Thinking:**
- S3 data lake = batch/analytics queries (not real-time)
- Real-time queries need:
  - **DynamoDB** (ms latency, operational)
  - **ElastiCache (Redis)** (sub-ms latency, caching)
  - **Aurora** (relational, ms latency)
  - **OpenSearch** (full-text search, ms latency)

**Hybrid Approach:**
- Operational database (DynamoDB) for real-time
- Replicate to S3 for analytics (DynamoDB Streams → Kinesis Firehose → S3)

**Exam Tip:** Data lake (S3) is for analytics, not real-time operational queries

### Scenario 17: ML Integration with "No Data Scientists"

**Situation:**
- Want to add image recognition to application
- No machine learning expertise in team
- Need to categorize product images

**Common Wrong Answer:** Use SageMaker to build custom model

**Problem:** SageMaker requires ML expertise (data scientists)

**Correct Answer:** **Amazon Rekognition** (pre-built AI service)
- No ML expertise required
- API call to categorize images
- Returns labels and confidence scores

**When to Use SageMaker:**
- Have data science team
- Custom model needed (pre-built services don't fit)
- Specific domain requirements

**Exam Tip:** Pre-built AI services (Rekognition, Comprehend) for teams without ML expertise

---

## Cost Optimization - Common Mistakes

### Scenario 18: Fargate vs EC2 with RI

**Situation:**
- Containerized application
- Runs 24/7 with predictable load
- Want to minimize costs

**Common Wrong Answer:** Use Fargate (serverless, no management)

**Cost Reality:**
- **Fargate:** ~$50/month for 1 vCPU, 2 GB RAM (24/7)
- **ECS with t3.small EC2 (3-year RI):** ~$8/month (can run 2-3 containers)

**Correct Answer:** **ECS with EC2 Reserved Instances** for steady workloads

**When Fargate Makes Sense:**
- Variable workloads (not 24/7)
- Operational simplicity more important than cost
- Short-term workloads (< 1 year)

**Exam Tip:** Fargate convenience costs more; RIs cheaper for steady workloads

### Scenario 19: S3 Storage Class Selection

**Situation:**
- Archive data for 10-year compliance
- Must be retrievable if needed (rare)
- Acceptable retrieval time: within 12 hours

**Options:**
- S3 Standard: $0.023/GB/month
- S3 Intelligent-Tiering: $0.0025-$0.023/GB/month
- S3 Glacier Flexible Retrieval: $0.0036/GB/month (retrieval: 1-5 min to 12 hr)
- **S3 Glacier Deep Archive: $0.00099/GB/month (retrieval: 12 hr)**

**Common Wrong Answer:** S3 Standard (students default to it)

**Correct Answer:** **S3 Glacier Deep Archive**
- Cheapest option
- Meets retrieval requirement (12 hr acceptable)
- Optimized for long-term archives

**Exam Tip:** Match S3 storage class to access pattern and retrieval requirements

---

## Network Transfer - Calculations

### Scenario 20: "Is Network Fast Enough?"

**Situation:**
- 50 TB of data to transfer
- 500 Mbps (0.5 Gbps) connection
- Need to complete in 2 weeks

**Student Approach:** "500 Mbps sounds fast enough"

**Calculation:**
```
Transfer Time = (50 TB × 8,000 GB/TB) / (0.5 Gbps × 86,400 sec/day × 0.8 efficiency)
             = 400,000 GB / 34,560 Gbps-sec
             = ~11.6 days (theoretical)
             = ~16-18 days (real-world with retries, overhead)
```

**Reality:** Exceeds 2-week timeline

**Correct Answer:** **Snowball Edge** (faster, reliable timeline)
- Snowball holds 80 TB
- Ship time: 2-3 days each way
- Transfer to device: 2-3 days
- AWS import: 1-2 days
- **Total: ~7-10 days** (meets deadline)

**Exam Tip:** Always calculate transfer time; don't assume network is "fast enough"

---

## Summary: Common Exam Traps

### Watch Out For These Patterns

| Trap | What to Watch | Correct Thinking |
|------|---------------|------------------|
| **"Just upgraded on-prem"** | Recent capital investment | Consider **Retain** or **Retire** if wasteful |
| **"Zero users but data retention"** | Confusing app with data | **Retire** app, archive data to S3 Glacier |
| **"VMware + cloud benefits"** | VMware Cloud doesn't give native AWS | **Rehost** to EC2 for AWS-native features |
| **"MGN for database servers"** | Using wrong tool | Use **DMS** for database migration |
| **"SFTP migration"** | Need endpoint, not just transfer | **Transfer Family**, not DataSync |
| **"Lambda for 30-min tasks"** | Lambda 15-min limit | Use **Fargate** or **Batch** |
| **"Serverless app + RDS"** | Connection pool exhaustion | Use **RDS Proxy** |
| **"Small app to microservices"** | Over-engineering | Containerized monolith fine |
| **"Heterogeneous migration"** | Missing SCT step | **SCT + DMS** (not just DMS) |
| **"DynamoDB for ad-hoc queries"** | Wrong database type | Keep relational for complex queries |
| **"Steady load + serverless"** | Wrong pricing model | **EC2 with RI** cheaper |
| **"Data lake for real-time"** | S3/Athena not real-time | Use **DynamoDB** or **ElastiCache** |
| **"Network transfer estimation"** | Assuming network fast enough | **Calculate** transfer time |
| **"Fargate for steady 24/7"** | Higher cost than EC2 RI | **EC2 with RI** for cost optimization |

### Formula Quick Reference

**Network Transfer Time (days):**
```
Days = (Data in TB × 8,000) / (Network Gbps × 86,400 × 0.8) / 24
```

**When to Use Snowball:**
```
If (Transfer Time > 7 days) OR (Network Cost > Device Cost)
  → Use Snowball
```

**Database Connection Math:**
```
Max Concurrent Lambdas > RDS Max Connections
  → Use RDS Proxy
```

---

## Key Exam Strategies

### 1. Read Carefully for Constraints

- **Time constraints:** "Datacenter closes in X months"
- **Cost constraints:** "Minimize costs"
- **Operational constraints:** "Minimal operational overhead"
- **Technical constraints:** "15-minute timeout"

### 2. Calculate When Numbers Given

- Data size + network speed = transfer time
- Workload pattern + pricing = cost comparison
- Always verify assumptions with math

### 3. Match Tools to Use Cases

- Don't force-fit Lambda into everything
- Don't default to microservices
- Don't assume serverless is always cheaper
- Don't forget heterogeneous migrations need SCT

### 4. Consider the Full Solution

- DMS for data + MGN for app tier
- Snowball for bulk + DMS CDC for changes
- SCT for schema + DMS for data migration
- RDS Proxy between Lambda and RDS

---

*Last Updated: 2025-11-17*
*Practice these scenarios to avoid common exam pitfalls*
