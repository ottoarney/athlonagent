import { motion } from 'framer-motion';
import { Building2, Users, Bell, Shield, Palette } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export default function Settings() {
  return (
    <AppLayout>
      <motion.div 
        className="max-w-3xl mx-auto space-y-8"
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeIn}>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your workspace and preferences
          </p>
        </motion.div>

        {/* Organization */}
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Organization</h2>
              <p className="text-sm text-muted-foreground">Manage your agency details</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" defaultValue="Elite Sports Management" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-logo">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-primary/5 flex items-center justify-center">
                  <span className="font-display text-xl font-bold">ESM</span>
                </div>
                <Button variant="outline" size="sm">Upload</Button>
              </div>
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* Team & Roles */}
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Team & Roles</h2>
              <p className="text-sm text-muted-foreground">Manage permissions for your team</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Agent (Admin)</p>
                <p className="text-sm text-muted-foreground">Full access to all features</p>
              </div>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                Your role
              </span>
            </div>            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Parent/Guardian</p>
                <p className="text-sm text-muted-foreground">View-only access to athlete info</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* Notifications */}
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure how you receive updates</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deadline reminders</p>
                <p className="text-sm text-muted-foreground">Get notified 72h before deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deal updates</p>
                <p className="text-sm text-muted-foreground">Notifications when deals progress</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* Appearance */}
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize your interface</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact view</p>
                <p className="text-sm text-muted-foreground">Reduce spacing in lists and tables</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show athlete avatars</p>
                <p className="text-sm text-muted-foreground">Display initials in cards and lists</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* Security */}
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">Protect your account</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-factor authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={fadeIn} className="flex justify-end pb-8">
          <Button size="lg">Save Changes</Button>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
