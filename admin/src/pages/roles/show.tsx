import React from 'react';
import { Show, DateField, TextField } from '@refinedev/antd';
import { useShow, useList } from '@refinedev/core';
import { Typography, Tag, Space, Card, Descriptions, List, Avatar } from 'antd';
import { SafetyOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const RoleShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: usersData } = useList({
    resource: 'users',
    filters: [
      {
        field: 'roleId',
        operator: 'eq',
        value: record?.id,
      },
    ],
    pagination: {
      pageSize: 10,
    },
  });

  const users = usersData?.data || [];

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Title level={4}>Role Information</Title>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">
            <TextField value={record?.id} />
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            <Text strong>{record?.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            <TextField value={record?.description || '-'} />
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            <Tag color={record?.type === 'SYSTEM' ? 'red' : 'blue'}>{record?.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Users Count">
            <TextField value={users.length} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            <DateField value={record?.createdAt} />
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            <DateField value={record?.updatedAt} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Permissions ({record?.permissions?.length || 0})</Title>
        <Space wrap size={[8, 16]}>
          {record?.permissions?.map((permission: any) => (
            <Tag key={permission.id} icon={<SafetyOutlined />} color="blue" style={{ margin: 0 }}>
              <Space>
                <Text strong>{permission.resource}</Text>
                <Text>:</Text>
                <Text>{permission.action}</Text>
              </Space>
            </Tag>
          ))}
          {(!record?.permissions || record.permissions.length === 0) && (
            <Text type="secondary">No permissions assigned</Text>
          )}
        </Space>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Users with this Role ({users.length})</Title>
        <List
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={`${user.firstName} ${user.lastName}`}
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">{user.email}</Text>
                    <Space>
                      <Tag color={user.isActive ? 'green' : 'red'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Tag>
                      {user.emailVerified && <Tag color="blue">Email Verified</Tag>}
                      {user.otpEnabled && <Tag color="purple">2FA Enabled</Tag>}
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
        {users.length === 0 && <Text type="secondary">No users assigned to this role</Text>}
      </Card>
    </Show>
  );
};
