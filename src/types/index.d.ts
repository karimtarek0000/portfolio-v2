declare global {
  interface Info {
    title: string
    phone: string
    email: string
    social: Social
  }

  interface Social {
    linkedin: string
    github: string
    whatsapp: string
  }

  interface Skill {
    title: string
    iconName: string
  }

  interface Data {
    info: Info
    skills: Skill[]
  }
}

export {}
