import Image from 'next/image';
import Link from 'next/link';

export default function AuthHeader({ title, prompt, href, linkText }) {
	return (
		<div className="mb-6 flex flex-col items-center gap-1 md:mb-7">
			<Image src="/images/auth/Logo.svg" alt="Logo" width={31} height={31} className="mb-4" priority />
			<h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
			<p className="text-xs text-muted-foreground md:text-sm">
				{prompt}{' '}
				<Link href={href} className="underline underline-offset-4">
					{linkText}
				</Link>
			</p>
		</div>
	);
}
