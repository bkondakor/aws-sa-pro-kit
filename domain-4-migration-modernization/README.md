---
title: "Domain 4: Accelerate Workload Migration and Modernization"
domain: 4
domain_name: "Accelerate Workload Migration and Modernization"
weight: "20%"
exam_questions: "~15 out of 75"
file_type: "domain-overview"
exam_topics:
  - migration
  - modernization
  - 7rs-framework
  - application-migration-service
  - database-migration
  - data-transfer
status: complete
last_updated: "2025-11-18"
---

# Domain 4: Accelerate Workload Migration and Modernization (20%)

## Overview

Domain 4 focuses on migrating and modernizing workloads to AWS efficiently and effectively. This domain represents **20% of the SAP-C02 exam** and tests your ability to:
- Select appropriate workloads for migration using the 7 R's framework
- Determine optimal migration strategies and tools
- Design new architectures for migrated workloads
- Identify modernization opportunities that add business value
- Execute large-scale data transfers with minimal downtime

---

## Domain Structure

### Task Statements

1. **Task 4.1: Select existing workloads and processes for potential migration** (25% of domain)
2. **Task 4.2: Determine the optimal migration approach** (30% of domain)
3. **Task 4.3: Determine a new architecture for existing workloads** (25% of domain)
4. **Task 4.4: Determine opportunities for modernization and enhancements** (20% of domain)

---

## Study Materials

### Deep Dive Guides
- [Task 4.1 - Migration Selection Strategy](./task-4.1-migration-selection.md)
- [Task 4.2 - Optimal Migration Approach](./task-4.2-migration-approach.md)
- [Task 4.3 - New Architecture Design](./task-4.3-architecture-design.md)
- [Task 4.4 - Modernization Opportunities](./task-4.4-modernization-opportunities.md)

### Practice Materials
- [Tricky Scenarios & Edge Cases](./tricky-scenarios.md)
- [Service Comparison Matrix](./service-comparisons.md)
- [Hands-On Labs](./hands-on-labs.md)

---

## Key AWS Services for Domain 4

### Migration Services
- **AWS Application Migration Service (MGN)** - Lift-and-shift server migrations (successor to SMS)
- **AWS Database Migration Service (DMS)** - Database migration with minimal downtime
- **AWS Schema Conversion Tool (SCT)** - Convert database schemas for heterogeneous migrations
- **AWS Server Migration Service (SMS)** - Legacy server migration (being replaced by MGN)

### Discovery & Planning
- **AWS Application Discovery Service** - Discover on-premises servers and dependencies
- **AWS Migration Hub** - Central location to track migrations
- **AWS Migration Evaluator** - Business case and TCO analysis (formerly TSO Logic)
- **AWS Migration Readiness Assessment (MRA)** - Assess organizational readiness

### Data Transfer Services
- **AWS DataSync** - Online data transfer with acceleration (10x faster than open-source tools)
- **AWS Transfer Family** - SFTP/FTPS/FTP for partner integrations
- **AWS Snow Family** - Offline data transfer for large datasets
  - **Snowcone** - 8TB HDD or 14TB SSD, edge computing
  - **Snowball Edge** - 80TB-210TB, edge computing, compute optimized options
  - **Snowmobile** - Exabyte-scale (up to 100 PB per Snowmobile)
- **AWS Direct Connect** - Dedicated network connection (1 Gbps - 100 Gbps)
- **S3 Transfer Acceleration** - Fast transfer to S3 using CloudFront edge locations

### Modernization Services
- **AWS App2Container** - Containerize .NET and Java applications
- **AWS Microservice Extractor for .NET** - Extract microservices from monoliths
- **Amazon Babelfish for Aurora PostgreSQL** - Run SQL Server apps on PostgreSQL
- **AWS Mainframe Modernization** - Migrate mainframe applications
- **AWS Migration Hub Refactor Spaces** - Incremental refactoring of applications

### Container & Serverless Platforms
- **Amazon ECS** - Container orchestration (AWS-native)
- **Amazon EKS** - Managed Kubernetes
- **AWS Fargate** - Serverless containers
- **Amazon ECR** - Container registry
- **AWS App Runner** - Deploy containerized web apps and APIs
- **AWS Lambda** - Serverless compute
- **Amazon API Gateway** - API management and creation
- **AWS Step Functions** - Serverless workflow orchestration
- **Amazon EventBridge** - Event-driven architectures

---

## Critical Concepts to Master

### 1. The 7 R's Migration Framework

Understanding when to apply each strategy (from simplest to most complex):

| Strategy | Complexity | Downtime | Cost | When to Use |
|----------|-----------|----------|------|-------------|
| **Retire** | Lowest | N/A | Saves money | Unused/redundant applications |
| **Retain** | Low | N/A | Neutral | Applications not ready to migrate |
| **Relocate** | Low | Minimal | Low | VMware Cloud on AWS migrations |
| **Rehost** | Low-Medium | Minimal | Low-Medium | Quick migrations, proven workloads |
| **Repurchase** | Medium | Varies | Medium | Moving to SaaS (e.g., CRM to Salesforce) |
| **Replatform** | Medium-High | Low-Medium | Medium | Optimize without re-architecting |
| **Refactor** | Highest | Varies | Highest | Maximum cloud-native benefits needed |

**Key Decision Factors:**
- **Business urgency** - Rehost for speed, refactor for long-term benefits
- **Technical debt** - High debt favors refactoring
- **Team skills** - Cloud-native skills enable refactoring
- **ROI timeline** - Short-term ROI favors rehost, long-term favors refactor
- **Application lifecycle** - End-of-life apps should be retired or retained

### 2. Migration Phases (AWS Migration Framework)

**Phase 1: Assess** (2-4 weeks)
- Portfolio discovery and analysis
- Migration Readiness Assessment (MRA)
- TCO and business case development
- Dependency mapping
- Application categorization (by 7 R's)

**Phase 2: Mobilize** (4-8 weeks)
- Build landing zone (multi-account structure)
- Establish security baselines
- Create migration factory (automation)
- Develop runbooks and playbooks
- Pilot migrations

**Phase 3: Migrate and Modernize** (Variable)
- Wave-based migration execution
- Continuous testing and validation
- Incremental modernization
- Decommission source infrastructure

**Phase 4: Operate and Optimize** (Ongoing)
- Monitor and optimize performance
- Cost optimization
- Security hardening
- Ongoing modernization

### 3. Database Migration Strategies

**Homogeneous Migrations** (Same database engine)
- Oracle to RDS Oracle
- MySQL to Aurora MySQL
- SQL Server to RDS SQL Server
- PostgreSQL to Aurora PostgreSQL

**Tools:** DMS only (schema compatible)
**Approach:** Continuous replication with minimal downtime

**Heterogeneous Migrations** (Different database engine)
- Oracle to Aurora PostgreSQL
- SQL Server to Aurora MySQL
- Commercial DB to open-source DB

**Tools:** SCT (schema conversion) + DMS (data migration)
**Approach:** Two-step process - convert schema, then migrate data

**Special Cases:**
- **Babelfish for Aurora PostgreSQL** - Run SQL Server apps without code changes
- **DMS Fleet Advisor** - Assess database migration options
- **Blue/Green Deployments** - Zero-downtime switchover

### 4. Large-Scale Data Transfer Decision Tree

**Decision Factors:**
1. **Data size** - TB vs PB scale
2. **Network bandwidth** - Available and reliable connectivity
3. **Transfer timeline** - Days, weeks, or months
4. **Frequency** - One-time or recurring
5. **Protocol requirements** - Standard protocols vs optimized

**Selection Criteria:**

| Data Size | Network Speed | Timeline | Best Solution |
|-----------|--------------|----------|---------------|
| < 10 TB | Good (> 100 Mbps) | Days-Weeks | **DataSync** or **Direct Connect** |
| < 10 TB | Poor (< 100 Mbps) | Urgent | **Snowcone** |
| 10-80 TB | Good | Weeks | **DataSync** + **Direct Connect** |
| 10-80 TB | Limited | Any | **Snowball Edge** |
| 80-210 TB | Any | Any | **Snowball Edge** (multiple devices) |
| > 1 PB | Good | Months | **Multiple Snowball Edge** devices |
| > 10 PB | Any | Any | **Snowmobile** |
| Recurring | Good | Ongoing | **DataSync** or **Direct Connect** |
| Partner files | Any | Ongoing | **Transfer Family** (SFTP/FTPS) |

**Formula for network transfer time:**
```
Transfer Time (days) = (Data Size in TB × 8,000 GB) / (Network Speed in Gbps × 86,400 seconds × 0.8)
```
*0.8 accounts for ~80% network efficiency*

**When to use Snow Family:**
If transfer time > 1 week OR network cost > device rental cost

### 5. Zero-Downtime Migration Patterns

**Pattern 1: Blue/Green Deployment**
- Maintain parallel environments
- Switch traffic atomically
- Quick rollback capability
- **Best for:** Applications with clear cutover point

**Pattern 2: Continuous Replication**
- DMS continuous replication
- Lag monitoring (< 5 seconds typical)
- Switch during low-traffic window
- **Best for:** Databases and data stores

**Pattern 3: Strangler Fig Pattern**
- Incrementally replace functionality
- Route traffic progressively
- Reduce risk through gradual migration
- **Best for:** Monolith to microservices

**Pattern 4: Canary Deployments**
- Migrate subset of users first
- Monitor metrics and errors
- Progressive rollout
- **Best for:** Risk-averse migrations

---

## Exam Focus Areas

### Heavily Tested Topics
1. **7 R's framework decision-making** - Matching strategy to requirements
2. **DMS homogeneous vs heterogeneous** - When to use SCT
3. **Snow Family device selection** - Snowcone vs Snowball vs Snowmobile
4. **DataSync vs Transfer Family** - Use case matching
5. **Application Discovery Service** - Dependency mapping
6. **MGN vs SMS** - Modern vs legacy migration tools
7. **Containerization strategies** - App2Container, ECS, EKS
8. **Database migration with minimal downtime** - DMS replication strategies
9. **Wave planning** - Sequencing migrations based on dependencies
10. **TCO analysis** - Migration business case development

### Common Tricky Scenarios
1. **When to rehost vs replatform vs refactor** - Cost/benefit analysis
2. **Handling large databases** (> 10 TB) during migration - Snowball Edge with DMS
3. **Network bandwidth calculations** - Determining if online/offline transfer
4. **DMS replication lag** - Handling high-transaction databases
5. **SCT limitations** - What can/cannot be automatically converted
6. **Dependency mapping** - Identifying application interdependencies
7. **Modernization timing** - During vs after migration
8. **Multi-region migration strategies** - Sequencing and coordination
9. **Licensing considerations** - BYOL vs license-included
10. **Cutover window planning** - Minimizing downtime during switchover

### Services Often Confused

| Service Pair | Key Differentiator |
|--------------|-------------------|
| **MGN vs SMS** | MGN is modern, application-centric; SMS is legacy, server-centric |
| **DataSync vs Transfer Family** | DataSync for bulk migration; Transfer Family for SFTP/FTP workflows |
| **Snowball vs Snowmobile** | Snowball for TB-scale; Snowmobile for PB-scale (> 10 PB) |
| **DMS vs DataSync** | DMS for databases; DataSync for file systems/object storage |
| **Rehost vs Relocate** | Rehost changes OS; Relocate moves VMs at hypervisor level |
| **Replatform vs Refactor** | Replatform optimizes; Refactor re-architects |
| **SCT vs DMS** | SCT converts schemas; DMS migrates data |
| **App2Container vs Microservice Extractor** | App2Container containerizes; Microservice Extractor decomposes |

---

## Study Approach for Domain 4

### Week 1: Migration Fundamentals
- [ ] Study the 7 R's framework in depth
- [ ] Learn AWS Application Discovery Service
- [ ] Understand Migration Hub and tracking
- [ ] Review TCO analysis and business case development
- [ ] Practice: Create migration assessment for sample application portfolio

### Week 2: Migration Tools & Techniques
- [ ] Deep dive into AWS MGN (Application Migration Service)
- [ ] Study DMS for homogeneous and heterogeneous migrations
- [ ] Learn SCT for schema conversion
- [ ] Understand DataSync and Snow Family
- [ ] Practice: Set up DMS replication task in AWS account

### Week 3: Modernization Strategies
- [ ] Study containerization with App2Container
- [ ] Learn microservices decomposition patterns
- [ ] Understand serverless refactoring patterns
- [ ] Review event-driven architectures
- [ ] Practice: Containerize a sample application

### Week 4: Practice & Validation
- [ ] Complete 100+ practice questions for Domain 4
- [ ] Build hands-on labs (see hands-on-labs.md)
- [ ] Review tricky scenarios and edge cases
- [ ] Identify and fill knowledge gaps

---

## Quick Reference Tables

### Migration Tools by Workload Type

| Workload Type | Primary Tool | Secondary Tools | Key Considerations |
|--------------|--------------|-----------------|-------------------|
| **Servers (Windows/Linux)** | AWS MGN | SMS (legacy) | Application dependencies, licensing |
| **VMware VMs** | VMware Cloud on AWS | MGN | Relocate strategy, existing VMware skills |
| **Databases (Same engine)** | DMS | Native tools, Backup/Restore | Size, downtime tolerance |
| **Databases (Different engine)** | SCT + DMS | Babelfish (SQL Server → PostgreSQL) | Schema complexity, stored procedures |
| **File Systems** | DataSync | Storage Gateway, Snowball | Size, ongoing sync requirements |
| **Object Storage** | S3 API, DataSync | Snow Family | Volume, network bandwidth |
| **Large Datasets (TB-PB)** | Snow Family | DataSync + Direct Connect | Size, timeline, network costs |
| **Mainframes** | AWS Mainframe Modernization | Third-party tools | Application complexity, COBOL code |
| **SAP Systems** | AWS Launch Wizard for SAP | Manual migration | Database size, high availability needs |
| **.NET Applications** | App2Container | Microservice Extractor | Containerization vs decomposition |
| **Java Applications** | App2Container | Manual refactoring | Framework compatibility |
| **Monolithic Apps** | Strangler Fig pattern | Microservice Extractor | Decomposition strategy |

### Data Transfer Service Comparison

| Service | Transfer Method | Speed | Best For | Cost Model |
|---------|----------------|-------|----------|------------|
| **DataSync** | Online (optimized) | Up to 10 Gbps | Recurring transfers, migrations | Per GB transferred |
| **Transfer Family** | Online (SFTP/FTPS/FTP) | Varies | Partner integrations | Per hour + data processed |
| **Snowcone** | Offline (ship device) | 8TB HDD / 14TB SSD | Edge locations, < 10 TB | Device rental + shipping |
| **Snowball Edge** | Offline (ship device) | 80-210 TB | 10-210 TB datasets | Device rental + shipping |
| **Snowmobile** | Offline (ship container) | Up to 100 PB | > 10 PB datasets | Custom pricing |
| **Direct Connect** | Dedicated line | 1-100 Gbps | Hybrid, ongoing transfers | Port hours + data transfer |
| **S3 Transfer Acceleration** | Online (edge locations) | 50-500% faster | S3 uploads, global users | Per GB transferred |

### DMS Replication Task Types

| Task Type | Use Case | CDC Support | Duration |
|-----------|----------|-------------|----------|
| **Full Load** | One-time migration | No | Until complete |
| **Full Load + CDC** | Migrate with ongoing replication | Yes | Continuous |
| **CDC Only** | Replicate changes only | Yes | Continuous |

**CDC = Change Data Capture** (tracks ongoing changes)

---

## Migration Decision Framework

### When to Choose Each R Strategy

**1. Retire (10-20% of portfolio typically)**
- Application is redundant or unused
- Functionality available in another system
- End-of-life with no business value
- **Benefit:** Immediate cost savings, reduced complexity

**2. Retain (15-25% of portfolio typically)**
- Recently upgraded on-premises
- Requires major refactoring not yet justified
- Regulatory/compliance requires on-premises
- Dependencies not yet migrated
- **Benefit:** Avoid unnecessary migration costs

**3. Relocate (VMware-specific)**
- VMware workloads to VMware Cloud on AWS
- Minimal changes, hypervisor-level migration
- **Benefit:** Fastest VMware migration path

**4. Rehost (40-50% of portfolio typically)**
- Need to migrate quickly (datacenter closure)
- Proven stable applications
- Limited cloud expertise
- Want to migrate now, optimize later
- **Benefit:** Fast migration, proven lift-and-shift

**5. Repurchase (5-10% of portfolio typically)**
- Moving to SaaS (CRM, HR systems)
- License costs too high
- Vendor offers cloud version
- **Benefit:** Reduced operational overhead

**6. Replatform (20-30% of portfolio typically)**
- Want some cloud benefits without re-architecting
- Database to RDS/Aurora
- App server to Elastic Beanstalk
- **Benefit:** Balance of effort vs benefit

**7. Refactor (10-20% of portfolio typically)**
- Need scalability/performance improvements
- High business value applications
- Competitive advantage requirements
- Modernization is strategic priority
- **Benefit:** Maximum cloud-native benefits

---

## Important Exam Patterns

### Pattern Recognition for Question Analysis

**Cost Optimization Signals:**
- "MOST cost-effective"
- "minimize costs"
- "reduce expenses"
→ **Consider:** Rehost, retire unused, repurchase to SaaS, use Snowball over network transfer

**Speed/Urgency Signals:**
- "quickly as possible"
- "datacenter closing in 6 months"
- "minimal time"
→ **Consider:** Rehost with MGN, use Snow Family for large data, parallel wave execution

**Minimal Downtime Signals:**
- "zero downtime"
- "minimal disruption"
- "business continuity"
→ **Consider:** DMS continuous replication, blue/green deployment, canary rollout

**Modernization Signals:**
- "improve scalability"
- "reduce operational overhead"
- "cloud-native benefits"
→ **Consider:** Refactor to serverless, containerize, implement microservices

**Large Data Transfer Signals:**
- Specific data sizes (> 10 TB)
- "limited bandwidth"
- "network constraints"
→ **Consider:** Snow Family, DataSync + Direct Connect, calculate transfer time

---

## Next Steps

1. **Start with Task 4.1** - Understanding the 7 R's is foundational
2. **Use AWS MCP tools** - Lookup current migration service capabilities
3. **Practice hands-on** - Set up DMS replication or use MGN
4. **Calculate transfer times** - Practice the network transfer formula
5. **Review case studies** - AWS migration case studies and best practices
6. **Quiz yourself** - Use practice scenarios to validate understanding

---

## Important Reminders

### Exam Mindset for Domain 4
- **Match strategy to requirements** - No one-size-fits-all migration approach
- **Consider total cost** - Not just migration cost, but ongoing operational costs
- **Downtime tolerance drives tooling** - Zero-downtime requires specific patterns
- **Dependencies matter** - Can't migrate application without its dependencies
- **Data gravity is real** - Large datasets dictate migration approach
- **Modernization is iterative** - Don't have to modernize everything at once
- **AWS prefers managed services** - MGN over custom scripts, DMS over manual DB migration

### Common Mistakes to Avoid
- Choosing refactor when rehost is more appropriate (over-engineering)
- Ignoring network bandwidth in data transfer calculations
- Assuming all databases can migrate with zero downtime
- Forgetting about licensing implications (BYOL vs license-included)
- Not considering dependency order in wave planning
- Overlooking the retire and retain strategies (not everything needs to migrate)
- Using SMS instead of MGN (MGN is the modern choice)
- Choosing online transfer when offline (Snow Family) is more cost-effective

### Key Formulas to Remember

**Network Transfer Time:**
```
Time (days) = (TB × 8,000) / (Network Gbps × 86,400 × 0.8)
```

**When to use Snow Family:**
```
If (Transfer Time > 7 days) OR (Network Cost > Snow Device Cost)
  → Use Snow Family
```

**DMS Replication Lag Target:**
```
Target Lag < 5 seconds for most workloads
If Lag > 30 seconds consistently → Investigate performance bottleneck
```

---

## AWS Well-Architected Framework - Migration Lens

Apply these principles to all migration decisions:

**Operational Excellence:**
- Automate migration processes (migration factory)
- Use runbooks and playbooks
- Perform dry runs before cutover

**Security:**
- Encrypt data in transit and at rest
- Use IAM roles, not credentials
- Implement least privilege access

**Reliability:**
- Test failback procedures
- Validate backups before cutover
- Implement monitoring from day one

**Performance Efficiency:**
- Right-size resources in target environment
- Use appropriate migration tools for workload type
- Optimize before (replatform) or after (rehost then optimize) migration

**Cost Optimization:**
- Analyze TCO accurately
- Consider retire and retain strategies
- Use migration as opportunity to eliminate waste

**Sustainability:**
- Shut down source infrastructure promptly
- Use managed services to improve resource utilization
- Optimize workloads for efficiency

---

*Last Updated: 2025-11-17*
*Always verify current AWS service capabilities as features evolve rapidly*
