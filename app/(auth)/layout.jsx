import { Toaster } from '@/components/ui/sonner';
export const metadata = {
	title: 'Auth',
	description: 'Login and Register',
};

export default function AuthLayout({ children }) {
	return (
		<main className="min-h-screen bg-cover bg-center bg-[url('/images/auth/background-auth.svg')]" role="main">
			<Toaster />
			{children}
		</main>
	);
}
