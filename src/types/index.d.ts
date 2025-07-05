declare global {
  interface Info {
    name: string
    title: string
    phone: string
    email: string
    social: Social[]
    links: Links
  }

  interface Social {
    name: string
    url: string
  }

  interface Skill {
    title: string
    iconName: string
  }

  interface Project {
    image: string
    title: string
    description: string
    technologies: string[]
    website: string
    github?: string
    featured?: boolean
  }

  interface Links {
    downloadCV: string
    previewCV: string
  }

  interface Experience {
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }

  interface Data {
    info: Info
    skills: Skill[]
    about: string
    experience: Experience[]
    projects: Project[]
  }
}

export {}
