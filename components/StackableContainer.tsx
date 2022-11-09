import * as React from 'react'

type Props = {
  children?: React.ReactNode
  base?: boolean
  inputContainer?: boolean
  lessPadding?: boolean
  lessMargin?: boolean
  lessRadius?: boolean
}

const StackableContainer = (props: Props) => (
  <div
    className={`container ${props.base ? 'base' : ''} ${
      props.inputContainer ? 'input-container' : ''
    }`}
  >
    {props.children}

    <style jsx>{`
      .container {
        position: relative;
        padding: 12px;
        margin-top: ${props.lessMargin ? '16px' : '50px'};

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;

        border-width: 1px;
        border-style: solid;
        border-color: rgba(217, 212, 173, 0.3);
        background: rgba(217, 212, 173, 0.01);
      }

      .container:first-child {
        margin-top: 0;
      }

      .base {
        width: 470px;
        box-shadow: 0px 28px 80px rgba(0, 0, 0, 0.07),
          0px 12.7134px 39.2617px rgba(0, 0, 0, 0.0519173),
          0px 7.26461px 23.349px rgba(0, 0, 0, 0.0438747),
          0px 4.44678px 14.5028px rgba(0, 0, 0, 0.0377964),
          0px 2.71437px 8.88638px rgba(0, 0, 0, 0.0322036),
          0px 1.53495px 5.02137px rgba(0, 0, 0, 0.0261253),
          0px 0.671179px 2.19114px rgba(0, 0, 0, 0.0180827);
      }

      .base,
      .input-container {
        padding: 16px;
      }

      .base:before,
      .input-container:before {
        content: ' ';
        position: absolute;
        z-index: 1;
        top: 3px;
        left: 3px;
        right: 3px;
        bottom: 3px;
        border: 1px solid rgba(217, 212, 173, 0.3);
        pointer-events: none;
      }

      .input-container {
        background: rgba(217, 212, 173, 0.1);
      }
    `}</style>
  </div>
)

export default StackableContainer
