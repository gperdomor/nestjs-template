import React, { useState } from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Switch, Select, Button, Space, message } from "antd";
import { useCustomMutation } from "@refinedev/core";

export const UserEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    onMutationSuccess: () => {
      message.success("User updated successfully");
    },
    queryOptions: {
      onSuccess: (data) => {
        // Set role IDs when user data is loaded
        const user = data?.data;
        if (user?.roles && formProps.form) {
          formProps.form.setFieldsValue({
            roleIds: user.roles.map((role: any) => role.id),
          });
        }
      },
    },
  });
  const userData = queryResult?.data?.data;
  const [changingPassword, setChangingPassword] = useState(false);

  const { selectProps: roleSelectProps } = useSelect({
    resource: "roles",
    optionLabel: "name",
    optionValue: "id",
  });

  const { mutate: changePassword } = useCustomMutation();

  // All form properties are now supported by the backend

  const handlePasswordChange = () => {
    const newPassword = formProps.form?.getFieldValue("newPassword");
    const confirmPassword = formProps.form?.getFieldValue("confirmPassword");

    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    changePassword(
      {
        url: `admin/users/${userData?.id}/change-password`,
        method: "post",
        values: { newPassword: newPassword },
      },
      {
        onSuccess: () => {
          message.success("Password changed successfully");
          setChangingPassword(false);
          formProps.form?.resetFields(["newPassword", "confirmPassword"]);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message;
          if (Array.isArray(errorMessage)) {
            errorMessage.forEach((msg: string) => message.error(msg));
          } else if (typeof errorMessage === 'string') {
            message.error(errorMessage);
          } else {
            message.error("Failed to change password");
          }
        },
      }
    );
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="First Name" name="firstName">
          <Input />
        </Form.Item>

        <Form.Item label="Last Name" name="lastName">
          <Input />
        </Form.Item>

        <Form.Item
          label="Roles"
          name="roleIds"
          rules={[{ required: true, message: "At least one role is required" }]}
        >
          <Select
            {...roleSelectProps}
            mode="multiple"
            placeholder="Select roles"
          />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Email Verified" valuePropName="checked">
          <Switch checked={userData?.emailVerified} disabled />
        </Form.Item>

        <Form.Item label="2FA Enabled" valuePropName="checked">
          <Switch checked={userData?.otpEnabled} disabled />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 24, padding: 16, border: "1px solid #f0f0f0", borderRadius: 8 }}>
        <h4>Change Password</h4>
        {!changingPassword ? (
          <Button onClick={() => setChangingPassword(true)}>
            Change User Password
          </Button>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input.Password
              placeholder="New Password"
              onChange={(e) => formProps.form?.setFieldsValue({ newPassword: e.target.value })}
            />
            <Input.Password
              placeholder="Confirm Password"
              onChange={(e) => formProps.form?.setFieldsValue({ confirmPassword: e.target.value })}
            />
            <Space>
              <Button type="primary" onClick={handlePasswordChange}>
                Update Password
              </Button>
              <Button onClick={() => setChangingPassword(false)}>
                Cancel
              </Button>
            </Space>
          </Space>
        )}
      </div>
    </Edit>
  );
};