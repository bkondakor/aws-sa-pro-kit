---
title: "Domain 3: Service Comparison Matrix"
domain: 3
domain_name: "Continuous Improvement for Existing Solutions"
weight: "25%"
file_type: "service-comparisons"
exam_topics:
  - service-comparisons
  - monitoring
  - optimization
  - aws-services
status: complete
last_updated: "2025-11-18"
---

# Domain 3: Service Comparison Matrix

## Overview

This document provides side-by-side comparisons of commonly confused AWS services in Domain 3. Understanding these differences is critical for choosing the right service on the exam.

---

## Monitoring and Observability

### CloudWatch vs CloudTrail vs Config vs X-Ray

| Aspect | CloudWatch | CloudTrail | AWS Config | X-Ray |
|--------|-----------|-----------|------------|-------|
| **Primary Purpose** | Performance monitoring | API auditing | Resource compliance | Distributed tracing |
| **What it tracks** | Metrics, logs, events | API calls (who did what) | Resource configurations | Request flow through services |
| **Data Type** | Time-series metrics, log events | JSON event records | Resource snapshots | Trace segments |
| **Real-time** | Yes (metrics, logs) | Near real-time (< 15 min) | Periodic snapshots | Yes |
| **Retention** | Configurable (metrics: 15 months default) | 90 days (Event History), indefinite (trails to S3) | Configurable | 30 days |
| **Use Case** | "Is my app slow?" | "Who deleted the S3 bucket?" | "Are resources compliant?" | "Where is the bottleneck?" |
| **Cost Model** | Per metric, per GB ingested | Per event recorded | Per config item recorded | Per trace recorded/retrieved |
| **Query Language** | CloudWatch Logs Insights (SQL-like) | CloudTrail Lake (SQL) | Config advanced queries (SQL-like) | Console/API filtering |
| **Alerting** | Yes (alarms) | No (use EventBridge) | Yes (Config rules) | No (export to CloudWatch) |

**When to Use:**
- **CloudWatch**: Monitor application performance, resource utilization, set up alarms
- **CloudTrail**: Security auditing, compliance, incident investigation ("who changed what?")
- **Config**: Resource inventory, compliance checking, configuration drift detection
- **X-Ray**: Debug performance issues, understand service dependencies, find bottlenecks

**Example Scenario:**
```
Problem: Application is slow

CloudWatch: Shows p99 latency increased from 200ms to 2000ms
X-Ray: Shows database query time increased from 10ms to 1800ms
CloudWatch Logs: Shows specific slow query in application logs
CloudTrail: Shows someone modified database parameter group yesterday
Config: Shows parameter group change from previous configuration
```

---

### CloudWatch Metrics vs CloudWatch Logs vs CloudWatch Events/EventBridge

| Feature | CloudWatch Metrics | CloudWatch Logs | EventBridge (CW Events) |
|---------|-------------------|-----------------|------------------------|
| **Data Type** | Numerical time-series | Text logs | JSON events |
| **Structure** | Metric name + dimensions + value + timestamp | Log streams in log groups | Event patterns |
| **Granularity** | 1, 5, or 60 minute (standard), 1 second (high-res) | Millisecond timestamps | Real-time |
| **Retention** | 15 months | Configurable (never to 10 years) | N/A (event-driven) |
| **Query** | GetMetricStatistics API | CloudWatch Logs Insights (SQL) | Event pattern matching |
| **Visualization** | Graphs, dashboards | Log Insights results | N/A |
| **Alerting** | CloudWatch Alarms | Metric filters → alarms | Rules → targets |
| **Cost** | $0.30 per metric/month | $0.50/GB ingested, $0.03/GB stored | $1.00 per million events |
| **Use Case** | "What is average CPU?" | "Show me error messages" | "Do something when X happens" |

**Integration Example:**
```
Application logs error → CloudWatch Logs
Metric filter extracts error count → CloudWatch Metric
Metric exceeds threshold → CloudWatch Alarm
Alarm triggers → EventBridge Rule
EventBridge invokes → Lambda function (auto-remediation)
```

**When to Use:**
- **Metrics**: Aggregate performance data, CPU/memory utilization, request counts
- **Logs**: Detailed event logs, error messages, application debugging
- **EventBridge**: React to events, trigger automation, integrate systems

---

### CloudWatch Logs vs S3 for Log Storage

| Aspect | CloudWatch Logs | S3 |
|--------|----------------|-----|
| **Purpose** | Active log analysis | Long-term log archival |
| **Query** | CloudWatch Logs Insights (interactive) | Athena (SQL on S3) |
| **Retention** | 1 day to 10 years (or never) | Indefinite (with lifecycle) |
| **Cost (Ingestion)** | $0.50/GB | Free (inbound) |
| **Cost (Storage)** | $0.03/GB/month | $0.023/GB/month (Standard), $0.0125/GB (IA), $0.004/GB (Glacier) |
| **Cost (Query)** | Included | $5.00 per TB scanned |
| **Search Speed** | Fast (indexed) | Slower (scan files) |
| **Integration** | Native CloudWatch alarms, metric filters | Athena, QuickSight, EMR |
| **Stream** | Yes (subscriptions) | No (batch) |

**Best Practice:**
```
Days 1-30: CloudWatch Logs (frequent queries, metric filters, alarms)
Days 30-90: CloudWatch Logs (with longer retention)
Days 90+: Export to S3 → S3 Glacier (compliance, cost optimization)

Cost Example (100 GB/day):
CloudWatch (30 days):
- Ingestion: 100 GB × $0.50 = $50/day
- Storage: 3000 GB × $0.03 = $90/month
- Total: $1,590/month

S3 (30 days):
- Ingestion: Free
- Storage: 3000 GB × $0.023 = $69/month
- Athena queries: ~$5/month (100 queries × 10 GB each)
- Total: $74/month

Savings: $1,516/month (95% cheaper)

But: CloudWatch provides real-time monitoring, metric filters, alarms
S3: Cost-effective for archival only
```

**Hybrid Approach:**
- Real-time operational logs → CloudWatch Logs (7-30 days)
- Historical/compliance logs → S3 with lifecycle (90+ days)
- Use CloudWatch Logs subscription filters to stream to S3 automatically

---

## Automation and Orchestration

### Systems Manager Run Command vs Automation vs State Manager

| Feature | Run Command | Automation | State Manager |
|---------|------------|------------|---------------|
| **Purpose** | Execute commands on instances | Multi-step workflows | Maintain desired state |
| **Execution** | Ad-hoc or scheduled | Triggered or scheduled | Scheduled or continuous |
| **Steps** | Single command/script | Multiple steps with logic | Single document repeatedly |
| **Approval** | No | Yes (optional) | No |
| **Cross-account** | Limited | Yes (with roles) | Yes |
| **Branching/Logic** | No | Yes (if/else, parallel) | No |
| **Rate Control** | Yes (concurrency, error threshold) | Yes | Yes |
| **Use Case** | "Run command on instances now" | "Complex multi-step process" | "Ensure configuration compliance" |

**Examples:**

**Run Command:**
```
Task: Restart Apache on all web servers
Document: AWS-RunShellScript
Command: sudo systemctl restart httpd
Targets: Tag:Role=WebServer
```

**Automation:**
```
Task: Automated DR failover
Steps:
1. Create RDS snapshot
2. If snapshot successful, promote read replica
3. Update Route 53 to point to new primary
4. If any step fails, send SNS notification
5. Log all actions to S3
```

**State Manager:**
```
Task: Ensure all instances have SSM agent updated
Document: AWS-UpdateSSMAgent
Schedule: Daily at 2 AM
Targets: All managed instances
Expected: Agent always on latest version
```

**When to Use:**
- **Run Command**: One-time or simple scheduled tasks
- **Automation**: Complex workflows with conditional logic, cross-service orchestration
- **State Manager**: Continuous compliance, configuration drift prevention

---

### Lambda vs Step Functions vs EventBridge

| Aspect | Lambda | Step Functions (Standard) | Step Functions (Express) | EventBridge |
|--------|--------|--------------------------|------------------------|-------------|
| **Purpose** | Execute code | Orchestrate workflows | High-volume workflows | Route events |
| **Max Duration** | 15 minutes | 1 year | 5 minutes | N/A (routes instantly) |
| **State Management** | None (stateless) | Full (persistent) | CloudWatch Logs only | None |
| **Execution Rate** | Unlimited | 2,000/sec (soft limit) | 100,000/sec | Unlimited |
| **Pricing** | Per request + duration | Per state transition | Per execution + duration | Per event matched |
| **Error Handling** | DLQ, retry config | Built-in retry, catch | Built-in retry, catch | Retry, DLQ per rule |
| **Parallel Execution** | Manual (invoke multiple) | Built-in (parallel state) | Built-in | Fan-out to multiple targets |
| **Use Case** | Simple functions | Long workflows, human approval | High-volume, low-latency | Event routing, fan-out |

**When to Use:**

**Lambda alone:**
```
Task: Process S3 upload
Flow: S3 event → Lambda → Process image → Save to DB
Duration: 30 seconds
Frequency: 1,000/hour
Complexity: Single step
```

**Step Functions Standard:**
```
Task: E-commerce order fulfillment
Flow:
1. Validate order (Lambda)
2. Check inventory (Lambda → DynamoDB)
3. If in stock:
   a. Process payment (Lambda → Stripe API)
   b. Wait for payment confirmation (callback, up to 24 hours)
   c. Ship order (Lambda → Shipping API)
4. If out of stock:
   a. Send backorder notification
   b. Wait for inventory replenishment
5. Update order status

Duration: Hours to days (waiting for payment, inventory)
Frequency: 100/hour
Complexity: Multi-step with waits
```

**Step Functions Express:**
```
Task: IoT sensor data processing
Flow:
1. Validate sensor data
2. Transform format
3. Enrich with metadata
4. Write to Kinesis

Duration: 1 second
Frequency: 100,000/sec
Complexity: Linear pipeline
```

**EventBridge:**
```
Task: Central event router
Flow:
EC2 state change → EventBridge → Multiple targets:
  - Lambda (update CMDB)
  - SNS (notify ops team)
  - Step Functions (trigger backup workflow)
  - SQS (queue for audit processing)

Purpose: Decouple services, fan-out events
```

---

## Cost Optimization

### Compute Optimizer vs Trusted Advisor

| Aspect | Compute Optimizer | Trusted Advisor |
|--------|------------------|-----------------|
| **Scope** | Compute resources only | Multi-service (cost, security, performance, etc.) |
| **Resources Analyzed** | EC2, ASG, EBS, Lambda, ECS Fargate | 100+ resource types |
| **Analysis Method** | ML-based on actual usage (CloudWatch metrics) | Rule-based heuristics |
| **Data Required** | 14 days of CloudWatch metrics | Current configuration |
| **Recommendation Depth** | Very detailed (specific instance types, projected savings) | High-level (instance underutilized) |
| **Categories** | Cost optimization only | Cost, security, fault tolerance, performance, service limits, ops excellence |
| **Availability** | Free (opt-in) | 56 checks (all), 482 checks (Business+) |
| **API Access** | Yes | Yes (Business+ only) |
| **Integration** | Can show in Trusted Advisor if enabled | Native |
| **Refresh** | Automated (daily) | 5 minutes (manual), weekly (automatic) |

**Example Comparison:**

**Same Over-Provisioned Instance:**

**Trusted Advisor says:**
```
✗ Low Utilization Amazon EC2 Instances
Instance: i-1234567890abcdef0 (m5.2xlarge)
Region: us-east-1
CPU: 12% (past 14 days)
Network I/O: < 5 MB/day
Estimated Savings: $202.40/month
Recommendation: Consider downsizing
```

**Compute Optimizer says:**
```
Instance: i-1234567890abcdef0
Current: m5.2xlarge ($281.28/month)
CPU P99: 18%, Memory P99: 22%

Recommendations (ranked):
1. m5.large (Optimized)
   - vCPU: 2 (vs 8), Memory: 8 GB (vs 32 GB)
   - Performance risk: Very Low
   - Savings: $210.96/month (75%)
   - Reason: Current usage fits comfortably

2. m5.xlarge (Over-provisioned)
   - vCPU: 4, Memory: 16 GB
   - Performance risk: Very Low
   - Savings: $140.64/month (50%)
   - Reason: Still more capacity than needed

3. m5.2xlarge (Current)
   - No change
   - Savings: $0

Projected performance:
- m5.large: CPU will reach ~72% (safe)
- Memory: ~88% (safe)
- IOPS: Within limits
```

**When to Use:**
- **Compute Optimizer**: Deep analysis, specific instance recommendations, Lambda memory optimization
- **Trusted Advisor**: Broad account health check, security best practices, service limit monitoring
- **Both**: Enable Compute Optimizer, which feeds into Trusted Advisor for best results

---

### Savings Plans vs Reserved Instances (2025)

| Feature | Compute SP | EC2 Instance SP | Standard RI | Convertible RI |
|---------|-----------|----------------|-------------|----------------|
| **Discount** | Up to 66% | Up to 72% | Up to 75% | Up to 54% |
| **Applies To** | EC2, Fargate, Lambda | EC2 only | EC2 only | EC2 only |
| **Instance Family** | ✅ Any | ❌ Locked | ❌ Locked | ✅ Changeable |
| **Instance Size** | ✅ Any | ✅ Any | ✅ Any | ✅ Any |
| **Region** | ✅ Any | ❌ Locked | ❌ Locked | ✅ Changeable |
| **OS** | ✅ Any | ✅ Any | ❌ Locked | ✅ Changeable |
| **Tenancy** | ✅ Any | ✅ Any | ❌ Locked | ✅ Changeable |
| **Exchange** | N/A | N/A | ❌ No | ✅ Yes |
| **Capacity Reservation** | ❌ No | ❌ No | ✅ Yes (zonal) | ❌ No |
| **Queuing** | N/A | N/A | ❌ No | ✅ Yes |
| **2025 Recommendation** | ⭐⭐⭐ Best for most | ⭐⭐ Good for EC2-only | ⭐ Only if need capacity | ❌ Legacy |

**Decision Matrix:**
```
Your Situation → Best Choice

Variable workload (EC2, Lambda, Fargate):
→ Compute Savings Plans ✅

EC2-only, may change instance types:
→ EC2 Instance Savings Plans ✅

Extremely stable workload, need max discount:
→ Standard RIs (but consider risk) ⚠️

Need guaranteed capacity (AZ-specific):
→ On-Demand Capacity Reservation + Savings Plan ✅

Already have RIs, want more flexibility:
→ Don't buy more RIs, use Savings Plans for new commitments ✅

MSP/Reseller with multiple customer accounts:
→ After June 2025 changes, use AWS Organizations + Savings Plans ⚠️
```

---

### ElastiCache Redis vs Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| **Data Structures** | Strings, Lists, Sets, Sorted Sets, Hashes, Bitmaps, HyperLogLogs, Geospatial, Streams | Strings only (key-value) |
| **Max Item Size** | 512 MB | 1 MB |
| **Multi-threading** | No (single-threaded per shard) | Yes (multi-core utilization) |
| **Persistence** | Yes (snapshots, AOF) | No |
| **Replication** | Yes (up to 5 replicas) | No |
| **Multi-AZ** | Yes (automatic failover) | No |
| **Backup/Restore** | Yes | No |
| **Pub/Sub** | Yes | No |
| **Transactions** | Yes (MULTI/EXEC) | No |
| **Lua Scripting** | Yes | No |
| **Clustering** | Yes (up to 500 nodes, 250 shards) | Yes (up to 40 nodes) |
| **Use Case** | Complex caching, session store, real-time analytics, leaderboards, pub/sub | Simple caching, high-throughput key-value |
| **Typical Performance** | ~500k ops/sec per node | ~1M ops/sec per node (multi-threaded) |

**When to Use:**

**Redis:**
```
✅ Need persistence (survive restart)
✅ Need replication/HA
✅ Complex data types (sorted sets for leaderboards)
✅ Pub/Sub messaging
✅ Geospatial queries
✅ Session store with TTL
✅ Real-time analytics
```

**Memcached:**
```
✅ Simplest possible caching
✅ Need maximum throughput (multi-threaded)
✅ Large objects (multi-part storage)
✅ Don't need persistence
✅ Don't need replication
✅ Horizontal scaling with client-side consistent hashing
```

**Example Scenarios:**

**Leaderboard (gaming):**
```
Redis Sorted Set:
ZADD leaderboard 1000 "player1"
ZADD leaderboard 950 "player2"
ZREVRANGE leaderboard 0 9 WITHSCORES  # Top 10

Why Redis: Sorted sets are perfect for rankings
Why not Memcached: Would need application logic to maintain order
```

**Session Store:**
```
Redis:
SET session:abc123 '{"user_id": 42, "cart": [...]}' EX 3600
✅ Automatic expiration (TTL)
✅ Persistence (can survive restart)
✅ Replication (high availability)

Memcached:
set session:abc123 '{"user_id": 42, "cart": [...]}' 3600
⚠️ No persistence (lose sessions on restart)
⚠️ No replication (single point of failure)
```

**Simple Object Caching (product catalog):**
```
Both work, but:

Memcached:
+ Faster (multi-threaded)
+ Simpler
- No persistence
- No HA

Redis:
+ Persistence
+ Replication
+ More features if needed later
- Slightly slower per node

Recommendation: Use Redis (flexibility, not much slower)
```

---

## Security Services

### GuardDuty vs Inspector vs Detective vs Security Hub

| Service | GuardDuty | Inspector | Detective | Security Hub |
|---------|-----------|-----------|-----------|--------------|
| **Purpose** | Threat detection | Vulnerability scanning | Incident investigation | Centralized security findings |
| **What it analyzes** | VPC Flow Logs, CloudTrail, DNS logs, S3 access | EC2 instances, ECR images, Lambda functions | CloudTrail, VPC Flow Logs, GuardDuty findings | Findings from multiple services |
| **Detection Method** | ML-based anomaly detection | CVE database matching | ML-based correlation | Aggregation + compliance checks |
| **Requires Agent** | No | No (uses SSM agent if present) | No | No |
| **Real-time** | Yes | Continuous (monitors) | Yes (for investigation) | Yes (receives findings) |
| **Output** | Findings (threats detected) | Findings (vulnerabilities) | Investigation results | Aggregated findings |
| **Auto-remediation** | Via EventBridge | Via EventBridge | No (investigation tool) | Via EventBridge |
| **Cost** | Per GB analyzed | Per instance/image/function scanned | Per GB ingested | Per finding + compliance check |

**Use Together:**

```
Layered Security Detection:

GuardDuty: "EC2 instance communicating with known C2 server"
  → Detects compromised instance

Inspector: "EC2 instance has critical CVE-2024-1234"
  → Identifies vulnerability that allowed compromise

Detective: Investigate how breach occurred
  → Shows attacker accessed via SSH from unusual IP
  → Timeline of actions: uploaded malware, exfiltrated data
  → Identifies scope: 3 other instances also accessed

Security Hub: Aggregates all findings
  → Critical: GuardDuty finding (active threat)
  → High: Inspector finding (unpatched CVE)
  → Create incident, track remediation
  → Generate compliance report
```

**When to Use:**
- **GuardDuty**: Always enable (threat detection baseline)
- **Inspector**: Enable for EC2/containers/Lambda (vulnerability management)
- **Detective**: Use when GuardDuty detects threat (investigation)
- **Security Hub**: Always enable (central security dashboard, compliance)

---

### IAM Access Analyzer vs GuardDuty vs AWS Config

| Service | IAM Access Analyzer | GuardDuty | AWS Config |
|---------|-------------------|-----------|------------|
| **Detects** | Resource sharing outside account/org | Malicious activity, threats | Configuration compliance |
| **Analysis Type** | Automated reasoning (policy analysis) | ML-based anomaly detection | Rule-based compliance |
| **Scope** | IAM policies, resource policies | Network traffic, API activity | Resource configuration |
| **Proactive/Reactive** | Proactive (before breach) | Reactive (during/after breach) | Both |
| **Continuous** | Yes | Yes | Yes |
| **Compliance** | Resource exposure | Threat detection | Configuration compliance |

**Example: S3 Bucket Security**

**IAM Access Analyzer:**
```
Finding: "S3 bucket shared with external account"
Bucket: company-logs
Shared with: AWS account 999999999999
Type: External (outside organization)
Action: Review if intended, remove if not
```

**GuardDuty:**
```
Finding: "S3 bucket has suspicious access from unusual location"
Bucket: company-logs
Source IP: 1.2.3.4 (TOR exit node)
Activity: 10,000 GetObject calls in 5 minutes
Severity: High
Action: Investigate, block IP, rotate credentials
```

**AWS Config:**
```
Finding: "S3 bucket does not have encryption enabled"
Bucket: company-logs
Rule: s3-bucket-server-side-encryption-enabled
Status: NON_COMPLIANT
Action: Enable default encryption
```

**All Three Together:**
1. Access Analyzer: Identifies bucket shared externally (compliance risk)
2. Config: Identifies bucket not encrypted (configuration issue)
3. GuardDuty: Detects actual malicious access (active threat)

---

## Summary Matrix: When to Use What

### Monitoring & Observability

| Need | Use This |
|------|----------|
| Application metrics (CPU, memory, latency) | CloudWatch Metrics |
| Application logs (errors, debug) | CloudWatch Logs |
| Audit trail (who did what) | CloudTrail |
| Resource configuration history | AWS Config |
| Distributed request tracing | X-Ray |
| React to events | EventBridge |
| Anomaly detection in metrics | CloudWatch Anomaly Detection |
| Long-term log archival | S3 + Lifecycle |

### Automation

| Need | Use This |
|------|----------|
| Run command on instances | Systems Manager Run Command |
| Multi-step workflow with logic | Systems Manager Automation or Step Functions |
| Maintain desired state | Systems Manager State Manager |
| Short-duration code execution (<15 min) | Lambda |
| Long-running workflow (hours/days) | Step Functions Standard |
| High-volume workflow (>10k/sec) | Step Functions Express |
| Event routing and fan-out | EventBridge |

### Cost Optimization

| Need | Use This |
|------|----------|
| Right-size EC2/Lambda/EBS | Compute Optimizer |
| Broad account health check | Trusted Advisor |
| Commitment discounts (flexible) | Savings Plans |
| Commitment discounts (max savings, stable workload) | Reserved Instances |
| Cost analysis and forecasting | Cost Explorer |
| Detect unusual spending | Cost Anomaly Detection |
| Budget alerts and limits | AWS Budgets |
| Detailed cost data for analysis | Cost and Usage Report (CUR) |

### Security

| Need | Use This |
|------|----------|
| Threat detection | GuardDuty |
| Vulnerability scanning | Inspector |
| Incident investigation | Detective |
| Centralized security findings | Security Hub |
| Resource exposure analysis | IAM Access Analyzer |
| Compliance automation | Audit Manager |
| Configuration compliance | AWS Config |

### Performance Optimization

| Need | Use This |
|------|----------|
| Edge caching (global) | CloudFront |
| In-memory caching (application) | ElastiCache |
| DynamoDB caching | DAX |
| API caching | API Gateway Cache |
| Database read scaling | Read Replicas |
| Database connection pooling | RDS Proxy |

### Reliability

| Need | Use This |
|------|----------|
| Chaos engineering | AWS Fault Injection Simulator |
| DNS failover | Route 53 Health Checks |
| Database failover | RDS Multi-AZ or Aurora |
| Application auto-recovery | Auto Scaling with Health Checks |
| Backups (centralized) | AWS Backup |
| Disaster recovery | Multi-Region architecture |

---

This comparison matrix should help you quickly identify the right service for specific use cases on the exam. Remember: The exam often presents scenarios where multiple services could work, but one is the BEST choice based on requirements.
