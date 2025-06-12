import { Header } from "@/components/header";
import { PresentationGrid } from "@/components/presentation-grid";
import { Footer } from "@/components/footer";
import NavigationWithNoSSR from "@/components/NavigationWithNoSSR"; // Import Client Component
import { Suspense } from "react";

interface CategoryPageProps {
  params: {
    id: string; // Nhận `id` từ dynamic routing
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id: categoryId } = params;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<p>Loading Navigation...</p>}>
        <NavigationWithNoSSR />
      </Suspense>
      <main className="flex-grow">
        <PresentationGrid categoryId={categoryId} />
      </main>
      <Footer />
    </div>
  );
}
