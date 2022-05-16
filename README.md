# DW VS Code

A VS Code extension for my own usage to help my daily development.

## AL Features

`DW AL: Debug/Publish:`
Performs validation against the launch files `schemaUpdateMode` to ensure data won't be lost without confirmation on publishing an extension. Following confirmation a dropdown of the available debug/publish types is provided. Following selection the associated routine is called.

`DW AL: Create Permission Set:`
Creates a permissionset object with all the suitable workspace AL objects present. Will automatically create both an objects & permissionSets folder to place this in unless they already exist.

`DW AL: Insert Affix:`
Inserts the affix from the AppSourceCop file to the cursor selection. If more than one exists a dropdown is provided to select the correct one.

`DW AL: Rename Files:`
Renames all suitable workspace AL files present to match the AL Language naming requirements.

## DevOps Features

`DW DevOps: Authorize:`
Allows authorization with DevOps via a user generated PAT token, which is then stored to authorize further requests.

`DW DevOps: Clear Authorization:`
Removes any stored authorization details used to authenticate with DevOps.

`DW DevOps: Clone DevOps Repository:`
Provides a dropdown of all the accessible Git repositories against the authorized DevOps account. On selection the standard VSCode Git functionality takes over to clone the repository down to the local machine.

`DW DevOps: Open DevOps Project:`
Provides a dropdown of all the accessible projects against the authorized DevOps account. On selection the selected project url is navigated to via the systems web browser.
