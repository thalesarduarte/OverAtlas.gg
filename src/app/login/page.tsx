import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const battleNetEnabled = Boolean(
    process.env.AUTH_BATTLENET_ID && process.env.AUTH_BATTLENET_SECRET
  );

  return <LoginForm battleNetEnabled={battleNetEnabled} />;
}
