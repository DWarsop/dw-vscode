import * as vscode from "vscode";
import { ALExtensionService } from "../services/alExtensionService";
import { ALFileService } from "../services/alFileService";
import { ALContentService as ALContentService } from "../services/alContentService";
import { ALPermissionService } from "../services/alPermissionService";
import { DevelopmentContext } from "./developmentContext";

export class ALDevelopmentContext implements vscode.Disposable {
  //Contexts
  vscodeExtensionContext: vscode.ExtensionContext;
  devContext: DevelopmentContext;

  //Services
  alExtensionService: ALExtensionService;
  alFileService: ALFileService;
  alContentService: ALContentService;
  alPermissionService: ALPermissionService;

  constructor(context: vscode.ExtensionContext, devContext: DevelopmentContext) {
    this.vscodeExtensionContext = context;
    this.devContext = devContext;

    //Initialise services
    this.alExtensionService = new ALExtensionService(this.devContext, this);
    this.alFileService = new ALFileService(this.devContext, this);
    this.alContentService = new ALContentService(this.devContext, this);
    this.alPermissionService = new ALPermissionService(this.devContext, this);
  }

  dispose() {}
}
