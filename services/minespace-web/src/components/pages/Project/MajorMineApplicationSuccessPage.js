import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Row, Col, Typography, Button, Divider } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import * as routes from "@/constants/routes";
import CustomPropTypes from "@/customPropTypes";

const propTypes = {
  location: PropTypes.shape({
    state: {
      project: CustomPropTypes.project,
    },
  }).isRequired,
};

export const MajorMineApplicationSuccessPage = (props) => {
  const renderContent = () => {
    const project = props.location.state?.project || {};
    const { project_guid } = project;

    return (
      <div style={{ textAlign: "center" }}>
        <>
          <Row>
            <Col span={24}>
              <CheckCircleOutlined
                style={{
                  color: "green",
                  transform: "scale(7.0)",
                  marginTop: "7.0em",
                  marginBottom: "3.5em",
                }}
              />
            </Col>
          </Row>
          <br />
          <Typography.Paragraph>
            <Typography.Title level={5}>
              Thank you, your Major Mine Application has been submitted!
            </Typography.Title>
            Your submission will soon be reviewed by the ministry.
          </Typography.Paragraph>
          <Typography.Paragraph>
            You will be contacted when the status updates on your submission.
          </Typography.Paragraph>
          <div>
            <p>
              <Link to={routes.EDIT_PROJECT.dynamicRoute(project_guid)}>
                <Button type="primary">Back to Project Overview</Button>
              </Link>
            </p>
            {/* <p> // UPDATE THIS LINK when review page and API entries are complete
              <Link
                to={{
                  pathname: routes.REVIEW_INFORMATION_REQUIREMENTS_TABLE.dynamicRoute(
                    project_guid,
                    irt_guid
                  ),
                  state: { current: 2 },
                }}
              >
                <Button>View Application</Button>
              </Link>
            </p> */}
          </div>
        </>
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title>{props.location.state?.project.project_title}</Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Link to={routes.EDIT_PROJECT.dynamicRoute(props.location.state?.project.project_guid)}>
            <ArrowLeftOutlined className="padding-sm--right" />
            Back to Project Overview
          </Link>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Typography.Title level={4}>Major Mine Application</Typography.Title>
        </Col>
        <Col span={24}>{renderContent()}</Col>
      </Row>
    </>
  );
};

MajorMineApplicationSuccessPage.propTypes = propTypes;

export default withRouter(MajorMineApplicationSuccessPage);
