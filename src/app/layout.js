import { Geist, Geist_Mono } from "next/font/google";
import { LibraryProvider } from "@/lib/library";
import { AuthProvider } from "@/lib/auth";
import { QuickAccessDropdown } from "@/components/quick-access-dropdown";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "mindhunter — Movies & TV Shows",
  description:
    "Discover trending movies and TV shows. Build your watchlist and favorites.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <LibraryProvider>
            {children}
            <QuickAccessDropdown />
          </LibraryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
