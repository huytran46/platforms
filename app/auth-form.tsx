"use client";

import { login, signup } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, useActionState } from "react";

function TextInput({
  defaultValue,
  label,
  id,
  placeholder,
  required,
  type,
}: {
  defaultValue?: string;
  label?: ReactNode;
  id?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            id={id}
            name={id}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className="w-full rounded-r-none focus:z-10"
            required={required}
            type={type}
          />
        </div>
      </div>
    </div>
  );
}

type AuthState = {
  error?: string;
};

export function LoginForm() {
  const [state, action, isPending] = useActionState<AuthState, FormData>(
    login,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      <TextInput
        id="email"
        label="Email"
        placeholder="Email"
        type="email"
        required
      />
      <TextInput
        id="password"
        label="Password"
        placeholder="Password"
        type="password"
        required
      />

      {state?.error && (
        <div className="text-sm text-red-500">{state.error}</div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}

export function SignupForm() {
  const [state, action, isPending] = useActionState<AuthState, FormData>(
    signup,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      <TextInput
        id="email"
        label="Email"
        placeholder="Email"
        type="email"
        required
      />
      <TextInput
        id="password"
        label="Password"
        placeholder="Password"
        type="password"
        required
      />
      <TextInput
        id="confirm-password"
        label="Confirm Password"
        placeholder="Confirm Password"
        type="password"
        required
      />

      {state?.error && (
        <div className="text-sm text-red-500">{state.error}</div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
}
