import * as vscode from "vscode";
import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";

export class ALInformationService {
  //Class globals
  protected _context: ALDevelopmentContext;

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;
  }
}
