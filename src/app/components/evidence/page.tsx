import type { Metadata } from "next"
import { EvidenceGallery } from "@/components/evidence-gallery"

export const metadata: Metadata = {
  title: "Evidence · 可复用组件库",
  description: "Reusable shadcn comparison tables, numeric charts, testimonials and response comparisons.",
}

export default function EvidenceGalleryPage() {
  return <EvidenceGallery />
}
