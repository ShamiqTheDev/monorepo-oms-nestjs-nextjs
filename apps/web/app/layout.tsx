// import 'reflect-metadata';
import "./global.css";
import { Manrope } from "next/font/google";
import { Providers } from "@atdb/client-providers";
import NextTopLoader from "nextjs-toploader";

const manrope = Manrope({
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <NextTopLoader showSpinner={false} height={4} color="#9E77ED" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
