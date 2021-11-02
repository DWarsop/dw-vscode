import * as vscode from "vscode";

export class TextHelper {
  stripWhitespace(value: string): string {
    return value.replace(/(\s)/, "");
  }

  stripInvalidChars(value: string): string {
    return value.replace(/([^\s\w])/g, "");
  }

  toCamelCase(value: string): string {
    return value.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) {
        return "";
      }
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }
}
