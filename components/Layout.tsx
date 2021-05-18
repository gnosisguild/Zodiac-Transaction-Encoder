import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

import StackableContainer from "./StackableContainer";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <StackableContainer base>{children}</StackableContainer>
    <style global jsx>{`
      body {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        color: white;
        min-height: 100vh;
        background: linear-gradient(
          240.16deg,
          #3f023c 10.46%,
          #561253 54.88%,
          #580a55 94.89%
        );
        font-size: 16px;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      *:focus {
        outline: none;
      }
      button {
        cursor: pointer;
      }
      h1 {
        margin: 0;
        font-weight: 400;
        line-height: 1.15;
        font-size: 1.5em;
        text-align: center;
      }
      h2 {
        font-size: 1.25em;
        font-weight: 400;
        margin: 0;
      }
      h3 {
        font-size: 1em;
        font-style: italic;
        font-weight: bold;
        margin: 0;
      }
      p {
        max-width: 350px;
        margin: 0;
        font-size: 12px;
        font-style: italic;
        line-height: 14px;
      }
    `}</style>
  </div>
);

export default Layout;
