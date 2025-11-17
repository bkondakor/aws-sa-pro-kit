# Domain 3: Hands-On Labs Guide

## Overview

This document provides practical, hands-on labs for Domain 3. These labs reinforce concepts and give you real-world experience with continuous improvement strategies.

**Important:** These labs use AWS Free Tier services where possible, but some may incur small charges. Always clean up resources after completion.

---

## Lab 1: Comprehensive CloudWatch Monitoring Setup

**Duration:** 60 minutes
**Cost:** ~$2-5 (CloudWatch custom metrics and alarms)
**Difficulty:** Beginner

### Objective
Set up complete observability for a web application with metrics, logs, alarms, and dashboards.

### Prerequisites
- AWS account
- Basic Linux knowledge
- EC2 instance (t2.micro eligible for free tier)

### Steps

**Part 1: Install CloudWatch Agent for Custom Metrics**

1. Launch EC2 instance (Amazon Linux 2023)
   ```bash
   # Use AWS Console or CLI
   aws ec2 run-instances \
     --image-id ami-0abcdef1234567890 \
     --instance-type t2.micro \
     --key-name your-key \
     --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=CloudWatch-Lab}]'
   ```

2. Create IAM role for CloudWatch
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "cloudwatch:PutMetricData",
           "ec2:DescribeVolumes",
           "ec2:DescribeTags",
           "logs:PutLogEvents",
           "logs:DescribeLogStreams",
           "logs:DescribeLogGroups",
           "logs:CreateLogStream",
           "logs:CreateLogGroup"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
   Attach to instance

3. SSH to instance and install CloudWatch agent
   ```bash
   sudo yum install -y amazon-cloudwatch-agent
   ```

4. Create CloudWatch agent configuration
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
   ```

   Configuration choices:
   - On Linux: Yes
   - Collect EC2 metrics: Yes
   - Aggregation interval: 60 seconds
   - Collect memory metrics: Yes
   - Collect disk metrics: Yes
   - Collect logs: Yes
   - Log file path: /var/log/messages

5. Start CloudWatch agent
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
     -a fetch-config \
     -m ec2 \
     -s \
     -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
   ```

**Part 2: Create Custom Metrics**

1. Create simple web application
   ```bash
   sudo yum install -y httpd
   sudo systemctl start httpd
   sudo systemctl enable httpd
   ```

2. Create script to publish custom metrics
   ```bash
   cat > /home/ec2-user/publish-metrics.sh << 'EOF'
   #!/bin/bash
   while true; do
     # Simulate application metrics
     REQUEST_COUNT=$(( RANDOM % 1000 ))
     ERROR_COUNT=$(( RANDOM % 10 ))

     aws cloudwatch put-metric-data \
       --namespace "MyApp/Production" \
       --metric-name RequestCount \
       --value $REQUEST_COUNT \
       --dimensions Environment=Production

     aws cloudwatch put-metric-data \
       --namespace "MyApp/Production" \
       --metric-name ErrorCount \
       --value $ERROR_COUNT \
       --dimensions Environment=Production

     sleep 60
   done
   EOF

   chmod +x /home/ec2-user/publish-metrics.sh
   nohup /home/ec2-user/publish-metrics.sh &
   ```

**Part 3: Create CloudWatch Alarms**

1. High CPU alarm
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name high-cpu-alarm \
     --alarm-description "Alert when CPU exceeds 70%" \
     --metric-name CPUUtilization \
     --namespace AWS/EC2 \
     --statistic Average \
     --period 300 \
     --evaluation-periods 2 \
     --threshold 70 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=InstanceId,Value=i-1234567890abcdef0
   ```

2. High error rate alarm
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name high-error-rate \
     --alarm-description "Alert when errors exceed 5 per minute" \
     --metric-name ErrorCount \
     --namespace "MyApp/Production" \
     --statistic Sum \
     --period 60 \
     --evaluation-periods 3 \
     --threshold 15 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=Environment,Value=Production
   ```

3. Composite alarm (CPU AND Memory)
   ```bash
   # First create memory alarm
   aws cloudwatch put-metric-alarm \
     --alarm-name high-memory \
     --metric-name mem_used_percent \
     --namespace CWAgent \
     --statistic Average \
     --period 300 \
     --evaluation-periods 2 \
     --threshold 80 \
     --comparison-operator GreaterThanThreshold

   # Then create composite
   aws cloudwatch put-composite-alarm \
     --alarm-name high-cpu-and-memory \
     --alarm-description "Alert when both CPU and memory are high" \
     --alarm-rule "ALARM(high-cpu-alarm) AND ALARM(high-memory)"
   ```

**Part 4: Create Dashboard**

1. Via Console: CloudWatch → Dashboards → Create dashboard
2. Add widgets:
   - Line graph: EC2 CPU utilization
   - Number: Current RequestCount
   - Line graph: ErrorCount over time
   - Log insights query results

**Part 5: CloudWatch Logs Insights**

1. Navigate to CloudWatch Logs Insights
2. Run queries:
   ```
   # Find all errors
   fields @timestamp, @message
   | filter @message like /ERROR/
   | sort @timestamp desc
   | limit 100

   # Calculate error rate
   stats count(*) as total, sum(level = "ERROR") as errors by bin(5m)
   | fields (errors / total * 100) as error_rate, bin(5m) as time
   ```

### Expected Results
- CloudWatch agent reporting custom metrics (memory, disk)
- Custom application metrics visible in CloudWatch
- Alarms in OK state (or ALARM if thresholds breached)
- Dashboard showing all metrics
- CloudWatch Logs with system and application logs

### Cleanup
```bash
# Stop CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a stop

# Delete alarms
aws cloudwatch delete-alarms --alarm-names high-cpu-alarm high-error-rate high-memory high-cpu-and-memory

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Delete log groups
aws logs delete-log-group --log-group-name /aws/ec2/linux/messages
```

---

## Lab 2: AWS Fault Injection Simulator (Chaos Engineering)

**Duration:** 45 minutes
**Cost:** ~$5 (EC2 instances, FIS experiment)
**Difficulty:** Intermediate

### Objective
Test application resilience using AWS FIS to terminate instances and verify Auto Scaling recovery.

### Prerequisites
- VPC with public subnets in 2 AZs
- Application Load Balancer
- Auto Scaling group (min: 4, desired: 4, max: 8)

### Steps

**Part 1: Setup Test Environment**

1. Create Auto Scaling group with user data
   ```bash
   #!/bin/bash
   yum update -y
   yum install -y httpd
   systemctl start httpd
   systemctl enable httpd

   INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
   AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)

   cat > /var/www/html/index.html <<EOF
   <h1>Instance: $INSTANCE_ID</h1>
   <h2>AZ: $AZ</h2>
   <p>This instance is healthy!</p>
   EOF
   ```

2. Configure ALB health checks
   - Protocol: HTTP
   - Path: /index.html
   - Healthy threshold: 2
   - Unhealthy threshold: 2
   - Interval: 10 seconds

3. Create CloudWatch alarm for monitoring
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name high-unhealthy-hosts \
     --metric-name UnHealthyHostCount \
     --namespace AWS/ApplicationELB \
     --statistic Average \
     --period 60 \
     --evaluation-periods 1 \
     --threshold 2 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=LoadBalancer,Value=app/my-alb/50dc6c495c0c9188
   ```

**Part 2: Create FIS IAM Role**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:TerminateInstances",
        "ec2:DescribeInstances",
        "ec2:StopInstances",
        "autoscaling:DescribeAutoScalingGroups"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:DescribeAlarms"
      ],
      "Resource": "*"
    }
  ]
}
```

**Part 3: Create FIS Experiment Template**

1. Via Console: AWS FIS → Experiment templates → Create
2. Configuration:
   ```
   Name: terminate-25-percent-instances
   Description: Test Auto Scaling recovery by terminating 25% of instances

   Target:
   - Resource type: aws:ec2:instance
   - Target method: Resource tags
   - Selection mode: PERCENT(25)
   - Tags: Environment=Test

   Action:
   - Type: aws:ec2:terminate-instances
   - Name: TerminateInstances

   Stop Condition:
   - Source: aws:cloudwatch:alarm
   - Alarm: high-unhealthy-hosts

   Role: FISRole (created above)
   ```

**Part 4: Run Experiment**

1. Before running, prepare monitoring:
   ```bash
   # Terminal 1: Watch Auto Scaling activity
   watch -n 5 'aws autoscaling describe-auto-scaling-groups \
     --auto-scaling-group-names my-asg \
     --query "AutoScalingGroups[0].[Instances[?LifecycleState==\`InService\`].InstanceId, DesiredCapacity, MinSize, MaxSize]"'

   # Terminal 2: Monitor ALB targets
   watch -n 5 'aws elbv2 describe-target-health \
     --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/my-targets/50dc6c495c0c9188'

   # Terminal 3: Monitor CloudWatch alarm
   watch -n 5 'aws cloudwatch describe-alarms \
     --alarm-names high-unhealthy-hosts \
     --query "MetricAlarms[0].StateValue"'
   ```

2. Start FIS experiment
   ```bash
   aws fis start-experiment \
     --experiment-template-id EXTxxxxxxxxxxx
   ```

3. Observe:
   - FIS terminates 1 instance (25% of 4)
   - ALB marks instance as unhealthy
   - Auto Scaling detects missing instance
   - Auto Scaling launches replacement
   - New instance passes health checks
   - ALB adds new instance to rotation
   - Total time: ~3-5 minutes

**Part 5: Analyze Results**

1. Check CloudWatch metrics:
   - TargetResponseTime (should spike briefly)
   - UnHealthyHostCount (should show 1 unhealthy)
   - RequestCount (should remain stable)

2. Review FIS experiment results:
   - Status: Completed or Stopped
   - Duration: ~5 minutes
   - Actions taken: Listed

3. Check Auto Scaling activity
   ```bash
   aws autoscaling describe-scaling-activities \
     --auto-scaling-group-name my-asg \
     --max-records 5
   ```

### Expected Results
- 1 instance terminated
- Auto Scaling launched replacement within 2-3 minutes
- No significant service disruption (ALB distributed to remaining instances)
- CloudWatch alarm may briefly enter ALARM state
- All systems return to normal

### Advanced: Multi-AZ Failure

Modify experiment to simulate entire AZ failure:
```
Target: aws:ec2:availability-zone
Action: aws:fis:inject-api-unavailability-error
Duration: PT5M (5 minutes)
```

### Cleanup
```bash
# Delete FIS experiment template
aws fis delete-experiment-template --id EXTxxxxxxxxxxx

# Delete CloudWatch alarm
aws cloudwatch delete-alarms --alarm-names high-unhealthy-hosts

# Delete Auto Scaling group
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name my-asg --force-delete

# Delete ALB and target group
aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:...
aws elbv2 delete-target-group --target-group-arn arn:aws:elasticloadbalancing:...
```

---

## Lab 3: Cost Optimization with Compute Optimizer

**Duration:** 30 minutes (+ 14 days wait for data)
**Cost:** Free (uses existing resources)
**Difficulty:** Beginner

### Objective
Enable Compute Optimizer, analyze recommendations, and implement right-sizing.

### Prerequisites
- Running EC2 instances (14+ days for meaningful data)
- CloudWatch agent installed (for memory metrics)

### Steps

**Part 1: Enable Compute Optimizer**

1. Navigate to AWS Compute Optimizer console
2. Click "Opt in"
3. Choose:
   - Opt in all accounts in organization (if using Organizations)
   - Enhanced infrastructure metrics: Yes (more detailed recommendations)

4. Wait 14+ days for data collection (or use existing instances)

**Part 2: Review Recommendations**

1. Navigate to EC2 instance recommendations
2. Examine findings:
   ```
   Example finding:
   Instance: i-1234567890abcdef0
   Current: m5.2xlarge (8 vCPU, 32 GB RAM)
   Monthly cost: $280

   Finding: Over-provisioned

   Recommendation options:
   1. m5.large (Optimized)
      - 2 vCPU, 8 GB RAM
      - Performance risk: Very Low
      - Monthly savings: $210 (75%)
      - CPU P99: 18% → 72%
      - Memory P99: 22% → 88%

   2. m5.xlarge (Alternative)
      - 4 vCPU, 16 GB RAM
      - Performance risk: Very Low
      - Monthly savings: $140 (50%)
      - CPU P99: 18% → 36%

   3. m5.2xlarge (Current)
      - No change
      - Savings: $0
   ```

3. Download CSV report for all instances

**Part 3: Implement Recommendation**

1. For a non-production instance, test recommendation:
   ```bash
   # Stop instance
   aws ec2 stop-instances --instance-ids i-1234567890abcdef0

   # Wait for stopped state
   aws ec2 wait instance-stopped --instance-ids i-1234567890abcdef0

   # Modify instance type
   aws ec2 modify-instance-attribute \
     --instance-id i-1234567890abcdef0 \
     --instance-type m5.large

   # Start instance
   aws ec2 start-instances --instance-ids i-1234567890abcdef0
   ```

2. Monitor for 24-48 hours:
   - CPU utilization (should be higher but still <80%)
   - Memory utilization
   - Application performance metrics
   - User-reported issues

3. If successful, repeat for production:
   - During maintenance window
   - One instance at a time
   - Blue/green deployment for critical systems

**Part 4: Lambda Memory Optimization**

1. Review Lambda recommendations
   ```
   Function: process-images
   Current: 3008 MB
   Duration: 1200 ms
   Cost per invocation: $0.000025

   Recommendation: 1536 MB
   Projected duration: 1800 ms
   Projected cost: $0.000018 (28% cheaper)

   Reason: Memory over-allocated, slower execution is acceptable,
           lower memory reduces cost despite longer duration
   ```

2. Implement via Console or CLI:
   ```bash
   aws lambda update-function-configuration \
     --function-name process-images \
     --memory-size 1536
   ```

3. Test thoroughly before deploying to production

**Part 5: EBS Volume Optimization**

1. Review EBS recommendations
   ```
   Volume: vol-1234567890abcdef0
   Current: io2, 500 GB, 5000 IOPS
   Monthly cost: $117 (storage) + $325 (IOPS) = $442

   Usage:
   - IOPS: 500 average, 1200 max
   - Throughput: 50 MB/s average

   Recommendation: gp3, 500 GB, 3000 IOPS baseline
   Monthly cost: $40 (storage) + $0 (baseline IOPS included)
   Savings: $402/month (91%)

   Performance impact: None (usage within gp3 capabilities)
   ```

2. Create snapshot before modifying (safety)
   ```bash
   aws ec2 create-snapshot \
     --volume-id vol-1234567890abcdef0 \
     --description "Before gp3 conversion"
   ```

3. Modify volume (requires downtime or EBS elastic volumes feature)
   ```bash
   aws ec2 modify-volume \
     --volume-id vol-1234567890abcdef0 \
     --volume-type gp3 \
     --iops 3000
   ```

### Expected Results
- Compute Optimizer shows recommendations for EC2, Lambda, EBS
- Successfully right-sized instance with 50-75% cost savings
- No performance degradation
- Lambda optimization reduced costs by 20-40%
- EBS optimization reduced costs by 80-90%

### Best Practices Learned
- Right-size before purchasing RIs/Savings Plans
- Use Compute Optimizer ML insights (not just CPU metrics)
- Test in non-production first
- Monitor after changes
- Consider performance trade-offs

---

## Lab 4: Security Hub with Automated Remediation

**Duration:** 45 minutes
**Cost:** ~$3-5 (Security Hub findings, Lambda executions)
**Difficulty:** Intermediate

### Objective
Enable Security Hub, detect security findings, and implement automated remediation for common issues.

### Steps

**Part 1: Enable Security Hub**

1. Enable prerequisites:
   ```bash
   # Enable AWS Config (required for Security Hub)
   aws configservice put-configuration-recorder \
     --configuration-recorder name=default,roleARN=arn:aws:iam::123456789012:role/ConfigRole

   aws configservice put-delivery-channel \
     --delivery-channel name=default,s3BucketName=config-bucket-123456

   aws configservice start-configuration-recorder --configuration-recorder-name default
   ```

2. Enable Security Hub
   ```bash
   aws securityhub enable-security-hub \
     --enable-default-standards
   ```

3. Enable integrations:
   - GuardDuty
   - Inspector
   - IAM Access Analyzer

**Part 2: Create Test Findings**

1. Create non-compliant S3 bucket:
   ```bash
   aws s3 mb s3://test-public-bucket-$(date +%s)
   aws s3api put-bucket-acl \
     --bucket test-public-bucket-$(date +%s) \
     --acl public-read
   ```

2. Create EC2 instance without encryption:
   ```bash
   aws ec2 run-instances \
     --image-id ami-0abcdef1234567890 \
     --instance-type t2.micro \
     --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":8,"Encrypted":false}}]'
   ```

3. Wait 10-30 minutes for Security Hub to detect issues

**Part 3: Create Auto-Remediation Lambda**

1. Create Lambda function for S3 remediation:
   ```python
   import boto3
   import json

   s3 = boto3.client('s3')
   securityhub = boto3.client('securityhub')

   def lambda_handler(event, context):
       # Parse Security Hub finding
       finding = event['detail']['findings'][0]

       # Extract bucket name from finding
       resources = finding.get('Resources', [])
       for resource in resources:
           if resource['Type'] == 'AwsS3Bucket':
               bucket_name = resource['Id'].split(':')[-1]

               try:
                   # Block public access
                   s3.put_public_access_block(
                       Bucket=bucket_name,
                       PublicAccessBlockConfiguration={
                           'BlockPublicAcls': True,
                           'IgnorePublicAcls': True,
                           'BlockPublicPolicy': True,
                           'RestrictPublicBuckets': True
                       }
                   )

                   # Update finding to RESOLVED
                   securityhub.batch_update_findings(
                       FindingIdentifiers=[{
                           'Id': finding['Id'],
                           'ProductArn': finding['ProductArn']
                       }],
                       Workflow={'Status': 'RESOLVED'},
                       Note={
                           'Text': 'Auto-remediated: Blocked public access',
                           'UpdatedBy': 'AutoRemediation-Lambda'
                       }
                   )

                   return {
                       'statusCode': 200,
                       'body': json.dumps(f'Remediated bucket: {bucket_name}')
                   }
               except Exception as e:
                   print(f"Error remediating bucket {bucket_name}: {e}")
                   return {
                       'statusCode': 500,
                       'body': json.dumps(f'Error: {str(e)}')
                   }
   ```

2. Create IAM role for Lambda:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutPublicAccessBlock",
           "s3:GetPublicAccessBlock",
           "securityhub:BatchUpdateFindings",
           "logs:CreateLogGroup",
           "logs:CreateLogStream",
           "logs:PutLogEvents"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

**Part 4: Create EventBridge Rule**

1. Create rule to trigger Lambda on Security Hub findings:
   ```json
   {
     "source": ["aws.securityhub"],
     "detail-type": ["Security Hub Findings - Imported"],
     "detail": {
       "findings": {
         "Severity": {
           "Label": ["CRITICAL", "HIGH"]
         },
         "Title": [{
           "prefix": "S3.1"
         }],
         "Workflow": {
           "Status": ["NEW"]
         }
       }
     }
   }
   ```

2. Set Lambda as target

**Part 5: Test Remediation**

1. Create new non-compliant bucket:
   ```bash
   aws s3 mb s3://test-remediation-$(date +%s)
   aws s3api put-bucket-acl --bucket test-remediation-$(date +%s) --acl public-read
   ```

2. Wait 5-15 minutes for:
   - Security Hub to detect finding
   - EventBridge rule to trigger
   - Lambda to remediate
   - Finding to be marked RESOLVED

3. Verify remediation:
   ```bash
   aws s3api get-public-access-block --bucket test-remediation-$(date +%s)
   # Should show all blocks enabled
   ```

### Expected Results
- Security Hub enabled with findings
- Automated remediation triggered by EventBridge
- S3 bucket public access blocked automatically
- Finding marked as RESOLVED
- CloudWatch Logs showing Lambda execution

### Cleanup
```bash
# Disable Security Hub
aws securityhub disable-security-hub

# Delete Lambda function
aws lambda delete-function --function-name S3RemediationFunction

# Delete EventBridge rule
aws events remove-targets --rule SecurityHubRemediation --ids "1"
aws events delete-rule --name SecurityHubRemediation

# Delete test buckets
aws s3 rb s3://test-public-bucket-$(date +%s) --force
aws s3 rb s3://test-remediation-$(date +%s) --force
```

---

## Lab 5: Performance Optimization with ElastiCache

**Duration:** 60 minutes
**Cost:** ~$5-10 (ElastiCache Redis)
**Difficulty:** Intermediate

### Objective
Implement caching layer to reduce database load and improve application performance.

### Setup

**Part 1: Create Test Database and Application**

1. Create RDS MySQL instance (db.t3.micro)
2. Create simple web application on EC2:
   ```python
   from flask import Flask, jsonify
   import mysql.connector
   import redis
   import time
   import json

   app = Flask(__name__)

   # Database configuration
   db_config = {
       'host': 'mydb.abcdef.us-east-1.rds.amazonaws.com',
       'user': 'admin',
       'password': 'mypassword',
       'database': 'testdb'
   }

   # Redis configuration (will add later)
   cache = None

   @app.route('/product/<int:product_id>')
   def get_product(product_id):
       start_time = time.time()

       # Try cache first (if enabled)
       if cache:
           cached_data = cache.get(f'product:{product_id}')
           if cached_data:
               duration = (time.time() - start_time) * 1000
               return jsonify({
                   'data': json.loads(cached_data),
                   'source': 'cache',
                   'duration_ms': round(duration, 2)
               })

       # Cache miss - query database
       conn = mysql.connector.connect(**db_config)
       cursor = conn.cursor(dictionary=True)
       cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
       product = cursor.fetchone()
       cursor.close()
       conn.close()

       # Store in cache (if enabled)
       if cache and product:
           cache.setex(f'product:{product_id}', 300, json.dumps(product))

       duration = (time.time() - start_time) * 1000
       return jsonify({
           'data': product,
           'source': 'database',
           'duration_ms': round(duration, 2)
       })

   if __name__ == '__main__':
       app.run(host='0.0.0.0', port=5000)
   ```

**Part 2: Baseline Performance (No Cache)**

1. Generate load:
   ```bash
   # Install Apache Bench
   sudo yum install -y httpd-tools

   # Run test (1000 requests, 50 concurrent)
   ab -n 1000 -c 50 http://localhost:5000/product/1
   ```

2. Record baseline metrics:
   - Requests per second
   - Average response time
   - Database CPU utilization (CloudWatch)
   - Database connections

**Part 3: Create ElastiCache Redis Cluster**

1. Via Console: ElastiCache → Create Redis cluster
   - Cluster mode: Disabled (for simplicity)
   - Node type: cache.t3.micro (free tier eligible)
   - Number of replicas: 0 (single node for lab)
   - Subnet group: Same VPC as application
   - Security group: Allow port 6379 from application

2. Get Redis endpoint

**Part 4: Enable Caching in Application**

1. Update application code:
   ```python
   # Add at the top after imports
   cache = redis.Redis(
       host='my-redis-cluster.abcdef.0001.use1.cache.amazonaws.com',
       port=6379,
       decode_responses=True
   )
   ```

2. Restart application

**Part 5: Test with Cache**

1. Run same load test:
   ```bash
   ab -n 1000 -c 50 http://localhost:5000/product/1
   ```

2. Compare metrics:
   ```
   Baseline (no cache):
   - Requests/sec: 50
   - Avg response time: 20ms
   - DB CPU: 40%
   - DB connections: 50

   With cache:
   - Requests/sec: 2000 (40x improvement!)
   - Avg response time: 0.5ms (40x faster!)
   - DB CPU: 5% (8x reduction)
   - DB connections: 0 (after first request)
   ```

3. Monitor cache hit ratio:
   ```bash
   # Connect to Redis
   redis-cli -h my-redis-cluster.abcdef.0001.use1.cache.amazonaws.com

   # Get info
   INFO stats

   # Look for:
   # keyspace_hits: 999
   # keyspace_misses: 1
   # Hit ratio: 99.9%
   ```

### Expected Results
- 40-100x improvement in response time
- 80-95% reduction in database load
- 90%+ cache hit ratio after warm-up
- Dramatic increase in requests per second

### Advanced: Cache Invalidation

Add cache invalidation on product update:
```python
@app.route('/product/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    # Update database
    # ...

    # Invalidate cache
    cache.delete(f'product:{product_id}')

    return jsonify({'status': 'updated'})
```

### Cleanup
```bash
# Delete ElastiCache cluster
aws elasticache delete-cache-cluster --cache-cluster-id my-redis-cluster

# Terminate EC2 instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Delete RDS instance
aws rds delete-db-instance \
  --db-instance-identifier mydb \
  --skip-final-snapshot
```

---

## Summary

These labs provide hands-on experience with:
1. **CloudWatch**: Complete observability setup
2. **Chaos Engineering**: FIS for resilience testing
3. **Cost Optimization**: Compute Optimizer recommendations
4. **Security**: Automated remediation with Security Hub
5. **Performance**: ElastiCache implementation

**Next Steps:**
- Complete all labs
- Experiment with variations
- Combine concepts (e.g., CloudWatch + FIS + Auto Scaling)
- Practice troubleshooting failures
- Document your learnings

**Tips for Exam Preparation:**
- Understand WHY each service is used, not just HOW
- Know the trade-offs and limitations
- Practice identifying the BEST solution, not just a correct one
- Real hands-on experience makes exam scenarios easier to visualize
