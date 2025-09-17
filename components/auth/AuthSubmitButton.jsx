'use client';
import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';

export default function AuthSubmitButton({ children = 'Sign Up' }) {
	const {
		formState: { isSubmitting },
	} = useFormContext();

	return (
		<Button type="submit" className="h-11 w-full rounded-full text-sm md:text-base gap-2" disabled={isSubmitting} aria-busy={isSubmitting}>
			{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
			<span className={isSubmitting ? 'opacity-80' : ''}>{children}</span>
		</Button>
	);
}
