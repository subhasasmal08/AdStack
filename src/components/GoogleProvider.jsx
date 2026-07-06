import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({ children }) {
  return (
    <html>
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
