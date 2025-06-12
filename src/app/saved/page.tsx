import { Header } from "@/components/header";
import { SavedContent } from "@/components/saved-content";
import { Footer } from "@/components/footer";

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <SavedContent />
      </main>
      <Footer />
    </div>
  );
}
