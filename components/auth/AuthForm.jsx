'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthForm({ children, mode = 'signup' }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [infoMsg, setInfoMsg] = useState('');

	async function handleEmailAuth(e) {
		e.preventDefault();
		setErrorMsg('');
		setInfoMsg('');
		setIsLoading(true);

		try {
			const form = e.currentTarget;
			const fd = new FormData(form);
			const email = String(fd.get('email') || '').trim();
			const password = String(fd.get('password') || '');

			if (!email || !password) {
				setErrorMsg('Email dan password wajib diisi.');
				setIsLoading(false);
				return;
			}

			const endpoint = mode === 'signin' ? '/auth/email/signin' : '/auth/email/signup';

			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					password,
					redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/profile` : undefined,
				}),
			});

			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				setErrorMsg(data?.error || data?.message || 'Something went wrong');
				return;
			}

			if (mode === 'signup') {
				if (data?.needsEmailConfirmation) {
					setInfoMsg('Check your email to confirm your account.');
					form.reset?.();
					router.push('/login');
					return;
				}
			}

			const to = data?.redirectTo || '/profile';
			if (typeof window !== 'undefined') {
				window.location.href = to;
			} else {
				router.push(to);
			}
		} catch (err) {
			setErrorMsg('Network error. Please try again.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form className="space-y-4 md:space-y-5" onSubmit={handleEmailAuth} noValidate>
			<fieldset disabled={isLoading} className="space-y-4 md:space-y-5">
				{children}
			</fieldset>

			{errorMsg ? (
				<p className="text-sm text-red-600" role="alert">
					{errorMsg}
				</p>
			) : null}
			{infoMsg ? <p className="text-sm text-green-600">{infoMsg}</p> : null}

			{isLoading ? <p className="text-xs text-muted-foreground">Please wait…</p> : null}
		</form>
	);
}
