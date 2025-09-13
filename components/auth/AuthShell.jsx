export default function AuthShell({ children }) {
	return (
		<main className="container mx-auto min-h-svh grid place-items-center px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-xl my-4">
				<div className="py-6 px-6 sm:px-12 md:px-16 lg:px-20">{children}</div>
			</div>
		</main>
	);
}
