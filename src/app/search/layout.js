import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Search — mindhunter",
  description: "Search movies and TV shows.",
};

export default function SearchLayout({ children }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>{children}</Suspense>
      <Footer />
    </>
  );
}
