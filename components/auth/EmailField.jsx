import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function EmailField() {
	return (
		<div className="space-y-2">
			<Label htmlFor="email" className="text-xs font-normal md:text-sm">
				Your Email
			</Label>
			<Input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="example@gmail.com" className="h-11" required />
		</div>
	);
}
