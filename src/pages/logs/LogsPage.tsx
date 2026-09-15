import { ScenePage } from '../../components/scene/ScenePage'
import { ComingSoon } from '../../components/scene/ComingSoon'
import { siteConfig } from '../../config/site'

export function LogsPage() {
  return (
    <ScenePage background={siteConfig.backgrounds.logs} label="Logs">
      <ComingSoon label="Logs" />
    </ScenePage>
  )
}
