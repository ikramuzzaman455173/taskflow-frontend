import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  RotateCcw,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

interface LoginProps {
  onToggleMode: () => void;
  isLogin: boolean;
}

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function Login({ onToggleMode, isLogin }: LoginProps) {
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || "/dashboard";

  // Reset form when switching between login/signup
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: ""
    });
    setShowPassword(false);
  }, [isLogin]);

  const fillDemoUser = () => {
    setFormData({
      name: isLogin ? "" : "Md. Ikramuzzaman",
      email: "jakaria455173@gmail.com",
      password: "demo123"
    });
    toast.info("Demo user credentials filled!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  const fillAdminUser = () => {
    setFormData({
      name: isLogin ? "" : "Admin User",
      email: "admin@taskflow.com",
      password: "admin123"
    });
    toast.info("Admin credentials filled!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: ""
    });
    setShowPassword(false);
    toast.success("Form cleared successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  const validatePassword = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      // eslint-disable-next-line no-useless-escape
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  const getPasswordStrength = (validation: PasswordValidation): number => {
    const validCount = Object.values(validation).filter(Boolean).length;
    return (validCount / 5) * 100;
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength < 40) return "Weak";
    if (strength < 80) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const generateStrongPassword = (): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";

    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill remaining length with random characters
    const allChars = uppercase + lowercase + numbers + specialChars;
    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setFormData((prev) => ({ ...prev, password: newPassword }));
    toast.success("Strong password generated!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  const handleCopyPassword = async () => {
    if (formData.password) {
      try {
        await navigator.clipboard.writeText(formData.password);
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
        toast.success("Password copied to clipboard!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } catch (err) {
        toast.error("Failed to copy password. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);

        if (success) {
          toast.success("🎉 Welcome back! Login successful!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          // Small delay to show the success message before navigation
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        }
      } else {
        // Validation for signup
        if (!formData.name.trim()) {
          toast.error("⚠️ Please enter your full name.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          setLoading(false);
          return;
        }

        const passwordValidation = validatePassword(formData.password);
        const allValid = Object.values(passwordValidation).every(Boolean);

        if (!allValid) {
          toast.error("🔒 Password does not meet security requirements!", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          setLoading(false);
          return;
        }

        const success = await register(
          formData.name,
          formData.email,
          formData.password
        );
        if (success) {
          toast.success(
            "🎉 Account created successfully! Welcome to TaskFlow!",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            }
          );
          // Small delay to show the success message before navigation
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        }
      }
    } catch (error) {
      toast.error("💥 Something went wrong! Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }

    setLoading(false);
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordStrength = getPasswordStrength(passwordValidation);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-soft p-4">
      <Card className="w-full max-w-md border-2 border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center border-b border-border/50 pb-6 relative">
          {/* Theme Toggle Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full border border-border hover:bg-accent"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-bg flex items-center justify-center shadow-md">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin
              ? "Sign in to your account to continue"
              : "Sign up to get started with TaskFlow"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Auto-fill buttons for login only */}
          {isLogin && (
            <div className="space-y-4 pb-4 border-b border-border/30">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoUser}
                  className="flex items-center gap-2 text-xs border-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-3 w-3" />
                  Demo User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillAdminUser}
                  className="flex items-center gap-2 text-xs border-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </Button>
              </div>

              <div className="p-4 bg-card border-2 border-border rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    User Credentials
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Email:</span>{" "}
                    jakaria455173@gmail.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">
                      Password:
                    </span>{" "}
                    demo123
                  </p>
                </div>
              </div>

              <div className="p-4 bg-card border-2 border-border rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-semibold text-foreground">
                    Admin Credentials
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Email:</span>{" "}
                    admin@taskflow.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">
                      Password:
                    </span>{" "}
                    admin123
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  required={!isLogin}
                  className="border-2 focus:border-primary/50"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                  className="pl-10 border-2 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value
                    }))
                  }
                  placeholder={
                    isLogin ? "Enter your password" : "Create a strong password"
                  }
                  className="pl-10 pr-20 border-2 focus:border-primary/50"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {!isLogin && formData.password && (
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="h-4 w-4 text-muted-foreground hover:text-foreground"
                      title="Copy password"
                    >
                      {passwordCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password generation for signup */}
              {!isLogin && (
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePassword}
                    className="w-full flex items-center gap-2 border-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Generate Strong Password
                  </Button>

                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="space-y-2 p-3 border-2 border-border/30 rounded-lg bg-muted/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Password Strength
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            passwordStrength < 40
                              ? "text-red-500"
                              : passwordStrength < 80
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {getPasswordStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                            passwordStrength
                          )}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>

                      {/* Password requirements */}
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div
                          className={`flex items-center gap-1 ${
                            passwordValidation.minLength
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              passwordValidation.minLength
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          />
                          8+ characters
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            passwordValidation.hasUppercase
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              passwordValidation.hasUppercase
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          />
                          Uppercase letter
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            passwordValidation.hasLowercase
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              passwordValidation.hasLowercase
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          />
                          Lowercase letter
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            passwordValidation.hasNumber
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              passwordValidation.hasNumber
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          />
                          Number
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            passwordValidation.hasSpecialChar
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              passwordValidation.hasSpecialChar
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          />
                          Special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form action buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gradient-bg hover:opacity-90 border-2 border-primary/20"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={resetForm}
                  title="Reset form"
                  className="border-2"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={onToggleMode}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

