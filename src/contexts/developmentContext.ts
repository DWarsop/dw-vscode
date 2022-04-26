import * as vscode from "vscode";
import { DisplayService } from "../services/displayService";

export class DevelopmentContext implements vscode.Disposable {
  //Contexts
  vscodeExtensionContext: vscode.ExtensionContext;

  //Services
  displayService: DisplayService;

  constructor(context: vscode.ExtensionContext) {
    this.vscodeExtensionContext = context;

    //Initialise services
    this.displayService = new DisplayService(this);
  }

  dispose() {}
}
