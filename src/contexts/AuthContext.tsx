
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  organizationId?: string;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('parapal_user');
        const lastActivity = localStorage.getItem('parapal_last_activity');
        
        if (userData && lastActivity) {
          const parsedUser = JSON.parse(userData);
          const lastActivityTime = parseInt(lastActivity, 10);
          const currentTime = Date.now();
          
          // Check if session has expired (15 minutes of inactivity)
          if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
            // Session expired, log the user out
            localStorage.removeItem('parapal_user');
            localStorage.removeItem('parapal_last_activity');
            setUser(null);
          } else {
            // Session is still valid
            setUser(parsedUser);
            // Update last activity time
            localStorage.setItem('parapal_last_activity', currentTime.toString());
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('parapal_user');
        localStorage.removeItem('parapal_last_activity');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Setup inactivity tracking
  useEffect(() => {
    if (!user) return;
    
    // Reset inactivity timer whenever there's user activity
    const resetInactivityTimer = () => {
      localStorage.setItem('parapal_last_activity', Date.now().toString());
    };
    
    // Events that reset the inactivity timer
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'touchmove', 'touchend'
    ];
    
    // Attach event listeners
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
    
    // Check session periodically
    const checkSessionInterval = setInterval(() => {
      const lastActivity = localStorage.getItem('parapal_last_activity');
      if (lastActivity) {
        const lastActivityTime = parseInt(lastActivity, 10);
        const currentTime = Date.now();
        
        if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
          // Session expired, log the user out
          signOut();
          toast({
            title: "Session Expired",
            description: "You have been logged out due to inactivity",
            variant: "destructive"
          });
        }
      }
    }, 60000); // Check every minute
    
    // Clean up
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      clearInterval(checkSessionInterval);
    };
  }, [user, toast]);
  
  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login for any email/password
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, check if email has a valid format
      if (!email.includes('@')) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return false;
      }
      
      // For demo, check if password is at least 6 characters
      if (password.length < 6) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        return false;
      }
      
      // Create a mock user based on the email
      const mockUser: User = {
        id: `user_${Math.random().toString(36).slice(2, 10)}`,
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        organizationId: 'org_default'
      };
      
      // Store user in local storage
      localStorage.setItem('parapal_user', JSON.stringify(mockUser));
      localStorage.setItem('parapal_last_activity', Date.now().toString());
      
      // Update state
      setUser(mockUser);
      
      // Show success toast
      toast({
        title: "Welcome back",
        description: `You are now logged in as ${mockUser.name}`
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Sign up function
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call to register a new user
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!name || name.length < 2) {
        toast({
          title: "Invalid Name",
          description: "Please enter a valid name",
          variant: "destructive"
        });
        return false;
      }
      
      if (!email.includes('@')) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return false;
      }
      
      if (password.length < 6) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        return false;
      }
      
      // Create a new user
      const newUser: User = {
        id: `user_${Math.random().toString(36).slice(2, 10)}`,
        name,
        email,
        role: 'user',
        organizationId: 'org_default'
      };
      
      // Store user in local storage
      localStorage.setItem('parapal_user', JSON.stringify(newUser));
      localStorage.setItem('parapal_last_activity', Date.now().toString());
      
      // Update state
      setUser(newUser);
      
      // Show success toast
      toast({
        title: "Account Created",
        description: `Welcome to ParaPal, ${name}!`
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Sign out function
  const signOut = () => {
    // Remove user data from local storage
    localStorage.removeItem('parapal_user');
    localStorage.removeItem('parapal_last_activity');
    
    // Update state
    setUser(null);
    
    // Redirect to signin page
    navigate('/auth/signin');
    
    // Show success toast
    toast({
      title: "Signed Out",
      description: "You have been successfully logged out"
    });
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        signIn, 
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
