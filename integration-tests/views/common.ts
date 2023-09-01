import {
  CRONTAB_APIGROUP,
  CRONTAB_APIVERSION,
  CRONTAB_KIND,
  PLUGIN_NAME,
} from "../../src/const";

export const getNamespacedListPageURL = (testName: string) =>
  `/k8s/ns/${testName}/${CRONTAB_APIGROUP}~${CRONTAB_APIVERSION}~${CRONTAB_KIND}`;

export const installHelmChart = (path: string) => {
  cy.exec(
    `cd ../../crontab-plugin && ${path} upgrade -i ${PLUGIN_NAME} charts/crontab-plugin -n ${PLUGIN_NAME} --create-namespace --set plugin.image=Cypress.env("CRONTAB_PLUGIN_PULL_SPEC")`,
    {
      failOnNonZeroExit: false,
    }
  )
    .byTestID("refresh-web-console", { timeout: 300000 })
    .should("exist")
    .then((result) => {
      cy.reload();
      cy.log("Error installing helm chart: ", result.stderr);
      cy.log("Successfully installed helm chart: ", result.stdout);
    });
};

export const deleteHelmChart = (path: string) => {
  cy.exec(
    `cd ../../crontab-plugin && ${path} uninstall ${PLUGIN_NAME} -n ${PLUGIN_NAME} && oc delete namespaces ${PLUGIN_NAME}`,
    {
      failOnNonZeroExit: false,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).then((result: any) => {
    cy.log("Error uninstalling helm chart: ", result.stderr);
    cy.log("Successfully uninstalled helm chart: ", result.stdout);
  });
};

export const isLocalDevEnvironment =
  Cypress.config("baseUrl").includes("localhost");

export const setup = () => {
  if (!isLocalDevEnvironment) {
    console.log("this is not a local env, installing helm and helm chart");

    cy.exec("cd ../../crontab-plugin && ./install_helm.sh", {
      failOnNonZeroExit: false,
    }).then((result) => {
      cy.log("Error installing helm binary: ", result.stderr);
      cy.log(
        'Successfully installed helm binary in "/tmp" directory: ',
        result.stdout
      );

      installHelmChart("/tmp/helm");
    });
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
