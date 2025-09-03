import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            ElevaCourse
          </h1>
          <p className="text-sm text-gray-600">
            Welcome to our learning platform
          </p>
        </div>

        <div>
          <Link href="/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
