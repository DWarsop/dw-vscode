import * as vscode from "vscode";
import { ALDevelopmentContext } from "./alDevelopmentContext";
import { DevelopmentContext } from "./developmentContext";

export function activate(context: vscode.ExtensionContext) {
  //Initialise contexts
  const developmentContext: DevelopmentContext = new DevelopmentContext(context);
  context.subscriptions.push(developmentContext);

  const alDevelopmentContext: ALDevelopmentContext = new ALDevelopmentContext(context, developmentContext);
  context.subscriptions.push(alDevelopmentContext);
}

export function deactivate() {}
