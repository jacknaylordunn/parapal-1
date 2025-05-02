
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Sun, Moon, Laptop, BellRing, Database, Lock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    alerts: true,
    updates: true,
    reminders: false
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Local data cleared",
      description: "All local data has been removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <SettingsIcon size={32} className="text-nhs-blue mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your application preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" /> 
              Appearance
            </CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" /> Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" /> Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" /> System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" /> 
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alerts">Clinical Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for high-risk clinical findings
                </p>
              </div>
              <Switch 
                id="alerts" 
                checked={notifications.alerts}
                onCheckedChange={(checked) => setNotifications({...notifications, alerts: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="updates">App Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when guidelines or app updates are available
                </p>
              </div>
              <Switch 
                id="updates" 
                checked={notifications.updates}
                onCheckedChange={(checked) => setNotifications({...notifications, updates: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminders">Shift Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders for end-of-shift documentation
                </p>
              </div>
              <Switch 
                id="reminders" 
                checked={notifications.reminders}
                onCheckedChange={(checked) => setNotifications({...notifications, reminders: checked})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Save Notification Preferences</Button>
          </CardFooter>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> 
              Data Management
            </CardTitle>
            <CardDescription>Manage your local data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Local Storage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your patient encounters are stored locally on this device.
              </p>
              <Button variant="destructive" onClick={handleClearData}>Clear All Local Data</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> 
              Security
            </CardTitle>
            <CardDescription>Manage security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-nhs-blue" />
                <h3 className="font-medium">Application Inactivity Timeout</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                For security, the application will log you out after 15 minutes of inactivity.
              </p>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes (recommended)</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>Save Security Settings</Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Development notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="font-bold">Development Version</p>
        <p className="text-sm">This is a placeholder settings page for demonstration purposes only.</p>
      </div>
    </div>
  );
};

export default Settings;
