import React from "react";
import { Field, reduxForm } from "redux-form";
import { Divider, Form, Col, Row, Typography } from "antd";
import {
  required,
  requiredList,
  email,
  number,
  phoneNumber,
  maxLength,
} from "@common/utils/Validate";
import { normalizePhone } from "@common/utils/helpers";
import { renderConfig } from "@/components/common/config";
import * as FORM from "@/constants/forms";
import CustomPropTypes from "@/customPropTypes";

const { Text } = Typography;

const propTypes = {
  incidentCategoryCodeOptions: CustomPropTypes.options.isRequired,
};

const defaultProps = {};

export const AddIncidentReportingForm = (props) => (
  <div>
    <Form layout="vertical">
      <Form.Item>
        <Field
          id="categories"
          name="categories"
          label="Incident type(s)"
          placeholder="Select incident type(s)"
          component={renderConfig.MULTI_SELECT}
          validate={[requiredList]}
          data={props.incidentCategoryCodeOptions}
        />
      </Form.Item>
      <Divider />
      <Text>
        <h4>Reporter Details</h4>
      </Text>
      <Form.Item>
        <Field
          id="reported_by_name"
          name="reported_by_name"
          label="Reported by"
          placeholder="Enter name of reporter"
          component={renderConfig.FIELD}
          validate={[required]}
        />
      </Form.Item>
      <Row gutter={16}>
        <Col md={12} xs={24}>
          <Form.Item>
            <Field
              id="reported_by_phone_no"
              name="reported_by_phone_no"
              label="Phone number (optional)"
              placeholder="xxx-xxx-xxxx"
              component={renderConfig.FIELD}
              validate={[phoneNumber, maxLength(12)]}
              normalize={normalizePhone}
            />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item>
            <Field
              id="reported_by_phone_ext"
              name="reported_by_phone_ext"
              label="Phone extension (optional)"
              placeholder="xxxxxx"
              component={renderConfig.FIELD}
              validate={[number, maxLength(6)]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Field
          id="reported_by_email"
          name="reported_by_email"
          label="Email address (optional)"
          placeholder="example@domain.com"
          component={renderConfig.FIELD}
          validate={[email]}
        />
      </Form.Item>
    </Form>
  </div>
);

AddIncidentReportingForm.propTypes = propTypes;
AddIncidentReportingForm.defaultProps = defaultProps;

export default reduxForm({
  form: FORM.ADD_INCIDENT,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  touchOnBlur: true,
})(AddIncidentReportingForm);
