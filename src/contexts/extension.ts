import * as vscode from "vscode";
import { ALDevelopmentContext } from "./alDevelopmentContext";

export function activate(context: vscode.ExtensionContext) {
  //Initialise contexts
  const alDevelopmentContext: ALDevelopmentContext = new ALDevelopmentContext(context);
  context.subscriptions.push(alDevelopmentContext);
}

export function deactivate() {}
