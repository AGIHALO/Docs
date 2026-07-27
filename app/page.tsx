import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="not-found">
      <meta httpEquiv="refresh" content="0; url=/quickstart/" />
      <Image src="/halo-mark.svg" alt="" width={44} height={44} priority />
      <span>HALO DOCS</span>
      <h1>Opening Quickstart…</h1>
      <p>If the page does not open automatically, continue below.</p>
      <Link href="/quickstart/">Open Quickstart</Link>
    </main>
  );
}
