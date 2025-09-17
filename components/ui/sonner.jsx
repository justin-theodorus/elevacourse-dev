'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const Toaster = (props) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme === 'system' ? 'light' : theme}
			className="toaster group"
			position="top-center"
			richColors
			toastOptions={{
				classNames: {
					title: 'font-bold text-xl text-black',
					description: 'text-white-500 font-bold ',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
