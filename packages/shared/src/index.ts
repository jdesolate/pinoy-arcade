export interface GameMeta {
  id: string;
  title: string;
  tagline: string;
  playPath: string;
  status: "playable" | "coming-soon";
}

export const GAMES: GameMeta[] = [
  {
    id: "sipa",
    title: "Sipa",
    tagline: "Keep the sipa in the air. How long can you last?",
    playPath: "/play/sipa",
    status: "playable",
  },
  {
    id: "tumbang-preso",
    title: "Tumbang Preso",
    tagline: "Knock down the can!",
    playPath: "/play/tumbang-preso",
    status: "coming-soon",
  },
  {
    id: "patintero",
    title: "Patintero",
    tagline: "Cross the lines without getting tagged.",
    playPath: "/play/patintero",
    status: "coming-soon",
  },
  {
    id: "sungka",
    title: "Sungka",
    tagline: "The classic shell-counting strategy game.",
    playPath: "/play/sungka",
    status: "coming-soon",
  },
];
