'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function LoginPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSignIn = async () => {
    const response = await fetch('/auth/signin', {
      method: 'POST',
    });

    if (response.redirected) {
      window.location.href = response.url;
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
      const endpoint = mode === 'signin' ? '/auth/email/signin' : '/auth/email/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          // For signup, provide redirect for email confirmation callback
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/profile` : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Something went wrong');
        return;
      }
      if (mode === 'signin') {
        // If server indicates success, navigate to profile
        window.location.href = data?.redirectTo || '/profile';
        return;
      }
      // signup
      if (data?.needsEmailConfirmation) {
        setInfo('Check your email to confirm your account.');
        setEmail('');
        setPassword('');
        setMode('signin');
        return;
      }
      // If confirmation is not required, go to profile
      window.location.href = '/profile';
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome to ElevaCourse
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={mode === 'signin' ? 'default' : 'outline'}
              onClick={() => setMode('signin')}
              className="w-1/2"
            >
              Email Sign In
            </Button>
            <Button
              variant={mode === 'signup' ? 'default' : 'outline'}
              onClick={() => setMode('signup')}
              className="w-1/2"
            >
              Email Sign Up
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleEmailAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">{error}</p>
            ) : null}
            {info ? (
              <p className="text-sm text-green-600">{info}</p>
            ) : null}

            <Button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait…' : mode === 'signin' ? 'Sign in with Email' : 'Create account'}
            </Button>
          </form>

          <div>
            <Button
              onClick={handleSignIn}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
