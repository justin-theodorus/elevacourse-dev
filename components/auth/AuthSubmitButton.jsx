import { Button } from '@/components/ui/button';

export default function AuthSubmitButton({ children = 'Submit' }) {
	return (
		<Button type="submit" className="h-11 w-full rounded-full text-sm md:text-base">
			{children}
		</Button>
	);
}
