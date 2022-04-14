import * as vscode from "vscode";
import { ALDisplayService } from "../services/alDisplayService";
import { ALExtensionService } from "../services/alExtensionService";
import { ALFileService } from "../services/alFileService";
import { ALContentService as ALContentService } from "../services/alContentService";
import { ALPermissionService } from "../services/alPermissionService";

export class ALDevelopmentContext implements vscode.Disposable {
  //Contexts
  vscodeExtensionContext: vscode.ExtensionContext;

  //Services
  alDisplayService: ALDisplayService;
  alExtensionService: ALExtensionService;
  alFileService: ALFileService;
  alContentService: ALContentService;
  alPermissionService: ALPermissionService;

  constructor(context: vscode.ExtensionContext) {
    this.vscodeExtensionContext = context;

    //Initialise services
    this.alDisplayService = new ALDisplayService(this);
    this.alExtensionService = new ALExtensionService(this);
    this.alFileService = new ALFileService(this);
    this.alContentService = new ALContentService(this);
    this.alPermissionService = new ALPermissionService(this);
  }

  dispose() {}
}
