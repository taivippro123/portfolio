"use client"

import { useState, useEffect } from "react"
import { Github, Linkedin, ExternalLink, Mail } from "lucide-react"
import LogoLoop from "@/components/LogoLoop"
import GradientText from "@/components/GradientText"
import TextType from "@/components/TextType"
import {
  SiVercel,
  SiRender,
  SiFlydotio,
  SiReact,
  SiNodedotjs,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiGithub,
} from "react-icons/si"

const techLogos = [
  { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
  { node: <SiRender />, title: "Render", href: "https://render.com" },
  { node: <SiFlydotio />, title: "Fly.io", href: "https://fly.io" },
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/docs/Web/JavaScript" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
]

const loopLogos = [...techLogos, ...techLogos]

const HERO = {
  firstName: "Phan Võ",
  lastName: "Thành Tài",
  title: "Front End Developer",
  intro:
    "I enjoy turning ideas into smooth, accessible UI that look great and deliver a seamless user experience.",
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("about")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "experience", "projects", "tools"]
      let currentSection = "about"

      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = document.documentElement.scrollHeight

      // If we're at (or very near) the bottom of the page, always highlight the last section (tools)
      if (scrollBottom >= docHeight - 4) {
        setActiveSection("tools")
        return
      }

      let closestSection: string = "about"
      let closestDistance = Infinity

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (!element) continue

        const rect = element.getBoundingClientRect()
        const distance = Math.abs(rect.top - 160)

        if (distance < closestDistance) {
          closestDistance = distance
          closestSection = sectionId
        }
      }

      currentSection = closestSection

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (!element) return
    const offset = element.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: offset, behavior: "smooth" })
  }

  return (
    <div className="bg-slate-950 text-gray-100 min-h-screen relative">
      <div
        className="fixed pointer-events-none w-80 h-80 rounded-full blur-3xl opacity-20 transition-transform duration-75 z-0"
        style={{
          background: "radial-gradient(circle, rgba(118, 88, 152, 0.4) 0%, transparent 70%)",
          left: mousePos.x - 160,
          top: mousePos.y - 160,
        }}
      ></div>

      <div className="min-h-screen flex items-start justify-center relative z-10">
        <div className="w-full max-w-6xl lg:grid lg:grid-cols-[1fr_1.6fr] gap-10 px-6 sm:px-10 lg:px-0">
          <div className="hidden lg:flex p-12 flex-col justify-between sticky top-0 h-screen">
            <div>
              <div className="mb-12">
                <div className="mb-2">
                  <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
                    {HERO.firstName}
                  </h1>
                  <div className="-ml-4">
                    <GradientText
                      className="text-5xl font-bold block"
                      colors={["#9333ea", "#a855f7", "#22c55e", "#16a34a", "#10b981"]}
                      animationSpeed={4}
                    >
                      {HERO.lastName}
                    </GradientText>
                  </div>
                </div>
                <p className="text-xl text-gray-300 font-light">{HERO.title}</p>
                <div className="text-sm text-gray-400 mt-4 leading-relaxed min-h-[3rem]">
                  <TextType
                    text={[
                      "I enjoy turning ideas into smooth, accessible UI that look great.",
                      "I enjoy delivering a seamless user experience.",
                    ]}
                    typingSpeed={50}
                    pauseDuration={2000}
                    loop={true}
                    showCursor={true}
                    className="text-gray-400"
                    variableSpeed={undefined}
                    onSentenceComplete={undefined}
                  />
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { label: "About", id: "about" },
                  { label: "Experience", id: "experience" },
                  { label: "Projects", id: "projects" },
                  { label: "Tools", id: "tools" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-2 font-mono text-sm transition-all relative group ${activeSection === item.id ? "text-green-500" : "text-gray-400 hover:text-purple-400"
                      }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 transition-all ${activeSection === item.id
                        ? "bg-gradient-to-r from-purple-500 to-green-500 w-1"
                        : "bg-transparent"
                        }`}
                    ></span>
                    <span className="pl-4">{item.label}</span>
                    {activeSection === item.id && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">→</span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-10 flex gap-4">
                <a
                  href="https://github.com/taivippro123/"
                  className="text-gray-400 hover:text-green-500 transition-colors p-2 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/t%C3%A0i-th%C3%A0nh-649a44388/"
                  className="text-gray-400 hover:text-green-500 transition-colors p-2 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:phanvothanhtai1007@gmail.com"
                  className="text-gray-400 hover:text-green-500 transition-colors p-2 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <main className="py-24 lg:py-28 px-2 sm:px-6 lg:px-12 space-y-32 max-w-3xl mx-auto">
              <div className="lg:hidden space-y-6 mb-6">
                <div>
                  <div className="mb-2">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                      {HERO.firstName}
                    </h1>
                    <div className="-ml-4">
                      <GradientText
                        className="text-4xl sm:text-5xl font-bold block"
                        colors={["#9333ea", "#a855f7", "#22c55e", "#16a34a", "#10b981"]}
                        animationSpeed={3}
                      >
                        {HERO.lastName}
                      </GradientText>
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 font-light">{HERO.title}</p>
                </div>
                <div className="text-gray-400 leading-relaxed min-h-[3rem]">
                  <TextType
                    text={[
                      "I enjoy turning ideas into smooth, accessible UI that look great",
                      "I enjoy delivering a seamless user experience.",
                    ]}
                    typingSpeed={50}
                    pauseDuration={2000}
                    loop={true}
                    showCursor={true}
                    className="text-gray-400"
                    variableSpeed={undefined}
                    onSentenceComplete={undefined}
                  />
                </div>
              </div>
              <section id="about" className="scroll-mt-28">
                <h2 className="text-3xl font-bold text-green-400 mb-8">About</h2>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p>
                    I'm a Front-End Developer passionate about building clean, accessible, and visually polished user interfaces.
                    I love working where design meets technology — turning ideas into smooth, responsive experiences that feel great on every device.
                    I focus on writing maintainable code, optimizing performance, and crafting products that balance functionality with refined user experience.
                    I'm always learning, experimenting, and pushing myself to create interfaces that are not only beautiful, but meaningful and user-centered.
                  </p>
                  <p>
                    Currently, I'm a Front-End Developer at{" "}
                    <span className="text-green-500 font-semibold">FPT University</span>, majoring in Software Engineering. I'm in my 4th year of study, with a focus on software development.
                  </p>
                </div>
              </section>
              <div className="lg:hidden flex gap-4 mb-4">
                <a
                  href="https://github.com/taivippro123"
                  className="text-gray-400 hover:text-green-500 transition-colors p-2 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/t%C3%A0i-th%C3%A0nh-649a44388/"
                  className="text-gray-400 hover:text-green-500 transition-colors p-2 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:phanvothanhtai1007@gmail.com"
                  className="text-gray-400 hover:text-green-500 transition-colors p-2 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/30"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>

              <section id="experience" className="scroll-mt-28">
                <h2 className="text-3xl font-bold text-green-400 mb-8">Experience</h2>
                <div className="space-y-8">
                  {[
                    {
                      role: "Intern Front-End Developer",
                      company: "FPT Software Academy",
                      period: "Jan 2025 — May 2025",
                      url: "https://fsoft-academy.edu.vn/",
                      description:
                        "I was an Intern Front-End Developer at FPT Software Academy. I was responsible for collaborating with the team to build and maintain the web applications.",
                    },
                    {
                      role: "Student",
                      company: "FPT University",
                      period: "Sep 2022 — Apr 2026",
                      url: "https://fpt.edu.vn/don-vi/dai-hoc-fpt",
                      description:
                        "Studying Software Engineering at FPT University. I'm currently in my 4th year of study, with a focus on software development.",
                    },
                  ].map((job, idx) => (
                    <a
                      key={idx}
                      href={job.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block border-l-2 border-green-500/50 pl-6 hover:border-green-500 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {job.role}
                          </h3>
                          <p className="text-green-400 font-mono text-sm">{job.company}</p>
                        </div>
                        <span className="text-white text-sm font-mono whitespace-nowrap ml-4">{job.period}</span>
                      </div>
                      <p className="text-gray-400 leading-relaxed">{job.description}</p>
                    </a>
                  ))}
                </div>
              </section>

              <section id="projects" className="scroll-mt-28">
                <h2 className="text-3xl font-bold text-green-400 mb-8">Featured Projects</h2>
                <div className="space-y-16">
                  {[
                    {
                      title: "Payhook",
                      url: "https://payhook.codes",
                      description:
                        "Payhook is an open-source project that parses bank transaction emails and pushes normalized data via Webhook/WebSocket in real time",
                      tags: ["Javascript", "Node.js", "React", "MongoDB"],
                    },
                    {
                      title: "ASA",
                      url: "https://asa.systems",
                      description:
                        "ASA is a POS project that helps small grocery store owners operate efficiently, manage inventory, and sell products with integrated automatic payments, AI suggestions for restocking, and business strategy recommendations.",
                      tags: ["React", "React Native", "Tailwind CSS", "TypeScript", "Next.js"],
                    },
                    {
                      title: "POS WEBSITE",
                      url: "https://frontend-theta-two-64.vercel.app/",
                      description:
                        "A POS inspired by a UI on v0.dev https://v0.app/templates/restaurant-pos-2bo1P6Xaoqg",
                      tags: ["React", "Tailwind CSS", "Node.js", "Express", "MySQL"],
                    },
                    {
                      title: "Discord Clone",
                      url: "https://discord-tau-five.vercel.app/",
                      description:
                        "A real-time chat application inspired by Discord",
                      tags: ["React", "Tailwind CSS", "Node.js", "Express", "MySQL"],
                    },
                  ].map((project, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex gap-4 items-start rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-green-400 transition-colors flex items-center gap-2">
                            {project.title}
                            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <p className="text-gray-400 leading-relaxed mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/30 rounded hover:bg-purple-500/20 hover:border-green-500/50 transition-all"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              <section id="tools" className="scroll-mt-28 mt-32 pb-20">
                <h2 className="text-3xl font-bold text-green-400 mb-6">Tools & Platforms</h2>
                <p className="text-gray-400 leading-relaxed mb-10">
                  A handful of technologies I lean on to ship reliable, fast, and immersive product experiences.
                </p>
                <div className="w-full overflow-hidden">
                  <LogoLoop
                    logos={loopLogos}
                    speed={110}
                    direction="left"
                    logoHeight={56}
                    gap={48}
                    hoverSpeed={0}
                    fadeOut
                    fadeOutColor="#020617"
                    scaleOnHover
                    ariaLabel="Brittany's core tools"
                    width="100%"
                  />
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
