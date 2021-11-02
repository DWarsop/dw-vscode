import * as vscode from "vscode";
import * as path from "path";

export class FileHelper {
  getCurrentWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
    var path = undefined;

    if (vscode.window.activeTextEditor) {
      path = vscode.workspace.getWorkspaceFolder(
        vscode.window.activeTextEditor.document.uri
      );
    }

    return path;
  }

  getFilePath(filename: string, rootPath: string): vscode.Uri {
    return vscode.Uri.file(path.join(rootPath, filename));
  }

  async getTextDocumentFromFilePath(
    fileUri: vscode.Uri
  ): Promise<vscode.TextDocument | undefined> {
    return vscode.workspace.openTextDocument(fileUri);
  }

  async getFilesFromWorkspace(
    includePattern: vscode.RelativePattern,
    maxResults: number
  ): Promise<vscode.Uri[]> {
    return await vscode.workspace.findFiles(
      includePattern,
      undefined,
      maxResults
    );
  }

  async createFile(
    fileUri: vscode.Uri,
    fileName: string,
    content: Uint8Array = Buffer.from("")
  ): Promise<vscode.Uri> {
    let creationFileUri = vscode.Uri.joinPath(fileUri, fileName);

    if (!(await this.uriExists(creationFileUri))) {
      await vscode.workspace.fs.writeFile(creationFileUri, content);
    }

    return creationFileUri;
  }

  async createUpdateFile(
    fileUri: vscode.Uri,
    fileName: string,
    content: Uint8Array = Buffer.from("")
  ): Promise<vscode.Uri> {
    let creationFileUri = vscode.Uri.joinPath(fileUri, fileName);

    await vscode.workspace.fs.writeFile(creationFileUri, content);

    return creationFileUri;
  }

  async createFolder(
    fileUri: vscode.Uri,
    folderName: string
  ): Promise<vscode.Uri> {
    let creationFileUri = vscode.Uri.joinPath(fileUri, folderName);

    if (!this.uriExists(creationFileUri)) {
      await vscode.workspace.fs.createDirectory(fileUri);
    }

    return creationFileUri;
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

  pathToUri(path: string): vscode.Uri {
    return vscode.Uri.file(path);
  }

  async uriExists(fileUri: vscode.Uri): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(fileUri);
      return true;
    } catch {
      return false;
    }
  }

  getFilePathFromFile(fileUri: vscode.Uri): string {
    let filePath = fileUri.path;
    return filePath.substring(0, filePath.lastIndexOf("/"));
  }

  getFileNameFromFile(fileUri: vscode.Uri): string {
    let filePath = fileUri.path;
    return filePath.substring(filePath.lastIndexOf("/") + 1);
  }
}
