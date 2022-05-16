import * as vscode from "vscode";
import { DevelopmentContext } from "../contexts/developmentContext";
import { DevOpsDevelopmentContext } from "../contexts/devOpsDevelopmentContext";
import * as DEVOPSCOMMANDS from "../constants/devOpsCommands";
import * as GLOBALSTATERESOURCES from "../constants/globalStateResources";
import * as DEVOPSDISPLAYRESOURCES from "../constants/devOpsDisplayResources";
import axios, { AxiosResponse } from "axios";

export class DevOpsConnectionService {
  //Class globals
  protected _devOpsContext: DevOpsDevelopmentContext;
  protected _devContext: DevelopmentContext;

  constructor(devContext: DevelopmentContext, devOpsContext: DevOpsDevelopmentContext) {
    //Context globals
    this._devOpsContext = devOpsContext;
    this._devContext = devContext;

    //Commands
    this._devOpsContext.vscodeExtensionContext.subscriptions.push(
      vscode.commands.registerCommand(DEVOPSCOMMANDS.authorize, () => {
        this.requestStorePAT();
      }),

      vscode.commands.registerCommand(DEVOPSCOMMANDS.clearAuthorization, () => {
        this.clearStoredAuthorization();
      }),

      vscode.commands.registerCommand(DEVOPSCOMMANDS.cloneRepo, () => {
        this.cloneRepository();
      }),

      vscode.commands.registerCommand(DEVOPSCOMMANDS.openProject, () => {
        this.openProjectInBrowser();
      })
    );
  }

  retrieveStoredBaseUri(): string | undefined {
    return this._devOpsContext.vscodeExtensionContext.globalState.get(GLOBALSTATERESOURCES.devOpsBaseUri);
  }

  retrieveStoredPAT(): string | undefined {
    return this._devOpsContext.vscodeExtensionContext.globalState.get(GLOBALSTATERESOURCES.devOpsPAT);
  }

  async requestStorePAT(): Promise<boolean> {
    let baseUri = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      prompt: DEVOPSDISPLAYRESOURCES.baseUriEntryPrompt,
    });

    if (!baseUri) {
      return false;
    }

    if (!baseUri.endsWith("/")) {
      baseUri = `${baseUri}/`;
    }

    let accessToken = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      password: true,
      prompt: DEVOPSDISPLAYRESOURCES.tokenEntryPrompt,
    });

    if (!accessToken) {
      return false;
    }

    const response = await this.getRepositoryListFromDevOps(baseUri, accessToken, 1);

    if (response.status !== 200) {
      this._devContext.displayService.displayErrorMessage(DEVOPSDISPLAYRESOURCES.connectionFailed);
      return false;
    }

    await this._devOpsContext.vscodeExtensionContext.globalState.update(GLOBALSTATERESOURCES.devOpsBaseUri, baseUri);
    await this._devOpsContext.vscodeExtensionContext.globalState.update(GLOBALSTATERESOURCES.devOpsPAT, accessToken);

    this._devContext.displayService.displayInfoMessage(DEVOPSDISPLAYRESOURCES.authorizationStored);

    return true;
  }

  async clearStoredAuthorization() {
    await this._devOpsContext.vscodeExtensionContext.globalState.update(GLOBALSTATERESOURCES.devOpsBaseUri, undefined);
    await this._devOpsContext.vscodeExtensionContext.globalState.update(GLOBALSTATERESOURCES.devOpsPAT, undefined);

    this._devContext.displayService.displayInfoMessage(DEVOPSDISPLAYRESOURCES.authorizationCleared);
  }

  async getRepositoryListFromDevOps(baseUri: string, accessToken: string, recordCount: number): Promise<AxiosResponse> {
    return axios.get(`${baseUri}/_apis/git/repositories?$top=${recordCount}`, {
      responseType: "json",
      auth: {
        username: "",
        password: accessToken,
      },
    });
  }

  async getProjectListFromDevOps(baseUri: string, accessToken: string, recordCount: number): Promise<AxiosResponse> {
    return axios.get(`${baseUri}/_apis/projects?$top=${recordCount}`, {
      responseType: "json",
      auth: {
        username: "",
        password: accessToken,
      },
    });
  }

  async getProjectFromDevOps(baseUri: string, accessToken: string, projectId: string): Promise<AxiosResponse> {
    return axios.get(`${baseUri}/_apis/projects/${projectId}`, {
      responseType: "json",
      auth: {
        username: "",
        password: accessToken,
      },
    });
  }

  async cloneRepository() {
    let baseUri = this.retrieveStoredBaseUri();
    let accessToken = this.retrieveStoredPAT();

    if (!baseUri || !accessToken) {
      this._devContext.displayService.displayErrorMessage(DEVOPSDISPLAYRESOURCES.missingDetails);
      return;
    }

    const response = await vscode.window.withProgress(
      { cancellable: true, location: vscode.ProgressLocation.Notification },
      async (progress) => {
        progress.report({
          message: DEVOPSDISPLAYRESOURCES.retrievingRepositories,
        });

        return this.getRepositoryListFromDevOps(baseUri!, accessToken!, 1000);
      }
    );

    if (response.status !== 200) {
      this._devContext.displayService.displayErrorMessage(DEVOPSDISPLAYRESOURCES.connectionFailed);
      return false;
    }

    let repositories: Array<{ label: string; url: string }> = [];
    response.data.value.forEach((repo: any) => {
      repositories = [...repositories, { label: repo.name, url: repo.remoteUrl }];
    });

    repositories.sort((a, b) => a.label.localeCompare(b.label));

    const selectedRepo = await vscode.window.showQuickPick(repositories, {
      canPickMany: false,
      placeHolder: DEVOPSDISPLAYRESOURCES.selectRepoToClone,
    });

    if (!selectedRepo) {
      return;
    }

    this._devContext.gitExtensionService.cloneRepository(selectedRepo.url);
  }

  async openProjectInBrowser() {
    let baseUri = this.retrieveStoredBaseUri();
    let accessToken = this.retrieveStoredPAT();

    if (!baseUri || !accessToken) {
      this._devContext.displayService.displayErrorMessage(DEVOPSDISPLAYRESOURCES.missingDetails);
      return;
    }

    const response = await vscode.window.withProgress(
      { cancellable: true, location: vscode.ProgressLocation.Notification },
      async (progress) => {
        progress.report({
          message: DEVOPSDISPLAYRESOURCES.retrievingProjects,
        });

        return this.getProjectListFromDevOps(baseUri!, accessToken!, 1000);
      }
    );

    if (response.status !== 200) {
      this._devContext.displayService.displayErrorMessage(DEVOPSDISPLAYRESOURCES.connectionFailed);
      return false;
    }

    let projects: Array<{ label: string; id: string }> = [];
    response.data.value.forEach((project: any) => {
      projects = [...projects, { label: project.name, id: project.id }];
    });

    if (!projects) {
      return;
    }

    projects.sort((a, b) => a.label.localeCompare(b.label));

    const selectedProject = await vscode.window.showQuickPick(projects, {
      canPickMany: false,
      placeHolder: DEVOPSDISPLAYRESOURCES.selectProjectToOpen,
    });

    if (!selectedProject) {
      return;
    }

    const projectResponse = await vscode.window.withProgress(
      { cancellable: true, location: vscode.ProgressLocation.Notification },
      async (progress) => {
        progress.report({
          message: DEVOPSDISPLAYRESOURCES.retrievingSelectedProject,
        });

        return this.getProjectFromDevOps(baseUri!, accessToken!, selectedProject.id);
      }
    );

    if (
      projectResponse.status !== 200 ||
      !projectResponse.data._links.web.href ||
      projectResponse.data._links.web.href === ""
    ) {
      this._devContext.displayService.displayErrorMessage(DEVOPSDISPLAYRESOURCES.connectionFailed);
      return false;
    }

    vscode.env.openExternal(vscode.Uri.parse(projectResponse.data._links.web.href));
  }
}
