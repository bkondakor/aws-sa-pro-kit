---
title: "AWS Solutions Architect Professional - Ultimate Cheatsheet"
description: "Quick reference for the most important topics and tricky scenarios"
exam: "SAP-C02"
file_type: "quick-reference"
status: complete
last_updated: "2025-11-18"
---

# AWS Solutions Architect Professional - Ultimate Cheatsheet

> **Quick reference for exam day** - Focus on tricky scenarios, decision frameworks, and commonly tested topics

---

## Table of Contents

1. [Service Selection Decision Trees](#service-selection-decision-trees)
2. [Networking Quick Reference](#networking-quick-reference)
3. [Security Patterns](#security-patterns)
4. [Database Decision Framework](#database-decision-framework)
5. [Disaster Recovery Patterns](#disaster-recovery-patterns)
6. [Cost Optimization Strategies](#cost-optimization-strategies)
7. [Migration Decision Framework](#migration-decision-framework)
8. [Tricky Scenarios & Common Pitfalls](#tricky-scenarios--common-pitfalls)
9. [Service Limits & Quotas](#service-limits--quotas)
10. [Exam Keywords & Patterns](#exam-keywords--patterns)

---

## Service Selection Decision Trees

### Compute Selection

```
Is it event-driven or sporadic?
├─ YES → Lambda (< 15 min timeout)
│   ├─ Longer than 15 min? → Step Functions + Lambda
│   └─ Connection pooling needed? → Use RDS Proxy
│
└─ NO (steady workload)
    ├─ Containerized?
    │   ├─ Need Kubernetes? → EKS
    │   ├─ Simple container? → ECS
    │   │   ├─ Steady 24/7? → ECS with EC2 + Reserved Instances
    │   │   └─ Variable? → ECS with Fargate
    │   └─ Batch processing? → AWS Batch
    │
    └─ Traditional apps
        ├─ Predictable? → EC2 with Savings Plans/RIs
        ├─ Fault-tolerant? → Spot Instances
        └─ VMware? → VMware Cloud on AWS (Relocate)
```

### Storage Selection

```
What type of data?
├─ Block Storage
│   ├─ High-performance DB → io2 Block Express (256,000 IOPS)
│   ├─ Boot volumes → gp3 (baseline)
│   ├─ Big data/logs → st1 (throughput optimized)
│   └─ Archive → sc1 (cold HDD)
│
├─ File Storage
│   ├─ Linux/NFS → EFS
│   │   ├─ Frequent access → Standard
│   │   └─ Infrequent → EFS IA (92% cheaper)
│   ├─ Windows/SMB → FSx for Windows File Server
│   ├─ High-performance computing → FSx for Lustre
│   ├─ NetApp features → FSx for NetApp ONTAP
│   └─ OpenZFS → FSx for OpenZFS
│
└─ Object Storage (S3)
    ├─ Frequent access → S3 Standard
    ├─ Infrequent (30+ days) → S3 Standard-IA
    ├─ Unknown pattern → S3 Intelligent-Tiering
    ├─ Archive (90+ days) → S3 Glacier Flexible Retrieval
    └─ Long-term archive (10+ years) → S3 Glacier Deep Archive ($0.99/TB/month)
```

### Database Selection

```
What are the requirements?
├─ Relational Database
│   ├─ PostgreSQL compatible
│   │   ├─ Global, < 1 sec RPO → Aurora Global Database
│   │   ├─ Serverless, variable load → Aurora Serverless v2
│   │   └─ Standard → Aurora PostgreSQL
│   ├─ MySQL compatible → Aurora MySQL
│   ├─ SQL Server
│   │   ├─ Need CLR/.NET → RDS for SQL Server (Babelfish can't do CLR)
│   │   ├─ T-SQL only → Aurora PostgreSQL + Babelfish
│   │   └─ Enterprise features → SQL Server on EC2
│   ├─ Oracle
│   │   ├─ Need RAC → Oracle on EC2
│   │   └─ Standard → RDS for Oracle
│   └─ MariaDB → RDS for MariaDB
│
├─ NoSQL
│   ├─ Key-value, known access patterns → DynamoDB
│   │   ├─ Global, active-active → DynamoDB Global Tables
│   │   └─ Unpredictable traffic → DynamoDB On-Demand
│   ├─ Document store, flexible → DocumentDB (MongoDB compatible)
│   ├─ Graph database → Neptune
│   ├─ In-memory cache
│   │   ├─ Simple caching → ElastiCache for Memcached
│   │   ├─ Complex data structures → ElastiCache for Redis
│   │   └─ Global, sub-ms latency → ElastiCache for Redis + Global Datastore
│   ├─ Time-series → Amazon Timestream
│   └─ Ledger/immutable → Amazon QLDB
│
└─ Analytics
    ├─ Data warehouse → Redshift
    │   ├─ Need multi-AZ → Redshift RA3 with Multi-AZ
    │   └─ Serverless analytics → Redshift Serverless
    ├─ Ad-hoc queries on S3 → Athena
    ├─ Search & analytics → OpenSearch Service
    └─ Real-time analytics → Kinesis Analytics
```

---

## Networking Quick Reference

### Multi-Account Connectivity Decision

| Scenario | Solution | Why |
|----------|----------|-----|
| 2-5 VPCs, simple connectivity | VPC Peering | Simplest, no additional cost |
| 5-50 accounts, centralized routing | Transit Gateway | Scales better, shared via RAM |
| 50+ accounts | TGW + Shared VPC | Reduced attachment costs |
| Need service-level access (not network) | PrivateLink | No VPC peering needed, more secure |
| Overlapping CIDRs | PrivateLink | VPC Peering/TGW won't work |
| All traffic must be inspected | TGW + Inspection VPC | Centralized Network Firewall |
| On-premises to multiple VPCs | TGW + Direct Connect/VPN | Single connection to all VPCs |

### Hybrid Connectivity

```
Requirements Check:
├─ Bandwidth needed?
│   ├─ < 10 Mbps → Site-to-Site VPN
│   ├─ 10 Mbps - 10 Gbps → Direct Connect
│   └─ 10+ Gbps → Multiple Direct Connect
│
├─ Latency sensitive?
│   ├─ YES → Direct Connect (consistent)
│   └─ NO → VPN acceptable (variable)
│
├─ Encryption required?
│   ├─ Direct Connect
│   │   ├─ Public VIF → TLS at application layer
│   │   ├─ Private VIF → VPN over Direct Connect OR MACsec
│   │   └─ MACsec (Layer 2 encryption, 10/100 Gbps only)
│   └─ VPN → Native IPsec encryption
│
└─ High availability?
    ├─ 99.9% → Single Direct Connect + VPN backup
    ├─ 99.99% → Two Direct Connect (different locations) + VPN
    └─ 99.999% → Two DX locations + redundant VPN + multiple regions
```

### Direct Connect vs VPN Quick Compare

| Feature | Direct Connect | Site-to-Site VPN |
|---------|---------------|------------------|
| **Bandwidth** | 50 Mbps - 100 Gbps | Up to 1.25 Gbps per tunnel |
| **Latency** | Low, consistent | Variable (Internet) |
| **Encryption** | MACsec (Layer 2) or VPN over DX | Native IPsec |
| **Setup time** | Weeks (physical provisioning) | Minutes |
| **Cost** | Port hours + data transfer out | VPN endpoint hours (cheap) |
| **Use case** | High bandwidth, consistent latency | Quick setup, encrypted, backup |
| **Availability** | 99.9% (single), 99.99% (dual location) | 99.95% (AWS managed) |

### DNS Resolution Patterns

```
Hybrid DNS Scenarios:
├─ On-premises needs to resolve AWS private hosted zones
│   └─ Route 53 Resolver Inbound Endpoint (VPC)
│       └─ On-premises forwards queries to inbound endpoint
│
├─ AWS needs to resolve on-premises DNS
│   └─ Route 53 Resolver Outbound Endpoint (VPC)
│       └─ Resolver rules forward to on-premises DNS
│
├─ Multi-account DNS sharing
│   └─ Associate Private Hosted Zone with VPCs in other accounts
│       └─ Requires authorization from both accounts
│
└─ Global traffic management
    ├─ Latency-based routing → Route 53 latency routing
    ├─ Geographic → Route 53 geolocation routing
    ├─ Weighted (A/B testing) → Route 53 weighted routing
    └─ Failover → Route 53 failover routing + health checks
```

---

## Security Patterns

### Cross-Account Access Patterns

#### 1. Cross-Account IAM Role (Recommended)

```
Account A (Trusting):
└─ IAM Role with trust policy allowing Account B
    └─ Permission policy defining what can be done

Account B (Trusted):
└─ IAM User/Role with permission to assume role in Account A

Flow: User in B → AssumeRole → Temporary credentials → Access resources in A
```

**Use when:** General cross-account access to AWS services

#### 2. Resource-Based Policies

```
Examples:
├─ S3 bucket policy (allows Account B to access bucket)
├─ KMS key policy (allows Account B to use encryption key)
├─ Lambda function policy (allows Account B to invoke)
└─ SNS topic policy (allows Account B to publish)

No AssumeRole needed - direct access via IAM identity in Account B
```

**Use when:** Specific resource access (S3, KMS, Lambda, etc.)

#### 3. Cross-Account KMS Encryption (Tricky!)

**Requirements for Account B to decrypt object in Account A's S3 bucket with Account A's KMS key:**

1. **KMS Key Policy (Account A):** Allow Account B principal to decrypt
2. **S3 Bucket Policy (Account A):** Allow Account B to GetObject
3. **IAM Policy (Account B):** Allow decrypt on KMS key + S3 GetObject

**All three required!** Missing any = access denied

```json
// KMS Key Policy (Account A)
{
  "Sid": "Allow Account B to decrypt",
  "Effect": "Allow",
  "Principal": {"AWS": "arn:aws:iam::ACCOUNT-B:role/RoleName"},
  "Action": ["kms:Decrypt", "kms:DescribeKey"],
  "Resource": "*"
}

// S3 Bucket Policy (Account A)
{
  "Effect": "Allow",
  "Principal": {"AWS": "arn:aws:iam::ACCOUNT-B:role/RoleName"},
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::bucket/*"
}

// IAM Policy (Account B - attached to role)
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::bucket-in-account-a/*"
},
{
  "Effect": "Allow",
  "Action": ["kms:Decrypt"],
  "Resource": "arn:aws:kms:region:ACCOUNT-A:key/key-id"
}
```

### Service Control Policies (SCPs) - Critical Patterns

#### SCP Evaluation Logic

```
Final Permission = Identity Policy ∩ SCP1 ∩ SCP2 ∩ ... ∩ SCPn

Where ∩ = AND (all must allow)
Any explicit deny = final deny
```

#### Common SCP Use Cases

**1. Deny specific regions:**
```json
{
  "Sid": "DenyRegionsExceptApproved",
  "Effect": "Deny",
  "Action": "*",
  "Resource": "*",
  "Condition": {
    "StringNotEquals": {
      "aws:RequestedRegion": ["us-east-1", "eu-west-1"]
    }
  }
}
```

**2. Prevent security service tampering:**
```json
{
  "Sid": "ProtectSecurityServices",
  "Effect": "Deny",
  "Action": [
    "cloudtrail:StopLogging",
    "cloudtrail:DeleteTrail",
    "guardduty:DeleteDetector",
    "config:DeleteConfigRule",
    "securityhub:DisableSecurityHub"
  ],
  "Resource": "*"
}
```

**3. Prevent leaving organization:**
```json
{
  "Sid": "PreventLeavingOrganization",
  "Effect": "Deny",
  "Action": "organizations:LeaveOrganization",
  "Resource": "*"
}
```

**4. Deny expensive instance types:**
```json
{
  "Sid": "DenyExpensiveInstances",
  "Effect": "Deny",
  "Action": "ec2:RunInstances",
  "Resource": "arn:aws:ec2:*:*:instance/*",
  "Condition": {
    "StringLike": {
      "ec2:InstanceType": ["p3.*", "p4.*", "*.metal"]
    }
  }
}
```

### SCP Troubleshooting

**Problem:** SCP denies but users can still perform action

**Common causes:**
1. FullAWSAccess policy still attached (allows everything)
2. SCP applied to wrong OU
3. Account not in expected OU
4. Service-linked roles excluded
5. Root user (SCPs don't affect root)

**Solution:**
1. Check all attached SCPs (multiple SCPs = AND logic)
2. Remove FullAWSAccess if using deny lists
3. Test with IAM Policy Simulator
4. Review CloudTrail for SCP evaluation results

---

## Database Decision Framework

### When to Use Each Database

| Database | Best For | Avoid For |
|----------|----------|-----------|
| **Aurora PostgreSQL** | Relational, high performance, read-heavy | Simple apps (use RDS), extreme scale (use DynamoDB) |
| **Aurora Serverless v2** | Variable/unpredictable traffic, dev/test | Steady 24/7 (traditional cheaper) |
| **Aurora Global Database** | Global apps, DR, < 1 sec RPO | Single region (use Multi-AZ Aurora) |
| **DynamoDB** | Key-value, known access patterns, extreme scale | Complex queries, ad-hoc analytics |
| **DynamoDB Global Tables** | Global, multi-region writes, active-active | Single region (use standard DynamoDB) |
| **RDS for SQL Server** | SQL Server with CLR, .NET assemblies | Just T-SQL (use Babelfish) |
| **Babelfish for Aurora** | SQL Server T-SQL code, avoid licensing | CLR code (not supported) |
| **DocumentDB** | MongoDB workloads, document store | Relational schema |
| **ElastiCache Redis** | Session store, leaderboard, pub/sub | Simple cache (use Memcached) |
| **ElastiCache Memcached** | Simple caching, horizontal scaling | Complex data (use Redis) |
| **Redshift** | Data warehouse, OLAP, analytics | OLTP, real-time (use Aurora/DynamoDB) |
| **Athena** | Ad-hoc queries on S3, serverless | Real-time queries (use DynamoDB) |
| **Neptune** | Graph relationships, social networks | Relational data |
| **QLDB** | Immutable ledger, audit trail, cryptographic verification | General database |
| **Timestream** | Time-series data (IoT, metrics) | Relational data |

### RDS Proxy - When Needed

**Problem:** Serverless architectures (Lambda) overwhelm database connections

**Scenario:**
- Lambda can scale to 1,000 concurrent executions
- RDS supports ~150 connections (db.r5.large)
- Result: Connection exhaustion, failures

**Solution: RDS Proxy**
- Connection pooling
- Reuses connections
- Reduces connection overhead
- Supports IAM authentication

**Use RDS Proxy when:**
- Serverless applications (Lambda, Fargate)
- High connection churn
- Need IAM database authentication
- Want connection pooling

---

## Disaster Recovery Patterns

### RPO vs RTO Requirements

```
Backup/Restore
├─ RTO: Hours to days
├─ RPO: Hours to days
├─ Cost: $
└─ Use: Non-critical systems, long acceptable downtime

Pilot Light
├─ RTO: 10 minutes to hours
├─ RPO: Minutes
├─ Cost: $$
└─ Use: Core data replicated, minimal resources running

Warm Standby
├─ RTO: Minutes
├─ RPO: Seconds to minutes
├─ Cost: $$$
└─ Use: Scaled-down version running, can scale quickly

Active-Active (Multi-Region)
├─ RTO: Real-time (automatic failover)
├─ RPO: Near-zero (continuous replication)
├─ Cost: $$$$
└─ Use: Mission-critical, no downtime acceptable
```

### DR Strategy Decision Tree

```
What are your RTO/RPO requirements?

RTO > 24 hours, RPO > 24 hours
└─ Backup/Restore
    ├─ EBS snapshots to S3 (cross-region copy)
    ├─ RDS automated backups (cross-region copy)
    ├─ S3 Cross-Region Replication
    └─ AMIs copied to DR region

RTO: Hours, RPO: Hours
└─ Pilot Light
    ├─ Minimal resources (data layer only) in DR region
    ├─ Aurora cross-region read replica (promote on failover)
    ├─ DynamoDB Global Tables
    └─ Pre-deployed infrastructure (IaC ready)

RTO: Minutes, RPO: Minutes
└─ Warm Standby
    ├─ Aurora Global Database (< 1 sec replication)
    ├─ DynamoDB Global Tables (sub-second replication)
    ├─ Reduced capacity Auto Scaling in DR
    ├─ Route 53 health checks + failover routing
    └─ Can scale to full capacity in minutes

RTO: Seconds, RPO: Seconds
└─ Active-Active (Multi-Region)
    ├─ Full capacity in both regions
    ├─ Aurora Global Database OR DynamoDB Global Tables
    ├─ Route 53 latency/geolocation routing
    ├─ CloudFront for global distribution
    └─ Automatic failover (no manual intervention)
```

### Service-Specific DR Options

| Service | DR Mechanism | RPO | Notes |
|---------|-------------|-----|-------|
| **Aurora** | Global Database | < 1 sec | Fastest cross-region replication |
| **RDS** | Cross-region read replica | Minutes | Manual promotion required |
| **DynamoDB** | Global Tables | < 1 sec | Active-active multi-region |
| **S3** | Cross-Region Replication (CRR) | < 15 min | Automatic, asynchronous |
| **EBS** | Snapshots (cross-region copy) | Hours | Manual, point-in-time |
| **EFS** | EFS-to-EFS Backup (AWS Backup) | Hours | Regional service |
| **Route 53** | Health checks + failover routing | 30-60 sec | TTL-dependent |
| **CloudFront** | Multi-origin failover | Seconds | Automatic origin failover |

---

## Cost Optimization Strategies

### Compute Cost Optimization

#### EC2 Purchasing Options

| Option | Discount | Best For | Commitment |
|--------|----------|----------|------------|
| **On-Demand** | 0% (baseline) | Unpredictable, short-term, spiky | None |
| **Savings Plans (Compute)** | Up to 66% | Consistent usage, flexibility across instance families/regions | 1 or 3 years |
| **Savings Plans (EC2 Instance)** | Up to 72% | Consistent usage, specific instance family | 1 or 3 years |
| **Reserved Instances** | Up to 72% | Specific instance type, predictable | 1 or 3 years |
| **Spot Instances** | Up to 90% | Fault-tolerant, flexible, batch | None (can be interrupted) |
| **Dedicated Hosts** | - | Licensing (BYOL), compliance | Hourly or Reserved |

#### Decision Tree: Which Purchasing Option?

```
Is the workload fault-tolerant (can handle interruptions)?
├─ YES → Spot Instances (70-90% savings)
│   └─ Examples: Batch processing, big data, CI/CD, web crawlers
│
└─ NO (needs high availability)
    ├─ Is usage predictable and steady?
    │   ├─ YES → Savings Plans or Reserved Instances (60-72% savings)
    │   │   ├─ Need flexibility? → Compute Savings Plans
    │   │   └─ Specific instances? → EC2 Instance Savings Plans or RIs
    │   │
    │   └─ NO (variable usage) → On-Demand
    │       └─ Baseline with Savings Plans + On-Demand for burst
    │
    └─ Have licensing restrictions (BYOL)?
        └─ Dedicated Hosts
```

### Storage Cost Optimization

#### S3 Storage Class Selection

| Storage Class | Use Case | Cost (per GB/month) | Retrieval Time |
|---------------|----------|---------------------|----------------|
| **S3 Standard** | Frequent access (> 1/month) | $0.023 | Milliseconds |
| **S3 Intelligent-Tiering** | Unknown/changing access patterns | $0.0025 - $0.023 + monitoring | Auto-moves between tiers |
| **S3 Standard-IA** | Infrequent (1/month - 1/90 days) | $0.0125 + retrieval | Milliseconds |
| **S3 One Zone-IA** | Non-critical, infrequent | $0.01 + retrieval | Milliseconds |
| **S3 Glacier Instant Retrieval** | Archive, instant access needed | $0.004 + retrieval | Milliseconds |
| **S3 Glacier Flexible Retrieval** | Archive (1-2 times/year) | $0.0036 | 1-5 minutes to 12 hours |
| **S3 Glacier Deep Archive** | Long-term archive (7-10+ years) | $0.00099 | 12 hours |

#### S3 Lifecycle Policy Example

```
Optimize media storage:
├─ Day 0: S3 Standard (uploaded, frequently accessed)
├─ Day 30: Move to S3 Standard-IA (less frequent)
├─ Day 90: Move to S3 Glacier Flexible Retrieval (archive)
├─ Day 365: Move to S3 Glacier Deep Archive (long-term)
└─ Day 2,555: Delete (7 years retention met)

Savings: $0.023/GB → $0.00099/GB = 96% reduction after 1 year
```

### Database Cost Optimization

**Aurora vs RDS Cost Comparison:**

| Workload | Recommendation | Why |
|----------|---------------|-----|
| Read-heavy (80% reads) | Aurora | Up to 5x read throughput, 15 read replicas |
| Write-heavy | RDS (PostgreSQL/MySQL) | Aurora replicates all writes, higher cost |
| Variable traffic | Aurora Serverless v2 | Auto-scales, pay for actual usage |
| Steady 24/7 | RDS with Reserved Instance | Cheaper than Aurora for steady workloads |
| Global, multi-region | Aurora Global Database | Built-in, < 1 sec replication |

**ElastiCache Cost Optimization:**
- Use Graviton instances (r7g) - 35% better price-performance
- Reserved Nodes for steady workloads (55% savings)
- Data tiering (Redis 7) - Store values in SSD, keys in memory

---

## Migration Decision Framework

### The 7 R's of Migration

| Strategy | What It Is | When to Use | Tools |
|----------|-----------|-------------|-------|
| **Retire** | Turn off, decommission | Application no longer needed | None (just shut down) |
| **Retain** | Keep on-premises (for now) | Recent investment, not ready, compliance | None |
| **Relocate** | VMware to VMware Cloud on AWS | VMware workloads, fast migration, keep familiarity | VMware HCX |
| **Rehost** | Lift-and-shift to EC2 | Fast migration, cloud benefits later | AWS MGN, CloudEndure |
| **Replatform** | Migrate to managed service | Some cloud benefits, minimal code changes | AWS MGN + manual, DMS |
| **Repurchase** | Move to SaaS | Eliminate maintenance, modern features | Manual migration |
| **Refactor/Re-architect** | Redesign for cloud-native | Maximum cloud benefits, modernize | Manual development |

### Migration Strategy Decision Tree

```
Is the application still needed?
├─ NO → Retire (decommission, archive data if needed)
│
└─ YES
    ├─ Recent major investment (hardware, licenses)?
    │   └─ YES → Retain (wait, migrate later)
    │
    └─ NO
        ├─ VMware workloads?
        │   ├─ Want native AWS features → Rehost (to EC2)
        │   └─ Keep VMware familiarity → Relocate (VMware Cloud on AWS)
        │
        ├─ Vendor provides SaaS alternative?
        │   └─ YES → Repurchase (if cost-effective)
        │
        └─ Need to migrate to AWS
            ├─ Time-constrained (datacenter exit)?
            │   └─ Rehost (lift-and-shift, fastest)
            │
            ├─ Want some cloud benefits?
            │   └─ Replatform (DB to RDS, app to Elastic Beanstalk)
            │
            └─ Want maximum cloud benefits?
                └─ Refactor (re-architect to serverless, containers, microservices)
```

### Migration Tools - When to Use What

| Tool | Use Case | Migration Type |
|------|----------|---------------|
| **AWS Application Migration Service (MGN)** | Physical, virtual, cloud servers → EC2 | Rehost (servers) |
| **AWS Database Migration Service (DMS)** | Database migrations, continuous replication | Replatform (databases) |
| **AWS Schema Conversion Tool (SCT)** | Convert database schemas (Oracle → PostgreSQL) | Heterogeneous database migration |
| **AWS DataSync** | Large-scale data transfer (on-prem → AWS storage) | File systems, object storage |
| **AWS Transfer Family** | SFTP/FTPS/FTP endpoints → S3/EFS | File transfers (partner integration) |
| **AWS Snow Family** | Offline data transfer (TBs to PBs) | Network-constrained migrations |
| **CloudEndure Disaster Recovery** | Continuous replication for DR | Pilot Light, Warm Standby DR |
| **VMware Cloud on AWS (HCX)** | VMware VMs → VMware Cloud on AWS | Relocate (VMware-to-VMware) |

---

## Tricky Scenarios & Common Pitfalls

### Scenario 1: Lambda Timeout Trap

**Question:** "Migrate video transcoding batch job to serverless"

**Common Wrong Answer:** Use Lambda

**Pitfall:** Lambda has **15-minute maximum timeout**

**Correct Answer:**
- Video transcoding takes 20-45 minutes
- Use **ECS Fargate** (serverless containers, no time limit)
- Or **AWS Batch** (managed batch processing)
- Or **Step Functions + Lambda** (if can break into < 15-min chunks)

### Scenario 2: RDS Connection Exhaustion

**Question:** "Lambda API processes 1000 concurrent requests, stores data in RDS MySQL"

**Common Wrong Answer:** Connect Lambda directly to RDS

**Pitfall:**
- Lambda can scale to 1000 concurrent executions
- RDS db.r5.large supports ~150 connections
- Result: Connection exhaustion, 850 Lambda failures

**Correct Answer:** Use **RDS Proxy**
- Connection pooling
- Reuses connections
- Supports IAM authentication

### Scenario 3: DynamoDB for Complex Queries

**Question:** "Migrate relational database to DynamoDB for scale, users run ad-hoc SQL queries"

**Common Wrong Answer:** Migrate to DynamoDB

**Pitfall:** DynamoDB is **not a relational database**
- No joins (must denormalize)
- No complex aggregations (must pre-calculate)
- Access patterns must be known upfront

**Correct Answer:**
- Keep **Aurora** (or **RDS**) for relational, ad-hoc queries
- Use **DynamoDB** only if access patterns are known and simple
- Consider **Redshift** or **Athena** for analytics

### Scenario 4: Snowball Threshold Miscalculation

**Question:** "Transfer 50 TB over 500 Mbps connection in 2 weeks"

**Common Wrong Answer:** "500 Mbps is fast enough"

**Calculation:**
```
Transfer Time = (50 TB × 8,000 GB/TB) / (0.5 Gbps × 86,400 sec/day × 0.8 efficiency)
             = 400,000 GB / 34,560 Gbps-sec
             = ~11.6 days (theoretical)
             = ~16-18 days (real-world)
```

**Result:** Exceeds 2-week deadline!

**Correct Answer:** Use **Snowball Edge**
- Transfer to device: 2-3 days
- Ship time: 2-3 days each way
- AWS import: 1-2 days
- **Total: ~7-10 days** (meets deadline)

**Rule of Thumb:** If transfer over network > 7 days, use Snowball

### Scenario 5: SCP Not Working

**Question:** "Applied SCP to deny p3 instances, but developers can still launch them"

**Common Wrong Answer:** SCP is broken

**Pitfall:** **FullAWSAccess** SCP still attached

**Why:**
- SCPs use AND logic: All attached SCPs must allow
- FullAWSAccess allows all actions
- Your deny SCP denies p3 instances
- Result: FullAWSAccess allows → Action permitted

**Correct Answer:**
1. Remove **FullAWSAccess** from OU
2. Create allow-all SCP + deny specific SCP
3. Test with IAM Policy Simulator

### Scenario 6: Babelfish Limitations

**Question:** "Migrate SQL Server (with CLR code) to Aurora PostgreSQL with Babelfish"

**Common Wrong Answer:** Babelfish supports all SQL Server features

**Pitfall:** Babelfish does **NOT support CLR** (Common Language Runtime)

**Correct Options:**
1. **RDS for SQL Server** (keeps CLR support, still licensed)
2. Refactor CLR out of database (move to application)
3. **SQL Server on EC2** (full control, manage yourself)

**Remember:** Babelfish supports T-SQL, not CLR/.NET assemblies

### Scenario 7: ECS vs EKS Default

**Question:** "Deploy single containerized Java app to AWS, team has no Kubernetes experience"

**Common Wrong Answer:** Use EKS (students think Kubernetes is always better)

**Pitfall:**
- EKS: $0.10/hour cluster cost + complexity
- Requires Kubernetes expertise
- Over-engineering for simple use case

**Correct Answer:** **ECS**
- No cluster cost
- Simpler (no K8s knowledge needed)
- Sufficient for AWS-native use cases

**Use EKS only if:**
- Explicitly requires Kubernetes
- Multi-cloud portability needed
- Team has K8s expertise

### Scenario 8: Serverless for Steady Workload

**Question:** "API processes 1000 requests/hour 24/7, wants to modernize to serverless"

**Common Wrong Answer:** Lambda + API Gateway

**Pitfall:** Serverless pricing not optimal for steady 24/7 workloads

**Cost Comparison:**
- **Lambda:** ~$144/month (24,000 requests/day × 30 days)
- **ECS Fargate (1 task):** ~$30/month
- **ECS with EC2 (t3.medium RI):** ~$20/month

**Correct Answer:** **ECS with EC2 Reserved Instance** (cheapest for steady load)

**Lambda makes sense for:**
- Variable/spiky traffic
- Event-driven (sporadic)
- Intermittent workload

### Scenario 9: Heterogeneous Migration Without SCT

**Question:** "Migrate Oracle database to Aurora PostgreSQL using DMS"

**Common Wrong Answer:** DMS is sufficient

**Pitfall:** Heterogeneous migration (different engines) requires **schema conversion**

**Correct Process:**
1. **AWS SCT** (Schema Conversion Tool) - Convert schema, stored procedures, functions
2. **AWS DMS** - Migrate data, continuous replication

**Remember:**
- Homogeneous (Oracle → Oracle): DMS only
- Heterogeneous (Oracle → PostgreSQL): **SCT + DMS**

### Scenario 10: Microservices Over-Engineering

**Question:** "Small CRUD app, 5,000 users, 3 developers, want to modernize"

**Common Wrong Answer:** Decompose to microservices

**Pitfall:**
- Microservices add complexity (API gateway, service mesh, distributed tracing)
- No scaling mismatch
- Single small team (no coordination benefits)

**Correct Answer:** **Containerized monolith** (ECS/EKS)

**Microservices make sense when:**
- Large application with scaling mismatches
- Multiple teams (need independent deployment)
- Different technology stacks required

---

## Service Limits & Quotas

### Critical Limits to Remember

| Service | Limit | Impact | Solution |
|---------|-------|--------|----------|
| **Lambda** | 15-minute timeout | Long-running tasks fail | Use Fargate, Batch, or Step Functions |
| **Lambda** | 1000 concurrent executions (default) | Throttling | Request limit increase |
| **API Gateway** | 10,000 requests/second (default) | Throttling | Request limit increase |
| **VPC** | 5 VPCs per region (default) | Can't create more | Request limit increase |
| **VPC Peering** | 125 peering connections per VPC | Multi-account limitations | Use Transit Gateway |
| **Transit Gateway** | 5,000 attachments | Large multi-account limits | Design with shared VPCs |
| **Direct Connect** | 50 Virtual Interfaces per connection | Multi-VPC connectivity | Use Transit Gateway VIF |
| **Route 53** | 500 hosted zones (default) | Multi-account DNS | Request increase |
| **S3** | 3,500 PUT/COPY/POST/DELETE per second per prefix | High write throughput | Use multiple prefixes |
| **S3** | 5,500 GET/HEAD per second per prefix | High read throughput | Use CloudFront |
| **RDS MySQL** | ~150 connections (db.r5.large) | Connection exhaustion | Use RDS Proxy |
| **Aurora** | 15 read replicas | Read scaling limit | Use Aurora Serverless v2 |
| **DynamoDB** | 40,000 read/write capacity units (on-demand) | Throttling | Request limit increase |
| **CloudFormation** | 200 stacks per region | Infrastructure-as-code limits | Use nested stacks |
| **ECS** | 1,000 tasks per service | Service scaling | Create multiple services |

### How to Handle Quotas in Exam

**Pattern Recognition:**

| Exam Keywords | Quota Issue | Solution |
|---------------|-------------|----------|
| "Hundreds of VPCs" | VPC limit (5 default) | Transit Gateway |
| "Thousands of Lambda invocations failing" | Concurrency limit | Request increase or use SQS queue |
| "S3 uploads slow at peak" | 3,500 PUT/s per prefix | Use multiple prefixes (partitioning) |
| "RDS connections failing during traffic spike" | Connection limit | RDS Proxy |
| "CloudFormation stack limit reached" | 200 stacks | Nested stacks or StackSets |

---

## Exam Keywords & Patterns

### Keyword → Service Mapping

| Keyword/Phrase | Think... | Why |
|----------------|----------|-----|
| "Cannot be disabled by member accounts" | Organization Trail | Centralized, immutable |
| "Overlapping IP addresses" | PrivateLink | VPC Peering/TGW won't work |
| "Sub-second RPO" | Aurora Global DB or DynamoDB Global Tables | Fastest replication |
| "All traffic must be inspected" | TGW + Inspection VPC (Network Firewall) | Centralized inspection |
| "Automatically rotate credentials" | Secrets Manager | Built-in rotation |
| "Lowest cost for archival" | S3 Glacier Deep Archive | $0.99/TB/month |
| "Temporary credentials" | STS AssumeRole | Not IAM access keys |
| "Least operational overhead" | Managed services, serverless | Reduce management |
| "Most cost-effective" | Spot, Savings Plans, serverless | Optimize costs |
| "Highly available" | Multi-AZ minimum | 99.99% SLA |
| "Disaster recovery" | Cross-region replication | Multi-region |
| "Immutable logs" | S3 Object Lock | Compliance |
| "Prevent data exfiltration" | VPC endpoints, SCPs | Block external access |
| "Centralized DNS" | Route 53 Resolver endpoints | Hybrid DNS |
| "99.99% availability" | Multi-AZ, likely multi-region | High SLA |
| "Sub-millisecond latency" | ElastiCache, DynamoDB DAX | In-memory |
| "Consistent low latency" | Direct Connect | Not VPN |
| "Millions of requests per second" | DynamoDB, CloudFront | Extreme scale |
| "BYOL (Bring Your Own License)" | Dedicated Hosts | License compliance |
| "Compliance (HIPAA, PCI-DSS)" | Encryption, audit logging, SCPs | Regulatory requirements |

### Decision Framework Keywords

| Question Contains | Correct Approach |
|------------------|------------------|
| "Minimize costs" | Spot, RIs, Savings Plans, S3 Intelligent-Tiering, right-sizing |
| "Least operational overhead" | Managed services (RDS, Aurora, Fargate, Lambda) |
| "Maximum performance" | Provisioned IOPS, Aurora, ElastiCache, CloudFront |
| "Highly scalable" | Auto Scaling, DynamoDB, S3, serverless |
| "Most secure" | Encryption (KMS), SCPs, least privilege, VPC endpoints |
| "Fastest migration" | Rehost (lift-and-shift), MGN, Snowball |
| "Cloud-native benefits" | Refactor to serverless, containers, managed services |
| "Global users" | CloudFront, Route 53, Global Accelerator |
| "Real-time" | Kinesis, DynamoDB, ElastiCache, Lambda |
| "Near real-time" | Kinesis Firehose, DynamoDB Streams |
| "Analytics" | Athena, Redshift, QuickSight, EMR |

### Common Exam Distractors

**Watch out for these traps:**

| Distractor | Why It's Wrong | Correct Answer |
|------------|---------------|----------------|
| "Use Lambda for 30-min video processing" | Lambda max 15 min | ECS Fargate, AWS Batch |
| "Use VPC Peering for 100 accounts" | Doesn't scale | Transit Gateway |
| "Use EKS for simple container" | Over-engineering | ECS (simpler, cheaper) |
| "Use microservices for small app" | Unnecessary complexity | Monolith or modular monolith |
| "Use Active-Active DR everywhere" | Too expensive | Match RTO/RPO (Warm Standby often sufficient) |
| "Use Spot for critical production" | Can be interrupted | Use On-Demand or RIs |
| "Use FullAWSAccess + Deny SCP" | Allow overrides deny | Remove FullAWSAccess |
| "Use DynamoDB for complex queries" | Not relational | Aurora, RDS |
| "Transfer 100 TB over 1 Gbps in 1 week" | Calculate! (11+ days) | Snowball |
| "Use EFS for Windows" | EFS is NFS (Linux) | FSx for Windows File Server |

---

## Quick Calculation Formulas

### Network Transfer Time

```
Transfer Time (days) = (Data in TB × 8,000 GB) / (Bandwidth in Gbps × 86,400 sec/day × 0.8 efficiency)

Example: 50 TB over 1 Gbps
= (50 × 8,000) / (1 × 86,400 × 0.8)
= 400,000 / 69,120
= ~5.8 days (theoretical)
= ~8-10 days (real-world)
```

**Rule of Thumb:** If > 7 days, use Snowball

### RTO/RPO Achievement

**RPO (Recovery Point Objective):**
- How much data can you lose?
- Aurora Global Database: < 1 second
- DynamoDB Global Tables: < 1 second
- Aurora cross-region replica: Minutes
- EBS snapshots: Hours (last snapshot time)

**RTO (Recovery Time Objective):**
- How long to recover?
- Active-Active: Seconds (automatic failover)
- Warm Standby: Minutes (scale up + DNS failover)
- Pilot Light: Hours (provision resources + restore data)
- Backup/Restore: Days (restore from backups)

### Cost Comparison Quick Math

**EC2 Pricing Comparison (t3.medium in us-east-1):**
- On-Demand: $0.0416/hour = $30.37/month
- 3-year RI (all upfront): ~$12/month (60% savings)
- Compute Savings Plan: ~$13/month (57% savings)
- Spot: ~$3-6/month (80-90% savings, variable)

**Lambda vs Fargate (1 GB memory, 24/7):**
- Lambda: 730 hours × $0.0000166667/GB-sec × 3600 sec = ~$43/month
- Fargate (0.25 vCPU, 0.5 GB): ~$12/month (cheaper for steady workloads)

---

## Final Exam Tips

### Time Management

- **180 minutes for 75 questions** = 2.4 minutes per question
- Flag difficult questions, come back later
- Don't spend > 3 minutes on any single question first pass
- Reserve 30 minutes for review

### Question Approach

1. **Read the question carefully** - Look for hidden requirements (cost, time, operational overhead)
2. **Eliminate obviously wrong answers** - Cross out distractors
3. **Look for keywords** - "Minimize costs", "least overhead", "highly available"
4. **Calculate if numbers given** - Transfer time, costs, capacity
5. **Choose the BEST answer** - Not just a correct answer, but the BEST for the scenario

### Common Patterns

- **2 answers seem correct?** Look for keywords (cost vs performance)
- **All answers seem wrong?** Re-read question, often a hidden constraint
- **Not sure?** Eliminate 2, guess from remaining 2, flag for review

### Study Focus

**High-yield topics (frequently tested):**
1. Multi-account networking (Transit Gateway, VPC Peering, PrivateLink)
2. Hybrid connectivity (Direct Connect, VPN, hybrid DNS)
3. Cross-account access (IAM roles, resource policies, SCPs)
4. Disaster recovery strategies (Aurora Global DB, DynamoDB Global Tables)
5. Migration strategies (7 R's, tools selection)
6. Cost optimization (Savings Plans, Spot, S3 storage classes)
7. Security (KMS, Secrets Manager, GuardDuty, SCPs)
8. Database selection (Aurora, DynamoDB, RDS, when to use what)

**Medium-yield topics:**
1. Serverless architectures (Lambda, Fargate, API Gateway)
2. Container orchestration (ECS vs EKS)
3. Storage options (S3, EFS, FSx)
4. Analytics (Athena, Redshift, EMR, Kinesis)
5. Caching (CloudFront, ElastiCache, DynamoDB DAX)

**Lower-yield (but still important):**
1. Machine learning services
2. IoT services
3. Media services
4. Game development services

---

## Cheat Sheet Summary

### Top 10 Decision Frameworks

1. **Multi-account connectivity:** 2-5 VPCs = Peering, 5-50 = TGW, overlapping CIDRs = PrivateLink
2. **Database selection:** Relational = Aurora, Key-value = DynamoDB, Analytics = Redshift
3. **DR strategy:** Match RTO/RPO (Backup/Restore → Pilot Light → Warm Standby → Active-Active)
4. **Migration strategy:** Fast = Rehost, Cloud benefits = Replatform, Max benefits = Refactor
5. **Cost optimization:** Steady = RIs/Savings Plans, Variable = On-Demand, Fault-tolerant = Spot
6. **Storage class:** Frequent = S3 Standard, Unknown = Intelligent-Tiering, Archive = Glacier
7. **Compute selection:** Event-driven = Lambda, Containers = ECS/EKS, Traditional = EC2
8. **Hybrid connectivity:** < 10 Mbps = VPN, 10 Mbps - 10 Gbps = DX, need encryption = MACsec
9. **Cross-account access:** General = IAM role, Specific resource = Resource policy
10. **Security controls:** Multi-account = SCPs, Credentials = Secrets Manager, Detection = GuardDuty

### Top 10 Common Pitfalls

1. Lambda 15-minute timeout (use Fargate for longer tasks)
2. RDS connection exhaustion with Lambda (use RDS Proxy)
3. DynamoDB for complex queries (keep relational for ad-hoc queries)
4. SCP with FullAWSAccess (remove FullAWSAccess for denies to work)
5. Snowball threshold miscalculation (calculate transfer time!)
6. Babelfish limitations (no CLR support)
7. ECS vs EKS over-engineering (ECS for simple use cases)
8. Serverless for steady workloads (EC2 with RIs cheaper)
9. Heterogeneous migration without SCT (need SCT + DMS)
10. Microservices over-engineering (monolith fine for small apps)

---

**Good luck on your exam!**

Remember: **Understand the "why" and "when"**, not just the "what". Focus on trade-offs, decision-making, and choosing the BEST answer for the specific scenario.
