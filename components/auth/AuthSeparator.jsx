export default function AuthSeparator() {
	return (
		<div className="mb-5 flex items-center gap-2" aria-hidden>
			<hr className="flex-1 border-border" />
			<span className="text-xs text-muted-foreground md:text-sm">OR</span>
			<hr className="flex-1 border-border" />
		</div>
	);
}
