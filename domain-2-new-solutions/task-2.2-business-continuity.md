---
title: "Task 2.2: Design a Solution to Ensure Business Continuity"
domain: 2
domain_name: "Design for New Solutions"
task: 2.2
weight: "29%"
task_weight: "~17% of domain"
exam_topics:
  - disaster-recovery
  - rto-rpo
  - backup
  - multi-az
  - multi-region
  - data-replication
  - failover
  - business-continuity
status: complete
last_updated: "2025-11-18"
---

# Task 2.2: Design a Solution to Ensure Business Continuity

## Overview

Business continuity focuses on maintaining business operations during and after disasters or failures. This task covers disaster recovery (DR) strategies, backup mechanisms, high availability architectures, and data replication patterns to minimize downtime and data loss.

**Exam Weight:** ~17% of Domain 2 (approximately 5% of total exam)

**Key Focus Areas:**
- Disaster recovery patterns and RTO/RPO requirements
- Backup strategies using AWS Backup and native services
- Multi-AZ and Multi-Region architecture design
- Data replication strategies across AWS services
- Application-level failover mechanisms
- Business continuity planning and testing

---

## RTO and RPO Fundamentals

### Definitions

**Recovery Time Objective (RTO):**
- Maximum acceptable time to restore service after disruption
- Measured in hours, minutes, or seconds
- Determines DR strategy and cost
- Lower RTO = higher cost

**Recovery Point Objective (RPO):**
- Maximum acceptable amount of data loss measured in time
- Determines backup frequency and replication strategy
- Lower RPO = higher cost and complexity

**Example:**
```
Disaster occurs at 14:00
Last backup at 13:00 (1 hour ago)
Service restored at 16:00 (2 hours later)

RPO = 1 hour (data between 13:00-14:00 lost)
RTO = 2 hours (time to restore service)
```

### RTO/RPO Matrix

| Business Impact | RPO Target | RTO Target | DR Pattern | Relative Cost |
|----------------|------------|------------|------------|---------------|
| **Mission Critical** | Near-zero | Seconds-Minutes | Multi-Site Active/Active | $$$$ |
| **Business Critical** | Minutes | Minutes | Warm Standby | $$$ |
| **Important** | Hours | 1-4 hours | Pilot Light | $$ |
| **Standard** | 24 hours | 24+ hours | Backup & Restore | $ |

---

## Disaster Recovery Patterns

### 1. Backup and Restore

**Description:** Regular backups stored in AWS, restore when disaster occurs.

**Characteristics:**
- Highest RTO (hours to days)
- Highest RPO (hours)
- Lowest cost
- Suitable for non-critical workloads

**RTO:** 4-24 hours
**RPO:** Hours to 24 hours
**Cost:** $

**Architecture:**
```
On-Premises or Primary Region:
  ↓
Regular Backups (Automated)
  ↓
Amazon S3 (Cross-Region Replication)
  ↓
Disaster Occurs
  ↓
Restore from S3
  ↓
Provision Infrastructure (CloudFormation)
  ↓
Service Resumed
```

**Implementation Components:**
- **AWS Backup:** Centralized backup management
- **S3 with Cross-Region Replication:** Store backups
- **CloudFormation/Terraform:** Infrastructure restoration
- **AMIs and Snapshots:** EC2 and EBS backups
- **Database Backups:** RDS automated backups, manual snapshots

**AWS Backup Configuration:**
```json
{
  "BackupPlan": {
    "BackupPlanName": "DailyBackupPlan",
    "Rules": [
      {
        "RuleName": "DailyBackup",
        "TargetBackupVault": "Default",
        "ScheduleExpression": "cron(0 5 * * ? *)",
        "StartWindowMinutes": 60,
        "CompletionWindowMinutes": 120,
        "Lifecycle": {
          "DeleteAfterDays": 35,
          "MoveToColdStorageAfterDays": 7
        },
        "CopyActions": [
          {
            "DestinationBackupVaultArn": "arn:aws:backup:us-west-2:account:backup-vault:DR-Vault",
            "Lifecycle": {
              "DeleteAfterDays": 35,
              "MoveToColdStorageAfterDays": 7
            }
          }
        ]
      }
    ]
  }
}
```

**Backup Strategy by Service:**

**EC2:**
- EBS snapshots (automated with lifecycle policies)
- AMIs for full instance backup
- AWS Backup for centralized management

**RDS:**
- Automated daily backups (retention 1-35 days)
- Manual snapshots (retained until deleted)
- Cross-region snapshot copy

**S3:**
- Versioning enabled
- Cross-Region Replication (CRR)
- S3 lifecycle policies for archival

**EFS:**
- AWS Backup integration
- Automatic backups with retention policies

**DynamoDB:**
- On-demand backups
- Point-in-time recovery (PITR) - 35 days
- AWS Backup for cross-account/cross-region

**Advantages:**
- ✅ Lowest cost DR solution
- ✅ Simple to implement
- ✅ No standby infrastructure costs
- ✅ Works for most compliance requirements

**Disadvantages:**
- ❌ Highest RTO (hours to restore)
- ❌ Highest RPO (last backup)
- ❌ Manual intervention required
- ❌ Infrastructure provisioning time

**Best For:**
- Non-critical applications
- Cost-sensitive scenarios
- Development/test environments
- Compliance/archival requirements

**Exam Scenario:**
*"Company needs DR for internal tools used during business hours. Data loss of up to 24 hours acceptable. RTO of 12 hours acceptable."*
→ **Backup and Restore** (most cost-effective solution)

---

### 2. Pilot Light

**Description:** Minimal version of core systems always running in DR region, ready to scale up.

**Characteristics:**
- Medium RTO (10-30 minutes)
- Low RPO (minutes)
- Medium-low cost
- Core systems ready, scaled down

**RTO:** 10-30 minutes
**RPO:** Minutes
**Cost:** $$

**Architecture:**
```
Primary Region (Active):
  - Full application stack
  - Production database (RDS Multi-AZ)
  - Auto Scaling Groups
  - Full capacity

DR Region (Pilot Light):
  - Minimal/no compute (or stopped instances)
  - Database read replica (kept in sync)
  - AMIs and launch templates ready
  - Core infrastructure configured
  - Minimal or zero cost for compute

Failover Process:
  1. Promote read replica to primary
  2. Launch compute instances (Auto Scaling)
  3. Update DNS (Route 53)
  4. Scale to production capacity
```

**Implementation:**

**Database Replication:**
```bash
# RDS Cross-Region Read Replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier dr-database-replica \
  --source-db-instance-identifier prod-database \
  --source-region us-east-1 \
  --region us-west-2

# During DR: Promote replica
aws rds promote-read-replica \
  --db-instance-identifier dr-database-replica
```

**Auto Scaling Configuration:**
```json
{
  "AutoScalingGroupName": "dr-asg",
  "MinSize": 0,
  "MaxSize": 10,
  "DesiredCapacity": 0,
  "LaunchTemplate": {
    "LaunchTemplateId": "lt-xxx",
    "Version": "$Latest"
  }
}
```

**Failover Procedure:**
1. Detect failure (health checks, monitoring)
2. Promote database read replica in DR region
3. Update Auto Scaling Group desired capacity
4. Wait for instances to launch and become healthy
5. Update Route 53 to point to DR region
6. Verify application functionality

**Components Always Running:**
- Database read replica (continuous replication)
- S3 buckets (cross-region replication)
- Route 53 (DNS)
- CloudFormation stacks (infrastructure defined)
- AMIs and configuration data

**Components Started During Failover:**
- EC2 instances (Auto Scaling)
- Application load balancers
- Additional services as needed

**Advantages:**
- ✅ Faster recovery than Backup & Restore
- ✅ Lower cost than Warm Standby
- ✅ Database always ready
- ✅ Proven failover process

**Disadvantages:**
- ❌ Still requires time to scale up compute
- ❌ Database promotion time (minutes)
- ❌ Need to maintain DR infrastructure
- ❌ Testing overhead

**Best For:**
- Business-critical applications
- RPO < 1 hour requirement
- Cost-conscious organizations
- Predictable failover time acceptable

**Exam Scenario:**
*"E-commerce site needs to recover within 30 minutes with minimal data loss. Cost is a concern."*
→ **Pilot Light** (balances RTO, RPO, and cost)

---

### 3. Warm Standby

**Description:** Scaled-down but fully functional environment running in DR region.

**Characteristics:**
- Low RTO (minutes)
- Very low RPO (seconds to minutes)
- Medium-high cost
- DR environment always running at reduced capacity

**RTO:** 1-10 minutes
**RPO:** Seconds to minutes
**Cost:** $$$

**Architecture:**
```
Primary Region (Active - Full Scale):
  - Application: 10 instances
  - Database: Multi-AZ, production capacity
  - 100% of user traffic

DR Region (Warm Standby - Reduced Scale):
  - Application: 2-3 instances (20-30% capacity)
  - Database: Read replica or smaller instance
  - 0% of user traffic (can handle health checks)
  - Fully configured and running
  - Can serve traffic immediately

Failover:
  1. Route 53 health check fails
  2. Traffic automatically shifts to DR region
  3. Auto Scaling increases capacity in DR
  4. Full capacity reached in minutes
```

**Implementation:**

**Primary Region:**
```yaml
AutoScalingGroup:
  MinSize: 8
  MaxSize: 20
  DesiredCapacity: 10

Database:
  InstanceClass: db.r6g.2xlarge
  MultiAZ: true
```

**DR Region (Warm Standby):**
```yaml
AutoScalingGroup:
  MinSize: 2
  MaxSize: 20
  DesiredCapacity: 2

Database:
  InstanceClass: db.r6g.large
  ReadReplica: true
  SourceRegion: primary-region
```

**Route 53 Failover Configuration:**
```json
{
  "Name": "app.example.com",
  "Type": "A",
  "SetIdentifier": "Primary",
  "Failover": "PRIMARY",
  "HealthCheckId": "health-check-id",
  "AliasTarget": {
    "HostedZoneId": "Z123456",
    "DNSName": "primary-alb.us-east-1.elb.amazonaws.com",
    "EvaluateTargetHealth": true
  }
},
{
  "Name": "app.example.com",
  "Type": "A",
  "SetIdentifier": "Secondary",
  "Failover": "SECONDARY",
  "AliasTarget": {
    "HostedZoneId": "Z789012",
    "DNSName": "dr-alb.us-west-2.elb.amazonaws.com",
    "EvaluateTargetHealth": true
  }
}
```

**Failover Automation:**
```python
# Lambda function for automated failover
def lambda_handler(event, context):
    # Triggered by CloudWatch alarm or Route 53 health check

    # 1. Verify primary region is down
    if not check_primary_health():

        # 2. Promote DR database
        promote_read_replica('dr-database')

        # 3. Scale up DR Auto Scaling Groups
        scale_asg('dr-asg', desired=10)

        # 4. Send notifications
        notify_team('Failover initiated to DR region')

        # 5. Update monitoring dashboards
        update_dashboard('DR_ACTIVE')

        return {
            'statusCode': 200,
            'body': 'Failover completed'
        }
```

**Data Synchronization:**
- **RDS:** Cross-region read replica with async replication
- **DynamoDB:** Global Tables for multi-region
- **S3:** Cross-Region Replication (CRR)
- **EFS:** AWS DataSync for file system replication
- **ElastiCache:** Redis with cross-region replication

**Advantages:**
- ✅ Fast failover (minutes)
- ✅ Near-zero data loss
- ✅ DR environment tested continuously
- ✅ Can handle traffic immediately
- ✅ Predictable performance

**Disadvantages:**
- ❌ Higher cost (always running)
- ❌ Need to maintain two environments
- ❌ Capacity planning for both regions
- ❌ More complex configuration

**Best For:**
- Business-critical applications
- Low RTO/RPO requirements
- Applications requiring continuous DR testing
- Predictable capacity needs

**Exam Scenario:**
*"Healthcare application requires RTO < 5 minutes and RPO < 1 minute. Must maintain HIPAA compliance."*
→ **Warm Standby** (meets aggressive RTO/RPO, compliance-ready)

---

### 4. Multi-Site Active/Active (Hot Standby)

**Description:** Full production environments in multiple regions, both serving traffic.

**Characteristics:**
- Near-zero RTO (automatic)
- Near-zero RPO (real-time replication)
- Highest cost
- Best user experience (global latency optimization)

**RTO:** Seconds (automatic failover)
**RPO:** Near-zero (real-time replication)
**Cost:** $$$$

**Architecture:**
```
Route 53 (Latency-Based or Geoproximity Routing)
           ↓                ↓
    Region 1 (Active)  Region 2 (Active)
    - Full Capacity    - Full Capacity
    - 50% traffic      - 50% traffic
    - Active DB        - Active DB

Both regions:
  - Full application stack
  - Production capacity
  - Actively serving users
  - Real-time data replication
```

**Multi-Region Database Options:**

**Option 1: Aurora Global Database**
```yaml
GlobalCluster:
  GlobalClusterIdentifier: global-cluster
  Engine: aurora-mysql

PrimaryCluster:
  Region: us-east-1
  InstanceClass: db.r6g.xlarge
  Instances: 3

SecondaryCluster:
  Region: us-west-2
  InstanceClass: db.r6g.xlarge
  Instances: 3
  ReplicationLag: <1 second

Failover:
  Automatic: true
  FailoverTimeout: <1 minute
```

**Aurora Global Database Features:**
- Replication lag typically < 1 second
- Secondary region can handle up to 1 million writes/sec during recovery
- Disaster recovery across regions in < 1 minute
- Read replicas in secondary region for local reads

**Option 2: DynamoDB Global Tables**
```yaml
GlobalTable:
  TableName: users
  Regions:
    - us-east-1
    - us-west-2
    - eu-west-1

  Replication:
    Type: Active-Active
    ConflictResolution: LastWriterWins

  Capacity:
    BillingMode: PAY_PER_REQUEST
    # or
    ProvisionedThroughput:
      ReadCapacityUnits: 5000
      WriteCapacityUnits: 5000
```

**DynamoDB Global Tables Features:**
- Multi-master replication (write to any region)
- Automatic conflict resolution
- Sub-second replication latency
- No application changes needed

**Route 53 Configuration for Active/Active:**

**Latency-Based Routing:**
```json
{
  "ChangeBatch": {
    "Changes": [
      {
        "Action": "CREATE",
        "ResourceRecordSet": {
          "Name": "app.example.com",
          "Type": "A",
          "SetIdentifier": "US-East",
          "Region": "us-east-1",
          "HealthCheckId": "health-us-east",
          "AliasTarget": {
            "HostedZoneId": "Z123456",
            "DNSName": "us-east-alb.elb.amazonaws.com",
            "EvaluateTargetHealth": true
          }
        }
      },
      {
        "Action": "CREATE",
        "ResourceRecordSet": {
          "Name": "app.example.com",
          "Type": "A",
          "SetIdentifier": "US-West",
          "Region": "us-west-2",
          "HealthCheckId": "health-us-west",
          "AliasTarget": {
            "HostedZoneId": "Z789012",
            "DNSName": "us-west-alb.elb.amazonaws.com",
            "EvaluateTargetHealth": true
          }
        }
      }
    ]
  }
}
```

**Traffic Distribution Strategies:**

**Strategy 1: Latency-Based**
- Users routed to closest healthy region
- Best user experience
- Automatic failover if region unhealthy

**Strategy 2: Geoproximity**
- Specify bias per region
- Fine-tune traffic distribution
- Useful for compliance (data sovereignty)

**Strategy 3: Weighted**
- Explicit percentages per region
- 50/50 or custom split
- Useful for gradual migrations

**Strategy 4: Multivalue Answer**
- Return multiple IPs
- Client chooses
- Simple but less control

**Data Consistency Considerations:**

**Strong Consistency Requirement:**
- Use Aurora Global Database with writes to primary
- All reads from primary region
- Trade-off: Higher latency for some users

**Eventual Consistency Acceptable:**
- DynamoDB Global Tables with multi-master
- Aurora with reads from local region
- Lower latency, risk of stale reads

**Session Management:**
- Use DynamoDB for session storage
- ElastiCache for Redis Global Datastore
- Sticky sessions at ALB level (less ideal for DR)

**S3 Cross-Region Replication:**
```json
{
  "Role": "arn:aws:iam::account:role/s3-replication",
  "Rules": [
    {
      "Status": "Enabled",
      "Priority": 1,
      "Filter": {
        "Prefix": ""
      },
      "Destination": {
        "Bucket": "arn:aws:s3:::destination-bucket",
        "ReplicationTime": {
          "Status": "Enabled",
          "Time": {
            "Minutes": 15
          }
        },
        "Metrics": {
          "Status": "Enabled",
          "EventThreshold": {
            "Minutes": 15
          }
        }
      },
      "DeleteMarkerReplication": {
        "Status": "Enabled"
      }
    }
  ]
}
```

**S3 Replication Time Control (RTC):**
- 99.99% of objects replicated within 15 minutes
- Replication metrics and notifications
- Additional cost

**Advantages:**
- ✅ Best user experience (lowest latency globally)
- ✅ Automatic failover
- ✅ No manual intervention needed
- ✅ Near-zero RTO and RPO
- ✅ Load distributed across regions
- ✅ DR tested continuously

**Disadvantages:**
- ❌ Highest cost (multiple full environments)
- ❌ Most complex to implement and manage
- ❌ Data consistency challenges
- ❌ Requires sophisticated monitoring
- ❌ Potential for split-brain scenarios

**Best For:**
- Mission-critical applications
- Global user base
- Zero tolerance for downtime
- Real-time applications
- Financial services, healthcare

**Exam Scenario:**
*"Global social media platform with millions of users. Requires near-zero downtime and data loss. Users expect low latency worldwide."*
→ **Multi-Site Active/Active** (only solution meeting all requirements)

---

## Backup Strategies

### AWS Backup - Centralized Solution

**Features:**
- Centralized backup management
- Cross-account and cross-region backups
- Policy-based backup plans
- Backup activity monitoring
- Compliance reporting

**Supported Services:**
- EC2, EBS, S3
- RDS, Aurora, DynamoDB
- EFS, FSx (all variants)
- Storage Gateway volumes
- DocumentDB, Neptune
- AWS Backup Gateway (on-premises)

**Backup Plan Components:**

**1. Backup Rules:**
```json
{
  "RuleName": "DailyBackupRule",
  "ScheduleExpression": "cron(0 5 * * ? *)",
  "StartWindowMinutes": 60,
  "CompletionWindowMinutes": 120,
  "Lifecycle": {
    "MoveToColdStorageAfterDays": 30,
    "DeleteAfterDays": 365
  },
  "RecoveryPointTags": {
    "BackupType": "Daily",
    "Compliance": "Required"
  }
}
```

**2. Backup Vaults:**
- Logical containers for recovery points
- Encryption at rest (AWS KMS)
- Access policies
- Event notifications
- Vault lock for immutability (compliance)

**3. Cross-Region Copy:**
```json
{
  "CopyActions": [
    {
      "DestinationBackupVaultArn": "arn:aws:backup:us-west-2:account:backup-vault:DR-Vault",
      "Lifecycle": {
        "MoveToColdStorageAfterDays": 30,
        "DeleteAfterDays": 365
      }
    }
  ]
}
```

**4. Backup Vault Lock (Compliance):**
```bash
# Enable vault lock for immutability
aws backup put-backup-vault-lock-configuration \
  --backup-vault-name ComplianceVault \
  --min-retention-days 1 \
  --max-retention-days 365
```

**Backup Frequency Recommendations:**

| Data Criticality | Backup Frequency | Retention | Cross-Region |
|-----------------|------------------|-----------|--------------|
| **Mission Critical** | Every 4 hours | 90 days | Yes |
| **Business Critical** | Daily | 30 days | Yes |
| **Important** | Daily | 7 days | Optional |
| **Standard** | Weekly | 30 days | No |

---

### Service-Specific Backup Strategies

### RDS and Aurora Backups

**Automated Backups:**
- Daily full backup during backup window
- Transaction logs backed up every 5 minutes
- Point-in-time recovery (PITR) to any second
- Retention: 1-35 days (0 to disable)

**Manual Snapshots:**
- User-initiated
- Retained until explicitly deleted
- Can be copied cross-region
- Can be shared with other AWS accounts

**Aurora Backups:**
- Continuous, automatic backups to S3
- Point-in-time recovery within retention period
- No performance impact (runs on storage layer)
- Retention: 1-35 days

**Aurora Backtrack:**
- "Rewind" database to earlier point in time
- Available within seconds
- No need to restore from backup
- Retention: up to 72 hours
- **Note:** Only Aurora MySQL supports backtrack

**Configuration:**
```yaml
DBInstance:
  BackupRetentionPeriod: 35
  PreferredBackupWindow: "03:00-04:00"
  CopyTagsToSnapshot: true
  EnableCloudwatchLogsExports:
    - error
    - slowquery
```

---

### DynamoDB Backups

**On-Demand Backups:**
- Full table backup
- No performance impact
- Retained until explicitly deleted
- Can restore to new table

**Point-in-Time Recovery (PITR):**
- Continuous backups for 35 days
- Restore to any second within retention
- ~5-minute RPO
- Additional cost

**AWS Backup Integration:**
- Automated backup plans
- Cross-region and cross-account
- Compliance reporting

**Configuration:**
```yaml
Table:
  TableName: users
  PointInTimeRecoverySpecification:
    PointInTimeRecoveryEnabled: true

BackupPlan:
  Rules:
    - RuleName: HourlyBackup
      ScheduleExpression: "cron(0 * * * ? *)"
      Lifecycle:
        DeleteAfterDays: 7
```

---

### S3 Backup and Versioning

**Versioning:**
- Keep multiple versions of objects
- Protect against accidental deletion
- Recover from unintended overwrites

**Cross-Region Replication (CRR):**
- Async replication to another region
- Requires versioning enabled
- Can replicate encrypted objects
- Replication Time Control (RTC) for SLA

**S3 Intelligent-Tiering:**
- Automatic cost optimization
- No retrieval fees
- Monitors access patterns

**S3 Lifecycle Policies:**
```json
{
  "Rules": [
    {
      "Id": "Archive old versions",
      "Status": "Enabled",
      "NoncurrentVersionTransitions": [
        {
          "NoncurrentDays": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "NoncurrentDays": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 365
      }
    }
  ]
}
```

**S3 Object Lock:**
- WORM (Write Once Read Many) model
- Compliance and governance modes
- Prevent object deletion for retention period
- Legal hold support

---

### EBS Snapshots

**Automated Snapshots:**
- Amazon Data Lifecycle Manager (DLM)
- Schedule-based
- Retention rules
- Cross-region copy

**Snapshot Characteristics:**
- Incremental (only changed blocks)
- Point-in-time consistent
- Stored in S3 (hidden from user)
- Can create AMI from snapshot

**Data Lifecycle Manager Policy:**
```json
{
  "PolicyDetails": {
    "PolicyType": "EBS_SNAPSHOT_MANAGEMENT",
    "ResourceTypes": ["VOLUME"],
    "TargetTags": [
      {
        "Key": "Backup",
        "Value": "true"
      }
    ],
    "Schedules": [
      {
        "Name": "DailySnapshot",
        "CreateRule": {
          "Interval": 24,
          "IntervalUnit": "HOURS",
          "Times": ["09:00"]
        },
        "RetainRule": {
          "Count": 30
        },
        "CopyTags": true,
        "CrossRegionCopyRules": [
          {
            "TargetRegion": "us-west-2",
            "Encrypted": true,
            "CmkArn": "arn:aws:kms:us-west-2:account:key/key-id",
            "RetainRule": {
              "Interval": 30,
              "IntervalUnit": "DAYS"
            }
          }
        ]
      }
    ]
  }
}
```

**Fast Snapshot Restore (FSR):**
- Eliminate latency on first access
- Restore EBS volumes with full performance
- Additional cost
- Enable per AZ

---

### EFS Backup

**AWS Backup Integration:**
- Automated backup plans
- Point-in-time recovery
- Cross-region backup

**EFS Replication:**
- Automatic replication to another region
- Near real-time (1-2 minute RTO)
- Transparent failover

**Configuration:**
```yaml
FileSystem:
  PerformanceMode: generalPurpose
  ThroughputMode: elastic
  Encrypted: true

ReplicationConfiguration:
  Destinations:
    - Region: us-west-2
      FileSystemId: fs-destination-id
```

---

## Multi-AZ Architectures

### Multi-AZ for High Availability

**RDS Multi-AZ:**
- Synchronous replication to standby in different AZ
- Automatic failover (typically < 60 seconds)
- Same region, different AZ
- No Read Replica functionality
- For HA, not for scaling reads

**Aurora Multi-AZ:**
- 6 copies across 3 AZs automatically
- 2 copies per AZ
- Can lose 2 copies without affecting write availability
- Can lose 3 copies without affecting read availability
- Self-healing storage

**DynamoDB:**
- Automatically replicated across 3 AZs
- No configuration needed
- Transparent to application

**ElastiCache Multi-AZ:**
- Redis: Multi-AZ with automatic failover
- Memcached: Spread nodes across AZs (no replication)

**ELB Multi-AZ:**
- Deploy nodes in multiple AZs
- Automatic traffic distribution
- Health checks per AZ
- Cross-zone load balancing (optional)

**Best Practices:**
- Deploy resources in at least 2 AZs (3 for highest availability)
- Use Auto Scaling across multiple AZs
- Configure health checks appropriately
- Test AZ failure scenarios
- Monitor cross-AZ data transfer costs

---

## Application-Level Failover Mechanisms

### Health Checks

**ELB Health Checks:**
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

**Route 53 Health Checks:**
```json
{
  "Type": "HTTPS",
  "ResourcePath": "/health",
  "FullyQualifiedDomainName": "api.example.com",
  "Port": 443,
  "RequestInterval": 30,
  "FailureThreshold": 3,
  "MeasureLatency": true,
  "EnableSNI": true
}
```

**Types of Route 53 Health Checks:**
- **Endpoint:** Monitor endpoint (IP or domain)
- **Calculated:** Combine multiple health checks with AND/OR logic
- **CloudWatch Alarm:** Based on CloudWatch metrics

---

### Circuit Breaker Pattern

Prevent cascading failures by stopping requests to failing services.

**Implementation Example:**
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
        self.last_failure_time = None

    def call(self, function):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'HALF_OPEN'
            else:
                raise Exception('Circuit breaker is OPEN')

        try:
            result = function()
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
- Use API Gateway with throttling
- Lambda concurrency limits
- SQS for buffering
- Step Functions for retry logic

---

### Graceful Degradation

Continue operating with reduced functionality during failures.

**Strategies:**
- **Feature Flags:** Disable non-critical features
- **Caching:** Serve stale data during outages
- **Static Content:** Fallback to static pages
- **Read-Only Mode:** Allow reads, block writes
- **Queue Writes:** Buffer writes to SQS for later processing

**Example with Feature Flags:**
```python
def get_recommendations(user_id):
    if feature_flags.is_enabled('ml_recommendations'):
        try:
            return ml_service.get_recommendations(user_id)
        except ServiceUnavailable:
            feature_flags.disable('ml_recommendations', duration=300)
            return get_popular_items()  # Fallback
    else:
        return get_popular_items()
```

---

## Disaster Recovery Testing

### DR Testing Best Practices

**Test Types:**

**1. Tabletop Exercises:**
- Walk through DR procedures
- Identify gaps in documentation
- No actual failover
- Frequency: Monthly

**2. Simulation Testing:**
- Test components individually
- Restore from backups
- Verify data integrity
- Frequency: Quarterly

**3. Partial Failover:**
- Failover non-production workloads
- Test subset of systems
- Validate procedures
- Frequency: Quarterly

**4. Full Failover:**
- Complete production failover
- Test during maintenance window
- Verify all systems
- Frequency: Annually

**Automated Testing:**
```yaml
# GameDay automation with AWS FIS (Fault Injection Simulator)
ExperimentTemplate:
  Description: "Simulate AZ failure"
  Targets:
    - Name: "WebServers"
      ResourceType: "aws:ec2:instance"
      SelectionMode: "PERCENT"
      Parameters:
        percentage: "50"
  Actions:
    - Name: "StopInstances"
      ActionId: "aws:ec2:stop-instances"
      Parameters:
        duration: "PT10M"
  StopConditions:
    - CloudWatchAlarm: "HighErrorRate"
```

**Metrics to Track:**
- Actual RTO vs target RTO
- Actual RPO vs target RPO
- Failover success rate
- Time to detect failure
- Time to initiate failover
- Time to full recovery
- Data integrity issues
- Application functionality gaps

---

## Exam Tips and Tricky Scenarios

### Common Exam Patterns

**Scenario 1: Lowest Cost DR**
- **Requirement:** Minimal cost, 24-hour RTO acceptable
- **Answer:** Backup and Restore with AWS Backup
- **Why:** Cheapest option, no standby infrastructure

**Scenario 2: Zero Data Loss Requirement**
- **Requirement:** RPO = 0, no data loss acceptable
- **Answer:** Multi-Site Active/Active with synchronous replication
- **Why:** Only true real-time replication achieves RPO = 0

**Scenario 3: Fast Recovery, Cost-Conscious**
- **Requirement:** RTO < 1 hour, minimize cost
- **Answer:** Pilot Light
- **Why:** Balances recovery time with cost

**Scenario 4: Global Application, Low Latency**
- **Requirement:** Users worldwide, < 100ms latency
- **Answer:** Multi-Site Active/Active with latency-based routing
- **Why:** Serves users from nearest region

**Scenario 5: Compliance Immutable Backups**
- **Requirement:** 7-year retention, immutable, compliance
- **Answer:** S3 with Object Lock (Compliance mode) or AWS Backup Vault Lock
- **Why:** Prevents deletion, meets compliance requirements

**Scenario 6: Cross-Account Backup**
- **Requirement:** Backup to separate AWS account
- **Answer:** AWS Backup with cross-account backup
- **Why:** Centralized backup management with account isolation

**Scenario 7: Database with Minimal Downtime**
- **Requirement:** Database failover < 1 minute
- **Answer:** Aurora Global Database or DynamoDB Global Tables
- **Why:** Fastest database failover options

**Scenario 8: File System DR**
- **Requirement:** Replicate file system to DR region
- **Answer:** EFS with replication or FSx with AWS Backup
- **Why:** EFS replication is automatic, FSx uses AWS Backup

**Scenario 9: Point-in-Time Recovery**
- **Requirement:** Recover to any point in last 30 days
- **Answer:** RDS automated backups with PITR or DynamoDB with PITR enabled
- **Why:** Both support point-in-time recovery

**Scenario 10: Multi-Region with Write Conflicts**
- **Requirement:** Write to multiple regions, handle conflicts
- **Answer:** DynamoDB Global Tables
- **Why:** Only multi-master solution with conflict resolution

### Key Differentiators

**Multi-AZ vs Multi-Region:**
- Multi-AZ: HA within region, protects against AZ failure
- Multi-Region: DR across regions, protects against region failure

**RDS Multi-AZ vs Read Replicas:**
- Multi-AZ: Synchronous, automatic failover, same region, HA
- Read Replicas: Asynchronous, manual promotion, can be cross-region, read scaling

**Aurora vs RDS Multi-AZ:**
- Aurora: 6 copies across 3 AZs, faster replication, sub-minute failover
- RDS Multi-AZ: 1 standby in different AZ, 1-2 minute failover

**Backup vs Snapshot:**
- Backup: Automated, scheduled, managed by AWS Backup
- Snapshot: Point-in-time copy, user-initiated or automated via DLM

**S3 CRR vs S3 Backup:**
- CRR: Real-time replication, all objects, automatic
- Backup: Scheduled, point-in-time, managed lifecycle

---

## Summary

**Key Takeaways:**

1. **DR Pattern Selection:**
   - Match pattern to RTO/RPO requirements
   - Consider cost vs availability trade-off
   - Test regularly

2. **RTO/RPO Hierarchy:**
   - Backup & Restore: Hours/Days (lowest cost)
   - Pilot Light: 10-30 min / Minutes (medium cost)
   - Warm Standby: Minutes / Seconds (higher cost)
   - Multi-Site Active/Active: Seconds / Near-zero (highest cost)

3. **Backup Strategy:**
   - Use AWS Backup for centralized management
   - Enable cross-region backups for DR
   - Implement lifecycle policies
   - Test restore procedures

4. **Multi-AZ for HA:**
   - Deploy across multiple AZs
   - Use managed services with built-in Multi-AZ
   - Configure health checks
   - Test AZ failure scenarios

5. **Multi-Region for DR:**
   - Route 53 for DNS failover
   - Database replication (Aurora Global, DynamoDB Global Tables)
   - S3 CRR for object storage
   - Automated failover procedures

6. **Application Resilience:**
   - Circuit breaker pattern
   - Graceful degradation
   - Health checks at multiple layers
   - Retry logic with exponential backoff

7. **Testing is Critical:**
   - Regular DR drills
   - Automate testing with AWS FIS
   - Measure actual RTO/RPO
   - Update runbooks

---

*Always choose the DR strategy that meets RTO/RPO requirements at the lowest cost. Remember: DR is about recovery time and data loss, not just backups.*
