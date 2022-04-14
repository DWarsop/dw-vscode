import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import * as ALSERVICES from "../constants/alExtensionServices";
import * as ALDISPLAYRESOURCES from "../constants/alDisplayResources";
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
      vscode.commands.registerCommand(ALCOMMANDS.debugPublish, () => {
        this.runALPublish();
      })
    );
  }

  async retrieveALExtensionAPI() {
    let alExtension = vscode.extensions.getExtension(ALRESOURCES.alExtensionId);

    if (!alExtension) {
      this._context.alDisplayService.writeConsoleMessage("AL extension could not be found!");
      return;
    }

    await alExtension.activate();
    this.alExtensionAPI = alExtension.exports.services;
  }

  retrieveLastActiveWorkspacePath(): string | undefined {
    if (this.alExtensionAPI !== undefined) {
      let lastActiveWorkspacePath = this.alExtensionAPI[ALSERVICES.editor].lastActiveWorkspacePath;

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

      let launchFileConfigs = await this._context.alFileService.getLaunchFileConfigs();

      if (launchFileConfigs !== undefined) {
        launchFileConfigs.forEach((config) => {
          if (config.schemaUpdateMode === ALRESOURCES.recreateSchemaUpdateMode) {
            displayWarning = true;
          }
        });
      }

      if (displayWarning) {
        let response = await this._context.alDisplayService.displayWarningMessageWithItems(
          ALDISPLAYRESOURCES.schemaUpdateMethodQst,
          false,
          [ALDISPLAYRESOURCES.continueAction, ALDISPLAYRESOURCES.configurationsAction]
        );

        switch (response) {
          case ALDISPLAYRESOURCES.continueAction: {
            break;
          }
          case ALDISPLAYRESOURCES.configurationsAction: {
            this._context.alFileService.openLaunchFile();
            return;
          }
          default: {
            return;
          }
        }
      }

      if (this.alExtensionAPI !== undefined) {
        enum PublishOptions {
          debugOnly = "Debug only",
          publishWithDebugging = "Publish with debugging",
          publishWithoutDebugging = "Publish without debugging",
        }

        const publishOptions = [
          {
            label: PublishOptions.debugOnly,
            detail: "Debug the client, without running the publishing routine",
          },
          {
            label: PublishOptions.publishWithDebugging,
            detail: "Run the publishing routine, debugging the client afterwards",
          },
          {
            label: PublishOptions.publishWithoutDebugging,
            detail: "Run the publishing routine, without debugging the client afterwards",
          },
        ];

        let publishType = await vscode.window.showQuickPick(publishOptions, {
          canPickMany: false,
          placeHolder: "Select the desired method...",
        });

        if (publishType !== undefined) {
          switch (publishType.label) {
            case PublishOptions.debugOnly:
              this.alExtensionAPI[ALSERVICES.build].startDebugging(false, false, true);
              break;
            case PublishOptions.publishWithDebugging:
              this.alExtensionAPI[ALSERVICES.build].publishContainer();
              break;
            case PublishOptions.publishWithoutDebugging:
              this.alExtensionAPI[ALSERVICES.build].publishContainer(true);
              break;
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this._context.alDisplayService.showConsole();
        this._context.alDisplayService.displayErrorMessage(error.message);
      }
    }
  }
}
