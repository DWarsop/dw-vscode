import * as vscode from "vscode";
import { DisplayService } from "../services/displayService";
import { GitExtensionService } from "../services/gitExtensionService";

export class DevelopmentContext implements vscode.Disposable {
  //Contexts
  vscodeExtensionContext: vscode.ExtensionContext;

  //Services
  displayService: DisplayService;
  gitExtensionService: GitExtensionService;

  constructor(context: vscode.ExtensionContext) {
    this.vscodeExtensionContext = context;

    //Initialise services
    this.gitExtensionService = new GitExtensionService(this);
    this.displayService = new DisplayService(this);
  }

  dispose() {}
}
