
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [plan, setPlan] = useState<'free' | 'starter' | 'pro' | 'premium'>(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'starter' || planParam === 'pro' || planParam === 'premium') {
      return planParam;
    }
    return 'free';
  });
  const [error, setError] = useState<string | null>(null);

  // Update URL when plan changes
  useEffect(() => {
    if (plan !== 'free') {
      navigate(`/register?plan=${plan}`, { replace: true });
    } else {
      navigate('/register', { replace: true });
    }
  }, [plan, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      await registerUser(email, password, username);
      navigate('/onboarding');
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-lg mx-auto px-4 py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Enter your details to create your BioBloom account</p>
        </div>
        <div className="bg-background p-6 rounded-lg border shadow-sm">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be your BioBloom URL: biobloom.com/{username || 'yourusername'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label>Select your plan</Label>
              <RadioGroup value={plan} onValueChange={(value) => setPlan(value as any)} className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <RadioGroupItem 
                    value="free" 
                    id="free" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="free"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 font-semibold text-center">Free</div>
                    <div className="text-sm text-muted-foreground text-center">Basic features</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="starter" 
                    id="starter" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="starter"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 font-semibold text-center">Starter</div>
                    <div className="text-sm text-muted-foreground text-center">R$ 15/month</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="pro" 
                    id="pro" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="pro"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 font-semibold text-center">Pro</div>
                    <div className="text-sm text-muted-foreground text-center">R$ 29/month</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="premium" 
                    id="premium" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="premium"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 font-semibold text-center">Premium</div>
                    <div className="text-sm text-muted-foreground text-center">R$ 85/month</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
