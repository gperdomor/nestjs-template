import React from 'react';
import { List, useTable, DateField } from '@refinedev/antd';
import { Table, Space, Button, Tag, Typography } from 'antd';
import { EditOutlined, EyeOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigation } from '@refinedev/core';

const { Text } = Typography;

export const RoleList: React.FC = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: 20,
    },
  });

  const { show, edit } = useNavigation();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="ID" dataIndex="id" width={100} />
        <Table.Column title="Name" dataIndex="name" render={value => <Text strong>{value}</Text>} />
        <Table.Column
          title="Description"
          dataIndex="description"
          render={value => value || <Text type="secondary">No description</Text>}
        />
        <Table.Column
          title="Type"
          dataIndex="type"
          render={value => <Tag color={value === 'SYSTEM' ? 'red' : 'blue'}>{value}</Tag>}
        />
        <Table.Column
          title="Permissions"
          dataIndex="permissions"
          render={(permissions: any[]) => (
            <Space wrap>
              {permissions?.slice(0, 3).map(permission => (
                <Tag key={permission.id} icon={<SafetyOutlined />}>
                  {permission.name}
                </Tag>
              ))}
              {permissions?.length > 3 && <Tag>+{permissions.length - 3} more</Tag>}
            </Space>
          )}
        />
        <Table.Column title="Users Count" dataIndex="usersCount" render={value => value || 0} />
        <Table.Column
          title="Created"
          dataIndex="createdAt"
          render={value => <DateField value={value} />}
        />
        <Table.Column
          title="Actions"
          render={(_, record: any) => (
            <Space>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => show('roles', record.id)}
              />
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => edit('roles', record.id)}
                disabled={record.type === 'SYSTEM'}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
