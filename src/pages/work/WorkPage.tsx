import { ScenePage } from '../../components/scene/ScenePage'
import { ComingSoon } from '../../components/scene/ComingSoon'
import { siteConfig } from '../../config/site'

export function WorkPage() {
  return (
    <ScenePage background={siteConfig.backgrounds.work} label="Work" bottomFade>
      <ComingSoon label="Work" />
    </ScenePage>
  )
}
