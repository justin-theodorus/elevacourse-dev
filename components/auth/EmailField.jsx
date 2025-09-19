'use client';

import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function EmailField() {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<div className="space-y-2">
			<Label htmlFor="email" className="text-xs font-normal md:text-sm">
				Your Email
			</Label>
			<Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="example@gmail.com" className="h-11" aria-invalid={!!errors.email} {...register('email')} />
			{errors.email && <p className="text-xs md:text-sm text-red-600">{errors.email.message}</p>}
		</div>
	);
}
