# Task 2.4: Design a Strategy to Meet Reliability Requirements

## Overview

Reliability ensures a workload performs its intended function correctly and consistently. This task focuses on Auto Scaling strategies, load balancing patterns, health checks, self-healing architectures, chaos engineering, and distributed system design principles.

**Exam Weight:** ~17% of Domain 2 (approximately 5% of total exam)

**Key Focus Areas:**
- Auto Scaling strategies and predictive scaling
- Load balancing patterns (ALB, NLB, GWLB)
- Health checks and monitoring
- Self-healing architectures
- Chaos engineering principles
- Distributed system design patterns
- Circuit breakers and retry logic
- Service quotas and limits management

---

## Auto Scaling Strategies

### EC2 Auto Scaling

**Core Components:**
1. **Launch Template/Configuration:** Instance configuration
2. **Auto Scaling Group (ASG):** Group of instances
3. **Scaling Policies:** When and how to scale
4. **Health Checks:** Determine instance health

---

### Scaling Policy Types

#### 1. Target Tracking Scaling (Recommended)

**Description:** Maintain a specific metric at target value (like thermostat).

**Characteristics:**
- Simplest to configure
- AWS automatically creates CloudWatch alarms
- Automatically adjusts capacity to maintain target
- Best for most use cases

**Common Target Metrics:**
- Average CPU Utilization
- Average Network In/Out
- ALB Request Count Per Target
- Custom CloudWatch metrics

**Configuration:**
```json
{
  "TargetTrackingConfiguration": {
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "TargetValue": 70.0
  }
}
```

**Custom Metric Example:**
```json
{
  "TargetTrackingConfiguration": {
    "CustomizedMetricSpecification": {
      "MetricName": "ActiveConnections",
      "Namespace": "MyApp",
      "Statistic": "Average"
    },
    "TargetValue": 1000.0
  }
}
```

**Best Practices:**
- Start with CPU utilization (70-80% is common)
- Use multiple target tracking policies (e.g., CPU + request count)
- Set reasonable target values (not too aggressive)
- Monitor and adjust based on actual workload patterns

---

#### 2. Step Scaling

**Description:** Add or remove capacity based on CloudWatch alarm thresholds.

**Characteristics:**
- More control than target tracking
- Define specific actions for different thresholds
- Can scale by fixed number or percentage
- Requires manual CloudWatch alarm configuration

**Configuration:**
```json
{
  "StepAdjustments": [
    {
      "MetricIntervalLowerBound": 0,
      "MetricIntervalUpperBound": 10,
      "ScalingAdjustment": 1
    },
    {
      "MetricIntervalLowerBound": 10,
      "MetricIntervalUpperBound": 20,
      "ScalingAdjustment": 2
    },
    {
      "MetricIntervalLowerBound": 20,
      "ScalingAdjustment": 3
    }
  ],
  "MetricAggregationType": "Average",
  "AdjustmentType": "ChangeInCapacity"
}
```

**Example Scenario:**
```
CPU 50-60%: Add 1 instance
CPU 60-70%: Add 2 instances
CPU 70%+:   Add 3 instances
```

**When to Use:**
- Need precise control over scaling increments
- Different responses for different severity levels
- Complex scaling requirements

---

#### 3. Scheduled Scaling

**Description:** Scale based on predictable time patterns.

**Characteristics:**
- Time-based scaling actions
- Good for known traffic patterns
- Proactive (not reactive)
- Works with other scaling policies

**Configuration:**
```json
{
  "ScheduledActionName": "BusinessHoursScaleUp",
  "StartTime": "2025-01-01T08:00:00Z",
  "Recurrence": "0 8 * * MON-FRI",
  "MinSize": 10,
  "MaxSize": 50,
  "DesiredCapacity": 20
}
```

**Common Patterns:**
- Business hours: Scale up at 8 AM, scale down at 6 PM
- Weekly batch: Scale up Sunday night for Monday processing
- Holiday traffic: Pre-scale for known high-traffic events
- Maintenance windows: Scale down during off-hours

**Best Practices:**
- Combine with target tracking for unexpected spikes
- Account for timezone and daylight saving time
- Set recurrence patterns carefully
- Test scheduled actions before production

---

#### 4. Predictive Scaling

**Description:** Machine learning forecasts traffic and scales proactively.

**Characteristics:**
- ML-based forecasting
- Analyzes historical patterns
- Proactive scaling before traffic arrives
- Works best with recurring patterns

**How It Works:**
1. Analyze historical CloudWatch data (14 days minimum)
2. Generate traffic forecasts for next 48 hours
3. Schedule scaling actions based on forecast
4. Update forecast daily

**Configuration:**
```json
{
  "PredictiveScalingConfiguration": {
    "MetricSpecifications": [{
      "TargetValue": 70.0,
      "PredefinedMetricPairSpecification": {
        "PredefinedMetricType": "ASGCPUUtilization"
      }
    }],
    "Mode": "ForecastAndScale",
    "SchedulingBufferTime": 600
  }
}
```

**Modes:**
- **ForecastOnly**: Generate forecast, don't scale (testing)
- **ForecastAndScale**: Scale based on forecast (production)

**When to Use:**
- Recurring daily/weekly traffic patterns
- Want to avoid cold start latency
- Can predict traffic with reasonable accuracy
- Cost of over-provisioning is acceptable vs latency

**Requirements:**
- At least 14 days of historical data
- Recurring patterns in traffic
- CloudWatch metrics available

---

### Auto Scaling Configuration Parameters

#### Cooldown Periods

**Description:** Time to wait before allowing another scaling activity.

**Purpose:**
- Prevent rapid scaling oscillations (thrashing)
- Allow time for instances to start and stabilize
- Give metrics time to reflect changes

**Default:** 300 seconds (5 minutes)

**Configuration:**
```json
{
  "DefaultCooldown": 300,
  "Cooldowns": {
    "ScaleOut": 180,
    "ScaleIn": 300
  }
}
```

**Best Practices:**
- **Scale-out cooldown**: Match instance startup time (typically shorter)
- **Scale-in cooldown**: Longer to avoid premature termination
- **Application warmup time**: Set cooldown ≥ warmup time
- **Complex applications**: Longer cooldowns (5-10 minutes)
- **Simple applications**: Shorter cooldowns (2-3 minutes)

**Cooldown vs Warmup:**
- **Cooldown**: Wait before next scaling action
- **Warmup**: Time for instance to contribute to metrics (doesn't count toward target)

---

#### Warm-up Time

**Description:** Time for instance to fully initialize before receiving full traffic.

**Purpose:**
- Don't count partially-ready instances in capacity calculations
- Avoid scaling out further while instances starting
- Ensure accurate metric aggregation

**Configuration:**
```json
{
  "DefaultInstanceWarmup": 300,
  "HealthCheckGracePeriod": 300
}
```

**Example:**
- Instance launches at time 0
- Warmup period: 300 seconds
- Until time 300: Instance metrics don't count toward target
- After time 300: Instance fully counted in capacity

---

#### Capacity Settings

**Configuration:**
```json
{
  "MinSize": 2,
  "MaxSize": 20,
  "DesiredCapacity": 4
}
```

**Parameters:**
- **MinSize**: Minimum instances (high availability baseline)
- **MaxSize**: Maximum instances (cost control, quota limits)
- **DesiredCapacity**: Target instance count

**Best Practices:**
- **MinSize**: At least 2 (preferably in different AZs)
- **MaxSize**: Set based on quotas and cost limits
- **Initial DesiredCapacity**: Based on expected baseline load
- **Multiple AZs**: Distribute evenly across AZs

---

### Health Checks

**Types:**

#### 1. EC2 Status Checks
- Default for ASG
- Checks: System reachability, instance status
- Frequency: Every minute (not configurable)
- Replace instance if status checks fail

#### 2. ELB Health Checks
- More comprehensive (application-level)
- Configurable endpoint, interval, thresholds
- Recommended for web applications
- Replace instance if marked unhealthy by ELB

**Configuration:**
```json
{
  "HealthCheckType": "ELB",
  "HealthCheckGracePeriod": 300
}
```

**Health Check Grace Period:**
- Time to wait after instance launch before checking health
- Should be ≥ application startup time
- Default: 300 seconds
- Prevents premature termination of starting instances

**ELB Health Check Configuration:**
```json
{
  "HealthCheck": {
    "Target": "HTTP:80/health",
    "Interval": 30,
    "Timeout": 5,
    "UnhealthyThreshold": 2,
    "HealthyThreshold": 10
  }
}
```

**Best Practices:**
- Use ELB health checks for application awareness
- Implement comprehensive health endpoints
- Check database connectivity, external dependencies
- Return 200 OK only when fully ready
- Set grace period ≥ startup time
- Balance sensitivity vs stability (thresholds)

---

### Termination Policies

**Determines which instance to terminate during scale-in.**

**Options:**

1. **Default**:
   - Oldest launch template/configuration
   - Instance closest to next billing hour
   - Random if multiple match

2. **OldestInstance**: Terminate oldest instance first

3. **NewestInstance**: Terminate newest instance first (testing)

4. **OldestLaunchConfiguration**: Prefer old launch configs (migrations)

5. **OldestLaunchTemplate**: Prefer old launch templates

6. **ClosestToNextInstanceHour**: Minimize wasted compute time

7. **AllocationStrategy**: For Spot instances

**Configuration:**
```json
{
  "TerminationPolicies": [
    "OldestLaunchTemplate",
    "ClosestToNextInstanceHour"
  ]
}
```

**Best Practices:**
- Use default for most cases
- OldestLaunchTemplate for rolling upgrades
- ClosestToNextInstanceHour for cost optimization
- Test termination policy impact

---

### Instance Protection

**Protect specific instances from scale-in termination.**

**Use Cases:**
- Long-running batch jobs
- Stateful instances
- Debugging/troubleshooting
- Temporary exemption from termination

**Configuration:**
```bash
# Enable protection
aws autoscaling set-instance-protection \
  --instance-ids i-1234567890abcdef0 \
  --auto-scaling-group-name my-asg \
  --protected-from-scale-in

# Disable protection
aws autoscaling set-instance-protection \
  --instance-ids i-1234567890abcdef0 \
  --auto-scaling-group-name my-asg \
  --no-protected-from-scale-in
```

---

### Lifecycle Hooks

**Pause scaling actions to perform custom actions.**

**Lifecycle Events:**
1. **Launching**: After instance launched, before in service
2. **Terminating**: After scale-in decision, before termination

**Use Cases:**

**Launch Hooks:**
- Install software from external repository
- Register with external systems
- Download configuration from S3
- Warm up caches
- Run initialization scripts

**Terminate Hooks:**
- Deregister from external systems
- Upload logs to S3
- Graceful shutdown
- Drain connections

**Architecture:**
```
Lifecycle Hook Triggered
  ↓
EventBridge Event
  ↓
Lambda Function
  ↓
Perform Custom Actions
  ↓
Complete Lifecycle Hook
  ↓
Continue Scaling Action
```

**Configuration:**
```json
{
  "LifecycleHookName": "launch-hook",
  "LifecycleTransition": "autoscaling:EC2_INSTANCE_LAUNCHING",
  "DefaultResult": "ABANDON",
  "HeartbeatTimeout": 3600,
  "NotificationTargetARN": "arn:aws:sns:region:account:topic"
}
```

**Lambda Example:**
```python
def lambda_handler(event, context):
    asg_name = event['detail']['AutoScalingGroupName']
    instance_id = event['detail']['EC2InstanceId']
    lifecycle_hook_name = event['detail']['LifecycleHookName']
    lifecycle_action_token = event['detail']['LifecycleActionToken']

    try:
        # Perform custom actions
        install_software(instance_id)
        warm_up_caches(instance_id)

        # Complete lifecycle action (CONTINUE)
        asg_client.complete_lifecycle_action(
            LifecycleHookName=lifecycle_hook_name,
            AutoScalingGroupName=asg_name,
            LifecycleActionToken=lifecycle_action_token,
            LifecycleActionResult='CONTINUE'
        )
    except Exception as e:
        # Abandon instance on failure
        asg_client.complete_lifecycle_action(
            LifecycleHookName=lifecycle_hook_name,
            AutoScalingGroupName=asg_name,
            LifecycleActionToken=lifecycle_action_token,
            LifecycleActionResult='ABANDON'
        )
```

---

### Scaling for Different Patterns

#### Steady State
- MinSize = DesiredCapacity = MaxSize
- No automatic scaling
- Manual capacity changes only
- Use case: Predictable, constant load

#### Gradual Growth
- Start with low capacity
- Target tracking with reasonable target
- Gradual scale-out as traffic grows
- Use case: New applications, uncertain growth

#### Spiky Traffic
- Higher MinSize for baseline
- Aggressive target tracking (e.g., 60% CPU)
- Predictive scaling if patterns exist
- Use case: E-commerce, news sites

#### Batch Processing
- Scheduled scaling for known patterns
- Scale up before batch starts
- Scale down after completion
- Use case: ETL jobs, report generation

---

## Load Balancing Patterns

### Application Load Balancer (ALB)

**Layer 7 (HTTP/HTTPS) Load Balancer**

**Key Features:**
- Content-based routing (path, host, headers, query strings)
- WebSocket and HTTP/2 support
- Native IPv6 support
- Lambda function targets
- Authentication (Cognito, OIDC)
- Request tracing (X-Amzn-Trace-Id header)
- Sticky sessions (cookies)
- SNI (multiple certificates)

**Routing Rules:**

**Path-Based:**
```json
{
  "Rules": [
    {
      "Priority": 1,
      "Conditions": [{"Field": "path-pattern", "Values": ["/api/*"]}],
      "Actions": [{"Type": "forward", "TargetGroupArn": "api-tg-arn"}]
    },
    {
      "Priority": 2,
      "Conditions": [{"Field": "path-pattern", "Values": ["/static/*"]}],
      "Actions": [{"Type": "forward", "TargetGroupArn": "static-tg-arn"}]
    }
  ]
}
```

**Host-Based:**
```json
{
  "Conditions": [
    {"Field": "host-header", "Values": ["api.example.com"]}
  ],
  "Actions": [{"Type": "forward", "TargetGroupArn": "api-tg-arn"}]
}
```

**Header-Based:**
```json
{
  "Conditions": [
    {"Field": "http-header", "HttpHeaderName": "User-Agent", "Values": ["*Mobile*"]}
  ],
  "Actions": [{"Type": "forward", "TargetGroupArn": "mobile-tg-arn"}]
}
```

**Weighted Target Groups (Blue/Green):**
```json
{
  "Actions": [{
    "Type": "forward",
    "ForwardConfig": {
      "TargetGroups": [
        {"TargetGroupArn": "blue-tg-arn", "Weight": 90},
        {"TargetGroupArn": "green-tg-arn", "Weight": 10}
      ]
    }
  }]
}
```

**Target Types:**
- **Instance**: EC2 instances
- **IP**: IP addresses (containers, on-premises)
- **Lambda**: Lambda functions

**Health Check Configuration:**
```json
{
  "HealthCheckEnabled": true,
  "HealthCheckProtocol": "HTTP",
  "HealthCheckPath": "/health",
  "HealthCheckIntervalSeconds": 30,
  "HealthCheckTimeoutSeconds": 5,
  "HealthyThresholdCount": 2,
  "UnhealthyThresholdCount": 2,
  "Matcher": {"HttpCode": "200-299"}
}
```

**When to Use ALB:**
- Web applications, REST APIs
- Microservices with path-based routing
- Need content-based routing
- WebSocket applications
- Lambda targets
- Authentication integration
- Multiple domains on single load balancer

---

### Network Load Balancer (NLB)

**Layer 4 (TCP/UDP/TLS) Load Balancer**

**Key Features:**
- Ultra-low latency (microseconds vs milliseconds)
- Extreme performance (millions of requests/sec)
- Static IP addresses / Elastic IPs
- Preserve source IP address
- TLS termination
- PrivateLink integration
- UDP support
- Zonal isolation

**Configuration:**
```json
{
  "Protocol": "TCP",
  "Port": 80,
  "DefaultActions": [{
    "Type": "forward",
    "TargetGroupArn": "target-group-arn"
  }]
}
```

**TLS Termination:**
```json
{
  "Protocol": "TLS",
  "Port": 443,
  "Certificates": [{
    "CertificateArn": "certificate-arn"
  }],
  "SslPolicy": "ELBSecurityPolicy-TLS-1-2-2017-01"
}
```

**Target Types:**
- **Instance**: EC2 instances
- **IP**: IP addresses (containers, on-premises)
- **ALB**: Chain NLB in front of ALB

**Preserve Source IP:**
- Target type IP: Source IP preserved automatically
- Target type instance: Configure proxy protocol

**When to Use NLB:**
- Extreme performance requirements (millions of req/sec)
- Need static IP addresses or Elastic IPs
- Non-HTTP protocols (TCP, UDP, TLS)
- PrivateLink for service exposure
- Ultra-low latency requirements (<1ms)
- Gaming servers, IoT devices
- VoIP, streaming protocols

---

### Gateway Load Balancer (GWLB)

**Layer 3 (IP) Gateway and Load Balancer**

**Purpose:**
- Deploy, scale, manage third-party virtual appliances
- Transparent to application traffic (bump-in-the-wire)
- Firewalls, IDS/IPS, DPI, packet inspection

**Architecture:**
```
Internet/VPC → GWLB Endpoint → GWLB → Target Group (Virtual Appliances)
                                           ↓
                                    Inspect Traffic
                                           ↓
                                    Return to GWLB
                                           ↓
                                  Forward to Destination
```

**Use Cases:**
- Next-gen firewalls (Palo Alto, Fortinet)
- Intrusion detection/prevention systems (IDS/IPS)
- Deep packet inspection (DPI)
- Network monitoring
- Traffic mirroring and analysis

**When to Use GWLB:**
- Need to inspect/modify traffic at Layer 3
- Third-party security appliances
- Centralized egress filtering
- Compliance requirements for traffic inspection

---

### Load Balancer Comparison

| Feature | ALB | NLB | GWLB |
|---------|-----|-----|------|
| **Layer** | 7 (HTTP/HTTPS) | 4 (TCP/UDP/TLS) | 3 (IP) |
| **Performance** | High (thousands/sec) | Extreme (millions/sec) | High |
| **Latency** | ms | μs | Low |
| **Static IP** | No | Yes (Elastic IP) | Yes |
| **Content Routing** | Yes | No | No |
| **WebSocket** | Yes | Yes | N/A |
| **Lambda Target** | Yes | No | No |
| **PrivateLink** | No | Yes | Yes |
| **TLS Termination** | Yes | Yes | No |
| **Preserve Source IP** | Via headers | Yes | Yes |
| **Use Case** | Web apps, APIs | High perf, static IP | Security appliances |

---

## Health Check Strategies

### Deep Health Checks

**Basic Health Check:**
```
GET /health
Return 200 OK
```

**Deep Health Check:**
```python
@app.route('/health')
def health_check():
    checks = {}

    # Database connectivity
    checks['database'] = check_database()

    # External API dependencies
    checks['payment_api'] = check_payment_api()
    checks['auth_service'] = check_auth_service()

    # Cache connectivity
    checks['redis'] = check_redis()

    # Disk space
    checks['disk'] = check_disk_space()

    # Memory
    checks['memory'] = check_memory()

    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503

    return jsonify(checks), status_code
```

**Considerations:**
- Balance thoroughness vs speed
- Health check should complete quickly (<5 seconds)
- Don't hammer dependencies
- Cache health check results
- Different endpoints for shallow vs deep checks

---

### Shallow vs Deep Health Checks

**Shallow (Liveness):**
- "Is the process running?"
- Fast (<1 second)
- Use for load balancer health checks
- Example: Return 200 if web server responding

**Deep (Readiness):**
- "Can the process handle traffic?"
- Slower (1-5 seconds)
- Check dependencies
- Use for startup checks, monitoring

**Best Practice: Two Endpoints**
```
/health/liveness  → Shallow (ALB uses this)
/health/readiness → Deep (monitoring, alerts)
```

---

## Self-Healing Architectures

### Auto-Remediation Patterns

#### Pattern 1: Automatic Instance Replacement
```
Unhealthy Instance Detected (ASG + ELB health checks)
  ↓
Auto Scaling Group terminates instance
  ↓
Launch new instance automatically
  ↓
New instance passes health checks
  ↓
Receives traffic
```

#### Pattern 2: EventBridge + Lambda Remediation
```
CloudWatch Alarm triggers (high error rate)
  ↓
EventBridge rule matches
  ↓
Lambda function executes remediation
  ↓
Actions: Restart service, clear cache, rotate credentials
  ↓
Monitor for recovery
```

**Lambda Remediation Example:**
```python
def lambda_handler(event, context):
    alarm = event['detail']

    if 'High-CPU' in alarm['alarmName']:
        # Scale out
        scale_asg(alarm['dimensions']['AutoScalingGroupName'], +2)

    elif 'High-Memory' in alarm['alarmName']:
        # Restart problematic instances
        restart_instances(get_high_memory_instances())

    elif 'API-Errors' in alarm['alarmName']:
        # Clear cache, restart app
        clear_redis_cache()
        restart_application_service()

    notify_team(alarm)
```

#### Pattern 3: Systems Manager Automation
```
CloudWatch Alarm
  ↓
Systems Manager Automation Document
  ↓
Execute remediation steps:
  - Snapshot instance
  - Run diagnostic scripts
  - Restart services
  - Verify recovery
  - Notification
```

**Automation Document Example:**
```yaml
schemaVersion: '0.3'
description: Auto-remediate high CPU
mainSteps:
  - name: identifyInstance
    action: 'aws:executeAwsApi'
    inputs:
      Service: ec2
      Api: DescribeInstances
      Filters:
        - Name: 'tag:Name'
          Values: ['WebServer']

  - name: snapshotInstance
    action: 'aws:createSnapshot'
    inputs:
      VolumeId: '{{ identifyInstance.VolumeId }}'

  - name: restartInstance
    action: 'aws:executeAwsApi'
    inputs:
      Service: ec2
      Api: RebootInstances
      InstanceIds:
        - '{{ identifyInstance.InstanceId }}'

  - name: verifyHealth
    action: 'aws:waitForAwsResourceProperty'
    timeoutSeconds: 600
    inputs:
      Service: ec2
      Api: DescribeInstanceStatus
      InstanceIds:
        - '{{ identifyInstance.InstanceId }}'
      PropertySelector: '$.InstanceStatuses[0].InstanceStatus.Status'
      DesiredValues:
        - 'ok'
```

---

### Chaos Engineering

**Principles:**
- Intentionally inject failures
- Verify system resilience
- Improve confidence in production behavior
- Discover weaknesses before they cause outages

**AWS Fault Injection Simulator (FIS)**

**Experiment Types:**
- Stop EC2 instances
- Throttle API calls
- Introduce network latency
- Stress CPU/memory
- Fail AZ
- Inject database errors

**Example Experiment:**
```yaml
ExperimentTemplate:
  Description: "Simulate AZ failure"
  Targets:
    InstancesInAZ:
      ResourceType: "aws:ec2:instance"
      SelectionMode: "PERCENT(50)"
      ResourceTags:
        Environment: "production"
      Filters:
        - Path: "State.Name"
          Values: ["running"]
        - Path: "Placement.AvailabilityZone"
          Values: ["us-east-1a"]

  Actions:
    StopInstances:
      ActionId: "aws:ec2:stop-instances"
      Parameters:
        duration: "PT10M"
      Targets:
        Instances: "InstancesInAZ"

  StopConditions:
    - CloudWatch:AlarmArn: "arn:aws:cloudwatch:region:account:alarm:HighErrorRate"

  RoleArn: "arn:aws:iam::account:role/FISRole"
```

**Chaos Engineering Best Practices:**
- Start with non-production
- Small blast radius initially (1-2 instances)
- Monitor metrics during experiments
- Have stop conditions (CloudWatch alarms)
- Run during business hours with team available
- Document and share learnings
- Gradually increase complexity

---

## Distributed System Patterns

### Circuit Breaker Pattern

**Purpose:** Prevent cascading failures by stopping calls to failing services.

**States:**
1. **Closed**: Normal operation, calls pass through
2. **Open**: Failure threshold exceeded, calls blocked immediately
3. **Half-Open**: Testing if service recovered, limited calls allowed

**Implementation:**
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60, recovery_timeout=30):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.recovery_timeout = recovery_timeout
        self.state = 'CLOSED'
        self.last_failure_time = None
        self.last_attempt_time = None

    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time >= self.timeout:
                self.state = 'HALF_OPEN'
                self.last_attempt_time = time.time()
            else:
                raise CircuitBreakerOpenException('Circuit breaker is OPEN')

        try:
            result = func(*args, **kwargs)

            if self.state == 'HALF_OPEN':
                self.state = 'CLOSED'
                self.failure_count = 0

            return result

        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = 'OPEN'

            raise e
```

**AWS Implementation:**
- API Gateway throttling
- Lambda concurrency limits
- SQS for buffering
- Step Functions for retry logic

---

### Retry Logic with Exponential Backoff

**Purpose:** Retry failed operations with increasing delays.

**Implementation:**
```python
import time
import random

def exponential_backoff_retry(func, max_retries=5, base_delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except RetryableException as e:
            if attempt == max_retries - 1:
                raise

            # Exponential backoff: 1s, 2s, 4s, 8s, 16s
            delay = base_delay * (2 ** attempt)

            # Add jitter to prevent thundering herd
            jitter = random.uniform(0, delay * 0.1)
            total_delay = delay + jitter

            time.sleep(total_delay)
```

**AWS SDK Built-in:**
- boto3 (AWS SDK for Python) has automatic retries
- Configurable via Config object
- Standard retry mode: 3 retries
- Adaptive retry mode: Adjusts based on service throttling

**Configuration:**
```python
from botocore.config import Config

config = Config(
    retries = {
        'max_attempts': 10,
        'mode': 'adaptive'
    }
)

client = boto3.client('dynamodb', config=config)
```

---

### Bulkhead Pattern

**Purpose:** Isolate resources to prevent failure propagation.

**Example Scenarios:**

**Connection Pools:**
```python
# Separate connection pools for different services
db_pool_critical = create_pool(min=5, max=10)  # Critical queries
db_pool_reports = create_pool(min=2, max=5)   # Report queries

# Critical traffic not affected by report query load
```

**Lambda Concurrency:**
```yaml
CriticalFunction:
  Type: AWS::Lambda::Function
  Properties:
    ReservedConcurrentExecutions: 100

ReportsFunction:
  Type: AWS::Lambda::Function
  Properties:
    ReservedConcurrentExecutions: 20
```

**SQS Separate Queues:**
```
Critical Operations → High-Priority Queue → Dedicated ASG
Standard Operations → Standard Queue → Shared ASG
Background Jobs → Low-Priority Queue → Spot Instances
```

---

## Service Quotas and Limits

### Understanding AWS Quotas

**Types:**
1. **Hard Limits**: Cannot be increased (e.g., S3 bucket name length)
2. **Soft Limits**: Can be increased via request (e.g., EC2 instances per region)

**Common Quotas to Know:**

| Service | Quota | Default | Adjustable |
|---------|-------|---------|------------|
| **EC2** | Instances per region | Varies by type | Yes |
| **VPC** | VPCs per region | 5 | Yes |
| **VPC** | Route tables per VPC | 200 | Yes |
| **EBS** | Snapshots per region | 100,000 | No |
| **S3** | Buckets per account | 100 | Yes (to 1,000) |
| **Lambda** | Concurrent executions | 1,000 | Yes |
| **DynamoDB** | Tables per region | 2,500 | Yes |
| **RDS** | DB instances per region | 40 | Yes |
| **ALB** | Load balancers per region | 50 | Yes |

### Service Quotas Service

**Monitor and Manage Quotas:**
```bash
# List quotas for a service
aws service-quotas list-service-quotas \
  --service-code ec2

# Request quota increase
aws service-quotas request-service-quota-increase \
  --service-code ec2 \
  --quota-code L-1216C47A \
  --desired-value 100
```

**CloudWatch Integration:**
```
Service Quotas → CloudWatch Metrics → Alarms
  ↓
Alert when approaching quota (e.g., 80% utilization)
  ↓
Request increase or implement mitigation
```

---

## Exam Tips and Tricky Scenarios

**Scenario 1: Rapid Scaling Oscillation**
- **Problem**: ASG scaling up and down rapidly
- **Answer**: Increase cooldown period to match application warmup time
- **Trap**: Setting cooldown too short

**Scenario 2: Instances Terminated Immediately**
- **Problem**: New instances terminated right after launch
- **Answer**: Increase health check grace period to allow startup time
- **Trap**: Grace period shorter than application startup

**Scenario 3: ALB vs NLB Selection**
- **Question**: "Need static IP addresses for whitelisting"
- **Answer**: NLB (supports Elastic IPs)
- **Trap**: Choosing ALB (doesn't support static IPs)

**Scenario 4: Preserve Source IP**
- **Question**: "Application needs to see client IP"
- **Answer**: NLB with IP targets OR ALB with X-Forwarded-For header
- **Trap**: Forgetting about X-Forwarded-For for ALB

**Scenario 5: Path-Based Routing**
- **Question**: "Route /api/* to one target, /web/* to another"
- **Answer**: ALB with path-based routing rules
- **Trap**: Choosing NLB (doesn't support Layer 7 routing)

**Scenario 6: Millions of Requests Per Second**
- **Question**: "Handle 10 million requests per second"
- **Answer**: NLB (extreme performance, Layer 4)
- **Trap**: Choosing ALB (not designed for this scale)

**Scenario 7: Third-Party Firewall**
- **Question**: "Deploy Palo Alto firewall appliances with load balancing"
- **Answer**: GWLB
- **Trap**: Trying to use ALB/NLB for Layer 3 appliances

**Scenario 8: Target Tracking vs Predictive**
- **Question**: "Daily recurring traffic pattern, want proactive scaling"
- **Answer**: Predictive scaling (ML-based forecasting)
- **Trap**: Using only target tracking (reactive)

**Scenario 9: Scheduled + Target Tracking**
- **Question**: "Known business hours pattern + unexpected spikes"
- **Answer**: Combine scheduled scaling + target tracking
- **Trap**: Using only one type

**Scenario 10: Service Quota Alarm**
- **Question**: "Alert when approaching EC2 instance limit"
- **Answer**: Service Quotas → CloudWatch metric → Alarm
- **Trap**: Not monitoring quotas proactively

---

## Summary

**Key Takeaways:**

**1. Auto Scaling Strategy Selection:**
- **Most cases**: Target tracking (simple, effective)
- **Predictable patterns**: Scheduled scaling
- **Recurring patterns**: Predictive scaling
- **Complex needs**: Step scaling
- **Best practice**: Combine multiple types

**2. Load Balancer Selection:**
```
Layer 7, content routing? → ALB
Static IP, extreme performance? → NLB
Third-party appliances? → GWLB
```

**3. Health Checks:**
- Use ELB health checks for application awareness
- Deep health checks for dependencies
- Grace period ≥ application startup time
- Balance sensitivity vs stability

**4. Self-Healing:**
- ASG with ELB health checks (automatic)
- EventBridge + Lambda for custom remediation
- Systems Manager Automation for runbooks
- Chaos engineering to verify resilience

**5. Distributed System Patterns:**
- Circuit breaker: Prevent cascading failures
- Retry with exponential backoff: Handle transient failures
- Bulkhead: Isolate failure domains

**6. Service Quotas:**
- Monitor approaching limits
- Request increases proactively
- Design for quotas from the start

---

*Remember: Reliability is about preventing failures, detecting failures quickly, and recovering automatically. Design for failure at every level.*
