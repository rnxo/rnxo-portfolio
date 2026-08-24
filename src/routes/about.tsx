import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

const GITHUB_URL = 'https://github.com/rnxo'

const skills = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'TailwindCSS',
];

const challengeSkills = [ 'Hono', 'React Native + Expo'];

type Project = {
  name: string
  description: string
  url: string
  language?: string
}

const projects: Project[] = [
  {
    name: 'ore-sugee-counter',
    description:
      '自己肯定感をあげるためだけに無駄に演出がいいカウンターアプリ。',
    url: `${GITHUB_URL}/ore-sugee-counter`,
    language: 'TypeScript',
  },
  {
    name: 'todo-app-vite',
    description: '私が初めて開発アプリで、React と Vite で構築したシンプルなタスク管理アプリ。',
    url: `${GITHUB_URL}/todo-app-vite`,
    language: 'JavaScript',
  },
  {
    name: 'コンビニトイレマップ (Hackathon)',
    description:
      '周辺のコンビニのトイレの有無と詳細を共有・閲覧できる便利アプリ',
    url: 'https://github.com/Neptune-Progate-Hackathon-AWS/front',
    language: 'TypeScript',
  },
    {
    name:'Lumi',
    description:
      'AI搭載型のペットがユーザに最適化されたアドバイスによって習慣化をサポート!!',
    url: 'https://github.com/lumi-app-project',
    language: 'TypeScript',
  },
]

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rise-in flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8">
        <img
          src={`${GITHUB_URL}.png`}
          alt="skyremt のアバター"
          className="h-28 w-28 shrink-0 rounded-full border border-[var(--line)] object-cover sm:h-32 sm:w-32"
          loading="lazy"
        />
        <div>
          <p className="island-kicker mb-2">ABOUT ME</p>
          <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
            skyremt (rnxo)
          </h1>
          <p className="m-0 max-w-2xl text-base leading-8 text-[var(--sea-ink-soft)]">
            KCG
            3回生。Webアプリエンジニアを志望し、フロントエンドを中心に学習しています。「自分の知らない景色を求めて」をモットーに、日々新しい技術に触れながらつよつよエンジニアを目指しています。
          </p>
        </div>
      </section>

      <section className="mt-10">
        <p className="island-kicker mb-3">Skills</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="demo-pill">
              {skill}
            </span>
          ))}
        </div>
        <p className="island-kicker my-3">Challenge</p>
        <div className="flex flex-wrap gap-2">
          {challengeSkills.map((cs) => (
            <span key={cs} className="demo-pill">
              {cs}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <p className="island-kicker mb-3">Projects</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="feature-card rise-in flex flex-col gap-3 rounded-2xl border p-5 no-underline"
            >
              <h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">
                {project.name}
              </h2>
              <p className="demo-muted text-sm">{project.description}</p>
              {project.language && (
                <span className="demo-pill w-fit">{project.language}</span>
              )}
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
