import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Mood Picker — mindhunter",
  description: "Tell us your mood, we'll pick what to watch.",
};

export default function MoodLayout({ children }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>{children}</Suspense>
      <Footer />
    </>
  );
}
