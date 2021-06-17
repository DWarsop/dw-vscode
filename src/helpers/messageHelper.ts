import * as vscode from "vscode";

let messagePrefix = "DW: ";

export class MessageHelper {
  displayInfoMessage(message: string) {
    vscode.window.showInformationMessage(messagePrefix + message);
  }

  displayErrorMessage(message: string) {
    vscode.window.showErrorMessage(messagePrefix + message);
  }
}
