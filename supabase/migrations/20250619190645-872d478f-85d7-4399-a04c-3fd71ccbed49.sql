
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password vault table with client-side encryption
CREATE TABLE public.password_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  website_url TEXT,
  username TEXT,
  encrypted_password TEXT NOT NULL, -- Client-side encrypted
  encrypted_notes TEXT, -- Client-side encrypted
  category TEXT DEFAULT 'general',
  is_favorite BOOLEAN DEFAULT FALSE,
  last_used TIMESTAMP WITH TIME ZONE,
  password_strength INTEGER DEFAULT 0,
  breach_detected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password sharing table
CREATE TABLE public.password_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id UUID REFERENCES public.password_vault(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email TEXT,
  access_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_accessed BOOLEAN DEFAULT FALSE,
  access_count INTEGER DEFAULT 0,
  max_access_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security logs table
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create breach monitoring table
CREATE TABLE public.breach_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  breach_source TEXT NOT NULL,
  breach_date TIMESTAMP WITH TIME ZONE,
  severity TEXT DEFAULT 'medium',
  is_acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breach_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for password vault
CREATE POLICY "Users can view own passwords" ON public.password_vault
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own passwords" ON public.password_vault
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own passwords" ON public.password_vault
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own passwords" ON public.password_vault
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for password shares
CREATE POLICY "Users can view own shares" ON public.password_shares
  FOR SELECT USING (auth.uid() = shared_by);
CREATE POLICY "Users can create shares" ON public.password_shares
  FOR INSERT WITH CHECK (auth.uid() = shared_by);
CREATE POLICY "Users can update own shares" ON public.password_shares
  FOR UPDATE USING (auth.uid() = shared_by);

-- RLS Policies for security logs
CREATE POLICY "Users can view own logs" ON public.security_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create logs" ON public.security_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for breach alerts
CREATE POLICY "Users can view own alerts" ON public.breach_alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.breach_alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_updated_at BEFORE UPDATE ON public.password_vault
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
