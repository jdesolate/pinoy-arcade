import Link from "next/link";
import { GAMES } from "@pinoy-arcade/shared";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold text-yellow-300">Pinoy Arcade</h1>
      <p className="mt-2 text-sky-200">Classic Filipino games, playable in your browser.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {GAMES.map((game) => (
          <div key={game.id} className="rounded-xl bg-sky-900 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold">{game.title}</h2>
            <p className="mt-1 text-sm text-sky-300">{game.tagline}</p>
            {game.status === "playable" ? (
              <Link
                href={game.playPath}
                className="mt-4 inline-block rounded-lg bg-yellow-400 px-5 py-2 font-bold text-sky-950 hover:bg-yellow-300"
              >
                Play
              </Link>
            ) : (
              <span className="mt-4 inline-block rounded-lg bg-sky-800 px-5 py-2 text-sm text-sky-400">
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
