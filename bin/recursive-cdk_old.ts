import * as cdk from "aws-cdk-lib";
import * as cw from "aws-cdk-lib/aws-cloudwatch";

const app = new cdk.App();
const stack = new cdk.Stack(app, "OldZundokoCdkStack");

new cw.Dashboard(stack, "ZundokoDashboard", {
  widgets: [recursiveZundokoWidgets()],
});

function recursiveZundokoWidgets(zundoko = ""): cw.TextWidget[] {
  if (zundoko.endsWith("ずんずんずんずんどこ")) {
    return [new cw.TextWidget({ markdown: `# き・よ・し！！`, width: 4 })];
  }

  const phrase = randomZundoko();

  return [
    new cw.TextWidget({ markdown: `${phrase}`, width: 4 }),
    ...recursiveZundokoWidgets(zundoko + phrase),
  ];
}

function randomZundoko(): string {
  return Math.random() < 0.5 ? "ずん" : "どこ";
}
