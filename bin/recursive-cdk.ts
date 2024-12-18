import * as cdk from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as sns from "aws-cdk-lib/aws-sns";
import * as chatbot from "aws-cdk-lib/aws-chatbot";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Zundoko } from "./zundoko-construct";

const app = new cdk.App();
const stack = new cdk.Stack(app, "ZundokoCdkStack");

const topic = new sns.Topic(stack, "OutputTopic", {});

new chatbot.SlackChannelConfiguration(stack, "SlackChannel", {
  slackChannelConfigurationName: "Zundoko",
  slackWorkspaceId: "T0KRX46NM",
  slackChannelId: "C0859CC0P1U",
  notificationTopics: [topic],
});

new Zundoko(stack, "Zundoko", {
  outputTarget: (phrase) =>
    new targets.SnsTopic(topic, {
      message: events.RuleTargetInput.fromObject({
        version: "1.0",
        source: "custom",
        content: {
          description: phrase,
        },
      }),
    }),
});
