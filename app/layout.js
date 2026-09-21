import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Field Notes",
  description: "A living public board. Write privately. Publish when it is ready.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" />
        <nav className="nav">
          <Link className="mark" href="/">
            Field <em>Notes</em>
          </Link>
          <div className="nav-links">
            <Link href="/">Wall</Link>
            <Link href="/desk">Desk</Link>
            <Link href="/login">Sign in</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
