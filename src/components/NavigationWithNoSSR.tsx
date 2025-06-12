"use client"; // Đánh dấu đây là một Client Component

import dynamic from "next/dynamic";

const NavigationWithNoSSR = dynamic(
  () => import("@/components/navigation").then((mod) => mod.Navigation),
  {
    ssr: false,
    loading: () => <p>Loading Navigation...</p>,
  }
);

export default NavigationWithNoSSR;
