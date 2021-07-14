"use strict";

import * as vscode from "vscode";
import { ALDisplayService } from "../services/alDisplayService";
import { ALExtensionService } from "../services/alExtensionService";
import { ALFileService } from "../services/alFileService";
import { ALInformationService } from "../services/alInformationService";

export class ALDevelopmentContext implements vscode.Disposable {
  //Contexts
  vscodeExtensionContext: vscode.ExtensionContext;

  //Services
  alDisplayService: ALDisplayService;
  alExtensionService: ALExtensionService;
  alFileService: ALFileService;
  alInformationService: ALInformationService;

  constructor(context: vscode.ExtensionContext) {
    this.vscodeExtensionContext = context;

    //Initialise services
    this.alDisplayService = new ALDisplayService(this);
    this.alExtensionService = new ALExtensionService(this);
    this.alFileService = new ALFileService(this);
    this.alInformationService = new ALInformationService(this);
  }

  dispose() {}
}
