// import React, { useState } from "react";
// import {
//   Form,
//   FormGroup,
//   TextInput,
//   Button,
//   ActionGroup,
// } from "@patternfly/react-core";

// const CrontabForm: React.FC = () => {
//   // State for form fields.
//   const [name, setName] = useState("");
//   const [schedule, setSchedule] = useState("");
//   const [command, setCommand] = useState("");

//   // Handle form submission.
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     // Construct a simple CronTab resource object.
//     const newCronTab = {
//       apiVersion: "stable.example.com/v1",
//       kind: "CronTab",
//       metadata: {
//         name: name.trim(),
//       },
//       spec: {
//         schedule: schedule.trim(),
//         command: command.trim(),
//       },
//     };

//     // Log the resource, replace this with your create logic as needed.
//     console.log("Creating CronTab resource:", newCronTab);
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h2>Create CronTab</h2>
//       <Form onSubmit={handleSubmit}>
//         <FormGroup label="Name" fieldId="crontab-name">
//           <TextInput
//             id="crontab-name"
//             value={name}
//             placeholder="Enter CronTab name"
//           />
//         </FormGroup>
//         <FormGroup label="Schedule" fieldId="crontab-schedule">
//           <TextInput
//             id="crontab-schedule"
//             value={schedule}
//             placeholder="e.g., */5 * * * *"
//           />
//         </FormGroup>
//         <FormGroup label="Command" fieldId="crontab-command">
//           <TextInput
//             id="crontab-command"
//             value={command}
//             placeholder="Enter command to run"
//           />
//         </FormGroup>
//         <ActionGroup>
//           <Button type="submit" variant="primary">
//             Create
//           </Button>
//         </ActionGroup>
//       </Form>
//     </div>
//   );
// };

// export default CrontabForm;
// CrontabForm.tsx
import React, { useState } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  ActionGroup,
} from "@patternfly/react-core";

const CrontabForm: React.FC = () => {
  const [name] = useState("");
  const [schedule] = useState("");
  const [command] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCronTab = {
      apiVersion: "stable.example.com/v1",
      kind: "CronTab",
      metadata: { name: name.trim() },
      spec: {
        schedule: schedule.trim(),
        command: command.trim(),
      },
    };
    console.log("Creating CronTab:", newCronTab);
    // Here you could call your API or k8s create hook instead of logging.
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create CronTab</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup label="Name" fieldId="crontab-name">
          <TextInput
            id="crontab-name"
            value={name}
            placeholder="Enter CronTab name"
          />
        </FormGroup>
        <FormGroup label="Schedule" fieldId="crontab-schedule">
          <TextInput
            id="crontab-schedule"
            value={schedule}
            placeholder="e.g., */5 * * * *"
          />
        </FormGroup>
        <FormGroup label="Command" fieldId="crontab-command">
          <TextInput
            id="crontab-command"
            value={command}
            placeholder="Enter command to run"
          />
        </FormGroup>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Create
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
};

export default CrontabForm;
