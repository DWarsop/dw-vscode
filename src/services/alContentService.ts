import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";
import { DevelopmentContext } from "../contexts/developmentContext";

export class ALContentService {
  //Class globals
  protected _alContext: ALDevelopmentContext;
  protected _devContext: DevelopmentContext;

  constructor(devContext: DevelopmentContext, alContext: ALDevelopmentContext) {
    //Context globals
    this._alContext = alContext;
    this._devContext = devContext;
  }

  buildPermissionSetContent(id: number, name: string, caption: string, permissions: string): string {
    return `permissionset ${id} "${name}"
{
    Caption = '${caption}', Locked = true;
    Assignable = true;

    Permissions =
        ${permissions}
}`;
  }
}
