import Link from "next/link";
import SipaGame from "@/components/SipaGame";

export default function SipaPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-8">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-300">Sipa</h1>
        <Link href="/" className="text-sm text-sky-300 hover:text-sky-100">
          ← Back to arcade
        </Link>
      </div>
      <SipaGame />
      <p className="mt-4 text-sm text-sky-300">
        Move with the arrow keys or A/D, jump with ↑ or W, and press SPACE near the ball to kick. Don&apos;t let it
        touch the ground!
      </p>
    </main>
  );
}
