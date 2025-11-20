# AWS Database Services - Comprehensive Comparison

## High-Level Overview

AWS provides multiple managed database services, each optimized for specific workload patterns and application requirements. Understanding when to choose relational (RDS, Aurora) vs NoSQL (DynamoDB) is fundamental for the SA Pro exam.

### Key Services

1. **Amazon RDS (Relational Database Service)** - Managed relational databases with multiple engine options (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB)
2. **Amazon Aurora** - AWS-engineered relational database with MySQL and PostgreSQL compatibility, 5x performance improvement
3. **Amazon DynamoDB** - Fully managed NoSQL database with millisecond latency, key-value and document data models

---

## Detailed Comparison Table

| Feature | RDS | Aurora | DynamoDB |
|---------|-----|--------|----------|
| **Database Type** | Relational (SQL) | Relational (SQL) | NoSQL (Key-Value/Document) |
| **Engines** | MySQL, PostgreSQL, Oracle, SQL Server, MariaDB | MySQL-compatible, PostgreSQL-compatible | Proprietary NoSQL |
| **Performance** | Standard (baseline) | 5x MySQL, 3x PostgreSQL | Single-digit millisecond latency |
| **Storage** | EBS-backed, up to 64TB | Auto-scaling (10GB to 128TB) | Unlimited |
| **Scaling** | Vertical (instance size), Read Replicas | Vertical + Auto-scaling, up to 15 Read Replicas | Horizontal (unlimited), Auto-scaling |
| **Replication** | Read Replicas (async) | Up to 15 replicas (shared storage) | Multi-master, Global Tables |
| **High Availability** | Multi-AZ (standby) | Multi-AZ built-in, 6 copies across 3 AZs | Multi-AZ by default, Global Tables |
| **Failover Time** | 1-2 minutes | < 30 seconds | Instant (no failover) |
| **Backup** | Automated + snapshots | Automated + snapshots, continuous backup | Point-in-time recovery (PITR), on-demand backups |
| **Query Language** | SQL | SQL | PartiQL (SQL-like) or API calls |
| **Pricing Model** | Provisioned (instance + storage) | Provisioned (instance + storage + I/O) | On-Demand or Provisioned Capacity |
| **Maintenance** | Maintenance windows required | Maintenance windows (minimal impact) | Serverless (no maintenance) |
| **Best For** | Traditional apps, existing SQL databases | High-performance SQL, scalability | Web/mobile, gaming, IoT, serverless |

---

## Detailed Service Breakdowns

### 1. Amazon RDS (Relational Database Service)

**What it does:** Managed relational database service supporting multiple database engines with automated backups, patching, and monitoring.

**How it works:**
- Runs standard database engines on managed EC2 instances
- Automatic backups, patching, and maintenance
- Multi-AZ deployment for high availability
- Read Replicas for read scaling
- EBS-backed storage

**Supported Engines:**
- **MySQL** - Open source, widely used
- **PostgreSQL** - Advanced open source with rich features
- **MariaDB** - MySQL fork with additional features
- **Oracle** - Enterprise database (BYOL or License Included)
- **SQL Server** - Microsoft database (various editions)

**Key Features:**
- **Multi-AZ Deployment:**
  - Synchronous replication to standby in different AZ
  - Automatic failover in 1-2 minutes
  - Standby cannot serve read traffic
  - Used for high availability (DR)
- **Read Replicas:**
  - Asynchronous replication (eventual consistency)
  - Up to 5 Read Replicas (15 for Aurora)
  - Can be in different regions (cross-region)
  - Can be promoted to standalone database
  - Used for read scaling and reporting
- **Backup and Recovery:**
  - Automated daily backups (retention 1-35 days)
  - Manual snapshots (retained until deleted)
  - Point-in-time recovery (5-minute granularity)
  - Backup window impacts performance
- **Security:**
  - VPC isolation
  - Encryption at rest (KMS)
  - Encryption in transit (SSL/TLS)
  - IAM database authentication
  - Secrets Manager integration
- **Monitoring:**
  - CloudWatch metrics
  - Enhanced Monitoring
  - Performance Insights
  - Database event notifications

**Storage:**
- **General Purpose SSD (gp2/gp3)** - Cost-effective, baseline performance
- **Provisioned IOPS SSD (io1/io2)** - High-performance, predictable IOPS
- **Magnetic (deprecated)** - Legacy, not recommended
- Storage auto-scaling available (automatically increases)
- Maximum size: 64TB (SQL Server: 16TB)

**Scaling:**
- **Vertical Scaling:** Change instance type (requires downtime)
- **Read Scaling:** Add Read Replicas (up to 5)
- **Storage Scaling:** Auto-scaling or manual increase (cannot decrease)

**Performance:**
- Depends on instance type and storage
- Provisioned IOPS for consistent performance
- Up to 256,000 IOPS (io2)
- Read Replicas for read-heavy workloads

**Best for:**
- Lift-and-shift migrations of existing databases
- Applications requiring specific database engine (Oracle, SQL Server)
- Traditional OLTP workloads
- Existing SQL-based applications
- When you need full control over database parameters
- License optimization (BYOL)
- Compliance requirements for specific engines

**⚠️ EXAM TIP:**
- **Multi-AZ** = High Availability (HA), not performance
- **Read Replicas** = Read scaling and disaster recovery
- Read Replicas can be **cross-region** (Global DR)
- Multi-AZ standby **cannot** be used for read queries
- RDS is for **OLTP** (Online Transaction Processing), not OLAP
- Maximum **5 Read Replicas** (Aurora has 15)

**Pricing:**
- Instance hours (varies by type and size)
- Storage (GB-month)
- Provisioned IOPS (if using io1/io2)
- Backup storage (beyond free tier)
- Data transfer (cross-region replicas)

**Limitations:**
- Limited to 64TB storage (SQL Server: 16TB)
- Vertical scaling requires downtime
- Failover takes 1-2 minutes
- Limited to 5 Read Replicas
- No automatic read/write splitting
- Maintenance windows can impact availability

---

### 2. Amazon Aurora

**What it does:** AWS-engineered cloud-native relational database with MySQL and PostgreSQL compatibility, offering superior performance and availability.

**How it works:**
- Purpose-built for the cloud
- Separates compute and storage layers
- Storage automatically replicates 6 copies across 3 AZs
- Shared distributed storage architecture
- Quorum-based replication
- Continuous backup to S3

**Editions:**
- **Aurora MySQL-Compatible** - Up to 5x faster than MySQL
- **Aurora PostgreSQL-Compatible** - Up to 3x faster than PostgreSQL

**Key Features:**
- **High Performance:**
  - 5x throughput of MySQL on RDS
  - 3x throughput of PostgreSQL on RDS
  - Purpose-built storage engine
  - Low-latency reads from replicas (< 10ms lag)
- **Auto-Scaling Storage:**
  - Starts at 10GB, grows automatically to 128TB
  - No need to provision storage
  - Grows in 10GB increments
  - Storage never shrinks (pay for high watermark)
- **High Availability:**
  - 6 copies of data across 3 AZs (automatic)
  - Can lose 2 copies for writes, 3 for reads
  - Self-healing storage (continuous verification)
  - Automatic failover in < 30 seconds
  - No data loss during failover
- **Read Replicas:**
  - Up to 15 Aurora Replicas (vs 5 for RDS)
  - Sub-10ms replica lag
  - Can be promoted to primary
  - Auto-scaling for replicas
  - Reader endpoint (load balancing across replicas)
- **Endpoints:**
  - **Writer Endpoint** - Points to current primary (DNS, automatic failover)
  - **Reader Endpoint** - Load balances across all Read Replicas
  - **Custom Endpoint** - User-defined subset of instances
- **Backups:**
  - Automated continuous backup to S3
  - Point-in-time recovery (1-35 days)
  - No performance impact (unlike RDS)
  - Backtrack (rewind DB without restore) - MySQL only

**Advanced Features:**
- **Aurora Serverless:**
  - Auto-scaling compute capacity
  - Charged per second of usage (ACU - Aurora Capacity Units)
  - Pauses during inactivity (pay only for storage)
  - Perfect for unpredictable workloads
  - Aurora Serverless v2: Scales instantly, more granular
- **Aurora Global Database:**
  - Single database spanning multiple regions
  - Sub-second replication latency
  - Up to 5 secondary regions
  - < 1 second RPO, < 1 minute RTO
  - Read replicas in secondary regions
  - Disaster recovery and global reads
- **Aurora Multi-Master:**
  - Multiple write nodes (active-active)
  - Continuous availability
  - Immediate failover (no data loss)
  - Currently MySQL-compatible only
- **Aurora Machine Learning:**
  - Native integration with SageMaker and Comprehend
  - SQL-based ML predictions
  - No ML expertise required
- **Parallel Query:**
  - Pushes query processing to storage layer
  - Up to 100x faster analytical queries
  - Good for mixed OLTP/OLAP workloads
- **Backtrack:**
  - Rewind database to point in time (MySQL only)
  - No backup restore needed
  - Seconds to recover
  - Up to 72 hours back

**Cloning:**
- Create copy of database in minutes
- Copy-on-write protocol (shares original data)
- Fast and cost-effective
- Perfect for dev/test environments

**Performance:**
- 5x MySQL performance, 3x PostgreSQL
- Up to 128TB storage
- Millions of requests per second
- Sub-10ms replica lag
- Parallel query for analytics

**Best for:**
- Applications requiring high performance and scalability
- When you need more than 5 Read Replicas
- Global applications (Global Database)
- Unpredictable workloads (Serverless)
- Need faster failover (< 30s vs 1-2 min)
- Mixed OLTP/analytics (Parallel Query)
- Cloud-native applications
- When migrating from RDS for better performance
- Mission-critical applications

**⚠️ EXAM TIP:**
- Aurora is **always Multi-AZ** (6 copies across 3 AZs)
- **Faster failover** than RDS (< 30s vs 1-2 min)
- **Auto-scaling storage** (RDS requires manual)
- **15 Read Replicas** vs RDS's 5
- **Aurora Global Database** for global applications (< 1s replication)
- **Aurora Serverless** for unpredictable/intermittent workloads
- **More expensive** than RDS but higher performance
- Aurora **storage is shared** across all replicas (cost-effective)
- **Backtrack** feature unique to Aurora MySQL
- Choose Aurora when you need **maximum performance and scalability**

**Pricing:**
- Instance hours (typically 20% higher than RDS)
- Storage (GB-month) - only pay for used storage
- I/O requests (per million)
- Backup storage (beyond free tier)
- Data transfer
- Aurora Serverless: ACU-seconds

**Cost Optimization:**
- Serverless for intermittent workloads
- Reserved Instances for steady-state
- Monitor I/O costs (can be significant)
- Use storage auto-scaling (only pay for used)

**Limitations:**
- More expensive than RDS (20-30% higher)
- Storage cannot shrink (high watermark billing)
- I/O costs can add up
- Some engine-specific features not available
- Migration from RDS requires snapshot restore

---

### 3. Amazon DynamoDB

**What it does:** Fully managed NoSQL database providing single-digit millisecond latency at any scale, with flexible schema and automatic scaling.

**How it works:**
- Serverless architecture (no servers to manage)
- Distributed across multiple AZs automatically
- Key-value and document data model
- Partition-based storage and retrieval
- Automatic horizontal scaling
- Eventual or strong consistency options

**Data Model:**
- **Tables** - Collection of items
- **Items** - Collection of attributes (like rows)
- **Attributes** - Fundamental data element (like columns)
- **Primary Key:**
  - **Partition Key** (hash key) - Must be unique, determines partition
  - **Partition Key + Sort Key** (composite key) - Partition key doesn't need to be unique, sort key provides ordering
- **Secondary Indexes:**
  - **Global Secondary Index (GSI)** - Different partition and sort keys, eventually consistent
  - **Local Secondary Index (LSI)** - Same partition key, different sort key, must create at table creation

**Key Features:**
- **Performance:**
  - Single-digit millisecond latency (consistent)
  - Microsecond latency with DAX (caching)
  - Handles trillions of requests per day
  - Millions of requests per second
- **Scalability:**
  - Unlimited storage
  - Automatic horizontal partitioning
  - Auto-scaling for read/write capacity
  - No capacity planning (on-demand mode)
- **High Availability:**
  - Multi-AZ by default (3 AZs)
  - Automatic replication
  - 99.99% availability SLA
  - 99.999% for Global Tables
- **Capacity Modes:**
  - **On-Demand** - Pay per request, no capacity planning, scales automatically
  - **Provisioned** - Specify RCU/WCU, auto-scaling available, cheaper for predictable workloads
- **Consistency Models:**
  - **Eventually Consistent Reads** (default) - Maximum throughput, may reflect stale data
  - **Strongly Consistent Reads** - Always reflects latest write, uses 2x RCUs
  - **Transactional Reads/Writes** - ACID transactions across multiple items

**Advanced Features:**
- **DynamoDB Accelerator (DAX):**
  - In-memory cache for DynamoDB
  - Microsecond latency (vs milliseconds)
  - No application changes (drop-in replacement)
  - Write-through cache
  - Perfect for read-heavy workloads
  - Up to 10x performance improvement
- **Global Tables:**
  - Multi-region, multi-master replication
  - Active-active (read/write in any region)
  - Sub-second replication latency
  - 99.999% availability SLA
  - Automatic conflict resolution (last writer wins)
  - Perfect for global applications
- **DynamoDB Streams:**
  - Ordered stream of item-level changes
  - 24-hour retention
  - Triggers Lambda functions
  - Use cases: Replication, analytics, notifications, caching
  - Supports multiple consumers
- **Point-in-Time Recovery (PITR):**
  - Continuous backups (35 days retention)
  - Restore to any second in last 35 days
  - No performance impact
  - Must be enabled per table
- **On-Demand Backup:**
  - Full backup without affecting performance
  - Retained until explicitly deleted
  - Restore to new table
- **Time to Live (TTL):**
  - Automatically delete expired items
  - No additional cost
  - Great for session data, logs
  - Expires items after specified timestamp
- **DynamoDB Transactions:**
  - ACID transactions across multiple items/tables
  - All-or-nothing operations
  - Up to 100 items or 4MB per transaction
  - Coordinated insert, update, delete

**Indexes:**
- **Global Secondary Index (GSI):**
  - Different partition and sort keys
  - Can be created anytime
  - Eventually consistent reads only
  - Has own provisioned throughput
  - Up to 20 per table
- **Local Secondary Index (LSI):**
  - Same partition key, different sort key
  - Must be created at table creation
  - Strong or eventual consistency
  - Shares throughput with table
  - Up to 5 per table

**Capacity Units:**
- **Read Capacity Unit (RCU):**
  - 1 RCU = 1 strongly consistent read/sec for item up to 4KB
  - 1 RCU = 2 eventually consistent reads/sec for item up to 4KB
- **Write Capacity Unit (WCU):**
  - 1 WCU = 1 write/sec for item up to 1KB
- **Item size > 4KB** - Consumes additional RCUs/WCUs

**Query Patterns:**
- **GetItem** - Retrieve single item by primary key
- **Query** - Retrieve items with same partition key, can filter by sort key
- **Scan** - Read entire table (expensive, avoid in production)
- **BatchGetItem** - Retrieve up to 100 items
- **BatchWriteItem** - Write up to 25 items

**Best for:**
- Web and mobile applications
- Gaming (leaderboards, session state)
- IoT (sensor data, telemetry)
- Serverless applications (Lambda)
- Session management
- Real-time bidding
- Shopping carts
- Time-series data
- Metadata storage
- High-traffic applications with simple access patterns
- When you need single-digit millisecond latency at scale
- Schema flexibility required

**⚠️ EXAM TIP:**
- DynamoDB is **NoSQL** (key-value and document)
- **Always Multi-AZ** (3 AZs minimum)
- **Unlimited storage** (unlike RDS/Aurora)
- **Single-digit millisecond latency** (consistent at any scale)
- **DAX** for microsecond latency (in-memory cache)
- **Global Tables** for multi-region active-active
- **DynamoDB Streams** for event-driven architectures
- **On-Demand** mode = no capacity planning, pay per request
- **Provisioned** mode = cheaper for predictable workloads
- **Eventually consistent** reads are default (cheaper)
- **Strongly consistent** reads cost 2x RCUs
- Use **Query** not Scan (Scan reads entire table)
- **LSI** must be created at table creation, **GSI** can be added anytime
- Perfect for **serverless** architectures

**Pricing:**
- **On-Demand Mode:**
  - $1.25 per million write requests
  - $0.25 per million read requests
  - No minimum capacity
- **Provisioned Mode:**
  - $0.00065 per WCU-hour
  - $0.00013 per RCU-hour
  - Cheaper for consistent workloads
- **Storage:** $0.25/GB-month
- **DAX:** Instance hours (like ElastiCache)
- **Global Tables:** Replicated write requests charged
- **Backups:** On-demand and PITR charges apply
- **Data transfer:** Cross-region replication

**Cost Optimization:**
- Use on-demand for unpredictable workloads
- Use provisioned with auto-scaling for predictable
- Use TTL to delete expired data
- Use eventually consistent reads (half the cost)
- Right-size GSI capacity separately
- Monitor and eliminate unused GSIs

**Limitations:**
- Item size limit: 400KB
- Query only on primary key and sort key
- No joins (denormalization required)
- No complex queries (SQL-like)
- Limited aggregation capabilities
- Scan operations expensive
- LSI must be created at table creation
- Strong consistency not available on GSI

---

## Decision Tree

```
Need a database in AWS?
│
├─ What type of data and access patterns?
│  │
│  ├─ RELATIONAL DATA (SQL, Complex Queries, Joins)
│  │  │
│  │  ├─ What are your requirements?
│  │  │  │
│  │  │  ├─ Need maximum performance and scalability?
│  │  │  │  └─ YES → Amazon Aurora
│  │  │  │     - 5x MySQL, 3x PostgreSQL performance
│  │  │  │     - Up to 15 Read Replicas
│  │  │  │     - Auto-scaling storage (128TB)
│  │  │  │     - Faster failover (< 30s)
│  │  │  │     - Global Database for multi-region
│  │  │  │
│  │  │  ├─ Need specific database engine (Oracle, SQL Server)?
│  │  │  │  └─ YES → Amazon RDS
│  │  │  │     - Multiple engine options
│  │  │  │     - BYOL support
│  │  │  │     - Lift-and-shift migrations
│  │  │  │
│  │  │  ├─ Unpredictable/intermittent workload?
│  │  │  │  └─ YES → Aurora Serverless
│  │  │  │     - Auto-scaling compute
│  │  │  │     - Pauses when idle
│  │  │  │     - Pay per second
│  │  │  │
│  │  │  ├─ Budget-conscious, standard workload?
│  │  │  │  └─ YES → Amazon RDS
│  │  │  │     - Lower cost than Aurora
│  │  │  │     - Good for standard workloads
│  │  │  │
│  │  │  └─ Global application, multi-region?
│  │  │     └─ YES → Aurora Global Database
│  │  │        - Sub-second replication
│  │  │        - < 1 minute failover (RTO)
│  │  │        - Read replicas in 5 regions
│  │  │
│  │  └─ Performance needs?
│  │     │
│  │     ├─ MAXIMUM (millions of requests/sec)
│  │     │  └─ Aurora (15 read replicas, shared storage)
│  │     │
│  │     ├─ STANDARD (typical OLTP)
│  │     │  └─ RDS (5 read replicas sufficient)
│  │     │
│  │     └─ VARIABLE/UNPREDICTABLE
│  │        └─ Aurora Serverless (auto-scaling)
│  │
│  └─ KEY-VALUE / DOCUMENT DATA (NoSQL, Simple Access Patterns)
│     │
│     ├─ Performance requirements?
│     │  │
│     │  ├─ Millisecond latency at scale
│     │  │  └─ DynamoDB
│     │  │     - Single-digit millisecond latency
│     │  │     - Unlimited storage
│     │  │     - Horizontal scaling
│     │  │
│     │  └─ Microsecond latency required
│     │     └─ DynamoDB + DAX
│     │        - In-memory cache
│     │        - Microsecond response times
│     │        - No code changes
│     │
│     ├─ Capacity planning?
│     │  │
│     │  ├─ Unpredictable workload
│     │  │  └─ DynamoDB On-Demand
│     │  │     - No capacity planning
│     │  │     - Pay per request
│     │  │     - Auto-scales instantly
│     │  │
│     │  └─ Predictable workload
│     │     └─ DynamoDB Provisioned
│     │        - Lower cost
│     │        - Auto-scaling available
│     │        - Reserved capacity option
│     │
│     └─ Geographic requirements?
│        │
│        ├─ Single region
│        │  └─ DynamoDB (standard)
│        │
│        └─ Multi-region, global access
│           └─ DynamoDB Global Tables
│              - Active-active replication
│              - Sub-second latency
│              - 99.999% availability

└─ Use Case Patterns?
   │
   ├─ TRADITIONAL APPLICATIONS (existing SQL databases)
   │  └─ RDS (lift-and-shift) or Aurora (cloud-native)
   │
   ├─ HIGH-PERFORMANCE APPLICATIONS
   │  └─ Aurora or DynamoDB (depending on data model)
   │
   ├─ SERVERLESS APPLICATIONS (Lambda, API Gateway)
   │  └─ DynamoDB or Aurora Serverless
   │
   ├─ GAMING (leaderboards, session state)
   │  └─ DynamoDB (low latency, high throughput)
   │
   ├─ IOT (sensor data, telemetry)
   │  └─ DynamoDB (high write throughput, time-series)
   │
   ├─ MOBILE APPLICATIONS
   │  └─ DynamoDB (offline sync, flexible schema)
   │
   ├─ GLOBAL APPLICATIONS
   │  └─ Aurora Global Database or DynamoDB Global Tables
   │
   └─ ANALYTICAL WORKLOADS (OLAP)
      └─ Redshift (not covered here, but important distinction)
```

---

## Common Exam Scenarios

### Scenario 1: Lift-and-Shift MySQL Database to AWS

**Question:** Company wants to migrate on-premises MySQL database (2TB) to AWS with minimal changes. Need Multi-AZ for high availability and read replicas for reporting workload.

**Answer:** **Amazon RDS for MySQL**

**Why:**
- Direct lift-and-shift (same MySQL engine)
- Minimal application changes
- Multi-AZ for high availability (automatic failover)
- Read Replicas for reporting queries (offload read traffic)
- Managed service (automated backups, patching)
- Cost-effective for standard workloads

**Configuration:**
- Multi-AZ deployment for HA
- General Purpose SSD (gp3) storage
- Add 2-3 Read Replicas for reporting
- Enable automated backups (7-35 days retention)
- Enable Enhanced Monitoring

**Wrong Answers:**
- ❌ Aurora: More expensive, requires migration (not simple lift-and-shift)
- ❌ DynamoDB: NoSQL, requires complete application rewrite
- ❌ Self-managed on EC2: Lose managed service benefits

---

### Scenario 2: High-Performance E-Commerce Application

**Question:** E-commerce application requires relational database with millions of transactions per day, auto-scaling storage, and fastest possible failover. Currently using PostgreSQL. Need global presence with read replicas in 3 regions.

**Answer:** **Amazon Aurora PostgreSQL-Compatible with Global Database**

**Why:**
- 3x better performance than PostgreSQL on RDS
- Auto-scaling storage (10GB to 128TB, no provisioning)
- Faster failover (< 30 seconds vs 1-2 minutes)
- Up to 15 Read Replicas (vs RDS's 5)
- Aurora Global Database for multi-region (sub-second replication)
- Reader endpoint for automatic load balancing
- Better for high-traffic production workloads

**Configuration:**
- Aurora PostgreSQL cluster
- Primary in us-east-1 with 3 Read Replicas
- Global Database with secondary regions (eu-west-1, ap-southeast-1)
- Auto-scaling for replicas
- Enhanced Monitoring and Performance Insights

**⚠️ EXAM TIP:** "High performance" + "relational" + "global" + "auto-scaling storage" = Aurora Global Database

**Wrong Answers:**
- ❌ RDS PostgreSQL: Limited to 5 Read Replicas, no auto-scaling storage, slower failover
- ❌ DynamoDB: NoSQL, requires application rewrite
- ❌ Aurora without Global Database: No multi-region active reads

---

### Scenario 3: Unpredictable Dev/Test Environment

**Question:** Development team needs PostgreSQL database for testing. Usage is unpredictable - heavy during business hours, idle nights and weekends. Want to minimize costs.

**Answer:** **Aurora Serverless v2**

**Why:**
- Auto-scales compute capacity based on demand
- Pauses during inactivity (pay only for storage)
- Pay per second of usage (Aurora Capacity Units)
- No capacity planning needed
- PostgreSQL-compatible
- Can scale to zero

**Configuration:**
- Aurora Serverless v2 PostgreSQL
- Set min ACU (0.5 or 1) and max ACU (based on peak needs)
- Automatic pause after 5 minutes of inactivity
- Shared dev database across teams

**Cost Savings:** ~70% compared to always-on RDS instance

**⚠️ EXAM TIP:** "Unpredictable workload" + "cost optimization" + "relational" = Aurora Serverless

**Wrong Answers:**
- ❌ RDS: Always-on, paying for idle capacity
- ❌ Aurora provisioned: Always-on, more expensive
- ❌ DynamoDB: NoSQL, not suitable for SQL-based testing

---

### Scenario 4: Gaming Leaderboard with Millions of Users

**Question:** Mobile game requires leaderboard storing player scores, must support millions of reads/writes per second, single-digit millisecond latency, globally distributed players.

**Answer:** **DynamoDB with Global Tables**

**Why:**
- NoSQL perfect for key-value data (playerId -> score)
- Single-digit millisecond latency at any scale
- Handles millions of requests per second
- Unlimited storage (scales horizontally)
- Global Tables for multi-region active-active
- No server management (serverless)
- Auto-scaling

**Configuration:**
- Partition key: playerId
- Sort key: timestamp or gameId
- Global Secondary Index on score (for leaderboard queries)
- Global Tables in 3 regions (us-east-1, eu-west-1, ap-northeast-1)
- On-Demand capacity mode (unpredictable gaming traffic)
- DynamoDB Streams for real-time notifications

**Data Model:**
```
Table: GameScores
Primary Key: playerId (partition key) + timestamp (sort key)
Attributes: score, playerName, level
GSI: score-index (score as partition key for top scores query)
```

**⚠️ EXAM TIP:** "Gaming", "leaderboard", "millions of requests", "global users" = DynamoDB Global Tables

**Wrong Answers:**
- ❌ Aurora: Relational overhead, can't scale to millions of requests/sec easily
- ❌ RDS: Too slow, limited scalability, expensive at this scale
- ❌ ElastiCache: No persistence, not suitable as primary database

---

### Scenario 5: Oracle Database Migration with Compliance Requirements

**Question:** Enterprise application using Oracle 19c must migrate to AWS. Regulatory requirements mandate Oracle database for next 2 years. Need BYOL (Bring Your Own License) option. Multi-AZ deployment required.

**Answer:** **Amazon RDS for Oracle**

**Why:**
- Only managed Oracle option in AWS
- BYOL support (use existing licenses)
- Multi-AZ for high availability
- Automated backups and patching
- Compliance controls (encryption, audit logs)
- Read Replicas for reporting
- Can migrate later to Aurora PostgreSQL (via DMS)

**Configuration:**
- RDS for Oracle Enterprise Edition (BYOL)
- Multi-AZ deployment
- Provisioned IOPS SSD (io2) for consistent performance
- Encryption at rest (KMS)
- Enhanced Monitoring
- Automated backups (35 days retention)

**Migration Strategy:**
- Use AWS Database Migration Service (DMS)
- Test with minimal downtime
- Plan future migration to Aurora PostgreSQL to reduce costs

**⚠️ EXAM TIP:** "Oracle" + "BYOL" + "compliance" = RDS for Oracle (Aurora doesn't support Oracle)

**Wrong Answers:**
- ❌ Aurora: Doesn't support Oracle
- ❌ Self-managed on EC2: Lose managed benefits, compliance burden
- ❌ DynamoDB: NoSQL, complete rewrite needed

---

### Scenario 6: IoT Sensor Data Storage

**Question:** IoT platform collects data from 10 million sensors, each sending data every minute. Need to store time-series data with partition by deviceId, query by time range. Single-digit millisecond write latency required.

**Answer:** **DynamoDB with TTL**

**Why:**
- Handles high write throughput (millions per second)
- Single-digit millisecond write latency
- Unlimited storage
- Perfect for time-series data
- TTL automatically deletes old data (cost optimization)
- Serverless (no infrastructure management)
- Auto-scaling for unpredictable load

**Configuration:**
- Partition key: deviceId
- Sort key: timestamp
- On-Demand capacity (unpredictable sensor traffic)
- TTL on timestamp (delete after 30 days)
- DynamoDB Streams to Lambda for real-time processing
- Optionally archive to S3 via DynamoDB Streams

**Data Model:**
```
Table: SensorData
Primary Key: deviceId (partition key) + timestamp (sort key)
Attributes: temperature, humidity, location
TTL attribute: expirationTime (timestamp + 30 days)
```

**Data Flow:**
```
Sensors → IoT Core → Lambda → DynamoDB
                              ↓ (Streams)
                           Lambda → S3 (archival)
```

**⚠️ EXAM TIP:** "IoT", "time-series", "high write throughput", "deviceId" = DynamoDB with TTL

**Wrong Answers:**
- ❌ RDS/Aurora: Can't handle millions of writes per second cost-effectively
- ❌ Timestream: Good alternative, but DynamoDB is more common in exam
- ❌ Kinesis Data Streams: Streaming platform, not a database

---

### Scenario 7: SQL Server with AlwaysOn Availability Groups

**Question:** Migrate SQL Server 2019 with AlwaysOn Availability Groups to AWS. Need Multi-AZ deployment with automatic failover and Windows Authentication.

**Answer:** **Amazon RDS for SQL Server (Multi-AZ)**

**Why:**
- Only managed SQL Server option
- Multi-AZ provides synchronous replication (like AlwaysOn)
- Automatic failover (1-2 minutes)
- Windows Authentication support
- License Included or BYOL
- Managed backups and patching
- Native SQL Server features

**Configuration:**
- RDS for SQL Server Enterprise Edition (Multi-AZ)
- Provisioned IOPS SSD (io2)
- Join to AWS Managed Microsoft AD or on-premises AD
- Enable automated backups
- Enable Enhanced Monitoring

**Important Notes:**
- RDS Multi-AZ is NOT the same as AlwaysOn (simplified version)
- Standby cannot be used for reads
- For read replicas: Use RDS Read Replicas feature

**⚠️ EXAM TIP:** "SQL Server" + "Multi-AZ" = RDS for SQL Server (Aurora doesn't support SQL Server)

**Wrong Answers:**
- ❌ Aurora: Doesn't support SQL Server
- ❌ Self-managed on EC2: Lose managed benefits
- ❌ DynamoDB: NoSQL, complete rewrite

---

### Scenario 8: E-Commerce Shopping Cart

**Question:** E-commerce application needs session management and shopping cart storage. Requires fast reads/writes, auto-scaling, and ability to store user sessions that expire after 24 hours.

**Answer:** **DynamoDB with TTL**

**Why:**
- Single-digit millisecond read/write latency
- Perfect for session storage (key-value model)
- TTL automatically deletes expired sessions (cost optimization)
- Serverless and auto-scaling
- No capacity planning (On-Demand mode)
- High availability by default

**Configuration:**
- Partition key: sessionId
- Attributes: userId, cartItems, createdAt, expirationTime
- TTL on expirationTime (24 hours from creation)
- On-Demand capacity mode
- Optionally use DAX for microsecond read latency

**Data Model:**
```
Table: ShoppingSessions
Primary Key: sessionId
Attributes: userId, cartItems (list), totalPrice, createdAt, expirationTime
TTL: expirationTime (auto-delete after 24 hours)
```

**Alternative:** ElastiCache for Redis (in-memory, but requires capacity planning)

**⚠️ EXAM TIP:** "Session storage", "shopping cart", "TTL", "key-value" = DynamoDB with TTL

**Wrong Answers:**
- ❌ RDS/Aurora: Overkill for session storage, more expensive, slower
- ❌ S3: Object storage, not suitable for frequent updates
- ❌ ElastiCache: Good alternative but requires capacity planning

---

### Scenario 9: Read-Heavy Reporting Application

**Question:** Application has read-heavy reporting workload (95% reads, 5% writes). PostgreSQL database on RDS is reaching capacity limits. Need to scale read capacity without impacting write performance.

**Answer:** **Add Read Replicas to RDS PostgreSQL** OR **Migrate to Aurora PostgreSQL**

**Why:**

**Option 1: RDS Read Replicas** (if budget-constrained)
- Add up to 5 Read Replicas
- Route reporting queries to replicas
- Asynchronous replication (eventual consistency acceptable for reports)
- Can be in different regions
- Lower cost solution

**Option 2: Aurora PostgreSQL** (if need more scale)
- Up to 15 Read Replicas (vs RDS's 5)
- Reader endpoint automatically load balances
- Sub-10ms replica lag
- Better performance (3x PostgreSQL)
- Auto-scaling for replicas

**Configuration:**
- Add 3-5 Read Replicas in same region
- Route reporting queries to Reader endpoint (Aurora) or individual replicas (RDS)
- Keep writes on primary
- Use application-level routing or ProxySQL

**⚠️ EXAM TIP:**
- "Read-heavy" = Read Replicas
- "More than 5 read replicas needed" = Aurora
- Read Replicas do NOT help with write scaling

**Wrong Answers:**
- ❌ Vertical scaling: Helps but expensive and has limits
- ❌ DynamoDB: Requires complete rewrite
- ❌ ElastiCache: Cache layer, not replacement for database

---

### Scenario 10: Microsecond Latency Requirement

**Question:** Financial application requires microsecond response times for user profile lookups. Data stored in DynamoDB. Current millisecond latency not fast enough.

**Answer:** **DynamoDB Accelerator (DAX)**

**Why:**
- In-memory cache for DynamoDB
- Microsecond latency (vs milliseconds)
- Fully managed (like DynamoDB)
- Write-through cache (automatic cache updates)
- No application changes (drop-in replacement)
- Up to 10x performance improvement
- Item and query cache

**Configuration:**
- Create DAX cluster (3 nodes for HA)
- Point application to DAX endpoint instead of DynamoDB
- DAX automatically handles cache misses (queries DynamoDB)
- Writes go through DAX to DynamoDB
- TTL configurable for cache items

**Architecture:**
```
Application → DAX Cluster → DynamoDB
              (microsecond)   (millisecond)
              ↑ cache hit (fast)
              ↓ cache miss (queries DynamoDB)
```

**⚠️ EXAM TIP:** "DynamoDB" + "microsecond latency" = DAX

**Wrong Answers:**
- ❌ ElastiCache: Requires application changes, separate caching logic
- ❌ Aurora: Relational, not for DynamoDB data
- ❌ Global Tables: For multi-region, doesn't improve single-region latency

---

### Scenario 11: Disaster Recovery with RPO < 1 Second

**Question:** Mission-critical application requires disaster recovery with RPO < 1 second and RTO < 1 minute. Using Aurora MySQL. Need multi-region strategy.

**Answer:** **Aurora Global Database**

**Why:**
- Sub-second replication latency (< 1 second RPO)
- < 1 minute RTO for failover to secondary region
- Physical replication (faster than logical)
- Secondary regions can have up to 16 Read Replicas
- Can promote secondary to primary in < 1 minute
- No impact on primary region performance

**Configuration:**
- Primary Aurora cluster in us-east-1
- Secondary Aurora cluster in us-west-2 (Global Database)
- Optional: Add more secondary regions (up to 5 total)
- Read replicas in secondary region for local reads
- Automated monitoring with CloudWatch

**Failover Process:**
- Promote secondary region to primary (manual or automatic)
- Update DNS or application endpoint
- < 1 minute total downtime

**⚠️ EXAM TIP:**
- "Aurora" + "multi-region" + "< 1 second RPO" = Aurora Global Database
- For DynamoDB: Use Global Tables

**Wrong Answers:**
- ❌ RDS Read Replicas: Cross-region lag too high, manual promotion complex
- ❌ Aurora Read Replicas (cross-region): Higher lag than Global Database
- ❌ Database-level replication: More complex, not managed

---

### Scenario 12: Mixed OLTP and Analytics Workload

**Question:** Application has transactional workload (OLTP) but also needs to run analytical queries (OLAP) on same data. Analytical queries slowing down transactional performance on Aurora MySQL.

**Answer:** **Aurora with Parallel Query**

**Why:**
- Parallel Query pushes processing to storage layer
- Up to 100x faster for analytical queries
- No impact on transactional workload
- No need for separate ETL process
- Same database, optimized for both OLTP and OLAP
- Available for Aurora MySQL

**Configuration:**
- Enable Parallel Query on Aurora MySQL cluster
- Analytical queries automatically use Parallel Query
- Transactional queries unaffected
- Monitor with Performance Insights

**Alternative Approach:**
- Aurora Read Replicas for analytical queries (if Parallel Query not sufficient)
- Or: ETL to Redshift for complex analytics

**⚠️ EXAM TIP:** "Aurora" + "OLTP and OLAP" + "same database" = Parallel Query

**Wrong Answers:**
- ❌ Separate RDS for analytics: Data synchronization complexity, cost
- ❌ ETL to Redshift: More complex, data latency
- ❌ Read Replicas only: Helps but not as optimized as Parallel Query

---

## Key Differences Summary

### RDS vs Aurora

| Aspect | RDS | Aurora |
|--------|-----|--------|
| **Performance** | Baseline (1x) | 5x MySQL, 3x PostgreSQL |
| **Storage** | EBS-backed, up to 64TB | Distributed, auto-scaling to 128TB |
| **Storage Scaling** | Manual (cannot shrink) | Automatic (cannot shrink) |
| **Failover Time** | 1-2 minutes | < 30 seconds |
| **Read Replicas** | Up to 5 | Up to 15 |
| **Replica Lag** | Variable | < 10ms |
| **Backups** | Performance impact | No performance impact |
| **Pricing** | Lower | 20-30% higher |
| **Storage Architecture** | Instance storage | Shared storage across all instances |
| **Multi-AZ Cost** | 2x instance cost | Shared storage (cost-effective) |
| **Serverless Option** | No | Yes (Aurora Serverless) |
| **Global Database** | No | Yes (sub-second replication) |
| **Parallel Query** | No | Yes (Aurora MySQL) |
| **Backtrack** | No | Yes (Aurora MySQL) |
| **Best For** | Standard workloads, BYOL, specific engines | High performance, scalability, cloud-native |

**⚠️ EXAM TIP:**
- RDS = Standard performance, lower cost, specific engines (Oracle, SQL Server)
- Aurora = Higher performance, better scalability, cloud-native features
- Aurora costs more but provides better performance and features

---

### RDS Multi-AZ vs Read Replicas

| Aspect | Multi-AZ | Read Replicas |
|--------|----------|---------------|
| **Purpose** | High Availability (HA) | Read Scaling, DR |
| **Replication** | Synchronous | Asynchronous |
| **Standby Usage** | Cannot read from standby | Can read from replicas |
| **Failover** | Automatic (1-2 min) | Manual promotion |
| **Location** | Different AZ, same region | Same region or cross-region |
| **Number** | 1 standby | Up to 5 replicas (15 for Aurora) |
| **Use Case** | Production HA | Read scaling, reporting, DR |
| **Cost** | 2x instance cost | Additional instance cost per replica |

**⚠️ EXAM TIP:**
- **Multi-AZ** = Disaster Recovery within region, **NOT** for read scaling
- **Read Replicas** = Read scaling and cross-region DR
- You can have **both** Multi-AZ and Read Replicas simultaneously

**Common Misconception:** Multi-AZ standby can be used for read queries (FALSE)

---

### Aurora vs DynamoDB

| Aspect | Aurora | DynamoDB |
|--------|--------|----------|
| **Database Type** | Relational (SQL) | NoSQL (Key-Value/Document) |
| **Data Model** | Tables with schema, relationships | Flexible schema, items with attributes |
| **Query Language** | SQL | PartiQL or API calls |
| **Scaling** | Vertical + Read Replicas | Horizontal (unlimited) |
| **Storage Limit** | 128TB | Unlimited |
| **Latency** | Low milliseconds | Single-digit milliseconds |
| **Transactions** | ACID across tables | ACID within partition or transactions API |
| **Consistency** | Strong | Eventual or strong (configurable) |
| **Maintenance** | Maintenance windows | Fully serverless (no maintenance) |
| **Joins** | Yes (SQL joins) | No (denormalization required) |
| **Complex Queries** | Yes (SQL) | Limited (query/scan on keys only) |
| **Best For** | Complex queries, relationships, SQL | High throughput, simple access patterns, serverless |
| **Pricing Model** | Instance + storage + I/O | Capacity (RCU/WCU) + storage |

**⚠️ EXAM TIP:**
- **Aurora** when you need SQL, complex queries, joins, relationships
- **DynamoDB** when you need massive scale, simple access patterns, serverless
- Aurora = Structured data with relationships
- DynamoDB = Simple access patterns (get by key, query by key)

---

### DynamoDB: On-Demand vs Provisioned

| Aspect | On-Demand | Provisioned |
|--------|-----------|-------------|
| **Capacity Planning** | No planning needed | Must specify RCU/WCU |
| **Scaling** | Instant, automatic | Auto-scaling (with delay) |
| **Cost Model** | Pay per request | Pay per hour (RCU/WCU) |
| **Cost** | Higher per request | Lower for predictable workloads |
| **Best For** | Unpredictable workloads | Predictable, steady-state workloads |
| **Minimum Cost** | None (pay for actual usage) | Minimum RCU/WCU provisioned |
| **Throughput** | Unlimited (scales automatically) | Limited to provisioned capacity |
| **Spiky Traffic** | Perfect (no throttling) | May throttle without auto-scaling |
| **Reserved Capacity** | Not available | Available (up to 76% savings) |

**Cost Example:**
- Predictable 100 RCU, 50 WCU steady state:
  - Provisioned: ~$40/month
  - On-Demand: ~$280/month
  - **Winner: Provisioned (7x cheaper)**

- Unpredictable traffic (0-1000 requests/sec):
  - Provisioned: Must provision for peak (expensive)
  - On-Demand: Pay only for actual usage
  - **Winner: On-Demand**

**⚠️ EXAM TIP:**
- "Unpredictable", "spiky", "new application" = On-Demand
- "Predictable", "steady-state", "cost optimization" = Provisioned
- Can switch between modes once per 24 hours

---

### DynamoDB: Eventually Consistent vs Strongly Consistent

| Aspect | Eventually Consistent | Strongly Consistent |
|--------|----------------------|---------------------|
| **Data Freshness** | May reflect stale data | Always latest write |
| **Latency** | Lower | Slightly higher |
| **RCU Cost** | 1 RCU = 2 reads/sec (4KB) | 1 RCU = 1 read/sec (4KB) |
| **Cost** | 50% cheaper | 2x more expensive |
| **Availability** | Higher | Slightly lower |
| **Use Case** | Most applications | Financial, critical data |
| **Default** | Yes | Must explicitly request |

**⚠️ EXAM TIP:**
- Default is **eventually consistent** (cheaper, faster)
- Use **strongly consistent** when you must have latest data
- Read Replicas in Aurora are eventually consistent (similar concept)

---

### RDS Storage Types

| Storage Type | Use Case | IOPS | Throughput | Cost |
|--------------|----------|------|------------|------|
| **gp2** (General Purpose SSD) | Balanced price/performance | 3 IOPS/GB (max 16,000) | Up to 250 MB/s | $ |
| **gp3** (General Purpose SSD) | Cost-effective, configurable | 3,000-16,000 (independent) | 125-1,000 MB/s | $ (20% cheaper than gp2) |
| **io1** (Provisioned IOPS SSD) | I/O-intensive workloads | Up to 64,000 | Up to 1,000 MB/s | $$$ |
| **io2** (Provisioned IOPS SSD) | Mission-critical | Up to 256,000 | Up to 4,000 MB/s | $$$$ |
| **Magnetic** (deprecated) | Legacy | Limited | Limited | Legacy only |

**⚠️ EXAM TIP:**
- **gp3** = Best default choice (cheaper, better)
- **io1/io2** = High-performance, predictable IOPS
- gp3 allows you to provision IOPS and throughput independently

---

## Exam Strategy - Keywords to Watch For

### Service Selection by Keywords

| Keywords in Question | Likely Answer |
|---------------------|---------------|
| "MySQL", "PostgreSQL", "lift-and-shift", "standard workload" | **RDS** |
| "Oracle", "SQL Server", "BYOL", "specific engine" | **RDS** |
| "High performance", "auto-scaling storage", "15 read replicas" | **Aurora** |
| "Global database", "multi-region", "sub-second replication" | **Aurora Global Database** |
| "Unpredictable workload", "intermittent", "dev/test", "cost optimization" | **Aurora Serverless** |
| "NoSQL", "key-value", "document", "flexible schema" | **DynamoDB** |
| "Gaming", "leaderboard", "session storage", "shopping cart" | **DynamoDB** |
| "IoT", "sensor data", "time-series", "millions of writes" | **DynamoDB** |
| "Serverless", "Lambda", "API Gateway", "no server management" | **DynamoDB or Aurora Serverless** |
| "Microsecond latency", "in-memory cache", "DynamoDB" | **DynamoDB + DAX** |
| "Multi-region active-active", "global users", "NoSQL" | **DynamoDB Global Tables** |
| "ACID transactions", "complex queries", "joins", "relationships" | **Aurora or RDS** |

---

### Performance Keywords

| Performance Requirement | Answer |
|------------------------|--------|
| "5x MySQL performance" | **Aurora MySQL** |
| "3x PostgreSQL performance" | **Aurora PostgreSQL** |
| "Millions of requests per second" | **DynamoDB** |
| "Single-digit millisecond latency" | **DynamoDB** |
| "Microsecond latency" | **DynamoDB with DAX** |
| "Sub-second replication" | **Aurora Global Database** |
| "Fastest failover" (< 30s) | **Aurora** |
| "Read-heavy workload" | **Read Replicas (RDS/Aurora)** |
| "Read scaling beyond 5 replicas" | **Aurora (15 replicas)** |

---

### High Availability Keywords

| HA Requirement | Answer |
|----------------|--------|
| "Multi-AZ", "automatic failover", "high availability" | **RDS Multi-AZ or Aurora** |
| "Disaster recovery", "cross-region" | **Read Replicas (RDS/Aurora) or Global Database/Tables** |
| "RPO < 1 second" | **Aurora Global Database or DynamoDB Global Tables** |
| "RTO < 1 minute" | **Aurora Global Database** |
| "Active-active", "multi-region writes" | **DynamoDB Global Tables or Aurora Multi-Master** |
| "99.99% availability" | **All services (standard)** |
| "99.999% availability" | **DynamoDB Global Tables** |

---

### Scaling Keywords

| Scaling Requirement | Answer |
|--------------------|--------|
| "Auto-scaling storage" | **Aurora (automatic to 128TB)** |
| "Unlimited storage" | **DynamoDB** |
| "Horizontal scaling" | **DynamoDB** |
| "Vertical scaling" | **RDS/Aurora (change instance type)** |
| "Read scaling" | **Read Replicas** |
| "Write scaling" (relational) | **Aurora (better write performance)** |
| "Write scaling" (NoSQL) | **DynamoDB (partition-based)** |
| "No capacity planning" | **DynamoDB On-Demand or Aurora Serverless** |

---

### Cost Optimization Keywords

| Cost Requirement | Answer |
|------------------|--------|
| "Minimize costs", "budget-constrained" | **RDS (cheaper than Aurora)** |
| "Unpredictable workload", "cost optimization" | **Aurora Serverless or DynamoDB On-Demand** |
| "Predictable workload", "steady-state", "cost optimization" | **RDS or DynamoDB Provisioned** |
| "Pay per request" | **DynamoDB On-Demand** |
| "Reserved capacity", "long-term commitment" | **RDS Reserved Instances or DynamoDB Reserved Capacity** |
| "Intermittent usage", "pause when idle" | **Aurora Serverless** |

---

### Data Model Keywords

| Data Characteristic | Answer |
|--------------------|--------|
| "Relational", "SQL", "complex queries", "joins" | **RDS or Aurora** |
| "NoSQL", "key-value", "document", "flexible schema" | **DynamoDB** |
| "ACID transactions across tables" | **RDS or Aurora** |
| "Denormalized data" | **DynamoDB** |
| "Many-to-many relationships" | **RDS or Aurora** |
| "Simple access patterns" (get by ID) | **DynamoDB** |
| "Complex reporting", "aggregations" | **RDS or Aurora** |

---

### Use Case Keywords

**Traditional Applications:**
- "Lift-and-shift" → **RDS**
- "Existing database migration" → **RDS**
- "ERP", "CRM", "traditional enterprise app" → **RDS or Aurora**

**Modern Applications:**
- "Microservices" → **DynamoDB or Aurora Serverless**
- "Serverless architecture" → **DynamoDB or Aurora Serverless**
- "API-driven" → **DynamoDB**

**Specific Workloads:**
- "Gaming" (leaderboards, sessions) → **DynamoDB**
- "IoT" (sensor data, telemetry) → **DynamoDB**
- "Mobile applications" → **DynamoDB**
- "E-commerce" (shopping cart, sessions) → **DynamoDB**
- "Financial transactions" → **Aurora or RDS** (ACID)
- "Reporting/Analytics" → **Aurora with Read Replicas or Parallel Query**

---

## Common Misconceptions

### ❌ "Multi-AZ can be used for read scaling"
**✓ Reality:** Multi-AZ standby is for **high availability only**, not for reads. Use **Read Replicas** for read scaling.

### ❌ "Aurora is always better than RDS"
**✓ Reality:**
- Aurora is more expensive (20-30% higher)
- RDS is sufficient for standard workloads
- Choose Aurora for high performance, scalability needs
- Choose RDS for cost-conscious standard workloads

### ❌ "DynamoDB is always cheaper than RDS/Aurora"
**✓ Reality:**
- Depends on workload patterns
- Low-traffic: DynamoDB On-Demand can be cheaper
- High consistent traffic: RDS/Aurora may be cheaper
- Storage costs different: DynamoDB ($0.25/GB), RDS ($0.10-0.15/GB)

### ❌ "Read Replicas provide high availability"
**✓ Reality:**
- Read Replicas are for **read scaling and DR**, not HA
- For HA, use **Multi-AZ**
- Read Replicas use asynchronous replication (potential data loss)

### ❌ "DynamoDB Scan is efficient for queries"
**✓ Reality:**
- Scan reads **entire table** (very expensive)
- Always use **Query** (with partition key) or **GetItem**
- Use GSI/LSI for alternative query patterns
- Scan only for data export/analytics (rare operations)

### ❌ "Aurora Global Database is the same as Read Replicas"
**✓ Reality:**
- Global Database uses physical replication (faster, < 1s lag)
- Read Replicas use logical replication (higher lag)
- Global Database supports up to 16 replicas per region
- Global Database optimized for DR with < 1 minute RTO

### ❌ "RDS storage can be decreased"
**✓ Reality:**
- Storage can only **increase**, never decrease
- Aurora also cannot decrease (high watermark billing)
- Plan capacity carefully

### ❌ "DynamoDB can do complex joins like SQL"
**✓ Reality:**
- DynamoDB has **no joins**
- Must denormalize data (duplicate information)
- Use composite keys and GSI for relationships
- Not suitable for highly relational data

### ❌ "Aurora Serverless is always cheaper"
**✓ Reality:**
- Cheaper for **unpredictable/intermittent** workloads
- More expensive for **steady-state** workloads
- ACU pricing vs instance pricing comparison needed

### ❌ "All Read Replicas have same lag"
**✓ Reality:**
- RDS Read Replicas: Variable lag (seconds to minutes)
- Aurora Read Replicas: < 10ms lag (shared storage)
- Cross-region replicas have higher lag

---

## Cost Implications

### Cost Comparison (Approximate Monthly Costs)

#### Scenario 1: Small Application (10GB, db.t3.small, Multi-AZ)

| Service | Configuration | Approx. Cost |
|---------|--------------|--------------|
| **RDS MySQL** | t3.small Multi-AZ, 10GB gp3 | ~$60/month |
| **Aurora MySQL** | t3.small primary + replica, 10GB | ~$75/month |
| **DynamoDB** | 10GB storage, 10 WCU, 10 RCU provisioned | ~$7/month |

**⚠️ EXAM TIP:** DynamoDB much cheaper for low-traffic applications

---

#### Scenario 2: Medium Application (100GB, db.r5.large, Multi-AZ)

| Service | Configuration | Approx. Cost |
|---------|--------------|--------------|
| **RDS MySQL** | r5.large Multi-AZ, 100GB gp3 | ~$350/month |
| **Aurora MySQL** | r5.large + 2 replicas, 100GB | ~$600/month |
| **DynamoDB** | 100GB, 100 WCU, 200 RCU provisioned | ~$160/month |

**Analysis:**
- RDS cheapest for relational
- Aurora more expensive but better performance
- DynamoDB good if access patterns fit NoSQL

---

#### Scenario 3: High-Traffic Application (500GB, db.r5.2xlarge, Multi-AZ)

| Service | Configuration | Approx. Cost |
|---------|--------------|--------------|
| **RDS MySQL** | r5.2xlarge Multi-AZ, 500GB io2 (10K IOPS) | ~$2,000/month |
| **Aurora MySQL** | r5.2xlarge + 4 replicas, 500GB, I/O costs | ~$2,800/month |
| **DynamoDB** | 500GB, 1000 WCU, 2000 RCU provisioned | ~$1,500/month |
| **DynamoDB On-Demand** | 500GB, 10M writes, 20M reads/month | ~$2,800/month |

**Analysis:**
- At scale, DynamoDB provisioned very cost-effective
- Aurora provides better SQL performance
- On-Demand expensive for high steady traffic

---

### Cost Optimization Strategies

#### RDS Cost Optimization:
1. **Right-size instances** - Use Performance Insights to identify over-provisioned
2. **Use gp3 instead of gp2** - 20% cheaper, better performance
3. **Reserved Instances** - Up to 69% savings for 3-year commitment
4. **Delete unused snapshots** - Snapshots accumulate costs
5. **Use Read Replicas instead of larger instance** - Better price/performance
6. **Stop dev/test instances** - When not in use
7. **Use Single-AZ for dev/test** - 50% cost savings

#### Aurora Cost Optimization:
1. **Aurora Serverless for variable workloads** - Pay per second, pause when idle
2. **Reserved Instances** - Up to 69% savings
3. **Monitor I/O costs** - Can be significant, optimize queries
4. **Use Aurora Serverless v2** - More cost-effective than v1
5. **Right-size instances** - Use Performance Insights
6. **Delete old clusters** - Dev/test environments
7. **Backtrack instead of frequent snapshots** - Cheaper for short-term recovery

#### DynamoDB Cost Optimization:
1. **Use On-Demand for unpredictable** - Avoid over-provisioning
2. **Use Provisioned for steady-state** - Much cheaper
3. **Reserved Capacity** - Up to 76% savings (provisioned mode)
4. **Use eventually consistent reads** - 50% cheaper than strongly consistent
5. **Enable TTL** - Automatically delete expired data
6. **Optimize GSI** - Each GSI has separate capacity costs
7. **Use sparse indexes** - Reduce GSI storage costs
8. **Batch operations** - BatchGetItem, BatchWriteItem reduce requests
9. **Monitor and remove unused GSIs** - Reduce costs

---

### Cost Decision Matrix

```
Cost Priority + Workload Type → Recommended Service

LOW COST + Standard workload → RDS (possibly Reserved Instance)
LOW COST + Unpredictable → DynamoDB On-Demand or Aurora Serverless
LOW COST + High traffic → DynamoDB Provisioned

HIGH PERFORMANCE + SQL needed → Aurora
HIGH PERFORMANCE + Simple access patterns → DynamoDB

VARIABLE WORKLOAD + SQL → Aurora Serverless
VARIABLE WORKLOAD + NoSQL → DynamoDB On-Demand

STEADY WORKLOAD + SQL → RDS (Reserved) or Aurora (Reserved)
STEADY WORKLOAD + NoSQL → DynamoDB Provisioned (Reserved Capacity)
```

---

## Integration Patterns

### Pattern 1: Serverless Web Application

```
User → API Gateway → Lambda → DynamoDB
                      ↓
                   CloudWatch Logs
```

**Why:**
- Fully serverless (no infrastructure)
- Auto-scaling at all layers
- Pay per request
- Single-digit millisecond latency

**Configuration:**
- DynamoDB On-Demand mode
- Lambda with DynamoDB SDK
- API Gateway for REST/HTTP API
- Optionally add DAX for microsecond latency

**Use Cases:** Mobile apps, web apps, REST APIs

---

### Pattern 2: Traditional Three-Tier Application

```
Users → ALB → EC2 (App Tier) → RDS Multi-AZ
                                  ↓
                              Read Replicas (for reports)
```

**Why:**
- Traditional architecture
- SQL-based application
- Reporting offloaded to Read Replicas
- High availability with Multi-AZ

**Configuration:**
- RDS Multi-AZ for primary workload
- 2-3 Read Replicas for reporting
- Application connection pooling
- CloudWatch monitoring

**Use Cases:** Enterprise applications, ERP, CRM

---

### Pattern 3: High-Performance E-Commerce

```
Users → CloudFront → ALB → ECS (App) → Aurora (write)
                                          ↓
                                      Reader Endpoint (15 replicas)
        ↓
     DynamoDB (sessions/cart)
        ↓
      DAX (cache)
```

**Why:**
- Aurora for transactional data (products, orders)
- DynamoDB for session/cart (fast, scalable)
- DAX for microsecond latency
- Reader endpoint load balances across replicas

**Configuration:**
- Aurora MySQL with 15 Read Replicas
- DynamoDB for sessions with TTL
- DAX cluster (3 nodes)
- Auto-scaling for replicas

**Use Cases:** E-commerce, high-traffic applications

---

### Pattern 4: Global Application

```
Region 1: App → Aurora Global (primary) → DynamoDB Global Table
              ↓
Region 2: App → Aurora Global (secondary) → DynamoDB Global Table
              ↓
Region 3: App → Aurora Global (secondary) → DynamoDB Global Table
```

**Why:**
- Multi-region presence
- Low latency for global users
- Disaster recovery
- Aurora for relational data
- DynamoDB for user data (sessions, preferences)

**Configuration:**
- Aurora Global Database (1 primary, 2+ secondary)
- DynamoDB Global Tables (3+ regions)
- Route 53 for latency-based routing
- Local Read Replicas in each region

**Use Cases:** Global SaaS, gaming, social media

---

### Pattern 5: Event-Driven Architecture

```
DynamoDB → DynamoDB Streams → Lambda → (SNS/SQS/another service)
```

**Why:**
- Real-time processing of data changes
- Event-driven architecture
- Serverless
- Decoupled components

**Use Cases:**
- Real-time analytics
- Data replication
- Cache invalidation
- Notifications
- Audit logging

**Configuration:**
- Enable DynamoDB Streams
- Lambda as stream consumer
- Process INSERT, MODIFY, REMOVE events
- Fan out to multiple services via SNS

---

### Pattern 6: Caching Layer

```
Application → ElastiCache (Redis/Memcached) → RDS/Aurora
                    ↓ (cache miss)
              DynamoDB → DAX
                    ↓ (cache miss)
```

**Why:**
- Reduce database load
- Improve response times
- Cost optimization (fewer database queries)

**RDS/Aurora Caching:**
- ElastiCache in front of database
- Cache frequently accessed data
- Application manages cache invalidation

**DynamoDB Caching:**
- DAX (managed, automatic)
- No application changes
- Write-through cache

**⚠️ EXAM TIP:**
- ElastiCache for RDS/Aurora = Application-managed
- DAX for DynamoDB = Fully managed, transparent

---

### Pattern 7: Read/Write Splitting

```
Application (writes) → Aurora Writer Endpoint
Application (reads) → Aurora Reader Endpoint (load balances 15 replicas)
```

**Why:**
- Optimize read scaling
- Separate read and write traffic
- Automatic load balancing

**Configuration:**
- Aurora cluster with writer and reader endpoints
- Application routes writes to writer endpoint
- Application routes reads to reader endpoint
- Auto-scaling for Read Replicas

**Alternative for RDS:**
- Manually route to specific Read Replica endpoints
- Use ProxySQL or application logic

---

### Pattern 8: Disaster Recovery

**Strategy 1: Backup and Restore (RPO: hours, RTO: hours)**
```
RDS Primary → Automated Snapshots → Cross-region copy
```
- Lowest cost
- Longest recovery time
- Good for non-critical applications

**Strategy 2: Pilot Light (RPO: minutes, RTO: minutes)**
```
RDS Primary (us-east-1) → Cross-region Read Replica (us-west-2)
```
- Medium cost
- Moderate recovery time
- Promote replica to primary in DR

**Strategy 3: Hot Standby (RPO: seconds, RTO: seconds)**
```
Aurora Global Database
Primary region (us-east-1)
Secondary region (us-west-2) - continuous replication
```
- Highest cost
- Fastest recovery (< 1 min)
- Best for mission-critical

**Strategy 4: Active-Active (RPO: 0, RTO: 0)**
```
DynamoDB Global Tables (multi-region, multi-master)
```
- Highest cost
- No failover needed
- Best for global applications

---

## Advanced Exam Tips

### 1. Aurora Storage Architecture

**Key Concept:** Aurora separates compute and storage
- Storage layer: 6 copies across 3 AZs (automatic)
- Compute layer: 1 writer + up to 15 readers
- **All instances share the same storage** (cost-effective)
- Replication happens at storage layer (faster than RDS)

**⚠️ EXAM TIP:**
- Aurora replicas share storage (don't replicate entire database like RDS)
- Adding Aurora replica doesn't duplicate storage costs
- Faster replication (< 10ms lag)

---

### 2. RDS Read Replica Promotion

**Use Case:** Disaster recovery

**Process:**
1. Create cross-region Read Replica
2. Monitor replication lag
3. In DR event: Promote replica to standalone database
4. Update application endpoints
5. Original becomes unavailable

**Important:**
- Breaks replication relationship
- Application changes required (endpoint update)
- Some data loss possible (asynchronous replication)
- Cannot undo promotion

**⚠️ EXAM TIP:** Read Replica promotion for cross-region DR

---

### 3. DynamoDB Partition Key Design

**Critical for performance and cost:**

**Good Partition Key:**
- High cardinality (many distinct values)
- Uniform access pattern
- Examples: userId, deviceId, orderId

**Bad Partition Key:**
- Low cardinality (few distinct values)
- Non-uniform access (hot partitions)
- Examples: country (only ~200 values), status (active/inactive)

**Hot Partition Problem:**
- Uneven data distribution
- Throttling even with sufficient capacity
- Higher costs

**Solution:**
- Add randomness (sharding)
- Use composite key
- Example: `userId#timestamp` instead of just `userId`

**⚠️ EXAM TIP:** "DynamoDB throttling despite sufficient capacity" = hot partition, bad key design

---

### 4. Aurora Failover Priority

**Aurora Replica Tiers (0-15):**
- Tier 0 = highest priority
- Tier 15 = lowest priority
- Same tier = largest size promoted first

**Use Case:**
- Designate larger instances for failover
- Keep smaller instances for specific workloads

**⚠️ EXAM TIP:** Aurora failover can be controlled with promotion tiers

---

### 5. DynamoDB Global Secondary Index vs Local Secondary Index

**When to use GSI:**
- Different query patterns than primary key
- Can be added anytime
- Different partition and sort keys
- Eventually consistent only

**When to use LSI:**
- Same partition key, different sort key
- Need strong consistency for queries
- Must create at table creation
- Shares throughput with table

**⚠️ EXAM TIP:**
- GSI = Flexible, can add later, eventually consistent
- LSI = Limited, must create with table, strong consistency

---

### 6. RDS Enhanced Monitoring vs CloudWatch

**CloudWatch (default):**
- Hypervisor-level metrics
- Free (basic)
- Limited metrics

**Enhanced Monitoring:**
- Agent on database instance
- OS-level metrics (processes, threads)
- More granular (down to 1 second)
- Extra cost

**⚠️ EXAM TIP:** "Detailed OS-level metrics" or "process monitoring" = Enhanced Monitoring

---

### 7. Aurora Backtrack vs Point-in-Time Recovery

**Backtrack (MySQL only):**
- Rewind database to point in time **without restore**
- Seconds to complete
- Up to 72 hours
- In-place operation
- Database remains available

**Point-in-Time Recovery (all databases):**
- Restore to new database
- Minutes to hours (depends on size)
- Up to 35 days (RDS/Aurora)
- Creates new instance

**⚠️ EXAM TIP:**
- "Quickly undo mistake without restore" = Aurora Backtrack
- Backtrack only for Aurora MySQL

---

### 8. DynamoDB Capacity Calculation

**Read Capacity Units (RCU):**
- Strongly consistent: `CEILING(item size in KB / 4) * reads/sec`
- Eventually consistent: `CEILING(item size in KB / 4) * reads/sec / 2`

**Write Capacity Units (WCU):**
- `CEILING(item size in KB / 1) * writes/sec`

**Example:**
- Item size: 6KB
- 100 reads/sec (strongly consistent)
- 50 writes/sec

**Calculation:**
- RCU: `CEILING(6/4) = 2` per read × 100 = **200 RCU**
- WCU: `CEILING(6/1) = 6` per write × 50 = **300 WCU**

**⚠️ EXAM TIP:** Know how to calculate RCU/WCU for cost estimation

---

### 9. Aurora Multi-Master

**What it is:**
- Multiple write nodes (active-active)
- All nodes can read and write
- Continuous availability (no failover)
- MySQL-compatible only

**Use Cases:**
- Continuous write availability
- Application-level sharding
- Sub-second failover

**Limitations:**
- More complex (application awareness)
- Conflict resolution needed
- Currently MySQL only

**⚠️ EXAM TIP:**
- Multi-Master for continuous write availability (no downtime)
- Different from Global Database (multi-region reads)

---

### 10. Database Migration Strategies

**Strategy 1: Snapshot and Restore**
- Create snapshot → Restore in AWS
- Downtime required (hours)
- Simple, low cost
- For small databases or acceptable downtime

**Strategy 2: AWS Database Migration Service (DMS)**
- Continuous replication
- Minimal downtime
- Homogeneous (MySQL → MySQL) or heterogeneous (Oracle → PostgreSQL)
- For large databases or low downtime tolerance

**Strategy 3: Native Replication**
- Database-native features (MySQL binlog, PostgreSQL streaming)
- Lowest latency
- More complex
- For expert users

**Strategy 4: Export/Import**
- Export data → Transfer → Import
- For small databases
- Simple tools (mysqldump, pg_dump)

**⚠️ EXAM TIP:**
- "Minimal downtime migration" = AWS DMS
- "Homogeneous" = same engine
- "Heterogeneous" = different engines (use DMS with Schema Conversion Tool)

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE SERVICE SELECTOR                    │
└─────────────────────────────────────────────────────────────────┘

BY DATA MODEL:
├─ Relational (SQL, complex queries, joins) → RDS or Aurora
└─ NoSQL (key-value, document) → DynamoDB

BY PERFORMANCE NEED:
├─ Standard OLTP → RDS
├─ High-performance OLTP → Aurora
├─ Millions of requests/sec → DynamoDB
└─ Microsecond latency → DynamoDB + DAX

BY SCALING NEED:
├─ Auto-scaling storage → Aurora
├─ Unlimited storage → DynamoDB
├─ Read scaling (< 5 replicas) → RDS Read Replicas
├─ Read scaling (> 5 replicas) → Aurora Read Replicas
└─ Write scaling → DynamoDB (horizontal)

BY AVAILABILITY:
├─ Multi-AZ HA → RDS Multi-AZ or Aurora (built-in)
├─ Fastest failover (< 30s) → Aurora
├─ Global multi-region → Aurora Global DB or DynamoDB Global Tables
└─ Active-active multi-region → DynamoDB Global Tables

BY WORKLOAD PATTERN:
├─ Predictable, steady-state → RDS, Aurora, or DynamoDB Provisioned
├─ Unpredictable, variable → Aurora Serverless or DynamoDB On-Demand
└─ Intermittent (can pause) → Aurora Serverless

BY COST:
├─ Lowest cost relational → RDS
├─ Best performance/cost → Aurora (for high performance needs)
└─ NoSQL cost-effective → DynamoDB Provisioned (predictable) or On-Demand (variable)

┌─────────────────────────────────────────────────────────────────┐
│                      EXAM DECISION MATRIX                        │
└─────────────────────────────────────────────────────────────────┘

Question Says...                            → Answer
────────────────────────────────────────────────────────────────
"MySQL/PostgreSQL", "lift-and-shift"       → RDS
"Oracle", "SQL Server", "BYOL"              → RDS (only option)
"High performance", "5x MySQL"              → Aurora
"Auto-scaling storage", "15 read replicas"  → Aurora
"Global database", "sub-second replication" → Aurora Global Database
"Unpredictable workload", "dev/test"        → Aurora Serverless
"NoSQL", "key-value", "flexible schema"     → DynamoDB
"Gaming", "leaderboard", "sessions"         → DynamoDB
"IoT", "sensor data", "time-series"         → DynamoDB
"Microsecond latency"                       → DynamoDB + DAX
"Global users", "active-active"             → DynamoDB Global Tables
"Serverless", "Lambda", "no servers"        → DynamoDB or Aurora Serverless
"Multi-AZ", "high availability"             → RDS Multi-AZ or Aurora
"Read scaling", "reporting"                 → Read Replicas
"Fastest failover" (< 30s)                  → Aurora
"ACID transactions", "complex queries"      → RDS or Aurora
"Millions of writes per second"             → DynamoDB

┌─────────────────────────────────────────────────────────────────┐
│                     FEATURE COMPARISON                           │
└─────────────────────────────────────────────────────────────────┘

Feature              │ RDS    │ Aurora │ DynamoDB
─────────────────────┼────────┼────────┼──────────
Database Type        │ SQL    │ SQL    │ NoSQL
Max Storage          │ 64TB   │ 128TB  │ Unlimited
Auto-scaling Storage │ Manual │ Auto   │ N/A (unlimited)
Read Replicas        │ 5      │ 15     │ N/A (partition-based)
Failover Time        │ 1-2min │ <30s   │ Instant (no failover)
Multi-AZ Default     │ No     │ Yes    │ Yes
Serverless Option    │ No     │ Yes    │ Yes (inherent)
Global Multi-region  │ No     │ Yes    │ Yes
Maintenance Windows  │ Yes    │ Yes    │ No
Query Language       │ SQL    │ SQL    │ PartiQL/API
Joins                │ Yes    │ Yes    │ No
Complex Queries      │ Yes    │ Yes    │ Limited
Horizontal Scaling   │ No     │ No     │ Yes
Microsecond Latency  │ No     │ No     │ Yes (with DAX)

┌─────────────────────────────────────────────────────────────────┐
│                   HIGH AVAILABILITY COMPARISON                   │
└─────────────────────────────────────────────────────────────────┘

Feature                     │ RDS Multi-AZ │ Aurora │ DynamoDB
────────────────────────────┼──────────────┼────────┼──────────
Replication                 │ Sync         │ 6-way  │ 3-way
Failover Time               │ 1-2 min      │ <30s   │ N/A
Standby for Reads           │ No           │ Yes    │ N/A
Cross-region                │ Read Replica │ Global │ Global Tables
Active-active Multi-region  │ No           │ No*    │ Yes
Data Copies                 │ 2 (primary+standby)│6 (3 AZs)│3+ (AZs)

* Aurora Multi-Master supports active-active in single region

┌─────────────────────────────────────────────────────────────────┐
│                      PRICING QUICK REFERENCE                     │
└─────────────────────────────────────────────────────────────────┘

RDS:
├─ Instance hours ($0.034-$14+/hour depending on type)
├─ Storage (gp3: $0.115/GB-month, io2: $0.125-0.149/GB-month)
├─ Provisioned IOPS ($0.10/IOPS-month for io2)
├─ Backup storage (free up to DB size, then $0.095/GB-month)
└─ Data transfer (cross-region Read Replicas)

Aurora:
├─ Instance hours (~20% higher than RDS)
├─ Storage ($0.10/GB-month, only used storage)
├─ I/O requests ($0.20/million requests)
├─ Backup storage ($0.021/GB-month beyond retention)
└─ Serverless: $0.12/ACU-hour + storage + I/O

DynamoDB:
├─ On-Demand: $1.25/million write requests, $0.25/million read requests
├─ Provisioned: $0.00065/WCU-hour, $0.00013/RCU-hour
├─ Storage: $0.25/GB-month
├─ DAX: $0.04-$4.35/hour (instance type)
└─ Global Tables: Replicated write requests charged

Cost Optimization:
├─ RDS: Reserved Instances (up to 69% savings)
├─ Aurora: Serverless for variable, Reserved for steady
├─ DynamoDB: Provisioned for steady, On-Demand for variable
└─ All: Delete unused resources, snapshots, replicas
```

---

## Best Practices for the Exam

### 1. Always Consider Data Model First
- **Relational data with complex queries** → RDS or Aurora
- **Simple key-value access patterns** → DynamoDB
- Don't force NoSQL when SQL is better (and vice versa)

### 2. Performance Requirements Drive Choice
- **Standard performance** → RDS
- **High performance relational** → Aurora
- **Massive scale, simple queries** → DynamoDB

### 3. Cost vs Performance Trade-off
- RDS = Lower cost, standard performance
- Aurora = Higher cost, better performance
- Don't choose Aurora if RDS performance is sufficient

### 4. Multi-AZ is for HA, Not Read Scaling
- Multi-AZ = Disaster recovery (automatic failover)
- Read Replicas = Read scaling + cross-region DR
- Common exam trap: suggesting Multi-AZ for read performance

### 5. Understand Failover Times
- RDS Multi-AZ: 1-2 minutes
- Aurora: < 30 seconds
- DynamoDB: No failover (distributed)
- Critical for RTO requirements

### 6. Global Application Patterns
- Aurora Global Database: SQL, sub-second replication, < 1 min failover
- DynamoDB Global Tables: NoSQL, sub-second replication, active-active
- Cross-region Read Replicas: Higher latency, manual promotion

### 7. Serverless Patterns
- Aurora Serverless: Unpredictable SQL workloads
- DynamoDB: Inherently serverless (On-Demand or Provisioned)
- Lambda integration: Both support, but DynamoDB more common

### 8. Capacity Planning
- RDS/Aurora: Instance sizing, storage provisioning
- DynamoDB: RCU/WCU calculation or On-Demand
- Aurora storage auto-scales, RDS requires manual

### 9. Read Scaling Strategies
- RDS: Up to 5 Read Replicas
- Aurora: Up to 15 Read Replicas + Reader endpoint
- DynamoDB: Partition-based, automatic

### 10. Migration Strategies
- **Same engine, minimal downtime** → AWS DMS
- **Different engines** → AWS DMS + Schema Conversion Tool
- **Acceptable downtime** → Snapshot/restore
- **Oracle/SQL Server to Aurora** → DMS with Babelfish (PostgreSQL)

---

## Comparison Summary Table

| When You Need... | Choose This |
|------------------|-------------|
| Lift-and-shift existing SQL database | **RDS** |
| Specific engine (Oracle, SQL Server) | **RDS** |
| Maximum SQL performance and scalability | **Aurora** |
| Auto-scaling storage (SQL) | **Aurora** |
| More than 5 Read Replicas | **Aurora** |
| Unpredictable SQL workload | **Aurora Serverless** |
| Global SQL database | **Aurora Global Database** |
| NoSQL key-value store | **DynamoDB** |
| Millions of requests per second | **DynamoDB** |
| Microsecond latency | **DynamoDB + DAX** |
| Global NoSQL (active-active) | **DynamoDB Global Tables** |
| Serverless architecture | **DynamoDB or Aurora Serverless** |
| Gaming leaderboards | **DynamoDB** |
| IoT time-series data | **DynamoDB** |
| Session management | **DynamoDB** |
| Complex queries and joins | **RDS or Aurora** |
| ACID transactions across tables | **RDS or Aurora** |
| Lowest cost relational | **RDS** |
| No capacity planning | **DynamoDB On-Demand or Aurora Serverless** |

---

**Good luck on your AWS SA Pro exam!**
