import React, { useState } from "react";
import { User, Mail, Lock, LogOut, Save, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // inside your component
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // toggle function
  const togglePassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const success = await updateProfile(profileData.name, profileData.email);
    if (success) {
      toast.success("Profile updated successfully");
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData?.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);

    const success = await changePassword(
      passwordData?.currentPassword,
      passwordData?.newPassword
    );

    if (success) {
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordLoading(false);
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-full">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card className="hover-glow smooth-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profileName">Full Name</Label>
                <Input
                  id="profileName"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      name: e.target.value
                    }))
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileEmail">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profileEmail"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value
                      }))
                    }
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={profileLoading}
              className="gradient-bg"
            >
              {profileLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="hover-glow smooth-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))
                  }
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value
                      }))
                    }
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))
                    }
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={passwordLoading}
              className="gradient-bg"
            >
              {passwordLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="hover-glow smooth-transition">
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">
                Sign out from your current session
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          {/* git hub account this project */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">GitHub Repository</h4>
              <p className="text-sm text-muted-foreground">
                View the source code for this project
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                window.open("https://github.com/ikramuzzaman455173/taskflow", "_blank")
              }
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
