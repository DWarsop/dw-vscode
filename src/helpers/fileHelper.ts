import * as vscode from "vscode";
import { MessageHelper } from "./messageHelper";

let messageHelper: MessageHelper = new MessageHelper();

export class FileHelper {
  returnCurrentWorkspace(): vscode.WorkspaceFolder | undefined {
    var path = undefined;

    if (vscode.window.activeTextEditor) {
      path = vscode.workspace.getWorkspaceFolder(
        vscode.window.activeTextEditor.document.uri
      );
    }

    return path;
  }

  async returnFilePath(
    filename: string,
    workspaceFolder: vscode.WorkspaceFolder
  ): Promise<vscode.Uri | undefined> {
    let pattern = new vscode.RelativePattern(workspaceFolder, filename);
    let uri = await vscode.workspace.findFiles(pattern, "", 1);
    return uri[0];
  }

  async getValueFromJSONConfig(
    key: string,
    configUri: vscode.Uri
  ): Promise<string> {
    var value: string = "";

    await vscode.workspace.openTextDocument(configUri).then((document) => {
      if (document.lineCount > 0) {
        try {
          let configJSON = JSON.parse(document.getText());
          if (configJSON !== undefined) {
            value = configJSON[key];
          }
        } catch (error) {}
      }
    });

    if (value === undefined) {
      value = "";
    }

    return value;
  }

  deleteFile(fileUri: vscode.Uri): boolean {
    var deleted: boolean = false;

    vscode.workspace.fs.delete(fileUri).then(
      (scs) => {
        messageHelper.displayInfoMessage("File deleted.");
        deleted = true;
      },
      (err) => {
        messageHelper.displayErrorMessage(
          "File could not be deleted due to the following: " + err
        );
      }
    );

    return deleted;
  }
}
