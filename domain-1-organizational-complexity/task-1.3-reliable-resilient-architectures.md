---
title: "Task 1.3: Design Reliable and Resilient Architectures"
domain: 1
domain_name: "Design Solutions for Organizational Complexity"
task: 1.3
weight: "26%"
exam_topics:
  - reliability
  - resilience
  - multi-region
  - disaster-recovery
  - route53
  - backup
  - rds
  - dynamodb-global-tables
  - s3-replication
status: complete
last_updated: "2025-11-18"
---

# Task 1.3: Design Reliable and Resilient Architectures

## Overview
Reliability and resilience are core principles of the AWS Well-Architected Framework. This task focuses on designing architectures that can withstand failures, recover quickly from disruptions, and maintain service availability through various failure scenarios.

---

## 1. Multi-Region Architectures

### Why Multi-Region?

**Use Cases:**
- **Disaster Recovery:** Protect against regional outages
- **Latency Optimization:** Serve users from nearest region
- **Data Residency:** Comply with data sovereignty requirements
- **High Availability:** 99.99%+ uptime requirements
- **Regional Capacity:** Avoid service limits in single region

**Challenges:**
- Data synchronization and consistency
- Increased complexity and operational overhead
- Cross-region data transfer costs
- Application state management
- Routing and failover logic

### Multi-Region Patterns

**1. Active-Passive (Warm Standby)**

**Architecture:**
```
Primary Region (Active)          Secondary Region (Passive)
     ↓                                   ↓
  Full capacity                      Reduced capacity
  Handles all traffic               Ready to scale up
  Data replication →                Receives replicated data
```

**Characteristics:**
- Primary region handles all traffic
- Secondary region has infrastructure deployed but at reduced capacity
- Regular data replication to secondary
- Failover triggered manually or automatically

**AWS Services Pattern:**
- **Route 53:** Failover routing policy with health checks
- **RDS:** Cross-region read replica, promote to master on failover
- **S3:** Cross-region replication (CRR)
- **DynamoDB:** Global tables or cross-region replication
- **EC2/ECS:** Auto Scaling Groups pre-deployed, scaled to minimum

**RTO/RPO:**
- RTO: Minutes to hours (depends on scaling time)
- RPO: Minutes (depends on replication lag)

**Failover Process:**
1. Route 53 health check fails for primary region
2. DNS routes traffic to secondary region
3. Secondary region Auto Scaling scales up to handle load
4. RDS read replica promoted to master (if needed)
5. Application state synchronized

**Cost Optimization:**
- Run minimum capacity in secondary region
- Use smaller instance types until failover
- Reserved Instances in primary, On-Demand in secondary

**2. Active-Active (Multi-Region Active)**

**Architecture:**
```
Region 1 (Active)              Region 2 (Active)
     ↓                              ↓
  Full capacity                 Full capacity
  Handles traffic               Handles traffic
  ↕ Data sync ↔                 ↕ Data sync
```

**Characteristics:**
- Both regions handle production traffic simultaneously
- Traffic distributed based on latency or geolocation
- Bi-directional data synchronization
- No failover needed (automatic load distribution)

**AWS Services Pattern:**
- **Route 53:** Latency-based or geoproximity routing
- **DynamoDB Global Tables:** Multi-region, multi-master
- **Aurora Global Database:** Primary in one region, up to 5 secondary regions (1-sec replication)
- **S3:** Cross-region replication with bi-directional sync
- **CloudFront:** Global content delivery

**RTO/RPO:**
- RTO: Near-zero (automatic routing)
- RPO: Seconds (DynamoDB Global Tables: sub-second)

**Data Consistency Challenges:**
- Use DynamoDB Global Tables for eventual consistency
- Aurora Global Database for read-heavy workloads
- Application-level conflict resolution for writes
- Consider CRDT (Conflict-free Replicated Data Types) patterns

**Cost Considerations:**
- Double infrastructure costs (both regions at full capacity)
- Cross-region data transfer: ~$0.02/GB
- Worth it for business-critical applications requiring highest availability

**3. Pilot Light**

**Architecture:**
```
Primary Region (Active)          Disaster Recovery Region
     ↓                                   ↓
  Full environment                  Minimal core components
  All traffic                       (DB replication only)
  Data replication →                Scaled from zero on DR
```

**Characteristics:**
- Minimal resources running in DR region
- Only critical data components replicated (databases)
- Compute resources brought up from AMIs/templates during failover
- Longer failover time but lower cost than warm standby

**Core Components in DR Region:**
- RDS read replica (running)
- S3 buckets with replicated data
- AMIs and launch templates ready
- CloudFormation/Terraform templates prepared

**RTO/RPO:**
- RTO: Hours (time to provision and configure resources)
- RPO: Minutes to hours (depends on replication frequency)

**Failover Process:**
1. Launch EC2 instances from AMIs
2. Update Auto Scaling Groups
3. Promote RDS read replica to master
4. Update Route 53 DNS to point to DR region
5. Test application functionality
6. Shift traffic via Route 53 weighted routing

**When to Use:**
- Cost-sensitive DR requirements
- Can tolerate hours of downtime
- Less critical applications
- Predictable recovery process

**4. Backup and Restore**

**Characteristics:**
- Lowest cost DR strategy
- Regular backups to S3 (cross-region)
- No infrastructure in DR region
- Longest recovery time

**Implementation:**
- Automated snapshots (RDS, EBS)
- AWS Backup for centralized backup management
- S3 Cross-Region Replication for data
- CloudFormation templates for infrastructure

**RTO/RPO:**
- RTO: 24 hours (time to restore from backups)
- RPO: Hours to days (backup frequency)

**When to Use:**
- Non-critical systems
- Can tolerate significant downtime
- Cost is primary concern
- Compliance requires backups regardless

---

## 2. Disaster Recovery Patterns

### Understanding RTO and RPO

**Recovery Time Objective (RTO):**
Time between disaster and full recovery of service.

**Recovery Point Objective (RPO):**
Maximum acceptable data loss measured in time.

**DR Strategy Selection:**

```
Cost →                                              ← Availability
Backup/Restore | Pilot Light | Warm Standby | Active-Active
(RTO: 24hr)    | (RTO: hours) | (RTO: minutes)| (RTO: near-0)
(RPO: hours)   | (RPO: mins)  | (RPO: mins)   | (RPO: seconds)
```

**Exam Tip:** Match DR strategy to business requirements (RTO/RPO) and cost constraints.

### AWS Services for DR

**AWS Backup**

**What it is:**
Centralized backup service for AWS resources across accounts and regions.

**Supported Services:**
- EBS volumes, EC2 instances (AMIs)
- RDS databases, Aurora clusters
- DynamoDB tables
- EFS, FSx file systems
- Storage Gateway volumes
- DocumentDB, Neptune

**Key Features:**
- Centralized backup policies
- Cross-region and cross-account backup
- Automated retention management
- Point-in-time recovery
- Backup compliance reporting
- Vault lock for immutable backups

**Backup Plans:**
- Schedule (hourly, daily, weekly, monthly)
- Lifecycle policies (move to cold storage, delete)
- Resource tags for automatic assignment
- Copy to different region/account

**Vault Lock:**
- Write-Once-Read-Many (WORM) protection
- Prevents deletion of backups (compliance)
- Configure minimum/maximum retention
- Test with compliance mode, enforce with governance mode

**AWS Elastic Disaster Recovery (DRS)**

**What it is:**
Formerly CloudEndure Disaster Recovery, provides low-cost DR for physical, virtual, and cloud servers.

**Key Features:**
- Continuous block-level replication
- Sub-second RPO
- Minutes RTO
- Automated failover and failback
- Supports on-premises to AWS DR

**How it Works:**
1. Install DRS agent on source servers
2. Continuous replication to AWS staging area (low-cost EBS)
3. On failover: Launch full-capacity instances from staging
4. After recovery: Failback to original or new environment

**When to Use:**
- Migrating on-premises disaster recovery to AWS
- Need sub-second RPO
- Physical or VMware server protection

**Cost:**
- Staging area: ~$3-5 per server/month
- Full-capacity instances only during failover/drills

### Multi-AZ vs Multi-Region

**Multi-AZ (High Availability within Region):**

**RDS Multi-AZ:**
- Synchronous replication to standby in different AZ
- Automatic failover (35-120 seconds)
- Same endpoint (DNS switch)
- No read traffic on standby
- Zero data loss (synchronous)

**Aurora Multi-AZ:**
- 6 copies across 3 AZs (default)
- Storage-level replication
- Automatic failover to read replica (typically <30 seconds)
- Read replicas can serve traffic

**ElastiCache Multi-AZ:**
- Redis: Automatic failover to replica
- Memcached: No replication (use multiple nodes)

**Multi-Region (Disaster Recovery):**
- Asynchronous replication (typically)
- Protects against regional outages
- Higher latency for data replication
- Requires application-level or Route 53 failover
- Some data loss possible (async replication lag)

**Exam Tip:** Multi-AZ protects against infrastructure failure; Multi-Region protects against regional disasters.

---

## 3. Service Quotas and Limits Management

### Understanding Service Quotas

**Types of Limits:**

**1. Hard Limits:**
- Cannot be increased (AWS platform constraints)
- Example: 5 VPCs per region (default), S3 bucket names globally unique

**2. Soft Limits (Service Quotas):**
- Can be increased via support request or Service Quotas console
- Example: EC2 instances per region, VPN connections per VGW

**3. API Rate Limits:**
- Throttling limits for API calls
- Example: KMS API calls (5,500-30,000/sec depending on operation)

**Critical Quotas for Exam:**

| Service | Default Quota | Impact |
|---------|---------------|--------|
| **EC2** | 5 VPCs per region | Network architecture |
| **EC2** | On-Demand instance limits | Scaling limitations |
| **S3** | 3,500 PUT/5,500 GET per prefix/sec | Performance bottlenecks |
| **RDS** | 40 DB instances | Database scaling |
| **Lambda** | 1,000 concurrent executions | Serverless capacity |
| **VPC** | 200 subnets per VPC | Network design |
| **Route 53** | 200 health checks per account | Monitoring limits |
| **API Gateway** | 10,000 requests/sec | API performance |
| **KMS** | API request quotas vary by operation | Encryption bottlenecks |

### Service Quotas Management

**AWS Service Quotas Dashboard:**
- View current quotas across all services
- Request quota increases
- CloudWatch alarms for quota utilization
- Track quota increase requests

**Best Practices:**

1. **Design with Quotas in Mind:**
   - Understand quotas before architecture design
   - Plan for scaling within quota limits
   - Request increases proactively (can take days)

2. **Monitor Quota Usage:**
   - CloudWatch metrics for service quotas
   - Alarms at 80% utilization
   - Automated alerts to operations team

3. **Quota Increase Strategies:**
   - Request increases before hitting limits
   - Justify business need in requests
   - Plan for multi-account if quotas can't be increased

4. **Work Around Hard Limits:**
   - S3: Use prefixes for performance (3,500 PUT/prefix/sec)
   - Lambda: Use reserved concurrency or multiple accounts
   - VPC: Use multiple VPCs or larger CIDR blocks

### Trusted Advisor Limit Checks

**Service Limits Category:**
- Checks usage against common service limits
- Available in Business/Enterprise Support plans
- Proactive alerts for approaching limits

**Checked Services:**
- EC2 On-Demand instances
- VPC resources (EIP, Security Groups)
- RDS DB instances
- EBS volumes and snapshots
- AutoScaling groups
- IAM resources

**Automation:**
- EventBridge integration for automated responses
- Lambda to request quota increases automatically
- SNS notifications to operations team

---

## 4. Circuit Breaker Patterns

### What is a Circuit Breaker?

**Concept:**
Prevent cascading failures by failing fast when downstream service is unavailable.

**States:**
1. **Closed:** Normal operation, requests flow through
2. **Open:** Failure threshold exceeded, fail fast without calling service
3. **Half-Open:** Test if service recovered, limited requests allowed

**Implementation in AWS:**

**API Gateway Circuit Breaker:**
- Use throttling limits
- Return cached responses when backend fails
- Integration timeout settings

**Application Load Balancer:**
- Connection draining (deregistration delay)
- Health checks determine instance availability
- Automatic removal of unhealthy targets

**Step Functions:**
- Retry logic with exponential backoff
- Catch blocks for error handling
- State machine retries

**Lambda + SQS:**
```
Request → Lambda → [Circuit Breaker Logic] → Downstream Service
               ↓ (on failure)
             Dead Letter Queue
```

**Implementation Example:**
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.state = "CLOSED"
        self.last_failure_time = None

    def call(self, func):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitBreakerOpenException()

        try:
            result = func()
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
            raise e
```

**AWS-Managed Circuit Breaking:**
- **Lambda:** Throttling and reserved concurrency
- **DynamoDB:** Adaptive capacity and auto-scaling
- **SQS:** Visibility timeout prevents duplicate processing

---

## 5. Graceful Degradation Strategies

### Core Principles

**Definition:**
System maintains partial functionality when components fail, rather than complete failure.

**Implementation Strategies:**

**1. Feature Toggling**
- Disable non-critical features during high load
- Use feature flags (AWS AppConfig, Parameter Store)
- Reduce resource consumption

**Example:**
```
Normal Load:
  - Full product recommendations ✓
  - Real-time analytics ✓
  - Social features ✓

High Load (Degraded):
  - Basic product recommendations ✓
  - Cached analytics ✓
  - Social features disabled ✗
```

**2. Static Content Fallback**
- Serve cached responses when backend fails
- CloudFront with origin failover
- S3 static fallback pages

**CloudFront Origin Failover:**
```
Primary Origin (ALB)
       ↓
   [Failure]
       ↓
Secondary Origin (S3 static content)
```

**3. Async Processing**
- Queue non-critical operations
- Process when resources available
- SQS for buffering

**Pattern:**
```
Critical Path:
  User Request → Lambda → DynamoDB → Response (fast)

Non-Critical (Degraded):
  User Request → Lambda → SQS → [Process Later]
  - Email notifications
  - Analytics updates
  - Recommendation engine updates
```

**4. Read-Only Mode**
- Allow reads when write path fails
- Useful for e-commerce browsing during checkout issues
- Database read replicas serve traffic

**5. Reduced Functionality**
- Basic search instead of advanced
- Simplified UI during high load
- Limit concurrent users

### AWS Services for Graceful Degradation

**AWS AppConfig**

**What it is:**
Feature flag and configuration management service.

**Use Cases:**
- Enable/disable features dynamically
- Gradual feature rollout
- Quick rollback of problematic changes
- Dark launches

**Deployment Strategies:**
- All-at-once
- Linear (10% every N minutes)
- Exponential
- Canary (small percentage first)

**Integration:**
- Lambda extensions
- ECS/EKS containers
- EC2 instances (AppConfig agent)

**Example Configuration:**
```json
{
  "features": {
    "recommendations": {
      "enabled": true,
      "degraded_mode": false
    },
    "social_features": {
      "enabled": false  // Disabled during high load
    },
    "analytics": {
      "real_time": false,
      "batch_only": true
    }
  }
}
```

**Amazon SQS for Buffering**

**Use Case:**
Decouple components and buffer requests during load spikes.

**Pattern:**
```
Traffic Spike → API Gateway → Lambda → SQS → Processing Lambda
                                              (Processes at controlled rate)
```

**Benefits:**
- Absorb traffic spikes
- Protect backend from overload
- Process at steady rate
- Dead letter queue for failed messages

**Configuration:**
- Message retention: Up to 14 days
- Visibility timeout: Time to process before re-delivery
- Dead letter queue: Messages failing after max retries
- FIFO vs Standard queues

**CloudFront with Custom Error Pages**

**Configuration:**
- Custom error responses for 4xx/5xx errors
- Serve static content from S3 when origin fails
- TTL for error caching

**Example:**
```
Origin returns 503 (Service Unavailable)
  ↓
CloudFront serves custom error page from S3
  ↓
"We're experiencing high traffic. Browse our catalog (cached)."
```

---

## 6. Health Checks and Monitoring

### Route 53 Health Checks

**Types:**

**1. Endpoint Health Checks**
- Monitor HTTP/HTTPS/TCP endpoints
- Every 10 or 30 seconds
- From multiple global locations
- String matching for content validation

**2. Calculated Health Checks**
- Combine multiple health checks (AND, OR, NOT logic)
- Monitor complex architectures
- Parent-child relationships

**3. CloudWatch Alarm Health Checks**
- Monitor CloudWatch alarms
- Custom metrics (database connections, queue depth)
- Application-specific health

**Health Check Configuration:**

**Critical Settings:**
- **Interval:** 10 or 30 seconds (10s = higher cost)
- **Failure Threshold:** Number of consecutive failures (default: 3)
- **Success Threshold:** Consecutive successes to recover (half-open state)
- **String Matching:** First 5120 bytes of response
- **Latency Measurements:** Measure latency to endpoints

**Health Check Locations:**
- Distributed globally (15+ locations)
- Must pass from >18% of locations (configurable)
- Prevents false positives from single location failure

**Integration with Routing:**
- Failover routing: Primary/secondary based on health
- Weighted routing: Remove unhealthy targets from rotation
- Latency routing: Route to healthy, lowest latency endpoint
- Multi-value answer: Return only healthy IPs

**Exam Scenario:**
"Design highly available multi-region application with automatic failover."

**Solution:**
```
Route 53 Hosted Zone
  ↓
Failover Routing Policy
  ↓
Primary: us-east-1 ALB (with health check)
Secondary: eu-west-1 ALB (with health check)
  ↓
Health checks monitor ALB endpoints every 30 seconds
  ↓
On failure: Automatic DNS failover to secondary (TTL-dependent)
```

### Application Load Balancer Health Checks

**Configuration:**
- **Protocol:** HTTP, HTTPS
- **Path:** /health, /api/health
- **Interval:** 5-300 seconds (default: 30)
- **Timeout:** 2-120 seconds (default: 5)
- **Healthy threshold:** 2-10 consecutive successes
- **Unhealthy threshold:** 2-10 consecutive failures

**Advanced Health Checks:**
- Custom response codes (200-299 configurable)
- String matching in response body
- gRPC health checks (for microservices)

**Target Health States:**
- **Initial:** Target registered, not yet checked
- **Healthy:** Passing health checks
- **Unhealthy:** Failing health checks
- **Unused:** No requests routed (weighted target group)
- **Draining:** Deregistration in progress

**Connection Draining:**
- Time for in-flight requests to complete (0-3600 seconds)
- Default: 300 seconds
- Prevents abrupt connection termination

### Auto Scaling Health Checks

**Health Check Types:**

**1. EC2 Status Checks**
- System status (AWS infrastructure)
- Instance status (OS, network)
- Does not check application health

**2. ELB Health Checks**
- Uses load balancer health check results
- More accurate for application health
- Recommended for production

**Configuration:**
```
Health Check Grace Period: 300 seconds (default)
  - Time for instance to boot and pass health checks
  - Prevents premature termination

Health Check Type: ELB or EC2
```

**Replacement Process:**
1. Instance fails health check
2. Marked unhealthy (after threshold)
3. Auto Scaling launches replacement
4. New instance passes health checks
5. Unhealthy instance terminated

---

## 7. Chaos Engineering and Fault Injection

### AWS Fault Injection Simulator (FIS)

**What it is:**
Managed service for running chaos engineering experiments on AWS.

**Supported Fault Injections:**
- EC2: Stop, reboot, terminate instances
- ECS: Stop tasks, drain container instances
- RDS: Reboot, failover
- EBS: Pause I/O operations
- Network: Add latency, packet loss
- API throttling and errors

**Experiment Templates:**

**1. AZ Failure Simulation**
```
Target: Auto Scaling Group
Action: Stop all instances in specific AZ
Duration: 15 minutes
Stop Condition: CloudWatch alarm (error rate >5%)
```

**2. Database Failover Test**
```
Target: RDS Multi-AZ instance
Action: Trigger failover
Expected: Application continues with brief interruption
Validation: Connection pool recovers, no errors
```

**3. Network Latency Injection**
```
Target: EC2 instances
Action: Add 250ms latency to all traffic
Duration: 10 minutes
Validate: Circuit breakers activate, fallbacks work
```

**Best Practices:**

1. **Start Small:** Single component, short duration
2. **Use Stop Conditions:** CloudWatch alarms to halt experiment
3. **Run in Non-Production First:** Validate experiment design
4. **Automate Validation:** Canary metrics, synthetic transactions
5. **Document Results:** Build runbooks from learnings
6. **Regular Testing:** Monthly or quarterly chaos days

**Safety Mechanisms:**
- IAM permissions for FIS actions
- Stop conditions (CloudWatch alarms)
- Rollback plans
- Target selection filters (tags, resource IDs)

---

## 8. Backup Strategies

### AWS Backup

**Backup Plans:**

**Components:**
- **Backup Rule:** Schedule and lifecycle
- **Resource Assignment:** By tags or resource IDs
- **Backup Vault:** Logical container for recovery points

**Lifecycle Policies:**
```
Example 1 (Cost-Optimized):
  Daily backups → 7 days retention
  Weekly backups → Move to cold storage after 30 days → 365 days retention
  Monthly backups → Move to cold storage after 90 days → 7 years retention

Example 2 (Compliance):
  Daily backups → 35 days retention, Vault Lock enabled
  Annual backups → 10 years retention, immutable
```

**Cross-Region Backup:**
- Automatic copy to different region
- Separate retention policies
- Disaster recovery protection

**Cross-Account Backup:**
- Copy backups to different AWS account
- Organizational backup policies
- Centralized backup management

### Point-in-Time Recovery (PITR)

**DynamoDB PITR:**
- Restore to any point in last 35 days
- Enabled per table
- No performance impact
- Incremental backups (cost-effective)

**RDS/Aurora PITR:**
- Restore to any point within backup retention period (1-35 days)
- Uses transaction logs
- Automated backups required
- Restore creates new instance

**S3 Versioning:**
- Keep multiple versions of objects
- Recover from accidental deletions
- MFA Delete for protection
- Lifecycle policies for old versions

---

## 9. Tricky Scenarios and Exam Tips

### Scenario 1: RTO/RPO Requirements

**Question:**
"Application requires 15-minute RTO and 5-minute RPO. Choose DR strategy."

**Analysis:**
- **Backup/Restore:** RTO 24hr ✗
- **Pilot Light:** RTO hours ✗
- **Warm Standby:** RTO minutes ✓, RPO minutes ✓
- **Active-Active:** RTO near-0 ✓, RPO seconds ✓

**Answer:** Warm Standby (cost-effective) or Active-Active (if budget allows)

**Implementation:**
- Multi-region deployment
- Cross-region read replica (promotes in <5 min)
- Auto Scaling in secondary region (min capacity running)
- Route 53 health checks with automatic failover

### Scenario 2: Service Quota Bottleneck

**Question:**
"Application hitting Lambda concurrency limits (1,000). Need 2,000 concurrent executions."

**Options:**
1. Request quota increase ✓ (preferred)
2. Use multiple AWS accounts ✓ (if increase denied)
3. Use EC2 instead ✓ (different architecture)
4. Optimize Lambda duration ✓ (reduce concurrent need)

**Best Answer:** Request quota increase (1) + optimize Lambda (4)

**Why:** Quota increases usually granted for legitimate use cases. Optimize to reduce total need.

### Scenario 3: Multi-Region Data Consistency

**Question:**
"Global application requires strong consistency across regions."

**Key Insight:**
- Multi-region async replication = eventual consistency
- Strong consistency across regions is very difficult
- CAP theorem: Choose 2 of Consistency, Availability, Partition Tolerance

**Solutions:**
1. **Accept Eventual Consistency:** DynamoDB Global Tables
2. **Single-Region Writes:** Route all writes to primary region (Aurora Global Database)
3. **Application-Level Conflict Resolution:** Last-write-wins, vector clocks
4. **Avoid Multi-Region Writes:** If strong consistency required

**Exam Answer:** Most scenarios accept eventual consistency for multi-region writes.

### Scenario 4: Circuit Breaker vs Retry

**Question:**
"Downstream service intermittently failing. Prevent cascading failures."

**Wrong Answer:** Aggressive retry with exponential backoff
- Problem: Overwhelms failing service further

**Correct Answer:** Circuit breaker with fail-fast
- Open circuit after threshold failures
- Return cached data or graceful degradation
- Test periodically if service recovered (half-open)

**Implementation:**
- API Gateway throttling
- Application-level circuit breaker library
- SQS for async processing (buffer requests)

### Scenario 5: Health Check False Positives

**Question:**
"Auto Scaling terminates instances that are actually healthy."

**Common Causes:**
1. Health check grace period too short (instance still booting)
2. Health check endpoint depends on slow external service
3. Health check threshold too aggressive
4. Application startup time not accounted for

**Solutions:**
- Increase grace period (e.g., 300 → 600 seconds)
- Lightweight health check endpoint (/health returns 200 immediately)
- Separate deep health check from basic liveness check
- Warm up instances before adding to load balancer

---

## 10. Hands-On Practice Labs

### Lab 1: Multi-Region Failover with Route 53
1. Deploy application in two regions (us-east-1, eu-west-1)
2. Create Route 53 health checks for each region
3. Configure failover routing policy
4. Simulate failure by stopping instances in primary region
5. Verify automatic failover to secondary region
6. Measure failover time (consider TTL)

### Lab 2: RDS Multi-AZ and Read Replica
1. Create RDS instance with Multi-AZ enabled
2. Create cross-region read replica
3. Trigger Multi-AZ failover (reboot with failover)
4. Promote read replica to master (simulate region failure)
5. Measure downtime for each scenario
6. Test application connection pool behavior

### Lab 3: AWS Backup Configuration
1. Create backup plan with daily and monthly retention
2. Assign resources by tags
3. Configure cross-region copy
4. Perform test restore
5. Implement Vault Lock for compliance
6. Validate backup restoration procedure

### Lab 4: Chaos Engineering with FIS
1. Create experiment template (stop instances in AZ)
2. Configure stop condition (CloudWatch alarm)
3. Run experiment in non-production
4. Monitor application behavior
5. Verify Auto Scaling recovers
6. Document lessons learned

### Lab 5: Circuit Breaker Implementation
1. Create Lambda function with external API dependency
2. Implement circuit breaker logic
3. Simulate external API failure (return errors)
4. Verify circuit opens after threshold
5. Test half-open state recovery
6. Monitor CloudWatch metrics

---

## 11. Key Takeaways

**Decision Trees:**

```
Disaster Recovery Strategy Selection:

RPO/RTO Requirements:
├─ RTO >24 hours, RPO >24 hours → Backup/Restore
├─ RTO hours, RPO hours → Pilot Light
├─ RTO minutes, RPO minutes → Warm Standby
└─ RTO seconds, RPO seconds → Active-Active

Multi-Region Pattern:
├─ Cost-sensitive, can tolerate downtime → Active-Passive
├─ Global users, low latency required → Active-Active (latency routing)
├─ DR only, infrequent access → Pilot Light
└─ Compliance backups → Backup/Restore with cross-region copy
```

**High Availability Checklist:**
- Multi-AZ for infrastructure resilience
- Multi-Region for disaster recovery
- Auto Scaling for capacity management
- Health checks at multiple layers (Route 53, ALB, application)
- Circuit breakers for cascading failure prevention
- Graceful degradation for partial functionality
- Regular DR testing (quarterly minimum)

**Service Quota Management:**
- Monitor quotas before hitting limits (CloudWatch)
- Request increases proactively
- Design with quotas in mind
- Use multiple accounts if quotas can't be increased

**Reliability Principles:**
- Assume everything fails (design for failure)
- Test failure scenarios (chaos engineering)
- Automate recovery (no manual intervention)
- Monitor everything (observability)
- Design for graceful degradation (not complete failure)

---

## 12. Common Exam Traps

**Trap 1:** Confusing Multi-AZ with Multi-Region
- **Multi-AZ:** High availability, infrastructure failure protection
- **Multi-Region:** Disaster recovery, regional outage protection

**Trap 2:** Over-engineering DR strategy
- **Example:** Active-Active for non-critical app with 24hr RTO requirement
- **Correct:** Match strategy to actual RTO/RPO needs

**Trap 3:** Forgetting DNS TTL in failover calculations
- **Reality:** Route 53 failover time = Health check failure detection + DNS TTL
- **Solution:** Lower TTL for critical applications (e.g., 60 seconds)

**Trap 4:** Assuming synchronous cross-region replication
- **Reality:** Most cross-region replication is asynchronous (eventual consistency)
- **Exception:** Aurora Global Database (1-second lag, but still async)

**Trap 5:** Not accounting for service quotas in design
- **Example:** Designing for 1M Lambda concurrent executions (default quota: 1,000)
- **Solution:** Check quotas early, request increases

**Trap 6:** Ignoring health check grace periods
- **Problem:** Auto Scaling terminates instances before application starts
- **Solution:** Configure appropriate grace period based on startup time

---

**Next Steps:**
- Study Task 1.4: Multi-Account AWS Environment
- Practice multi-region failover scenarios
- Review AWS Well-Architected Reliability Pillar
- Complete practice questions on DR patterns
