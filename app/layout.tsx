'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>College File Approval System</title>
        <meta name="description" content="College File Approval Workflow System" />
      </head>
      <body className="bg-gray-50">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
