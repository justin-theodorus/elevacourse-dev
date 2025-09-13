'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaFacebook, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaRegEye } from 'react-icons/fa6';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
			<main className="container mx-auto min-h-svh grid place-items-center px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-xl my-4">
					<div className="py-6 px-6 sm:px-12 md:px-18 lg:px-20">
						{/* Header */}
						<div className="mb-6 flex flex-col items-center gap-1 md:mb-7">
							<Image src="/images/auth/Logo.svg" alt="Logo" width={31} height={31} className="mb-4" priority />
							<h1 className="text-xl font-semibold md:text-2xl">Sign Up</h1>
							<p className="text-xs text-muted-foreground md:text-sm">
								Already have an account?{' '}
								<Link href="/login" className="underline underline-offset-4">
									Login
								</Link>
							</p>
						</div>

						{/* Social buttons */}
						<div className="mb-5 space-y-3 md:space-y-4">
							<Button type="button" variant="outline" className="h-11 w-full rounded-full justify-center gap-2.5 border-1 border-black/50">
								<FaFacebook className="size-5 text-[#0C82EE]" />
								<span className="text-sm md:text-base">Log in with Facebook</span>
							</Button>

							<Button type="button" variant="outline" className="h-11 w-full rounded-full justify-center gap-2.5 border-1 border-black/50">
								<FcGoogle className="size-5" />
								<span className="text-sm md:text-base">Log in with Google</span>
							</Button>
						</div>

						{/* Separator */}
						<div className="mb-5 flex items-center gap-2" aria-hidden>
							<hr className="flex-1 border-border" />
							<span className="text-lg text-muted-foreground ">OR</span>
							<hr className="flex-1 border-border" />
						</div>

						{/* Form */}
						<form className="space-y-4 md:space-y-5">
							<div className="space-y-2">
								<Label htmlFor="email" className="text-xs font-normal md:text-sm">
									Your Email
								</Label>
								<Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="example@gmail.com" className="h-11" required />
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password" className="text-xs font-normal md:text-sm">
										Your Password
									</Label>
									<button
										type="button"
										aria-label={showPassword ? 'Hide password' : 'Show password'}
										aria-controls="password"
										onClick={() => setShowPassword((v) => !v)}
										className="p-1 text-muted-foreground hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
									>
										{showPassword ? <FaRegEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
									</button>
								</div>

								<Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="********" className="h-11" required />

								<div className="flex justify-end">
									<Link href="/forgot-password" className="text-xs underline md:text-sm">
										Forgot your password?
									</Link>
								</div>
							</div>

							<Button type="submit" className="h-11 w-full rounded-full text-sm md:text-base">
								Sign Up
							</Button>
						</form>
					</div>
				</div>
			</main>
		);
}
