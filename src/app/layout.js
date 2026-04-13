import { Outfit } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} dark`}>
      <body className="antialiased font-sans">
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}