"use client";

import "./globals.css";
import "../styles/fonts.css";
import SiteChrome from "./SiteChrome";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthBootstrap from "./AuthBootstrap";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl" lang="fa">
      <body>
        <Provider store={store}>
          <AuthBootstrap />
          <SiteChrome>{children}</SiteChrome>
        </Provider>
      </body>
    </html>
  );
}
