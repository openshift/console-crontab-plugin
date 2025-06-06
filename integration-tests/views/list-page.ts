export const listPage = {
  clickCreateForm: () => {
    cy.byTestID("item-create").click();
  },
  rows: {
    shouldBeLoaded: () => {
      cy.get(`[data-test-rows="resource-row"`).should("be.visible");
    },
    countShouldBe: (count: number) => {
      cy.get(`[data-test-rows="resource-row"`).should("have.length", count);
    },
    clickKebabAction: (resourceName: string, actionName: string) => {
      cy.get(`[data-test-rows="resource-row"]`)
        .contains(resourceName)
        .parents("tr")
        .within(() => {
          cy.byTestID("kebab-button").click();
        });
      cy.byTestActionID(actionName).click();
    },
    shouldExist: (resourceName: string) =>
      cy.get(`[data-test-rows="resource-row"]`).contains(resourceName),
    clickRowByName: (resourceName: string) =>
      cy.get(`a[data-test-id="${resourceName}"]`).click(),
    shouldNotExist: (resourceName: string) =>
      cy.byLegacyTestID(resourceName, { timeout: 90000 }).should("not.exist"),
  },
};
