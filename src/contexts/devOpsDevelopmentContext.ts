import * as vscode from "vscode";
import { DevOpsConnectionService } from "../services/devopsConnectionService";
import { DevelopmentContext } from "./developmentContext";

export class DevOpsDevelopmentContext implements vscode.Disposable {
  //Contexts
  vscodeExtensionContext: vscode.ExtensionContext;
  devContext: DevelopmentContext;

  //Services
  devOpsConnectionService: DevOpsConnectionService;

  constructor(context: vscode.ExtensionContext, devContext: DevelopmentContext) {
    this.vscodeExtensionContext = context;
    this.devContext = devContext;

    //Initialise services
    this.devOpsConnectionService = new DevOpsConnectionService(this.devContext, this);
  }

  dispose() {}
}
