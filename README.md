# DW VS Code

A VS Code extension for my own usage to help my daily development.

## Features

#### DW AL: Publish:

Performs validation against the launch files `schemaUpdateMode` to ensure data won't be lost without confimration on publishing an extension. Following confimration the standard `[AL: Publish]` routine is called.

#### DW AL: Create Permission Set:

Creates a permissionset object with all the suitable workspace AL objects present. Will automatically create both an objects & permissionSets folder to place this in unless they already exist.
