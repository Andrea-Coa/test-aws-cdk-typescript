import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Ec2Service } from 'aws-cdk-lib/aws-ecs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class MyFirstCfStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const queue = new sqs.Queue(this, 'MyFirstCfQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });

    // const topic = new sns.Topic(this, 'MyFirstCfTopic');

    // topic.addSubscription(new subs.SqsSubscription(queue));
    const vm = ec2.MachineImage.genericLinux({
      "us-east-1": "ami-0aa28dab1f2852040"
    })

    const vpc = new ec2.Vpc(this, 'VPC');
    // const vpc = new ec2.Vpc(this, 'VPC', {
    //   ipAddresses: ec2.IpAddresses.cidr('0.0.0.0/0'),
    // })
    
    // // Iterate the private subnets
    // const selection = vpc.selectSubnets({
    //   subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
    // });

    const sg = new ec2.SecurityGroup(this, 'mySecurityGroup', {
      vpc:vpc,
      description: "security group for test ec2 instance"
    });

    // addEgressRule(peer, connection, description?, remoteRule?)

    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    
    const instance = new ec2.Instance(this, 'myEc2Instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: vm,
      vpc: vpc,
      securityGroup: sg,
      keyName:"vockey",
      blockDevices: [
        {
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(20),
        }
      ]
    });

    instance.userData.addCommands(
      "cd /var/www/html/",
      "git clone https://github.com/utec-cc-2024-2-test/websimple.git",
      "git clone https://github.com/utec-cc-2024-2-test/webplantilla.git",
      "ls -l"
    );

    

  }
}
