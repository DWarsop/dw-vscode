"use strict";

import * as vscode from "vscode";
import { ALInformationService } from "../services/alInformationService";

export class ALDevelopmentContext implements vscode.Disposable {
  //Contexts
  vscodeExtensionContext: vscode.ExtensionContext;

  //Services
  alInformationService: ALInformationService;

  constructor(context: vscode.ExtensionContext) {
    this.vscodeExtensionContext = context;

    //Initialise services
    this.alInformationService = new ALInformationService(this);
  }

  dispose() {}
}
