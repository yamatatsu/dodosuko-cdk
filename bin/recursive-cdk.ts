import * as cdk from "aws-cdk-lib";
import * as cw from "aws-cdk-lib/aws-cloudwatch";

const app = new cdk.App();
const stack = new cdk.Stack(app, "RecursiveCdkStack");

new cw.Dashboard(stack, "DodosukoDashboard", {
  widgets: [recursiveDodosukoWidgets()],
});

function recursiveDodosukoWidgets(dodosuko = ""): cw.TextWidget[] {
  if (dodosuko.endsWith("どどすこすこすこ")) {
    return [new cw.TextWidget({ markdown: `# ラブ注入`, width: 4 })];
  }

  const phrase = randomDodosuko();

  return [
    new cw.TextWidget({ markdown: `${phrase}`, width: 4 }),
    ...recursiveDodosukoWidgets(dodosuko + phrase),
  ];
}

function randomDodosuko(): string {
  return Math.random() < 0.5 ? "どど" : "すこ";
}
