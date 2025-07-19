import { useState } from "react";
import ASSET_IMAGES from "../../assets/picture/Direct_Energy_logo.svg.png";
import background2 from "../../assets/EV Car.jpeg";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  theme,
  Typography,
  message,
} from "antd";
import { IoPlayCircle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/httpLogin";
import { useSearchParams } from "react-router-dom";

const { useToken } = theme;

const ResetPasswordForm = () => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const onFinish = async (values: any) => {
  const { password, newpassword } = values;

  if (password !== newpassword) {
    message.error("New password and confirm password must be the same!");
    return;
  }

  setLoading(true);

  if (!email) {
    message.error("Email ไม่ถูกต้อง หรือหมดเวลา กรุณาลองใหม่");
    setLoading(false);
    return;
  }

  try {
    const res = await resetPassword({
      email: email,       
      new_password: newpassword,
    });

     if (res) {
    message.success("เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่");
    setTimeout(() => {
      navigate("/");
    }, 2500);
  } else {
      message.error("เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่");
    }
  } catch (error) {
    message.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-h-screen p-4 md:p-8 xl:p-20"
      style={{ backgroundColor: token.colorBgLayout }}
    >
      {/* FORM */}
      <div className="col-span-12 lg:col-span-6 flex justify-center lg:order-2">
        <Card
          className="h-full w-full"
          classNames={{
            body: "p-4 sm:p-8 max-w-[700px] mx-auto flex flex-col justify-around h-full",
          }}
          bordered={false}
        >
          {/* Logo */}
          <div className="mb-8">
            <Link to={"#"}>
              <Image
                src={ASSET_IMAGES}
                alt="logo"
                className="w-[70px] sm:w-[90px]"
                style={{ width: "150px" }}
                preview={false}
              />
            </Link>
          </div>

          {/* Title & Form */}
          <div className="mb-4">
            <Typography.Title
              level={2}
              className="text-3xl sm:text-4xl font-semibold mb-2.5"
              style={{ color: token.colorTextHeading }}
            >
              Reset Password
            </Typography.Title>

            <Form layout="vertical" className="mb-10" onFinish={onFinish}>
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="New Password" size="large" />
              </Form.Item>

              <Form.Item
                name="newpassword"
                label="Confirm New Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Retype New Password" size="large" />
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit" size="large" loading={loading}>
                  Reset
                </Button>
              </Form.Item>
            </Form>

            <Typography.Text className="text-sm">
              Already have an account?{" "}
              <Link to={"/auth/login-1"}>Login here</Link> or{" "}
              <Link to={"/auth/signup-1"}>Create New</Link>
            </Typography.Text>
          </div>
        </Card>
      </div>

      {/* IMAGE + DESCRIPTION */}
      <div className="col-span-12 lg:col-span-6 lg:order-1">
        <div className="flex flex-col h-full justify-center items-center">
          <div className="w-full max-w-2xl px-4 sm:px-8 space-y-10">
            <Typography.Text className="text-base sm:text-xl font-light">
              Please enter your new password below to securely reset your
              account credentials.
            </Typography.Text>

            <div>
              <img
                src={background2}
                alt="reset-password-img"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            <Link className="block text-primary" to={"#"}>
              <span className="inline-flex items-center gap-2 text-base">
                <IoPlayCircle />
                How it works
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
