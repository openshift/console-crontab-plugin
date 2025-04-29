import React, { useState } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
} from "@patternfly/react-core";
// import { k8sCreate } from "@console/internal/module/k8s";

export interface CronTab {
  type: "console.resource/create";
  properties: {
    name: "default";
    model: {
      group: "stable.example.com";
      kind: "CronTab";
      version: "v1";
    };
    component: {
      $codeRef: "FormPage";
    };
    flags: {
      required: ["CRONTAB"];
    };
  };
}

export interface FormPageProps {
  onSubmit?: (cronTab: CronTab) => void;
}

export const CronTabForm: React.FC<FormPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cronTab: CronTab = {
      type: "console.resource/create",
      properties: {
        name: "default",
        model: {
          group: "stable.example.com",
          kind: "CronTab",
          version: "v1",
        },
        component: {
          $codeRef: "FormPage",
        },
        flags: {
          required: ["CRONTAB"],
        },
      },
    };
    console.log("Creating CronTab:", cronTab);
    onSubmit(cronTab);
    // TO ADD LATER: replace console.log with k8sCreate(...) if desired
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup label="Name" fieldId="crontab-name" isRequired>
        <TextInput
          id="crontab-name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
          placeholder="Enter CronTab name"
          isRequired
        />
      </FormGroup>

      <FormGroup label="Schedule" fieldId="crontab-schedule" isRequired>
        <TextInput
          id="crontab-schedule"
          value={schedule || ""}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="e.g., */5 * * * *"
          isRequired
        />
      </FormGroup>

      <FormGroup label="Command" fieldId="crontab-command" isRequired>
        <TextInput
          id="crontab-command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command to run"
          isRequired
        />
      </FormGroup>

      <ActionGroup>
        <Button type="submit" variant="primary">
          Create
        </Button>
      </ActionGroup>
    </Form>
  );
};

export default CronTabForm;
