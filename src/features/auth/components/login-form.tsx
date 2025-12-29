"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginUserData, loginUserSchema } from "@/features/auth/auth.schema";
import { loginUserAction } from "@/features/auth/server/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginFrom: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (data: LoginUserData) => {
    const result = await loginUserAction(data);

    if (result.status === "success") toast.success(result.message);
    else toast.error(result.message);
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:px-6">
      <Card className="w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <UserCheck className="h-7 w-7 text-primary-foreground" />
          </div>

          <CardTitle className="text-xl sm:text-2xl">
            Join Our Job Portal
          </CardTitle>

          <CardDescription className="text-sm sm:text-base">
            Create your account to get started
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`pl-10 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 ${
                      errors.password ? "border-destructive" : ""
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-0 top-0 h-full px-3 flex items-center text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Login Account
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginFrom;
