'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { registerSchema, loginSchema } from '@/lib/validation/authSchemas';

export default function AuthForm({ children, mode }) {
	const router = useRouter();
	const schema = useMemo(() => (mode === 'signup' ? registerSchema : loginSchema), [mode]);
	const endpoint = mode === 'signup' ? '/auth/email/signup' : '/auth/email/signin';

	const methods = useForm({
		resolver: zodResolver(schema),
		defaultValues: { email: '', password: '' },
		mode: 'onSubmit',
	});

	const onSubmit = async (values) => {
		try {
			const { data } = await axios.post(
				endpoint,
				{
					...values,
					redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/profile` : undefined,
				},
				{
					withCredentials: true,
					timeout: 10000,
					headers: { 'Content-Type': 'application/json' },
				}
			);

			if (mode === 'signup') {
				if (data?.needsEmailConfirmation) {
					toast.success('Registration successful 🎉', {
						description: 'Check your email to confirm your account.',
					});
					methods.reset();
					router.push('/login');
					return;
				}
			}

			methods.reset();
			const redirectTo = data?.redirectTo || '/profile';
			if (typeof window !== 'undefined') {
				window.location.href = redirectTo;
			} else {
				router.push(redirectTo);
			}
		} catch (err) {
			const msg = mode === 'signup' ? 'Sign up failed' : 'Incorrect email or password';
			toast.error(msg);
		}
	};

	return (
		<FormProvider {...methods}>
			<form noValidate className="space-y-4 md:space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
				{children}
			</form>
		</FormProvider>
	);
}
