import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

import StackableContainer from "./StackableContainer";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div className="page">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <StackableContainer base>{children}</StackableContainer>
    <style jsx>{`
      .page {
        display: flex;
        justify-content: center;
        padding: 80px 0;
      }
    `}</style>
    <style global jsx>{`
      body {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        color: white;
        min-height: 100vh;
        background: linear-gradient(
          249.99deg,
          #3f007d 7.84%,
          #430086 51.41%,
          #320064 93.2%
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
      .error {
        color: red;
      }
      .error a {
        color: red;
      }

      label {
        font-style: italic;
        margin-bottom: 1em;
      }

      input,
      textarea {
        background: #430086;
        border: 1px solid #7240a4;
        box-sizing: border-box;
        border-radius: 9px;

        color: white;
        padding: 10px 5px;
      }

      input:hover,
      textarea:hover {
        border: 1px solid #8559b0;
      }

      input:active,
      textarea:active,
      input:focus,
      textarea:focus {
        border: 2px solid #ffffff;
      }

      input::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    `}</style>
  </div>
);

export default Layout;
