import { ALDevelopmentContext } from "../contexts/alDevelopmentContext";

export class ALContentService {
  //Class globals
  protected _context: ALDevelopmentContext;

  constructor(context: ALDevelopmentContext) {
    //Context globals
    this._context = context;
  }

  buildPermissionSetContent(id: number, name: string, caption: string, permissions: string): string {
    return `permissionset ${id} "${name}"
{
    Caption = '${caption}';
    Assignable = true;

    Permissions =
        ${permissions}
}`;
  }
}
