# AWS Big Data Services Comparison

## Overview

This guide compares the major AWS big data services for the Solutions Architect Professional exam. Understanding when to use each service is critical for making the right architectural decisions.

## Services Covered

### Amazon EMR (Elastic MapReduce)
**What it is:** Managed cluster platform for big data frameworks like Apache Hadoop, Spark, HBase, Presto, and Flink.

**Key Characteristics:**
- Runs on EC2 instances (also supports EKS and Outposts)
- Full control over cluster configuration
- Supports complex data transformations and processing
- Pay for underlying EC2/EBS/S3 resources
- Best for ETL, machine learning, clickstream analysis, genomics

**When to Use:**
- Need specific big data frameworks (Hadoop, Spark, Hive, Presto)
- Complex data processing pipelines
- Custom configurations and libraries
- Long-running clusters for continuous processing
- Machine learning workloads with Spark MLlib

---

### Amazon Athena
**What it is:** Serverless interactive query service using SQL to analyze data in S3.

**Key Characteristics:**
- Completely serverless - no infrastructure to manage
- Pay per query (based on data scanned)
- Uses Presto under the hood
- Can query data in S3, CloudWatch Logs, DynamoDB, etc.
- Supports standard SQL (ANSI SQL)
- Integrates with AWS Glue Data Catalog

**When to Use:**
- Ad-hoc queries on S3 data
- Infrequent or sporadic analysis
- No need for a persistent cluster
- Log analysis (VPC Flow Logs, CloudTrail, ALB logs)
- Cost optimization (pay per query, not per hour)

---

### AWS Glue
**What it is:** Serverless ETL service for data preparation and transformation.

**Key Characteristics:**
- Fully managed ETL service
- Automatic schema discovery with Glue Crawler
- Glue Data Catalog (centralized metadata repository)
- Supports Python and Scala (Apache Spark based)
- Serverless - pay per second for jobs
- Visual ETL designer available

**When to Use:**
- ETL workloads (Extract, Transform, Load)
- Data catalog for organizing metadata
- Schema discovery and versioning
- Serverless data preparation
- Integrating multiple data sources

---

### Amazon Kinesis
**What it is:** Real-time data streaming platform with multiple services.

**Components:**
1. **Kinesis Data Streams:** Real-time data ingestion and processing
   - Durable storage (1-365 days retention)
   - Multiple consumers can read same stream
   - Manual shard management (or on-demand mode)

2. **Kinesis Data Firehose:** Load streaming data into destinations
   - Near real-time (60s minimum latency)
   - Automatic scaling
   - Can transform data with Lambda
   - Delivers to S3, Redshift, OpenSearch, Splunk, HTTP endpoints

3. **Kinesis Data Analytics:** Real-time analytics using SQL or Apache Flink
   - Process streaming data with SQL queries
   - Built-in templates for common patterns

**When to Use:**
- Real-time data ingestion (clickstream, IoT, logs)
- Real-time analytics and dashboards
- Log and event data collection
- Stream processing applications
- Need to process data before storing

---

### Amazon Redshift
**What it is:** Fully managed petabyte-scale data warehouse for analytical queries.

**Key Characteristics:**
- Columnar storage for OLAP workloads
- Massively Parallel Processing (MPP)
- SQL-based (PostgreSQL compatible)
- Automatic compression
- Redshift Spectrum for querying S3 data
- Concurrency Scaling for handling spikes
- RA3 nodes with managed storage

**When to Use:**
- Data warehousing and OLAP
- Complex analytical queries across large datasets
- Business intelligence and reporting
- Historical data analysis
- Joining data from multiple sources
- Need sub-second query performance

---

### Amazon MSK (Managed Streaming for Apache Kafka)
**What it is:** Fully managed Apache Kafka service.

**Key Characteristics:**
- Managed Apache Kafka clusters
- Compatible with native Kafka APIs
- High throughput, low latency
- Multiple AZ deployment
- Integration with Kafka Connect, Schema Registry
- Serverless option available (MSK Serverless)

**When to Use:**
- Existing Kafka applications (lift and shift)
- Need Kafka-specific features
- Building event-driven architectures
- Stream processing with Kafka Streams
- High throughput requirements
- Need exactly-once semantics

---

### AWS Lake Formation
**What it is:** Service to set up a secure data lake in days.

**Key Characteristics:**
- Builds on S3 as storage layer
- Centralized permissions and governance
- Data ingestion from various sources
- Fine-grained access control
- Built on Glue (uses Glue Catalog)
- Column-level and row-level security

**When to Use:**
- Building a data lake
- Need centralized security and governance
- Complex permission requirements
- Data lake across multiple services
- Simplifying data ingestion

---

### Amazon OpenSearch Service (formerly Elasticsearch)
**What it is:** Managed search and analytics engine.

**Key Characteristics:**
- Based on Elasticsearch and Kibana
- Full-text search capabilities
- Real-time application monitoring
- Log analytics
- Clickstream analytics
- Supports OpenSearch and Elasticsearch versions

**When to Use:**
- Full-text search
- Log analytics and visualization
- Real-time application monitoring
- Security analytics (SIEM)
- Clickstream analysis with visualization

---

## Detailed Comparison Table

| Service | Type | Use Case | Latency | Scaling | Pricing Model | SQL Support |
|---------|------|----------|---------|---------|---------------|-------------|
| **EMR** | Managed Cluster | Complex big data processing, ML | Minutes-Hours | Manual (cluster size) | EC2/EBS/S3 usage | Yes (Hive/Presto/Spark SQL) |
| **Athena** | Serverless Query | Ad-hoc queries on S3 | Seconds | Automatic | Per TB scanned | Yes (Presto SQL) |
| **Glue** | Serverless ETL | Data transformation, cataloging | Minutes | Automatic | Per DPU-hour | Yes (Spark SQL in jobs) |
| **Kinesis Streams** | Real-time Streaming | Real-time ingestion | Milliseconds | Manual shards/On-demand | Per shard-hour or on-demand | No (programming required) |
| **Kinesis Firehose** | Near Real-time Delivery | Load data to destinations | 60+ seconds | Automatic | Per GB ingested | No (can transform with Lambda) |
| **Kinesis Analytics** | Real-time Analytics | Stream processing | Sub-second | Automatic | Per KPU-hour | Yes (SQL or Flink) |
| **Redshift** | Data Warehouse | OLAP, BI, analytics | Sub-second to seconds | Manual (resize) | Per node-hour | Yes (PostgreSQL-compatible) |
| **MSK** | Managed Kafka | Event streaming, high throughput | Milliseconds | Manual/Serverless | Per broker-hour or serverless | No (Kafka APIs) |
| **Lake Formation** | Data Lake Setup | Data lake governance | Varies (depends on query engine) | Automatic | No direct cost (S3 + services) | Yes (via Athena/Redshift) |
| **OpenSearch** | Search & Analytics | Full-text search, log analytics | Milliseconds | Manual (instance count) | Per instance-hour | No (OpenSearch DSL) |

---

## Decision Tree

### Start Here: What's Your Primary Goal?

```
┌─────────────────────────────────────────────────────┐
│ What do you need to do with your data?              │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   REAL-TIME       ANALYTICS       PROCESSING
   STREAMING       & QUERIES       & ETL
        │               │               │
        │               │               │
        ▼               ▼               ▼
```

### Real-Time Streaming Path

```
Need real-time data ingestion?
│
├─ YES → Need to process before storing?
│        │
│        ├─ YES → Multiple consumers or replay?
│        │        │
│        │        ├─ YES → Kinesis Data Streams
│        │        │         (or MSK for Kafka compatibility)
│        │        │
│        │        └─ NO → Kinesis Data Firehose
│        │                 (simplest, auto-scales)
│        │
│        └─ NO → Need analytics on stream?
│                 │
│                 ├─ YES → Kinesis Data Analytics
│                 │
│                 └─ NO → Kinesis Data Firehose
│
└─ NO → Continue to Analytics path
```

### Analytics & Queries Path

```
Need to query/analyze data?
│
├─ Data already in S3?
│  │
│  ├─ YES → Ad-hoc queries?
│  │        │
│  │        ├─ YES → Athena
│  │        │         (serverless, pay per query)
│  │        │
│  │        └─ NO → Complex joins, BI reports?
│  │                 │
│  │                 └─ YES → Redshift Spectrum
│  │                           (or load to Redshift)
│  │
│  └─ NO → Need data warehouse?
│           │
│           └─ YES → Redshift
│                     (OLAP, sub-second queries)
│
├─ Full-text search needed?
│  │
│  └─ YES → OpenSearch Service
│
└─ Need data lake?
   │
   └─ YES → Lake Formation
            (+ Athena/Redshift for queries)
```

### Processing & ETL Path

```
Need to transform/process data?
│
├─ Serverless ETL?
│  │
│  └─ YES → AWS Glue
│            (schema discovery, data catalog)
│
├─ Complex big data frameworks?
│  │
│  └─ YES → Need Hadoop/Spark/Presto?
│            │
│            └─ YES → Amazon EMR
│                      (full control, custom configs)
│
└─ Event-driven architecture?
   │
   └─ YES → Existing Kafka apps?
            │
            ├─ YES → MSK
            │         (Kafka compatibility)
            │
            └─ NO → Kinesis Data Streams
                     (simpler, AWS-native)
```

---

## Common Exam Scenarios

### Scenario 1: Real-time Log Analysis
**Question:** Company needs to collect application logs from hundreds of servers, analyze them in real-time, and store for later querying.

**Answer:** Kinesis Data Firehose → OpenSearch Service (real-time) + S3 (storage) → Athena (later queries)

**Why:**
- Firehose: Automatic scaling, can deliver to multiple destinations
- OpenSearch: Real-time visualization and search
- S3 + Athena: Cost-effective long-term storage and ad-hoc queries

⚠️ **EXAM TIP:** If you see "real-time logs + visualization," think Kinesis + OpenSearch

---

### Scenario 2: Data Warehouse Migration
**Question:** Migrate on-premises Oracle data warehouse (100TB) to AWS for BI reporting with sub-second queries.

**Answer:** Amazon Redshift

**Why:**
- Designed for data warehousing (OLAP)
- Sub-second query performance
- BI tool integration
- Can use AWS DMS for migration

⚠️ **EXAM TIP:** "Data warehouse" + "BI" + "complex joins" = Redshift

---

### Scenario 3: Sporadic S3 Data Analysis
**Question:** Data scientists need to occasionally query CSV files in S3 using SQL. Files are added weekly.

**Answer:** AWS Glue Crawler (for schema) + Amazon Athena (for queries)

**Why:**
- Serverless (no cluster to maintain)
- Pay only when querying
- Glue Crawler automatically updates schema
- Perfect for infrequent access

⚠️ **EXAM TIP:** "Sporadic" or "ad-hoc" queries on S3 = Athena

---

### Scenario 4: Complex ETL Pipeline
**Question:** Daily ETL job transforming data from multiple sources (RDS, S3, DynamoDB) with complex business logic.

**Answer:** AWS Glue (serverless) OR Amazon EMR (if very complex)

**Why:**
- Glue: Serverless, automatic scaling, visual designer, built-in Data Catalog
- EMR: If custom libraries or complex Spark jobs needed

⚠️ **EXAM TIP:** "Serverless ETL" = Glue; "Custom Spark/Hadoop" = EMR

---

### Scenario 5: IoT Data Ingestion
**Question:** Millions of IoT devices sending data every second. Need to process and store for analytics.

**Answer:** Kinesis Data Streams → Lambda/Kinesis Analytics (processing) → S3/Redshift (storage)

**Why:**
- Data Streams: Handles high throughput, real-time ingestion
- Can replay data (retention up to 365 days)
- Multiple consumers possible

⚠️ **EXAM TIP:** "IoT" + "real-time" + "millions of devices" = Kinesis Data Streams

---

### Scenario 6: Clickstream Analysis with Visualization
**Question:** Analyze clickstream data in real-time with dashboards showing user behavior patterns.

**Answer:** Kinesis Data Firehose → OpenSearch Service + Kibana dashboards

**Why:**
- Firehose: Automatic scaling, no shard management
- OpenSearch: Real-time search and analytics
- Kibana: Rich visualization capabilities

⚠️ **EXAM TIP:** "Clickstream" + "real-time visualization" = Kinesis + OpenSearch

---

### Scenario 7: Machine Learning on Big Data
**Question:** Run machine learning algorithms on petabyte-scale datasets using Spark MLlib.

**Answer:** Amazon EMR with Spark

**Why:**
- Supports Spark MLlib natively
- Can scale to thousands of nodes
- Full control over cluster configuration
- Can use Spot instances for cost savings

⚠️ **EXAM TIP:** "Machine learning" + "Spark" = EMR

---

### Scenario 8: Kafka Migration
**Question:** Migrate existing Apache Kafka application to AWS with minimal code changes.

**Answer:** Amazon MSK (Managed Streaming for Kafka)

**Why:**
- 100% compatible with Apache Kafka
- Lift and shift with minimal changes
- Managed service (no cluster management)

⚠️ **EXAM TIP:** "Existing Kafka" or "Kafka compatibility" = MSK

---

### Scenario 9: Data Lake for Multiple Teams
**Question:** Build a centralized data lake with different access permissions for different teams and departments.

**Answer:** AWS Lake Formation (on S3) + Glue Data Catalog

**Why:**
- Lake Formation: Fine-grained access control (row/column level)
- Centralized governance
- Simplifies data lake setup
- Integration with Athena, Redshift, EMR

⚠️ **EXAM TIP:** "Data lake" + "fine-grained permissions" = Lake Formation

---

### Scenario 10: Cost Optimization for Query Workload
**Question:** Company running 24/7 EMR cluster but queries only run 2 hours per day. How to optimize costs?

**Answer:** Switch to Amazon Athena for ad-hoc queries

**Why:**
- No cluster to run 24/7
- Pay only for queries executed
- Serverless (no infrastructure costs)
- Can use same data in S3

⚠️ **EXAM TIP:** "Reduce costs" + "infrequent queries" = Move to Athena

---

## Key Differences Summary

### EMR vs Glue
| Aspect | EMR | Glue |
|--------|-----|------|
| **Management** | Manual cluster management | Fully serverless |
| **Flexibility** | Full control, any framework | Limited to Spark/Python/Scala |
| **Scaling** | Manual (or auto-scaling) | Automatic |
| **Cost** | Pay for cluster runtime | Pay per job execution |
| **Best For** | Complex processing, custom configs | Standard ETL, serverless needs |

⚠️ **EXAM TIP:** If question mentions "serverless" or "no infrastructure management" → Glue. If "custom libraries" or "specific versions" → EMR

---

### Kinesis Data Streams vs Kinesis Data Firehose
| Aspect | Data Streams | Data Firehose |
|--------|--------------|---------------|
| **Latency** | Real-time (milliseconds) | Near real-time (60s+) |
| **Scaling** | Manual shards or on-demand | Fully automatic |
| **Retention** | 1-365 days | No storage (delivery only) |
| **Consumers** | Multiple custom consumers | Predefined destinations |
| **Replay** | Yes (within retention) | No |
| **Complexity** | More complex (coding required) | Simpler (configuration only) |
| **Best For** | Custom processing, multiple consumers | Simple delivery to destinations |

⚠️ **EXAM TIP:** Need to replay or multiple consumers → Streams. Simple delivery → Firehose.

---

### Athena vs Redshift
| Aspect | Athena | Redshift |
|--------|--------|----------|
| **Architecture** | Serverless | Provisioned cluster |
| **Query Latency** | Seconds | Sub-second (optimized) |
| **Pricing** | Per TB scanned | Per node-hour |
| **Data Location** | S3 (data stays in S3) | Loaded into Redshift |
| **Best For** | Ad-hoc queries, sporadic use | BI, complex analytics, frequent queries |
| **Optimization** | Partitioning, compression | Distribution keys, sort keys, materialized views |

⚠️ **EXAM TIP:** "Ad-hoc" or "sporadic" → Athena. "BI" or "data warehouse" → Redshift.

---

### Kinesis vs MSK
| Aspect | Kinesis | MSK |
|--------|---------|-----|
| **Protocol** | AWS proprietary API | Apache Kafka API |
| **Compatibility** | AWS services | Kafka ecosystem |
| **Management** | Fully managed | Managed Kafka |
| **Scaling** | Shard-based or on-demand | Broker-based or serverless |
| **Best For** | AWS-native apps | Kafka migrations, Kafka ecosystem |

⚠️ **EXAM TIP:** Existing Kafka applications → MSK. New AWS projects → Kinesis.

---

### Glue vs Lake Formation
| Aspect | Glue | Lake Formation |
|--------|------|----------------|
| **Purpose** | ETL and data cataloging | Data lake setup and governance |
| **Permissions** | IAM-based | Fine-grained (column/row level) |
| **Scope** | ETL jobs, crawlers, catalog | Full data lake (uses Glue underneath) |
| **Best For** | ETL workflows | Data lake with complex permissions |

⚠️ **EXAM TIP:** Lake Formation builds on Glue, adds governance layer.

---

## Exam Strategy - Keywords to Watch

### Keywords that indicate specific services:

**Amazon EMR:**
- "Hadoop ecosystem"
- "Spark, Hive, Presto, HBase"
- "Custom configurations"
- "Long-running cluster"
- "Machine learning with Spark MLlib"
- "Genomics, bioinformatics"

**Amazon Athena:**
- "Ad-hoc queries"
- "Sporadic analysis"
- "No infrastructure"
- "Query S3 data"
- "Pay per query"
- "Serverless SQL"
- "VPC Flow Logs analysis"

**AWS Glue:**
- "Serverless ETL"
- "Data catalog"
- "Schema discovery"
- "Crawler"
- "Data preparation"
- "Multiple data sources"

**Kinesis Data Streams:**
- "Real-time ingestion"
- "Multiple consumers"
- "Replay capability"
- "Custom processing"
- "Durable streaming"
- "High throughput"

**Kinesis Data Firehose:**
- "Near real-time"
- "Simple delivery"
- "Automatic scaling"
- "Load to S3/Redshift/OpenSearch"
- "No coding required"

**Amazon Redshift:**
- "Data warehouse"
- "OLAP"
- "Business intelligence"
- "Complex joins"
- "Petabyte-scale analytics"
- "Columnar storage"
- "Materialized views"

**Amazon MSK:**
- "Apache Kafka"
- "Kafka migration"
- "Kafka Connect"
- "Existing Kafka application"

**Lake Formation:**
- "Data lake"
- "Fine-grained permissions"
- "Column-level security"
- "Row-level security"
- "Data governance"
- "Centralized access control"

**OpenSearch Service:**
- "Full-text search"
- "Log analytics"
- "Kibana dashboards"
- "Real-time monitoring"
- "Security analytics (SIEM)"

---

## Common Misconceptions

### ❌ Misconception 1: "Athena and Redshift are interchangeable"
**Reality:**
- Athena: Best for sporadic queries, pay per query
- Redshift: Best for frequent queries, complex analytics, BI
- Athena queries S3 directly; Redshift loads data into cluster

### ❌ Misconception 2: "Always use Kinesis Data Streams"
**Reality:**
- If you just need to deliver data to a destination (S3, Redshift), Firehose is simpler
- Use Streams only if you need custom processing, multiple consumers, or replay

### ❌ Misconception 3: "Glue can't handle complex transformations"
**Reality:**
- Glue runs Spark jobs and can handle complex transformations
- However, if you need specific versions or custom libraries, EMR is better

### ❌ Misconception 4: "EMR is always cheaper than Glue"
**Reality:**
- For sporadic jobs, Glue is cheaper (pay per job)
- For long-running or frequent jobs, EMR might be more cost-effective
- EMR allows Spot instances for additional savings

### ❌ Misconception 5: "MSK and Kinesis are the same"
**Reality:**
- MSK is managed Apache Kafka (Kafka API)
- Kinesis is AWS proprietary (AWS SDK/API)
- Choose MSK for Kafka compatibility, Kinesis for AWS-native integration

### ❌ Misconception 6: "Lake Formation replaces Glue"
**Reality:**
- Lake Formation builds on top of Glue (uses Glue Catalog)
- Adds governance, security, and simplified data lake setup
- You still use Glue for ETL jobs

---

## Cost Considerations

### Most Cost-Effective Options by Scenario:

**Infrequent Queries:**
- ✅ Athena (pay per query)
- ❌ Avoid: Redshift cluster running 24/7

**Sporadic ETL Jobs:**
- ✅ Glue (pay per job)
- ❌ Avoid: EMR cluster running continuously

**High-Frequency Analytics:**
- ✅ Redshift (predictable cost)
- ❌ Avoid: Athena (scanning costs add up)

**Real-time Delivery:**
- ✅ Kinesis Firehose (simple, automatic)
- ❌ Avoid: Data Streams if you don't need replay/multiple consumers

**Cost Optimization Tips:**
- **Athena:** Use partitioning and compression to reduce data scanned
- **Redshift:** Use RA3 nodes with managed storage, enable concurrency scaling carefully
- **EMR:** Use Spot instances (can save 50-90%), auto-termination for transient clusters
- **Glue:** Use Glue job bookmarks to process only new data
- **Kinesis:** Use on-demand mode if traffic is unpredictable

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    BIG DATA SERVICE SELECTOR                    │
└─────────────────────────────────────────────────────────────────┘

REAL-TIME STREAMING:
├─ Simple delivery → Kinesis Firehose
├─ Custom processing → Kinesis Data Streams
├─ Kafka compatibility → MSK
└─ Stream analytics → Kinesis Data Analytics

ANALYTICS & QUERIES:
├─ Ad-hoc S3 queries → Athena
├─ Data warehouse → Redshift
├─ Full-text search → OpenSearch
└─ Real-time dashboards → OpenSearch + Kinesis

PROCESSING & ETL:
├─ Serverless ETL → Glue
├─ Complex big data → EMR (Hadoop/Spark)
└─ Schema discovery → Glue Crawler

DATA LAKE:
├─ Setup & governance → Lake Formation
├─ Metadata catalog → Glue Data Catalog
└─ Query data lake → Athena or Redshift Spectrum

┌─────────────────────────────────────────────────────────────────┐
│                    EXAM DECISION MATRIX                         │
└─────────────────────────────────────────────────────────────────┘

Question Says...                     → Answer
────────────────────────────────────────────────────────────────
"Ad-hoc queries on S3"               → Athena
"Real-time + multiple consumers"     → Kinesis Data Streams
"Simple delivery to S3/Redshift"     → Kinesis Firehose
"Data warehouse + BI"                → Redshift
"Serverless ETL"                     → Glue
"Hadoop/Spark cluster"               → EMR
"Apache Kafka migration"             → MSK
"Full-text search + logs"            → OpenSearch
"Data lake + permissions"            → Lake Formation
"Schema discovery"                   → Glue Crawler
"Real-time analytics on stream"      → Kinesis Data Analytics
"Cost optimization for queries"      → Athena (if sporadic)
"Machine learning + Spark"           → EMR

┌─────────────────────────────────────────────────────────────────┐
│                    PRICING QUICK REFERENCE                      │
└─────────────────────────────────────────────────────────────────┘

Service          │ Pricing Model              │ Best Value When
─────────────────┼───────────────────────────┼──────────────────────
Athena           │ $5/TB scanned             │ Infrequent queries
Glue             │ $0.44/DPU-hour            │ Sporadic ETL jobs
EMR              │ EC2 + EMR charge          │ Continuous processing
Redshift         │ $0.25/node-hour (DC2)     │ Frequent analytics
Kinesis Streams  │ $0.015/shard-hour         │ High throughput needs
Kinesis Firehose │ $0.029/GB                 │ Simple delivery
MSK              │ $0.21/broker-hour         │ Kafka workloads
OpenSearch       │ Instance-based            │ Search + analytics
Lake Formation   │ No direct cost            │ Always (uses S3/Glue)

┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE COMPARISON                       │
└─────────────────────────────────────────────────────────────────┘

Service          │ Latency        │ Throughput  │ Scalability
─────────────────┼────────────────┼─────────────┼─────────────────
Kinesis Streams  │ Milliseconds   │ MBs/sec     │ Add shards
Kinesis Firehose │ 60+ seconds    │ Automatic   │ Automatic
MSK              │ Milliseconds   │ GBs/sec     │ Add brokers
Athena           │ Seconds        │ TB/query    │ Automatic
Redshift         │ Sub-second     │ PB scale    │ Resize cluster
Glue             │ Minutes        │ Spark-based │ Add DPUs
EMR              │ Variable       │ PB scale    │ Add nodes
OpenSearch       │ Milliseconds   │ GB/sec      │ Add nodes

```

---

## Integration Patterns

### Pattern 1: Lambda Architecture
```
Real-time: Kinesis Data Streams → Lambda/Kinesis Analytics → DynamoDB
Batch: S3 → Glue → Redshift
Query: Redshift (combines both paths)
```

### Pattern 2: Complete Data Lake
```
Ingestion: Kinesis Firehose → S3
Catalog: Glue Crawler → Glue Data Catalog
Governance: Lake Formation (permissions)
Query: Athena (ad-hoc) + Redshift (BI)
```

### Pattern 3: Real-time Analytics Pipeline
```
IoT Devices → Kinesis Data Streams → Kinesis Data Analytics → OpenSearch
                    ↓
                    └→ Kinesis Firehose → S3 (archival)
```

### Pattern 4: ETL Pipeline
```
Multiple Sources (RDS, S3, DynamoDB) → Glue ETL → S3
                                                    ↓
                                           Athena or Redshift
```

### Pattern 5: Machine Learning Pipeline
```
S3 (raw data) → EMR (preprocessing + ML) → S3 (results)
                                            ↓
                                     SageMaker (deployment)
```

---

## Best Practices for the Exam

1. **Read Carefully:** Look for keywords about latency, cost, and operational overhead
2. **Serverless Preference:** AWS generally prefers serverless solutions (Athena, Glue) unless there's a specific reason
3. **Cost Optimization:** "Minimize costs" often means serverless or pay-per-use models
4. **Real-time vs Near Real-time:** Real-time = Data Streams/MSK; Near real-time = Firehose
5. **Existing Technology:** If they mention "existing Kafka," answer is MSK; "existing Hadoop," answer is EMR
6. **Multiple Consumers:** If data needs to be read by multiple applications, use Kinesis Data Streams
7. **Simple Requirements:** If requirements are straightforward, choose the simpler service (Firehose over Streams)
8. **Data Location:** Athena queries data in S3; Redshift loads data into cluster

---

## Summary Table for Quick Review

| Need | First Choice | Alternative | Avoid |
|------|-------------|-------------|-------|
| Real-time ingestion | Kinesis Data Streams | MSK | EMR |
| Simple data delivery | Kinesis Firehose | - | Data Streams (too complex) |
| Ad-hoc S3 queries | Athena | Redshift Spectrum | Redshift (too expensive) |
| Data warehouse | Redshift | - | Athena (too slow for BI) |
| Serverless ETL | Glue | Step Functions + Lambda | EMR (not serverless) |
| Big data processing | EMR | Glue (if simple) | Lambda (15 min limit) |
| Kafka workloads | MSK | Kinesis (if flexible) | Custom EC2 Kafka |
| Full-text search | OpenSearch | - | Athena (not designed for it) |
| Data lake setup | Lake Formation | S3 + Glue | Manual setup |
| Machine learning | EMR (Spark MLlib) | SageMaker | Lambda |
| Log analysis | OpenSearch + Kinesis | Athena | Manual processing |
| Schema discovery | Glue Crawler | - | Manual cataloging |

---

## Final Exam Tips

⚠️ **CRITICAL EXAM STRATEGIES:**

1. **Serverless is King:** Unless there's a specific requirement for control or custom configurations, choose serverless (Glue over EMR, Athena over Redshift cluster)

2. **Cost Matters:** If "minimize costs" appears, think about usage patterns:
   - Sporadic = serverless/pay-per-use
   - Continuous = provisioned resources

3. **Real-time Requirement:**
   - True real-time (ms latency) = Kinesis Data Streams or MSK
   - Near real-time (60s acceptable) = Kinesis Firehose

4. **Complexity Principle:** Choose the simplest service that meets requirements
   - Don't choose EMR if Glue works
   - Don't choose Data Streams if Firehose works

5. **Existing Technology:** Match AWS service to existing technology
   - Kafka → MSK
   - Hadoop/Spark → EMR
   - SQL data warehouse → Redshift

6. **Data Location:**
   - Data stays in S3 → Athena, Glue
   - Data loaded into service → Redshift, OpenSearch

7. **Query Frequency:**
   - Occasional → Athena
   - Frequent → Redshift

8. **Multiple Consumers:** Need replay or multiple apps reading same data → Kinesis Data Streams (not Firehose)

---

*This comparison guide covers the most common big data services for the AWS Solutions Architect Professional exam. Focus on understanding the decision criteria rather than memorizing features.*
