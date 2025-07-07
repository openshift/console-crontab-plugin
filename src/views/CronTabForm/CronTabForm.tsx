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
  YAMLEditor,
} from "@openshift-console/dynamic-plugin-sdk";
import { useNavigate } from "react-router-dom-v5-compat";
import { useCronTabTranslation } from "@crontab-utils/hooks/useCronTabTranslation";
import { cronTabGroupVersionKind } from "src/utils/utils";
import { CronTabKind } from "@crontab-model/types";
import yaml from "js-yaml";
import { defaultCronTabYamlTemplate } from "src/templates/crontab-yaml";

export const CronTabForm: React.FC = () => {
  const [model] = useK8sModel(cronTabGroupVersionKind);
  const [name, setName] = useState("");
  const [cronSpec, setCronSpec] = useState("");
  const [image, setImage] = useState("");
  const [replicas, setReplicas] = useState<number | "">(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showYaml, setShowYaml] = useState(false);
  const [yamlContent, setYamlContent] = useState<string>(
    defaultCronTabYamlTemplate.trim()
  );
  const navigate = useNavigate();
  const { t } = useCronTabTranslation();
  const [namespace] = useActiveNamespace();

  const onChangeReplicas = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setReplicas(value === "" ? value : +value);
  };
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
        replicas: replicas ? replicas : 0,
      },
    };

    k8sCreate({ model, data })
      .then(() => {
        setLoading(false);
        navigate(`/k8s/ns/${namespace}/stable.example.com~v1~CronTab/${name}`);
      })
      .catch((err) => {
        setLoading(false);
        setError(t("Error creating CronTab: {{err}}", { err: err.toString() }));
      });
  };

  const handleYamlSubmit = () => {
    setLoading(true);
    setError("");
    try {
      const loaded = yaml.load(yamlContent) as Partial<CronTabKind> | undefined;
      if (
        !loaded ||
        !loaded.metadata ||
        !(loaded.metadata.name || loaded.metadata.generateName)
      ) {
        throw new Error(
          t("YAML must include metadata.name or metadata.generateName")
        );
      }
      if (!loaded.spec) {
        throw new Error(t("YAML must include spec"));
      }

      const data: CronTabKind = {
        apiVersion: (loaded.apiVersion as string) || CRONTAB_APIGROUP_VERSION,
        kind: (loaded.kind as string) || CRONTAB_KIND,
        metadata: {
          ...loaded.metadata,
          namespace,
        },
        spec: {
          cronSpec,
          image,
          replicas: replicas ? replicas : 0,
        },
      };

      k8sCreate({ model, data })
        .then(() => {
          setLoading(false);
          navigate(
            `/k8s/ns/${namespace}/${cronTabGroupVersionKind.group}~${cronTabGroupVersionKind.version}~${cronTabGroupVersionKind.kind}`
          );
        })
        .catch((err) => {
          setLoading(false);
          setError(
            t("Error creating CronTab: {{err}}", { err: err.toString() })
          );
        });
    } catch (err) {
      setLoading(false);
      setError(t("Invalid YAML: {{err}}", { err: (err as Error).message }));
    }
  };

  return (
    <PageSection>
      <Title headingLevel="h1" data-test="page-heading">
        {t("Create CronTab")}
      </Title>
      <Button variant="link" onClick={() => setShowYaml(!showYaml)}>
        {showYaml ? t("Form View") : t("YAML Editor")}
      </Button>

      {showYaml ? (
        <>
          <YAMLEditor
            value={yamlContent}
            language="yaml"
            onChange={(_e, val) => setYamlContent(val as string)}
            minHeight="0"
            height="500px"
            options={{
              wordWrap: "on",
              formatOnPaste: true,
            }}
          />
          {error && <Alert variant="danger" title={error} />}
          <ActionGroup>
            <Button
              type="button"
              style={{ marginTop: "2rem", marginRight: "0.5rem" }}
              variant="primary"
              isDisabled={loading}
              onClick={handleYamlSubmit}
              isLoading={loading}
            >
              {t("Create")}
            </Button>
            <Button
              variant="secondary"
              style={{ marginTop: "2rem", marginLeft: "0.5rem" }}
              onClick={() => navigate(-1)}
              isDisabled={loading}
            >
              {t("Cancel")}
            </Button>
          </ActionGroup>
        </>
      ) : (
        <Form>
          <FormGroup label={t("Name")} fieldId="crontab-name" isRequired>
            <TextInput
              id="crontab-name"
              data-test="crontab-name"
              name="name"
              onChange={(_e, value) => setName(value)}
              value={name}
              required
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  {t(
                    "A unique identifier for this CronTab within the project."
                  )}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormGroup
            label={t("CronSpec")}
            fieldId="crontab-cronSpec"
            isRequired
          >
            <TextInput
              id="crontab-cronSpec"
              data-test="crontab-cronSpec"
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
              data-test="crontab-image"
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
          <FormGroup
            label={t("Replicas")}
            fieldId="crontab-replicas"
            isRequired
          >
            <NumberInput
              id="crontab-replicas"
              data-test="crontab-replicas"
              value={replicas}
              onChange={onChangeReplicas}
              onMinus={onReplicasMinus}
              onPlus={onReplicasPlus}
              inputName={t("replicas")}
              inputAriaLabel={t("Number of replicas")}
              minusBtnAriaLabel={t("Decrease replicas")}
              plusBtnAriaLabel={t("Increase replicas")}
              required
              min={0}
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
              data-test="save-changes"
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
      )}
    </PageSection>
  );
};

export default CronTabForm;
