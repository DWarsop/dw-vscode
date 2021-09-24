# DW VS Code

A VS Code extension for my own usage to help my daily development.

## Features

#### DW AL: Debug/Publish:

Performs validation against the launch files `schemaUpdateMode` to ensure data won't be lost without confirmation on publishing an extension. Following confirmation a dropdown of the available debug/publish types is provided. Following selection the associated routine is called.

#### DW AL: Create Permission Set:

Creates a permissionset object with all the suitable workspace AL objects present. Will automatically create both an objects & permissionSets folder to place this in unless they already exist.

#### DW AL: Insert Affix:

Inserts the affix from the AppSourceCop file to the cursor selection. If more than one exists a dropdown is provided to select the correct one.
