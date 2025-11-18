---
title: "Task 3.1: Determine a Strategy to Improve Overall Operational Excellence"
domain: 3
domain_name: "Continuous Improvement for Existing Solutions"
task: 3.1
weight: "25%"
task_weight: "~20% of domain"
exam_topics:
  - operational-excellence
  - observability
  - cloudwatch
  - monitoring
  - logging
  - automation
  - systems-manager
  - x-ray
status: complete
last_updated: "2025-11-18"
---

# Task 3.1: Determine a Strategy to Improve Overall Operational Excellence

## Overview

Operational Excellence is the ability to run and monitor systems to deliver business value and continually improve supporting processes and procedures. This task focuses on implementing observability, automation, and operational improvements for existing AWS solutions.

**Weight:** ~20% of Domain 3 (5% of total exam)

---

## Core Concepts

### The Three Pillars of Observability

1. **Metrics** - Quantitative measurements of system behavior
2. **Logs** - Event records and application output
3. **Traces** - Request flow through distributed systems

**Critical Understanding:** All three pillars must work together. Metrics alert you to problems, logs help diagnose issues, and traces show you the flow of requests through your system.

---

## AWS Services for Operational Excellence

### Amazon CloudWatch - Central Observability Platform

#### CloudWatch Metrics
**What it does:** Collects and tracks numerical data points over time

**Key Features:**
- **Standard Metrics** - Automatically collected from AWS services (free)
- **Detailed Monitoring** - Higher frequency metrics (1-minute intervals)
- **Custom Metrics** - Application-specific metrics you publish
- **High-Resolution Metrics** - Sub-minute granularity (1-second intervals)

**Exam Scenarios:**
```
Scenario: Application experiencing intermittent slowdowns every 30 seconds
Solution: Use high-resolution custom metrics (1-second) instead of standard
          metrics (5-minute) to identify the exact timing pattern
```

**Best Practices:**
- Use namespaces to organize custom metrics logically
- Implement metric dimensions for filtering (Environment, Application, Version)
- Set appropriate metric retention (15 months standard, high-resolution degrades over time)
- Use metric math for calculated metrics (error rates, percentages)

#### CloudWatch Logs
**What it does:** Centralized log aggregation and analysis

**Key Features:**
- **Log Groups** - Container for log streams (typically one per application)
- **Log Streams** - Sequence of log events from same source
- **Metric Filters** - Extract metrics from log patterns
- **Subscription Filters** - Stream logs to other services (Lambda, Kinesis, Elasticsearch)
- **Log Insights** - SQL-like query language for log analysis
- **Live Tail** - Real-time log streaming for debugging

**Retention Strategy:**
```
Critical logs (audit, security):     Never expire or 10 years
Application logs (production):       90-180 days
Application logs (development):      7-30 days
Debug logs:                          1-7 days
```

**Cost Optimization:**
- Export infrequently accessed logs to S3 (much cheaper)
- Use log sampling for high-volume applications
- Set appropriate retention periods - don't keep everything forever
- Use S3 Intelligent-Tiering for archived logs

#### CloudWatch Alarms
**What it does:** Monitors metrics and triggers actions when thresholds are breached

**Alarm Types:**
1. **Metric Alarm** - Based on single metric threshold
2. **Composite Alarm** - Combines multiple alarms using AND/OR logic
3. **Anomaly Detection Alarm** - ML-based, adjusts to changing patterns

**States:**
- **OK** - Metric within threshold
- **ALARM** - Metric breached threshold
- **INSUFFICIENT_DATA** - Not enough data to evaluate

**Tricky Scenario:**
```
Question: You need to alert when BOTH CPU > 80% AND disk space < 10%
Wrong Answer: Create two separate alarms
Right Answer: Create a composite alarm that combines both conditions with AND logic
Why: Composite alarms reduce alert fatigue and ensure correlated conditions
```

**Best Practices:**
- Use composite alarms for complex conditions
- Set "Treat missing data as" appropriately:
  - `missing` - Don't evaluate (default, usually best)
  - `notBreaching` - Assume OK (dangerous for critical alarms)
  - `breaching` - Assume alarm state (good for expected continuous metrics)
  - `ignore` - Maintain current state
- Configure evaluation periods and datapoints appropriately (e.g., 3 out of 5)
- Use anomaly detection for metrics with changing patterns

#### CloudWatch Dashboards
**What it does:** Visualize metrics and operational data

**Best Practices:**
- Create operational dashboards (current state, health)
- Create analytical dashboards (trends, capacity planning)
- Use automatic dashboards (Service Lens) as starting point
- Share dashboards across accounts using cross-account sharing
- Use custom widgets for application-specific visualizations

#### CloudWatch Application Signals (NEW 2025)
**What it does:** Automatically instruments applications to monitor SLOs

**Key Features:**
- Automatic service discovery
- Pre-built SLO templates
- Error tracking and latency monitoring
- Integration with X-Ray for distributed tracing

**Use Case:**
```
Scenario: Need to monitor SLO for 99.9% availability and <500ms latency
Solution: Use CloudWatch Application Signals to automatically track SLIs,
          configure SLO thresholds, and alert when error budgets are consumed
```

#### CloudWatch Internet Monitor
**What it does:** Monitors internet connectivity and performance

**Use Case:** Track user experience issues caused by internet routing or ISP problems

---

### AWS X-Ray - Distributed Tracing

**What it does:** Tracks requests as they travel through your distributed application

**Key Concepts:**
- **Segments** - Data about work done by your application
- **Subsegments** - More granular view of calls within a segment
- **Service Graph** - Visual representation of service relationships
- **Traces** - End-to-end path of a request
- **Annotations** - Indexed key-value pairs for filtering
- **Metadata** - Non-indexed additional data

**Sampling Strategy (CRITICAL FOR EXAM):**

Default sampling rule:
- 1 request per second (reservoir)
- 5% of additional requests (rate)

**Why Sampling?**
- Reduces costs while maintaining visibility
- Still captures rare errors and slow requests
- Adjustable based on traffic volume

**Custom Sampling Example:**
```json
{
  "version": 2,
  "rules": [
    {
      "description": "Sample all errors",
      "service_name": "*",
      "http_method": "*",
      "url_path": "*",
      "fixed_target": 0,
      "rate": 1.0,
      "priority": 100,
      "attributes": {
        "http.status": "5*"
      }
    },
    {
      "description": "Sample 1% of normal traffic",
      "service_name": "*",
      "http_method": "*",
      "url_path": "*",
      "fixed_target": 1,
      "rate": 0.01,
      "priority": 1000
    }
  ]
}
```

**Tricky Exam Scenario:**
```
Question: Application has 10,000 requests/second. X-Ray costs are too high.
          You need to reduce costs by 90% while maintaining error visibility.

Wrong Answer: Reduce sampling to 10% across all requests
Right Answer: Sample 100% of errors (5xx responses) and 1% of successful requests
Why: Errors are more valuable for troubleshooting. You maintain full error
     visibility while drastically reducing data volume from successful requests.
```

**Integration Points:**
- API Gateway
- Lambda
- ECS/EKS
- Elastic Beanstalk
- EC2 (requires X-Ray daemon)

---

### AWS Systems Manager - Operations Hub

#### Systems Manager Capabilities Matrix

| Capability | Use Case | Automation Level | Cost |
|-----------|----------|-----------------|------|
| **Run Command** | Execute commands on instances | Manual/API | Free (until Dec 2025 for new customers) |
| **Automation** | Multi-step workflows | Full automation | Charged per step execution |
| **Patch Manager** | OS and application patching | Automated | Free |
| **Session Manager** | Secure shell access without SSH keys | Manual | Free |
| **Parameter Store** | Centralized configuration | Supporting | Free (standard), Paid (advanced) |
| **OpsCenter** | Operational issue management | Semi-automated | Free |
| **Maintenance Windows** | Scheduled operations | Scheduled | Free |
| **State Manager** | Desired state configuration | Continuous | Free |
| **Inventory** | Collect instance metadata | Automated | Free |
| **Fleet Manager** | Centralized instance management | Manual | Free |

#### Run Command
**What it does:** Execute commands remotely on managed instances

**Use Cases:**
- Install software on multiple instances
- Retrieve log files for troubleshooting
- Execute scripts for configuration changes
- Perform security scans

**Best Practice:**
```
Use Run Command for ad-hoc operations
Use State Manager for desired state enforcement
Use Automation for multi-step workflows
```

#### Automation Documents (Runbooks)

**What they are:** Workflows defined in YAML/JSON that perform actions

**Pre-built AWS Runbooks:**
- `AWS-RestartEC2Instance` - Safely restart instances
- `AWS-CreateSnapshot` - Create EBS snapshots
- `AWS-DetachEBSVolume` - Safely detach volumes
- `AWS-PatchInstanceWithRollback` - Patch with automatic rollback
- `AWSSupport-TroubleshootSSH` - Diagnose SSH connectivity

**Custom Runbook Example:**
```yaml
description: Automated remediation for high CPU
schemaVersion: '0.3'
parameters:
  InstanceId:
    type: String
    description: Instance to remediate
mainSteps:
  - name: CheckCPUUtilization
    action: aws:waitForAwsResourceProperty
    inputs:
      Service: cloudwatch
      Api: GetMetricStatistics
      PropertySelector: "$.Datapoints[0].Average"
      DesiredValues:
        - "80"
      Namespace: AWS/EC2
      MetricName: CPUUtilization
      Dimensions:
        - Name: InstanceId
          Value: "{{ InstanceId }}"
  - name: CreateSnapshot
    action: aws:createSnapshot
    inputs:
      VolumeId: "{{ GetVolumeId.VolumeId }}"
      Description: "Pre-scale snapshot"
  - name: ChangeInstanceType
    action: aws:changeInstanceType
    inputs:
      InstanceId: "{{ InstanceId }}"
      InstanceType: m5.xlarge
```

**Important Note (2025 Update):**
- Systems Manager Automation free tier ended December 31, 2025 for existing customers
- New customers (after August 14, 2025) don't get free tier
- Charges apply per runbook step execution

#### Patch Manager
**What it does:** Automates OS and application patching

**Patch Baseline:**
- Defines which patches to approve automatically
- Can be based on severity, classification, or specific CVEs
- Separate baselines for different OS types

**Maintenance Windows:**
- Schedule when patches are applied
- Can include other operations (backups, scripts)
- Supports rate controls (patch 10 instances at a time)

**Tricky Scenario:**
```
Question: Need to patch 500 production instances with zero downtime
Solution:
1. Use multiple maintenance windows (staggered)
2. Deploy instances in Auto Scaling groups
3. Use instance refresh with minimum healthy percentage
4. Patch baseline with immediate approval for critical patches only
5. Rate control: Patch 10% of fleet at a time
```

#### OpsCenter
**What it does:** Centralized location to view and resolve operational issues (OpsItems)

**Auto-creation from:**
- CloudWatch alarms
- EventBridge events
- Security Hub findings
- Config compliance rules

**Integration with Automation:**
- Associate runbooks with OpsItems
- One-click remediation
- Track remediation history

#### Parameter Store
**What it does:** Centralized secrets and configuration management

**Types:**
1. **Standard Parameters**
   - Up to 10,000 per account
   - Max 4KB value size
   - Free

2. **Advanced Parameters**
   - Up to 100,000 per account
   - Max 8KB value size
   - Parameter policies (expiration, rotation)
   - Paid ($0.05 per parameter/month)

**SecureString Parameters:**
- Encrypted with KMS
- Transparently decrypted when retrieved
- Use for secrets, passwords, API keys

**Comparison with Secrets Manager:**
```
Use Parameter Store when:
- Simple key-value configuration
- Cost is primary concern
- Integration with Systems Manager workflows
- No automatic rotation needed

Use Secrets Manager when:
- Automatic rotation required
- RDS database credentials
- Need fine-grained access control per secret
- Cross-region replication needed
```

---

### Amazon EventBridge - Event-Driven Automation

**What it does:** Serverless event bus for application integration

**Event Sources:**
- AWS services (100+ integrated)
- Custom applications
- SaaS applications (Zendesk, Datadog, etc.)

**Event Targets:**
- Lambda functions
- Step Functions
- SNS topics
- SQS queues
- Systems Manager Automation
- ECS tasks
- And 20+ more

**Operational Excellence Pattern:**
```
CloudWatch Alarm → EventBridge → Systems Manager Automation (Runbook)

Example: High CPU alarm → EventBridge rule → Runbook to scale up instance type
```

**Event Pattern Matching:**
```json
{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State-change Notification"],
  "detail": {
    "state": ["stopped"]
  }
}
```

**Archive and Replay:**
- Archive events for compliance or debugging
- Replay events for testing automation

---

### AWS CloudTrail - Audit and Compliance

**What it does:** Records API calls and account activity

**Event Types:**
1. **Management Events** - Control plane operations (CreateInstance, DeleteBucket)
2. **Data Events** - Data plane operations (S3 GetObject, Lambda Invoke)
3. **Insights Events** - Unusual activity detected by ML

**Multi-Region Trail:**
- Single trail applies to all regions
- Delivers logs to central S3 bucket
- Best practice for governance

**CloudTrail Lake (NEW):**
- Managed data lake for CloudTrail events
- SQL-based querying
- 7-year retention
- Faster than querying S3 logs

**Operational Use Cases:**
- Security incident investigation
- Compliance auditing
- Troubleshooting permission issues
- Change tracking

**Integration with CloudWatch:**
```
CloudTrail → CloudWatch Logs → Metric Filter → Alarm

Example: Alert when root account is used
         Alert when security groups are modified
         Alert when IAM policy changes occur
```

---

## Operational Excellence Patterns

### Pattern 1: Automated Incident Response

**Architecture:**
```
CloudWatch Alarm → SNS → Lambda → Systems Manager Automation
                    └──→ PagerDuty/Slack notification
```

**Example Scenario:**
```
Problem: Database connection pool exhausted
Detection: CloudWatch alarm on DatabaseConnections metric
Response:
  1. SNS notification to on-call team
  2. Lambda function analyzes RDS metrics
  3. If connections > 80%, trigger Systems Manager runbook to:
     - Create DB snapshot
     - Scale up instance class
     - Update Auto Scaling group to reduce load
  4. Create OpsCenter item for follow-up
```

### Pattern 2: Proactive Monitoring with Anomaly Detection

**Use CloudWatch Anomaly Detection when:**
- Metrics have predictable patterns but dynamic thresholds
- Traffic varies by time of day or day of week
- Traditional static thresholds cause too many false positives

**Example:**
```
E-commerce site: Traffic is low at night, high during business hours
Static threshold: CPU > 70% (too many alerts at night)
Solution: Anomaly detection learns pattern, alerts on deviations
```

### Pattern 3: Canary Monitoring (CloudWatch Synthetics)

**What it does:** Proactively test application endpoints and user workflows

**Use Cases:**
- Monitor login workflow success rate
- Check API endpoint response times
- Validate website functionality 24/7
- Monitor from different geographic regions

**Blueprint Scripts:**
- Heartbeat monitoring (simple endpoint check)
- API canary (REST API testing)
- Broken link checker
- Visual monitoring (screenshot comparison)
- GUI workflow (Selenium-based)

**Best Practice:**
```
Create canaries that match real user journeys:
1. Homepage load
2. Search functionality
3. Add to cart
4. Checkout process

Alert when any step fails or exceeds latency SLO
```

### Pattern 4: Operational Metrics Dashboard

**Key Metrics to Display:**

**Infrastructure Health:**
- EC2 instance CPU/memory/disk utilization
- RDS database connections and CPU
- ELB healthy/unhealthy target counts
- Lambda error rate and duration

**Application Health:**
- Request count and error rate
- Response time (p50, p90, p99)
- Active users/sessions
- Business metrics (orders, transactions)

**Operational Metrics:**
- Deployment frequency
- Change success rate
- Mean time to recovery (MTTR)
- Open incidents count

### Pattern 5: Automated Runbook Execution

**Decision Tree:**
```
Should you automate remediation?

High Risk (data loss, security) → Manual with runbook documentation
  Examples: Database restore, security group changes

Low Risk + High Frequency → Full automation
  Examples: Restart service, clear cache, scale resources

Medium Risk + High Frequency → Automation with approval
  Examples: Patch deployment, configuration changes
```

**Approval Gate Pattern:**
```
Detection → Create OpsItem → Human reviews → Approve → Automation executes
```

---

## Monitoring Strategy Framework

### 1. Define What to Monitor

**Four Golden Signals (Google SRE):**
1. **Latency** - Time to serve requests
2. **Traffic** - Demand on your system
3. **Errors** - Rate of failed requests
4. **Saturation** - How "full" your service is

**AWS Implementation:**
```
Latency:    ALB TargetResponseTime, Lambda Duration, RDS ReadLatency
Traffic:    ALB RequestCount, Lambda Invocations, RDS DatabaseConnections
Errors:     ALB HTTPCode_Target_5XX_Count, Lambda Errors
Saturation: EC2 CPUUtilization, RDS CPUUtilization, EBS VolumeQueueLength
```

### 2. Set Meaningful Thresholds

**Anti-Pattern:** Alert on everything above arbitrary thresholds
**Best Practice:** Alert based on SLO violations and user impact

**Example:**
```
Bad:  CPU > 80% on any instance
Good:
  - p99 latency > 1 second for 5 minutes
  - Error rate > 1% for 5 minutes
  - 3+ instances unhealthy in target group
```

### 3. Reduce Alert Fatigue

**Strategies:**
- Use composite alarms for correlated conditions
- Implement alert suppression during maintenance windows
- Set appropriate evaluation periods (don't alert on momentary spikes)
- Use anomaly detection for dynamic workloads
- Route different severities to different channels

**Severity Levels:**
```
P1 - Critical: Service down, data loss risk → Page on-call engineer
P2 - High: Degraded performance, approaching limits → Slack + ticket
P3 - Medium: Non-critical issues → Ticket only
P4 - Low: Informational, trends → Daily digest
```

### 4. Enable Effective Troubleshooting

**Correlation is Key:**
- Link metrics, logs, and traces
- Use CloudWatch Service Lens for automatic correlation
- Tag resources consistently
- Use correlation IDs in logs and traces

**CloudWatch Logs Insights Query Examples:**
```
# Find errors in last hour
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100

# Calculate error rate by endpoint
fields @timestamp
| stats count() as total,
        sum(status >= 400) as errors
        by endpoint
| fields endpoint, (errors/total*100) as error_rate
```

---

## Change Management and Deployment

### Safe Deployment Practices

**1. Progressive Deployment**
- Canary: 10% → 50% → 100%
- Linear: Add 10% every 10 minutes
- Blue/Green: All at once with rollback capability

**2. Automated Rollback**
```
Trigger automatic rollback when:
- Error rate > baseline + 10%
- Latency p99 > SLO threshold
- Health check failures > 20%
```

**3. Deployment Tracking**
```
Use CloudWatch Annotations to mark deployments on metrics
Correlate performance changes with deployment events
Use X-Ray to compare traces before/after deployment
```

### Change Calendar (Systems Manager)

**What it does:** Prevents changes during blocked periods

**Use Cases:**
- Block deployments during Black Friday
- Prevent patching during business hours
- Freeze changes before major events

**Integration:**
```
Systems Manager Automation checks Change Calendar before executing
API: GetCalendarState returns OPEN or CLOSED
Workflow: If CLOSED, skip execution or wait until OPEN
```

---

## Operational KPIs and Metrics

### Key Performance Indicators

**Availability:**
- Uptime percentage (99.9%, 99.99%, etc.)
- Mean Time Between Failures (MTBF)
- Mean Time To Recovery (MTTR)

**Performance:**
- Response time percentiles (p50, p90, p99)
- Throughput (requests per second)
- Error rate

**Operational Efficiency:**
- Deployment frequency
- Change success rate
- Incident count and trends
- Automation coverage percentage

### Service Level Objectives (SLOs)

**Example SLOs:**
```
Availability SLO: 99.9% uptime per month
  = 43 minutes of downtime allowed per month

Latency SLO: p99 response time < 500ms
  = 99% of requests complete in under 500ms

Error Rate SLO: < 0.1% errors
  = Less than 1 error per 1000 requests
```

**Error Budget:**
```
With 99.9% availability SLO:
- Error budget = 0.1% (43 minutes/month)
- Consume budget on: Incidents, deployments, planned maintenance
- When budget exhausted: Freeze non-critical changes, focus on reliability
```

---

## Cost Optimization for Observability

### CloudWatch Costs

**What drives costs:**
- Custom metrics ingestion ($0.30 per metric)
- High-resolution metrics (higher cost)
- Log data ingestion ($0.50/GB)
- Log storage ($0.03/GB/month)
- Vended logs (VPC Flow Logs, RDS, etc.)
- Dashboard views ($3/month per dashboard)
- Alarms ($0.10/alarm for standard, $0.30/alarm for high-resolution)

**Cost Optimization Strategies:**

1. **Metric Consolidation**
```
Instead of: 100 separate custom metrics
Use: 10 metrics with dimensions
Savings: 90% reduction in custom metric costs
```

2. **Log Retention**
```
Critical logs → 90-180 days
Application logs → 30 days
Debug logs → 7 days
After retention → Export to S3 (95% cheaper)
```

3. **Log Sampling**
```
Log 100% of errors
Log 1% of successful requests
Use structured logging to enable sampling
```

4. **Smart Alarming**
```
Don't create alarms for every metric
Focus on SLO violations and business impact
Use anomaly detection to reduce alarm count
```

### X-Ray Cost Optimization

**Pricing:**
- First 100,000 traces/month: Free
- After that: $5 per 1 million traces recorded
- $0.50 per 1 million traces retrieved/scanned

**Optimization:**
```
Default (5% + 1/second):
  At 1000 req/sec = ~180,000 traces/day = 5.4M/month = $26.50/month

Optimized (1% + 1/second):
  At 1000 req/sec = ~36,000 traces/day = 1.08M/month = $5.40/month

Sample 100% of errors, 1% of success = Better visibility, 80% cost reduction
```

---

## Exam Tips and Tricky Scenarios

### Common Exam Scenarios

**Scenario 1: High CloudWatch Costs**
```
Question: Company has 1000 EC2 instances, each publishing 50 custom metrics.
          CloudWatch costs are $15,000/month. How to reduce costs?

Options:
A) Switch to standard metrics only
B) Use metric dimensions instead of separate metrics
C) Reduce metric resolution
D) Export metrics to S3 and query with Athena

Answer: B - Use dimensions
Why: 1 metric with 1000 dimensions (InstanceId) is much cheaper than
     50,000 separate metrics. You maintain the same visibility with
     98% cost reduction.
```

**Scenario 2: Missing Data in Alarms**
```
Question: CloudWatch alarm for Lambda errors frequently goes to
          INSUFFICIENT_DATA state because function isn't invoked regularly.

Options:
A) Set "treat missing data as" to "not breaching"
B) Set "treat missing data as" to "breaching"
C) Set "treat missing data as" to "ignore"
D) Increase evaluation period

Answer: C - ignore
Why: For infrequently run functions, you want alarm to stay in current
     state (OK or ALARM) rather than flip to INSUFFICIENT_DATA. This
     prevents alert noise.
```

**Scenario 3: Distributed System Troubleshooting**
```
Question: Microservices application has occasional slow requests.
          Need to identify which service is causing delays.

Options:
A) Enable detailed CloudWatch metrics on all services
B) Implement X-Ray tracing
C) Increase CloudWatch Logs verbosity
D) Use VPC Flow Logs to track requests

Answer: B - X-Ray tracing
Why: X-Ray shows the end-to-end path of requests through services,
     identifying which component adds latency. Metrics and logs don't
     show request flow.
```

**Scenario 4: Automated Remediation**
```
Question: Need to automatically stop EC2 instances that have been
          idle (CPU < 5%) for 7 days.

Options:
A) CloudWatch alarm → SNS → Lambda (stop instance)
B) CloudWatch alarm → Systems Manager Automation
C) AWS Config rule → Lambda
D) Trusted Advisor → EventBridge → Lambda

Answer: B - Systems Manager Automation
Why: While A works, Systems Manager Automation is the AWS-managed
     solution for operational tasks. It provides better audit trail,
     built-in error handling, and approval workflows if needed.
```

**Scenario 5: Multi-Region Monitoring**
```
Question: Application runs in 5 regions. Need single dashboard
          showing metrics from all regions.

Options:
A) Create separate dashboards per region
B) Use CloudWatch cross-region dashboards
C) Export metrics to S3 and use QuickSight
D) Use third-party monitoring tool

Answer: B - Cross-region dashboards
Why: CloudWatch supports cross-region dashboards natively. You can
     add widgets from multiple regions to a single dashboard.
```

### Services You Might Confuse

**CloudWatch vs CloudTrail:**
- CloudWatch: Performance monitoring, metrics, logs, alarms
- CloudTrail: API call auditing, who did what when

**CloudWatch Logs vs CloudWatch Logs Insights:**
- Logs: Storage and streaming of log data
- Logs Insights: Query and analyze stored logs

**CloudWatch Events vs EventBridge:**
- Events: Legacy service (still works)
- EventBridge: Modern service with more features (SaaS integration, schemas)
- Use EventBridge for new implementations

**Systems Manager Run Command vs Automation:**
- Run Command: Execute single command/script
- Automation: Multi-step workflows with conditional logic

**Parameter Store vs Secrets Manager:**
- Parameter Store: Configuration, simple secrets, free tier available
- Secrets Manager: Automatic rotation, RDS integration, higher cost

---

## Hands-On Labs

### Lab 1: Comprehensive Monitoring Setup

**Objective:** Set up observability for a web application

**Steps:**
1. Deploy simple web app on EC2/ECS
2. Install CloudWatch agent for custom metrics
3. Configure log shipping to CloudWatch Logs
4. Create CloudWatch dashboard with key metrics
5. Set up alarms for error rate and latency
6. Configure X-Ray tracing
7. Create composite alarm for system health
8. Test alarm by triggering thresholds

### Lab 2: Automated Remediation

**Objective:** Implement self-healing architecture

**Steps:**
1. Create CloudWatch alarm for high CPU (>80%)
2. Create SNS topic for notifications
3. Create Systems Manager Automation document:
   - Create EBS snapshot
   - Change instance type to larger size
   - Verify health check
   - Send notification
4. Create EventBridge rule: Alarm → Automation
5. Test by generating CPU load
6. Verify automatic remediation

### Lab 3: Centralized Logging

**Objective:** Aggregate logs from multiple sources

**Steps:**
1. Configure CloudWatch agent on EC2 instances
2. Enable Lambda function logging to CloudWatch
3. Enable VPC Flow Logs
4. Enable RDS query logs
5. Create CloudWatch Logs Insights queries for:
   - Error analysis across all services
   - Slow query identification
   - Security event correlation
6. Create metric filters for key patterns
7. Set up log archival to S3 after 30 days

### Lab 4: X-Ray Implementation

**Objective:** Implement distributed tracing

**Steps:**
1. Deploy microservices application (API Gateway → Lambda → DynamoDB)
2. Enable X-Ray on API Gateway
3. Add X-Ray SDK to Lambda functions
4. Instrument DynamoDB calls
5. Generate test traffic
6. Analyze service map
7. Identify bottlenecks using trace analysis
8. Configure custom sampling rules
9. Create CloudWatch alarms based on X-Ray metrics

---

## Summary and Key Takeaways

### Must Know for Exam

1. **CloudWatch is central** - Understand metrics, logs, alarms, and dashboards deeply
2. **X-Ray sampling** - Know why and how to configure sampling rules
3. **Systems Manager** - Understand when to use each capability
4. **Automation vs Manual** - Know decision criteria for automated remediation
5. **Composite alarms** - Understand how to combine multiple conditions
6. **Cost optimization** - Use dimensions, appropriate retention, and sampling

### Common Mistakes to Avoid

- Over-alarming on low-impact metrics
- Not using dimensions (creating too many custom metrics)
- Storing all logs forever (expensive)
- Not sampling X-Ray data (expensive)
- Automating high-risk operations without approval gates
- Using CloudWatch Logs for long-term storage (use S3)

### Quick Decision Tree

```
Need to monitor performance? → CloudWatch Metrics
Need to troubleshoot issues? → CloudWatch Logs
Need to trace requests? → X-Ray
Need to automate operations? → Systems Manager
Need to respond to events? → EventBridge
Need to audit API calls? → CloudTrail
```

---

**Next:** [Task 3.2 - Security Improvements](./task-3.2-security-improvements.md)
