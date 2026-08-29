export type Project = {
  name: string
  devPeriod: string
  img: string
  description: string
  url: string
  techs?: string[]
}

export const projects: Project[] = [
  {
    name: 'Stella Beat',
    devPeriod: '2022.12 - 2023.09',
    img: './assets/stella-beat-logo.png',
    description: 'PCで遊べる ©CHUNITHM ライクなリズムゲーム',
    url: 'https://github.com/rnxo/Stella-Beat',
    techs: ['Unity'],
  },
  {
    name: 'todo-app-vite',
    devPeriod: '2025.01 - 2025.02',
    img: './assets/todo-vite-app.png',
    description:
      'React + Viteで構築したメインタスクとサブタスクの階層構造をもつタスク管理アプリ',
    url: 'https://github.com/rnxo/todo-app-vite',
    techs: ['JavaScript', 'vite'],
  },
  {
    name: 'Lumi',
    devPeriod: '2026.02 - 開発中',
    img: './assets/lumi-app-card.png',
    description:
      'AI搭載型のペットがユーザに最適化されたアドバイスによって習慣化をサポート!!',
    url: 'https://github.com/lumi-app-project',
    techs: ['TypeScript', 'Next.js', 'Supabase'],
  },
  {
    name: 'コンビニトイレマップ',
    devPeriod: '2026.03',
    img: './assets/cobini-toilet-map.png',
    description: 'コンビニのトイレ情報をユーザー間で共有・閲覧できる便利アプリ',
    url: 'https://github.com/Neptune-Progate-Hackathon-AWS/front',
    techs: ['TypeScript', 'Vite+', 'AWS'],
  },
]
