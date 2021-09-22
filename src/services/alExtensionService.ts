import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import * as ALSERVICES from "../constants/alExtensionServices";
import * as ALRESOURCES from "../constants/alResources";
import * as ALCOMMANDS from "../constants/alCommands";

export class ALExtensionService {
  //Class globals
  protected _context: ALDevelopmentContext;
  protected alExtensionAPI: any;

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;

    //Retrieve extension
    this.retrieveALExtensionAPI();

    //Commands
    this._context.vscodeExtensionContext.subscriptions.push(
      vscode.commands.registerCommand(ALCOMMANDS.PUBLISH, () => {
        this.runALPublish();
      })
    );
  }

  async retrieveALExtensionAPI() {
    let alExtension = vscode.extensions.getExtension(ALRESOURCES.alExtensionId);

    if (!alExtension) {
      this._context.alDisplayService.writeConsoleMessage(
        "AL extension could not be found!"
      );
      return;
    }

    await alExtension.activate();
    this.alExtensionAPI = alExtension.exports.services;
  }

  retrieveLastActiveWorkspacePath(): string | undefined {
    if (this.alExtensionAPI !== undefined) {
      let lastActiveWorkspacePath =
        this.alExtensionAPI[ALSERVICES.editor].lastActiveWorkspacePath;

      //Performing null check due to AL extension not returning undefined
      if (lastActiveWorkspacePath !== null) {
        return lastActiveWorkspacePath;
      }
    }

    return undefined;
  }

  async runALPublish() {
    if (!this._context.alFileService.withinALWorkspace()) {
      return;
    }

    try {
      let displayWarning: boolean = false;

      let launchFileConfigs =
        await this._context.alFileService.getLaunchFileConfigs();

      if (launchFileConfigs !== undefined) {
        launchFileConfigs.forEach((config) => {
          if (
            config.schemaUpdateMode === ALRESOURCES.recreateSchemaUpdateMode
          ) {
            displayWarning = true;
          }
        });
      }

      if (displayWarning) {
        let response =
          await this._context.alDisplayService.displayWarningMessageWithItems(
            ALRESOURCES.schemaUpdateMethodQst,
            false,
            [ALRESOURCES.continueAction, ALRESOURCES.configurationsAction]
          );

        switch (response) {
          case ALRESOURCES.continueAction: {
            break;
          }
          case ALRESOURCES.configurationsAction: {
            this._context.alFileService.openLaunchFile();
            return;
          }
          default: {
            return;
          }
        }
      }

      if (this.alExtensionAPI !== undefined) {
        this.alExtensionAPI[ALSERVICES.build].publishContainer();
      }
    } catch (error) {
      this._context.alDisplayService.showConsole();
      this._context.alDisplayService.writeConsoleMessage(error);
    }
  }
}
