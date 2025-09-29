import React, { useState, useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Transfer, Alert } from "antd";
import type { Key } from "antd/es/table/interface";
import type { TransferDirection } from "antd/es/transfer";
import { useCustom, useApiUrl } from "@refinedev/core";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

export const RoleEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const roleData = queryResult?.data?.data;
  const { id: roleId } = useParams();
  const apiUrl = useApiUrl();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([]);

  // Fetch available permissions
  const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useCustom({
    url: "/admin/roles/permissions",
    method: "get",
  });

  useEffect(() => {
    if (permissionsError || permissionsLoading || !permissionsData) {
      return;
    }

    // The backend returns data in the format: { statusCode, data: PermissionResponse[], timestamp }
    // Refine useCustom wraps this in another data property, so we get: { data: { data: PermissionResponse[] } }
    const permissions = permissionsData?.data?.data || permissionsData?.data || [];

    if (Array.isArray(permissions) && permissions.length > 0) {
      const mappedPermissions = permissions.map((permission: any) => ({
        key: permission.id,
        title: `${permission.resource}:${permission.action}`,
        description: permission.description || permission.name || 'No description',
        resource: permission.resource,
        action: permission.action,
      }));

      setAvailablePermissions(mappedPermissions);
    }
  }, [permissionsData, permissionsLoading, permissionsError]);

  useEffect(() => {
    if (roleData?.permissions && Array.isArray(roleData.permissions)) {
      const selectedPermissionIds = roleData.permissions
        .map((permission: any) => permission.id || permission.permissionId)
        .filter(Boolean);

      setSelectedPermissions(selectedPermissionIds);
      setOriginalPermissions(selectedPermissionIds); // Store original permissions for comparison
    }
  }, [roleData]);

  const handlePermissionChange = (targetKeys: Key[], _direction: TransferDirection, _moveKeys: Key[]) => {
    const stringTargetKeys = targetKeys.map(key => String(key));
    setSelectedPermissions(stringTargetKeys);
    // Don't set permissionIds in the form since the backend doesn't expect it
  };

  const updateRolePermissions = async (roleId: string, originalPerms: string[], newPerms: string[]) => {
    // Find permissions to add and remove
    const permissionsToAdd = newPerms.filter(id => !originalPerms.includes(id));
    const permissionsToRemove = originalPerms.filter(id => !newPerms.includes(id));

    // Use useCustom hook for each API call (executed sequentially for now)
    for (const permissionId of permissionsToAdd) {
      await fetch(`${apiUrl}/admin/roles/${roleId}/permissions/${permissionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Refine typically stores token as 'access_token'
        },
      });
    }

    for (const permissionId of permissionsToRemove) {
      await fetch(`${apiUrl}/admin/roles/${roleId}/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    }
  };

  const onFinish = async (values: any) => {
    try {
      // Remove permissionIds from values since the backend doesn't expect it
      const { permissionIds, ...roleUpdateValues } = values;

      // First update the basic role information
      if (formProps.onFinish) {
        await formProps.onFinish(roleUpdateValues);
      }

      // Then update permissions if they changed
      if (roleId && originalPermissions.toString() !== selectedPermissions.toString()) {
        await updateRolePermissions(roleId, originalPermissions, selectedPermissions);
        setOriginalPermissions([...selectedPermissions]); // Update original permissions
      }

    } catch (error) {
      console.error('Error updating role:', error);
      throw error; // Re-throw to let Refine handle the error display
    }
  };

  // Show error if permissions failed to load
  if (permissionsError) {
    return (
      <Edit saveButtonProps={{ ...saveButtonProps, disabled: true }}>
        <Alert
          message="Failed to Load Permissions"
          description={`Error loading permissions: ${permissionsError.message || 'Unknown error'}`}
          type="error"
          showIcon
        />
      </Edit>
    );
  }

  // Show loading state
  if (permissionsLoading) {
    return (
      <Edit saveButtonProps={{ ...saveButtonProps, disabled: true }}>
        <Alert
          message="Loading Permissions"
          description="Please wait while permissions are being loaded..."
          type="info"
          showIcon
        />
      </Edit>
    );
  }

  // Check if this is a system role that shouldn't be edited
  if (roleData?.isDefault) {
    return (
      <Edit saveButtonProps={{ ...saveButtonProps, disabled: true }}>
        <Alert
          message="Default System Role"
          description="Default system roles cannot be edited for security reasons."
          type="warning"
          showIcon
        />
        <Form {...formProps} layout="vertical" disabled>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Edit>
    );
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Permissions"
          name="permissionIds"
        >
          <Transfer
            dataSource={availablePermissions}
            targetKeys={selectedPermissions}
            onChange={handlePermissionChange}
            render={(item) => (
              <div>
                <strong>{item.resource}</strong>: {item.action}
              </div>
            )}
            titles={["Available Permissions", "Selected Permissions"]}
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
    </Edit>
  );
};
