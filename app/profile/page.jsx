import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

async function signOut() {
  'use server';

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-center mb-6">
            {user.user_metadata?.avatar_url ? (
              <img
                className="w-20 h-20 rounded-full border-4 border-blue-500"
                src={user.user_metadata.avatar_url}
                alt="Profile"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xl font-semibold">
                  {user.user_metadata?.full_name?.charAt(0) ||
                    user.email?.charAt(0) ||
                    '?'}
                </span>
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to ElevaCourse!
            </h1>
            <p className="text-gray-600">You are successfully signed in</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Full Name
              </h3>
              <p className="text-gray-900">
                {user.user_metadata?.full_name || 'Not provided'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                User ID
              </h3>
              <p className="text-gray-900 text-sm font-mono">{user.id}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Provider
              </h3>
              <p className="text-gray-900 capitalize">
                {user.app_metadata?.provider || 'Google'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Last Sign In
              </h3>
              <p className="text-gray-900">
                {new Date(user.last_sign_in_at).toLocaleString()}
              </p>
            </div>
          </div>

          <form action={signOut}>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
