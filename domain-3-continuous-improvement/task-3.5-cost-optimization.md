---
title: "Task 3.5: Identify Opportunities for Cost Optimization"
domain: 3
domain_name: "Continuous Improvement for Existing Solutions"
task: 3.5
weight: "25%"
task_weight: "~20% of domain"
exam_topics:
  - cost-optimization
  - rightsizing
  - savings-plans
  - spot-instances
  - cost-explorer
  - compute-optimizer
  - trusted-advisor
status: complete
last_updated: "2025-11-18"
---

# Task 3.5: Identify Opportunities for Cost Optimization

## Overview

Cost optimization is the continual process of refinement and improvement over the lifecycle of a workload. This task focuses on identifying and implementing cost-saving opportunities without sacrificing performance, reliability, or security.

**Weight:** ~20% of Domain 3 (5% of total exam)

---

## Core Concepts

### Cost Optimization Framework

```
1. MEASURE → Understand current costs and usage
2. ANALYZE → Identify waste and optimization opportunities
3. OPTIMIZE → Implement cost-saving measures
4. MONITOR → Track savings and new opportunities
5. GOVERN → Enforce policies and best practices
```

### Cost Optimization Principles

1. **Adopt a consumption model** - Pay only for what you use
2. **Measure overall efficiency** - Use metrics to measure business output
3. **Stop spending on undifferentiated tasks** - Use managed services
4. **Analyze and attribute expenditure** - Tag and track costs
5. **Use cost-effective resources** - Right instance types, pricing models

---

## AWS Cost Management Tools

### AWS Cost Explorer

**What it is:** Visualize, understand, and manage AWS costs and usage over time

**Key Features:**

**1. Cost and Usage Reports**
```
Granularity:
- Daily
- Monthly
- Hourly (with CUR)

Group By:
- Service (EC2, S3, RDS, etc.)
- Linked Account
- Region
- Instance Type
- Usage Type
- Tag

Filters:
- Time range
- Service
- Account
- Tag
- Charge type (Usage, Tax, Fee, etc.)
```

**2. Forecasting**
```
Based on historical data:
- Predict next 3 months spending
- 80% confidence interval
- Trend analysis

Use for:
- Budget planning
- Capacity planning
- Cost trend identification
```

**3. Savings Plans Recommendations**
```
Analysis based on:
- Last 7, 30, or 60 days usage
- 1-year or 3-year term
- Payment option (All Upfront, Partial, No Upfront)

Recommendations:
- Hourly commitment amount
- Estimated savings
- ROI percentage
- Coverage percentage
```

**4. Reserved Instance Recommendations**
```
Similar to Savings Plans but for:
- EC2
- RDS
- ElastiCache
- Elasticsearch
- Redshift

Based on:
- Historical usage patterns
- Instance family and size
- Region and availability zone
- Tenancy
```

### AWS Cost Anomaly Detection

**What it is:** ML-powered service to detect unusual spending patterns

**How it Works:**
```
1. Creates cost model based on historical spending
2. Continuously monitors spending
3. Detects anomalies (unusual spikes or patterns)
4. Sends alerts via SNS, email, or Slack

Example Alert:
"Unusual EC2 spending detected in us-east-1
Expected: $500/day
Actual: $2,000/day (+300%)
Likely cause: 20 new m5.2xlarge instances launched"
```

**Configuration:**
```
Monitors:
- Cost monitors (by service, account, tag)
- Total spending monitors
- Specific cost allocation tag monitors

Alert Threshold:
- Dollar amount ($100+)
- Percentage (>10%)
- Standard deviations (2σ, 3σ)

Recipients:
- Email
- SNS topic
- Slack/Chatbot integration
```

**Best Practices:**
```
Create monitors for:
1. Per-service spending (EC2, RDS, S3 separately)
2. Per-environment (Production, Dev, Test tags)
3. Per-team (using cost allocation tags)
4. Total account spending

Set appropriate thresholds:
- Production: Alert on >10% increase
- Development: Alert on >50% increase
- Critical services: Alert on any anomaly
```

### AWS Budgets

**What it is:** Set custom budgets and receive alerts when costs or usage exceed thresholds

**Budget Types:**

**1. Cost Budgets**
```
Track spending:
- Total account costs
- Service-specific costs
- Tag-based costs
- Linked account costs

Example:
Budget Name: Monthly EC2 Budget
Amount: $10,000/month
Alert at: 80% ($8,000), 100% ($10,000), 110% ($11,000)
Actions: SNS notification, email
```

**2. Usage Budgets**
```
Track service usage:
- EC2 instance hours
- S3 storage GB
- RDS database hours
- Data transfer GB

Example:
Budget Name: S3 Storage Budget
Amount: 1000 GB
Alert at: 80%, 100%
```

**3. Reservation Budgets**
```
Track RI/SP utilization and coverage:
- Utilization: How much of commitment is being used
- Coverage: % of usage covered by RI/SP

Example:
Budget Name: EC2 RI Utilization
Target: 80% utilization
Alert when: < 75% utilization (underutilized commitment)
```

**4. Savings Plans Budgets**
```
Similar to RI budgets:
- Utilization tracking
- Coverage tracking
```

**Budget Actions (Automated Response):**
```
When budget threshold exceeded:

Actions available:
1. Apply IAM policy (restrict or deny actions)
2. Apply SCP (for Organizations)
3. Target specific IAM users/roles/groups

Example Auto-Action:
Budget: Development Account Monthly
Threshold: 100% ($5,000)
Action: Apply IAM policy to deny ec2:RunInstances
Result: No new EC2 instances can be launched
```

### AWS Compute Optimizer

**What it is:** ML-powered service recommending optimal compute resources

**Supported Resources:**
- EC2 instances
- Auto Scaling groups
- EBS volumes
- Lambda functions
- ECS services on Fargate

**How it Works:**
```
1. Analyzes CloudWatch metrics (14+ days required)
   - CPU utilization
   - Memory utilization (requires CloudWatch agent)
   - Network I/O
   - Disk I/O
   - Lambda duration/memory

2. Applies ML models to predict optimal sizing

3. Provides recommendations with confidence levels

4. Estimates cost savings and performance impact
```

**Recommendation Types:**

**For EC2:**
```
Over-provisioned:
Current: m5.2xlarge (8 vCPU, 32 GB RAM) - $280/month
Usage: 15% CPU, 20% memory
Recommendation: m5.large (2 vCPU, 8 GB RAM) - $70/month
Savings: $210/month (75%)
Risk: Low (significantly underutilized)

Under-provisioned:
Current: t3.medium (2 vCPU, 4 GB RAM)
Usage: 90% CPU, 85% memory
Recommendation: m5.large (2 vCPU, 8 GB RAM)
Cost increase: +$30/month
Benefit: Better performance, avoid throttling

Optimized:
Current: m5.large
Usage: 60% CPU, 55% memory
Recommendation: No change (well-sized)
```

**For Lambda:**
```
Over-provisioned:
Current: 3008 MB memory
Usage: 512 MB actual memory, 200ms duration
Recommendation: 1024 MB memory
Why: Memory allocated > memory used
Savings: 66% cost reduction
Note: Lambda CPU scales with memory, so may increase duration slightly

Under-provisioned:
Current: 512 MB memory
Duration: 5000ms (execution time)
Recommendation: 1536 MB memory
Why: More memory = more CPU = faster execution = lower cost
Result: 1500ms duration, 40% cost reduction (faster execution)
```

**For EBS:**
```
Over-provisioned IOPS:
Current: io2 with 10,000 IOPS
Usage: 500 IOPS average
Recommendation: gp3 with 3,000 IOPS
Savings: $400/month

Under-provisioned:
Current: gp2 100 GB
Usage: Frequent I/O throttling
Recommendation: gp3 100 GB with 5,000 IOPS baseline
Cost: +$20/month
Benefit: Eliminate throttling
```

**Integration with Trusted Advisor:**
```
If Compute Optimizer enabled:
- Trusted Advisor shows Compute Optimizer recommendations
- Deeper, ML-based insights vs rule-based
- More accurate sizing recommendations

If Compute Optimizer not enabled:
- Trusted Advisor uses basic heuristics
- Less accurate (e.g., CPU < 25% for 4 days)
```

### AWS Trusted Advisor

**What it is:** Automated checks for best practices across 6 categories

**Categories:**
1. Cost Optimization
2. Performance
3. Security
4. Fault Tolerance
5. Service Limits
6. Operational Excellence

**Support Plan Access:**
```
Basic/Developer Support:
- 56 core checks
- Limited cost optimization checks
- No API access

Business/Enterprise Support:
- All 482+ checks
- Full cost optimization suite
- API access
- Weekly email notifications
- CloudWatch Events integration
```

**Key Cost Optimization Checks:**

**1. Underutilized Resources**
```
Low Utilization Amazon EC2 Instances:
- Criteria: Daily CPU < 10% AND network I/O < 5MB for 4+ days
- Action: Stop, resize, or terminate
- Potential savings: Shown per instance

Idle Load Balancers:
- Criteria: No active back-end instances or < 100 requests/day
- Cost: ~$16-22/month per idle ALB
- Action: Delete if not needed

Unassociated Elastic IP Addresses:
- Cost: $0.005/hour ($3.60/month) per unused IP
- Action: Release if not needed

Idle RDS Instances:
- Criteria: No connections for 7+ days
- Action: Stop or delete snapshots and terminate
```

**2. Reserved Instance Optimization**
```
Reserved Instance Lease Expiration:
- Alerts 30 days before RI expires
- Recommends renewal or alternative

Amazon EC2 Reserved Instance Optimization:
- Compares On-Demand costs vs RI costs
- Estimates savings potential
- Recommends RI purchase

Reserved Instance Coverage:
- Shows % of usage covered by RIs
- Target: >70% coverage for production
```

**3. Storage Optimization**
```
Amazon EBS Snapshots:
- Identifies old snapshots (>90 days)
- Cost: $0.05/GB/month
- Action: Delete if not needed

Amazon S3 Bucket Versioning:
- Identifies buckets with many versions
- Cost impact: Multiple copies of objects
- Action: Implement lifecycle policies

Amazon RDS Idle DB Instances:
- No connections in 7+ days
- Action: Stop or terminate
```

### AWS Cost and Usage Report (CUR)

**What it is:** Most comprehensive cost and usage data available

**Detail Level:**
- Hourly granularity
- Resource-level detail
- All cost allocation tags
- Reserved Instance details
- Savings Plans details

**Delivery:**
```
Destination: S3 bucket
Format: CSV or Parquet (recommended)
Compression: GZIP
Frequency: Daily, hourly, or monthly updates

Size: Can be very large (GB - TB for large accounts)
```

**Analysis Tools:**
```
Amazon Athena:
- Query CUR data with SQL
- Serverless, pay per query
- Create custom cost reports

Amazon QuickSight:
- Visualize CUR data
- Build interactive dashboards
- Share with stakeholders

Third-party tools:
- CloudHealth, CloudCheckr, Spot.io
- Advanced analytics and recommendations
```

**Common Queries:**
```sql
-- Top 10 most expensive services
SELECT
    line_item_product_code,
    SUM(line_item_unblended_cost) as cost
FROM cur_table
WHERE year='2025' AND month='01'
GROUP BY line_item_product_code
ORDER BY cost DESC
LIMIT 10;

-- Costs by tag (environment)
SELECT
    resource_tags_user_environment,
    SUM(line_item_unblended_cost) as cost
FROM cur_table
WHERE year='2025' AND month='01'
GROUP BY resource_tags_user_environment
ORDER BY cost DESC;

-- Savings Plans utilization
SELECT
    DATE(line_item_usage_start_date) as date,
    SUM(CASE WHEN savings_plan_savings_plan_arn IS NOT NULL
        THEN line_item_usage_amount ELSE 0 END) /
    SUM(line_item_usage_amount) * 100 as sp_coverage_pct
FROM cur_table
WHERE year='2025' AND month='01'
    AND line_item_product_code = 'AmazonEC2'
GROUP BY DATE(line_item_usage_start_date)
ORDER BY date;
```

---

## Savings Plans vs Reserved Instances (2025 Guidance)

### Comparison Matrix

| Feature | Compute Savings Plans | EC2 Instance Savings Plans | Standard RIs | Convertible RIs |
|---------|---------------------|--------------------------|-------------|----------------|
| **Discount** | Up to 66% | Up to 72% | Up to 75% | Up to 54% |
| **Commitment** | $/hour for 1 or 3 years | $/hour for 1 or 3 years | Instance count | Instance count |
| **Flexibility - Instance Family** | ✅ Any | ❌ Locked | ❌ Locked | ✅ Changeable |
| **Flexibility - Instance Size** | ✅ Any | ✅ Any | ✅ Any (within family) | ✅ Any |
| **Flexibility - Region** | ✅ Any | ❌ Locked | ❌ Locked (Standard) | ✅ Changeable |
| **Flexibility - OS** | ✅ Any | ✅ Any | ❌ Locked | ✅ Changeable |
| **Applies To** | EC2, Fargate, Lambda | EC2 only | EC2 only | EC2 only |
| **Queuing/Exchange** | N/A | N/A | ❌ No | ✅ Yes |
| **Payment Options** | All, Partial, No Upfront | All, Partial, No Upfront | All, Partial, No Upfront | All, Partial, No Upfront |
| **Recommendation** | ✅ Best for variable workloads | ✅ Best for EC2-focused, flexible | ⚠️ Best for stable, max savings | ⚠️ Legacy option |

### Decision Framework (2025)

```
Choose Compute Savings Plans if:
✅ Workload uses EC2, Fargate, AND Lambda
✅ Need maximum flexibility
✅ Expect to change instance types/families
✅ Multi-region deployments
✅ Evolving architecture

Choose EC2 Instance Savings Plans if:
✅ EC2-only workload
✅ Need more discount than Compute SP
✅ Likely to stay within region
✅ May change instance sizes but not families

Choose Standard RIs if:
✅ Extremely stable workload (no change expected)
✅ Need absolute maximum discount (extra 3%)
✅ Specific capacity reservation needed
⚠️ High risk if requirements change

Choose Convertible RIs if:
⚠️ Legacy option - Savings Plans are better
✅ Only if already committed to RIs and want flexibility
❌ Generally not recommended in 2025
```

### 2025 Policy Changes (Important!)

**Effective June 1, 2025:**
- Managed Service Providers (MSPs) can no longer share RIs/SPs across customer accounts
- Impacts resellers and MSPs significantly
- Customers with multiple accounts should use AWS Organizations consolidated billing

**Best Practice:**
```
Use AWS Organizations:
- Management account purchases Savings Plans
- Automatically applies to all member accounts
- Maximizes coverage and utilization
- No sharing limitations
```

### Hybrid Strategy

```
Best Practice for 2025:

Baseline (Stable Usage):
- 50-60% coverage with Compute Savings Plans (flexibility)
- Focus on base load that won't change

Variable (Dynamic Usage):
- 0-10% EC2 Instance Savings Plans (higher discount for predictable EC2)
- Apply to specific stable EC2 workloads

Flexible (Burst/Test/Dev):
- 30-40% On-Demand (no commitment)
- Use for variable workloads, testing, development
- Consider Spot Instances where applicable

Reserved Instances:
- ⚠️ Generally avoid in 2025
- Only for specific cases (capacity reservations, extreme stability)
```

---

## Specific Cost Optimization Strategies

### Compute Optimization

**1. Right-Sizing**

**Before Committing to RIs/SPs:**
```
Critical: Right-size FIRST, then commit

Example:
Current: 10 × m5.2xlarge On-Demand = $2,800/month
Over-provisioned (CPU: 20%, Memory: 25%)

Wrong Approach:
Buy Savings Plan for 10 × m5.2xlarge = $1,848/month (34% savings)

Right Approach:
1. Right-size to m5.large (10 instances) = $700/month On-Demand
2. Buy Savings Plan for m5.large = $462/month (34% savings from $700)

Result:
- Wrong: $1,848/month (34% savings from bad baseline)
- Right: $462/month (83% savings from original, 34% from right-sized)
```

**2. Graviton Instances (ARM-based)**

```
Graviton3 (Latest in 2025):
- 25% better price/performance vs Graviton2
- 40% better price/performance vs x86
- Supported: m7g, c7g, r7g families

Migration Considerations:
✅ Works natively: Java, Python, Node.js, Go, Rust, .NET
✅ Docker containers (rebuild for ARM64)
⚠️ Native code: Requires recompilation
❌ Specific x86 dependencies: May not be compatible

Example Savings:
m6i.2xlarge: $280/month
m7g.2xlarge: $224/month (Graviton3)
Savings: $56/month per instance (20%)
For 100 instances: $5,600/month savings
```

**3. Spot Instances**

```
Discount: Up to 90% off On-Demand pricing

Best for:
✅ Fault-tolerant workloads
✅ Batch processing
✅ CI/CD runners
✅ Data analysis
✅ Containerized applications with Auto Scaling

Not for:
❌ Databases (stateful)
❌ Long-running stateful applications
❌ User-facing applications (unless in ASG mix)

Strategies:

Mixed ASG (EC2 Auto Scaling):
On-Demand instances: 2 (base capacity)
Spot instances: 8 (variable capacity)
- Cost: ~60% reduction
- Availability: On-Demand provides stability, Spot provides scale

Spot Fleet:
- Diversify across multiple instance types and AZs
- Reduces interruption probability
- Automatically requests alternative instance types

EKS with Spot:
- Run fault-tolerant pods on Spot instances
- Use node affinity for critical pods (On-Demand/RI)
```

**4. Lambda Memory Optimization**

```
Common Mistake: Using default 128 MB memory

Test different memory settings:
128 MB:  Duration: 3000ms, Cost: $0.00000625 × 3000ms = $0.01875
512 MB:  Duration: 1000ms, Cost: $0.00001667 × 1000ms = $0.01667
1024 MB: Duration: 600ms,  Cost: $0.00003334 × 600ms  = $0.02000
1536 MB: Duration: 500ms,  Cost: $0.00005001 × 500ms  = $0.02501

Optimal: 512 MB
- 67% faster than 128 MB
- 11% cheaper than 128 MB
- Best price/performance ratio

Use AWS Compute Optimizer for Lambda:
- Analyzes actual memory usage
- Recommends optimal setting
- Shows potential savings
```

### Storage Optimization

**1. S3 Intelligent-Tiering**

```
How it works:
- Monitors access patterns
- Automatically moves objects between tiers
- No retrieval fees
- Small monthly monitoring fee ($0.0025 per 1,000 objects)

Tiers:
Frequent Access: $0.023/GB (default)
Infrequent Access: $0.0125/GB (30 days no access)
Archive Instant Access: $0.004/GB (90 days)
Archive Access: $0.0036/GB (90+ days, optional)
Deep Archive Access: $0.00099/GB (180+ days, optional)

Best for:
✅ Unknown or changing access patterns
✅ Long-lived data (>30 days)
✅ Large objects (>128 KB)

Not ideal for:
❌ Small objects (<128 KB) - monitoring cost > savings
❌ Frequently deleted objects (<30 days)
❌ Objects with known access patterns (use explicit classes)
```

**2. S3 Lifecycle Policies**

```
Example Policy (Log Data):

0-30 days: S3 Standard ($0.023/GB)
  └─> Used for recent log analysis

30-90 days: S3 Standard-IA ($0.0125/GB)
  └─> Accessed occasionally for troubleshooting

90-365 days: S3 Glacier Instant Retrieval ($0.004/GB)
  └─> Compliance retention, rare access

365+ days: S3 Glacier Deep Archive ($0.00099/GB)
  └─> Long-term compliance

1,000 GB logs over 2 years:
Standard for 2 years: $552
With lifecycle: $143.40 (74% savings)
```

**3. EBS Volume Optimization**

```
Volume Types Decision:

gp3 (General Purpose SSD) - Default choice:
- $0.08/GB/month
- 3,000 IOPS baseline (free)
- 125 MB/s throughput
- Up to 16,000 IOPS ($0.005 per IOPS/month above 3,000)
- Best for: Most workloads

gp2 (Previous generation):
- $0.10/GB/month
- IOPS scale with size (3 IOPS/GB)
- Legacy option, use gp3 instead

io2/io2 Block Express (Provisioned IOPS):
- $0.125/GB/month + $0.065 per IOPS/month
- Up to 64,000 IOPS (io2) or 256,000 IOPS (io2 Block Express)
- Best for: Latency-sensitive databases, high IOPS needs

st1 (Throughput Optimized HDD):
- $0.045/GB/month
- 500 MB/s max throughput
- Best for: Big data, data warehouses, log processing
- Cannot be boot volume

sc1 (Cold HDD):
- $0.015/GB/month
- 250 MB/s max throughput
- Best for: Infrequent access, lowest cost
- Cannot be boot volume

Example Optimization:
Current: 1 TB io2 with 10,000 IOPS
Cost: $125 (storage) + $650 (IOPS) = $775/month
Actual usage: 2,000 IOPS average

Optimized: 1 TB gp3 with 3,000 IOPS (baseline)
Cost: $80/month
Savings: $695/month (90%)
```

**4. EBS Snapshot Optimization**

```
Snapshots are incremental but...

Problem:
Snapshot 1: 100 GB (full)
Snapshot 2: +10 GB (changed data)
Snapshot 3: +10 GB
...
Snapshot 50: +10 GB

Total storage: 100 + (49 × 10) = 590 GB
Cost: $590 × $0.05 = $29.50/month

But you only need the most recent!

Solution:
Delete old snapshots (keep last 3-7 for recovery)
- Snapshot 48, 49, 50: 30 GB total
- Cost: $1.50/month
- Savings: $28/month per volume

Use AWS Backup or automated lifecycle:
- Retention policy: 7 daily, 4 weekly, 12 monthly
- Automatic deletion of expired snapshots
```

### Database Optimization

**1. RDS/Aurora Sizing**

```
Over-provisioned database example:

Current: db.r5.4xlarge
- 16 vCPU, 128 GB RAM
- Cost: $3,120/month
- Utilization: 15% CPU, 30% memory

Right-sized: db.r5.xlarge
- 4 vCPU, 32 GB RAM
- Cost: $780/month
- Savings: $2,340/month (75%)

Use Performance Insights:
- Monitor actual resource usage
- Identify peak usage patterns
- Size for peaks + 20-30% buffer
```

**2. Aurora Serverless v2 vs Provisioned**

```
Workload Pattern: 8 AM - 6 PM weekdays (50 hours/week)
Off-hours: Minimal traffic

Provisioned (db.r5.large always running):
Cost: $438/month

Aurora Serverless v2:
Peak: 4 ACUs (8 hours/day × 5 days = 40 hours/week)
Off-peak: 0.5 ACUs (128 hours/week)
Cost: (40 × 4 × $0.12) + (128 × 0.5 × $0.12) × 4.33 weeks = $105/month

Savings: $333/month (76%)

Best for:
✅ Development/test databases
✅ Intermittent workloads
✅ Unpredictable traffic
✅ New applications (don't know load)

Not ideal for:
❌ Sustained 24/7 high load (provisioned with RIs cheaper)
❌ Extreme performance needs (provisioned can be larger)
```

**3. DynamoDB On-Demand vs Provisioned**

```
On-Demand Pricing:
- $1.25 per million write requests
- $0.25 per million read requests
- No capacity planning needed
- Scales automatically

Provisioned Pricing:
- $0.00065 per WCU-hour ($0.47/month per WCU)
- $0.00013 per RCU-hour ($0.09/month per RCU)
- Must provision capacity
- Can use Auto Scaling

Comparison (1 million writes, 5 million reads per month):

On-Demand:
- Writes: 1 × $1.25 = $1.25
- Reads: 5 × $0.25 = $1.25
- Total: $2.50/month

Provisioned (if evenly distributed):
- Writes needed: 1M / 30 days / 24 hrs / 3600s = 0.39 WCUs (min 1)
- Reads needed: 5M / 30 days / 24 hrs / 3600s = 1.93 RCUs (min 2)
- Cost: (1 × $0.47) + (2 × $0.09) = $0.65/month
- Savings: $1.85/month

But if spikey/unpredictable → On-Demand better
If predictable → Provisioned + Auto Scaling better

Reserved Capacity (1-year commitment):
- 53% discount on provisioned capacity
- Best for stable, predictable workloads
```

### Network Optimization

**1. Data Transfer Costs**

```
Most Expensive:
- Internet egress (to internet): $0.09/GB (first 10 TB/month)
- Cross-region: $0.02/GB (between regions)

Free:
- Inbound from internet
- Between AZs using private IP (for specific services)
- Same AZ using private IP

Cost Comparison (1 TB transfer):

Internet egress: $90
Cross-region: $20
VPC Peering (same region, cross-AZ): $10
Same AZ: $0

Optimization Strategies:

1. Use CloudFront:
   - Reduces origin requests by 80-90%
   - CloudFront to internet egress cheaper than EC2 direct
   - Example: $90 → $30 (67% savings)

2. S3 Transfer Acceleration vs Direct:
   - Direct upload to S3 (cross-region): Free inbound + $20 egress
   - Transfer Acceleration: $0.04/GB + $20 egress = $60 total
   - Only use if speed improvement needed (not cost)

3. Regional Architecture:
   - Serve users from nearest region
   - Reduces cross-region transfer
   - Lower latency + lower cost
```

**2. NAT Gateway vs NAT Instance vs VPC Endpoints**

```
Scenario: Download 10 TB/month from S3 via NAT

NAT Gateway:
- Hourly: $0.045 × 730 hours = $32.85
- Data processing: $0.045 × 10,000 GB = $450
- Total: $482.85/month

NAT Instance (c5.large):
- Instance: $62/month
- No data processing fee
- Total: $62/month
- Savings: $420/month vs NAT Gateway

VPC Endpoint (Gateway):
- Free (for S3 and DynamoDB)
- No data processing fees
- No internet access required
- Total: $0/month
- Savings: $482.85/month vs NAT Gateway

Best Practice:
✅ Always use VPC Endpoints for S3 and DynamoDB (free!)
✅ For other services, use Interface Endpoints ($0.01/GB, cheaper than NAT)
⚠️ NAT Instance if high throughput (but more management)
❌ NAT Gateway expensive for high data transfer
```

---

## Cost Allocation and Tagging Strategy

### Tagging Best Practices

**Mandatory Tags:**
```
Environment: Production | Staging | Development | Test
CostCenter: Engineering | Marketing | Sales | Operations
Project: ProjectAlpha | ProjectBeta
Owner: team-email@company.com
Application: web-app | api-service | database

Benefits:
- Track costs per environment
- Chargeback to departments
- Identify cost owners
- Analyze spending by project
```

**Implementation:**
```
AWS Organizations Tag Policies:
- Enforce tags on resource creation
- Standardize tag keys and values
- Require specific tags for all resources

Example Policy:
{
  "tags": {
    "Environment": {
      "tag_key": "Environment",
      "enforced_for": ["ec2:instance", "rds:db", "s3:bucket"],
      "tag_value": ["Production", "Staging", "Development"]
    },
    "CostCenter": {
      "tag_key": "CostCenter",
      "enforced_for": ["*"]
    }
  }
}
```

### Cost Allocation Reports

```
Example Analysis:

By Environment:
Production: $50,000/month (50%)
Staging: $25,000/month (25%)
Development: $25,000/month (25%)

Action: Development over-provisioned?
→ Use Spot instances for dev
→ Auto-stop dev resources after hours
→ Potential savings: $15,000/month (60% of dev costs)

By Application:
WebApp: $30,000/month
API Service: $40,000/month
Database: $20,000/month
Untagged: $10,000/month ← Problem!

Action: Identify and tag untagged resources
→ Potentially orphaned resources
→ Candidates for deletion

By Team:
Engineering: $60,000/month
Marketing: $25,000/month
Data Science: $15,000/month

Action: Implement chargeback
→ Teams optimize their own spend
→ Budget accountability
```

---

## Exam Scenarios

### Scenario 1: Savings Plans vs RIs

```
Question: Company has 50 EC2 instances (mix of m5, c5, r5 families)
          across 3 regions. Workload stable. Need maximum savings
          with flexibility. What to purchase?

Options:
A) Standard RIs for each instance type in each region
B) Convertible RIs across all regions
C) Compute Savings Plans
D) EC2 Instance Savings Plans

Answer: C - Compute Savings Plans
Why:
- Flexibility across instance families (m5, c5, r5)
- Flexibility across regions (3 regions)
- Stable workload (can commit)
- 66% discount, nearly as good as RIs
- Much simpler management than dozens of RIs
```

### Scenario 2: Right-Sizing

```
Question: Compute Optimizer recommends downsizing 20 m5.2xlarge
          to m5.large. Currently have 1-year Standard RI for m5.2xlarge.
          What should you do?

Options:
A) Keep m5.2xlarge to use RI, ignore recommendation
B) Downsize to m5.large, sell RI in RI Marketplace
C) Downsize to m5.large, RI will cover 4 m5.large instances
D) Wait until RI expires, then downsize

Answer: C - Downsize, RI covers multiple smaller instances
Why:
- RIs apply based on normalized units
- m5.2xlarge = 8 units, m5.large = 2 units
- 1 m5.2xlarge RI = coverage for 4 m5.large instances
- Get right-sizing benefits + RI discount
- Best of both worlds
```

### Scenario 3: Storage Optimization

```
Question: S3 bucket has 100 TB data. Objects accessed frequently
          for 7 days, then rarely. Compliance requires 7-year retention.
          Minimize costs.

Options:
A) S3 Intelligent-Tiering
B) S3 Standard → S3 Glacier after 7 days → Delete after 7 years
C) S3 Standard → S3 Standard-IA after 7 days → S3 Glacier after 90 days
D) S3 One Zone-IA with lifecycle to Glacier

Answer: C - Standard → IA → Glacier
Why:
- Known access pattern (don't need Intelligent-Tiering)
- Standard for 7 days (frequent access)
- Standard-IA for 8-90 days (infrequent but may need fast access)
- Glacier for 90 days - 7 years (compliance, rare access)
- Cheapest for known pattern
- Don't delete (compliance requires retention)
```

### Scenario 4: Database Cost Optimization

```
Question: RDS MySQL database costs $3,000/month (db.r5.2xlarge).
          CPU averages 20%, memory 30%. Occasional spikes to 60% CPU
          during month-end processing. How to optimize?

Options:
A) Downsize to db.r5.large (save 50%)
B) Switch to Aurora Serverless v2
C) Keep size, purchase Reserved Instance
D) Downsize to db.r5.xlarge (save 75%)

Answer: A - Downsize to db.r5.large
Why:
- CPU average 20%, spikes to 60% → db.r5.large (50% of 2xlarge) can handle
- 60% CPU on large still acceptable during monthly spike
- Memory 30% → 50% reduction still plenty of headroom
- Immediate 50% savings ($1,500/month)
- Then consider RI for additional 40% off
- D too aggressive (xlarge = 75% reduction, may not handle spikes)
```

### Scenario 5: Multi-Account Cost Optimization

```
Question: Company has 50 AWS accounts in Organization. Want to
          maximize Savings Plans coverage. How to structure?

Options:
A) Each account purchases own Savings Plans
B) Management account purchases all Savings Plans
C) Create dedicated billing account, purchase there
D) Use consolidated billing, any account can purchase

Answer: B - Management account purchases all
Why:
- Savings Plans share across all accounts in Organization
- Management account purchase = central management
- Automatic application to all member accounts
- Easier to track and manage commitments
- Maximizes utilization across accounts
- Any account CAN purchase, but centralized is better practice
```

---

## Summary and Key Takeaways

### Must Know for Exam

1. **Cost Explorer** - Analyze and forecast costs, find optimization opportunities
2. **Compute Optimizer** - ML-based right-sizing recommendations (EC2, Lambda, EBS)
3. **Trusted Advisor** - Automated checks, 56 free vs 482 with Business Support
4. **Savings Plans vs RIs** - Flexibility vs maximum discount, 2025 best practices
5. **Storage lifecycle** - S3 tiering, EBS snapshot management
6. **Tagging strategy** - Cost allocation, chargeback, governance

### Decision Framework

```
Cost Optimization Priority:

1. Eliminate Waste (Highest ROI):
   - Delete unused resources
   - Stop idle instances
   - Remove old snapshots/backups
   - Clean up unattached volumes

2. Right-Size (High ROI):
   - Use Compute Optimizer
   - Downsize over-provisioned resources
   - Optimize before committing to RIs/SPs

3. Use Right Pricing Model (Medium ROI):
   - Savings Plans for stable workloads
   - Spot for fault-tolerant workloads
   - Reserved Capacity for specific needs

4. Optimize Architecture (Medium ROI):
   - Graviton instances (40% cheaper)
   - Serverless where appropriate
   - Managed services (reduce ops cost)

5. Implement Governance (Ongoing):
   - Tagging policies
   - Budgets and alerts
   - Regular cost reviews
   - Anomaly detection
```

### Common Mistakes

- Buying RIs/SPs before right-sizing (lock in waste)
- Not using Compute Optimizer (miss ML insights)
- Ignoring Trusted Advisor (free/low-cost quick wins)
- No tagging strategy (can't track or optimize)
- NAT Gateway for S3/DynamoDB (use free VPC endpoints!)
- Keeping old EBS snapshots forever (expensive)
- Not using Graviton (easy 20-40% savings)
- One-time optimization (need continuous monitoring)

---

**Next:** Practice scenarios and service comparisons for complete Domain 3 mastery
