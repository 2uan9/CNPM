import { Header } from "@/components/header";
import Profile from "@/components/profile";

export default function ProfilePage({}: { params: { username: string } }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Profile />
      </main>
    </div>
  );
}
