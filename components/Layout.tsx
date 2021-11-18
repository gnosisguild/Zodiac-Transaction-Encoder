import React, { ReactNode } from 'react'
import Head from 'next/head'

import StackableContainer from './StackableContainer'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div className="page">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div>{children}</div>
    <style jsx>{`
      .page {
        display: flex;
        justify-content: center;
        padding: 80px 0;
        background: linear-gradient(
          108.86deg,
          rgba(26, 33, 66, 0.85) 6.24%,
          rgba(12, 19, 8, 0.85) 53.08%,
          rgba(37, 6, 4, 0.85) 96.54%
        );
        min-height: 100vh;
      }
    `}</style>
    <style global jsx>{`
      @font-face {
        font-family: 'Roboto Mono';
        font-style: normal;
        font-weight: 400;
        src: url(/fonts/RobotoMono/roboto-mono-v13-latin-regular.woff)
            format('woff2'),
          url(/fonts/RobotoMono/roboto-mono-v13-latin-regular.woff2)
            format('woff');
      }

      /* spectral-regular - latin */
      @font-face {
        font-family: 'Spectral';
        font-style: normal;
        font-weight: 400;
        src: url(/fonts/Spectral/spectral-v7-latin-regular.woff) format('woff2'),
          url(/fonts/Spectral/spectral-v7-latin-regular.woff2) format('woff');
      }

      body {
        font-family: 'Spectral';
        color: white;
        min-height: 100vh;
        background: url(/zodiac-bg.svg);
        background-size: cover;
        background-attachment: fixed;

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
        margin: 0;
        line-height: 1.4;
      }
      .error {
        color: red;
      }
      .error a {
        color: red;
      }

      label {
        margin-bottom: 0.5em;
      }

      input,
      textarea {
        font-family: 'Roboto Mono', monospace;
        background: none;
        border: 1px solid white;
        box-sizing: border-box;

        color: white;
        padding: 10px;
      }

      input:hover,
      textarea:hover {
        opacity: 0.9;
      }

      input:active,
      textarea:active,
      input:focus,
      textarea:focus {
        border: 1px solid #ffffff;
      }

      input::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }

      /* Works on Firefox*/
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(217, 212, 173, 0.6) rgba(217, 212, 173, 0.1);
      }

      /* Works on Chrome, Edge, and Safari */
      *::-webkit-scrollbar {
        width: 6px;
      }

      *::-webkit-scrollbar-track {
        background: none;
      }

      *::-webkit-scrollbar-thumb {
        background-color: rgba(217, 212, 173, 0.3);
        border-radius: 0px;
      }
    `}</style>
  </div>
)

export default Layout
