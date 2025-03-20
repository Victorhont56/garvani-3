import { ClerkProvider } from "@clerk/nextjs";
import "./../globals.css"; // adjust path if needed

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
