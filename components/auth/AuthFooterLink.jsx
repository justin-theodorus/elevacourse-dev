import Link from 'next/link';
export default function AuthFooterLink() {
	return (
		<div className="flex justify-end">
			<Link href="/forgot-password" className="text-xs underline md:text-sm">
				Forgot your password?
			</Link>
		</div>
	);
}
