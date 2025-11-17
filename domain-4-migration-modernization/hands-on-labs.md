# Domain 4: Hands-On Labs

## Overview

These hands-on labs provide **practical experience** with AWS migration and modernization services. Complete these labs to reinforce theoretical knowledge with real-world implementations.

**Prerequisites:**
- AWS account (Free Tier eligible)
- Basic AWS Console navigation skills
- AWS CLI installed (for some labs)
- Docker installed locally (for container labs)

**Cost Awareness:**
- Most labs use Free Tier eligible services
- Clean up resources after each lab to avoid charges
- Estimated cost per lab: $0-$5 if completed within 1-2 hours

---

## Lab 1: Database Migration with DMS (Homogeneous)

**Objective:** Migrate MySQL database to Aurora MySQL using DMS with minimal downtime

**Duration:** 60-90 minutes

**Services:** RDS MySQL, Aurora MySQL, DMS

### Setup

**Step 1: Create Source MySQL Database**
```bash
# Create RDS MySQL instance
aws rds create-db-instance \
    --db-instance-identifier source-mysql \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password YourPassword123! \
    --allocated-storage 20 \
    --publicly-accessible \
    --backup-retention-period 1
```

**Step 2: Create Sample Data**
```sql
-- Connect to MySQL and create sample database
CREATE DATABASE sampledb;
USE sampledb;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email) VALUES
('alice', 'alice@example.com'),
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO orders (user_id, amount) VALUES
(1, 99.99),
(1, 149.99),
(2, 49.99);
```

**Step 3: Create Target Aurora MySQL Cluster**
```bash
# Create Aurora MySQL cluster
aws rds create-db-cluster \
    --db-cluster-identifier target-aurora \
    --engine aurora-mysql \
    --master-username admin \
    --master-user-password YourPassword123! \
    --database-name sampledb

# Create Aurora instance
aws rds create-db-instance \
    --db-instance-identifier target-aurora-instance \
    --db-instance-class db.t3.small \
    --engine aurora-mysql \
    --db-cluster-identifier target-aurora
```

### Migration Steps

**Step 4: Create DMS Replication Instance**
1. Navigate to DMS Console
2. Create replication instance:
   - Name: `mysql-to-aurora-replication`
   - Instance class: `dms.t3.micro`
   - VPC: Same as RDS instances
   - Multi-AZ: No (for testing)
   - Publicly accessible: Yes (for testing)

**Step 5: Create Source Endpoint**
1. In DMS, create source endpoint:
   - Endpoint type: Source
   - Endpoint identifier: `source-mysql-endpoint`
   - Source engine: MySQL
   - Server name: [RDS MySQL endpoint]
   - Port: 3306
   - Username: admin
   - Password: YourPassword123!
   - Database name: sampledb
2. Test connection

**Step 6: Create Target Endpoint**
1. Create target endpoint:
   - Endpoint type: Target
   - Endpoint identifier: `target-aurora-endpoint`
   - Target engine: Aurora MySQL
   - Server name: [Aurora endpoint]
   - Port: 3306
   - Username: admin
   - Password: YourPassword123!
   - Database name: sampledb
2. Test connection

**Step 7: Create Migration Task**
1. Create database migration task:
   - Task identifier: `mysql-to-aurora-task`
   - Replication instance: `mysql-to-aurora-replication`
   - Source: `source-mysql-endpoint`
   - Target: `target-aurora-endpoint`
   - Migration type: **Migrate existing data and replicate ongoing changes** (Full Load + CDC)
   - Table mappings: Include all tables (wildcard: %)
   - Start task automatically: Yes

**Step 8: Monitor Migration**
1. Watch task progress in console
2. Verify full load completes
3. Check CDC latency (should be < 5 seconds)

**Step 9: Verify Data**
```sql
-- Connect to Aurora and verify data
SELECT * FROM users;
SELECT * FROM orders;
SELECT COUNT(*) FROM users; -- Should match source
```

**Step 10: Test CDC (Change Data Capture)**
```sql
-- On source MySQL, insert new data
INSERT INTO users (username, email) VALUES ('david', 'david@example.com');

-- Wait 5-10 seconds, then check Aurora
SELECT * FROM users WHERE username = 'david';
-- Should appear in Aurora (CDC replication)
```

### Cutover Simulation

**Step 11: Perform Cutover**
1. Stop application writes to source (simulate)
2. Wait for CDC lag to reach 0 (in DMS task metrics)
3. Verify row counts match:
   ```sql
   -- Source
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM orders;

   -- Target (should match exactly)
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM orders;
   ```
4. Switch application to Aurora endpoint (simulate)

### Cleanup
```bash
# Delete DMS task
aws dms delete-replication-task --replication-task-arn [task-arn]

# Delete replication instance
aws dms delete-replication-instance --replication-instance-arn [instance-arn]

# Delete Aurora
aws rds delete-db-instance --db-instance-identifier target-aurora-instance --skip-final-snapshot
aws rds delete-db-cluster --db-cluster-identifier target-aurora --skip-final-snapshot

# Delete MySQL
aws rds delete-db-instance --db-instance-identifier source-mysql --skip-final-snapshot
```

**Key Learnings:**
- Full Load + CDC provides minimal downtime migration
- CDC lag should be monitored (target: < 5 seconds)
- Verify data consistency before cutover
- Homogeneous migrations (MySQL → Aurora MySQL) are straightforward with DMS

---

## Lab 2: Containerize Application and Deploy to ECS Fargate

**Objective:** Manually containerize a simple Node.js application and deploy to ECS with Fargate

**Duration:** 60 minutes

**Services:** ECS, Fargate, ECR, ALB

### Prepare Application

**Step 1: Create Simple Node.js App**
```bash
# Create project directory
mkdir node-app && cd node-app

# Create package.json
cat > package.json <<EOF
{
  "name": "node-app",
  "version": "1.0.0",
  "description": "Simple Node.js app",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF

# Create server.js
cat > server.js <<EOF
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from ECS Fargate!',
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
EOF
```

**Step 2: Create Dockerfile**
```dockerfile
# Create Dockerfile
cat > Dockerfile <<EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
EOF
```

**Step 3: Test Locally**
```bash
# Build Docker image
docker build -t node-app:latest .

# Run container locally
docker run -p 3000:3000 node-app:latest

# Test in browser: http://localhost:3000
# Should see JSON response

# Stop container
docker stop $(docker ps -q --filter ancestor=node-app:latest)
```

### Push to ECR

**Step 4: Create ECR Repository**
```bash
# Create repository
aws ecr create-repository --repository-name node-app

# Get login command
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  [YOUR-ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com
```

**Step 5: Push Image to ECR**
```bash
# Tag image
docker tag node-app:latest \
  [YOUR-ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/node-app:latest

# Push to ECR
docker push [YOUR-ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/node-app:latest
```

### Deploy to ECS Fargate

**Step 6: Create ECS Cluster**
```bash
# Create cluster
aws ecs create-cluster --cluster-name node-app-cluster
```

**Step 7: Create Task Definition**
```bash
# Create task definition JSON
cat > task-definition.json <<EOF
{
  "family": "node-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "node-app",
      "image": "[YOUR-ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/node-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/node-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

# Create CloudWatch log group first
aws logs create-log-group --log-group-name /ecs/node-app

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

**Step 8: Create Application Load Balancer (Console)**
1. Navigate to EC2 → Load Balancers
2. Create ALB:
   - Name: `node-app-alb`
   - Scheme: Internet-facing
   - Subnets: Select 2+ AZs
3. Create target group:
   - Target type: IP (for Fargate)
   - Protocol: HTTP, Port: 3000
   - Health check path: `/health`
4. Complete ALB creation

**Step 9: Create ECS Service**
```bash
# Create service (replace with your VPC details)
aws ecs create-service \
  --cluster node-app-cluster \
  --service-name node-app-service \
  --task-definition node-app-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=[target-group-arn],containerName=node-app,containerPort=3000"
```

**Step 10: Verify Deployment**
1. Wait for tasks to reach RUNNING state
2. Access ALB DNS name in browser
3. Refresh multiple times (should see different hostname - load balancing)

### Test Auto-Scaling

**Step 11: Update Desired Count**
```bash
# Scale to 4 tasks
aws ecs update-service \
  --cluster node-app-cluster \
  --service node-app-service \
  --desired-count 4

# Watch tasks start
aws ecs list-tasks --cluster node-app-cluster --service-name node-app-service
```

### Cleanup
```bash
# Delete service
aws ecs delete-service --cluster node-app-cluster --service node-app-service --force

# Delete cluster
aws ecs delete-cluster --cluster node-app-cluster

# Delete ALB and target group (via console)

# Delete ECR repository
aws ecr delete-repository --repository-name node-app --force

# Delete log group
aws logs delete-log-group --log-group-name /ecs/node-app
```

**Key Learnings:**
- Containerization decouples application from infrastructure
- Fargate removes server management (no EC2 to manage)
- Task definitions describe how containers run
- Services maintain desired count (self-healing)
- ALB distributes traffic across tasks

---

## Lab 3: Serverless API with Lambda and API Gateway

**Objective:** Build a serverless REST API to demonstrate serverless refactoring

**Duration:** 45 minutes

**Services:** Lambda, API Gateway, DynamoDB

### Create DynamoDB Table

**Step 1: Create Table**
```bash
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### Create Lambda Functions

**Step 2: Create GET User Function**
```python
# get_user.py
import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
    user_id = event['pathParameters']['userId']

    response = table.get_item(Key={'userId': user_id})

    if 'Item' in response:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(response['Item'])
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'User not found'})
        }
```

**Step 3: Create PUT User Function**
```python
# put_user.py
import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
    user_id = event['pathParameters']['userId']
    body = json.loads(event['body'])

    item = {
        'userId': user_id,
        'username': body.get('username'),
        'email': body.get('email'),
        'updatedAt': datetime.utcnow().isoformat()
    }

    table.put_item(Item=item)

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(item)
    }
```

**Step 4: Deploy Lambda Functions (Console)**
1. Navigate to Lambda Console
2. Create function: `get-user`
   - Runtime: Python 3.11
   - Paste `get_user.py` code
   - Add execution role with DynamoDB read permissions
3. Create function: `put-user`
   - Runtime: Python 3.11
   - Paste `put_user.py` code
   - Add execution role with DynamoDB write permissions

### Create API Gateway

**Step 5: Create HTTP API**
1. Navigate to API Gateway Console
2. Create HTTP API (not REST API - simpler, cheaper)
3. Name: `users-api`

**Step 6: Create Routes**
1. Create route: `GET /users/{userId}`
   - Integration: `get-user` Lambda function
2. Create route: `PUT /users/{userId}`
   - Integration: `put-user` Lambda function

**Step 7: Deploy API**
1. Create stage: `prod`
2. Deploy API
3. Note invoke URL: `https://[api-id].execute-api.us-east-1.amazonaws.com/prod`

### Test API

**Step 8: Create User**
```bash
# PUT user
curl -X PUT https://[api-id].execute-api.us-east-1.amazonaws.com/prod/users/user1 \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "email": "alice@example.com"}'
```

**Step 9: Get User**
```bash
# GET user
curl https://[api-id].execute-api.us-east-1.amazonaws.com/prod/users/user1
```

**Step 10: Monitor Metrics**
1. Navigate to Lambda → get-user → Monitoring
2. Observe invocation count, duration, errors
3. Note: No servers to manage, auto-scales to zero

### Cleanup
```bash
# Delete API Gateway (via console)

# Delete Lambda functions
aws lambda delete-function --function-name get-user
aws lambda delete-function --function-name put-user

# Delete DynamoDB table
aws dynamodb delete-table --table-name Users
```

**Key Learnings:**
- Serverless eliminates server management
- Pay only for requests (no idle cost)
- Auto-scales automatically
- HTTP API cheaper and simpler than REST API
- DynamoDB natural fit for serverless (no connections)

---

## Lab 4: Event-Driven Architecture with S3 and Lambda

**Objective:** Process uploaded files automatically with event-driven pattern

**Duration:** 30 minutes

**Services:** S3, Lambda, SNS

### Setup

**Step 1: Create S3 Bucket**
```bash
aws s3 mb s3://my-file-processor-bucket-[random-suffix]
```

**Step 2: Create Lambda Function**
```python
# file_processor.py
import json
import boto3

s3 = s3_client = boto3.client('s3')
sns = boto3.client('sns')

def lambda_handler(event, context):
    # Get S3 event details
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        size = record['s3']['object']['size']

        print(f"Processing file: {key} ({size} bytes)")

        # Simulate processing (get file metadata)
        response = s3.head_object(Bucket=bucket, Key=key)

        # Publish notification (optional - if SNS topic configured)
        message = {
            'file': key,
            'size': size,
            'contentType': response['ContentType'],
            'status': 'processed'
        }

        print(f"Processed: {json.dumps(message)}")

    return {
        'statusCode': 200,
        'body': json.dumps('Processing complete')
    }
```

**Step 3: Create Lambda Function (Console)**
1. Create function: `file-processor`
2. Runtime: Python 3.11
3. Paste code above
4. Add S3 read permissions to execution role

**Step 4: Configure S3 Event Trigger**
1. In Lambda function, add trigger:
   - Source: S3
   - Bucket: `my-file-processor-bucket-[suffix]`
   - Event type: `PUT` (object created)
   - Prefix: (leave empty for all files)
   - Suffix: `.txt` (only process .txt files)

### Test Event-Driven Processing

**Step 5: Upload File**
```bash
# Create test file
echo "Hello, this is a test file!" > test.txt

# Upload to S3
aws s3 cp test.txt s3://my-file-processor-bucket-[suffix]/test.txt
```

**Step 6: Verify Processing**
1. Navigate to Lambda → file-processor → Monitor → Logs
2. Click "View in CloudWatch"
3. See log showing file processing

**Step 7: Test Auto-Parallelization**
```bash
# Upload multiple files at once
for i in {1..10}; do
  echo "File $i" > file$i.txt
  aws s3 cp file$i.txt s3://my-file-processor-bucket-[suffix]/file$i.txt
done
```

**Step 8: Observe Concurrent Invocations**
1. Check Lambda metrics
2. Note: Multiple invocations in parallel (one per file)
3. No manual scaling needed

### Cleanup
```bash
# Empty and delete S3 bucket
aws s3 rm s3://my-file-processor-bucket-[suffix] --recursive
aws s3 rb s3://my-file-processor-bucket-[suffix]

# Delete Lambda function
aws lambda delete-function --function-name file-processor
```

**Key Learnings:**
- S3 events trigger Lambda automatically
- No polling required (event-driven)
- Automatic parallelization (10 files = 10 concurrent Lambdas)
- Real-time processing (immediate, not batch)

---

## Lab 5: CI/CD for Containers with CodePipeline

**Objective:** Automate container deployment using CI/CD pipeline

**Duration:** 90 minutes

**Services:** CodeCommit, CodeBuild, CodePipeline, ECS

**Note:** This builds on Lab 2 (ensure ECS cluster and service exist)

### Setup Source Control

**Step 1: Create CodeCommit Repository**
```bash
# Create repository
aws codecommit create-repository \
  --repository-name node-app \
  --repository-description "Node.js application"

# Clone repository
git clone https://git-codecommit.us-east-1.amazonaws.com/v1/repos/node-app
cd node-app

# Copy application code from Lab 2
cp ../node-app/* .

# Commit and push
git add .
git commit -m "Initial commit"
git push origin main
```

### Create Build Spec

**Step 2: Create buildspec.yml**
```yaml
cat > buildspec.yml <<EOF
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region \$AWS_DEFAULT_REGION | docker login --username AWS --password-stdin \$AWS_ACCOUNT_ID.dkr.ecr.\$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=\$AWS_ACCOUNT_ID.dkr.ecr.\$AWS_DEFAULT_REGION.amazonaws.com/node-app
      - COMMIT_HASH=\$(echo \$CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=\${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on \`date\`
      - echo Building the Docker image...
      - docker build -t \$REPOSITORY_URI:latest .
      - docker tag \$REPOSITORY_URI:latest \$REPOSITORY_URI:\$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on \`date\`
      - echo Pushing the Docker images...
      - docker push \$REPOSITORY_URI:latest
      - docker push \$REPOSITORY_URI:\$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"node-app","imageUri":"%s"}]' \$REPOSITORY_URI:latest > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
EOF

git add buildspec.yml
git commit -m "Add build spec"
git push
```

### Create CodeBuild Project

**Step 3: Create Build Project (Console)**
1. Navigate to CodeBuild → Create project
2. Project name: `node-app-build`
3. Source: AWS CodeCommit
4. Repository: `node-app`
5. Branch: `main`
6. Environment:
   - Managed image
   - OS: Ubuntu
   - Runtime: Standard
   - Image: Latest
   - Privileged mode: ✅ (for Docker)
7. Buildspec: Use buildspec file
8. Create project

### Create Pipeline

**Step 4: Create CodePipeline**
1. Navigate to CodePipeline → Create pipeline
2. Pipeline name: `node-app-pipeline`
3. Source stage:
   - Source provider: AWS CodeCommit
   - Repository: `node-app`
   - Branch: `main`
   - Detection: CloudWatch Events
4. Build stage:
   - Build provider: AWS CodeBuild
   - Project: `node-app-build`
5. Deploy stage:
   - Deploy provider: Amazon ECS
   - Cluster: `node-app-cluster`
   - Service: `node-app-service`
6. Create pipeline

### Test CI/CD

**Step 5: Make Code Change**
```javascript
// Edit server.js
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from ECS Fargate - V2!', // Changed
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  });
});

// Commit and push
git add server.js
git commit -m "Update welcome message"
git push
```

**Step 6: Watch Pipeline Execute**
1. Navigate to CodePipeline
2. Observe stages: Source → Build → Deploy
3. Wait for pipeline to complete
4. Access ALB - should see "V2" message

**Key Learnings:**
- Automated deployments on git push
- Build → Test → Deploy flow
- ECS rolling deployments (zero downtime)
- Infrastructure as code with buildspec

---

## Additional Lab Ideas (Self-Study)

### Lab 6: DataSync File Migration
- Create NFS share (EC2 or local)
- Deploy DataSync agent
- Sync files to S3 or EFS
- Schedule recurring sync

### Lab 7: EventBridge for Event Routing
- Create custom event bus
- Define rules for event routing
- Target multiple services (Lambda, SQS, SNS)
- Test event-driven workflows

### Lab 8: Aurora Serverless v2
- Create Aurora Serverless v2 cluster
- Connect from Lambda function
- Observe auto-scaling under load
- Compare to provisioned Aurora

### Lab 9: Step Functions Workflow
- Create multi-step workflow
- Orchestrate Lambda functions
- Implement error handling and retries
- Visualize execution in console

### Lab 10: Pre-Built AI (Rekognition)
- Upload images to S3
- Trigger Lambda on upload
- Call Rekognition to detect labels
- Store results in DynamoDB

---

## Lab Best Practices

### Cost Management
1. **Use Free Tier:** Most labs fit in Free Tier
2. **Clean Up:** Always delete resources after labs
3. **Set Budget Alerts:** AWS Budgets for $5-10/month
4. **Use Smallest Instances:** t3.micro, db.t3.micro
5. **Limit Duration:** Complete labs in 1-2 hours

### Learning Approach
1. **Understand First:** Read task guides before labs
2. **Hands-On:** Type commands, don't just copy-paste
3. **Experiment:** Break things intentionally, then fix
4. **Document:** Take notes on what you learn
5. **Troubleshoot:** When errors occur, investigate (learning opportunity)

### Safety
1. **Separate Account:** Use dedicated AWS account for learning
2. **No Production Data:** Never use real customer data
3. **Secure Credentials:** Don't commit passwords to git
4. **Public Access:** Avoid making resources publicly accessible (use security groups)
5. **Monitor Costs:** Check billing dashboard regularly

---

## Troubleshooting Common Issues

### DMS Replication Lag
- **Issue:** CDC lag > 30 seconds
- **Solution:** Increase replication instance size, check network bandwidth

### Lambda Cold Starts
- **Issue:** First invocation slow (1-5 seconds)
- **Solution:** Expected for cold starts; use Provisioned Concurrency if critical

### ECS Task Won't Start
- **Issue:** Task stuck in PENDING
- **Solution:** Check CloudWatch logs, verify security groups, ensure subnets have IGW or NAT

### Docker Build Fails
- **Issue:** Build errors or image won't run
- **Solution:** Test locally first with `docker build` and `docker run`, check Dockerfile syntax

### API Gateway 403 Error
- **Issue:** API returns 403 Forbidden
- **Solution:** Check Lambda permissions, verify API Gateway resource policy, test Lambda directly

---

*Last Updated: 2025-11-17*
*Complete these labs to gain practical experience with AWS migration and modernization*
