import React from "react";
import { PageSection, Title } from "@patternfly/react-core";

import CronTabForm, { CronTab } from "./CronTabForm";

export const FormPage: React.FC = () => {
  const handleFormSubmit = (cronTab: CronTab) => {
    console.log("Form submitted:", cronTab);
    // k8sCreate
  };
  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Create Form</Title>
        <CronTabForm onSubmit={handleFormSubmit}></CronTabForm>
      </PageSection>
    </>
  );
};

export default FormPage;
