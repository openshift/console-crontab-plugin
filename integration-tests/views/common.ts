import {
  CRONTAB_APIGROUP,
  CRONTAB_APIVERSION,
  CRONTAB_KIND,
  PLUGIN_NAME,
} from "../../src/const";

const CRONTAB_PLUGIN_PULL_SPEC = Cypress.env("CRONTAB_PLUGIN_PULL_SPEC");

export const getNamespacedListPageURL = (testName: string) =>
  `/k8s/ns/${testName}/${CRONTAB_APIGROUP}~${CRONTAB_APIVERSION}~${CRONTAB_KIND}`;

export const installHelmChart = (path: string) => {
  cy.exec(
    `cd ../../console-crontab-plugin && ${path} upgrade -i ${PLUGIN_NAME} charts/console-crontab-plugin -n ${PLUGIN_NAME} --create-namespace --set plugin.image=${CRONTAB_PLUGIN_PULL_SPEC}`
  ).then((result) => {
    result.stderr && cy.log("Error installing helm chart: ", result.stderr);
    result.stdout &&
      cy.log("Successfully installed helm chart: ", result.stdout);
  });
  cy.byTestID("refresh-web-console", { timeout: 300000 }).should("exist");
  cy.reload();
};

export const deleteHelmChart = (path: string) => {
  cy.exec(
    `cd ../../console-crontab-plugin && ${path} uninstall ${PLUGIN_NAME} -n ${PLUGIN_NAME} && oc delete namespaces ${PLUGIN_NAME}`
  ).then((result) => {
    result.stderr && cy.log("Error uninstalling helm chart: ", result.stderr);
    result.stdout &&
      cy.log("Successfully uninstalled helm chart: ", result.stdout);
  });
};

export const isLocalDevEnvironment =
  Cypress.config("baseUrl").includes("localhost");

export const setup = () => {
  if (!isLocalDevEnvironment) {
    console.log("this is not a local env, installing helm and helm chart");

    cy.exec("cd ../../console-crontab-plugin && ./install_helm.sh").then(
      (result) => {
        result.stderr &&
          cy.log("Error installing helm binary: ", result.stderr);
        result.stdout &&
          cy.log(
            'Successfully installed helm binary in "/tmp" directory: ',
            result.stdout
          );

        installHelmChart("/tmp/helm");
      }
    );
  } else {
    console.log("this is a local env, not installing helm and helm chart");
  }
};

export const teardown = () => {
  if (!isLocalDevEnvironment) {
    console.log("this is not a local env, deleting helm chart");

    deleteHelmChart("/tmp/helm");
  } else {
    console.log("this is a local env, not deleting helm chart");
  }
};

export const common = {
  inlineDangerAlert: () => cy.get(".pf-c-alert.pf-m-inline.pf-m-danger"),
  resourceTitleShouldHaveText: (title: string) =>
    cy.byLegacyTestID("resource-title").should("have.text", title),
};
