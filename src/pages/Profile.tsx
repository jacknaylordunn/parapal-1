
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building, LogOut, ChevronLeft, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [organization, setOrganization] = useState('NHS Ambulance Trust');
  const [role, setRole] = useState(user?.role || 'Paramedic');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving profile
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });
    }, 1000);
  };
  
  const handleSignOut = () => {
    signOut();
  };
  
  return (
    <div className="container max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-1" size={20} />
          Back
        </Button>
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="name" 
                      className="pl-10" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name" 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      className="pl-10" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address" 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="organization" 
                      className="pl-10" 
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Your organization" 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>
                    <Input 
                      id="role" 
                      className="pl-10" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Your role" 
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Account Actions</CardTitle>
            <CardDescription>
              Manage your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleSignOut} className="w-full">
              <LogOut className="mr-2" size={18} />
              Sign out
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            Signing out will end your current session and take you back to the login screen.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
