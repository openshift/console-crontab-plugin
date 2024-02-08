export const detailsPage = {
  clickEditAnnotations: () => cy.byTestID("edit-annotations").click(),
  clickEditLabels: () =>
    cy.byTestID("Labels-details-item__edit-button").click(),
  detailsItemValueShouldContain: (item: string, value: string) => {
    cy.get(`[data-test-selector="details-item-value__${item}"]`).should(
      "contain",
      value
    );
  },
  clickPageActionFromDropdown: (actionID: string) => {
    cy.byLegacyTestID("actions-menu-button").click();
    cy.byTestActionID(actionID).click();
  },
};
