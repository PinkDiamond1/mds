import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Popconfirm, Drawer } from "antd";
import { EyeOutlined, MessageOutlined, CloseOutlined } from "@ant-design/icons";
import _ from "lodash";
import {
  getIncidentDeterminationHash,
  getIncidentStatusCodeHash,
  getIncidentCategoryCodeHash,
  getHSRCMComplianceCodesHash,
  getDropdownIncidentStatusCodeOptions,
} from "@common/selectors/staticContentSelectors";
import { formatDate, dateSorter, optionsFilterLabelAndValue } from "@common/utils/helpers";
import * as Strings from "@common/constants/strings";
import { EDIT_OUTLINE_VIOLET, TRASHCAN } from "@/constants/assets";
import AuthorizationWrapper from "@/components/common/wrappers/AuthorizationWrapper";
import * as Permission from "@/constants/permissions";
import CustomPropTypes from "@/customPropTypes";
import DocumentLink from "@/components/common/DocumentLink";
import CoreTable from "@/components/common/CoreTable";
import MineIncidentNotes from "@/components/mine/Incidents/MineIncidentNotes";
import { CoreTooltip } from "@/components/common/CoreTooltip";
import * as router from "@/constants/routes";

const propTypes = {
  incidents: PropTypes.arrayOf(CustomPropTypes.incident).isRequired,
  followupActions: PropTypes.arrayOf(CustomPropTypes.incidentFollowupType).isRequired,
  handleEditMineIncident: PropTypes.func.isRequired,
  handleDeleteMineIncident: PropTypes.func.isRequired,
  openMineIncidentModal: PropTypes.func.isRequired,
  openViewMineIncidentModal: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  incidentStatusCodeOptions: CustomPropTypes.options.isRequired,
  handleIncidentSearch: PropTypes.func,
  params: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.string)])
  ).isRequired,
  incidentDeterminationHash: PropTypes.objectOf(PropTypes.string),
  complianceCodesHash: PropTypes.objectOf(PropTypes.string),
  incidentStatusCodeHash: PropTypes.objectOf(PropTypes.string),
  incidentCategoryCodeHash: PropTypes.objectOf(PropTypes.string),
  isDashboardView: PropTypes.bool,
  sortField: PropTypes.string,
  sortDir: PropTypes.string,
  isPaginated: PropTypes.bool,
};

const defaultProps = {
  handleIncidentSearch: () => {},
  incidentDeterminationHash: {},
  complianceCodesHash: {},
  incidentStatusCodeHash: {},
  incidentCategoryCodeHash: {},
  isDashboardView: false,
  sortField: undefined,
  sortDir: undefined,
  isPaginated: false,
};

const hideColumn = (condition) => (condition ? "column-hide" : "");

const applySortIndicator = (_columns, field, dir) =>
  _columns.map((column) => ({
    ...column,
    sortOrder: dir && column.sortField === field ? dir.concat("end") : false,
  }));

const handleTableChange = (updateIncidentList, tableFilters) => (pagination, filters, sorter) => {
  const params = {
    results: pagination.pageSize,
    page: pagination.current,
    ...tableFilters,
    sort_field: sorter.order ? sorter.field : undefined,
    sort_dir: sorter.order ? sorter.order.replace("end", "") : sorter.order,
    ...filters,
  };
  updateIncidentList(params);
};

const renderDownloadLinks = (files, mine_incident_document_type_code) => {
  const links = files
    .filter((file) => file.mine_incident_document_type_code === mine_incident_document_type_code)
    .map((file) => (
      <div key={file.mine_document_guid}>
        <DocumentLink
          documentManagerGuid={file.document_manager_guid}
          documentName={file.document_name}
        />
      </div>
    ));
  return links && links.length > 0 ? links : false;
};

export class MineIncidentTable extends Component {
  state = {
    isDrawerVisible: false,
    mineIncident: {},
  };

  transformRowData = (
    incidents,
    actions,
    handleEditMineIncident,
    handleDeleteMineIncident,
    openMineIncidentModal,
    openViewMineIncidentModal,
    determinationHash,
    statusHash
  ) =>
    incidents.map((incident) => {
      const values = {
        key: incident.mine_incident_guid,
        mine_incident_report_no: incident.mine_incident_report_no,
        incident_timestamp: formatDate(incident.incident_timestamp),
        reported_timestamp: formatDate(incident.reported_timestamp),
        reported_by: incident.reported_by_name || Strings.EMPTY_FIELD,
        mine_name: incident.mine_name || Strings.EMPTY_FIELD,
        incident_status: statusHash[incident.status_code] || Strings.EMPTY_FIELD,
        determination: determinationHash[incident.determination_type_code] || Strings.EMPTY_FIELD,
        code: incident.dangerous_occurrence_subparagraph_ids || Strings.EMPTY_FIELD,
        docs: incident.documents,
        followup_action: actions.find(
          (x) =>
            x.mine_incident_followup_investigation_type_code ===
            incident.followup_investigation_type_code
        ),
        incident_types:
          incident.categories && incident.categories.length > 0
            ? incident.categories.map(
                (type) => this.props.incidentCategoryCodeHash[type.mine_incident_category_code]
              )
            : [],
        handleEditMineIncident,
        handleDeleteMineIncident,
        openMineIncidentModal,
        openViewMineIncidentModal,
        incident,
      };

      return values;
    });

  sortIncidentNumber = (a, b) =>
    a.incident.mine_incident_id_year - b.incident.mine_incident_id_year ||
    a.incident.mine_incident_id - b.incident.mine_incident_id;

  toggleDrawer = (mineIncident) => {
    this.setState((prevState) => ({
      isDrawerVisible: !prevState.isDrawerVisible,
      mineIncident,
    }));
  };

  render() {
    const columns = [
      {
        title: "Number",
        key: "mine_incident_report_no",
        dataIndex: "mine_incident_report_no",
        sortField: "mine_incident_report_no",
        sorter: this.props.isDashboardView || this.sortIncidentNumber,
        render: (text) => <div title="Number">{text}</div>,
      },
      {
        title: "Incident Date",
        key: "incident_timestamp",
        dataIndex: "incident_timestamp",
        sortField: "incident_timestamp",
        sorter: this.props.isDashboardView || dateSorter("incident_timestamp"),
        defaultSortOrder: "descend",
        render: (text) => <span title="Incident Date">{text}</span>,
      },
      {
        title: "Mine",
        key: "mine_name",
        dataIndex: "mine_name",
        sortField: "mine_name",
        sorter: this.props.isDashboardView,
        className: hideColumn(!this.props.isDashboardView),
        render: (text, record) => (
          <div title="Mine" className={hideColumn(!this.props.isDashboardView)}>
            <Link to={router.MINE_SUMMARY.dynamicRoute(record.incident.mine_guid)}>{text}</Link>
          </div>
        ),
      },
      {
        title: "Incident Type(s)",
        key: "incident_types",
        dataIndex: "incident_types",
        render: (text) => (
          <div title="Incident Type(s)">
            {(text && text.length > 0 && text.join(", ")) || Strings.EMPTY_FIELD}
          </div>
        ),
      },
      {
        title: "Status",
        key: "incident_status",
        dataIndex: "incident_status",
        sortField: "incident_status",
        sorter:
          this.props.isDashboardView ||
          ((a, b) => a.incident_status.localeCompare(b.incident_status)),
        filtered: !this.props.isDashboardView,
        onFilter: (value, record) => record.incident.status_code === value,
        filters:
          !this.props.isDashboardView &&
          (this.props.incidentStatusCodeOptions
            ? optionsFilterLabelAndValue(this.props.incidentStatusCodeOptions)
            : []),
        render: (text) => <span title="Status">{text}</span>,
      },
      {
        title: "Inspector Responsible",
        key: "responsible_inspector_party",
        render: (text, record) => (
          <span title="Inspector Responsible">{record.incident.responsible_inspector_party}</span>
        ),
        onFilter: (value, record) => record.incident.responsible_inspector_party === value,
        filters: _.reduce(
          this.props.incidents,
          (reporterList, incident) => {
            if (!reporterList.map((x) => x.value).includes(incident.responsible_inspector_party)) {
              reporterList.push({
                value: incident.responsible_inspector_party,
                text: incident.responsible_inspector_party,
              });
            }
            return reporterList;
          },
          []
        ),
      },
      {
        title: "Determination",
        key: "determination",
        dataIndex: "determination",
        sortField: "determination",
        sorter: this.props.isDashboardView,
        className: hideColumn(!this.props.isDashboardView),
        render: (text) => (
          <span title="Determination" className={hideColumn(!this.props.isDashboardView)}>
            {text}
          </span>
        ),
      },
      {
        title: "Code",
        key: "code",
        dataIndex: "code",
        className: hideColumn(!this.props.isDashboardView),
        render: (text) => (
          <span title="Incident Codes" className={hideColumn(!this.props.isDashboardView)}>
            {text.length === 0 ? (
              <span>{Strings.EMPTY_FIELD}</span>
            ) : (
              <span>
                {text.map((code) => (
                  <div key={code}>{this.props.complianceCodesHash[code]}</div>
                ))}
              </span>
            )}
          </span>
        ),
      },
      {
        title: "EMLI Action",
        key: "followup_action",
        dataIndex: "followup_action",
        className: hideColumn(true),
        render: (action, record) => (
          <div title="EMLI Action" className={hideColumn(true)}>
            {action ? action.description : record.incident.followup_type_code}
          </div>
        ),
        onFilter: (value, record) => record.incident.followup_investigation_type_code === value,
        filters: this.props.followupActions.map((action) => ({
          value: action.mine_incident_followup_investigation_type_code,
          text: action.mine_incident_followup_investigation_type_code,
        })),
      },
      {
        title: "Initial Report Documents",
        key: "initialDocuments",
        dataIndex: "initialDocuments",
        className: hideColumn(this.props.isDashboardView),
        render: (text, record) => (
          <div
            title="Initial Report Documents"
            className={`${hideColumn(this.props.isDashboardView)} cap-col-height`}
          >
            {(record.docs &&
              record.docs.length > 0 &&
              renderDownloadLinks(record.docs, Strings.INCIDENT_DOCUMENT_TYPES.initial)) ||
              Strings.EMPTY_FIELD}
          </div>
        ),
      },
      {
        title: "Final Report Documents",
        key: "finalDocuments",
        dataIndex: "finalDocuments",
        className: hideColumn(this.props.isDashboardView),
        render: (text, record) => (
          <div
            title="Final Report Documents"
            className={`${hideColumn(this.props.isDashboardView)} cap-col-height`}
          >
            {(record.docs &&
              record.docs.length > 0 &&
              renderDownloadLinks(record.docs, Strings.INCIDENT_DOCUMENT_TYPES.final)) ||
              Strings.EMPTY_FIELD}
          </div>
        ),
      },
      {
        title: "",
        key: "handleEditModal",
        dataIndex: "handleEditModal",
        render: (text, record) => (
          <div align="right" className="btn--middle flex">
            <AuthorizationWrapper permission={Permission.EDIT_DO}>
              <Button
                type="primary"
                size="small"
                ghost
                onClick={(event) =>
                  record.openMineIncidentModal(
                    event,
                    record.handleEditMineIncident,
                    false,
                    record.incident
                  )
                }
              >
                <img src={EDIT_OUTLINE_VIOLET} alt="Edit Incident" />
              </Button>
            </AuthorizationWrapper>
            <Button
              type="primary"
              size="small"
              ghost
              onClick={(event) => record.openViewMineIncidentModal(event, record.incident)}
            >
              <EyeOutlined className="icon-lg icon-svg-filter" />
            </Button>
            <AuthorizationWrapper permission={Permission.ADMIN}>
              <Popconfirm
                placement="topLeft"
                title="Are you sure you want to delete this incident?"
                onConfirm={() => record.handleDeleteMineIncident(record.incident)}
                okText="Delete"
                cancelText="Cancel"
              >
                <Button ghost size="small" type="primary">
                  <img name="remove" src={TRASHCAN} alt="Remove Incident" />
                </Button>
              </Popconfirm>
            </AuthorizationWrapper>
            <AuthorizationWrapper permission={Permission.ADMIN}>
              <Button
                type="primary"
                size="small"
                ghost
                onClick={() => this.toggleDrawer(record.incident)}
              >
                <MessageOutlined className="padding-sm icon-sm" />
              </Button>
            </AuthorizationWrapper>
          </div>
        ),
      },
    ];

    return (
      <div>
        <Drawer
          title={
            <>
              Internal Communication for Mine Incident{" "}
              {this.state.mineIncident?.mine_incident_report_no}
              <CoreTooltip title="Anything written in Internal Communications may be requested under FOIPPA. Keep it professional and concise." />
            </>
          }
          placement="right"
          closable={false}
          onClose={this.toggleDrawer}
          visible={this.state.isDrawerVisible}
        >
          <Button ghost className="modal__close" onClick={this.toggleDrawer}>
            <CloseOutlined />
          </Button>
          <MineIncidentNotes mineIncidentGuid={this.state.mineIncident.mine_incident_guid} />
        </Drawer>
        <CoreTable
          condition={this.props.isLoaded}
          columns={
            this.props.isDashboardView
              ? applySortIndicator(columns, this.props.sortField, this.props.sortDir)
              : columns
          }
          dataSource={this.transformRowData(
            this.props.incidents,
            this.props.followupActions,
            this.props.handleEditMineIncident,
            this.props.handleDeleteMineIncident,
            this.props.openMineIncidentModal,
            this.props.openViewMineIncidentModal,
            this.props.incidentDeterminationHash,
            this.props.incidentStatusCodeHash,
            this.props.incidentCategoryCodeHash
          )}
          tableProps={{
            onChange: this.props.isDashboardView
              ? handleTableChange(this.props.handleIncidentSearch, this.props.params)
              : null,
            align: "left",
            pagination: this.props.isPaginated,
          }}
        />
      </div>
    );
  }
}

MineIncidentTable.propTypes = propTypes;
MineIncidentTable.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  incidentDeterminationHash: getIncidentDeterminationHash(state),
  incidentStatusCodeHash: getIncidentStatusCodeHash(state),
  incidentCategoryCodeHash: getIncidentCategoryCodeHash(state),
  complianceCodesHash: getHSRCMComplianceCodesHash(state),
  incidentStatusCodeOptions: getDropdownIncidentStatusCodeOptions(state),
});

export default connect(mapStateToProps)(MineIncidentTable);
