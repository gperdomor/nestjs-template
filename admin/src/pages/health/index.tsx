import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Progress,
  Typography,
  Button,
  Space,
  Alert,
  Descriptions,
  List,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useCustom } from '@refinedev/core';

const { Title, Text } = Typography;

export const HealthMonitor: React.FC = () => {
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: healthResponse, refetch } = useCustom({
    url: '/admin/health',
    method: 'get',
  });

  const { data: dbHealthResponse, refetch: refetchDb } = useCustom({
    url: '/admin/health/database',
    method: 'get',
  });

  const { data: readinessResponse, refetch: refetchReadiness } = useCustom({
    url: '/admin/health/readiness',
    method: 'get',
  });

  const { data: livenessResponse, refetch: refetchLiveness } = useCustom({
    url: '/admin/health/liveness',
    method: 'get',
  });

  // Extract nested data from responses
  // Since useCustom returns response.data and backend wraps in { data: ... }, we need response.data.data
  const healthData = healthResponse?.data?.data;
  const dbHealthData = dbHealthResponse?.data?.data;
  const readinessData = readinessResponse?.data?.data;
  const livenessData = livenessResponse?.data?.data;

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes

    setIsRefreshing(true);
    try {
      await Promise.all(
        [refetch?.(), refetchDb?.(), refetchReadiness?.(), refetchLiveness?.()].filter(Boolean),
      );
      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to refresh health data:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [refetch, refetchDb, refetchReadiness, refetchLiveness, isRefreshing]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [handleRefresh]);

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'default';
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'up':
      case 'ok':
      case 'healthy':
      case 'ready':
      case 'alive':
      case 'connected':
        return 'success';
      case 'down':
      case 'error':
      case 'unhealthy':
      case 'disconnected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <ClockCircleOutlined />;
    const normalizedStatus = status.toLowerCase();
    const isHealthy = ['up', 'ok', 'healthy', 'ready', 'alive', 'connected'].includes(
      normalizedStatus,
    );
    return isHealthy ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Health Monitor</Title>
          <Text type="secondary">Last checked: {lastChecked.toLocaleTimeString()}</Text>
        </Col>
        <Col>
          <Button
            icon={<ReloadOutlined spin={isRefreshing} />}
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Overall System Health */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              System Status
            </Title>
          </Col>
          <Col>
            <Tag
              icon={getStatusIcon(healthData?.data?.status)}
              color={getStatusColor(healthData?.data?.status)}
              style={{ fontSize: 16, padding: '4px 12px' }}
            >
              {healthData?.data?.status?.toUpperCase() || 'UNKNOWN'}
            </Tag>
          </Col>
        </Row>
        {healthData?.data?.message && (
          <Alert
            message={healthData.data.message}
            type={healthData?.data?.status === 'ok' ? 'success' : 'warning'}
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      {/* Service Health Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <DatabaseOutlined style={{ fontSize: 24 }} />
                <Text strong>Database</Text>
              </Space>
              <Tag
                color={getStatusColor(dbHealthData?.status)}
                icon={getStatusIcon(dbHealthData?.status)}
              >
                {dbHealthData?.status?.toUpperCase() || 'CHECKING...'}
              </Tag>
              {dbHealthData?.responseTime && (
                <Text type="secondary">Response time: {dbHealthData.responseTime}ms</Text>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <ApiOutlined style={{ fontSize: 24 }} />
                <Text strong>API</Text>
              </Space>
              <Tag
                color={getStatusColor(readinessData?.status)}
                icon={getStatusIcon(readinessData?.status)}
              >
                {readinessData?.status?.toUpperCase() || 'CHECKING...'}
              </Tag>
              {healthData?.uptime && (
                <Text type="secondary">Uptime: {Math.floor(healthData.uptime / 3600)}h</Text>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <ClockCircleOutlined style={{ fontSize: 24 }} />
                <Text strong>System</Text>
              </Space>
              <Tag
                color={getStatusColor(healthData?.status)}
                icon={getStatusIcon(healthData?.status)}
              >
                {healthData?.status?.toUpperCase() || 'CHECKING...'}
              </Tag>
              {healthData?.environment && (
                <Text type="secondary">Environment: {healthData.environment}</Text>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Detailed Information */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Readiness Check">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(readinessData?.status)}>
                  {readinessData?.status || 'Unknown'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Database">
                <Tag color={readinessData?.database ? 'success' : 'error'}>
                  {readinessData?.database ? 'Connected' : 'Disconnected'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Liveness Check">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(livenessData?.status)}>
                  {livenessData?.status || 'Unknown'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Memory Usage">
                <Progress
                  percent={livenessData?.memoryUsage || 0}
                  status={livenessData?.memoryUsage > 90 ? 'exception' : 'normal'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="CPU Usage">
                <Progress
                  percent={livenessData?.cpuUsage || 0}
                  status={livenessData?.cpuUsage > 90 ? 'exception' : 'normal'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Process Uptime">
                <Text>
                  {livenessData?.uptime
                    ? `${Math.floor(livenessData.uptime / 3600)}h ${Math.floor(
                        (livenessData.uptime % 3600) / 60,
                      )}m`
                    : 'Unknown'}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Recent Issues */}
      {healthData?.issues && healthData.issues.length > 0 && (
        <Card title="Recent Issues" style={{ marginTop: 24 }}>
          <List
            dataSource={healthData.issues}
            renderItem={(issue: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Tag color={issue.severity === 'error' ? 'error' : 'warning'}>
                      {issue.severity}
                    </Tag>
                  }
                  title={issue.service}
                  description={issue.message}
                />
                <Text type="secondary">{new Date(issue.timestamp).toLocaleString()}</Text>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};
