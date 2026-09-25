import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const favicon =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3E%3Crect%20width='64'%20height='64'%20rx='14'%20fill='%23111B3E'/%3E%3Ctext%20x='32'%20y='45'%20font-family='Arial,sans-serif'%20font-size='40'%20font-weight='700'%20fill='%23F5A524'%20text-anchor='middle'%3EK%3C/text%3E%3C/svg%3E";

export const metadata: Metadata = {
  metadataBase: new URL("https://kameti.digiindiasolutions.com/"),
  title:
    "Kameti Management Software Delhi | KametiPro – Boli, Dividend, Ledger Automatic",
  description:
    "KametiPro: Delhi NCR ke kameti organizers ke liye software. Boli, dividend, member-wise ledger aur late fee sab automatic. Free demo, office visit bhi.",
  alternates: {
    canonical: "https://kameti.digiindiasolutions.com/",
  },
  openGraph: {
    title:
      "Kameti Management Software Delhi | KametiPro – Boli, Dividend, Ledger Automatic",
    description:
      "KametiPro: Delhi NCR ke kameti organizers ke liye software. Boli, dividend, member-wise ledger aur late fee sab automatic. Free demo, office visit bhi.",
    url: "https://kameti.digiindiasolutions.com/",
    siteName: "KametiPro",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: favicon,
  },
};

export const viewport: Viewport = {
  themeColor: "#111B3E",
  width: "device-width",
  initialScale: 1,
};

const trackingPlaceholders = `
/* Google Ads gtag placeholder - uncomment and replace AW-XXXXXXXXX */
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-XXXXXXXXX');
*/

/* Meta Pixel placeholder - uncomment and replace XXXXXXXXXXXXXXX */
/*
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'XXXXXXXXXXXXXXX');
fbq('track', 'PageView');
*/
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: trackingPlaceholders }} />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased text-[#0F1B2D]`}
      >
        {children}
      </body>
    </html>
  );
}