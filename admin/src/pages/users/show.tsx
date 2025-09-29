import React from "react";
import { Show, DateField, TextField, TagField } from "@refinedev/antd";
import { useShow, useCustomMutation } from "@refinedev/core";
import { Typography, Tag, Space, Card, Descriptions, Button, message } from "antd";
import { 
  LockOutlined, 
  UnlockOutlined, 
  SafetyOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export const UserShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { mutate: activateUser } = useCustomMutation();

  const { mutate: deactivateUser } = useCustomMutation();

  const { mutate: sendVerificationEmail } = useCustomMutation();

  const handleActivate = () => {
    activateUser(
      {
        url: `users/${record?.id}/activate`,
        method: "patch",
        values: { active: true },
      },
      {
        onSuccess: () => {
          message.success("User activated successfully");
          queryResult.refetch();
        },
        onError: () => {
          message.error("Failed to activate user");
        },
      }
    );
  };

  const handleDeactivate = () => {
    deactivateUser(
      {
        url: `users/${record?.id}/activate`,
        method: "patch",
        values: { active: false },
      },
      {
        onSuccess: () => {
          message.success("User deactivated successfully");
          queryResult.refetch();
        },
        onError: () => {
          message.error("Failed to deactivate user");
        },
      }
    );
  };

  const handleSendVerification = () => {
    sendVerificationEmail(
      {
        url: `auth/email/send-verification`,
        method: "post",
        values: { email: record?.email },
      },
      {
        onSuccess: () => {
          message.success("Verification email sent");
        },
        onError: () => {
          message.error("Failed to send verification email");
        },
      }
    );
  };

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Title level={4}>User Information</Title>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">
            <TextField value={record?.id} />
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Space>
              <TextField value={record?.email} />
              {record?.emailVerified ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Verified
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="warning">
                  Unverified
                </Tag>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="First Name">
            <TextField value={record?.firstName || "-"} />
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            <TextField value={record?.lastName || "-"} />
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={record?.isActive ? "green" : "red"}>
              {record?.isActive ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="2FA">
            <Tag color={record?.otpEnabled ? "blue" : "default"}>
              {record?.otpEnabled ? "Enabled" : "Disabled"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            <DateField value={record?.createdAt} />
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            <DateField value={record?.updatedAt} />
          </Descriptions.Item>
          <Descriptions.Item label="Last Login">
            {record?.lastLoginAt ? (
              <DateField value={record.lastLoginAt} />
            ) : (
              <Text type="secondary">Never</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Login Attempts">
            <TextField value={record?.loginAttempts || 0} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Roles & Permissions</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>Roles:</Text>
            <Space wrap style={{ marginLeft: 16, marginTop: 8 }}>
              {record?.roles?.map((role: any) => (
                <TagField key={role.id} value={role.name} color="blue" />
              ))}
              {(!record?.roles || record.roles.length === 0) && (
                <Text type="secondary">No roles assigned</Text>
              )}
            </Space>
          </div>
          
          {record?.permissions && record.permissions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Permissions:</Text>
              <Space wrap style={{ marginLeft: 16, marginTop: 8 }}>
                {record.permissions.map((permission: string) => (
                  <Tag key={permission} icon={<SafetyOutlined />}>
                    {permission}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </Space>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Actions</Title>
        <Space>
          {record?.isActive ? (
            <Button
              danger
              icon={<LockOutlined />}
              onClick={handleDeactivate}
            >
              Deactivate User
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<UnlockOutlined />}
              onClick={handleActivate}
            >
              Activate User
            </Button>
          )}
          
          {!record?.emailVerified && (
            <Button
              icon={<MailOutlined />}
              onClick={handleSendVerification}
            >
              Send Verification Email
            </Button>
          )}
        </Space>
      </Card>
    </Show>
  );
};