import React from "react";
import { List, useTable, DateField, TagField, FilterDropdown } from "@refinedev/antd";
import { Table, Space, Tag, Button, Input } from "antd";
import { SearchOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";

export const UserList: React.FC = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: 20,
    },
  });

  const { show, edit } = useNavigation();

  return (
    <List
      headerButtons={
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={(e) => {
            const value = e.target.value;
            tableProps.onChange?.(
              {...tableProps.pagination, current: 1} as any,
              {email: value ? [{field: "email", operator: "contains", value}] : []} as any,
              {} as any,
              {} as any
            );
          }}
        />
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="ID"
          dataIndex="id"
          sorter
          width={100}
        />
        <Table.Column
          title="Email"
          dataIndex="email"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search email" />
            </FilterDropdown>
          )}
          filterIcon={<SearchOutlined />}
        />
        <Table.Column
          title="Name"
          render={(_, record: any) => 
            `${record.firstName || ""} ${record.lastName || ""}`.trim() || "-"
          }
        />
        <Table.Column
          title="Status"
          dataIndex="isActive"
          render={(value) => (
            <Tag color={value ? "green" : "red"}>
              {value ? "Active" : "Inactive"}
            </Tag>
          )}
        />
        <Table.Column
          title="Email Verified"
          dataIndex="emailVerified"
          render={(value) => (
            <Tag color={value ? "green" : "orange"}>
              {value ? "Verified" : "Unverified"}
            </Tag>
          )}
        />
        <Table.Column
          title="2FA"
          dataIndex="otpEnabled"
          render={(value) => (
            <Tag color={value ? "blue" : "default"}>
              {value ? "Enabled" : "Disabled"}
            </Tag>
          )}
        />
        <Table.Column
          title="Roles"
          dataIndex="roles"
          render={(roles: any[]) => (
            <Space wrap>
              {roles?.map((role) => (
                <TagField key={role.id || role.name} value={role.name} color="blue" />
              ))}
            </Space>
          )}
        />
        <Table.Column
          title="Created"
          dataIndex="createdAt"
          render={(value) => <DateField value={value} />}
          sorter
        />
        <Table.Column
          title="Last Login"
          dataIndex="lastLoginAt"
          render={(value) => value ? <DateField value={value} /> : "-"}
        />
        <Table.Column
          title="Actions"
          render={(_, record: any) => (
            <Space>
              <Button
                key={`view-${record.id}`}
                size="small"
                icon={<EyeOutlined />}
                onClick={() => show("users", record.id)}
              />
              <Button
                key={`edit-${record.id}`}
                size="small"
                icon={<EditOutlined />}
                onClick={() => edit("users", record.id)}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};