import AuthSeparator from '@/components/auth/AuthSeparator';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthSocialButtons from '@/components/auth/AuthSocialButton';
import PasswordField from '@/components/auth/PasswordField';
import AuthShell from '@/components/auth/AuthShell';
import EmailField from '@/components/auth/EmailField';
import AuthFooterLink from '@/components/auth/AuthFooterLink';
import AuthForm from '@/components/auth/AuthForm';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';

export const metadata = { title: 'Log In' };

export default function LoginPage() {
	return (
		<AuthShell>
			<AuthHeader title="Log In" prompt="Don't have an account?" href="/register" linkText="Sign up" />
			<AuthSocialButtons />
			<AuthSeparator />
			<AuthForm mode="signin">
				<EmailField />
				<PasswordField />
				<AuthFooterLink />
				<AuthSubmitButton>Log in</AuthSubmitButton>
			</AuthForm>
		</AuthShell>
	);
}
