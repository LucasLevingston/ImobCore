import { Footer } from '@microfrontends/ui'
import packageJson from '../../package.json'

export function PortalFooter() {
  const year = new Date().getFullYear()

  return (
    <Footer
      left={<span>© {year} Microfrontends Platform</span>}
      right={<span>v{packageJson.version}</span>}
    />
  )
}
