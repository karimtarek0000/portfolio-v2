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

  interface Links {
    downloadCV: string
    previewCV: string
  }

  interface Data {
    info: Info
    skills: Skill[]
    about: string
  }
}

export {}
