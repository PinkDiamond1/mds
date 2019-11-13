import React from "react";
import { PropTypes } from "prop-types";
import { Field } from "redux-form";
import { Row, Col } from "antd";
import RenderField from "@/components/common/RenderField";
import RenderAutoSizeField from "@/components/common/RenderAutoSizeField";
import RenderRadioButtons from "@/components/common/RenderRadioButtons";

const propTypes = {
  isViewMode: PropTypes.bool.isRequired,
};

export const AccessRoads = (props) => {
  return (
    <div>
      <br />
      <h4>Bridges, Culverts, and Crossings</h4>
      <Row gutter={16}>
        <Col md={12} sm={24}>
          <div className="field-title">
            Are you proposing any bridges, culverts, and crossings?**
          </div>
          <Field id="" name="" component={RenderRadioButtons} disabled={props.isViewMode} />
          <Field id="" name="" component={RenderField} disabled={props.isViewMode} />
        </Col>
      </Row>
      <br />
      <h4>Reclamation Program</h4>
      <Row gutter={16}>
        <Col md={12} sm={24}>
          <div className="field-title">
            Proposed reclamation and timing for this specific activity
          </div>
          <Field
            id="reclamation_description"
            name="reclamation_description"
            component={RenderAutoSizeField}
            disabled={props.isViewMode}
          />
        </Col>
        <Col md={12} sm={24}>
          <div className="field-title">
            Estimated Cost of reclamation activities described above
          </div>
          <Field
            id="reclamation_cost"
            name="reclamation_cost"
            component={RenderField}
            disabled={props.isViewMode}
          />
        </Col>
      </Row>
    </div>
  );
};

AccessRoads.propTypes = propTypes;

export default AccessRoads;
