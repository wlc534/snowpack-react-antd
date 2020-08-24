import React, { useState, useEffect } from 'react';
import { useRequest, useAntdTable } from 'ahooks';
import {
  Button,
  Input,
  Checkbox,
  Radio,
  DatePicker,
  Form,
  Table,
  Space,
  Select,
  Collapse,
  Tag,
  message,
} from 'antd';
import { BugOutlined, RedoOutlined } from '@ant-design/icons';
import moment from 'moment';

const baseUrl = `/api/v1/topics`;

// const layout = {
//   labelCol: {
//     span: 8,
//   },
//   wrapperCol: {
//     span: 16,
//   },
// };
// const tailLayout = {
//   wrapperCol: {
//     offset: 8,
//     span: 16,
//   },
// };

const { Option } = Select;

function AppX() {
  const [tab, setTab] = useState('all');
  // const {
  //   data: { data: dataSource = [] } = {},
  //   error,
  //   loading,
  //   run,
  // } = useRequest(`${URL}?tab=${tab}`, {
  //   manual: true,
  //   onSuccess: (result, params) => {
  //     if (result.success) {
  //       message.success(`The username was changed to "${params[0]}" !`);
  //     }
  //   },
  // });

  // useEffect(() => {
  //   run();
  // }, [tab]);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');

  const onFormLayoutChange = ({ layout }) => {
    console.log(layout)
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;
  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: {
            span: 14,
            offset: 4,
          },
        }
      : null;

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = (value) => {
    setTab(value);
  };
  return (
    <>
       <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{
          layout: formLayout,
        }}
        onValuesChange={onFormLayoutChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Form Layout" name="layout">
          <Radio.Group value={formLayout}>
            <Radio.Button value="horizontal">Horizontal</Radio.Button>
            <Radio.Button value="vertical">Vertical</Radio.Button>
            <Radio.Button value="inline">Inline</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Field A" name='FieldA'>
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item label="Field B" name='FieldB'>
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button type="primary"  htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>

    </>
  );
}

export default AppX;
