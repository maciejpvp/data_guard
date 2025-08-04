// import { GoogleLogoIcon } from "@/components/icons";
import { GoogleLogoIcon } from "@/components/icons";
import AuthLayout from "@/layouts/auth";

export const LoginPage = () => {
  const redirectUrl = "http://localhost:5173/callback";
  const clientId = "7rna45aoila8e165sl7jbgk8pu";
  const cognitoURL =
    "https://data-guard-maciejpvp-test.auth.eu-central-1.amazoncognito.com/oauth2/authorize";

  const handleGoogleLogin = () => {
    window.location.href =
      `${cognitoURL}` +
      "?identity_provider=Google" +
      `&redirect_uri=${redirectUrl}` +
      "&response_type=CODE" +
      `&client_id=${clientId}` +
      "&scope=openid+profile+email";
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">Data_Guard</h1>
        <p className="text-sm text-muted mb-5">Welcome back</p>

        <button
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 ease-in-out border border-white/10 backdrop-blur-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          onClick={handleGoogleLogin}
        >
          <GoogleLogoIcon className="w-6 h-6" />
          <span className="text-base font-medium text-default-900 tracking-wide">
            Continue with Google
          </span>
        </button>

        <p className="text-xs text-default-400 mt-4 text-center max-w-xs">
          We only use your email to authenticate. We will never post or access
          anything without your permission.
        </p>
      </div>
    </AuthLayout>
  );
};
