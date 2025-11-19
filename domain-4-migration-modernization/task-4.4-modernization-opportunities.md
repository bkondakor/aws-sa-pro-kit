---
title: "Task 4.4: Determine Opportunities for Modernization and Enhancements"
domain: 4
domain_name: "Accelerate Workload Migration and Modernization"
task: 4.4
weight: "20%"
task_weight: "~20% of domain"
exam_topics:
  - modernization
  - database-modernization
  - aurora
  - dynamodb
  - data-lake
  - machine-learning
  - legacy-retirement
status: complete
last_updated: "2025-11-18"
---

# Task 4.4: Determine Opportunities for Modernization and Enhancements

## Overview

Task 4.4 focuses on **identifying and implementing** modernization opportunities during or after migration. This represents approximately **20% of Domain 4** questions on the exam.

**Key Objectives:**
- Identify database modernization opportunities
- Modernize applications with containers and serverless
- Build data lake architectures for analytics
- Integrate machine learning capabilities
- Develop legacy system retirement strategies
- Balance modernization benefits with complexity and cost

---

## Database Modernization

### Why Modernize Databases?

**Traditional Database Challenges:**
- High licensing costs (Oracle, SQL Server)
- Manual patching and maintenance overhead
- Limited scalability
- Over-provisioned for peak load
- Complex backup and HA configuration

**Cloud-Native Database Benefits:**
- Lower cost (open-source engines, pay-per-use)
- Auto-scaling capacity
- Automated backups, patching, failover
- Global distribution capabilities
- Performance improvements

### Database Modernization Paths

**Path 1: Commercial to Open Source**

**Migrations:**
- Oracle → Aurora PostgreSQL
- SQL Server → Aurora PostgreSQL (with Babelfish)
- SQL Server → Aurora MySQL
- IBM Db2 → Aurora PostgreSQL

**Benefits:**
- **Cost Savings:** 70-90% reduction in licensing costs
- **Performance:** Often equal or better performance
- **Reduced Overhead:** Managed service eliminates DBA tasks
- **Cloud-Native:** Auto-scaling, serverless options

**Challenges:**
- Schema conversion (use AWS SCT)
- Stored procedures rewriting
- Application SQL compatibility
- Testing effort required

### Amazon Babelfish for Aurora PostgreSQL

**What is Babelfish?**
- PostgreSQL extension that understands SQL Server wire protocol (TDS)
- Allows SQL Server applications to connect to Aurora PostgreSQL
- Minimal or zero code changes required

**How It Works:**
```
SQL Server Application
    ↓ (TDS protocol)
Babelfish on Aurora PostgreSQL
    ├→ TDS endpoint (port 1433 - SQL Server compatible)
    └→ PostgreSQL endpoint (port 5432 - native PostgreSQL)
```

**What Babelfish Supports:**
- T-SQL queries
- SQL Server data types
- Stored procedures (T-SQL)
- Triggers
- User-defined functions
- Collations

**Migration Process:**
1. **Assess:** Use Babelfish Compass tool
   - Analyzes SQL Server code
   - Reports compatibility (% auto-compatible)
   - Highlights manual changes needed

2. **Convert Schema:** (if needed)
   - Most schemas auto-compatible
   - Manual fixes for unsupported features

3. **Migrate Data:** Use AWS DMS
   - Full load + CDC
   - Minimal downtime

4. **Connect Application:**
   - Change connection string to Babelfish endpoint
   - Port 1433 (SQL Server compatible)
   - Test thoroughly

5. **Cutover:** Switch production traffic

**Exam Scenario:**
**Q:** "Migrate SQL Server application to AWS. Minimize code changes. Reduce licensing costs."

**A:** Aurora PostgreSQL with Babelfish
- Minimal application changes (connection string only)
- Eliminates SQL Server licensing
- Managed service reduces overhead

**When NOT to Use Babelfish:**
- Very complex T-SQL (lots of manual conversion)
- Extensive use of CLR (Common Language Runtime)
- SQL Server-specific features Babelfish doesn't support
- In these cases: RDS for SQL Server or refactor application

### Aurora Serverless v2

**What is Aurora Serverless v2?**
- Auto-scaling Aurora (PostgreSQL or MySQL compatible)
- Scales capacity automatically based on load
- Scales from 0.5 ACU to 128 ACUs (Aurora Capacity Units)
- 1 ACU ≈ 2 GB memory + corresponding CPU + network

**Key Features:**
- **Instant Scaling:** Scales in seconds (fraction of a second)
- **Fine-Grained:** Scales in 0.5 ACU increments
- **Always Available:** No pause/resume (unlike v1)
- **Reader Support:** Supports read replicas
- **Global Databases:** Compatible with Aurora Global Database

**When to Use:**
- **Unpredictable workloads:** Traffic varies significantly
- **Intermittent workloads:** Dev/test databases
- **Spiky workloads:** Periodic high load (reporting, batch jobs)
- **Multi-tenant SaaS:** Different tenants have different usage patterns
- **Serverless applications:** Pair with Lambda for fully serverless stack

**Cost Model:**
- Pay for ACU-hours consumed (billed per second, 1-minute minimum)
- Minimum capacity: 0.5 ACU (you pay for minimum even when idle)
- Plus storage (pay per GB-month)
- Unlike Aurora Serverless v1, v2 does not pause (always incurs minimum capacity charges)

**Exam Scenario:**
**Q:** "Database for Lambda-based application. Traffic unpredictable. Minimize cost and operational overhead."

**A:** Aurora Serverless v2
- Scales automatically with Lambda load
- Pay only for capacity used
- No manual scaling or capacity planning

### NoSQL Adoption with DynamoDB

**When to Migrate from SQL to DynamoDB:**

**Good Candidates:**
- **Key-value access patterns:** Lookups by primary key
- **High throughput:** Millions of requests/second
- **Predictable query patterns:** Known access patterns
- **Low latency required:** Single-digit milliseconds
- **Massive scale:** Terabytes to petabytes
- **Global distribution:** Multi-region active-active

**Example Use Cases:**
- User profiles (key = userID)
- Session storage (key = sessionID)
- Shopping carts (key = cartID)
- Leaderboards / gaming state
- IoT time-series data
- Mobile app backends

**Migration Pattern:**
```
Before: RDS with simple key-value queries
    SELECT * FROM users WHERE user_id = 123

After: DynamoDB
    GetItem(PK = "USER#123")

Benefits:
├→ Unlimited scale
├→ Single-digit ms latency
├→ No server management
└→ Pay per request (on-demand) or provisioned
```

**DynamoDB Design Principles:**
- **Denormalization:** Store related data together
- **Partition Key Design:** Distribute load evenly
- **Sort Key:** Enable range queries within partition
- **Global Secondary Indexes (GSI):** Support alternate query patterns
- **DynamoDB Streams:** Capture changes (like triggers)

**Exam Tip:** SQL → DynamoDB requires application refactoring (not just lift-and-shift)

### Multi-Model Database Adoption

**When Different Data Models Make Sense:**

Modern applications often need multiple data models:

**Architecture:**
```
Application
    ├→ DynamoDB (user profiles, sessions - key-value)
    ├→ Aurora PostgreSQL (transactions, orders - relational)
    ├→ ElastiCache (Redis) (real-time leaderboard - in-memory)
    ├→ OpenSearch (product search - full-text search)
    └→ Neptune (social graph, recommendations - graph)
```

**Use the Right Tool for Each Job:**
- **Relational (Aurora, RDS):** ACID transactions, complex joins, reporting
- **Key-Value (DynamoDB):** High throughput, low latency, simple access
- **Document (DocumentDB):** MongoDB-compatible, flexible schema, JSON
- **In-Memory (ElastiCache):** Caching, real-time analytics, leaderboards
- **Search (OpenSearch):** Full-text search, log analytics, monitoring
- **Graph (Neptune):** Social networks, fraud detection, knowledge graphs
- **Time-Series (Timestream):** IoT, metrics, events (time-based data)

**Exam Pattern:** Don't force all data into one database; use purpose-built databases

---

## Application Modernization

### Containerization Benefits

**Modernization: VMs → Containers**

**Before (VMs):**
- Minutes to start
- GB of disk per instance
- Includes full OS
- Less portable

**After (Containers):**
- Seconds to start
- MB of disk per container
- Shares OS kernel
- Highly portable

**Migration Path:**
```
Phase 1: Containerize Existing App
Legacy App on VM → Same app in container (ECS/EKS)

Phase 2: Optimize Container
Single container → Multiple containers (separate concerns)

Phase 3: Microservices (if needed)
Monolithic container → Multiple service containers
```

**Immediate Benefits (Phase 1):**
- CI/CD integration (automated deployments)
- Consistent environments (dev = prod)
- Faster deployments (container images)
- Better resource utilization
- Easy rollbacks (image versioning)

**Don't Rush to Microservices:**
- Containerize first, prove operations
- Extract microservices only if clear benefits
- Many apps work well as containerized monoliths

### Serverless Adoption Patterns

**Pattern 1: Replace Cron Jobs**

**Before:**
```
EC2 instance (t3.small - $15/month) running 24/7
Cron job runs 5 minutes/day
CPU idle 99.65% of time
```

**After:**
```
EventBridge Scheduler → Lambda
Runs 5 minutes/day
Cost: ~$0.01/month (1000x cheaper)
```

**ROI:** Immediate, massive cost savings

**Pattern 2: API Backends**

**Before:**
```
EC2 Auto Scaling (min 2 instances for HA)
$60/month minimum even with zero traffic
```

**After:**
```
API Gateway + Lambda
$0 with zero traffic
$3.50 per 1 million requests
```

**Good for:** Variable traffic, low baseline traffic

**Pattern 3: Event Processing**

**Before:**
```
EC2 polling S3 every minute for new files
Processing: 10 files/day @ 2 min each
Idle: 99% of time
```

**After:**
```
S3 Event → Lambda (triggers immediately)
Process file in real-time
Pay only for processing time
```

**Benefits:** Real-time processing, no polling overhead, cost savings

### Microservice Modernization

**When to Extract Microservices:**

**Good Candidates for Extraction:**
- **Scaling Mismatch:** Part of app needs different scaling
  - Example: Image processing needs CPU, checkout needs high availability
- **Team Independence:** Different teams working on same codebase (conflicts)
- **Technology Diversity:** Want to use different languages/frameworks
  - Example: ML service in Python, core app in Java
- **Update Frequency:** One module changes frequently, others stable
  - Example: pricing logic changes weekly, user management changes monthly

**Example: Extract Payment Service**

**Before:**
```
Monolith (Checkout + Payment + Inventory all together)
└→ Any change requires full deployment
```

**After:**
```
API Gateway
    ├→ Checkout Service (frequently updated)
    ├→ Payment Service (stable, PCI compliance isolated)
    └→ Inventory Service (different scaling needs)
```

**Benefits:**
- Independent deployments (payment updates don't affect checkout)
- PCI compliance isolated to payment service
- Different scaling (payment processes fewer transactions)
- Team autonomy (payment team independent)

---

## Analytics Modernization (Data Lake Architecture)

### Why Data Lakes?

**Traditional Data Warehouse:**
- ETL to central warehouse
- Schema-on-write (define schema before loading)
- Structured data only
- Expensive to scale
- Vendor lock-in

**Modern Data Lake:**
- Store raw data (all formats)
- Schema-on-read (define schema when querying)
- Structured, semi-structured, unstructured data
- Cheap storage (S3)
- Open formats (Parquet, ORC)

### AWS Data Lake Architecture

**Reference Architecture:**
```
Data Sources:
├→ Application databases (DMS → S3)
├→ Logs (CloudWatch Logs → Firehose → S3)
├→ Streaming data (Kinesis Data Streams → Firehose → S3)
├→ Third-party data (Transfer Family → S3)
└→ Files (DataSync → S3)

Data Lake Storage:
├→ Raw Zone (S3 - raw data, any format)
├→ Processed Zone (S3 - cleaned, partitioned)
└→ Curated Zone (S3 - analytics-ready, optimized formats)

Data Catalog & ETL:
├→ AWS Glue Crawler (auto-discover schemas, populate Data Catalog)
├→ AWS Glue ETL (serverless ETL jobs)
└→ AWS Glue Data Catalog (central metadata repository)

Query & Analytics:
├→ Amazon Athena (interactive SQL queries on S3)
├→ Amazon Redshift Spectrum (query S3 from Redshift)
├→ Amazon EMR (big data processing - Spark, Hive)
└→ Amazon QuickSight (visualizations and dashboards)

Governance:
├→ AWS Lake Formation (access control, data governance)
└→ AWS Glue DataBrew (data preparation, visual)
```

### Modernize Data Warehouses

**Migration: On-Prem Data Warehouse → Amazon Redshift**

**Traditional:**
- Oracle, Teradata, IBM Netezza
- High licensing costs
- Fixed capacity (expensive to scale)
- Manual maintenance

**Amazon Redshift:**
- Columnar storage, massively parallel processing
- Pay per hour or pay per query (Serverless)
- Scales to petabytes
- Integrated with S3 (Redshift Spectrum)

**Redshift Serverless:**
- No instance sizing
- Auto-scales compute
- Pay only for usage (RPU-hours)
- Good for: variable analytics workloads, unpredictable queries

**Migration Process:**
1. **Assess:** Schema Conversion Tool (SCT) assesses compatibility
2. **Convert Schema:** SCT converts DDL
3. **Migrate Data:** DMS or Redshift COPY command (from S3)
4. **Optimize:** Compression, distribution keys, sort keys
5. **Cutover:** Switch BI tools to Redshift

### Real-Time Analytics

**Pattern: Streaming Analytics**

**Architecture:**
```
Event Sources (IoT, Clickstream, Application Events)
    ↓
Amazon Kinesis Data Streams (real-time ingestion)
    ├→ Kinesis Data Analytics (real-time SQL on streams)
    ├→ Lambda (real-time processing)
    ├→ Kinesis Data Firehose (load to S3, Redshift, OpenSearch)
    └→ OpenSearch (real-time dashboards)
```

**Use Cases:**
- Real-time dashboards (website traffic, metrics)
- Fraud detection (analyze transactions in-flight)
- Anomaly detection (IoT sensor data)
- Clickstream analysis (user behavior)

---

## Machine Learning Integration

### Why Integrate ML?

**Modernization Opportunity:**
- Derive insights from existing data
- Automate decisions (fraud detection, recommendations)
- Enhance customer experience (personalization)
- Competitive differentiation

### ML Integration Patterns

**Pattern 1: Pre-Built AI Services (No ML Expertise Required)**

**Services:**
- **Amazon Rekognition:** Image and video analysis
  - Example: Auto-tag uploaded photos, detect inappropriate content
- **Amazon Comprehend:** Natural language processing (NLP)
  - Example: Sentiment analysis on customer reviews
- **Amazon Polly:** Text-to-speech
  - Example: Generate audio from articles
- **Amazon Transcribe:** Speech-to-text
  - Example: Transcribe customer support calls
- **Amazon Translate:** Language translation
  - Example: Translate product descriptions to multiple languages
- **Amazon Textract:** Extract text from documents (OCR)
  - Example: Process invoices, forms automatically
- **Amazon Forecast:** Time-series forecasting
  - Example: Predict product demand
- **Amazon Personalize:** Recommendation engine
  - Example: Product recommendations like Amazon.com

**Integration:**
```
Application → API Call → AWS AI Service → Result
```

**Example: Image Moderation**
```
User uploads image → S3
    ↓ (S3 event)
Lambda function
    ↓ (Calls Rekognition API)
Amazon Rekognition (detects inappropriate content)
    ↓ (Returns labels and confidence)
Lambda (flags if inappropriate, stores metadata)
    ↓
DynamoDB (image metadata + moderation status)
```

**Exam Scenario:**
**Q:** "Automatically categorize uploaded images without ML expertise."
**A:** Amazon Rekognition

**Pattern 2: Custom ML Models (SageMaker)**

**When to Use:**
- Pre-built services don't fit use case
- Have data science team
- Need custom models

**SageMaker Components:**
- **SageMaker Studio:** IDE for ML
- **SageMaker Training:** Train models at scale
- **SageMaker Hosting:** Deploy models (inference endpoints)
- **SageMaker Pipelines:** MLOps automation
- **SageMaker Feature Store:** Centralized feature management

**Architecture:**
```
Historical Data (S3)
    ↓
SageMaker Training Job (train model)
    ↓
Model Artifacts (S3)
    ↓
SageMaker Endpoint (deploy model)
    ↓
Application → Inference Request → SageMaker Endpoint → Prediction
```

**Pattern 3: Augmented Applications**

**Enhance Existing Apps with ML:**

**Example 1: E-Commerce Personalization**
```
Before: Static product catalog
After: Amazon Personalize recommendations
    ├→ "Customers who bought X also bought Y"
    ├→ Personalized homepage per user
    └→ Increase conversion rate 10-30%
```

**Example 2: Customer Support Automation**
```
Before: All tickets go to human agents
After: Amazon Comprehend + Lex chatbot
    ├→ Route simple questions to chatbot
    ├→ Complex questions to human agents
    └→ Reduce agent workload 40%+
```

**Example 3: Content Moderation**
```
Before: Manual review of all user content
After: Rekognition auto-flags inappropriate content
    ├→ Auto-approve safe content (95%)
    ├→ Human review flagged content (5%)
    └→ Reduce moderation cost 10x
```

### ML Modernization ROI

**High ROI Opportunities:**
- **Recommendation Engines:** 10-30% increase in sales
- **Fraud Detection:** Reduce fraud losses 40-60%
- **Predictive Maintenance:** Reduce downtime 30-50%
- **Customer Churn Prediction:** Improve retention 15-25%
- **Demand Forecasting:** Reduce inventory costs 20-30%

---

## Legacy System Retirement Strategies

### Retirement Assessment

**Identify Retirement Candidates:**
- Less than 5% user activity
- Functionality available in other systems
- No business owner identified
- End-of-life technology (unsupported)
- High maintenance cost, low value
- Compliance risk (outdated security)

**Retirement Process:**

**Phase 1: Validate Retirement Decision**
- Usage analysis (access logs, analytics)
- Stakeholder interviews (confirm not needed)
- Dependency check (no critical dependencies)
- Compliance review (data retention requirements)

**Phase 2: Data Archival**
- Identify data retention requirements (legal, compliance)
- Archive data to S3 Glacier Deep Archive (cheapest long-term storage)
- Document archival location and retrieval process
- Test data retrieval (ensure accessible if needed)

**Phase 3: Decommission**
- Communicate to users (shutdown date, alternatives)
- Redirect traffic / disable access (make read-only first, then full shutdown)
- Shut down infrastructure
- Cancel licenses and support contracts
- Document retirement (date, reason, data location)

**Phase 4: Cost Savings Realization**
- Eliminate license costs
- Remove infrastructure costs
- Reduce operational overhead
- Track and report savings

**Typical Savings:**
- Infrastructure: $500-$2000/month per application
- Licenses: $10K-$100K+/year for commercial software
- Operational overhead: 10-20% of IT staff time

**Exam Tip:** Retirement is often the MOST cost-effective "migration" strategy

---

## Modernization Decision Framework

### Prioritization Matrix

**Assess each modernization opportunity:**

| Opportunity | Business Value | Effort | Priority |
|-------------|----------------|--------|----------|
| Retire unused apps | High (cost savings) | Low | **1 - Do First** |
| Oracle → Aurora | High (licensing savings) | Medium | **2 - High Value** |
| Serverless cron jobs | Medium (cost savings) | Low | **2 - Quick Wins** |
| Monolith → Microservices | High (agility) | Very High | **3 - Strategic** |
| Data lake | Medium-High (analytics) | Medium-High | **3 - Strategic** |
| ML integration | Varies | Medium | **4 - Opportunistic** |

**Decision Criteria:**

**Do First:**
- High value / Low effort (quick wins)
- Example: Retire unused apps, migrate cron jobs to Lambda

**Do Soon:**
- High value / Medium effort
- Example: Commercial DB → Aurora, containerize apps

**Strategic (Plan Carefully):**
- High value / High effort
- Example: Microservices decomposition, data lake architecture
- Requires careful planning, phased execution

**Defer:**
- Low value / High effort
- Focus resources on higher-value initiatives

### Modernization Sequencing

**Phase 1: Foundation (Months 1-3)**
- Retire unused applications (20%)
- Migrate databases to RDS/Aurora (managed services)
- Containerize applications (ECS/EKS)
- Set up data lake foundation (S3 + Glue)

**Phase 2: Optimization (Months 4-9)**
- Serverless adoption (cron jobs, event processing)
- Analytics on data lake (Athena, Redshift)
- Integrate pre-built AI services (Rekognition, Comprehend)
- Optimize costs (rightsizing, reserved capacity)

**Phase 3: Transformation (Months 10-18)**
- Microservices extraction (if needed)
- Custom ML models (SageMaker)
- Real-time analytics (Kinesis)
- Advanced optimization

### Balancing Modernization and Migration

**Approach 1: Migrate First, Modernize Later**
- Rehost to AWS quickly
- Gain cloud benefits (reliability, backups)
- Modernize incrementally over time
- Lower initial risk

**Approach 2: Modernize During Migration**
- Replatform databases (RDS, Aurora)
- Containerize applications
- Some refactoring
- Moderate risk, faster time-to-value

**Approach 3: Aggressive Modernization**
- Refactor to cloud-native (microservices, serverless)
- Full modernization upfront
- Highest risk, highest long-term benefit
- Requires strong business case

**Exam Tip:** Most organizations do Approach 1 or 2 (incremental modernization)

---

## Exam Scenarios and Solutions

### Scenario 1: SQL Server Licensing Costs

**Q:** Company has 20 SQL Server instances. Licensing costs $500K/year. Want to reduce costs. Application uses T-SQL stored procedures.

**A:** Migrate to Aurora PostgreSQL with Babelfish
- Eliminates SQL Server licensing ($500K/year savings)
- Minimal application changes (Babelfish supports T-SQL)
- Managed service reduces operational overhead
- Use DMS for minimal-downtime migration

### Scenario 2: Idle Resources

**Q:** Cron jobs run on 10 EC2 instances. Each runs 10 minutes/day. EC2 costs $200/month.

**A:** EventBridge Scheduler + Lambda
- Replace EC2 cron jobs with scheduled Lambda functions
- Pay only for 10 min/day execution time
- Estimated cost: ~$2/month (100x savings)
- Immediate ROI

### Scenario 3: Analytics on Operational Data

**Q:** Operational data in RDS. Want analytics without impacting production database.

**A:** Build Data Lake
- DMS continuously replicate RDS → S3 (CDC)
- Store in S3 (Parquet format)
- Query with Athena or Redshift Spectrum
- No impact on operational database
- Scalable, cost-effective analytics

### Scenario 4: Image Processing

**Q:** Users upload images. Need to auto-categorize and detect inappropriate content.

**A:** Amazon Rekognition
- S3 upload event triggers Lambda
- Lambda calls Rekognition API
- Rekognition returns labels and moderation scores
- Store metadata in DynamoDB
- No ML expertise required

### Scenario 5: Unused Applications

**Q:** During assessment, 30 of 100 applications have < 5% usage. Must retain data for 7 years.

**A:** Retire 30 applications
- Archive data to S3 Glacier Deep Archive (7-year retention)
- Decommission infrastructure
- Cancel licenses
- Estimated savings: 30% of infrastructure budget
- Focus migration efforts on remaining 70 applications

---

## Summary: Modernization Opportunities

### High-Value Modernization Patterns

| Modernization | Business Value | Complexity | Typical ROI |
|---------------|----------------|------------|-------------|
| **Retire unused apps** | High (cost savings) | Low | Immediate |
| **Commercial DB → Aurora** | High (licensing) | Medium | 6-12 months |
| **VMs → Containers** | Medium (agility) | Low-Medium | 12-18 months |
| **Cron jobs → Serverless** | Medium (cost) | Low | Immediate |
| **Batch → Event-driven** | Medium (real-time) | Medium | 6-12 months |
| **Data warehouse → Redshift** | Medium-High | Medium | 12-18 months |
| **Build data lake** | High (analytics) | Medium-High | 12-24 months |
| **Integrate AI services** | Varies | Low | 6-18 months |
| **Microservices extraction** | High (agility) | High | 24+ months |

### Key Exam Takeaways

1. **Retirement first:** Always consider if application should be retired (highest ROI)
2. **Babelfish for SQL Server:** Minimal code changes, eliminate licensing
3. **Aurora Serverless v2:** Auto-scaling database for variable workloads
4. **DynamoDB for key-value:** When access patterns are simple, massive scale needed
5. **Data lake on S3:** Cost-effective analytics, schema-on-read flexibility
6. **Pre-built AI services:** No ML expertise required for common use cases
7. **Serverless for intermittent:** Lambda + EventBridge for sporadic workloads
8. **Containers before microservices:** Don't jump straight to microservices
9. **Incremental modernization:** Migrate first, modernize over time (lower risk)
10. **Purpose-built databases:** Use the right database for each workload

### Common Exam Patterns

**Pattern Recognition:**
- "Reduce SQL Server licensing costs" → **Aurora PostgreSQL with Babelfish**
- "Variable database workload" → **Aurora Serverless v2**
- "Simple key-value access, massive scale" → **DynamoDB**
- "Analytics without impacting production" → **Data lake** (S3 + Athena)
- "Categorize images automatically" → **Amazon Rekognition**
- "EC2 running cron jobs" → **EventBridge Scheduler + Lambda**
- "< 5% usage application" → **Retire** (archive data, decommission)
- "Need personalized recommendations" → **Amazon Personalize**

---

*Last Updated: 2025-11-17*
*Always verify current AWS service capabilities and pricing*
