import * as vscode from "vscode";
import { ALDevelopmentContext } from "./alDevelopmentContext";
import { DevelopmentContext } from "./developmentContext";
import { DevOpsDevelopmentContext } from "./devopsDevelopmentContext";

export function activate(context: vscode.ExtensionContext) {
  //Initialise contexts
  const developmentContext: DevelopmentContext = new DevelopmentContext(context);
  context.subscriptions.push(developmentContext);

  const alDevelopmentContext: ALDevelopmentContext = new ALDevelopmentContext(context, developmentContext);
  context.subscriptions.push(alDevelopmentContext);

  const devOpsDevelopmentContext: DevOpsDevelopmentContext = new DevOpsDevelopmentContext(context, developmentContext);
  context.subscriptions.push(devOpsDevelopmentContext);
}

export function deactivate() {}
