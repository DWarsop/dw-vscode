export const alExtensionId = "ms-dynamics-smb.al";
export const launchJsonPath = ".vscode/launch.json";
export const appJsonName = "app.json";
export const appSourceCopJsonName = "AppSourceCop.json";
export const objectsFolder = "objects";
export const alFileEnd = ".al";
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
  shorthand: string;
};

export const objectTypeInformation: Record<ALObjectTypes, ObjectTypeInfo> = {
  [ALObjectTypes.table]: { priority: 1, shorthand: "table" },
  [ALObjectTypes.tableData]: { priority: 1, shorthand: "tableData" },
  [ALObjectTypes.tableExtension]: { priority: 1, shorthand: "tableExt" },
  [ALObjectTypes.page]: { priority: 2, shorthand: "page" },
  [ALObjectTypes.pageExtension]: { priority: 2, shorthand: "pageExt" },
  [ALObjectTypes.pageCustomization]: {
    priority: 2,
    shorthand: "pageCustomization",
  },
  [ALObjectTypes.codeunit]: { priority: 3, shorthand: "codeunit" },
  [ALObjectTypes.report]: { priority: 4, shorthand: "report" },
  [ALObjectTypes.reportExtension]: { priority: 4, shorthand: "reportExt" },
  [ALObjectTypes.xmlport]: { priority: 5, shorthand: "xmlport" },
  [ALObjectTypes.query]: { priority: 6, shorthand: "query" },
  [ALObjectTypes.enum]: { priority: 6, shorthand: "enum" },
  [ALObjectTypes.enumExtension]: { priority: 6, shorthand: "enumExt" },
  [ALObjectTypes.value]: { priority: 7, shorthand: "value" },
  [ALObjectTypes.profile]: { priority: 8, shorthand: "profile" },
  [ALObjectTypes.controlAddin]: { priority: 9, shorthand: "controlAddIn" },
  [ALObjectTypes.interface]: { priority: 10, shorthand: "interface" },
  [ALObjectTypes.permissionSet]: { priority: 11, shorthand: "permissionSet" },
  [ALObjectTypes.permissionSetExtension]: {
    priority: 11,
    shorthand: "permissionSetExt",
  },
  [ALObjectTypes.entitlement]: { priority: 12, shorthand: "entitlement" },
  [ALObjectTypes.dotnet]: { priority: 13, shorthand: "dotnet" },
};
