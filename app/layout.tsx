import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Nemesis System — Show Me How",
  description:
    "An interactive explainer of the Nemesis System in video games, with a playable demo where the enemy remembers what you did.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">{children}</div>
      </body>
    </html>
  );
}
