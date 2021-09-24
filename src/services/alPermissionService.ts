import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import { FileHelper, TextHelper } from "../helpers";
import * as ALCOMMANDS from "../constants/alCommands";
import * as ALRESOURCES from "../constants/alResources";
import { ObjectTypes } from "../constants/alResources";
import { ALFileDetail } from "./alFileService";

export class ALPermissionService {
  //Class globals
  protected _context: ALDevelopmentContext;
  protected _fileHelper: FileHelper;
  protected _textHelper: TextHelper;

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;
    this._fileHelper = new FileHelper();
    this._textHelper = new TextHelper();

    //Commands
    this._context.vscodeExtensionContext.subscriptions.push(
      vscode.commands.registerCommand(ALCOMMANDS.createPermissionSet, () => {
        this.runCreatePermissionSet();
      })
    );
  }

  async runCreatePermissionSet() {
    if (!this._context.alFileService.withinALWorkspace()) {
      return;
    }
    try {
      let workspaceFiles =
        await this._context.alFileService.getFilesFromALWorkspace(
          ALRESOURCES.alFileSearchPattern,
          1000
        );

      if (workspaceFiles.length > 0) {
        this.createPermissionFile(workspaceFiles);
      }
    } catch (error) {
      if (error instanceof Error) {
        this._context.alDisplayService.showConsole();
        this._context.alDisplayService.displayErrorMessage(error.message);
      }
    }
  }

  async createPermissionFile(files: vscode.Uri[]) {
    let objectFolderUri =
      await this._context.alFileService.createObjectsFolderInALWorkspace();

    let permissionSetFolderUri =
      await this._context.alFileService.createFolderInALWorkspace(
        this._fileHelper.getFileNameFromFile(objectFolderUri),
        ALRESOURCES.permissionSetsFolder
      );

    let content = this._context.alContentService.buildPermissionSetContent(
      await this.getId(),
      await this.getName(),
      await this.getCaption(),
      await this.getPermissionLines(files)
    );

    await this._fileHelper.createUpdateFile(
      permissionSetFolderUri,
      await this.getFileName(),
      Buffer.from(content)
    );
  }

  async getId(): Promise<number> {
    return await this._context.alFileService.getNextAvailableId(
      ObjectTypes.permissionSet
    );
  }

  async getName(): Promise<string> {
    let appConfig = await this._context.alFileService.getAppFileConfig();
    if (appConfig !== undefined) {
      return this._context.alFileService.buildFileName(
        appConfig.name.substr(0, 20)
      );
    }

    return this._context.alFileService.buildFileName(
      ALRESOURCES.defaultPermissionSetName
    );
  }

  async getCaption(): Promise<string> {
    let appConfig = await this._context.alFileService.getAppFileConfig();
    if (appConfig !== undefined) {
      return appConfig.name.substr(0, 20);
    }

    return ALRESOURCES.defaultPermissionSetName;
  }

  async getFileName(): Promise<string> {
    let appConfig = await this._context.alFileService.getAppFileConfig();
    if (appConfig !== undefined) {
      let appName = this._textHelper.stripWhitespace(
        appConfig.name.substr(0, 20)
      );
      return appName + "." + ALRESOURCES.permissionSetFileEnd;
    }

    return (
      ALRESOURCES.defaultPermissionSetFileName +
      "." +
      ALRESOURCES.permissionSetFileEnd
    );
  }

  async getPermissionLines(files: vscode.Uri[]): Promise<string> {
    let permissionLines = "";
    let alFileDetails: ALFileDetail[] = [];

    await Promise.all(
      files.map(async (file, i, arr) => {
        let alFileDetail =
          await this._context.alFileService.getALDetailsFromFile(file);
        if (
          alFileDetail !== undefined &&
          alFileDetail.type !== undefined &&
          new RegExp(ALRESOURCES.permissionObjectTypeRegEx).test(
            alFileDetail.type
          )
        ) {
          alFileDetails.push(alFileDetail);
        }
      })
    );

    alFileDetails.sort((a, b) => (a.priority < b.priority ? -1 : 1));

    alFileDetails.forEach((alFile, i, arr) => {
      let readWriteObject = new RegExp(
        ALRESOURCES.permissionReadWriteObjectTypeRegEx
      ).test(alFile.type!);

      if (readWriteObject) {
        permissionLines += `${alFile.type} ${alFile.fullName} = ${ALRESOURCES.permissionExecute}${ALRESOURCES.permissionNewLine}`;
        permissionLines += `${ALRESOURCES.tabledataObjectType} ${alFile.fullName} = ${ALRESOURCES.permissionTable}`;
      } else {
        permissionLines += `${alFile.type} ${alFile.fullName} = ${ALRESOURCES.permissionExecute}`;
      }

      if (arr.length - 1 !== i) {
        permissionLines += ALRESOURCES.permissionNewLine;
      } else {
        permissionLines += ALRESOURCES.codeLineEnd;
      }
    });

    return permissionLines;
  }
}
