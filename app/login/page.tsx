import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Electra International",
  description: "Secure login to Electra International for personalized experience and exclusive offers.",
};

export default function LoginPage() {
  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </section>
  );
}
