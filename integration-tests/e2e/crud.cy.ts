import { PLUGIN_NAME } from "../../src/const";
import { checkErrors, testName } from "../support";
import { common, setup, teardown } from "../views/common";
import { listPage } from "../views/list-page";
import { modal } from "../views/modal";
import { labelsModal } from "../views/labels-modal";
import { annotationModal } from "../views/annotations-modal";
import { detailsPage } from "../views/details-page";
import { nav } from "../views/nav";
import { guidedTour } from "../views/guided-tour";

const cronTabName = "my-new-cron-object";
const cronSpecValue = "* * * * */5";
const imageValue = "my-awesome-cron-image";
const replicasValue = 1;
const testLabel = "key1=value1";
const annotations = [
  {
    key: "ALPHA_Num_KEY-1",
    value: "ALPHA_Num_VALUE-1",
  },
];

describe(`${PLUGIN_NAME}`, () => {
  before(() => {
    cy.login();
    guidedTour.close();
    setup();
    cy.createProject(testName);
  });

  afterEach(() => {
    checkErrors();
  });

  after(() => {
    cy.deleteProject(testName);
    teardown();
    cy.logout();
  });

  it("renders the CronTabs list page", () => {
    nav.sidenav.clickNavLink(["Workloads", "CronTabs"]);
    common.resourceTitleShouldHaveText("CronTabs");
    cy.byTestID("item-create").should("exist");
    listPage.rows.countShouldBe(0);
  });

  it("creates, displays, updates, and deletes a CronTab", () => {
    cy.log("Create CronTab");
    nav.sidenav.clickNavLink(["Workloads", "CronTabs"]);
    common.resourceTitleShouldHaveText("CronTabs");
    listPage.clickCreateForm();
    cy.byTestID("page-heading").should("contain", "Create CronTab");
    cy.log("Filling CronTab form");
    cy.byTestID("crontab-name").type(cronTabName);
    cy.byTestID("crontab-cronSpec").type(cronSpecValue);
    cy.byTestID("crontab-image").type(imageValue);
    cy.byTestID("crontab-replicas").find("input").clear();
    cy.byTestID("crontab-replicas").find("input").type(`${replicasValue}`);
    cy.byTestID("save-changes").click();
    common.inlineDangerAlert().should("not.exist");
    common.resourceTitleShouldHaveText(cronTabName);

    cy.log("Edit labels");
    detailsPage.detailsItemValueShouldContain("Labels", "No labels");
    cy.byTestID("Labels-details-item__edit-button").click();
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit labels");
    modal.submitShouldBeEnabled();
    labelsModal.countShouldBe(0);
    labelsModal.inputLabel(testLabel);
    labelsModal.countShouldBe(1);
    labelsModal.labelEquals(0, testLabel);
    modal.submit();
    modal.shouldBeClosed();
    detailsPage.detailsItemValueShouldContain("Labels", testLabel);
    detailsPage.clickEditLabels();
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit labels");
    labelsModal.countShouldBe(1);
    labelsModal.labelEquals(0, testLabel);
    modal.cancel();

    cy.log("Edit annotations");
    detailsPage.detailsItemValueShouldContain("Annotations", "0 annotations");
    cy.byTestID("edit-annotations").click();
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit annotations");
    annotationModal.countShouldBe(1);
    annotations.forEach(({ key, value }, index) => {
      annotationModal.annotationEquals(index, "", "");
      annotationModal.inputAnnotation(index, key, value);
      annotationModal.annotationEquals(index, key, value);
    });
    annotationModal.countShouldBe(annotations.length);
    modal.submit();
    modal.shouldBeClosed();
    detailsPage.detailsItemValueShouldContain("Annotations", "1 annotation");
    detailsPage.clickEditAnnotations();
    modal.shouldBeOpened();
    modal.modalTitleShouldContain("Edit annotations");
    annotationModal.countShouldBe(annotations.length);
    annotations.forEach(({ key, value }, index) => {
      annotationModal.annotationEquals(index, key, value);
    });
    modal.cancel();

    cy.log("Verify console.resource/details-item extensions are present");
    cy.byTestSelector("details-item-label__CronSpec").should(
      "include.text",
      "CronSpec"
    );
    cy.byTestSelector("details-item-value__CronSpec").should(
      "include.text",
      "* * * * */5"
    );
    cy.byTestSelector("details-item-label__Image").should(
      "include.text",
      "Image"
    );
    cy.byTestSelector("details-item-value__Image").should(
      "include.text",
      "my-awesome-cron-image"
    );
    cy.byTestSelector("details-item-label__Replicas").should(
      "include.text",
      "Replicas"
    );
    cy.byTestSelector("details-item-value__Replicas").should(
      "include.text",
      "1"
    );

    cy.log("Delete CronTab");
    detailsPage.clickPageActionFromDropdown("Delete CronTab");
    modal.shouldBeOpened();
    modal.submitShouldBeEnabled();
    modal.submit();
    modal.shouldBeClosed();
    listPage.rows.shouldNotExist(cronTabName);
  });
});
