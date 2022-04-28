import axios from "axios";
import * as vscode from "vscode";
import { API, GitExtension } from "../../git";
import * as GITRESOURCES from "../constants/gitResources";
import { DevelopmentContext } from "../contexts/developmentContext";
import { FileHelper } from "../helpers";

export class GitExtensionService {
  //Class globals
  protected _devContext: DevelopmentContext;
  protected gitExtensionAPI: API | undefined;
  protected _fileHelper: FileHelper;

  constructor(devContext: DevelopmentContext) {
    //Context globals
    this._devContext = devContext;
    this._fileHelper = new FileHelper();

    //Retrieve extension
    this.retrieveGitExtensionAPI();
  }

  async retrieveGitExtensionAPI() {
    let gitExtension = vscode.extensions.getExtension<GitExtension>(GITRESOURCES.gitExtensionId);

    if (!gitExtension) {
      this._devContext.displayService.writeConsoleMessage("Git extension could not be found!");
      return;
    }

    await gitExtension.activate();
    this.gitExtensionAPI = gitExtension.exports.getAPI(1);
  }

  async cloneRepository(repositoryUrl: string): Promise<boolean> {
    if (this.gitExtensionAPI !== undefined) {
      await vscode.commands.executeCommand("git.clone", repositoryUrl);
      return true;
    }

    return false;
  }
}
