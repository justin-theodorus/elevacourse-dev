'use client';
export default function AuthForm({ children, onSubmit }) {
	return (
		<form className="space-y-4 md:space-y-5" onSubmit={onSubmit ?? ((e) => e.preventDefault())} noValidate>
			{children}
		</form>
	);
}
