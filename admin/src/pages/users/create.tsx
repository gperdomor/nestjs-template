import React from 'react';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input, Switch, Select } from 'antd';

export const UserCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();

  const { selectProps: roleSelectProps } = useSelect({
    resource: 'roles',
    optionLabel: 'name',
    optionValue: 'id',
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'First name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Last name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Roles"
          name="roleIds"
          rules={[{ required: true, message: 'At least one role is required' }]}
        >
          <Select {...roleSelectProps} mode="multiple" placeholder="Select roles" />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>

        <Form.Item
          label="Send Verification Email"
          name="sendVerificationEmail"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
};
