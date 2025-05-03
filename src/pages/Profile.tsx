
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Edit, Save, X, Shield, Medal, Bookmark, LogOut, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Dummy profile data
const initialProfile = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@ambulance.nhs.uk',
  role: 'Paramedic',
  registrationNumber: 'PA12345',
  employeeId: 'NHS28374',
  station: 'City Central',
  trust: 'London Ambulance Service'
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialProfile);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Demonstrate logout flow with toast notification
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    // Redirect to home page after logout
    setTimeout(() => navigate('/'), 500);
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
        <User size={32} className="text-nhs-blue mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-nhs-dark-blue dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your account information</p>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="professional">Professional Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      name="firstName"
                      value={editedProfile.firstName}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="border rounded-md p-2">{profile.firstName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      name="lastName"
                      value={editedProfile.lastName}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="border rounded-md p-2">{profile.lastName}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="border rounded-md p-2">{profile.email}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your professional credentials and assignment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <Shield className="text-nhs-blue mr-3" />
                <div>
                  <div className="font-semibold">{profile.role}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Registration: {profile.registrationNumber}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <div className="border rounded-md p-2">{profile.employeeId}</div>
                </div>
                <div className="space-y-2">
                  <Label>Station</Label>
                  <div className="border rounded-md p-2">{profile.station}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>NHS Trust</Label>
                <div className="border rounded-md p-2">{profile.trust}</div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contact your manager to update professional details
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center">
                  <Medal className="mr-3 text-nhs-purple" />
                  <div>
                    <div className="font-semibold">Clinical Guidelines</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Set your preferred clinical guideline set
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center">
                  <Bookmark className="mr-3 text-nhs-warm-yellow" />
                  <div>
                    <div className="font-semibold">Saved Favorites</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your saved guidelines and calculators
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                More preferences will be added in future updates
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Log out section */}
      <Card className="mt-8 border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="flex items-center" 
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
      
      {/* Development notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="font-bold">Development Version</p>
        <p className="text-sm">This is a placeholder profile page for demonstration purposes only.</p>
      </div>
    </div>
  );
};

export default Profile;
