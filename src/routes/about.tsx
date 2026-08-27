import { createFileRoute } from '@tanstack/react-router'
import ProjectCard from '#/components/about-me/ProjectCard'
import { getIntroCodeHtml } from '#/server/about.functions'
import TypingText from '#/components/about-me/TypingText'

export const Route = createFileRoute('/about')({
  loader: () => getIntroCodeHtml(),
  component: About,
})

const GITHUB_URL = 'https://github.com/rnxo'

const skills = [
  'html5',
  'css3',
  'javascript',
  'typescript',
  'react',
  'vite',
  'nextjs',
]

const challengeSkills = ['hono', 'express', 'expo']

type Project = {
  name: string
  description: string
  url: string
  techs?: string[]
}

const projects: Project[] = [
  {
    name: 'ore-sugee-counter',
    description:
      '自己肯定感をあげるためだけに無駄に演出がいいカウンターアプリ。',
    url: `${GITHUB_URL}/ore-sugee-counter`,
    techs: ['TypeScript', 'Next.js'],
  },
  {
    name: 'todo-app-vite',
    description:
      '私が初めて開発アプリで、React と Vite で構築したシンプルなタスク管理アプリ。',
    url: `${GITHUB_URL}/todo-app-vite`,
    techs: ['JavaScript', 'vite'],
  },
  {
    name: 'コンビニトイレマップ (Hackathon)',
    description:
      '周辺のコンビニのトイレの有無と詳細を共有・閲覧できる便利アプリ',
    url: 'https://github.com/Neptune-Progate-Hackathon-AWS/front',
    techs: ['TypeScript', 'Vite+', 'AWS'],
  },
  {
    name: 'Lumi',
    description:
      'AI搭載型のペットがユーザに最適化されたアドバイスによって習慣化をサポート!!',
    url: 'https://github.com/lumi-app-project',
    techs: ['TypeScript', 'Next.js', 'Supabase'],
  },
]

function About() {
  const introCodeHtml = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 py-12">
      {/* 自己紹介カード */}
      <section className="island-shell rise-in rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex justify-center items-center">
            <img
            src="/assets/my-icon.jpg"
            className="h-28 w-28 shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36 md:h-44 md:w-44 lg:h-56 lg:w-56 xl:h-64 xl:w-64 xl:rounded-full"
          />
          </div>
          <div className="w-full text-center lg:text-left">
            <p className="island-kicker mb-2">ABOUT ME</p>
            <h1 className="mb-3 text-2xl font-mechanic sm:text-3xl md:text-4xl lg:text-5xl">
              <TypingText text="Hello, I'm SKYREMT" />
            </h1>
            {/* コードブロック */}
            <div
              className="prose article-prose max-w-none text-left text-sm"
              dangerouslySetInnerHTML={{ __html: introCodeHtml }}
            />
          </div>
        </div>
      </section>
      <hr className="border-t border-gray-300 my-6" />
      <section className="mt-10">
        {/* スキルセクション */}
        <h2 className="mb-3 font-bold text-3xl">SKILLS</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <img
              key={skill}
              src={`/assets/${skill}.png`}
              height={50}
              width={50}
            />
          ))}
        </div>
        <p className="island-kicker my-3">Challenge</p>
        <div className="flex flex-wrap gap-2">
          {challengeSkills.map((cs) => (
            <img key={cs} src={`/assets/${cs}.png`} height={50} width={50} />
          ))}
        </div>
      </section>
      <section className="mt-10">
        <p className="island-kicker mb-3">Projects</p>
        {/* プロジェクトカード */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              description={project.description}
              url={project.url}
              techs={project.techs}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
