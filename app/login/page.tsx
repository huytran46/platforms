import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/auth-form";

export default async function HomePage() {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Hi class
          </h1>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            👋
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            We&apos;re building a system to manage ACB&apos;s ATM in HCMC.
            <br />
            Log in if you&apos;re a student of <strong>IT2030.CH190</strong>.
            <br />
          </p>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <LoginForm />
          {/* <Separator />
          <div className="w-full flex items-center justify-center mt-4">
            <span className="text-center text-sm text-gray-500">
              Or{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-500 hover:underline"
              >
                sign up
              </Link>{" "}
              if you&apos;re a new user
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
