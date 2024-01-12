import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';

const width = prop => `width:${prop}%`;

export const EditorCont = styled.div`
  .ql-toolbar.ql-snow {
    border-radius: 4px 4px 0 0;
    border: 1px solid ${color.borderLightest};
    border-bottom: none;
    ${props => width(props.width)};
  }
  .ql-container.ql-snow {
    border-radius: 0 0 4px 4px;
    border: 1px solid ${color.borderLightest};
    border-top: none;
    color: ${color.textDarkest};
    ${font.size(15)}
    ${font.regular}
    ${props => width(props.width)};
  }
  .ql-editor {
    min-height: 110px;
  }

  .ql-mention-denotation-char {
    color: #989898;
  }

  .ql-mention-list {
    background-color: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(30, 30, 30, 0.08);
    overflow: auto;
    width: 270px;
    max-height: 200px;
    position: relative;
    z-index: 1;
  }

  .ql-mention-list-item {
    padding: 5px 10px;
    cursor: pointer;
  }

  .ql-mention-list-item.selected {
    background-color: #d3e1eb;
  }
`;
