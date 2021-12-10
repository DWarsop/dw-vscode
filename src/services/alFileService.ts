import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import { FileHelper } from "../helpers/fileHelper";
import * as ALDISPLAYRESOURCES from "../constants/alDisplayResources";
import * as ALRESOURCES from "../constants/alResources";
import * as ALCOMMANDS from "../constants/alCommands";
import { TextHelper } from "../helpers";

interface LaunchConfigFile {
  schemaUpdateMode: string;
}

interface AppConfigFile {
  name: string;
  runtime: string;
  idRanges: AppConfigFileIdRanges[];
}

interface AppConfigFileIdRanges {
  from: number;
  to: number;
}

interface AppSourceCopConfigFile {
  mandatoryAffixes: string[];
}

export interface ALFileDetail {
  type: ALRESOURCES.ALObjectTypes | undefined;
  priority: number;
  shorthand: string;
  id: number;
  fullName: string;
  name: string;
  modifier: string;
  modifierName: string;
}

export class ALFileService {
  //Class globals
  protected _context: ALDevelopmentContext;
  protected _aLWorkspace?: string;
  protected _fileHelper: FileHelper;
  protected _textHelper: TextHelper;

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;
    this._aLWorkspace = undefined;
    this._fileHelper = new FileHelper();
    this._textHelper = new TextHelper();

    //Call on construction
    this.setWithinALWorkspace();

    this._context.vscodeExtensionContext.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(() => {
        this.setWithinALWorkspace();
      }),
      vscode.workspace.onDidChangeWorkspaceFolders(() => {
        this.setWithinALWorkspace();
      }),
      vscode.commands.registerCommand(ALCOMMANDS.insertAffix, () => {
        this.runInsertAffix();
      }),
      vscode.commands.registerCommand(ALCOMMANDS.renameFiles, () => {
        this.runRenameFiles();
      })
    );
  }

  async runInsertAffix() {
    if (!this.withinALWorkspace()) {
      return;
    }

    try {
      let editor = vscode.window.activeTextEditor;

      if (editor !== undefined) {
        let selection = editor.selection;
        let affixes = await this.getAffixes();
        let selectedAffix: string | undefined = undefined;

        if (affixes.length > 1) {
          selectedAffix = await vscode.window.showQuickPick(affixes, {
            canPickMany: false,
            placeHolder: "Select the required affix",
          });
        } else {
          selectedAffix = affixes[0];
        }

        if (selectedAffix !== undefined) {
          editor.edit((editBuilder) => {
            editBuilder.insert(selection.start, selectedAffix!);
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this._context.alDisplayService.showConsole();
        this._context.alDisplayService.displayErrorMessage(error.message);
      }
    }
  }

  async runRenameFiles() {
    if (!this.withinALWorkspace()) {
      return;
    }

    try {
      let filesUpdated = 0;
      let workspaceFiles =
        await this._context.alFileService.getFilesFromALWorkspace(
          ALRESOURCES.alFileSearchPattern,
          10000
        );

      if (workspaceFiles.length > 0) {
        await Promise.all(
          workspaceFiles.map(async (file, i, arr) => {
            let alFileDetail =
              await this._context.alFileService.getALDetailsFromFile(file);
            if (alFileDetail !== undefined && alFileDetail.type) {
              let filePath = this._fileHelper.getFilePathFromFile(file);

              let newFileName = this._textHelper.stripInvalidChars(
                alFileDetail.name
              );
              newFileName = this._textHelper.toCamelCase(newFileName);
              newFileName = this._textHelper.stripWhitespace(newFileName);
              newFileName += `.${alFileDetail.shorthand}${ALRESOURCES.alFileEnd}`;

              let newFileUri = this._fileHelper.getFilePath(
                newFileName,
                filePath
              );

              vscode.workspace.fs.rename(file, newFileUri);
              filesUpdated += 1;
            }
          })
        );
      }

      this._context.alDisplayService.displayInfoMessage(
        `${filesUpdated} ${ALDISPLAYRESOURCES.filesRenamed}`
      );
    } catch (error) {
      if (error instanceof Error) {
        this._context.alDisplayService.showConsole();
        this._context.alDisplayService.displayErrorMessage(error.message);
      }
    }
  }

  withinALWorkspace(): boolean {
    if (this._aLWorkspace === undefined) {
      this.setWithinALWorkspace();
    }

    let within = this._aLWorkspace !== undefined;

    if (!within) {
      this._context.alDisplayService.displayErrorMessage(
        ALDISPLAYRESOURCES.missingWorkspaceErr
      );
    }

    return within;
  }

  setWithinALWorkspace() {
    let workspacePath =
      this._context.alExtensionService.retrieveLastActiveWorkspacePath();

    if (workspacePath === this._aLWorkspace) {
      return;
    }

    if (workspacePath !== undefined) {
      if (
        this._fileHelper.getFilePath(ALRESOURCES.appJsonName, workspacePath) !==
        undefined
      ) {
        this._aLWorkspace = workspacePath;
      }
    }
  }

  getALWorkspaceUri(): vscode.Uri | undefined {
    if (this._aLWorkspace !== undefined) {
      return this._fileHelper.pathToUri(this._aLWorkspace);
    } else {
      return undefined;
    }
  }

  getLaunchFileUri(): vscode.Uri {
    return this._fileHelper.getFilePath(
      ALRESOURCES.launchJsonPath,
      this._aLWorkspace!
    );
  }

  async launchFileExists(): Promise<boolean> {
    return await this._fileHelper.uriExists(this.getLaunchFileUri());
  }

  openLaunchFile() {
    let launchUri = this.getLaunchFileUri();

    if (launchUri !== undefined) {
      this._fileHelper.openFile(launchUri);
    }
  }

  getObjectsFolderUri(): vscode.Uri {
    return this._fileHelper.getFilePath(
      ALRESOURCES.objectsFolder,
      this._aLWorkspace!
    );
  }

  async objectFolderExists(): Promise<boolean> {
    return await this._fileHelper.uriExists(this.getObjectsFolderUri());
  }

  async getLaunchFileConfigs(): Promise<LaunchConfigFile[] | undefined> {
    let launchUri = this.getLaunchFileUri();

    if (launchUri !== undefined) {
      let launchFile = await this._fileHelper.getTextDocumentFromFilePath(
        launchUri
      );
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
    let appJsonFile = await this.getFilesFromALWorkspace(
      "**/" + ALRESOURCES.appJsonName,
      1
    );

    if (appJsonFile[0] !== undefined) {
      let appFile = await this._fileHelper.getTextDocumentFromFilePath(
        appJsonFile[0]
      );
      if (appFile !== undefined) {
        let appJson = JSON.parse(appFile.getText());

        return this.translateJsonToAppConfigFile(appJson);
      }
    }

    return undefined;
  }

  translateJsonToAppConfigFile(configJson: any) {
    let appConfigFile: AppConfigFile = {
      name: configJson["name"],
      runtime: configJson["runtime"],
      idRanges: configJson["idRanges"],
    };

    return appConfigFile;
  }

  async getAppSourceCopFileConfig(): Promise<
    AppSourceCopConfigFile | undefined
  > {
    let appSourceCopJsonFile = await this.getFilesFromALWorkspace(
      "**/" + ALRESOURCES.appSourceCopJsonName,
      1
    );

    if (appSourceCopJsonFile[0] !== undefined) {
      let appFile = await this._fileHelper.getTextDocumentFromFilePath(
        appSourceCopJsonFile[0]
      );
      if (appFile !== undefined) {
        let appJson = JSON.parse(appFile.getText());

        return this.translateJsonToAppSourceCopConfigFile(appJson);
      }
    }

    return undefined;
  }

  translateJsonToAppSourceCopConfigFile(configJson: any) {
    let appSourceCopConfigFile: AppSourceCopConfigFile = {
      mandatoryAffixes: configJson["mandatoryAffixes"],
    };

    return appSourceCopConfigFile;
  }

  createFileInALWorkspace(
    filePath: string,
    fileName: string,
    content: string
  ): Promise<vscode.Uri> {
    let creationFileUri = vscode.Uri.joinPath(
      this.getALWorkspaceUri()!,
      filePath
    );
    return this._fileHelper.createFile(
      creationFileUri,
      fileName,
      Buffer.from(content)
    );
  }

  createFolderInALWorkspace(
    filePath: string,
    folderName: string
  ): Promise<vscode.Uri> {
    let creationFileUri = vscode.Uri.joinPath(
      this.getALWorkspaceUri()!,
      filePath
    );

    return this._fileHelper.createFolder(creationFileUri, folderName);
  }

  async createObjectsFolderInALWorkspace(): Promise<vscode.Uri> {
    if (!this.objectFolderExists()) {
      return await this.createFolderInALWorkspace(
        "",
        ALRESOURCES.objectsFolder
      );
    } else {
      return this.getObjectsFolderUri();
    }
  }

  async getFilesFromALWorkspace(
    includePattern: string,
    maxResults: number
  ): Promise<vscode.Uri[]> {
    let workspacePattern = new vscode.RelativePattern(
      this.getALWorkspaceUri()!,
      includePattern
    );
    return await this._fileHelper.getFilesFromWorkspace(
      workspacePattern,
      maxResults
    );
  }

  async getALDetailsFromFile(
    fileUri: vscode.Uri
  ): Promise<ALFileDetail | undefined> {
    let alFileDetail: ALFileDetail = {
      priority: 0,
      shorthand: "",
      type: undefined,
      id: 0,
      fullName: "",
      name: "",
      modifier: "",
      modifierName: "",
    };
    let document = await this._fileHelper.getTextDocumentFromFilePath(fileUri);

    if (document !== undefined && document.lineCount > 0) {
      let alHeaderLine: string = "";

      let lineNo: number = 0;
      do {
        let currentLineText = document.lineAt(lineNo).text;
        if (new RegExp(ALRESOURCES.objectTypeRegEx).test(currentLineText)) {
          alHeaderLine = currentLineText;
        }
        lineNo += 1;
      } while (alHeaderLine === "" && lineNo <= document.lineCount - 1);

      if (alHeaderLine !== "") {
        let alHeaderSections = alHeaderLine.match(
          new RegExp(ALRESOURCES.wordQuoteBoundaryRegEx)
        );
        if (alHeaderSections !== null) {
          //* Normal files have 3+ sections. Some however; such as Interfaces, don't use Ids so we adjust the array to re-align the parameters
          if (alHeaderSections.length < 3) {
            alHeaderSections.push(alHeaderSections[1]);
          }

          for (let i = 0; i < alHeaderSections.length; i++) {
            let value = alHeaderSections[i];
            switch (i) {
              case 0:
                alFileDetail.type = <ALRESOURCES.ALObjectTypes>value;
                alFileDetail.priority =
                  ALRESOURCES.objectTypeInformation[alFileDetail.type].priority;
                alFileDetail.shorthand =
                  ALRESOURCES.objectTypeInformation[
                    alFileDetail.type
                  ].shorthand;
                break;
              case 1:
                alFileDetail.id = parseInt(value);
                break;
              case 2:
                alFileDetail.fullName = value;
                alFileDetail.name = value;

                let affixes = await this.getAffixes();
                if (affixes) {
                  affixes.forEach((affix) => {
                    alFileDetail.name = alFileDetail.name
                      .replace(affix + " ", "")
                      .replace(affix, "");
                  });
                }
                break;
              case 3:
                alFileDetail.modifier = value;
                break;
              case 4:
                alFileDetail.modifierName = value;
                break;
            }
          }

          return alFileDetail;
        }
      }
    }

    return undefined;
  }

  async getAffixes(): Promise<string[]> {
    let appSourceCopConfig = await this.getAppSourceCopFileConfig();

    if (appSourceCopConfig !== undefined) {
      return appSourceCopConfig.mandatoryAffixes;
    }

    return [];
  }

  async stripAffixes(name: string): Promise<string> {
    let newName = name;

    let affixes = await this.getAffixes();
    if (affixes) {
      affixes.forEach((affix) => {
        newName = newName.replace(affix + " ", "").replace(affix, "");
      });
    }

    return newName;
  }

  async getIdRanges(): Promise<AppConfigFileIdRanges[] | undefined> {
    let appFileConfig = await this.getAppFileConfig();

    if (appFileConfig !== undefined) {
      return appFileConfig.idRanges;
    }

    return undefined;
  }

  async buildFileName(fileName: string): Promise<string> {
    let affixes = await this.getAffixes();

    if (affixes && affixes[0] !== undefined) {
      return `${affixes[0]} ${fileName.substr(0, 19 - affixes[0].length)}`;
    } else {
      return `${fileName}`;
    }
  }

  async getNextAvailableId(
    objectType: ALRESOURCES.ALObjectTypes
  ): Promise<number> {
    let idRanges = await this.getIdRanges();
    let alFileDetails: ALFileDetail[] = [];

    let workspaceFiles =
      await this._context.alFileService.getFilesFromALWorkspace(
        ALRESOURCES.alFileSearchPattern,
        10000
      );

    if (workspaceFiles.length > 0) {
      await Promise.all(
        workspaceFiles.map(async (file, i, arr) => {
          let alFileDetail =
            await this._context.alFileService.getALDetailsFromFile(file);
          if (alFileDetail !== undefined && alFileDetail.type === objectType) {
            alFileDetails.push(alFileDetail);
          }
        })
      );

      alFileDetails.sort((a, b) => (a.id < b.id ? -1 : 1));

      if (alFileDetails.length > 0) {
        let newId = 0;

        if (idRanges !== undefined) {
          idRanges.forEach((range) => {
            let rangeId = range.from;

            do {
              if (
                alFileDetails.find((file) => file.id === rangeId) === undefined
              ) {
                newId = rangeId;
              }
              rangeId += 1;
            } while (newId === 0 && rangeId <= range.to);
          });
        }

        if (newId > 0) {
          return newId;
        }
      }

      if (idRanges !== undefined) {
        if (idRanges[0].from > 0) {
          return idRanges[0].from;
        }
      }
    }

    return 50000;
  }
}
