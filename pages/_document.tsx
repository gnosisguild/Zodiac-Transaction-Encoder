import Document, { Html, Head, Main, NextScript } from 'next/document'

const scriptTxt = `
(function () {
  const { pathname } = window.location
  const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
  const ipnsMatch = /.*gnosisguild\.org\//.exec(pathname)
  const base = document.createElement('base')

  if (ipfsMatch) {
    base.href = ipfsMatch[0]
  } else if (ipnsMatch) {
    base.href = ipnsMatch[0]
  } else {
    base.href = '/'
  }
  document.head.append(base)
})();
`

class MyDocument extends Document {

  render() {
    return (
      <Html>
        <Head>
            <script dangerouslySetInnerHTML={{__html: scriptTxt}}/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument