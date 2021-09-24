export const alExtensionId = "ms-dynamics-smb.al";
export const launchJsonPath = ".vscode/launch.json";
export const appJsonName = "app.json";
export const appSourceCopJsonName = "AppSourceCop.json";
export const objectsFolder = "objects";
export const alFileExtensionPattern = "*.al";
export const alFileSearchPattern = "**/*.al";
export const recreateSchemaUpdateMode = "Recreate";

export const objectTypeRegEx =
  /\b(CODEUNIT|PAGE|PAGEEXTENSION|PAGECUSTOMIZATION|DOTNET|ENUM|ENUMEXTENSION|VALUE|QUERY|REPORT|TABLE|TABLEEXTENSION|XMLPORT|PROFILE|CONTROLADDIN|REPORTEXTENSION|INTERFACE|PERMISSIONSET|PERMISSIONSETEXTENSION|ENTITLEMENT)/i;
export const codeLineEnd = ";";
export const wordBoundaryRegEx = /(\w+)/g;
export const quoteBoundayRegEx = /"(.*?)"/g;
export const wordQuoteBoundaryRegEx = /"(.*?)"|(\w+)/g;
export const lastCharacterRegEx = /.$/;

export enum ALObjectTypes {
  table = "table",
  tableData = "tabledata",
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

export const objectTypeInformation: Record<ALObjectTypes, ObjectTypeInfo> = {
  [ALObjectTypes.table]: { priority: 1 },
  [ALObjectTypes.tableData]: { priority: 1 },
  [ALObjectTypes.tableExtension]: { priority: 1 },
  [ALObjectTypes.page]: { priority: 2 },
  [ALObjectTypes.pageExtension]: { priority: 2 },
  [ALObjectTypes.pageCustomization]: { priority: 2 },
  [ALObjectTypes.codeunit]: { priority: 3 },
  [ALObjectTypes.report]: { priority: 4 },
  [ALObjectTypes.reportExtension]: { priority: 4 },
  [ALObjectTypes.xmlport]: { priority: 5 },
  [ALObjectTypes.query]: { priority: 6 },
  [ALObjectTypes.enum]: { priority: 6 },
  [ALObjectTypes.enumExtension]: { priority: 6 },
  [ALObjectTypes.value]: { priority: 7 },
  [ALObjectTypes.profile]: { priority: 8 },
  [ALObjectTypes.controlAddin]: { priority: 9 },
  [ALObjectTypes.interface]: { priority: 10 },
  [ALObjectTypes.permissionSet]: { priority: 11 },
  [ALObjectTypes.permissionSetExtension]: { priority: 11 },
  [ALObjectTypes.entitlement]: { priority: 12 },
  [ALObjectTypes.dotnet]: { priority: 13 },
};
