# Task 2.1: Design a Deployment Strategy to Meet Business Requirements

## Overview

Deployment strategies are critical for releasing applications while minimizing risk, downtime, and impact to users. This task focuses on selecting and implementing the right deployment pattern based on business requirements such as risk tolerance, downtime constraints, cost, and rollback capabilities.

**Exam Weight:** ~17% of Domain 2 (approximately 5% of total exam)

**Key Focus Areas:**
- Blue/Green deployments across different compute types
- Canary and linear deployment patterns
- Rolling deployments and configuration
- Immutable infrastructure patterns
- Infrastructure as Code (IaC) strategies
- CI/CD pipeline design and implementation

---

## Core Deployment Strategies

### 1. All-at-Once Deployment

**Description:** Deploy new version to all instances simultaneously.

**Characteristics:**
- Fastest deployment method
- All instances updated at the same time
- Brief outage during deployment
- Simple rollback (redeploy previous version)

**When to Use:**
- Development and test environments
- Applications that can tolerate brief downtime
- Small-scale applications
- Non-critical workloads
- Quick fixes or patches

**AWS Services:**
- Elastic Beanstalk (All at once policy)
- CodeDeploy (AllAtOnce configuration)
- CloudFormation stack updates

**Advantages:**
- ✅ Simple and fast
- ✅ No additional infrastructure cost
- ✅ Easy to understand and implement
- ✅ Quick deployment time

**Disadvantages:**
- ❌ Service interruption during deployment
- ❌ All users affected if issues occur
- ❌ Higher risk
- ❌ Rollback requires full redeployment

**Configuration Example (CodeDeploy):**
```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:region:account:task-definition/my-task:2"
        LoadBalancerInfo:
          ContainerName: "my-container"
          ContainerPort: 80
        DeploymentConfiguration:
          DeploymentConfigName: CodeDeployDefault.ECSAllAtOnce
```

**Best Practices:**
- Schedule deployments during maintenance windows
- Have rollback plan ready
- Test thoroughly in staging environment
- Monitor closely during deployment
- Use for non-production environments primarily

---

### 2. Rolling Deployment

**Description:** Deploy new version to instances in batches, maintaining application availability.

**Characteristics:**
- Gradual rollout in phases
- Some instances serve old version while others serve new
- No downtime (if configured correctly)
- Maintains minimum healthy hosts
- Can specify batch size (percentage or count)

**When to Use:**
- Production applications requiring high availability
- Cost-conscious deployments (no additional infrastructure)
- Applications that can run mixed versions temporarily
- Standard production deployments

**AWS Services:**
- Elastic Beanstalk (Rolling deployment policy)
- Auto Scaling Group updates
- ECS rolling update
- CodeDeploy

**Configuration Options:**
- **Batch Size:** Number or percentage of instances per batch
- **Batch Interval:** Time between batches
- **Health Check Grace Period:** Time before health checks start
- **Minimum Healthy Percentage:** Minimum capacity during deployment

**Advantages:**
- ✅ No downtime
- ✅ No additional infrastructure cost
- ✅ Reduced risk (gradual rollout)
- ✅ Can pause and resume
- ✅ Cost-effective

**Disadvantages:**
- ❌ Longer deployment time
- ❌ Mixed versions running simultaneously
- ❌ Rollback slower (must roll back in batches)
- ❌ Potential compatibility issues between versions
- ❌ Reduced capacity during deployment

**Configuration Example (Elastic Beanstalk):**
```yaml
option_settings:
  - namespace: aws:elasticbeanstalk:command
    option_name: DeploymentPolicy
    value: Rolling
  - namespace: aws:elasticbeanstalk:command
    option_name: BatchSizeType
    value: Percentage
  - namespace: aws:elasticbeanstalk:command
    option_name: BatchSize
    value: 30
  - namespace: aws:autoscaling:updatepolicy:rollingupdate
    option_name: RollingUpdateEnabled
    value: true
  - namespace: aws:autoscaling:updatepolicy:rollingupdate
    option_name: MinInstancesInService
    value: 2
```

**Rolling Deployment Phases:**
1. **Phase 1:** Deploy to first batch (e.g., 25% of instances)
2. **Health Check:** Verify batch is healthy
3. **Phase 2:** Deploy to next batch
4. **Repeat:** Continue until all instances updated
5. **Completion:** All instances running new version

**Best Practices:**
- Set batch size to 25-33% for balance of speed and safety
- Use health checks with appropriate grace periods
- Ensure application supports running mixed versions
- Monitor metrics during each batch
- Have automated rollback triggers
- Test with similar batch sizes in staging

---

### 3. Rolling with Additional Batch

**Description:** Like rolling, but adds extra batch of instances first to maintain full capacity.

**Characteristics:**
- Launches additional instances before deployment
- Maintains full capacity throughout deployment
- No performance degradation during deployment
- Extra cost during deployment window

**When to Use:**
- Production applications where performance cannot degrade
- High-traffic periods
- Applications with tight SLAs
- When you can't afford reduced capacity

**AWS Services:**
- Elastic Beanstalk (Rolling with additional batch)
- Custom Auto Scaling configurations

**Advantages:**
- ✅ Full capacity maintained
- ✅ No performance impact
- ✅ Zero downtime
- ✅ Safer than standard rolling

**Disadvantages:**
- ❌ Higher cost during deployment (additional instances)
- ❌ Longer deployment time
- ❌ More complex

**Configuration Example:**
```yaml
option_settings:
  - namespace: aws:elasticbeanstalk:command
    option_name: DeploymentPolicy
    value: RollingWithAdditionalBatch
  - namespace: aws:elasticbeanstalk:command
    option_name: BatchSizeType
    value: Fixed
  - namespace: aws:elasticbeanstalk:command
    option_name: BatchSize
    value: 2
```

---

### 4. Blue/Green Deployment

**Description:** Maintain two identical environments (Blue=current, Green=new), switch traffic atomically.

**Characteristics:**
- Two complete environments running simultaneously
- Instant traffic switch
- Instant rollback capability
- Zero downtime
- Highest infrastructure cost during deployment

**When to Use:**
- Zero downtime requirements
- Need instant rollback capability
- Critical production applications
- Major version upgrades
- Database schema changes with backward compatibility

**AWS Implementation Methods:**

#### Method 1: Route 53 Weighted Routing
```
Blue Environment (100% traffic)
  ↓
Route 53 → ALB Blue → ASG Blue
Route 53 → ALB Green → ASG Green (0% traffic initially)
  ↓
Switch: Gradually shift traffic from Blue to Green
```

#### Method 2: Elastic Beanstalk Swap URLs
- Two separate Elastic Beanstalk environments
- Swap CNAMEs when ready
- Instant switch

#### Method 3: ALB with Target Groups
- Single ALB with two target groups
- Modify listener rules to switch traffic
- CodeDeploy ECS Blue/Green

#### Method 4: CloudFront with Multiple Origins
- CloudFront distribution with two origins
- Update origin to switch traffic

**Advantages:**
- ✅ Zero downtime
- ✅ Instant rollback (just switch back)
- ✅ Full testing in production environment before switch
- ✅ No version mixing
- ✅ Easy to validate new version

**Disadvantages:**
- ❌ Expensive (2x infrastructure during deployment)
- ❌ Database synchronization challenges
- ❌ More complex setup
- ❌ Stateful applications require careful handling

**CodeDeploy ECS Blue/Green Configuration:**
```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:region:account:task-definition/my-task:3"
        LoadBalancerInfo:
          ContainerName: "my-container"
          ContainerPort: 80
        DeploymentConfiguration:
          DeploymentConfigName: CodeDeployDefault.ECSLinear10PercentEvery1Minutes

Hooks:
  - BeforeInstall: "LambdaFunctionToValidateBeforeInstall"
  - AfterInstall: "LambdaFunctionToValidateAfterInstall"
  - AfterAllowTestTraffic: "LambdaFunctionToValidateTestTraffic"
  - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeTraffic"
  - AfterAllowTraffic: "LambdaFunctionToValidateAfterTraffic"
```

**Blue/Green Lifecycle Hooks:**
1. **BeforeInstall:** Validation before new environment created
2. **AfterInstall:** Validation after new environment ready
3. **AfterAllowTestTraffic:** Test new environment with test traffic
4. **BeforeAllowTraffic:** Final validation before production traffic
5. **AfterAllowTraffic:** Monitor after traffic switch

**Database Considerations for Blue/Green:**
- Use backward-compatible schema changes
- Deploy schema changes separately from application
- Use database replication (e.g., RDS Read Replica promoted to primary)
- Consider Aurora Global Database for multi-region
- Use feature flags to handle data structure changes

**Best Practices:**
- Warm up new environment before traffic switch
- Run smoke tests on Green environment
- Use weighted routing for gradual traffic shift (minimize risk)
- Monitor error rates and latency during switch
- Keep Blue environment running for quick rollback window (e.g., 1 hour)
- Automate the entire process
- Test rollback procedure regularly

---

### 5. Canary Deployment

**Description:** Deploy new version to small subset of users first, gradually increase if healthy.

**Characteristics:**
- Initial deployment to small percentage (e.g., 5-10%)
- Monitor metrics before proceeding
- Gradual traffic increase
- Early detection of issues with minimal impact
- Can be automated with metrics-based progression

**When to Use:**
- Risk-averse deployments
- User-facing applications
- After major changes
- A/B testing scenarios
- Performance validation under real load

**Traffic Shift Patterns:**

**Pattern 1: Linear Canary**
- 10% → 25% → 50% → 100%
- Equal increments
- Predictable timeline

**Pattern 2: Exponential Canary**
- 1% → 5% → 25% → 50% → 100%
- Starts very small
- Accelerates if healthy

**Pattern 3: Custom Canary**
- Define specific percentages and intervals
- Based on your risk tolerance

**AWS Implementation:**

#### Method 1: ALB Weighted Target Groups
```bash
# Initial: 95% blue, 5% green
aws elbv2 modify-rule --rule-arn <rule-arn> \
  --actions Type=forward,ForwardConfig='{
    "TargetGroups": [
      {"TargetGroupArn": "blue-tg-arn", "Weight": 95},
      {"TargetGroupArn": "green-tg-arn", "Weight": 5}
    ]
  }'

# After validation: 50% blue, 50% green
# After validation: 0% blue, 100% green
```

#### Method 2: API Gateway Canary Releases
```yaml
CanarySettings:
  PercentTraffic: 10.0
  UseStageCache: false
  Variables:
    version: canary
```

#### Method 3: Lambda Versions and Aliases
```bash
# Create alias with weighted routing
aws lambda create-alias \
  --function-name my-function \
  --name production \
  --routing-config AdditionalVersionWeights={"2"=0.05}
```

#### Method 4: CodeDeploy with Canary Configuration
```yaml
DeploymentConfiguration:
  DeploymentConfigName: CodeDeployDefault.ECSCanary10Percent5Minutes
```

**CodeDeploy Canary Configurations:**
- **Canary10Percent5Minutes:** 10% traffic for 5 min, then 100%
- **Canary10Percent10Minutes:** 10% traffic for 10 min, then 100%
- **Canary10Percent15Minutes:** 10% traffic for 15 min, then 100%
- **Canary10Percent30Minutes:** 10% traffic for 30 min, then 100%

**Advantages:**
- ✅ Lowest risk (limited blast radius)
- ✅ Real-world validation with minimal impact
- ✅ Early detection of issues
- ✅ Easy rollback (just route traffic back)
- ✅ A/B testing capabilities
- ✅ Gradual user adaptation

**Disadvantages:**
- ❌ Longest deployment time
- ❌ More complex monitoring required
- ❌ Requires sophisticated traffic routing
- ❌ Version mixing for extended period
- ❌ Requires clear success metrics

**Monitoring for Canary:**
Key metrics to track:
- **Error Rate:** 4xx, 5xx errors
- **Latency:** p50, p95, p99
- **Throughput:** Requests per second
- **Business Metrics:** Conversion rate, user actions
- **Custom Metrics:** Application-specific KPIs

**Automated Rollback Triggers:**
```yaml
Alarms:
  - AlarmName: Canary-HighErrorRate
    MetricName: 5XXError
    Threshold: 5
    Period: 60
    EvaluationPeriods: 2
    Action: Rollback

  - AlarmName: Canary-HighLatency
    MetricName: TargetResponseTime
    Threshold: 1000
    Period: 60
    EvaluationPeriods: 2
    Action: Rollback
```

**Best Practices:**
- Start with very small percentage (1-5%)
- Define clear success criteria before deployment
- Monitor closely during initial phase
- Use CloudWatch alarms for automated rollback
- Collect feedback from canary users
- Have metrics baseline from previous version
- Consider time of day for initial canary (low traffic hours)
- Use feature flags in addition to canary deployment

---

### 6. Linear Deployment

**Description:** Traffic shifts in equal increments at regular intervals.

**Characteristics:**
- Predictable, steady traffic increase
- Even intervals between shifts
- Automated progression based on time
- Similar to canary but with predefined progression

**When to Use:**
- Predictable deployment timelines needed
- Want steady, controlled rollout
- Less monitoring-intensive than canary
- Moderate risk tolerance

**CodeDeploy Linear Configurations:**
- **Linear10PercentEvery1Minutes:** 10% every 1 minute (10 minutes total)
- **Linear10PercentEvery2Minutes:** 10% every 2 minutes (20 minutes total)
- **Linear10PercentEvery3Minutes:** 10% every 3 minutes (30 minutes total)
- **Linear10PercentEvery10Minutes:** 10% every 10 minutes (100 minutes total)

**Configuration Example:**
```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "task-definition-arn"
        LoadBalancerInfo:
          ContainerName: "container"
          ContainerPort: 80
        DeploymentConfiguration:
          DeploymentConfigName: CodeDeployDefault.ECSLinear10PercentEvery1Minutes
```

**Traffic Shift Timeline Example:**
```
Time 0: 0% new version, 100% old version
Time 1: 10% new version, 90% old version
Time 2: 20% new version, 80% old version
Time 3: 30% new version, 70% old version
...
Time 10: 100% new version, 0% old version
```

**Advantages:**
- ✅ Predictable timeline
- ✅ Gradual risk reduction
- ✅ Automated progression
- ✅ Good balance of speed and safety
- ✅ Can automate rollback based on metrics

**Disadvantages:**
- ❌ Less flexible than pure canary
- ❌ May proceed even if metrics concerning (without alarms)
- ❌ Longer than all-at-once or rolling

**Best Practices:**
- Use with CloudWatch alarms for automatic rollback
- Choose interval based on traffic patterns
- Monitor continuously during deployment
- Consider business hours vs off-hours

---

### 7. Immutable Deployment

**Description:** Deploy to fresh instances, terminate old instances only when new are healthy.

**Characteristics:**
- Creates entirely new set of instances
- Old instances remain until new instances healthy
- Clean slate for each deployment
- No in-place updates

**When to Use:**
- Configuration management issues with in-place updates
- Want guaranteed clean state
- Compliance requirements for immutable infrastructure
- After configuration drift issues

**AWS Services:**
- Elastic Beanstalk (Immutable deployment policy)
- Auto Scaling with instance refresh
- ECS with new task definitions

**Process Flow:**
1. Create new Auto Scaling group with new launch template
2. Launch new instances
3. Wait for health checks to pass
4. Register new instances with load balancer
5. Deregister old instances
6. Terminate old Auto Scaling group

**Advantages:**
- ✅ Clean, predictable state
- ✅ No configuration drift
- ✅ Quick rollback (keep old instances longer)
- ✅ Minimal impact to existing instances
- ✅ Good for compliance

**Disadvantages:**
- ❌ Expensive (temporary double capacity)
- ❌ Longer deployment time (instance launch + warmup)
- ❌ More complex to set up

**Configuration Example (Elastic Beanstalk):**
```yaml
option_settings:
  - namespace: aws:elasticbeanstalk:command
    option_name: DeploymentPolicy
    value: Immutable
  - namespace: aws:elasticbeanstalk:command
    option_name: Timeout
    value: 600
```

**Best Practices:**
- Use AMIs with application pre-baked for faster launch
- Set appropriate health check grace periods
- Use CloudFormation for infrastructure as code
- Consider using spot instances for cost savings during deployment
- Keep old instances briefly for quick rollback

---

## Deployment Strategies by AWS Service

### EC2 / Auto Scaling Group Deployments

**Options:**
1. **Instance Refresh:** Rolling replacement of instances
2. **CodeDeploy:** Supports in-place and blue/green
3. **Custom with ASG:** Modify ASG configuration

**Instance Refresh Configuration:**
```json
{
  "Strategy": "Rolling",
  "Preferences": {
    "MinHealthyPercentage": 90,
    "InstanceWarmup": 300,
    "CheckpointPercentages": [50, 100],
    "CheckpointDelay": 3600
  }
}
```

**CodeDeploy for EC2:**
```yaml
# appspec.yml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/www/html
hooks:
  BeforeInstall:
    - location: scripts/install_dependencies.sh
      timeout: 300
      runas: root
  ApplicationStart:
    - location: scripts/start_server.sh
      timeout: 300
      runas: root
  ValidateService:
    - location: scripts/validate.sh
      timeout: 300
```

---

### Lambda Deployments

**Deployment Types:**
1. **All-at-Once:** Update alias immediately
2. **Canary:** Shift small percentage first
3. **Linear:** Gradual shift in increments

**Lambda Alias with Traffic Shifting:**
```bash
# Publish new version
NEW_VERSION=$(aws lambda publish-version \
  --function-name my-function \
  --query Version --output text)

# Update alias with canary
aws lambda update-alias \
  --function-name my-function \
  --name production \
  --routing-config AdditionalVersionWeights={"$NEW_VERSION"=0.10}

# After validation, shift all traffic
aws lambda update-alias \
  --function-name my-function \
  --name production \
  --function-version $NEW_VERSION
```

**SAM Deployment Configuration:**
```yaml
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      DeploymentPreference:
        Type: Canary10Percent5Minutes
        Alarms:
          - !Ref ErrorsAlarm
        Hooks:
          PreTraffic: !Ref PreTrafficHook
          PostTraffic: !Ref PostTrafficHook
```

**Lambda Deployment Preferences:**
- **Canary10Percent5Minutes**
- **Canary10Percent10Minutes**
- **Canary10Percent15Minutes**
- **Canary10Percent30Minutes**
- **Linear10PercentEvery1Minute**
- **Linear10PercentEvery2Minutes**
- **Linear10PercentEvery3Minutes**
- **Linear10PercentEvery10Minutes**
- **AllAtOnce**

---

### ECS Deployments

**Deployment Types:**
1. **Rolling Update:** Default, replaces tasks gradually
2. **Blue/Green with CodeDeploy:** Two task sets, traffic shift
3. **External:** Custom deployment controller

**ECS Rolling Update:**
```json
{
  "deploymentConfiguration": {
    "maximumPercent": 200,
    "minimumHealthyPercent": 100,
    "deploymentCircuitBreaker": {
      "enable": true,
      "rollback": true
    }
  }
}
```

**Parameters:**
- **maximumPercent:** Maximum tasks during deployment (200 = double capacity)
- **minimumHealthyPercent:** Minimum healthy tasks (100 = no reduction)
- **deploymentCircuitBreaker:** Auto-rollback on deployment failures

**ECS Blue/Green with CodeDeploy:**
1. CodeDeploy creates new task set (Green)
2. Test traffic sent to Green
3. Production traffic shifted based on configuration
4. Old task set (Blue) terminated after successful deployment

**Configuration:**
```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "new-task-definition"
        LoadBalancerInfo:
          ContainerName: "my-app"
          ContainerPort: 80
        DeploymentConfiguration:
          DeploymentConfigName: CodeDeployDefault.ECSCanary10Percent5Minutes
        PlatformVersion: "LATEST"

Hooks:
  - AfterAllowTestTraffic: "arn:aws:lambda:region:account:function:test"
  - BeforeAllowTraffic: "arn:aws:lambda:region:account:function:pre-prod"
  - AfterAllowTraffic: "arn:aws:lambda:region:account:function:post-prod"
```

---

### Elastic Beanstalk Deployments

**Deployment Policies:**
1. **All at once:** Fastest, brief downtime
2. **Rolling:** Batches, no downtime, reduced capacity
3. **Rolling with additional batch:** Batches, no downtime, full capacity
4. **Immutable:** New instances, safest, expensive
5. **Blue/Green:** Swap environment URLs, instant switch

**Comparison:**
| Policy | Downtime | DNS Change | Rollback | Deploy Time | Cost |
|--------|----------|------------|----------|-------------|------|
| All at once | Yes | No | Redeploy | Fast | $ |
| Rolling | No | No | Redeploy | Medium | $ |
| Rolling + batch | No | No | Redeploy | Medium | $$ |
| Immutable | No | No | Terminate new | Slow | $$$ |
| Blue/Green | No | Yes | Swap URL | Slow | $$$$ |

---

## Infrastructure as Code (IaC) Strategies

### CloudFormation

**Deployment Options:**
1. **Direct Stack Update:** Update existing stack
2. **Change Sets:** Preview changes before applying
3. **Stack Sets:** Deploy across multiple accounts/regions
4. **Drift Detection:** Identify manual changes

**Update Behaviors:**
- **Update with No Interruption:** Resource updated in place
- **Update with Some Interruption:** Brief disruption
- **Replacement:** Resource recreated (potential data loss)

**Change Set Usage:**
```bash
# Create change set
aws cloudformation create-change-set \
  --stack-name my-stack \
  --change-set-name my-changes \
  --template-body file://template.yaml

# Review changes
aws cloudformation describe-change-set \
  --change-set-name my-changes \
  --stack-name my-stack

# Execute if acceptable
aws cloudformation execute-change-set \
  --change-set-name my-changes \
  --stack-name my-stack
```

**Stack Policy (Prevent Destructive Updates):**
```json
{
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "Update:Replace",
      "Resource": "LogicalResourceId/ProductionDatabase"
    }
  ]
}
```

---

### AWS CDK

**Deployment Commands:**
```bash
# Synthesize CloudFormation template
cdk synth

# Review changes
cdk diff

# Deploy with approval
cdk deploy --require-approval=any-change

# Deploy with no prompts (CI/CD)
cdk deploy --require-approval=never
```

**Hot Swappable Updates:**
```bash
# Fast Lambda code updates without CloudFormation
cdk deploy --hotswap
```

---

## CI/CD Pipeline Architecture

### Complete Pipeline Example

```
┌─────────────────────────────────────────────────────────┐
│                   Source Stage                          │
│  CodeCommit / GitHub / Bitbucket / S3                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│                   Build Stage                           │
│  CodeBuild: Compile, Test, Package, Container Build    │
│  - Unit Tests                                           │
│  - Code Quality Checks (SonarQube)                      │
│  - Security Scanning (SAST)                             │
│  - Build Artifacts                                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│                   Test Stage                            │
│  Deploy to Test Environment                             │
│  - Integration Tests                                    │
│  - API Tests                                            │
│  - Performance Tests                                    │
│  Manual Approval (Optional)                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│                   Staging Stage                         │
│  Deploy to Staging with Production-like Config          │
│  - Smoke Tests                                          │
│  - Load Tests                                           │
│  - UAT                                                  │
│  Manual Approval                                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│                   Production Stage                      │
│  CodeDeploy with Canary/Linear Deployment               │
│  - Pre-deployment hooks                                 │
│  - Traffic shifting                                     │
│  - Post-deployment validation                           │
│  - CloudWatch Alarms for auto-rollback                  │
└─────────────────────────────────────────────────────────┘
```

### CodePipeline Configuration

```yaml
Resources:
  Pipeline:
    Type: AWS::CodePipeline::Pipeline
    Properties:
      Name: MyApplicationPipeline
      RoleArn: !GetAtt PipelineRole.Arn
      Stages:
        - Name: Source
          Actions:
            - Name: SourceAction
              ActionTypeId:
                Category: Source
                Owner: AWS
                Provider: CodeCommit
                Version: 1
              Configuration:
                RepositoryName: my-repo
                BranchName: main
              OutputArtifacts:
                - Name: SourceOutput

        - Name: Build
          Actions:
            - Name: BuildAction
              ActionTypeId:
                Category: Build
                Owner: AWS
                Provider: CodeBuild
                Version: 1
              Configuration:
                ProjectName: !Ref BuildProject
              InputArtifacts:
                - Name: SourceOutput
              OutputArtifacts:
                - Name: BuildOutput

        - Name: Deploy-Test
          Actions:
            - Name: DeployToTest
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Provider: CodeDeploy
                Version: 1
              Configuration:
                ApplicationName: !Ref Application
                DeploymentGroupName: !Ref TestDeploymentGroup
              InputArtifacts:
                - Name: BuildOutput

        - Name: Approval
          Actions:
            - Name: ManualApproval
              ActionTypeId:
                Category: Approval
                Owner: AWS
                Provider: Manual
                Version: 1
              Configuration:
                CustomData: "Please review and approve deployment to production"

        - Name: Deploy-Production
          Actions:
            - Name: DeployToProduction
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Provider: CodeDeploy
                Version: 1
              Configuration:
                ApplicationName: !Ref Application
                DeploymentGroupName: !Ref ProdDeploymentGroup
              InputArtifacts:
                - Name: BuildOutput
```

---

## Deployment Best Practices

### Pre-Deployment

1. **Version Control Everything**
   - Application code
   - Infrastructure code
   - Configuration files
   - Database migration scripts

2. **Automated Testing**
   - Unit tests (>80% coverage)
   - Integration tests
   - End-to-end tests
   - Performance tests
   - Security tests (SAST/DAST)

3. **Build Artifacts**
   - Immutable build artifacts
   - Semantic versioning
   - Artifact signing
   - Store in S3 or ECR

4. **Environment Parity**
   - Dev, Test, Staging, Production similarity
   - Same instance types (or proportional)
   - Same configurations
   - Same data patterns (masked in non-prod)

### During Deployment

1. **Health Checks**
   - Application health endpoints
   - Deep health checks (database connectivity, dependencies)
   - Appropriate grace periods
   - Multiple check types (EC2, ELB, custom)

2. **Monitoring**
   - Real-time metrics
   - Log aggregation
   - Distributed tracing
   - Business metrics
   - Comparison with baseline

3. **Automated Validation**
   - Smoke tests
   - Critical path validation
   - API endpoint checks
   - Database connectivity

4. **Progressive Rollout**
   - Start with small percentage
   - Monitor metrics at each stage
   - Automated or manual progression

### Post-Deployment

1. **Validation**
   - Verify all services healthy
   - Check critical business flows
   - Review error rates
   - Confirm metrics normal

2. **Rollback Plan**
   - Document rollback procedure
   - Keep previous version available
   - Test rollback regularly
   - Automate rollback triggers

3. **Documentation**
   - Deployment notes
   - Issues encountered
   - Rollback if occurred
   - Lessons learned

4. **Cleanup**
   - Remove old resources (after safety period)
   - Clean up temporary resources
   - Archive artifacts
   - Update documentation

---

## Exam Tips and Tricky Scenarios

### Common Exam Questions

**Scenario 1: Zero Downtime with Instant Rollback**
- **Requirement:** Zero downtime, instant rollback
- **Answer:** Blue/Green deployment
- **Why:** Only Blue/Green provides instant rollback by redirecting traffic

**Scenario 2: Cost-Effective High Availability**
- **Requirement:** High availability, minimize cost
- **Answer:** Rolling deployment
- **Why:** No additional infrastructure, gradual rollout maintains availability

**Scenario 3: Major Database Schema Change**
- **Requirement:** Deploy application with database changes
- **Answer:** Blue/Green with backward-compatible schema
- **Why:** Deploy schema first (compatible with both versions), then application

**Scenario 4: Risk-Averse Deployment**
- **Requirement:** Minimize risk, early detection of issues
- **Answer:** Canary deployment with CloudWatch alarms
- **Why:** Smallest blast radius, automated rollback on issues

**Scenario 5: Predictable Deployment Timeline**
- **Requirement:** Need to know exact deployment duration
- **Answer:** Linear deployment
- **Why:** Fixed intervals provide predictable timeline

**Scenario 6: Configuration Drift Issues**
- **Requirement:** Eliminate configuration drift
- **Answer:** Immutable deployment
- **Why:** Fresh instances every time, no in-place updates

**Scenario 7: Lambda with Gradual Traffic Shift**
- **Requirement:** Deploy Lambda with 10% traffic shift
- **Answer:** Lambda alias with weighted routing or SAM canary deployment
- **Why:** Lambda aliases support traffic shifting

**Scenario 8: ECS with Blue/Green**
- **Requirement:** ECS service with blue/green deployment
- **Answer:** CodeDeploy with ECS Blue/Green
- **Why:** CodeDeploy provides native ECS blue/green support

**Scenario 9: Multi-Region Deployment**
- **Requirement:** Deploy to multiple regions simultaneously
- **Answer:** CodePipeline with parallel deployment actions
- **Why:** Pipeline supports parallel stages

**Scenario 10: Deployment with Manual Approval**
- **Requirement:** Require approval before production
- **Answer:** CodePipeline with manual approval action
- **Why:** Built-in approval gates in pipeline

### Key Differentiators

**Blue/Green vs Canary:**
- Blue/Green: Two full environments, instant switch
- Canary: Single environment, gradual traffic shift
- Choose Blue/Green for instant rollback, Canary for lowest risk

**Rolling vs Immutable:**
- Rolling: Update instances in-place
- Immutable: New instances replace old
- Choose Immutable to eliminate configuration drift

**Canary vs Linear:**
- Canary: Metrics-based progression (can pause)
- Linear: Time-based progression (automatic)
- Choose Canary for more control, Linear for predictability

**All-at-Once vs Rolling:**
- All-at-Once: Fast, brief downtime
- Rolling: Slower, no downtime
- Choose All-at-Once for dev/test, Rolling for production

---

## Hands-On Practice

### Lab 1: Blue/Green with Route 53
1. Create two identical Auto Scaling Groups
2. Deploy different versions to each
3. Create Route 53 weighted routing
4. Shift traffic from 100/0 to 0/100
5. Practice rollback

### Lab 2: Canary with ALB
1. Create ALB with two target groups
2. Deploy app to both target groups (different versions)
3. Configure weighted target groups (95/5)
4. Monitor CloudWatch metrics
5. Gradually shift traffic

### Lab 3: CodeDeploy with EC2
1. Set up CodeDeploy application
2. Create deployment group
3. Configure blue/green deployment
4. Deploy application
5. Test rollback

### Lab 4: ECS Blue/Green
1. Create ECS cluster and service
2. Configure CodeDeploy for ECS
3. Deploy new task definition with blue/green
4. Test traffic shifting
5. Validate rollback

### Lab 5: Lambda Canary with SAM
1. Create Lambda function with SAM
2. Configure canary deployment preference
3. Set up CloudWatch alarms
4. Deploy new version
5. Observe automatic rollback on alarm

---

## Summary

**Key Takeaways:**

1. **Match Strategy to Requirements:**
   - Zero downtime → Blue/Green or Rolling
   - Lowest risk → Canary
   - Cost-effective → Rolling or All-at-Once
   - Instant rollback → Blue/Green
   - No configuration drift → Immutable

2. **Service-Specific Patterns:**
   - EC2: CodeDeploy, Instance Refresh
   - Lambda: Aliases with traffic shifting
   - ECS: Rolling update or CodeDeploy Blue/Green
   - Elastic Beanstalk: Multiple deployment policies

3. **Always Consider:**
   - RTO/RPO requirements
   - Cost implications
   - Rollback strategy
   - Monitoring and alarms
   - Database compatibility

4. **Automation is Key:**
   - CI/CD pipelines
   - Automated testing
   - Automated rollback
   - Infrastructure as Code

5. **Test Everything:**
   - Test deployment in non-prod
   - Test rollback procedures
   - Load test with production-like traffic
   - Chaos engineering for resilience

---

*Remember: The exam tests your ability to select the RIGHT deployment strategy based on requirements, not memorize every configuration option.*
