import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Lock, Save, Sparkles, Trash2, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import {
  PasswordFormValues,
  ProfileFormValues,
  passwordSchema,
  profileSchema,
} from '@/schemas/forms';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDemo = Boolean(user?.isDemo);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name, email: user.email });
    }
  }, [user, profileForm]);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      const response = await authApi.updateProfile(values);
      login(response.user, response.token);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const handleChangePassword = async (values: PasswordFormValues) => {
    try {
      await authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authApi.deleteAccount();
      toast.success('Account deleted');
      logout();
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            {isDemo && (
              <Badge variant="default" className="gap-1">
                <Sparkles className="w-3 h-3" />
                Demo Account
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {isDemo && (
          <div className="glass rounded-xl p-4 mb-6 border-primary/30 text-sm text-muted-foreground">
            You are exploring the shared demo account. Profile edits, password changes, and account
            deletion are disabled in Demo Mode.
          </div>
        )}

        <div className="glass rounded-xl p-8 mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </h2>
          <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                disabled={isDemo}
                {...profileForm.register('name')}
              />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                disabled={isDemo}
                {...profileForm.register('email')}
              />
              {profileForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isDemo || profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </form>
        </div>

        <div className="glass rounded-xl p-8 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Change Password
          </h2>
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                disabled={isDemo}
                {...passwordForm.register('currentPassword')}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                disabled={isDemo}
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                disabled={isDemo}
                {...passwordForm.register('confirmPassword')}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isDemo || passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Change Password
            </Button>
          </form>
        </div>

        <div
          className="glass rounded-xl p-8 border-destructive/20 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-muted-foreground mb-4">
            Once you delete your account, all your data will be permanently removed. This action
            cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDemo}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? All your jobs, notes, and reminders will be permanently deleted. This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Profile;
