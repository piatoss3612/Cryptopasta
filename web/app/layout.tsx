import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Providers } from "./providers";
import Main from "@/components/layout";

const pixel = Pixelify_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cryptopasta",
  description: "Social dapp for easy security learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pixel.className}>
        <Providers>
          <Main>{children}</Main>
        </Providers>
      </body>
    </html>
  );
}
