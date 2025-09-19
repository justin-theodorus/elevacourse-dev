'use client';

import { Button } from '@/components/ui/button';
// import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const PROVIDERS = [
	// {
	// 	key: 'facebook',
	// 	label: 'Login with Facebook',
	// 	Icon: FaFacebook,
	// 	iconClass: 'text-[#0C82EE]',
	// },
	{
		key: 'google',
		label: 'Login with Google',
		Icon: FcGoogle,
		iconClass: '',
	},
];

export default function AuthSocialButtons() {
	const signIn = async () => {
		const res = await fetch('/auth/signin', { method: 'POST' });
		if (res.redirected) window.location.href = res.url;
	};
	return (
		<div className={`mb-5 space-y-3 md:space-y-4`}>
			{PROVIDERS.map(({ key, label, Icon, iconClass }) => (
				<Button key={key} onClick={signIn} type="button" variant="outline" aria-label={label} className="h-11 w-full rounded-full justify-center gap-2.5 border border-gray-200 hover:bg-gray-100">
					<Icon className={`size-5 ${iconClass}`} />
					<span className="text-sm md:text-base">{label}</span>
				</Button>
			))}
		</div>
	);
}
