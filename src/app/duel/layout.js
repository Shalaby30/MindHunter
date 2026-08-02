import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Movie Night Duel — mindhunter",
  description: "Can't decide what to watch? Let titles battle it out.",
};

export default function DuelLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
