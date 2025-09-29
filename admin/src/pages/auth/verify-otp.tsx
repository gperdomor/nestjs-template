import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomMutation } from "@refinedev/core";

const { Title, Text } = Typography;

export const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || localStorage.getItem("otp_user_id");
  const [loading, setLoading] = useState(false);

  const { mutate: verifyOtp } = useCustomMutation();

  const handleSubmit = (values: any) => {
    setLoading(true);
    verifyOtp(
      {
        url: `/auth/verify-otp/${userId}`,
        method: "post",
        values: { otp: values.otp },
      },
      {
        onSuccess: (data: any) => {
          const { accessToken, refreshToken, user } = data.data;
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.removeItem("otp_user_id");
          
          message.success("2FA verification successful");
          navigate("/");
        },
        onError: () => {
          message.error("Invalid OTP code. Please try again.");
          setLoading(false);
        },
      }
    );
  };

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f0f2f5"
    }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <SafetyOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          <Title level={3} style={{ marginTop: 16 }}>Two-Factor Authentication</Title>
          <Text type="secondary">
            Enter the 6-digit code from your authenticator app
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Please enter your OTP code" },
              { len: 6, message: "OTP must be 6 digits" },
              { pattern: /^\d+$/, message: "OTP must contain only digits" },
            ]}
          >
            <Input
              size="large"
              placeholder="000000"
              maxLength={6}
              style={{ textAlign: "center", fontSize: 24, letterSpacing: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Verify
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button type="link" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};