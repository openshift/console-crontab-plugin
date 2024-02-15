export const labelsModal = {
  getLabels: () => cy.get(".tag-item-content"),
  getLabel: (index: number) => labelsModal.getLabels().eq(index),
  countShouldBe: (count: number) =>
    labelsModal.getLabels().should("have.length", count),
  inputLabel: (value: string) =>
    cy.byTestID("tags-input").type(`${value}{enter}`),
  labelEquals: (index: number, value: string) =>
    labelsModal.getLabel(index).should("have.text", value),
};
