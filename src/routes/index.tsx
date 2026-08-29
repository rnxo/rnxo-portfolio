import { createFileRoute } from '@tanstack/react-router'
import FlipCard from '#/components/about-me/FlipCard'
import ProjectShowcase from '#/components/about-me/ProjectShowcase'
import { projects } from '#/components/about-me/project'
import { getIntroCodeHtml } from '#/server/about.functions'
import ScrambleText from '#/components/about-me/ScrambleText'
import ProjectCard from '#/components/about-me/ProjectCard'
import { ContactForm } from '#/components/about-me/ContactForm'

export const Route = createFileRoute('/')({
  loader: () => getIntroCodeHtml(),
  component: About,
})

const skills = [
  'html',
  'css',
  'javascript',
  'typescript',
  'react',
  'vite',
  'nextjs',
  'tailwindcss',
]

const challengeSkills = ['hono', 'nodejs', 'expo']

function About() {
  const introCodeHtml = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 py-12">
      {/* 自己紹介カード(クリックで裏返すと技術スタックが出る) */}
      <FlipCard
        label="クリックでカードを裏返し、技術スタックを表示"
        front={
          <div className="island-shell rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
              <div className="flex justify-center items-center">
                <img
                  src="/assets/my-icon.jpg"
                  className="h-28 w-28 shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36 md:h-44 md:w-44 lg:h-56 lg:w-56 xl:h-64 xl:w-64 xl:rounded-full"
                />
              </div>
              <div className="w-full text-center lg:text-left">
                <p className="island-kicker mb-2">ABOUT ME</p>
                <h1 className="mb-3 text-2xl text-lagoon-deep font-bit sm:text-3xl md:text-4xl lg:text-5xl">
                  <ScrambleText text="Hi, I'm SKYREMT" />
                </h1>
                {/* コードブロック */}
                <div
                  className="prose article-prose max-w-none text-left text-sm"
                  dangerouslySetInnerHTML={{ __html: introCodeHtml }}
                />
              </div>
            </div>
            <p className="island-kicker mt-6 text-right">
              クリックでスキルを表示 ↻
            </p>
          </div>
        }
        back={
          <div className="island-shell rounded-2xl p-6 sm:p-8">
            <h2 className="my-5 font-mechanic text-lagoon-deep text-3xl">
              <ScrambleText text="SKILLS" speed={60} />
            </h2>
            <div className="flex flex-wrap gap-10">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex flex-col items-center justify-between"
                >
                  <img src={`/assets/${skill}.png`} height={50} width={50} />
                  <span className="text-center font-mechanic">{skill}</span>
                </div>
              ))}
            </div>
            <h2 className="my-5 font-mechanic text-lagoon-deep text-3xl">
              <ScrambleText text="LEARNING" speed={60} />
            </h2>
            <div className="flex flex-wrap gap-10">
              {challengeSkills.map((cs) => (
                <div
                  key={cs}
                  className="flex flex-col items-center justify-center"
                >
                  <img src={`/assets/${cs}.png`} height={50} width={50} />
                  <span className="text-center font-mechanic">{cs}</span>
                </div>
              ))}
            </div>
            <p className="island-kicker mt-8 text-right">
              クリックで自己紹介に戻る ↻
            </p>
          </div>
        }
      />
      <section className="flex flex-col my-10 items-center justify-center gap-6">
        <h2 className="font-mechanic text-lagoon-deep text-3xl">
          <ScrambleText text="PROJECTS" speed={60} className="underline" />
        </h2>
        {/* プロジェクトショーケース(1枚の循環カード) */}
        {/* <ProjectShowcase projects={projects} /> */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              name={project.name}
              devPeriod={project.devPeriod}
              img={project.img}
              description={project.description}
              url={project.url}
              techs={project.techs}
            />
          ))}
        </div>
      </section>
      <section className="flex flex-col items-center justify-center">
        <h2 className="font-mechanic text-lagoon-deep text-3xl my-5">
          <ScrambleText text="CONTACT" speed={60} className="underline" />
        </h2>
        <ContactForm />
      </section>
    </main>
  )
}
