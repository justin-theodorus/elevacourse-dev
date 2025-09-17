import AuthSeparator from '@/components/auth/AuthSeparator';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthSocialButtons from '@/components/auth/AuthSocialButton';
import PasswordField from '@/components/auth/PasswordField';
import AuthShell from '@/components/auth/AuthShell';
import EmailField from '@/components/auth/EmailField';
import AuthFooterLink from '@/components/auth/AuthFooterLink';
import AuthForm from '@/components/auth/AuthForm';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';

export const metadata = { title: 'Register' };

export default function RegisterPage() {
	return (
		<AuthShell>
			<AuthHeader title="Sign Up" prompt="Already have an account?" href="/login" linkText="Log in" />
			<AuthSocialButtons />
			<AuthSeparator />
			<AuthForm >
				<EmailField />
				<PasswordField />
				<AuthFooterLink />
				<AuthSubmitButton>Sign Up</AuthSubmitButton>
			</AuthForm>
			{/* <AuthForm /> */}
		</AuthShell>
	);
}
