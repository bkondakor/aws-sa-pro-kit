# Task 3.4: Determine a Strategy to Improve Reliability

## Overview

Reliability in AWS is the ability of a workload to perform its intended function correctly and consistently when expected. This task focuses on improving system reliability through fault tolerance, resilience testing, automated failover, and designing for failure.

**Weight:** ~20% of Domain 3 (5% of total exam)

---

## Core Concepts

### Reliability Improvement Lifecycle

```
1. DESIGN → Build resilience into architecture
2. TEST → Validate failure scenarios (chaos engineering)
3. AUTOMATE → Implement automated recovery
4. MONITOR → Track reliability metrics (SLIs/SLOs)
5. IMPROVE → Iterate based on incidents and testing
```

### Key Reliability Principles

1. **Assume everything fails** - Design for failure
2. **Test failure recovery** - Regularly test failover mechanisms
3. **Automatically recover** - Self-healing systems
4. **Scale horizontally** - Increase availability through redundancy
5. **Stop guessing capacity** - Use Auto Scaling
6. **Manage change through automation** - IaC reduces human error

---

## High Availability Architecture Patterns

### Multi-AZ Deployment (Single Region)

**What it is:** Deploying resources across multiple Availability Zones in one region

**Benefits:**
- Protection against single AZ failures
- 99.99% availability SLA (vs 99.9% single AZ)
- Low latency between AZs (<2ms)
- No additional data transfer costs within region

**Implementation:**

```
Compute Layer:
- Auto Scaling groups spanning 2-3 AZs
- Minimum 2 instances per AZ for redundancy
- Distribute evenly across AZs

Load Balancing:
- ALB/NLB with cross-zone load balancing enabled
- Health checks on all targets
- Connection draining for graceful shutdown

Data Layer:
- RDS Multi-AZ (automatic failover, 60-120 seconds)
- Aurora with replicas in each AZ
- ElastiCache Redis cluster mode (multi-AZ)
- DynamoDB (automatically multi-AZ)

Storage:
- EFS (automatically multi-AZ)
- S3 (automatically multi-AZ)
- EBS snapshots to S3 (cross-AZ recovery)
```

**Best Practices:**

**1. Balanced Distribution**
```
Good: Equal instances across AZs
- us-east-1a: 3 instances
- us-east-1b: 3 instances
- us-east-1c: 3 instances

Bad: Unbalanced distribution
- us-east-1a: 7 instances
- us-east-1b: 1 instance
- us-east-1c: 1 instance
# If us-east-1a fails, 77% capacity lost
```

**2. AZ-Independent Components**
```
Anti-Pattern: Shared dependency in single AZ
[AZ-A: App Servers] → [AZ-B: Shared NAT Gateway] → Internet
# If AZ-B fails, AZ-A instances can't reach internet

Best Practice: Independent NAT Gateways
[AZ-A: App + NAT] → Internet
[AZ-B: App + NAT] → Internet
[AZ-C: App + NAT] → Internet
```

**3. AZ Affinity for Performance (2025 Pattern)**

**What it is:** Keep traffic within same AZ when possible to reduce latency and cost

```
Traditional Multi-AZ:
User in AZ-A → NLB → Routes to instance in AZ-B
- Cross-AZ latency: +1-2ms
- Cross-AZ data transfer: $0.01/GB

With AZ Affinity:
User in AZ-A → NLB (with AZ affinity) → Routes to instance in AZ-A
- Same-AZ latency: <1ms
- No data transfer charges

Configuration:
Enable "Availability Zone DNS affinity" on NLB
- Client DNS queries favor NLB IP in same AZ
- Falls back to other AZs if local unhealthy
```

**Trade-offs:**
- ✅ Lower latency (1-2ms improvement)
- ✅ Lower costs (save $0.01/GB)
- ⚠️ Uneven load distribution (acceptable for cost/performance)
- ⚠️ Still highly available (automatic failover)

---

### Multi-Region Deployment

**What it is:** Deploying resources across multiple AWS regions

**When to Use:**
- Disaster recovery (protect against regional failure)
- Geographic distribution (serve users globally with low latency)
- Compliance (data residency requirements)
- Extremely high availability (99.999%+)

**Trade-offs:**
- ✅ Highest availability
- ✅ Best global performance
- ⚠️ Significantly higher complexity
- ⚠️ Higher costs (data transfer, duplicate resources)
- ⚠️ Data consistency challenges

**Multi-Region Patterns:**

**1. Active-Passive (Backup & Restore)**
```
Primary Region (us-east-1):
- All traffic
- Regular backups to S3

Secondary Region (us-west-2):
- Dormant resources
- Snapshots/backups replicated

Recovery:
- Manually provision resources from backups
- Update DNS to point to secondary region

RTO: Hours to days
RPO: Minutes to hours
Cost: Lowest (only storage costs in secondary)
Use for: Non-critical workloads, cost-sensitive
```

**2. Active-Passive (Pilot Light)**
```
Primary Region (us-east-1):
- All traffic
- Full infrastructure

Secondary Region (us-west-2):
- Core infrastructure running (database, etc.)
- Application servers dormant
- Continuous data replication

Recovery:
- Scale up application servers
- Update DNS to point to secondary

RTO: Minutes to hours
RPO: Seconds to minutes
Cost: Medium (some resources always running)
Use for: Important workloads with moderate RTO
```

**3. Active-Passive (Warm Standby)**
```
Primary Region (us-east-1):
- 100% traffic
- Full infrastructure at full capacity

Secondary Region (us-west-2):
- Minimal capacity (10-30% of primary)
- All infrastructure running
- Real-time data replication

Recovery:
- Scale up secondary to full capacity
- Update DNS (or use Route 53 health check failover)

RTO: Minutes
RPO: Seconds (near-zero with real-time replication)
Cost: High (duplicate infrastructure, partial capacity)
Use for: Critical workloads
```

**4. Active-Active (Hot Standby)**
```
Primary Region (us-east-1):
- 50% traffic
- Full infrastructure

Secondary Region (us-west-2):
- 50% traffic
- Full infrastructure
- Bi-directional data replication

Recovery:
- Automatic (Route 53 health checks)
- Surviving region handles 100% traffic

RTO: Seconds (automatic failover)
RPO: Near-zero (real-time bi-directional replication)
Cost: Highest (full duplicate infrastructure)
Use for: Mission-critical, zero-downtime requirements
```

### Multi-Region Data Replication

**RDS/Aurora Cross-Region Read Replicas:**
```
Primary: us-east-1 (writes)
Replica: eu-west-1 (reads + DR)

Replication lag: Typically 1-5 seconds (asynchronous)

Promotion:
- Manual promotion to standalone database
- RTO: 15-30 minutes
- RPO: Seconds (any un-replicated transactions lost)
```

**Aurora Global Database:**
```
Primary Region: us-east-1
Secondary Regions: eu-west-1, ap-southeast-1

Features:
- <1 second cross-region replication lag
- Up to 5 secondary regions
- Up to 16 read replicas per secondary
- Fast promotion (<1 minute RTO)

Use for:
- Global applications
- Disaster recovery
- Low-latency global reads
```

**DynamoDB Global Tables:**
```
Regions: us-east-1, eu-west-1, ap-southeast-1

Features:
- Multi-master (writes in any region)
- <1 second replication lag
- Automatic conflict resolution (last writer wins)
- Active-active by design

Use for:
- Globally distributed applications
- Multi-region writes required
- Low-latency global access
```

**S3 Cross-Region Replication (CRR):**
```
Source: us-east-1 bucket
Destination: eu-west-1 bucket

Features:
- Asynchronous replication
- 15-minute SLA (99.99% of objects)
- Can replicate to multiple destinations
- Optional: Delete marker replication
- Optional: Replica modification sync

Use for:
- Disaster recovery
- Compliance (data residency)
- Lower latency access
```

---

## Automated Failover Mechanisms

### Amazon Route 53 Health Checks and Failover

**Health Check Types:**

**1. Endpoint Health Checks**
```
Monitor specific endpoint (IP or domain)
- Protocol: HTTP, HTTPS, TCP
- Port: Custom or standard
- Path: /health (for HTTP/HTTPS)
- Interval: 30s (standard) or 10s (fast)
- Failure threshold: 3 consecutive failures

Example:
- URL: https://api.example.com/health
- Expected: HTTP 200
- Check interval: 30 seconds
- Mark unhealthy after 3 failures (90 seconds)
```

**2. Calculated Health Checks**
```
Combines multiple health checks with logic
- Monitor 10 web servers
- Healthy if at least 7/10 are healthy
- Allows for partial failures

Use case:
- Distributed systems
- Want failover only if majority fails
```

**3. CloudWatch Alarm Health Checks**
```
Monitor CloudWatch metric/alarm
- Custom application metrics
- Complex health logic
- Integration with application monitoring

Example:
- Monitor custom metric: ActiveSessions
- Unhealthy if ActiveSessions < 10 (no traffic getting through)
```

**Failover Policies:**

**1. Simple Failover (Active-Passive)**
```
Primary: us-east-1 (primary record)
Secondary: us-west-2 (secondary record)

Route 53 behavior:
- Route to primary if health check passes
- Route to secondary if primary fails
- Automatically switch back when primary recovers

DNS TTL: 60 seconds (recommended for fast failover)
```

**2. Weighted Failover**
```
Primary: us-east-1 (weight: 70)
Secondary: us-west-2 (weight: 30)

Use for:
- Testing secondary region with small traffic
- Gradual migration
- Load distribution across regions
```

**3. Latency-Based Routing with Health Checks**
```
Regions: us-east-1, eu-west-1, ap-southeast-1
Health checks: All regions

Route 53 behavior:
- Route to lowest latency healthy region
- Automatically excludes unhealthy regions
- Best user experience + high availability
```

**4. Geoproximity Routing**
```
Bias traffic toward specific regions
- Route EU users → eu-west-1
- Route US users → us-east-1
- With health check failover

If eu-west-1 unhealthy:
- EU users → us-east-1 (automatic failover)
```

### RDS Multi-AZ Automatic Failover

**How it Works:**
```
Primary: AZ-A (handles all traffic)
Standby: AZ-B (synchronous replication)

Failure Detection:
- Continuous health monitoring
- Detects: Instance failure, AZ failure, network issues

Failover Process (60-120 seconds):
1. Detect primary failure
2. Promote standby to primary
3. Update DNS (CNAME record)
4. Applications reconnect automatically (same endpoint)
```

**Failover Triggers:**
- Loss of primary AZ
- Primary instance failure
- Storage failure
- Manual failover (for testing)
- Patching/maintenance

**Best Practices:**
```
Connection Handling:
- Set connection timeouts appropriately
- Implement retry logic with exponential backoff
- Use connection pooling (RDS Proxy)

Example (Python):
import time
from retrying import retry

@retry(wait_exponential_multiplier=1000, wait_exponential_max=10000, stop_max_attempt_number=5)
def connect_to_db():
    return psycopg2.connect(host=db_endpoint, ...)

# Automatically retries on connection failure with backoff
```

### Aurora Automatic Failover

**Faster than RDS Multi-AZ:**
- RDS: 60-120 seconds
- Aurora: 30-60 seconds (typically <30s)

**Why Faster?**
- Shared storage cluster (no storage replication needed)
- Multiple read replicas can become primary
- Faster detection and promotion

**Replica Priority:**
```
Set tier priorities (0-15, lower = higher priority)

aurora-instance-1: tier 0 (promote first)
aurora-instance-2: tier 1 (promote second)
aurora-instance-3: tier 10 (promote last)

Use for:
- Control which instance becomes primary
- Larger instances higher priority
- Same-AZ instance as original primary
```

### Auto Scaling for Resilience

**EC2 Auto Scaling:**

**Health Check Types:**
```
1. EC2 Status Checks:
   - Instance reachability
   - System reachability

2. ELB Health Checks:
   - Application-level health
   - Custom health endpoints
   - Recommended: More accurate than EC2 checks

3. Custom Health Checks:
   - Your application publishes health status
   - Most accurate but requires implementation
```

**Health Check Grace Period:**
```
Default: 300 seconds

Purpose: Allow instances to initialize before health checking

Too Short:
- Instances terminated before fully started
- Continuous termination/launch cycle

Too Long:
- Unhealthy instances serve traffic longer
- Slower recovery

Best Practice:
- Set to application startup time + buffer
- Typical: 180-600 seconds
```

**Replacement Strategy:**
```
Instance fails health check:
1. Auto Scaling marks instance unhealthy
2. Launches replacement instance
3. Waits for new instance to pass health checks
4. Terminates unhealthy instance

Result: Capacity maintained during failure
```

**Multi-AZ Configuration:**
```
Desired: 6 instances
AZs: us-east-1a, us-east-1b, us-east-1c

Distribution:
- us-east-1a: 2 instances
- us-east-1b: 2 instances
- us-east-1c: 2 instances

If us-east-1a fails:
- Auto Scaling detects 2 instances unhealthy
- Launches 2 new instances in us-east-1b and us-east-1c
- Final: 0 + 3 + 3 = 6 instances (capacity maintained)
```

---

## Chaos Engineering with AWS Fault Injection Simulator (FIS)

**What it is:** Managed service for controlled chaos engineering experiments

### AWS FIS Capabilities (2025)

**Supported Actions:**

**EC2:**
- Stop instances
- Terminate instances
- Reboot instances
- CPU stress
- Memory stress
- I/O stress

**ECS:**
- Stop tasks
- Drain container instances

**EKS:**
- Terminate pods
- Pod CPU/memory stress
- Pod network latency

**RDS:**
- Failover database
- Reboot instances

**Network:**
- Add latency to traffic
- Drop packets
- Blackhole routes

**EBS:**
- Pause I/O operations
- Increase I/O latency

**AZ Availability (NEW 2025):**
- Simulate power interruption in entire AZ
- Tests cross-AZ failover
- Validates truly resilient multi-AZ architectures

### FIS Experiment Template

```json
{
  "description": "Test application resilience to EC2 instance failure",
  "targets": {
    "webServers": {
      "resourceType": "aws:ec2:instance",
      "selectionMode": "COUNT(2)",
      "resourceTags": {
        "Environment": "Production",
        "Tier": "Web"
      }
    }
  },
  "actions": {
    "terminateInstances": {
      "actionId": "aws:ec2:terminate-instances",
      "parameters": {},
      "targets": {
        "Instances": "webServers"
      }
    }
  },
  "stopConditions": [
    {
      "source": "aws:cloudwatch:alarm",
      "value": "arn:aws:cloudwatch:us-east-1:123456789012:alarm:HighErrorRate"
    }
  ],
  "roleArn": "arn:aws:iam::123456789012:role/FISRole"
}
```

**Key Components:**

**1. Targets:**
- Define resources to impact
- Selection modes: ALL, COUNT(n), PERCENT(n)
- Filter by tags, attributes, resource IDs

**2. Actions:**
- What failure to inject
- Parameters (duration, intensity, etc.)
- Sequencing (parallel or serial)

**3. Stop Conditions:**
- CloudWatch alarms that halt experiment
- Safety mechanism to prevent outages
- Required for production experiments

**Example: Multi-Layer Chaos Test**
```
Experiment: "Application Resilience Test"

Action 1 (Parallel): Terminate 25% of web tier instances
Action 2 (Parallel): Add 100ms network latency to database
Action 3 (After 5 min): Failover RDS database

Stop Conditions:
- HTTP 5xx error rate > 5%
- Response time p99 > 5 seconds
- Available capacity < 50%

Expected Outcome:
- Application remains available
- Auto Scaling replaces instances
- Database failover completes successfully
- No errors beyond normal thresholds
```

### Chaos Engineering Best Practices

**1. Start Small**
```
Phase 1: Non-production environment
- Test basic failures (instance termination)
- Validate automation works
- Build confidence

Phase 2: Production with limits
- Small percentage of resources (5-10%)
- Off-peak hours
- Strong stop conditions

Phase 3: Regular game days
- Realistic scenarios
- Full team participation
- During business hours (ultimate test)
```

**2. Define Steady State**
```
Before experiment, define normal:
- Error rate: <0.1%
- Latency p99: <500ms
- Throughput: >1000 req/s
- All instances healthy

During experiment, verify:
- Metrics stay within acceptable bounds
- System recovers automatically
- No manual intervention needed
```

**3. Automate Recovery Testing**
```
Don't just test failure, test recovery:

Experiment:
1. Terminate database primary
2. Verify failover completes
3. Check application recovers
4. Validate data consistency
5. Ensure monitoring shows recovery
6. Test failback to original primary

Automation:
- Run weekly/monthly
- Alert on failures
- Track recovery time trends
```

**4. Document and Improve**
```
After each experiment:
1. What failed?
2. What worked?
3. What surprised us?
4. What will we fix?
5. When will we fix it?
6. When will we retest?

Build resilience iteratively
```

---

## Resilience Metrics and SLOs

### Service Level Indicators (SLIs)

**Common SLIs:**
```
Availability:
- Uptime percentage
- Successful requests / Total requests

Latency:
- p50, p90, p95, p99 response time
- Time to first byte

Throughput:
- Requests per second
- Transactions per minute

Error Rate:
- Errors / Total requests
- 4xx, 5xx errors separately
```

### Service Level Objectives (SLOs)

**Setting SLOs:**
```
Example SLOs for Web Application:

Availability SLO:
- 99.95% of requests return 2xx/3xx (not 5xx)
- Measurement: Per-minute success rate
- Window: Rolling 30 days

Latency SLO:
- p99 latency < 500ms
- Measurement: Request duration
- Window: Rolling 7 days

Error Budget:
- With 99.95% SLO, error budget = 0.05%
- In 30 days (43,200 minutes): 21.6 minutes of downtime allowed
- Or 0.05% of requests can fail
```

**Error Budget Policy:**
```
Error Budget > 50% remaining:
- Aggressive feature deployment
- Focus on velocity

Error Budget < 50%:
- Slow down deployments
- Focus on reliability improvements

Error Budget exhausted:
- Feature freeze
- Only reliability work
- Until budget replenished
```

### Tracking and Monitoring

**CloudWatch Dashboards:**
```
Reliability Dashboard:

[Availability]
- Success rate (last hour, day, week)
- Current error rate
- Error budget consumption

[Latency]
- p50, p90, p99 latency trends
- Latency by endpoint/region

[Incidents]
- Open incidents count
- MTTR (Mean Time To Recovery)
- Incident trends

[Capacity]
- Current utilization
- Scaling events
- Throttling/queue depth
```

**Automated SLO Tracking:**
```
CloudWatch Logs Insights query (hourly):

# Calculate success rate
fields @timestamp
| filter ispresent(status_code)
| stats
    count() as total_requests,
    sum(status_code < 400) as successful_requests
| fields (successful_requests / total_requests * 100) as success_rate

# Alert if below SLO
# Success rate < 99.95% → Page on-call
```

---

## Backup and Restore Strategies

### AWS Backup - Centralized Backup Management

**What it is:** Fully managed backup service supporting 20+ AWS services

**Supported Services:**
- EC2 (EBS volumes)
- RDS/Aurora
- DynamoDB
- EFS
- FSx
- S3
- Storage Gateway
- DocumentDB
- Neptune
- And more

**Backup Plans:**
```
Production Backup Plan:

Resources:
- Tag: Environment=Production

Schedule:
- Daily backup at 2 AM UTC
- Weekly full backup on Sunday
- Monthly backup on 1st

Retention:
- Daily: 7 days
- Weekly: 4 weeks
- Monthly: 12 months

Lifecycle:
- Move to cold storage after 30 days
- Delete after retention period

Cross-Region Copy:
- Copy to us-west-2 (DR)
- Retain for same period
```

**Backup Vault Lock (Compliance):**
```
Enforce retention policies:
- Immutable backups (WORM - Write Once Read Many)
- Minimum retention (can't delete before time)
- Maximum retention (delete after time)

Use for:
- Regulatory compliance
- Ransomware protection
- Legal hold
```

### RDS Automated Backups

**Configuration:**
```
Retention Period: 1-35 days (default: 7)
Backup Window: 30-minute window during low-traffic period
Backup Type: Full daily snapshot + transaction logs

Point-in-Time Recovery (PITR):
- Restore to any second within retention period
- Creates new database instance
- Useful for: Accidental deletes, data corruption
```

**Manual Snapshots:**
```
When to use:
- Before major changes
- Long-term retention (>35 days)
- Compliance/archival requirements

Characteristics:
- Never automatically deleted
- Can be copied to other regions
- Can be shared with other accounts
- Can be encrypted independently
```

### DynamoDB Backups

**On-Demand Backups:**
```
- Full table backup
- No performance impact
- Consistent backup (instant snapshot)
- Retained until explicitly deleted
- Can restore to any region
```

**Point-in-Time Recovery (PITR):**
```
- Continuous backups
- 35-day retention
- Restore to any second within window
- Enables compliance requirements
- Small additional cost (~$0.20 per GB/month)

Enable for:
- Critical tables
- Regulatory requirements
- Protection against accidental deletes/updates
```

---

## Exam Scenarios

### Scenario 1: Multi-AZ Failover

```
Question: RDS Multi-AZ database failover takes 2 minutes.
          Application times out after 30 seconds and shows errors.
          How to improve resilience?

Options:
A) Increase application timeout to 5 minutes
B) Implement retry logic with exponential backoff
C) Switch to Aurora for faster failover
D) Deploy application in multiple regions

Answer: B - Implement retry logic
Why:
- Failover is unavoidable (60-120s for RDS)
- Application should retry connections automatically
- Exponential backoff prevents overwhelming database
- Users experience brief delay, not errors
- C (Aurora) helps (30s failover) but doesn't solve root cause
```

### Scenario 2: Cross-Region DR

```
Question: Application must survive complete regional failure.
          RTO requirement: 15 minutes. RPO requirement: 1 hour.
          Current: Single region deployment.

Options:
A) Active-Active multi-region with Aurora Global Database
B) Warm standby with Aurora cross-region read replica
C) Pilot light with hourly S3 backups
D) Backup and restore with daily RDS snapshots

Answer: B - Warm standby
Why:
- RTO 15 min: Need infrastructure ready (eliminates C, D)
- RPO 1 hour: Acceptable to lose 1 hour of data
- Aurora replica: <1s replication lag (meets RPO)
- Promotion: <15 min (meets RTO)
- A: Overkill and expensive for requirements
```

### Scenario 3: Chaos Engineering

```
Question: Need to test application resilience to AZ failure.
          Must ensure test doesn't cause actual outage.

Options:
A) Manually shut down all instances in one AZ
B) Use FIS with stop condition CloudWatch alarm on errors
C) Test in development environment only
D) Disable one AZ in load balancer configuration

Answer: B - Use FIS with stop conditions
Why:
- FIS provides controlled, repeatable testing
- Stop conditions prevent actual outages
- Tests production environment (where it matters)
- Automated and auditable
- A: Too risky, no automatic safeguards
- C: Dev doesn't match production
- D: Doesn't test actual AZ failure
```

### Scenario 4: Auto Scaling Resilience

```
Question: Auto Scaling group has 6 instances across 3 AZs.
          One AZ fails. Application experiences errors.
          Why?

Scenario Details:
- Desired: 6, Min: 6, Max: 6
- Health check grace period: 300s
- Scaling policy: None

Options:
A) Max capacity too low, can't scale beyond 6
B) Health check grace period too long
C) No scaling policy configured
D) Should use target tracking

Answer: A - Max capacity too low
Why:
- AZ fails: 2 instances lost (4 remaining)
- Auto Scaling wants to launch 2 replacements
- But Max: 6, current: 4, can launch 2 more ✓
- Wait... this should work!

Actually: The issue is the question is tricky!
The real answer: If Max=6 and 2 instances fail, ASG will launch
2 new instances. Errors during grace period (300s).

Better answer: B - Grace period too long
During 300s grace period, unhealthy instances serve traffic causing errors.
```

### Scenario 5: Route 53 Failover

```
Question: Multi-region active-passive setup. Primary region fails.
          DNS failover takes 3 minutes. Users still directed to
          failed primary. Why?

Options:
A) Health check interval too long
B) DNS TTL too high
C) Not enough health check regions
D) Need calculated health check

Answer: B - DNS TTL too high
Why:
- Health check detects failure in <1 minute (standard: 30s × 3)
- Route 53 updates immediately
- But clients cache DNS for TTL duration
- If TTL=300s (5 min), clients use cached value for 5 min
- Solution: TTL=60s for fast failover
```

---

## Advanced Resilience Patterns

### Circuit Breaker Pattern

**What it is:** Prevents cascading failures by stopping requests to failing service

```
States:

CLOSED (Normal):
- All requests pass through
- Track failures
- If failures > threshold → OPEN

OPEN (Failing):
- All requests fail fast
- Don't call failing service
- After timeout → HALF_OPEN

HALF_OPEN (Testing):
- Limited requests pass through
- If successful → CLOSED
- If failure → OPEN
```

**Implementation (Application Level):**
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failures = 0
        self.last_failure_time = None
        self.state = "CLOSED"

    def call(self, func, *args, **kwargs):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "HALF_OPEN"
            else:
                raise Exception("Circuit breaker is OPEN")

        try:
            result = func(*args, **kwargs)
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise

    def on_success(self):
        self.failures = 0
        self.state = "CLOSED"

    def on_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.failure_threshold:
            self.state = "OPEN"

# Usage
breaker = CircuitBreaker(failure_threshold=5, timeout=60)

def call_external_api():
    return breaker.call(requests.get, "https://api.example.com/data")
```

### Bulkhead Pattern

**What it is:** Isolate resources to prevent cascading failures

```
Without Bulkhead:
Shared connection pool (100 connections):
- Critical API: Uses all 100 connections if slow
- Other APIs: Starve, can't get connections
- Entire application fails

With Bulkhead:
Separate connection pools:
- Critical API: 40 connections (dedicated)
- Reporting API: 30 connections
- Admin API: 20 connections
- Default: 10 connections

If one API saturates connections, others unaffected
```

**AWS Implementation:**
```
Separate Auto Scaling Groups:
- Critical service: ASG-Critical
- Background jobs: ASG-Background

Benefits:
- Critical service not impacted by background job spikes
- Can scale independently
- Different instance types/sizes
- Blast radius limited
```

### Graceful Degradation

**What it is:** Continue operating with reduced functionality when dependencies fail

```
E-commerce Site Example:

Full Functionality:
- Product browsing ✓
- Personalized recommendations ✓
- Reviews ✓
- Purchase ✓

Recommendation Service Fails:
- Product browsing ✓
- Personalized recommendations ✗ (Show popular instead)
- Reviews ✓
- Purchase ✓

Review Service Fails:
- Product browsing ✓
- Personalized recommendations ✓
- Reviews ✗ (Show placeholder)
- Purchase ✓

Payment Service Fails:
- Product browsing ✓
- Personalized recommendations ✓
- Reviews ✓
- Purchase ✗ (Queue orders, process later)
```

**Implementation:**
```python
def get_product_page(product_id):
    # Critical: Product details
    product = get_product_details(product_id)

    # Non-critical: Recommendations
    try:
        recommendations = get_recommendations(product_id, timeout=1)
    except:
        recommendations = get_popular_products()  # Fallback

    # Non-critical: Reviews
    try:
        reviews = get_reviews(product_id, timeout=1)
    except:
        reviews = []  # Degrade gracefully

    return render_template('product.html',
                          product=product,
                          recommendations=recommendations,
                          reviews=reviews)
```

---

## Summary and Key Takeaways

### Must Know for Exam

1. **Multi-AZ vs Multi-Region** - When to use each, RTO/RPO differences
2. **RDS/Aurora failover** - Timing, automatic vs manual, best practices
3. **Route 53 health checks** - Types, failover policies, DNS TTL impact
4. **AWS FIS** - Chaos engineering, stop conditions, supported actions
5. **Auto Scaling for resilience** - Health checks, multi-AZ distribution
6. **Backup strategies** - AWS Backup, RDS snapshots, PITR
7. **SLI/SLO/Error Budgets** - Reliability metrics and targets

### Decision Framework

```
High Availability Need:
├─ Same region? → Multi-AZ deployment
├─ Multiple regions?
  ├─ RTO: Hours → Backup & Restore
  ├─ RTO: Minutes → Pilot Light or Warm Standby
  ├─ RTO: Seconds → Active-Active
└─ Global users? → Multi-region with latency-based routing

Testing Resilience:
├─ Controlled experiment → AWS FIS with stop conditions
├─ Application failover → RDS manual failover
├─ Regional failover → Route 53 health check simulation
└─ Regular testing → Automated chaos engineering
```

### Common Mistakes

- Not testing failover regularly (it WILL fail when needed)
- DNS TTL too high (slow failover recovery)
- Auto Scaling max=desired (can't recover from failures)
- No health check grace period (instances terminated during startup)
- Single AZ dependencies (NAT gateway, database)
- Not implementing retry logic (applications fail during brief outages)
- Over-engineering DR (Backup & Restore often sufficient)

---

**Next:** [Task 3.5 - Cost Optimization](./task-3.5-cost-optimization.md)
