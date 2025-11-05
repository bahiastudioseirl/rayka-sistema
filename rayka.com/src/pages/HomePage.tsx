
import { Layout } from "../layout/layout"
import BannerSection from "../core/components/common/pages/home/BannerSection"
import EstadisticaSection from "../core/components/common/pages/home/EstadisticaSection"
import CatalogoCursoSection from "../core/components/common/pages/home/CatalogoCursoSection"

export default function Home() {
  return (
    <Layout>
      <main className="bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BannerSection userName="Juan García" />
          <EstadisticaSection />
          <CatalogoCursoSection />
        </div>
      </main>
    </Layout>
  )
}
