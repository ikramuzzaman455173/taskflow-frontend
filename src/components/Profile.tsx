
import React, { useState } from 'react';
import { User, Mail, Lock, LogOut, Save, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateProfile(profileData.name, profileData.email);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    
    setLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (success) {
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast({
        title: "Invalid Password",
        description: "Current password is incorrect.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
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
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
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
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
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
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="gradient-bg">
              {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4 mr-2" />}
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
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="gradient-bg">
              {loading ? <LoadingSpinner size="sm" /> : <Lock className="h-4 w-4 mr-2" />}
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

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Demo Account</h4>
              <p className="text-sm text-muted-foreground">
                This is a demo account with sample data
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="h-4 w-4" />
              <span>Demo Mode</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
