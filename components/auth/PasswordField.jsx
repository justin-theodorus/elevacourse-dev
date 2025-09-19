'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';

export default function PasswordField() {
	const [show, setShow] = useState(false);
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label htmlFor="password" className="text-xs font-normal md:text-sm">
					Your Password
				</Label>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={show ? 'Hide password' : 'Show password'}
					aria-controls="password"
					aria-pressed={show}
					onClick={() => setShow((v) => !v)}
					className="h-7 w-7 text-muted-foreground hover:opacity-80"
				>
					{show ? <FaRegEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
				</Button>
			</div>

			<Input id="password" type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="********" className="h-11" aria-invalid={!!errors.password} {...register('password')} />
			{errors.password && <p className="text-xs md:text-sm text-red-600">{errors.password.message}</p>}
		</div>
	);
}
