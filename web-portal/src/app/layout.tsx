import './globals.css'; // You can keep or remove this, but let's make layout self-contained if css is missing

export const metadata = {
  title: 'CircuitFlow Portal',
  description: 'CircuitFlow Hardware SaaS Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
