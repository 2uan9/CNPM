import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"], // Chỉ sử dụng bộ ký tự Latin
  weight: ["400", "600", "700"], // Chỉ định trọng số cho phông chữ Poppins
  variable: "--font-poppins",
});

export const metadata = {
  title: "Document Share",
  description: "Share your documents with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}
