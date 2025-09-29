import React, { useState, useEffect, useCallback } from 'react';
import { List, useTable, DateField, TagField, FilterDropdown } from '@refinedev/antd';
import { Table, Space, Tag, Button, Input } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigation } from '@refinedev/core';

export const UserList: React.FC = () => {
  const { tableProps, setFilters, filters } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: 20,
    },
  });

  const { show, edit } = useNavigation();

  // Get current search value from filters
  const currentSearchValue = (() => {
    const emailFilter = filters?.find(
      filter =>
        'field' in filter &&
        filter.field === 'email' &&
        'operator' in filter &&
        filter.operator === 'contains',
    );
    return emailFilter && 'value' in emailFilter ? (emailFilter.value as string) : '';
  })();

  const [searchValue, setSearchValue] = useState(currentSearchValue);

  // Sync search value with filters on mount and URL changes
  useEffect(() => {
    setSearchValue(currentSearchValue);
  }, [currentSearchValue]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (value) {
            setFilters(
              [
                {
                  field: 'email',
                  operator: 'contains',
                  value: value,
                },
              ],
              'replace',
            );
          } else {
            setFilters([], 'replace');
          }
        }, 300); // 300ms debounce
      };
    })(),
    [setFilters],
  );

  return (
    <List
      headerButtons={
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchValue}
          onChange={e => {
            const value = e.target.value;
            setSearchValue(value);
            debouncedSearch(value);
          }}
          allowClear
        />
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column title="ID" dataIndex="id" sorter width={100} />
        <Table.Column
          title="Email"
          dataIndex="email"
          sorter
          filterDropdown={props => (
            <FilterDropdown {...props}>
              <Input placeholder="Search email" />
            </FilterDropdown>
          )}
          filterIcon={<SearchOutlined />}
        />
        <Table.Column
          title="Name"
          render={(_, record: any) =>
            `${record.firstName || ''} ${record.lastName || ''}`.trim() || '-'
          }
        />
        <Table.Column
          title="Status"
          dataIndex="isActive"
          render={value => (
            <Tag color={value ? 'green' : 'red'}>{value ? 'Active' : 'Inactive'}</Tag>
          )}
        />
        <Table.Column
          title="Email Verified"
          dataIndex="emailVerified"
          render={value => (
            <Tag color={value ? 'green' : 'orange'}>{value ? 'Verified' : 'Unverified'}</Tag>
          )}
        />
        <Table.Column
          title="2FA"
          dataIndex="otpEnabled"
          render={value => (
            <Tag color={value ? 'blue' : 'default'}>{value ? 'Enabled' : 'Disabled'}</Tag>
          )}
        />
        <Table.Column
          title="Roles"
          dataIndex="roles"
          render={(roles: any[]) => (
            <Space wrap>
              {roles?.map(role => (
                <TagField key={role.id || role.name} value={role.name} color="blue" />
              ))}
            </Space>
          )}
        />
        <Table.Column
          title="Created"
          dataIndex="createdAt"
          render={value => <DateField value={value} />}
          sorter
        />
        <Table.Column
          title="Last Login"
          dataIndex="lastLoginAt"
          render={value => (value ? <DateField value={value} /> : '-')}
        />
        <Table.Column
          title="Actions"
          render={(_, record: any) => (
            <Space>
              <Button
                key={`view-${record.id}`}
                size="small"
                icon={<EyeOutlined />}
                onClick={() => show('users', record.id)}
              />
              <Button
                key={`edit-${record.id}`}
                size="small"
                icon={<EditOutlined />}
                onClick={() => edit('users', record.id)}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
