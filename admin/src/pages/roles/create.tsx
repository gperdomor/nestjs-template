import React, { useState, useEffect } from 'react';
import { Create, useForm } from '@refinedev/antd';
import { Form, Input, Transfer } from 'antd';
import type { Key } from 'antd/es/table/interface';
import type { TransferDirection } from 'antd/es/transfer';
import { useCustom } from '@refinedev/core';

const { TextArea } = Input;

export const RoleCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);

  // Fetch available permissions
  const { data: permissionsData } = useCustom({
    url: '/admin/roles/permissions',
    method: 'get',
  });

  useEffect(() => {
    // The API response is nested: { statusCode: 200, data: [...], timestamp: "..." }
    const actualData = permissionsData?.data?.data || permissionsData?.data;

    if (actualData && Array.isArray(actualData)) {
      const permissions = actualData.map((p: any) => ({
        key: p.id,
        title: `${p.resource}:${p.action}`,
        description: p.description,
        resource: p.resource,
        action: p.action,
      }));
      setAvailablePermissions(permissions);
    }
  }, [permissionsData]);

  const handlePermissionChange = (
    targetKeys: Key[],
    _direction: TransferDirection,
    _moveKeys: Key[],
  ) => {
    const stringTargetKeys = targetKeys.map(key => String(key));
    setSelectedPermissions(stringTargetKeys);
    // Only set form values if form is properly connected
    if (formProps.form && typeof formProps.form.setFieldsValue === 'function') {
      formProps.form.setFieldsValue({ permissionIds: stringTargetKeys });
    }
  };

  const onFinish = (values: any) => {
    const finalValues = {
      ...values,
      permissionIds: selectedPermissions,
    };

    if (formProps.onFinish) {
      return formProps.onFinish(finalValues);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Name is required' },
            { min: 3, message: 'Name must be at least 3 characters' },
          ]}
        >
          <Input placeholder="e.g., Content Editor, Moderator" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ max: 255, message: 'Description must not exceed 255 characters' }]}
        >
          <TextArea rows={3} placeholder="Describe the purpose and responsibilities of this role" />
        </Form.Item>

        <Form.Item
          label="Permissions"
          name="permissionIds"
          rules={[{ required: true, message: 'At least one permission is required' }]}
        >
          <Transfer
            dataSource={availablePermissions}
            targetKeys={selectedPermissions}
            onChange={handlePermissionChange}
            render={item => (
              <div>
                <strong>{item.resource}</strong>: {item.action}
              </div>
            )}
            titles={['Available Permissions', 'Selected Permissions']}
            listStyle={{
              width: 300,
              height: 400,
            }}
            showSearch
            filterOption={(inputValue, option) =>
              option.title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
              option.description?.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
