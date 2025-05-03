
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, UserPlus, Users, Settings, ChevronLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  joinedOn: string;
}

interface Organization {
  id: string;
  name: string;
  type: string;
  plan: string;
  memberCount: number;
  created: string;
  logo?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@ambulance.nhs.uk', role: 'Admin', status: 'active', joinedOn: '2024-03-15' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@ambulance.nhs.uk', role: 'User', status: 'active', joinedOn: '2024-04-01' },
  { id: '3', name: 'Michael Brown', email: 'michael.b@ambulance.nhs.uk', role: 'User', status: 'active', joinedOn: '2024-04-08' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@ambulance.nhs.uk', role: 'User', status: 'pending', joinedOn: '2024-04-28' },
  { id: '5', name: 'David Wilson', email: 'david.w@ambulance.nhs.uk', role: 'User', status: 'inactive', joinedOn: '2024-02-20' }
];

const mockOrg: Organization = {
  id: '1',
  name: 'London Ambulance Service',
  type: 'NHS Trust',
  plan: 'Enterprise',
  memberCount: 5,
  created: '2024-01-15',
};

const OrganizationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [organization, setOrganization] = useState<Organization>(mockOrg);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('User');
  const [orgSettings, setOrgSettings] = useState({
    enableSSOLogin: true,
    allowPublicLinks: false,
    twoFactorRequired: true,
    autoJoinDomain: true
  });
  
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    });
    
    // Reset form
    setInviteEmail('');
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setOrgSettings({
      ...orgSettings,
      [setting]: value
    });
    
    toast({
      title: "Setting updated",
      description: `Organization setting has been updated`,
    });
  };

  const handleUpdateStatus = (userId: string, newStatus: 'active' | 'pending' | 'inactive') => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, status: newStatus} : user
    ));
    
    toast({
      title: "User updated",
      description: `User status has been changed to ${newStatus}`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
          aria-label="Go back to home"
        >
          <ChevronLeft size={24} />
        </Button>
        <Building size={32} className="text-nhs-blue mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">{organization.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Organization Management Dashboard</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="settings">Organization Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage users in your organization</CardDescription>
                </div>
                <Button onClick={() => navigate('/organizations/invite')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`h-2 w-2 rounded-full mr-2 ${
                            user.status === 'active' ? 'bg-green-500' :
                            user.status === 'pending' ? 'bg-amber-500' :
                            'bg-gray-300'
                          }`}></span>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(user.joinedOn).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "Edit user",
                            description: "This feature is not yet implemented"
                          });
                        }}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send invitations to new users</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="colleague@nhs.net"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-transparent"
                  >
                    <option value="Admin">Administrator</option>
                    <option value="User">Standard User</option>
                    <option value="Viewer">Viewer (Read-only)</option>
                  </select>
                  <p className="text-sm text-muted-foreground">
                    Admins can manage users and organization settings
                  </p>
                </div>
                
                <Button type="submit">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Manage your organization preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Organization Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input value={organization.name} onChange={(e) => 
                      setOrganization({...organization, name: e.target.value})
                    } />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization Type</Label>
                    <select
                      value={organization.type}
                      onChange={(e) => setOrganization({...organization, type: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-transparent"
                    >
                      <option value="NHS Trust">NHS Trust</option>
                      <option value="Ambulance Service">Ambulance Service</option>
                      <option value="Private Provider">Private Provider</option>
                      <option value="Educational Institution">Educational Institution</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sso-toggle">Enable SSO Login</Label>
                      <p className="text-sm text-muted-foreground">Allow users to sign in with your organization's SSO provider</p>
                    </div>
                    <Switch 
                      id="sso-toggle" 
                      checked={orgSettings.enableSSOLogin}
                      onCheckedChange={(checked) => handleSettingChange('enableSSOLogin', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="2fa-toggle">Require Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Enforce 2FA for all organization members</p>
                    </div>
                    <Switch 
                      id="2fa-toggle" 
                      checked={orgSettings.twoFactorRequired}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorRequired', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="domain-toggle">Auto-join Users with Organization Email Domain</Label>
                      <p className="text-sm text-muted-foreground">Users with matching email domains are automatically added</p>
                    </div>
                    <Switch 
                      id="domain-toggle" 
                      checked={orgSettings.autoJoinDomain}
                      onCheckedChange={(checked) => handleSettingChange('autoJoinDomain', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Settings saved",
                  description: "Your organization settings have been updated"
                });
              }}>Save Organization Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Development notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="font-bold">Development Version</p>
        <p className="text-sm">This is a placeholder organization management page for demonstration purposes only.</p>
      </div>
    </div>
  );
};

export default OrganizationPage;
