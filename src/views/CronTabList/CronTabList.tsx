import React from 'react';
import { CronTabModel } from '@crontab-model/CronTabModel';
import { CronTabKind } from '@crontab-model/CronTabModel';
import { modelToGroupVersionKind, modelToRef } from '@crontab-utils/utils';
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  Timestamp,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

import CronTabRowActions from './CronTabRowActions';


type CronTabListProps = {
  namespace: string;
};

const CronTabList: React.FC<CronTabListProps> = ({ namespace }) => {
  const [cronTabs, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'stable.example.com',
      kind: 'CronTab',
      version: 'v1',
    },
    namespaced: true,
    namespace,
  });
  // const { t } = useTranslation();
  const columns = useCronTabColumns();
  const [data, filteredData, onFilterChange] = useListPageFilter(cronTabs);

  return (
    <>
      <ListPageHeader title={'CronTab'}>
        <ListPageCreate groupVersionKind={modelToRef(CronTabModel)}>Create CronTab</ListPageCreate>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<K8sResourceCommon>
          data={filteredData}
          unfilteredData={cronTabs}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={cronTabListRow}
        />
      </ListPageBody>
    </>
  );
};

const cronTabListRow: React.FC<RowProps<CronTabKind>> = ({ obj, activeColumnIDs }) => {
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink
          groupVersionKind={modelToGroupVersionKind(CronTabModel)}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData id="cronspec" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        {obj.spec.cronSpec}
      </TableData>
      <TableData id="image" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        {obj.spec.image}
      </TableData>
      <TableData id="replicas" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        {obj.spec.replicas || ''}
      </TableData>
      <TableData id="created" activeColumnIDs={activeColumnIDs} className="pf-m-width-15">
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
      </TableData>
      <TableData
        id="actions"
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      >
        <CronTabRowActions obj={obj} />
      </TableData>
    </>
  );
};

const useCronTabColumns = () => {
  const columns: TableColumn<K8sResourceCommon>[] = React.useMemo(
    () => [
      {
        title: 'Name',
        id: 'name',
        transforms: [sortable],
        sort: 'metadata.name',
        props: { className: 'pf-m-width-15' },
      },
      {
        title: 'Namespace',
        id: 'namespace',
        transforms: [sortable],
        sort: 'metadata.namespace',
        props: { className: 'pf-m-width-15' },
      },
      {
        title: 'CronSpec',
        id: 'cronspec',
        transforms: [sortable],
        sort: 'spec.cronSpec',
        props: { className: 'pf-m-width-15' },
      },
      {
        title: 'Image',
        id: 'image',
        transforms: [sortable],
        sort: 'spec.image',
        props: { className: 'pf-m-width-15' },
      },
      {
        title: 'Replicas',
        id: 'replicas',
        transforms: [sortable],
        sort: 'spec.replicas',
        props: { className: 'pf-m-width-15' },
      },
      {
        title: 'Created',
        id: 'created',
        transforms: [sortable],
        sort: 'metadata.creationTimestamp',
        props: { className: 'pf-m-width-15' },
      },
      {
        title: '',
        id: 'actions',
        props: { className: 'dropdown-kebab-pf pf-c-table__action' },
      },
    ],
    [],
  );

  return columns;
};

export default CronTabList;
