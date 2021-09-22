export const alExtensionId = "ms-dynamics-smb.al";
export const missingWorkspaceErr =
  "Workspace could not be found. Please open a file within the workspace you would like to use.";
export const launchJsonPath = ".vscode/launch.json";
export const appJsonName = "app.json";
export const appSourceCopJsonName = "AppSourceCop.json";
export const objectsFolder = "objects";
export const permissionSetsFolder = "permissionSets";
export const defaultPermissionSetFileName = "permission";
export const permissionSetFileEnd = "permissionSet.al";
export const defaultPermissionSetName = "Permission";
export const tabledataObjectType = "tabledata";
export const alFileExtensionPattern = "*.al";
export const alFileSearchPattern = "**/*.al";
export const continueAction = "Continue";
export const configurationsAction = "View Configurations";
export const recreateSchemaUpdateMode = "Recreate";
export const schemaUpdateMethodQst =
  "One or more of your launch configurations is set to 'Recreate' and data could be lost on publishing if you proceed!";

export const objectTypeRegEx =
  /\b(CODEUNIT|PAGE|PAGEEXTENSION|PAGECUSTOMIZATION|DOTNET|ENUM|ENUMEXTENSION|VALUE|QUERY|REPORT|TABLE|TABLEEXTENSION|XMLPORT|PROFILE|CONTROLADDIN|REPORTEXTENSION|INTERFACE|PERMISSIONSET|PERMISSIONSETEXTENSION|ENTITLEMENT)/i;

export enum ObjectTypes {
  table = "table",
  tableExtension = "tableextension",
  page = "page",
  pageExtension = "pageextension",
  pageCustomization = "pagecustomization",
  codeunit = "codeunit",
  report = "report",
  reportExtension = "reportextension",
  xmlport = "xmlport",
  query = "query",
  enum = "enum",
  enumExtension = "enumextension",
  value = "value",
  profile = "profile",
  controlAddin = "controladdin",
  interface = "interface",
  permissionSet = "permissionset",
  permissionSetExtension = "permissionsetextension",
  entitlement = "entitlement",
  dotnet = "dotnet",
}

type ObjectTypeInfo = {
  priority: number;
};

export const objectTypeInformation: Record<ObjectTypes, ObjectTypeInfo> = {
  [ObjectTypes.table]: { priority: 1 },
  [ObjectTypes.tableExtension]: { priority: 1 },
  [ObjectTypes.page]: { priority: 2 },
  [ObjectTypes.pageExtension]: { priority: 2 },
  [ObjectTypes.pageCustomization]: { priority: 2 },
  [ObjectTypes.codeunit]: { priority: 3 },
  [ObjectTypes.report]: { priority: 4 },
  [ObjectTypes.reportExtension]: { priority: 4 },
  [ObjectTypes.xmlport]: { priority: 5 },
  [ObjectTypes.query]: { priority: 6 },
  [ObjectTypes.enum]: { priority: 6 },
  [ObjectTypes.enumExtension]: { priority: 6 },
  [ObjectTypes.value]: { priority: 7 },
  [ObjectTypes.profile]: { priority: 8 },
  [ObjectTypes.controlAddin]: { priority: 9 },
  [ObjectTypes.interface]: { priority: 10 },
  [ObjectTypes.permissionSet]: { priority: 11 },
  [ObjectTypes.permissionSetExtension]: { priority: 11 },
  [ObjectTypes.entitlement]: { priority: 12 },
  [ObjectTypes.dotnet]: { priority: 13 },
};

export const permissionObjectTypeRegEx =
  /\b(CODEUNIT|PAGE|TABLE|REPORT|XMLPORT)/i;

export const permissionReadWriteObjectTypeRegEx = /\b(TABLE)/i;
export const permissionNewLine = ",\n\t\t";
export const permissionTable = "rimd";
export const permissionExecute = "x";
export const codeLineEnd = ";";
export const wordBoundaryRegEx = /(\w+)/g;
export const quoteBoundayRegEx = /"(.*?)"/g;
export const wordQuoteBoundaryRegEx = /"(.*?)"|(\w+)/g;
export const lastCharacterRegEx = /.$/;
