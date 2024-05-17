import ReportDetail from "@/components/board/detail";

export default function Home({ params }: { params: { id: string } }) {
  return <ReportDetail reportId={params.id} />;
}
