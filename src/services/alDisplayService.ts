import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";

export class ALDisplayService {
  //Class globals
  protected _context: ALDevelopmentContext;
  protected _outputChannel: vscode.OutputChannel | undefined;
  private messagePrefix = "DW: ";

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;

    //Initialise UI
    this._outputChannel = vscode.window.createOutputChannel("DW: AL");
  }

  displayInfoMessage(message: string) {
    vscode.window.showInformationMessage(this.messagePrefix + message);
  }

  displayInfoMessageWithItems(
    message: string,
    modal: boolean,
    items: string[]
  ): Thenable<string | undefined> {
    let selected = vscode.window.showInformationMessage(
      this.messagePrefix + message,
      { modal: modal },
      ...items
    );

    return selected;
  }

  displayWarningMessage(message: string) {
    vscode.window.showWarningMessage(this.messagePrefix + message);
  }

  displayWarningMessageWithItems(
    message: string,
    modal: boolean,
    items: string[]
  ): Thenable<string | undefined> {
    let selected = vscode.window.showWarningMessage(
      this.messagePrefix + message,
      { modal: modal },
      ...items
    );

    return selected;
  }

  displayErrorMessage(message: string) {
    vscode.window.showErrorMessage(this.messagePrefix + message);
  }

  displayErrorMessageWithItems(
    message: string,
    modal: boolean,
    items: string[]
  ): Thenable<string | undefined> {
    let selected = vscode.window.showErrorMessage(
      this.messagePrefix + message,
      { modal: modal },
      ...items
    );

    return selected;
  }

  showConsole() {
    if (this._outputChannel !== undefined) {
      this._outputChannel.show();
    }
  }

  hideConsole() {
    if (this._outputChannel !== undefined) {
      this._outputChannel.hide();
    }
  }

  writeConsoleMessage(message: string) {
    if (this._outputChannel !== undefined) {
      this._outputChannel.appendLine(message);
    }
  }
}
