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
  NumberInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { CRONTAB_APIGROUP_VERSION, CRONTAB_KIND } from "src/const";
import {
  useK8sModel,
  k8sCreate,
  useActiveNamespace,
} from "@openshift-console/dynamic-plugin-sdk";
import { useNavigate } from "react-router-dom-v5-compat";
import { useCronTabTranslation } from "@crontab-utils/hooks/useCronTabTranslation";
import { cronTabGroupVersionKind } from "src/utils/utils";
import { CronTabKind } from "@crontab-model/types";

export const CronTabForm: React.FC = () => {
  const [model] = useK8sModel(cronTabGroupVersionKind);
  const [name, setName] = useState("");
  const [cronSpec, setCronSpec] = useState("");
  const [image, setImage] = useState("");
  const [replicas, setReplicas] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useCronTabTranslation();
  const [namespace] = useActiveNamespace();

  const onReplicasMinus = () => {
    setReplicas((currentReplicas) => (currentReplicas || 0) - 1);
  };
  const onReplicasPlus = () => {
    setReplicas((currentReplicas) => (currentReplicas || 0) + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data: CronTabKind = {
      apiVersion: CRONTAB_APIGROUP_VERSION,
      kind: CRONTAB_KIND,
      metadata: {
        name,
        namespace,
      },
      spec: {
        cronSpec,
        image,
        replicas,
      },
    };

    k8sCreate({ model, data })
      .then(() => {
        setLoading(false);
        navigate(`/k8s/ns/${namespace}/stable.example.com~v1~CronTab`);
      })
      .catch((err) => {
        setLoading(false);
        setError(t("Error creating CronTab: {{err}}", { err: err.toString() }));
      });
  };
  return (
    <PageSection>
      <Title headingLevel="h1">{t("Create CronTab")}</Title>
      <Form>
        <FormGroup label={t("Name")} fieldId="crontab-name" isRequired>
          <TextInput
            id="crontab-name"
            name="name"
            onChange={(_e, value) => setName(value)}
            value={name}
            required
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                {t("A unique identifier for this CronTab within the project.")}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
        <FormGroup label={t("CronSpec")} fieldId="crontab-cronSpec" isRequired>
          <TextInput
            id="crontab-cronSpec"
            value={cronSpec || ""}
            onChange={(_e, value) => setCronSpec(value)}
            required
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                {t(
                  "Defines the schedule on which the job will run (e.g., */5 * * * *)."
                )}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
        <FormGroup label={t("Image")} fieldId="crontab-image" isRequired>
          <TextInput
            id="crontab-image"
            value={image || ""}
            onChange={(_e, value) => setImage(value)}
            required
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                {t(
                  "Specifies the container image to be executed by the CronTab."
                )}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
        <FormGroup label={t("Replicas")} fieldId="crontab-replicas" isRequired>
          <NumberInput
            id="crontab-replicas"
            value={replicas}
            onMinus={onReplicasMinus}
            onPlus={onReplicasPlus}
            inputName="replicas"
            inputAriaLabel="number of replicas"
            minusBtnAriaLabel="decrease replicas"
            plusBtnAriaLabel="increase replicas"
            required
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                {t("The desired number of instances of this CronTab to run.")}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
        {error && <Alert variant="danger" title={error} />}
        <ActionGroup>
          <Button
            type="button"
            variant="primary"
            isDisabled={loading || !name || !cronSpec || !image}
            onClick={handleSubmit}
            isLoading={loading}
          >
            {t("Create")}
          </Button>
          <Button
            variant="secondary"
            isDisabled={loading}
            onClick={() => navigate(-1)}
          >
            {t("Cancel")}
          </Button>
        </ActionGroup>
      </Form>
    </PageSection>
  );
};

export default CronTabForm;
