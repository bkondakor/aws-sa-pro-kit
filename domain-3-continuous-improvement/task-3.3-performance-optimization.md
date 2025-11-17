# Task 3.3: Determine a Strategy to Improve Performance

## Overview

Performance optimization focuses on improving the speed, efficiency, and responsiveness of AWS solutions. This involves analyzing bottlenecks, implementing caching strategies, optimizing compute and database resources, and improving network performance.

**Weight:** ~20% of Domain 3 (5% of total exam)

---

## Core Concepts

### Performance Optimization Framework

```
1. MEASURE → Establish baseline and identify bottlenecks
2. ANALYZE → Determine root causes
3. OPTIMIZE → Implement improvements
4. VALIDATE → Verify performance gains
5. MONITOR → Continuous performance tracking
```

### Performance Metrics Hierarchy

**User-Centric Metrics (Most Important):**
- Response time / latency (p50, p90, p99)
- Throughput (requests per second)
- Error rate

**System Metrics:**
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput

**Application Metrics:**
- Database query time
- API call duration
- Cache hit ratio
- Queue depth

---

## Caching Strategies

### Multi-Layer Caching Architecture

```
User Request
  ↓
[1] CloudFront (Edge Cache) ← Static content, API responses
  ↓
[2] API Gateway Cache ← API responses
  ↓
[3] Application Cache (ElastiCache) ← Database queries, session data
  ↓
[4] Database Cache (RDS/Aurora) ← Query results
  ↓
[5] Disk Cache (EBS) ← Block-level caching
```

### Caching Decision Tree

```
What to cache?
├─ Static assets (images, CSS, JS) → CloudFront
├─ API responses → API Gateway cache or ElastiCache
├─ Database query results → ElastiCache
├─ Session data → ElastiCache
└─ Computed results → ElastiCache

How long to cache?
├─ Immutable content → Cache forever (with versioning)
├─ Semi-static content → Hours to days
├─ Dynamic content → Seconds to minutes
└─ User-specific content → Session duration
```

---

## Amazon CloudFront - Content Delivery Network

**What it does:** Global content delivery network with 450+ edge locations

### CloudFront Performance Features

**1. Edge Caching**
- Caches content at edge locations closest to users
- Reduces latency by 50-90% for global users
- Reduces origin load

**2. Origin Shield**
- Additional caching layer between edge and origin
- Increases cache hit ratio by 10-20%
- Reduces origin load further
- Best for: Origins that can't handle high request rates

**3. Lambda@Edge vs CloudFront Functions**

| Feature | CloudFront Functions | Lambda@Edge |
|---------|---------------------|-------------|
| **Language** | JavaScript | Node.js, Python |
| **Execution Location** | Edge locations only | Edge + Regional edge caches |
| **Max Duration** | <1ms | 5-10 seconds |
| **Max Memory** | 2 MB | 128-10,240 MB |
| **Use Case** | Simple transformations | Complex logic |
| **Pricing** | $0.10 per 1M invocations | $0.60 per 1M + duration |
| **Network Access** | No | Yes |

**When to Use Which:**
```
CloudFront Functions:
- URL rewrites/redirects
- Header manipulation
- Request validation
- A/B testing
- Cache key normalization

Lambda@Edge:
- Image transformation
- Authentication/authorization
- Origin selection logic
- API aggregation
- A/B testing with external data
```

### CloudFront Caching Best Practices

**1. Cache Behavior Configuration**
```
Static Content (images, CSS, JS):
- TTL: 1 year (31,536,000 seconds)
- Forward headers: None
- Forward query strings: No
- Forward cookies: None

Dynamic Content (APIs):
- TTL: 0-300 seconds
- Forward headers: Authorization, User-Agent
- Forward query strings: All
- Forward cookies: Session cookies only

Mixed Content:
- Use multiple cache behaviors
- Match patterns (/api/*, /static/*, etc.)
```

**2. Cache Key Optimization**
```
Bad: Include all headers/cookies/query strings
  - Each variation creates separate cache entry
  - Low cache hit ratio
  - Poor performance

Good: Only include necessary parameters
  - Normalize URLs (lowercase, sort parameters)
  - Use CloudFront Functions to normalize cache keys
  - High cache hit ratio
  - Better performance
```

**3. Compression**
```
Enable Gzip/Brotli compression:
- Reduces transfer size by 70-90%
- Faster downloads
- Lower data transfer costs

CloudFront automatically compresses:
- text/html
- text/css
- application/javascript
- application/json
- And 20+ more MIME types
```

**4. HTTP/2 and HTTP/3**
- HTTP/2: Enabled by default (multiplexing, header compression)
- HTTP/3 (QUIC): Available, provides better performance on lossy networks
- Reduces latency by 15-30% compared to HTTP/1.1

### Real-World CloudFront Optimization

**Scenario: E-commerce site with global users**

**Before:**
- Origin in us-east-1
- Average latency for EU users: 200ms
- Average latency for APAC users: 350ms
- Origin load: 10,000 requests/second

**After (with CloudFront):**
- Edge locations in 90+ countries
- Average latency for EU users: 30ms (85% improvement)
- Average latency for APAC users: 40ms (88% improvement)
- Origin load: 500 requests/second (95% offloaded to cache)
- Cache hit ratio: 85%

**Configuration:**
```
Cache Behaviors:
1. /static/* → TTL: 1 year, no forwarding
2. /api/catalog/* → TTL: 5 minutes, forward all query strings
3. /api/cart/* → No caching, forward all headers/cookies
4. Default → TTL: 10 minutes

Optimizations:
- Origin Shield enabled in us-east-1
- Gzip/Brotli compression enabled
- HTTP/3 enabled
- Signed URLs for premium content
```

---

## Amazon ElastiCache - In-Memory Caching

**What it does:** Managed Redis and Memcached for sub-millisecond latency

### ElastiCache Redis vs Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| **Data Structures** | Strings, Lists, Sets, Hashes, Sorted Sets, Bitmaps, HyperLogLogs, Geospatial | Strings only |
| **Persistence** | Optional (RDB snapshots, AOF logs) | None |
| **Replication** | Yes (up to 5 read replicas) | No |
| **Multi-AZ** | Yes (automatic failover) | No |
| **Backup/Restore** | Yes | No |
| **Pub/Sub** | Yes | No |
| **Transactions** | Yes | No |
| **Lua Scripts** | Yes | No |
| **Clustering** | Yes (up to 500 nodes, 250 shards) | Yes (up to 40 nodes) |
| **Multi-threading** | No (single-threaded per shard) | Yes |
| **Use Case** | Complex data, persistence needed, pub/sub | Simple key-value, highest throughput |

**Exam Tip:**
```
Use Redis when you need:
- Data persistence
- Complex data types
- Replication/high availability
- Pub/sub messaging
- Sorted sets (leaderboards)
- Geospatial queries

Use Memcached when you need:
- Pure caching (no persistence)
- Multi-threaded performance
- Simplest possible caching
- Horizontal scaling with partitioning
```

### ElastiCache Caching Patterns

**1. Lazy Loading (Cache-Aside)**
```python
def get_user(user_id):
    # Try cache first
    user = cache.get(f"user:{user_id}")

    if user is None:
        # Cache miss - fetch from database
        user = db.query("SELECT * FROM users WHERE id = ?", user_id)
        # Store in cache for future requests
        cache.set(f"user:{user_id}", user, ttl=3600)

    return user

Pros:
- Only requested data is cached
- Node failures non-fatal (just cache misses)

Cons:
- Initial request is slow (cache miss)
- Stale data possible
```

**2. Write-Through**
```python
def update_user(user_id, data):
    # Update database
    db.execute("UPDATE users SET ... WHERE id = ?", user_id, data)

    # Update cache immediately
    cache.set(f"user:{user_id}", data, ttl=3600)

Pros:
- Cache always up-to-date
- No cache misses on reads

Cons:
- Write penalty (two operations)
- Unused data cached (wasteful)
- Cache churn for infrequently read data
```

**3. Hybrid Pattern (Best Practice)**
```python
# Combine lazy loading + write-through

# Reads: Lazy loading
def get_user(user_id):
    user = cache.get(f"user:{user_id}")
    if user is None:
        user = db.query("SELECT * FROM users WHERE id = ?", user_id)
        cache.set(f"user:{user_id}", user, ttl=3600)
    return user

# Writes: Write-through + invalidation
def update_user(user_id, data):
    db.execute("UPDATE users SET ... WHERE id = ?", user_id, data)
    cache.delete(f"user:{user_id}")  # Invalidate instead of update

Pros:
- Best of both worlds
- Handles stale data
- Efficient cache usage
```

**4. Time-To-Live (TTL) Strategy**
```
Short TTL (seconds - minutes):
- Frequently changing data
- User-generated content
- Prices, inventory

Medium TTL (minutes - hours):
- Product catalogs
- Configuration data
- Semi-static content

Long TTL (hours - days):
- Reference data
- Static content
- Rarely changing data

Infinite TTL:
- Immutable data (invalidate on change)
- Historical records
```

### ElastiCache Performance Optimization

**1. Right-Sizing Nodes**

**Memory-Optimized (r6g, r7g family):**
```
Use for:
- Large datasets
- Cache hit ratio > memory optimization priority
- Complex data structures (Redis)

Example: r7g.xlarge
- 4 vCPU
- 32 GiB memory
- Network: Up to 15 Gbps
- Cost: ~$0.30/hour
```

**Compute-Optimized (m6g, m7g family):**
```
Use for:
- Balanced workloads
- Moderate dataset sizes
- CPU-intensive operations

Example: m7g.xlarge
- 4 vCPU
- 16 GiB memory
- Network: Up to 15 Gbps
- Cost: ~$0.20/hour
```

**2. Connection Pooling**
```python
# Bad: Create new connection for each request
def get_data(key):
    client = redis.Redis(host='cache.xxx.cache.amazonaws.com')
    value = client.get(key)
    client.close()
    return value
# Problem: Connection overhead, resource exhaustion

# Good: Reuse connections with pool
connection_pool = redis.ConnectionPool(
    host='cache.xxx.cache.amazonaws.com',
    max_connections=50,
    socket_timeout=2,
    socket_connect_timeout=2
)

def get_data(key):
    client = redis.Redis(connection_pool=connection_pool)
    value = client.get(key)
    return value
# Benefit: 10-100x faster, no connection overhead
```

**3. Read Replica Configuration**

**Redis Cluster Mode Disabled (Traditional):**
```
Primary: Handles all writes
Replicas (up to 5): Handle reads

Use for:
- Single-shard datasets (<300 GB)
- Simple failover requirements
- Read-heavy workloads

Endpoint Strategy:
- Write: Primary endpoint
- Read: Reader endpoint (load balances across replicas)
```

**Redis Cluster Mode Enabled (Scalable):**
```
Multiple shards (up to 500 nodes, 250 shards)
Each shard: 1 primary + up to 5 replicas

Use for:
- Large datasets (>300 GB)
- Horizontal scaling requirements
- High write throughput

Benefits:
- Automatic sharding
- Linear scalability
- Higher aggregate throughput
```

**4. Monitoring and Tuning**

**Key Metrics:**
```
CacheHitRate:
- Target: > 80%
- < 80%: Increase cache size or adjust TTL

CPUUtilization:
- Redis: Keep < 90% (single-threaded)
- Memcached: Can run at 90%+

Evictions:
- Target: 0
- > 0: Increase memory or reduce TTL

CurrConnections:
- Monitor for connection leaks
- Set max_connections appropriately

NetworkBytesIn/Out:
- Monitor for bandwidth saturation
- Upgrade instance type if needed

ReplicationLag (Redis):
- Target: < 10ms
- > 100ms: Investigate network or load issues
```

### ElastiCache for DAX (DynamoDB Accelerator)

**What it is:** Fully managed, in-memory cache for DynamoDB

**Performance:**
- Microsecond latency (vs milliseconds for DynamoDB)
- 10x performance improvement
- Millions of requests per second

**When to Use:**
```
Use DAX:
- DynamoDB read-heavy workloads
- Sub-millisecond latency required
- Eventually consistent reads acceptable
- Need caching with zero code changes

Don't Use DAX:
- Write-heavy workloads
- Strongly consistent reads required
- Complex queries (use ElastiCache Redis instead)
- Cost-sensitive (DAX is expensive)
```

**Architecture:**
```
Application → DAX Cluster → DynamoDB

Cache Types:
1. Item Cache: Individual items (GetItem, BatchGetItem)
2. Query Cache: Query and Scan results

Write-Through:
- Writes go to DAX and DynamoDB simultaneously
- Cache always consistent with DynamoDB
```

---

## Database Performance Optimization

### Amazon RDS Performance Features

**1. Read Replicas**

**Use Cases:**
- Offload read traffic from primary
- Analytics/reporting on replica
- Cross-region disaster recovery

**Configuration:**
```
Primary: us-east-1 (writes)
Read Replica 1: us-east-1 (real-time app reads)
Read Replica 2: us-east-1 (analytics)
Read Replica 3: eu-west-1 (cross-region reads)

Application Code:
- Writes → primary endpoint
- Reads → read replica endpoints (with load balancing)
```

**Limitations:**
- MySQL/PostgreSQL: Up to 5 read replicas
- MariaDB: Up to 5 read replicas
- SQL Server: No read replicas (use Always On)
- Oracle: Up to 5 read replicas (Enterprise Edition only)

**2. RDS Proxy**

**What it does:** Connection pooling for RDS/Aurora

**Benefits:**
- Reduces connection overhead (90% reduction in resources)
- Handles connection spikes gracefully
- Improves failover time (66% faster)
- IAM authentication support

**When to Use:**
```
Perfect for:
- Serverless applications (Lambda with RDS)
- Applications with many short-lived connections
- Unpredictable connection patterns
- Need to enforce connection limits

Example: Lambda → RDS Proxy → RDS
- Without: Each Lambda creates connections → overwhelming
- With: Proxy pools connections → stable, performant
```

**3. Performance Insights**

**What it does:** Visual database performance monitoring

**Metrics:**
- Top SQL statements by load
- Wait events analysis
- Dimension filtering (host, user, SQL)
- Historical performance (7 days free, up to 2 years paid)

**Use Cases:**
```
Scenario: Application slowdown at 2 PM daily

Performance Insights shows:
- Top SQL: SELECT * FROM orders WHERE customer_id = ?
- Wait Event: I/O wait
- Duration: 5 seconds average
- Calls: 10,000/minute

Action:
1. Add index on customer_id
2. Or add caching layer for frequent queries
3. Monitor improvement in Performance Insights
```

### Amazon Aurora Performance Features

**1. Aurora Architecture Advantages**

**Traditional RDS:**
```
Write: Primary → Storage (EBS)
Replication: Storage snapshot → Replica storage
Lag: Seconds
```

**Aurora:**
```
Write: Primary → 6 storage nodes (3 AZs)
Replication: Shared storage cluster
Lag: Single-digit milliseconds
```

**Performance Impact:**
- 5x throughput of MySQL RDS
- 3x throughput of PostgreSQL RDS
- Up to 15 read replicas (vs 5 for RDS)
- <100ms typical replica lag (vs seconds)

**2. Aurora Read Replicas**

**Configuration:**
```
Writer Instance (primary): All writes
Reader Instances (replicas): All reads

Scaling Pattern:
- Start with 1 writer
- Add readers as read load increases
- Up to 15 readers
- Auto-scale readers based on CPU/connections
```

**Reader Endpoint:**
- Automatically load balances across all readers
- Connection-level load balancing
- Removes unhealthy readers automatically

**Custom Endpoints:**
```
Use case: Different replica classes for different workloads

Readers:
- r6g.2xlarge (for real-time application reads)
- r6g.4xlarge (for analytics)

Custom Endpoints:
- app-reads: Points to r6g.2xlarge instances
- analytics: Points to r6g.4xlarge instances

Application:
- Main app → app-reads endpoint
- BI tools → analytics endpoint
```

**3. Aurora Serverless v2**

**What it is:** Auto-scaling database that adjusts capacity based on load

**Scaling:**
- Scales in seconds (vs minutes for provisioned)
- Scales in 0.5 ACU (Aurora Capacity Units) increments
- Min: 0.5 ACU (1 GB RAM)
- Max: 128 ACU (256 GB RAM)

**When to Use:**
```
Perfect for:
- Variable workloads (dev/test, periodic analytics)
- Unpredictable workloads (new applications)
- Multi-tenant SaaS (workload per customer varies)
- Infrequent use (save costs when idle)

Not ideal for:
- Predictable, steady workloads (use provisioned)
- Cost optimization with Reserved Instances
- Maximum performance (provisioned can be faster)
```

**4. Aurora Global Database**

**What it is:** Single Aurora database spanning multiple regions

**Performance:**
- <1 second cross-region replication lag
- Up to 5 secondary regions
- Up to 16 read replicas per secondary region

**Use Cases:**
```
Global Application:
- Primary: us-east-1 (writes)
- Secondary: eu-west-1 (local reads for EU users)
- Secondary: ap-southeast-1 (local reads for APAC users)

Benefits:
- Local read latency (<10ms vs 100-200ms cross-region)
- Disaster recovery (promote secondary in ~1 minute)
- Global applications with low latency
```

**5. Aurora Optimized Reads (2025)**

**What it is:** Uses local NVMe SSD storage for query processing

**Benefits:**
- Up to 8x faster query processing
- Better for large result sets
- Lower memory pressure
- Available on instances with NVMe (r6id, r6gd families)

**When to Use:**
```
Use for:
- Analytics queries with large result sets
- Queries that need temporary storage
- Memory-constrained workloads

Don't need for:
- Small, frequent queries (in-memory is faster)
- Instance types without NVMe
```

---

## Compute Performance Optimization

### EC2 Instance Right-Sizing

**Instance Family Selection:**

```
General Purpose (t3, m5, m6i, m7g):
- Balanced CPU, memory, network
- Web servers, small databases
- Development environments

Compute Optimized (c5, c6i, c7g):
- High CPU, moderate memory
- Batch processing, HPC
- Gaming servers, encoding

Memory Optimized (r5, r6i, r7g, x2):
- Low CPU, high memory
- In-memory databases, caching
- Big data analytics

Storage Optimized (i3, i4i, d2, d3):
- High IOPS, large local storage
- NoSQL databases, data warehousing

Accelerated (p3, p4, g4, inf1):
- GPU, inference accelerators
- ML training/inference, graphics
```

**Graviton (ARM) vs x86:**

```
Graviton3 (m7g, c7g, r7g):
- 25% better price/performance than Graviton2
- 40% better price/performance than x86
- Lower power consumption
- Best for: Containerized workloads, cloud-native apps

x86 (m6i, c6i, r6i):
- Broader software compatibility
- Slightly higher single-thread performance
- Best for: Legacy apps, specific software requirements
```

**Burstable Instances (T3/T4g):**

```
How they work:
- Baseline CPU performance (e.g., 20% for t3.micro)
- Earn CPU credits when under baseline
- Spend credits when over baseline
- Unlimited mode: Can burst indefinitely (extra cost)

Best for:
- Low-traffic web servers
- Development environments
- Microservices with variable load

Avoid for:
- Sustained high CPU (use c-family instead)
- Predictable high load
```

### Placement Groups

**1. Cluster Placement Group**
```
All instances in single AZ, close physical proximity

Benefits:
- Lowest latency (single-digit microseconds)
- Highest network throughput (100 Gbps capable)

Use for:
- HPC applications
- Distributed databases
- Low-latency applications

Limitations:
- Single AZ (no HA)
- Limited instance types
- Homogeneous instances recommended
```

**2. Partition Placement Group**
```
Instances spread across partitions (racks)
Each partition in different rack (separate network/power)

Benefits:
- Reduces correlated failures
- Up to 7 partitions per AZ

Use for:
- Distributed systems (Hadoop, Cassandra, Kafka)
- Need isolation but not cluster performance

Topology awareness:
- Application can query which partition instance is in
- Optimize data placement accordingly
```

**3. Spread Placement Group**
```
Each instance on separate rack
Maximum 7 instances per AZ

Benefits:
- Maximum isolation from hardware failure
- Can span multiple AZs

Use for:
- Small number of critical instances
- Maximum availability

Limitations:
- Maximum 7 instances per AZ
```

**Exam Scenario:**
```
Question: HPC application requires lowest possible network latency
          between instances processing 3D rendering jobs.

Options:
A) Spread placement group
B) Partition placement group
C) Cluster placement group
D) No placement group

Answer: C - Cluster placement group
Why: Provides lowest latency (microseconds) and highest throughput
     for network-intensive applications. Trade-off: Single AZ.
```

### Enhanced Networking

**Elastic Network Adapter (ENA):**
- Up to 100 Gbps bandwidth (on supported instances)
- Lower latency, lower jitter
- Higher packets per second (PPS)
- Enabled by default on modern instances

**Elastic Fabric Adapter (EFA):**
- Enhanced ENA for HPC/ML workloads
- OS-bypass capabilities (lower latency)
- Requires placement group (cluster)
- Supports MPI (Message Passing Interface)

**Use Cases:**
```
ENA (standard):
- All general workloads
- Web applications
- Databases

EFA:
- High-performance computing
- Machine learning training
- Computational fluid dynamics
- Weather modeling
```

---

## Application Performance Patterns

### API Performance Optimization

**1. API Gateway Caching**

**Configuration:**
```
Cache capacity: 0.5 GB to 237 GB
TTL: 0 to 3600 seconds
Per-stage or per-method caching

Pricing:
- $0.02 per GB-hour (0.5 GB cache)
- Up to $3.80 per GB-hour (237 GB cache)
```

**When to Use:**
```
Perfect for:
- Read-heavy APIs
- Expensive backend operations
- Frequently requested data
- Reduce backend load

Cache Invalidation:
- Time-based (TTL expiration)
- Manual (flush cache via API)
- Per-key (header: Cache-Control: max-age=0)
```

**2. Lambda Performance Optimization**

**Cold Start Mitigation:**
```
Provisioned Concurrency:
- Keeps functions initialized and ready
- Eliminates cold starts
- Costs more (compute + provisioned concurrency charges)

Use for:
- Latency-sensitive APIs (<100ms requirement)
- Predictable traffic patterns
- User-facing applications

Don't use for:
- Asynchronous processing (cold starts acceptable)
- Cost-sensitive workloads
- Unpredictable bursts (too expensive)
```

**Memory Optimization:**
```
Lambda allocates CPU proportional to memory:
- 128 MB: 0.08 vCPU equivalent
- 1769 MB: 1 full vCPU
- 10240 MB: ~6 vCPU

Performance Testing:
Test different memory settings (128, 256, 512, 1024, 1536, 3008, 10240)

Often find:
- 512 MB: 2x faster than 128 MB, same cost
- 1024 MB: 4x faster than 128 MB, 50% cheaper
- More memory = More CPU = Faster execution = Lower cost
```

**3. Step Functions Express vs Standard**

| Feature | Standard | Express |
|---------|----------|---------|
| **Max Duration** | 1 year | 5 minutes |
| **Execution Rate** | 2,000/sec | 100,000/sec |
| **Pricing** | Per state transition | Per execution + duration |
| **Execution History** | Full history | CloudWatch Logs only |
| **Use Case** | Long workflows, audit | High-volume, short workflows |

```
Use Standard for:
- Human approval workflows
- Long-running processes
- Need execution history/debugging

Use Express for:
- High-volume event processing
- IoT data processing
- Streaming data transformation
- Low-latency workflows
```

---

## Network Performance Optimization

### VPC and Networking

**1. VPC Endpoint Performance**

**Gateway Endpoints (S3, DynamoDB):**
```
Benefits:
- No data transfer charges
- Private IP routing
- Scalable (no bandwidth limit)
- Free

Use for:
- All S3 and DynamoDB access from VPC
- Always enabled (no downside)
```

**Interface Endpoints (PrivateLink):**
```
Benefits:
- Private IP access to AWS services
- No internet gateway needed
- Better latency (private network)

Costs:
- $0.01 per GB transferred
- $0.01 per hour per endpoint

Use for:
- Services without Gateway endpoints
- Security requirement (no internet)
- Multi-VPC architectures
```

**2. NAT Gateway vs NAT Instance**

```
NAT Gateway:
- Managed by AWS
- 45 Gbps bandwidth
- Highly available in AZ
- $0.045/hour + $0.045/GB
- Better performance, less management

NAT Instance:
- Self-managed EC2
- Instance type dependent (up to 100 Gbps)
- Single point of failure
- EC2 cost only
- More control, cheaper for high bandwidth
```

**3. Transit Gateway Performance**

```
Throughput:
- Up to 50 Gbps per VPC attachment (burst to 100 Gbps)
- Horizontal scaling with multiple attachments

Latency:
- Adds ~1ms latency vs direct VPC peering

Use for:
- Hub-and-spoke network (>10 VPCs)
- Centralized routing
- Hybrid cloud (multiple VPN/Direct Connect)

Avoid for:
- Simple VPC-to-VPC (use peering, lower latency)
- <5 VPCs (peering is simpler)
```

---

## Monitoring and Identifying Bottlenecks

### CloudWatch Application Insights

**What it does:** Automated monitoring with anomaly detection for applications

**Supported Technologies:**
- .NET on IIS
- Java on Tomcat
- SQL Server databases
- Custom applications

**Benefits:**
- Auto-discovers application components
- Pre-configured monitoring dashboards
- ML-powered anomaly detection
- Automated insights and recommendations

### AWS X-Ray Performance Analysis

**Service Map:**
- Visual representation of request flow
- Identifies slow components
- Shows error rates per service

**Trace Analysis:**
```
Example trace:
API Gateway (10ms)
  → Lambda (500ms)
    → DynamoDB Query (450ms) ← BOTTLENECK
    → External API (30ms)
  Total: 500ms

Action: Investigate DynamoDB query
- Check indexes
- Review partition key distribution
- Consider caching frequent queries
```

**Annotations for Filtering:**
```python
# Add custom annotations for analysis
xray_recorder.begin_subsegment('database-query')
xray_recorder.current_subsegment().put_annotation('query_type', 'user_lookup')
xray_recorder.current_subsegment().put_annotation('user_id', user_id)

result = db.query(...)

xray_recorder.end_subsegment()

# Later: Filter traces by annotation
# Find all slow user_lookup queries
```

---

## Exam Scenarios

### Scenario 1: Global Application Latency

```
Question: Application in us-east-1 serves global users. Users in APAC
          experience 300ms latency. Database queries take 50ms.
          How to reduce APAC user latency?

Options:
A) Deploy Aurora Global Database with secondary in ap-southeast-1
B) Add CloudFront distribution
C) Deploy application in ap-southeast-1 with RDS read replica
D) Use ElastiCache in ap-southeast-1

Answer: B - CloudFront
Why:
- Static/cacheable content: CloudFront reduces to <50ms
- Database queries only 50ms (not the bottleneck)
- CloudFront is easiest, lowest cost solution
- If dynamic content or database IS bottleneck, then C or A
```

### Scenario 2: Database Performance

```
Question: RDS MySQL database experiencing slow queries during
          business hours. CPU at 80%, read IOPS maxed out.
          Application is read-heavy (90% reads, 10% writes).

Options:
A) Upgrade to larger instance class
B) Add read replicas and route reads to them
C) Implement ElastiCache for frequent queries
D) Enable Multi-AZ

Answer: C - ElastiCache (best); B also valid
Why:
- C: Offloads database entirely, best ROI, lowest cost
- B: Adds read capacity but doesn't reduce query load
- A: Expensive, temporary solution
- D: No performance improvement (only HA)
```

### Scenario 3: Lambda Cold Starts

```
Question: Lambda function behind API Gateway experiences
          5-second cold starts affecting user experience.
          Function invoked 1000 times/day, sporadically.

Options:
A) Enable provisioned concurrency (10 instances)
B) Increase memory from 128MB to 3008MB
C) Keep function warm with CloudWatch Events (every minute)
D) Optimize code and dependencies to reduce cold start

Answer: D - Optimize code
Why:
- A: Too expensive for sporadic usage ($350/month for 10)
- B: Doesn't significantly reduce cold start (mainly helps execution)
- C: Works but wasteful (1440 invocations/day just to warm)
- D: Best approach - reduce cold start from 5s to <1s, free
```

### Scenario 4: ElastiCache Hit Rate

```
Question: ElastiCache Redis cluster has 40% cache hit rate.
          Application queries are getting slow. Cluster is
          r6g.large (13.07 GB memory).

Options:
A) Upgrade to r6g.xlarge (26.15 GB memory)
B) Reduce TTL to keep cache fresh
C) Analyze query patterns and adjust caching strategy
D) Add more replica nodes

Answer: C - Analyze query patterns
Why:
- 40% hit rate is low (target: >80%)
- Likely cause: Poor cache key design or short TTL
- Adding memory (A) won't help if cache keys are wrong
- Reducing TTL (B) makes hit rate worse
- Adding replicas (D) doesn't increase cache size
```

### Scenario 5: Aurora vs RDS

```
Question: Application needs high read throughput with minimal
          replication lag. Database is 100GB, growing 10GB/month.
          Requires 10 read replicas.

Options:
A) RDS MySQL with 5 read replicas (maximum)
B) Aurora MySQL with 10 read replicas
C) RDS MySQL with ElastiCache for reads
D) DynamoDB with DAX

Answer: B - Aurora with read replicas
Why:
- RDS limited to 5 read replicas
- Aurora supports up to 15 read replicas
- Aurora has much lower replication lag (<100ms vs seconds)
- C works but more complex, higher operational overhead
- D requires application rewrite (relational → NoSQL)
```

---

## Cost vs Performance Trade-offs

### Decision Matrix

| Optimization | Performance Gain | Cost Impact | Complexity |
|--------------|-----------------|-------------|------------|
| CloudFront | 50-90% latency reduction | Low ($) | Low |
| ElastiCache | 10-100x faster queries | Medium ($$) | Medium |
| Read Replicas | 2-5x read throughput | Medium ($$) | Low |
| Aurora vs RDS | 3-5x throughput | High ($$$) | Low |
| Lambda Provisioned Concurrency | Eliminate cold starts | High ($$$) | Low |
| Larger Instances | Linear improvement | High ($$$) | Low |
| Graviton Instances | Same performance, 40% cheaper | Lower ($) | Low |

### Optimization Priority

**High ROI (Do First):**
1. CloudFront for static/cacheable content
2. ElastiCache for frequently accessed data
3. Proper indexing on databases
4. Connection pooling (RDS Proxy)
5. Compression (Gzip/Brotli)

**Medium ROI:**
1. Read replicas for read-heavy workloads
2. Aurora for high-throughput databases
3. Graviton instances (same performance, lower cost)
4. Lambda memory optimization

**Low ROI (Consider Carefully):**
1. Provisioned concurrency for Lambda
2. Largest instance classes
3. Complex caching strategies
4. Over-engineering solutions

---

## Summary and Key Takeaways

### Must Know for Exam

1. **Caching layers** - CloudFront, API Gateway, ElastiCache, DAX
2. **ElastiCache Redis vs Memcached** - When to use each
3. **Aurora advantages** - 5x performance, 15 replicas, shared storage
4. **Lambda cold starts** - Provisioned concurrency vs optimization
5. **CloudFront Functions vs Lambda@Edge** - Use cases and limitations
6. **Performance monitoring** - X-Ray, CloudWatch, Performance Insights

### Decision Framework

```
Performance optimization:
1. Measure baseline and identify bottleneck
2. Choose appropriate solution:
   - Network latency → CloudFront
   - Database reads → ElastiCache or Read Replicas
   - Database writes → Larger instance or Aurora
   - Compute → Right-size instances, Graviton
   - Application → Optimize code, caching, async
3. Implement incrementally
4. Validate improvement
5. Monitor continuously
```

### Common Mistakes

- Optimizing before measuring (premature optimization)
- Choosing expensive solutions when simple caching works
- Ignoring network latency (largest user-facing impact)
- Not using CloudFront (easiest win for global users)
- Over-provisioning compute instead of fixing code
- Forgetting about connection pooling (huge impact)

---

**Next:** [Task 3.4 - Reliability Improvements](./task-3.4-reliability-improvements.md)
