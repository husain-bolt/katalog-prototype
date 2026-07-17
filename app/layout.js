import './globals.css';

export const metadata = {
  title: 'INAPROC — Atur Pengiriman (Prototype)',
  description: 'Clickable prototype for usability testing',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F7F7F8] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
