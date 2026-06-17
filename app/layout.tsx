import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hostel Hisab",
  description: "Track shared hostel expenses between two friends",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
