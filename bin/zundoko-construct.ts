import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as pipes from "@aws-cdk/aws-pipes-alpha";
import * as pipesSources from "@aws-cdk/aws-pipes-sources-alpha";
import * as pipesTargets from "@aws-cdk/aws-pipes-targets-alpha";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class Zundoko extends Construct {
  public readonly eventBus: events.IEventBus;

  constructor(
    scope: Construct,
    id: string,
    props: {
      outputTarget: (phrase: string) => events.IRuleTarget;
      history?: string;
    },
  ) {
    super(scope, id);

    const { outputTarget, history = "" } = props;

    const last = history.endsWith("ずんずんずんずんどこ");

    const phrase = last ? "き・よ・し！！" : randomZundoko();

    this.eventBus = new events.EventBus(this, "Bus");
    const rule = new events.Rule(this, "Rule", {
      eventBus: this.eventBus,
      eventPattern: {
        source: events.Match.anyOf(events.Match.prefix("")),
      },
    });
    rule.addTarget(outputTarget(phrase));

    if (!last) {
      const { eventBus } = new Zundoko(this, "Zundoko", {
        outputTarget,
        history: history + phrase,
      });

      const queue = new sqs.Queue(this, "Queue", {
        deliveryDelay: cdk.Duration.seconds(1),
      });

      new pipes.Pipe(this, "Pipe", {
        source: new pipesSources.SqsSource(queue),
        target: new pipesTargets.EventBridgeTarget(eventBus, {
          inputTransformation: pipes.InputTransformation.fromObject({}),
        }),
      });

      rule.addTarget(new targets.SqsQueue(queue));
    }
  }
}

function randomZundoko(): string {
  return Math.random() < 0.6 ? "ずん" : "どこ";
}
