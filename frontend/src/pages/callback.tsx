import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner } from "@heroui/spinner";

import AuthLayout from "@/layouts/auth";

export const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const [error, setError] = useState<boolean>(false);

  const getToken = async (code: string) => {
    const redirectUrl = "http://localhost:5173/callback";
    const baseUrl =
      "https://data-guard-maciejpvp-test.auth.eu-central-1.amazoncognito.com/oauth2/token";

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: "4h26556loh5jtcg76s3s92bj5i",
          code,
          redirect_uri: redirectUrl,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }
      window.location.href = "/drive";

      // if (data.id_token) {
      //   localStorage.setItem("idToken", data.id_token);
      // }
    } catch {
      setError(false);
    }
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");

    const hasRefreshToken = Boolean(refreshToken);

    if (hasRefreshToken) {
      window.location.href = "/drive";

      return;
    }

    if (!code) {
      return;
    }

    getToken(code);
  }, []);

  return (
    <AuthLayout>
      <p className="text-md">
        {error ? "Something went wrong" : <Spinner color="white" />}
      </p>
    </AuthLayout>
  );
};
