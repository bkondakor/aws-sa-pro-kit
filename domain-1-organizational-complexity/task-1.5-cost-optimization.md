---
title: "Task 1.5: Determine Cost Optimization and Visibility Strategies"
domain: 1
domain_name: "Design Solutions for Organizational Complexity"
task: 1.5
weight: "26%"
exam_topics:
  - cost-optimization
  - cost-explorer
  - budgets
  - savings-plans
  - reserved-instances
  - spot-instances
  - cost-allocation-tags
  - compute-optimizer
status: complete
last_updated: "2025-11-18"
---

# Task 1.5: Determine Cost Optimization and Visibility Strategies

## Overview
Cost optimization is one of the six pillars of the AWS Well-Architected Framework and a critical consideration for the Solutions Architect Professional exam. This task covers cost allocation, monitoring, optimization strategies, and financial governance in multi-account environments.

---

## 1. Cost Allocation and Tagging

### Cost Allocation Tags

**What they are:**
Metadata applied to AWS resources to track and categorize costs.

**Tag Types:**

**1. AWS-Generated Tags**
- Automatically applied by AWS
- Prefix: `aws:` (cannot be user-defined)
- Examples:
  - `aws:createdBy` - Identity that created resource
  - `aws:cloudformation:stack-name` - CloudFormation stack
  - `aws:cloudformation:logical-id` - Resource ID in template

**2. User-Defined Tags**
- Created by users
- Custom key-value pairs
- Must be activated for cost allocation

**Activation Process:**
1. Apply tags to resources
2. Activate tags in Billing Console (Cost Allocation Tags page)
3. Wait 24 hours for tags to appear in Cost Explorer
4. Tags appear in Cost and Usage Reports

**Best Practice Tagging Strategy:**

**Required Tags:**
- **Environment:** Production, Development, Test, Staging
- **Owner:** Email or team identifier (cost accountability)
- **CostCenter:** For departmental chargeback
- **Project:** Application or project name
- **Application:** Application identifier
- **BusinessUnit:** Department or business unit

**Optional Tags:**
- **Compliance:** Regulatory requirements (PCI, HIPAA)
- **BackupPolicy:** Retention requirements
- **DataClassification:** Sensitivity level
- **AutoShutdown:** For dev/test resources

**Tag Policy Enforcement:**

```json
{
  "tags": {
    "CostCenter": {
      "tag_key": {
        "@@assign": "CostCenter"
      },
      "tag_value": {
        "@@assign": [
          "Engineering",
          "Marketing",
          "Sales",
          "Operations"
        ]
      },
      "enforced_for": {
        "@@assign": [
          "ec2:instance",
          "rds:db",
          "s3:bucket",
          "dynamodb:table"
        ]
      }
    }
  }
}
```

**Tag Inheritance:**
- **EC2:** Tags on instances don't auto-apply to volumes/snapshots
- **Auto Scaling:** Can propagate tags to launched instances
- **CloudFormation:** Stack tags can propagate to resources
- **EBS:** Snapshot tags must be explicit (not inherited from volume)

**Exam Tip:** Remember which services support tag inheritance and which require explicit tagging.

### AWS Cost Categories

**What they are:**
Grouping mechanism to organize costs into custom categories beyond tags.

**Use Cases:**
- Group multiple tags into single category
- Organize accounts into business units
- Create hierarchical cost views
- Support for chargeback and showback

**Example Cost Category:**
```
Category: "Department"
Rules:
  - If CostCenter tag = "Engineering" OR Account = 123456789012 → "Engineering"
  - If CostCenter tag = "Marketing" → "Marketing"
  - Default → "Unallocated"
```

**Benefits:**
- Retroactive categorization (applies to historical data)
- Support complex rules (AND, OR logic)
- Combine account, service, tag filters
- Used in Cost Explorer, Budgets, and CUR

**Creating Cost Categories:**
```json
{
  "Name": "BusinessUnit",
  "Rules": [
    {
      "Value": "Engineering",
      "Rule": {
        "Or": [
          {
            "Tags": {
              "Key": "Department",
              "Values": ["Engineering", "DevOps"]
            }
          },
          {
            "Dimensions": {
              "Key": "LINKED_ACCOUNT",
              "Values": ["123456789012", "234567890123"]
            }
          }
        ]
      }
    }
  ]
}
```

---

## 2. AWS Cost Explorer

### Core Features

**What it is:**
Managed service for visualizing, understanding, and managing AWS costs and usage over time.

**Key Capabilities:**
- View costs and usage for last 12 months
- Forecast next 12 months
- Built-in filters (service, region, account, tags)
- Custom reports and saving
- API access for programmatic analysis
- Anomaly detection
- Right-sizing recommendations
- Reserved Instance/Savings Plans recommendations

**Cost Metrics:**

**1. Unblended Costs**
- Actual costs as charged
- Default view in Cost Explorer
- Shows individual resource costs

**2. Blended Costs**
- Averaged costs across organization
- Consolidated billing discounts distributed
- Used for internal chargeback

**Example:**
```
Account A: 100 hours EC2 @ $0.10/hr = $10
Account B: 900 hours EC2 @ $0.09/hr (volume discount) = $81
Total: $91

Unblended (Account A): $10
Unblended (Account B): $81

Blended Rate: $91 / 1000 hours = $0.091/hr
Blended (Account A): 100 × $0.091 = $9.10
Blended (Account B): 900 × $0.091 = $81.90
```

**3. Amortized Costs**
- Spreads upfront RI/Savings Plans costs over usage period
- Shows effective hourly rate
- Best for understanding true cost per hour

**4. Net Unblended Costs**
- Unblended costs minus credits and refunds
- Most accurate for actual spend

**Exam Tip:** Know when to use each cost metric. Amortized for true cost analysis, Unblended for actual charges.

### Cost Explorer Filters

**Dimension Filters:**
- **Service:** Filter by AWS service (EC2, S3, RDS)
- **Linked Account:** Filter by member account
- **Region:** Filter by AWS region
- **Instance Type:** EC2 instance families (t3.micro, m5.large)
- **Usage Type:** Specific usage categories
- **Purchase Option:** On-Demand, Reserved, Spot

**Tag Filters:**
- User-defined tags (after activation)
- Cost allocation tags
- Multiple tags with AND/OR logic

**Grouping:**
- Group by service, account, region, tag, instance type
- Multiple levels of grouping (service → region → instance type)

**Forecasting:**
- Predict next 12 months based on historical trends
- Confidence intervals (P80 prediction)
- Seasonal pattern recognition
- Useful for budgeting and capacity planning

### Cost Explorer API

**Use Cases:**
- Automated cost reporting
- Integration with third-party tools
- Custom dashboards
- Anomaly detection workflows

**Example API Call (Python Boto3):**
```python
import boto3
from datetime import datetime, timedelta

ce = boto3.client('ce')

end = datetime.now().date()
start = end - timedelta(days=30)

response = ce.get_cost_and_usage(
    TimePeriod={
        'Start': start.isoformat(),
        'End': end.isoformat()
    },
    Granularity='DAILY',
    Metrics=['UnblendedCost'],
    GroupBy=[
        {'Type': 'DIMENSION', 'Key': 'SERVICE'},
    ]
)
```

---

## 3. AWS Cost and Usage Reports (CUR)

### Overview

**What it is:**
Most comprehensive cost and usage data available, delivered to S3 bucket.

**Key Features:**
- Hourly, daily, or monthly granularity
- Line-item details for every charge
- Resource-level tagging information
- Reserved Instance utilization
- Savings Plans coverage
- Support for data lake analysis (Athena, QuickSight)

**Report Configuration:**

**Time Granularity:**
- **Hourly:** Most detailed, largest files
- **Daily:** Balance of detail and file size
- **Monthly:** Summary-level reporting

**Versioning:**
- **Create new report version:** Overwrites previous data
- **Overwrite existing report:** Replaces entire report

**Compression:**
- GZIP (recommended for Athena)
- ZIP
- Parquet (optimized for analytics)

**Data Integration:**
- S3 bucket (encrypted with SSE-S3 or SSE-KMS)
- Redshift (for data warehouse)
- Athena (for ad-hoc queries)
- QuickSight (for visualization)

### CUR Analysis Patterns

**Pattern 1: Athena Query for Top Costs**
```sql
SELECT
  line_item_product_code,
  SUM(line_item_unblended_cost) as cost
FROM cur_database.cur_table
WHERE year = '2025' AND month = '01'
GROUP BY line_item_product_code
ORDER BY cost DESC
LIMIT 10;
```

**Pattern 2: Reserved Instance Utilization**
```sql
SELECT
  reservation_reservation_arn,
  SUM(reservation_unused_quantity) as unused_hours,
  SUM(reservation_total_reserved_units) as total_hours,
  100 * SUM(reservation_unused_quantity) / SUM(reservation_total_reserved_units) as unused_percent
FROM cur_database.cur_table
WHERE year = '2025' AND month = '01'
  AND reservation_reservation_arn IS NOT NULL
GROUP BY reservation_reservation_arn
HAVING unused_percent > 10;
```

**Pattern 3: Cost by Tag**
```sql
SELECT
  resource_tags_user_cost_center,
  SUM(line_item_unblended_cost) as cost
FROM cur_database.cur_table
WHERE year = '2025' AND month = '01'
  AND resource_tags_user_cost_center IS NOT NULL
GROUP BY resource_tags_user_cost_center
ORDER BY cost DESC;
```

### QuickSight Integration

**Architecture:**
```
CUR → S3 → AWS Glue Crawler → Athena → QuickSight
                                            ↓
                                    Interactive Dashboards
```

**Sample Dashboard Visualizations:**
- Cost trends over time (line chart)
- Cost by service (pie chart)
- Cost by account (bar chart)
- Reserved Instance coverage (gauge)
- Savings Plans utilization (KPI)

---

## 4. AWS Budgets

### Budget Types

**1. Cost Budget**
- Monitor total spend or service-specific costs
- Alert when exceeding threshold
- Actual or forecasted costs

**2. Usage Budget**
- Track service usage hours
- Example: EC2 instance hours, S3 storage GB-months
- Prevent unexpected usage spikes

**3. Reservation Budget**
- Monitor RI and Savings Plans utilization
- Alert when utilization < target (e.g., <80%)
- Ensure commitments are fully utilized

**4. Savings Plans Budget**
- Monitor Savings Plans coverage and utilization
- Coverage: Percentage of usage covered by SPs
- Utilization: Percentage of SP commitment used

### Budget Configuration

**Threshold Types:**
- **Actual:** Trigger when actual spend exceeds amount
- **Forecasted:** Trigger when forecast predicts overspend
- **Multiple thresholds:** 50%, 80%, 100%, 120%

**Alert Methods:**
- **Email:** Up to 10 email addresses
- **SNS:** For automation (Lambda, Slack, PagerDuty)
- **AWS Chatbot:** Slack or Chime integration

**Budget Actions (2025 Feature):**
- Automatically execute actions when budget threshold exceeded
- Supported actions:
  - Apply IAM policy (restrict permissions)
  - Apply SCP to OU/account
  - Stop EC2 or RDS instances

**Example Budget Action:**
```
When: Forecasted cost exceeds $1,000 (80% of budget)
Action: Apply SCP to Development OU denying expensive instance types
Result: Prevent launching c5.24xlarge, p3.16xlarge, etc.
```

**Best Practices:**
- Create budget per environment (Prod, Dev, Test)
- Create budget per major application
- Use forecasted alerts for proactive management
- Set multiple thresholds (50%, 80%, 100%)
- Automate responses via SNS + Lambda

**Cost Allocation:**
- Budgets can use cost allocation tags
- Create budget per CostCenter, Project, Owner
- Support for Cost Categories

---

## 5. Anomaly Detection

### AWS Cost Anomaly Detection

**What it is:**
Machine learning-based service that identifies unusual spending patterns.

**How it Works:**
1. Analyzes historical spend patterns
2. Builds ML model of expected spend
3. Detects deviations from expected patterns
4. Sends alerts for anomalies

**Anomaly Types Detected:**
- Sudden cost spikes
- Gradual cost increases
- Service-specific anomalies
- Account-level unusual activity

**Configuration:**

**Monitors:**
- **AWS Services:** Specific service (EC2, S3, RDS)
- **Linked Accounts:** Per-account monitoring
- **Cost Categories:** Custom groupings
- **Cost Allocation Tags:** Tag-based monitoring

**Alert Preferences:**
- **Threshold:** Minimum dollar amount to alert (e.g., $100)
- **Frequency:** Individual alerts or daily summary
- **Recipients:** Email, SNS topic, or both

**Example Anomaly:**
```
Anomaly Detected:
Service: Amazon EC2
Account: Production-Account-1
Expected Daily Cost: $150
Actual Daily Cost: $890
Impact: +493% ($740 over expected)
Root Cause: New c5.9xlarge instances launched
```

**Integration:**
- SNS notifications for automated response
- EventBridge events for complex workflows
- Lambda for automated investigation (check tags, instance types)

**Best Practices:**
- Create separate monitors for production accounts
- Set appropriate thresholds (avoid alert fatigue)
- Integrate with incident management (PagerDuty, ServiceNow)
- Automate investigation via Lambda (who launched, why)

---

## 6. Reserved Instances and Savings Plans

### Reserved Instances (RIs)

**What they are:**
Commitment to use specific instance type in specific region for 1 or 3 years in exchange for significant discount (up to 72%).

**RI Types:**

**1. Standard RIs**
- Highest discount (up to 72%)
- Cannot change instance family
- Can change AZ, instance size (within family), network type
- Can sell on RI Marketplace

**2. Convertible RIs**
- Lower discount (up to 54%)
- Can exchange for different instance family, OS, tenancy
- Cannot sell on RI Marketplace
- Good for workloads that may change

**Payment Options:**
- **All Upfront:** Highest discount, pay 100% upfront
- **Partial Upfront:** Medium discount, pay ~50% upfront + hourly
- **No Upfront:** Lowest discount, pay hourly only

**Scope:**
- **Regional:** Applies to any AZ in region, instance size flexibility
- **Zonal:** Applies to specific AZ, capacity reservation

**Instance Size Flexibility (Regional RIs):**
- Applies to same instance family
- Normalization factor based on instance size

**Example:**
```
Purchase: 1 × m5.4xlarge RI (normalization factor: 16)

Can cover:
  - 1 × m5.4xlarge (16/16 = 1)
  - 2 × m5.2xlarge (16/8 = 2)
  - 4 × m5.xlarge (16/4 = 4)
  - 16 × m5.large (16/1 = 16)
```

### Savings Plans

**What they are:**
Flexible pricing model offering significant savings (up to 72%) in exchange for commitment to consistent usage ($/hour) for 1 or 3 years.

**Savings Plans Types:**

**1. Compute Savings Plans**
- Most flexible
- Applies to EC2, Fargate, Lambda
- Any instance family, size, region, OS, tenancy
- Up to 66% discount

**2. EC2 Instance Savings Plans**
- Applies to EC2 only
- Specific instance family in specific region
- Flexible across size, AZ, OS, tenancy
- Up to 72% discount (highest)

**3. SageMaker Savings Plans**
- Applies to SageMaker usage
- Any instance family, size, region

**Payment Options:**
- All Upfront, Partial Upfront, No Upfront (same as RIs)

**Key Differences from RIs:**

| Feature | Reserved Instances | Savings Plans |
|---------|-------------------|---------------|
| **Flexibility** | Instance type locked (Standard) | Can change anything (Compute SP) |
| **Coverage** | EC2 only | EC2, Fargate, Lambda |
| **Commitment** | Instance type/count | Dollar amount per hour |
| **Discount** | Up to 72% | Up to 72% |
| **Application** | Specific instances | Any matching usage |

**When to Use Each:**

**Reserved Instances:**
- Predictable, unchanging workloads
- Specific instance type requirements
- Need capacity reservation (Zonal RI)

**Compute Savings Plans:**
- Flexible compute needs (EC2 + Lambda + Fargate)
- Workloads that may change instance types
- Multi-region deployments

**EC2 Instance Savings Plans:**
- Predictable EC2 workloads
- Specific instance family (but flexible on size)
- Single region focus

### Multi-Account RI/Savings Plans Sharing

**How it Works:**
- RIs and Savings Plans automatically shared across organization
- Consolidated billing required
- Applied to lowest pricing option first (maximize savings)

**Sharing Preferences:**
- Can disable sharing at payer account level
- Control which accounts receive shared benefit
- Priority order configurable

**Best Practices:**
- Purchase RIs/SPs in management account (visibility)
- Or purchase in dedicated FinOps account
- Monitor utilization across organization
- Regular reviews for optimization opportunities

---

## 7. Cost Optimization Strategies

### Right-Sizing

**What it is:**
Matching instance types and sizes to actual workload requirements.

**Process:**
1. Monitor utilization (CloudWatch, Compute Optimizer)
2. Identify over-provisioned resources (low CPU/memory)
3. Test smaller instance types in non-production
4. Implement changes in production
5. Continue monitoring

**AWS Compute Optimizer:**
- ML-based recommendations
- Analyzes CloudWatch metrics (14+ days)
- Recommends optimal instance types
- Shows projected savings
- Supports EC2, Auto Scaling Groups, EBS, Lambda

**Example Recommendation:**
```
Current: m5.2xlarge (8 vCPU, 32 GB RAM) - $0.384/hr
CPU Utilization: 12% average
Memory Utilization: 28% average

Recommendation: m5.large (2 vCPU, 8 GB RAM) - $0.096/hr
Projected Savings: 75% ($211/month per instance)
```

**Implementation:**
- Use Auto Scaling to test different instance types
- Implement during maintenance windows
- Monitor performance after change
- Iterate until optimal

### Storage Optimization

**S3 Storage Class Selection:**

| Storage Class | Use Case | Cost (GB/month) | Retrieval Time |
|---------------|----------|-----------------|----------------|
| **Standard** | Frequent access | $0.023 | Milliseconds |
| **Intelligent-Tiering** | Unknown/changing access | $0.023 + $0.0025 monitoring | Milliseconds |
| **Standard-IA** | Infrequent access | $0.0125 | Milliseconds |
| **One Zone-IA** | Non-critical, infrequent | $0.01 | Milliseconds |
| **Glacier Instant** | Archive, instant retrieval | $0.004 | Milliseconds |
| **Glacier Flexible** | Archive, rare access | $0.0036 | Minutes-hours |
| **Glacier Deep Archive** | Long-term archive | $0.00099 | 12 hours |

**S3 Lifecycle Policies:**
```
Rule 1: Transition to Intelligent-Tiering
  - After 0 days (immediate)
  - For all objects

Rule 2: Transition to Glacier
  - After 90 days
  - For objects tagged "archive=true"

Rule 3: Delete old versions
  - After 30 days (for versioned buckets)
```

**EBS Optimization:**
- Delete unattached volumes
- Convert gp2 to gp3 (20% cost savings)
- Snapshot old volumes, delete EBS
- Use EBS snapshots lifecycle policies

**EBS Volume Types:**
- **gp3:** General purpose, cheaper than gp2 ($0.08/GB vs $0.10/GB)
- **gp2:** Older general purpose
- **io2:** High performance, expensive ($0.125/GB + IOPS charges)
- **st1:** Throughput-optimized HDD ($0.045/GB)
- **sc1:** Cold HDD, lowest cost ($0.015/GB)

### Compute Optimization

**Spot Instances:**
- Up to 90% discount vs On-Demand
- Can be interrupted with 2-minute warning
- Best for fault-tolerant workloads

**Use Cases:**
- Batch processing
- Big data analytics
- CI/CD build agents
- Containerized workloads
- Machine learning training

**Spot Best Practices:**
- Use Spot Fleets (diversify instance types)
- Implement checkpointing (save state)
- Handle interruption notices gracefully
- Combine with On-Demand/Reserved for baseline

**Graviton Instances:**
- AWS-designed ARM processors
- Up to 40% better price-performance
- Instance types: M6g, C6g, R6g, T4g

**Considerations:**
- Application must support ARM architecture
- Test compatibility before migration
- Significant cost savings for supported workloads

**Lambda Optimization:**
- Right-size memory (also affects CPU)
- Use ARM (Graviton2) for 20% cost reduction
- Reduce execution time (optimize code)
- Use Compute Savings Plans (17-25% discount)

### Data Transfer Optimization

**Data Transfer Costs:**
- **Inbound:** Free
- **Same AZ:** Free
- **Different AZ (same region):** $0.01/GB
- **Cross-region:** $0.02/GB
- **Internet egress:** $0.09/GB (first 10 TB)

**Optimization Strategies:**

**1. Use Same Region/AZ:**
- Deploy related resources in same AZ (when possible)
- Use Availability Zone IDs (not names) for consistency

**2. CloudFront for Public Content:**
- Cheaper than S3 direct egress ($0.085/GB vs $0.09/GB)
- Caching reduces origin data transfer
- Global acceleration included

**3. VPC Endpoints (Gateway):**
- Free for S3 and DynamoDB
- No internet gateway data transfer charges
- Keep traffic on AWS network

**4. Direct Connect for Large Transfers:**
- $0.02/GB outbound (cheaper than internet)
- Consistent network performance
- Worth it for sustained >1 TB/month egress

**5. AWS PrivateLink:**
- Keep traffic within AWS network
- Avoid internet egress charges
- $0.01/GB data processing (still cheaper than internet)

---

## 8. Multi-Account Cost Optimization

### Chargeback and Showback

**Chargeback:**
- Billing actual costs back to consuming teams
- Requires accurate cost allocation (tags, accounts)
- Incentivizes cost-conscious behavior

**Showback:**
- Report costs without billing
- Awareness and accountability
- Precursor to chargeback

**Implementation:**

**Per-Account Chargeback:**
- Simplest: Each account = one bill
- Works well with account-per-team structure
- Consolidated billing provides per-account breakdown

**Tag-Based Chargeback:**
- Cost allocation tags (CostCenter, Project, Team)
- Use Cost Categories for grouping
- Generate reports via CUR + Athena

**Allocation Strategies:**
- **Direct:** Costs directly attributable to team
- **Shared:** Networking, security costs allocated proportionally
- **Hybrid:** Direct where possible, shared for common services

**Example Allocation:**
```
Total Organization Cost: $100,000

Direct Costs:
  Team A: $30,000
  Team B: $25,000
  Team C: $15,000
  Shared Services: $30,000

Shared Allocation (by direct cost):
  Team A: $30,000 + ($30,000/70,000 × $30,000) = $42,857
  Team B: $25,000 + ($25,000/70,000 × $30,000) = $35,714
  Team C: $15,000 + ($15,000/70,000 × $30,000) = $21,429
```

### Reserved Instance Strategy for Multi-Account

**Centralized Purchase:**
- Purchase all RIs/SPs in management or dedicated account
- Automatic sharing across organization
- Centralized visibility and management

**Distributed Purchase:**
- Each team purchases for their accounts
- Better alignment with team ownership
- Risk of sub-optimal purchases

**Recommended Approach:**
- Centralized purchase for shared services (network, security)
- Allow team purchases for application-specific needs
- Regular reviews for optimization (quarterly)

**RI/SP Coverage Target:**
- Baseline workloads: 70-80% coverage with RIs/SPs
- Variable workloads: Remaining 20-30% On-Demand or Spot
- Avoid 100% coverage (reduces flexibility)

---

## 9. Cost Governance

### Cost Control Policies

**Service Control Policies for Cost Control:**

**Prevent Expensive Instance Types:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": "arn:aws:ec2:*:*:instance/*",
      "Condition": {
        "StringNotLike": {
          "ec2:InstanceType": [
            "t3.*",
            "t3a.*",
            "m5.*",
            "m5a.*"
          ]
        }
      }
    }
  ]
}
```

**Prevent Specific Regions (Cost Optimization):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": [
            "us-east-1",
            "us-west-2"
          ]
        }
      }
    }
  ]
}
```

**Require Tagging for Resource Creation:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": [
        "ec2:RunInstances",
        "rds:CreateDBInstance"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotLike": {
          "aws:RequestTag/CostCenter": "*"
        }
      }
    }
  ]
}
```

### Trusted Advisor Cost Optimization Checks

**Available Checks (Business/Enterprise Support):**
- Low utilization EC2 instances
- Idle load balancers
- Underutilized EBS volumes
- Unassociated Elastic IP addresses
- Idle RDS instances
- Amazon RDS idle DB instances
- Amazon Redshift underutilized clusters

**Automation:**
- EventBridge integration for automated response
- Weekly email reports
- API access for custom automation

**Example Automation:**
```
Trusted Advisor: Low utilization EC2 detected
  ↓
EventBridge Rule
  ↓
Lambda Function
  ↓
  - Check tags (environment=dev?)
  - Stop instance if development
  - Send notification to owner
  - Create ticket for investigation
```

---

## 10. Tricky Scenarios and Exam Tips

### Scenario 1: Blended vs Unblended Costs

**Question:**
"Organization with consolidated billing. Team A wants accurate chargeback."

**Wrong Answer:** Use blended costs
- **Problem:** Doesn't reflect actual team usage, averages discounts

**Correct Answer:** Use unblended costs
- **Reason:** Shows actual costs incurred by each account

**When to Use Blended:**
- Fair distribution of volume discounts across teams
- Simplified chargeback model

### Scenario 2: Savings Plans vs Reserved Instances

**Question:**
"Workload uses EC2, Fargate, and Lambda. Need maximum savings."

**Analysis:**
- **EC2 Instance Savings Plans:** EC2 only ✗
- **Standard RIs:** EC2 only ✗
- **Compute Savings Plans:** Covers all three ✓

**Answer:** Compute Savings Plans (most flexible)

**Follow-up:** "What if only EC2 and need highest discount?"
**Answer:** EC2 Instance Savings Plans (up to 72% vs 66% for Compute)

### Scenario 3: Cost Allocation Tags Not Appearing

**Question:**
"Applied tags to resources but not seeing in Cost Explorer."

**Common Issues:**
1. Tags not activated in Billing Console
2. Less than 24 hours since activation
3. Resources created before tag activation (tags not retroactive)
4. Using AWS-generated tags without `aws:` prefix

**Solution:**
- Activate tags in Cost Allocation Tags page
- Wait 24 hours
- For historical data, tags must have existed at creation time

### Scenario 4: Budget Actions for Automatic Cost Control

**Question:**
"Prevent development accounts from exceeding $1,000/month."

**Solution:**
- Create budget for Development OU
- Set threshold at $900 (90%)
- Budget action: Apply SCP denying expensive resources
- Alternative: Apply IAM policy to reduce permissions

**Considerations:**
- Test SCP doesn't impact critical resources
- Notify teams before automated action
- Have rollback procedure

### Scenario 5: RI/SP Underutilization

**Question:**
"Reserved Instances only 60% utilized. Why?"

**Common Causes:**
1. Wrong instance type purchased
2. Wrong region (regional RI but instances in different region)
3. Wrong tenancy (default vs dedicated)
4. Instance stopped or terminated
5. Changed instance family (Standard RI)

**Solution:**
- Use Convertible RIs for flexibility
- Or use Savings Plans (more flexible)
- Monitor utilization via Cost Explorer
- Sell unused Standard RIs on marketplace

---

## 11. Hands-On Practice Labs

### Lab 1: Cost Allocation with Tags
1. Define tagging strategy (CostCenter, Project, Environment)
2. Apply tags to EC2, RDS, S3 resources
3. Activate tags in Billing Console
4. Create Cost Explorer report grouped by tags
5. Set up Cost Categories
6. Generate chargeback report

### Lab 2: AWS Budgets with Actions
1. Create cost budget for development account
2. Set thresholds (50%, 80%, 100%)
3. Configure email and SNS alerts
4. Create budget action (apply SCP at 80%)
5. Test by simulating cost increase
6. Verify automated response

### Lab 3: Cost and Usage Reports with Athena
1. Enable CUR with hourly granularity
2. Configure S3 bucket and permissions
3. Set up AWS Glue crawler
4. Create Athena database
5. Run queries for top costs by service
6. Create QuickSight dashboard

### Lab 4: Reserved Instance Purchase Strategy
1. Analyze EC2 usage in Cost Explorer (last 3 months)
2. Review RI/SP recommendations
3. Calculate potential savings
4. Purchase RI or Savings Plan (test environment)
5. Monitor utilization after purchase
6. Adjust coverage as needed

### Lab 5: Cost Anomaly Detection
1. Enable Cost Anomaly Detection
2. Create monitors (per service, per account)
3. Set alert thresholds
4. Configure SNS notification
5. Simulate anomaly (launch expensive instances)
6. Verify alert received
7. Implement automated response (Lambda)

---

## 12. Key Takeaways

**Decision Trees:**

```
Cost Allocation Strategy:

Need chargeback?
├─ Per-account billing → Use linked account costs
├─ Per-team billing (multiple accounts) → Cost Categories + Tags
├─ Per-project billing → Cost allocation tags (Project tag)
└─ Complex allocation → CUR + Athena queries + custom logic

Commitment Strategy:

Workload characteristics:
├─ Predictable, unchanging EC2 → EC2 Instance Savings Plans (72%)
├─ Predictable, may change instance type → Compute Savings Plans (66%)
├─ Mix of EC2, Fargate, Lambda → Compute Savings Plans
├─ Need capacity reservation → Zonal Reserved Instance
└─ Unpredictable → On-Demand or Spot

Cost Visibility Tool:

Requirement:
├─ Quick cost overview → Cost Explorer
├─ Detailed line-item analysis → Cost and Usage Reports (CUR)
├─ Real-time cost tracking → CloudWatch + Cost Explorer API
├─ Proactive cost alerts → AWS Budgets
└─ Unusual spend detection → Cost Anomaly Detection
```

**Cost Optimization Checklist:**
- Right-size resources based on actual utilization
- Use Savings Plans/RIs for baseline workloads (70-80%)
- Implement S3 Lifecycle policies for storage optimization
- Delete unused resources (EBS volumes, snapshots, EIPs)
- Use Spot Instances for fault-tolerant workloads
- Leverage S3 Intelligent-Tiering for unknown access patterns
- Monitor with Cost Explorer and Budgets
- Implement cost allocation tags for chargeback
- Regular reviews (monthly) for optimization opportunities

**Multi-Account Cost Best Practices:**
- Consolidated billing for volume discounts
- Cost allocation tags across all accounts
- Cost Categories for flexible grouping
- Budgets per account and per OU
- Centralized CUR in management account
- Chargeback reports for accountability
- SCPs for cost governance

**Tagging Strategy:**
- Define organization-wide standard (minimum 5 tags)
- Enforce with Tag Policies or SCPs
- Activate tags in Billing Console
- Use Cost Categories for flexibility
- Include CostCenter, Project, Owner, Environment
- Automate tagging where possible (CloudFormation, Terraform)

---

## 13. Common Exam Traps

**Trap 1:** Assuming tags are retroactive
- **Reality:** Cost allocation tags only apply from activation forward

**Trap 2:** Confusing RI types (Standard vs Convertible)
- **Standard:** Can't change instance family, higher discount
- **Convertible:** Can exchange, lower discount

**Trap 3:** Forgetting Savings Plans flexibility
- **Reality:** Compute SP covers EC2, Fargate, Lambda (most flexible)

**Trap 4:** Not understanding blended costs
- **Reality:** Averaged costs, not actual - use unblended for accurate chargeback

**Trap 5:** Overlooking data transfer costs
- **Reality:** Can be significant (cross-region, internet egress)

**Trap 6:** Assuming Cost Explorer shows real-time data
- **Reality:** 24-hour delay for finalized costs

**Trap 7:** Not activating cost allocation tags
- **Reality:** Tags must be activated in Billing Console to appear in reports

---

**Next Steps:**
- Study comprehensive tricky scenarios for Domain 1
- Practice cost optimization hands-on
- Review AWS Cost Management documentation
- Complete practice questions on cost optimization
