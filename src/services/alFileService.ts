import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import { FileHelper } from "../helpers/fileHelper";
import * as ALLABELS from "../constants/alLabels";

interface LaunchConfigFile {
  schemaUpdateMode: string;
}

interface AppConfigFile {
  runtime: string;
}

export class ALFileService {
  //Class globals
  protected _context: ALDevelopmentContext;
  protected _aLWorkspace?: string;

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;
    this._aLWorkspace = undefined;

    //Call on construction
    this.setWithinALWorkspace();

    this._context.vscodeExtensionContext.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(() => {
        this.setWithinALWorkspace();
      }),
      vscode.workspace.onDidChangeWorkspaceFolders(() => {
        this.setWithinALWorkspace();
      })
    );
  }

  withinALWorkspace(): boolean {
    if (this._aLWorkspace === undefined) {
      this.setWithinALWorkspace();
    }

    let within = this._aLWorkspace !== undefined;

    if (!within) {
      this._context.alDisplayService.displayErrorMessage(
        ALLABELS.missingWorkspaceErr
      );
    }

    return within;
  }

  setWithinALWorkspace() {
    let fileHelper: FileHelper = new FileHelper();

    let workspacePath =
      this._context.alExtensionService.retrieveLastActiveWorkspacePath();

    if (workspacePath === this._aLWorkspace) {
      return;
    }

    if (workspacePath !== undefined) {
      if (
        fileHelper.returnFilePath(ALLABELS.appJsonPath, workspacePath) !==
        undefined
      ) {
        this._aLWorkspace = workspacePath;
      }
    }
  }

  getLaunchFilePath(): vscode.Uri | undefined {
    let fileHelper: FileHelper = new FileHelper();

    return fileHelper.returnFilePath(
      ALLABELS.launchJsonPath,
      this._aLWorkspace!
    );
  }

  openLaunchFile() {
    let fileHelper: FileHelper = new FileHelper();
    let launchUri = this.getLaunchFilePath();

    if (launchUri !== undefined) {
      fileHelper.openFile(launchUri);
    }
  }

  async getLaunchFileConfigs(): Promise<LaunchConfigFile[] | undefined> {
    let fileHelper: FileHelper = new FileHelper();

    let launchUri = this.getLaunchFilePath();

    if (launchUri !== undefined) {
      let launchFile = await fileHelper.getTextDocumentFromFilePath(launchUri);
      if (launchFile !== undefined) {
        let launchJson = JSON.parse(launchFile.getText());
        let launchFileConfigs: LaunchConfigFile[] = [];

        launchJson.configurations.forEach((config: any) => {
          launchFileConfigs.push(this.translateJsonToLaunchConfigFile(config));
        });

        return launchFileConfigs;
      }
    }

    return undefined;
  }

  translateJsonToLaunchConfigFile(configJson: any) {
    let launchConfigFile: LaunchConfigFile = {
      schemaUpdateMode: configJson["schemaUpdateMode"],
    };

    return launchConfigFile;
  }

  async getAppFileConfig(): Promise<AppConfigFile | undefined> {
    let fileHelper: FileHelper = new FileHelper();

    let appUri = fileHelper.returnFilePath(
      ALLABELS.appJsonPath,
      this._aLWorkspace!
    );

    if (appUri !== undefined) {
      let appFile = await fileHelper.getTextDocumentFromFilePath(appUri);
      if (appFile !== undefined) {
        let appJson = JSON.parse(appFile.getText());

        return this.translateJsonToAppConfigFile(appJson);
      }
    }

    return undefined;
  }

  translateJsonToAppConfigFile(configJson: any) {
    let appConfigFile: AppConfigFile = {
      runtime: configJson["runtime"],
    };

    return appConfigFile;
  }
}
