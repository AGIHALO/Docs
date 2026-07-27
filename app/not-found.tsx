import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="not-found">
      <Image src="/halo-logo.svg" alt="" width={60} height={32} priority />
      <span>404</span>
      <h1>Documentation page not found</h1>
      <p>The page may have moved or is not part of the current public contract.</p>
      <Link href="/quickstart">Return to Quickstart</Link>
    </main>
  );
}
