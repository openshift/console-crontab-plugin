import React, { useState } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  PageSection,
  Title,
  Alert,
  Spinner,
} from "@patternfly/react-core";
import { CRONTAB_APIGROUP, CRONTAB_APIVERSION, CRONTAB_KIND } from "src/const";
import {
  useK8sModel,
  k8sCreate,
  useActiveNamespace,
} from "@openshift-console/dynamic-plugin-sdk";
import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import { useCronTabTranslation } from "@crontab-utils/hooks/useCronTabTranslation";

export const CronTabForm: React.FC = () => {
  const [model] = useK8sModel({
    group: CRONTAB_APIGROUP,
    version: CRONTAB_APIVERSION,
    kind: CRONTAB_KIND,
  });
  const [name, setName] = useState("");
  const [cronSpec, setCronSpec] = useState("");
  const [image, setImage] = useState("");
  const [replicas, setReplicas] = useState<number | string>(1); // Initialize as 1 or an empty string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  const navigate = useNavigate();
  const { t } = useCronTabTranslation();
  const [activeNamespace] = useActiveNamespace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      apiVersion: "stable.example.com/v1",
      kind: CRONTAB_KIND,
      metadata: {
        name,
        namespace,
      },
      spec: {
        cronSpec,
        image,
        replicas: parseInt(replicas as string, 10),
      },
    };

    k8sCreate({ model, data })
      .then(() => {
        setLoading(false);
       navigate(`/k8s/ns/${namespace}/${CRONTAB_API_GROUP}~${CRONTAB_API_VERSION}~${CRONTAB_KIND}`);
      })
      .catch((err) => {
        setLoading(false);
        setError(`Error creating CronTab: ${err.message}`);
      });
  };
  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Create Form</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup label="Name" fieldId="crontab-name" isRequired>
            <TextInput
              id="crontab-name"
              name="name"
              onChange={(e) => setName((e.target as HTMLInputElement).value)}
              value={name || ""}
              placeholder="Enter CronTab name"
              isRequired
            />
          </FormGroup>

          <FormGroup label="CronSpec" fieldId="crontab-cronSpec" isRequired>
            <TextInput
              id="crontab-cronSpec"
              value={cronSpec || ""}
              onChange={(e) =>
                setCronSpec((e.target as HTMLInputElement).value)
              }
              placeholder="e.g., */5 * * * *"
              isRequired
            />
          </FormGroup>

          <FormGroup label="Image" fieldId="crontab-image" isRequired>
            <TextInput
              id="crontab-image"
              value={image || ""}
              onChange={(e) => setImage((e.target as HTMLInputElement).value)}
              placeholder="Enter image name"
              isRequired
            />
          </FormGroup>

          <FormGroup label="Replicas" fieldId="crontab-replicas" isRequired>
            <TextInput
              type="number"
              id="crontab-replicas"
              value={replicas}
              onChange={(e) =>
                setReplicas((e.target as HTMLInputElement).value)
              }
              placeholder="Enter number of replicas"
              isRequired
            />
          </FormGroup>
          {error && <Alert variant="danger" title={error} />}

          <ActionGroup>
            <Button
              type="button"
              variant="primary"
              isDisabled={loading}
              onClick={(e) => handleSubmit(e)}
            >
              {loading && <Spinner size="sm" className="pf-u-mr-sm" />}
              {t("console-app~Create")}
            </Button>
            <Button
              variant="secondary"
              isDisabled={loading}
              onClick={(e) =>
                navigate(-1)
              }
            >
              {t("console-app~Cancel")}
            </Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};

export default CronTabForm;
