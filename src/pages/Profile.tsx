import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Lock, Save, Trash2, User } from 'lucide-react';
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-14">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Profile Settings
            </h1>
            {isDemo && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-border bg-secondary text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Demo Account
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Manage your account credentials</p>
        </div>

        {isDemo && (
          <div className="rounded-xl border border-border bg-secondary/40 p-4 mb-6 text-xs text-muted-foreground">
            You are exploring the shared demo account. Profile edits, password changes, and account
            deletion are disabled in Demo Mode.
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6 mb-5">
          <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Profile Information
          </h2>
          <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium">
                Name
              </Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Email
              </Label>
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
            <Button type="submit" size="sm" disabled={isDemo || profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1.5" />
              )}
              Save Changes
            </Button>
          </form>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 mb-5">
          <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            Change Password
          </h2>
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs font-medium">
                Current Password
              </Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-medium">
                New Password
              </Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium">
                Confirm New Password
              </Label>
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
            <Button type="submit" size="sm" disabled={isDemo || passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Lock className="w-3.5 h-3.5 mr-1.5" />
              )}
              Change Password
            </Button>
          </form>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-card p-6">
          <h2 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Once you delete your account, all your jobs, notes, and reminders will be permanently
            removed.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDemo}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
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
