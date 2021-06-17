import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import { FileHelper } from "../helpers/fileHelper";
import { MessageHelper } from "../helpers/messageHelper";
import * as ALCOMMANDS from "../constants/alCommands";

export class ALInformationService {
  //Class globals
  protected _context: ALDevelopmentContext;

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;

    this._context.vscodeExtensionContext.subscriptions.push(
      vscode.commands.registerCommand(ALCOMMANDS.SAY_UPDATE_METHOD, () => {
        this.sayUpdateMethod();
      })
    );
  }

  async activateAL() {
    // Get the TS extension
    const alExtension = vscode.extensions.getExtension("ms-dynamics-smb.al");
    if (!alExtension) {
      return;
    }

    await alExtension.activate();

    // Get the API from the TS extension
    if (!alExtension.exports || !alExtension.exports.getAPI) {
      return;
    }

    const api = alExtension.exports.getAPI(0);
    if (!api) {
      return;
    }

    api.
  }

  sayUpdateMethod() {
    let messageHelper: MessageHelper = new MessageHelper();
    let fileHelper: FileHelper = new FileHelper();

    let workspaceFolder = fileHelper.returnCurrentWorkspace();

    let alExtension = vscode.extensions.getExtension("ms-dynamics-smb.al");
    alExtension?.activate;
    alExtension?.exports();

    if (workspaceFolder !== undefined) {
      fileHelper.returnFilePath("app.json", workspaceFolder).then((fileUri) => {
        if (fileUri !== undefined) {
          fileHelper.getValueFromJSONConfig("name", fileUri).then((value) => {
            messageHelper.displayInfoMessage(value);
          });
        } else {
          messageHelper.displayErrorMessage("app.json could not be found!");
        }
      });
    } else {
      messageHelper.displayErrorMessage(
        "Workspace could not be found. Please open a file within the workspace you would like to use."
      );
    }
  }
}
