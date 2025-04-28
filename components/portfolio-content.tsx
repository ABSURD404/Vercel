import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Mail, Code, User, ExternalLink } from "lucide-react"

export default function PortfolioContent() {
  const [activeTab, setActiveTab] = useState("about")

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 mt-8 text-center">
        <div className="mb-4 inline-block rounded-full bg-black/70 p-4 backdrop-blur-md border border-[#ff00ff]/30 shadow-[0_0_15px_rgba(255,0,255,0.5)]">
          <img
            src="https://w.wallhaven.cc/full/6k/wallhaven-6kr1lw.png"
            alt="Profile"
            className="h-24 w-24 rounded-full border-2 border-[#4fd485] object-cover md:h-32 md:w-32 shadow-[0_0_10px_rgba(79,212,133,0.7)]"
          />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ff9f]">
          ABSUЯD
        </h1>
        <h2 className="text-xl text-[#bf00ff] drop-shadow-md md:text-2xl">
          Selfhosting And FOSS enthusiast
        </h2>

        {/* Social links */}
        <div className="mt-4 flex justify-center space-x-6">
          <a
            href="https://github.com/4fd485"
            className="rounded-full bg-black/70 p-4 text-[#00ff9f] transition-all hover:bg-[#00ff9f]/20 hover:text-white hover:shadow-[0_0_10px_rgba(0,255,159,0.7)]"
            title="GitHub"
          >
            <Github className="h-8 w-8" />
          </a>
          <a
            href="mailto:grnb@duck.com"
            className="rounded-full bg-black/70 p-4 text-[#ff00ff] transition-all hover:bg-[#ff00ff]/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,0,255,0.7)]"
            title="Email"
          >
            <Mail className="h-8 w-8" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-black/70 backdrop-blur-md border border-[#ff00ff]/30 shadow-[0_0_10px_rgba(255,0,255,0.3)]">
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff00ff]/20 data-[state=active]:to-[#00ff9f]/20 data-[state=active]:text-white"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>

            <TabsTrigger
              value="projects"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff00ff]/20 data-[state=active]:to-[#00ff9f]/20 data-[state=active]:text-white"
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
          </TabsList>

          {/* About Section */}
          <TabsContent value="about">
            <Card className="border-none bg-black/70 backdrop-blur-md border border-[#bf00ff]/30 shadow-[0_0_15px_rgba(191,0,255,0.3)]">
              <CardContent className="p-6 text-white/90">
                <h3 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ff9f]">
                  About Me
                </h3>
                <p className="mb-4">
                  I’m a Free and Open Source software enthusiast and contributor. I also enjoy self-hosting and am always looking for ways to improve my skills and knowledge. Right now, I'm trying to learn Rust.
                </p>
                <p className="mb-6">
                  When I'm not coding, you can find me gaming or outside going for a walk. I break stuff in order to learn.
                </p>
                <h3 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ff9f]">
                  Skills and Interests
                </h3>
                <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {[
                    "Bash Scripting",
                    "Linux",
                    "Docker",
                    "Selfhosting",
                    "Rust",
                    "Krita",
                    "Networking",
                    "Cybersecurity",
                    "OSINT",
                    "Virtualization",
                  ].map((skill, index) => (
                    <div
                      key={skill}
                      className={`rounded-md px-3 py-1 text-center text-sm border border-[#ff00ff]/30 ${
                        index % 3 === 0
                          ? "bg-gradient-to-r from-[#ff00ff]/10 to-black/30 text-[#ff00ff]"
                          : index % 3 === 1
                          ? "bg-gradient-to-r from-[#bf00ff]/10 to-black/30 text-[#bf00ff]"
                          : "bg-gradient-to-r from-[#00ff9f]/10 to-black/30 text-[#00ff9f]"
                      }`}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Section */}
          <TabsContent value="projects">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Custom SearXNG UI Written in Sveltekit",
                  description: "Simple alternative SearXNG UI written in Sveltekit.",
                  tech: ["SvelteKit", "Tauri", "Daisy UI"],
                  image: "/placeholder.svg?height=200&width=400",
                  color: "#332a3a",
                },
                {
                  title: "Portfolio with Tetris",
                  description: "A personal portfolio with playable Tetris, Pong, and Snake.",
                  tech: ["Next.js", "TypeScript", "Canvas API", "Tailwind CSS"],
                  image: "/placeholder.svg?height=200&width=400",
                  color: "#332a3a",
                },
              ].map((project, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-none bg-black/70 backdrop-blur-md border border-[#bf00ff]/30 shadow-[0_0_15px_rgba(191,0,255,0.3)] hover:shadow-[0_0_20px_rgba(191,0,255,0.5)] transition-all"
                  style={{
                    boxShadow: `0 0 15px ${project.color}40`,
                    borderImage: `linear-gradient(45deg, ${project.color}, transparent) 1`,
                  }}
                >
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <CardContent className="p-6 text-white/90">
                    <h3 className="mb-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ff9f]">
                      {project.title}
                    </h3>
                    <p className="mb-4 text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={tech}
                          className={`rounded-md px-2 py-1 text-xs border border-[#ff00ff]/30 ${
                            techIndex % 3 === 0
                              ? "bg-gradient-to-r from-[#ff00ff]/10 to-black/30 text-[#ff00ff]"
                              : techIndex % 3 === 1
                              ? "bg-gradient-to-r from-[#bf00ff]/10 to-black/30 text-[#bf00ff]"
                              : "bg-gradient-to-r from-[#00ff9f]/10 to-black/30 text-[#00ff9f]"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Only show View Project for Tetris project */}
                    {project.title !== "Custom SearXNG UI Written in Sveltekit" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-[#00ff9f]/50 text-[#00ff9f] hover:bg-[#00ff9f]/20 hover:text-white hover:shadow-[0_0_10px_rgba(0,255,159,0.5)]"
                      >
                        View Project <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer with SVG */}
      <footer className="mt-8 pb-4 pt-8 flex flex-col items-center justify-center text-white/70">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 980" className="h-12 w-12 fill-none stroke-white stroke-[10]">
          <circle cx="490" cy="490" r="440" />
          <path d="M219,428H350a150,150 0 1 1 0,125H219a275,275 0 1 0 0-125z" fill="white" />
        </svg>
      </footer>
    </div>
  )
}
