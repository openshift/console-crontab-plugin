import React from "react";
import { CronTabKind } from "@crontab-model/types";
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreateLink,
  ListPageFilter,
  ListPageHeader,
  Timestamp,
  useAccessReview,
  useK8sWatchResource,
  useLabelsModal,
  useListPageFilter,
  VirtualizedTable,
} from "@openshift-console/dynamic-plugin-sdk";
import { useCronTabTranslation } from "@crontab-utils/hooks/useCronTabTranslation";
import {
  ResourceLink,
  RowProps,
  TableColumn,
  TableData,
  useAnnotationsModal,
  useDeleteModal,
} from "@openshift-console/dynamic-plugin-sdk";
import { sortable } from "@patternfly/react-table";
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useHistory } from "react-router-dom";
import { cronTabGroupVersionKind } from "src/utils/utils";
import { CRONTAB_KIND_PLURAL } from "src/const";
import {
  KEBAB_ACTION_EDIT_ID,
  KEBAB_ACTION_EDIT_ANNOTATIONS_ID,
  KEBAB_ACTION_EDIT_LABELS_ID,
  KEBAB_ACTION_DELETE_ID,
  KEBAB_BUTTON_ID,
} from "./const";

type CronTabListProps = {
  namespace: string;
  showTitle?: boolean;
};

type CronTabKebabProps = {
  obj: CronTabKind;
};

const CronTabList: React.FC<CronTabListProps> = ({
  namespace,
  showTitle = true,
}) => {
  const [cronTabs, loaded, loadError] = useK8sWatchResource<
    K8sResourceCommon[]
  >({
    isList: true,
    groupVersionKind: cronTabGroupVersionKind,
    namespaced: true,
    namespace,
  });
  const { t } = useCronTabTranslation();
  const columns = useCronTabColumns();
  const [data, filteredData, onFilterChange] = useListPageFilter(cronTabs);
  const createAccessReview = {
    groupVersionKind: cronTabGroupVersionKind,
    namespace: namespace || "default",
  };

  const createURL = `/k8s/ns/${namespace || "default"}/${
    cronTabGroupVersionKind.group
  }~${cronTabGroupVersionKind.version}~${cronTabGroupVersionKind.kind}/~new`;

  return (
    <>
      <ListPageHeader title={showTitle ? t("CronTabs") : undefined}>
        <ListPageCreateLink
          to={createURL}
          createAccessReview={createAccessReview}
        >
          {t("Create CronTab")}
        </ListPageCreateLink>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          onFilterChange={onFilterChange}
        />
        <VirtualizedTable<CronTabKind>
          data={filteredData}
          unfilteredData={cronTabs}
          loaded={loaded}
          loadError={loadError}
          columns={columns}
          Row={cronTabListRow}
          label={t("CronTabs")}
        />
      </ListPageBody>
    </>
  );
};

const CronTabKebab: React.FC<CronTabKebabProps> = ({ obj }) => {
  const { t } = useCronTabTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const launchDeleteModal = useDeleteModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);
  const launchLabelsModal = useLabelsModal(obj);
  const { name, namespace } = obj.metadata;
  const canEditCronTab = useAccessReview({
    group: cronTabGroupVersionKind.group,
    resource: CRONTAB_KIND_PLURAL,
    verb: "update",
    name,
    namespace,
  });
  const canDeleteCronTab = useAccessReview({
    group: cronTabGroupVersionKind.group,
    resource: CRONTAB_KIND_PLURAL,
    verb: "delete",
    name,
    namespace,
  });
  const history = useHistory();

  const onFocus = () => {
    const element = document.getElementById("kebab-button");
    element.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const editURL = `/k8s/ns/${namespace}/${cronTabGroupVersionKind.group}~${
    cronTabGroupVersionKind.version
  }~${cronTabGroupVersionKind.kind}/${encodeURIComponent(name)}/yaml`;

  const dropdownItems = [
    <DropdownItem
      key={KEBAB_ACTION_EDIT_LABELS_ID}
      onClick={launchLabelsModal}
      isDisabled={!canEditCronTab}
      data-test-action={KEBAB_ACTION_EDIT_LABELS_ID}
    >
      {t("Edit labels")}
    </DropdownItem>,
    <DropdownItem
      key={KEBAB_ACTION_EDIT_ANNOTATIONS_ID}
      onClick={() => launchAnnotationsModal()}
      isDisabled={!canEditCronTab[0]}
      data-test-action={KEBAB_ACTION_EDIT_ANNOTATIONS_ID}
    >
      {t("Edit annotations")}
    </DropdownItem>,
    <DropdownItem
      key={KEBAB_ACTION_EDIT_ID}
      onClick={() => history.push(editURL)}
      isDisabled={!canEditCronTab[0]}
      data-test-action={KEBAB_ACTION_EDIT_ID}
    >
      {t("Edit CronTab")}
    </DropdownItem>,
    <DropdownItem
      key={KEBAB_ACTION_DELETE_ID}
      onClick={launchDeleteModal}
      isDisabled={!canDeleteCronTab[0]}
      data-test-action={KEBAB_ACTION_DELETE_ID}
    >
      {t("Delete CronTab")}
    </DropdownItem>,
  ];

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label={t("Actions")}
          variant="plain"
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
          icon={<EllipsisVIcon />}
          id={KEBAB_BUTTON_ID}
          data-test={KEBAB_BUTTON_ID}
        />
      )}
      popperProps={{ position: "right" }}
      shouldFocusToggleOnSelect
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};

const tableColumnInfo = [
  { id: "name" },
  { id: "namespace" },
  { id: "cronspec" },
  { id: "image" },
  { id: "replicas" },
  { id: "created" },
  { className: "pf-v6-c-table__action", id: "" },
];

const cronTabListRow: React.FC<RowProps<CronTabKind>> = ({
  obj,
  activeColumnIDs,
}) => {
  return (
    <>
      <TableData {...tableColumnInfo[0]} activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={cronTabGroupVersionKind}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData {...tableColumnInfo[1]} activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData {...tableColumnInfo[2]} activeColumnIDs={activeColumnIDs}>
        {obj.spec.cronSpec}
      </TableData>
      <TableData {...tableColumnInfo[3]} activeColumnIDs={activeColumnIDs}>
        {obj.spec.image}
      </TableData>
      <TableData {...tableColumnInfo[4]} activeColumnIDs={activeColumnIDs}>
        {obj.spec.replicas}
      </TableData>
      <TableData {...tableColumnInfo[5]} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
      </TableData>
      <TableData {...tableColumnInfo[6]} activeColumnIDs={activeColumnIDs}>
        <CronTabKebab obj={obj} />
      </TableData>
    </>
  );
};

const useCronTabColumns = () => {
  const { t } = useCronTabTranslation();
  const columns: TableColumn<CronTabKind>[] = React.useMemo(
    () => [
      {
        title: t("Name"),
        id: tableColumnInfo[0].id,
        transforms: [sortable],
        sort: "metadata.name",
      },
      {
        title: t("Namespace"),
        id: tableColumnInfo[1].id,
        transforms: [sortable],
        sort: "metadata.namespace",
      },
      {
        title: t("CronSpec"),
        id: tableColumnInfo[2].id,
        transforms: [sortable],
        sort: "spec.cronSpec",
      },
      {
        title: t("Image"),
        id: tableColumnInfo[3].id,
        transforms: [sortable],
        sort: "spec.image",
      },
      {
        title: t("Replicas"),
        id: tableColumnInfo[4].id,
        transforms: [sortable],
        sort: "spec.replicas",
      },
      {
        title: t("Created"),
        id: tableColumnInfo[5].id,
        transforms: [sortable],
        sort: "metadata.creationTimestamp",
      },
      {
        title: "",
        id: tableColumnInfo[6].id,
        props: { className: tableColumnInfo[6].className },
      },
    ],
    [t]
  );

  return columns;
};

export default CronTabList;
