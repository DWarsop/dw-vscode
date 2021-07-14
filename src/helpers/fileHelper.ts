import * as vscode from "vscode";
import * as path from "path";

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

  returnFilePath(filename: string, rootPath: string): vscode.Uri {
    return vscode.Uri.file(path.join(rootPath, filename));
  }

  async getTextDocumentFromFilePath(
    fileUri: vscode.Uri
  ): Promise<vscode.TextDocument | undefined> {
    return await vscode.workspace.openTextDocument(fileUri);
  }

  deleteFile(fileUri: vscode.Uri): [boolean, string] {
    var deleted: boolean = false;
    var error: string = "";

    vscode.workspace.fs.delete(fileUri).then(
      (resolve) => {
        deleted = true;
      },
      (reject) => {
        error = reject;
      }
    );

    return [deleted, error];
  }

  openFile(fileUri: vscode.Uri) {
    vscode.commands.executeCommand("vscode.open", fileUri);
  }

  openFolder(folderUri: vscode.Uri) {
    vscode.commands.executeCommand("vscode.openFolder", folderUri);
  }
}
