import * as React from 'react';

import {
  HorizontalNav,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import CronTabPageTitle from './CronTabDetails/CronTabPageTitle';
import CronTabDetailsPage from './CronTabDetailsPage';
import CronTabYAMLPage from './CronTabYAMLPage';
import { useCronTabTranslation } from '@crontab-utils/hooks/useCronTabTranslation';

type CronTabPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const CronTabNavPage: React.FC<CronTabPageProps> = ({ name, namespace, kind }) => {
  const { t } = useCronTabTranslation();
  const [cronTab, loaded] = useK8sWatchResource<K8sResourceCommon>({
    groupVersionKind: {
      group: 'stable.example.com',
      kind: 'CronTab',
      version: 'v1',
    },
    kind,
    name,
    namespace,
  });

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: CronTabDetailsPage,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: CronTabYAMLPage,
      },
    ],
    [],
  );

  return (
    <>
      <CronTabPageTitle cronTab={cronTab} namespace={namespace} name={name} />
      {loaded ? (
        <HorizontalNav pages={pages} resource={cronTab} />
      ) : (
        <Bullseye>
          <Spinner isSVG size='xl' />
        </Bullseye>
      )}
    </>
  );
};

export default CronTabNavPage;
