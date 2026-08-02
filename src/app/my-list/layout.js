import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "My Library — mindhunter",
  description: "Your saved movies and TV shows, favorites and watch later list.",
};

export default function MyListLayout({ children }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>{children}</Suspense>
      <Footer />
    </>
  );
}
