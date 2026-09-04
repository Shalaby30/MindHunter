import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-bold text-accent/20">404</div>
      <h1 className="mb-3 text-2xl font-bold text-foreground">Page Not Found</h1>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/80"
      >
        Back to Home
      </Link>
    </div>
  );
}
