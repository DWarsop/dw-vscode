import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import { FileHelper, TextHelper } from "../helpers";
import * as ALCOMMANDS from "../constants/alCommands";
import * as ALRESOURCES from "../constants/alResources";
import * as ALPERMISSIONRESOURCES from "../constants/alPermissionResources";
import { ALObjectTypes } from "../constants/alResources";
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
          10000
        );

      if (workspaceFiles.length > 0) {
        await this.createPermissionFile(workspaceFiles);
        this._context.alDisplayService.displayInfoMessage(
          ALPERMISSIONRESOURCES.permissionFileCreated
        );
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
        ALPERMISSIONRESOURCES.permissionSetsFolder
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
      ALObjectTypes.permissionSet
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
      ALPERMISSIONRESOURCES.defaultPermissionSetName
    );
  }

  async getCaption(): Promise<string> {
    let appConfig = await this._context.alFileService.getAppFileConfig();
    if (appConfig !== undefined) {
      return appConfig.name;
    }

    return ALPERMISSIONRESOURCES.defaultPermissionSetName;
  }

  async getFileName(): Promise<string> {
    let objectName = await this.getName();
    objectName = await this._context.alFileService.stripAffixes(objectName);
    objectName = this._textHelper.stripWhitespace(objectName);
    objectName = this._textHelper.toCamelCase(objectName);
    return objectName + "." + ALPERMISSIONRESOURCES.permissionSetFileEnd;
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
          new RegExp(ALPERMISSIONRESOURCES.permissionObjectTypeRegEx).test(
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
        ALPERMISSIONRESOURCES.permissionReadWriteObjectTypeRegEx
      ).test(alFile.type!);

      if (readWriteObject) {
        permissionLines += `${alFile.type} ${alFile.fullName} = ${ALPERMISSIONRESOURCES.permissionExecute}${ALPERMISSIONRESOURCES.permissionNewLine}`;
        permissionLines += `${ALObjectTypes.tableData} ${alFile.fullName} = ${ALPERMISSIONRESOURCES.permissionTable}`;
      } else {
        permissionLines += `${alFile.type} ${alFile.fullName} = ${ALPERMISSIONRESOURCES.permissionExecute}`;
      }

      if (arr.length - 1 !== i) {
        permissionLines += ALPERMISSIONRESOURCES.permissionNewLine;
      } else {
        permissionLines += ALRESOURCES.codeLineEnd;
      }
    });

    return permissionLines;
  }
}
