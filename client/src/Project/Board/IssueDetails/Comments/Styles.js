import styled from 'styled-components';

import { font } from 'shared/utils/styles';
import { Button } from 'shared/components';

export const Comments = styled.div`
  padding-top: 40px;
`;

export const Title = styled.div`
  ${font.medium}
  ${font.size(15)}
`;

export const CommentScroll = styled.div`
  display:inline-block;
  height: 240px;
  width: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey; 
      border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
      background: blue; 
      border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
      background: #0052cc; 
    }
}
`;

export const ActionButton = styled(Button)`
  margin-left: 50%;
  transform: translateX(-50%);
`;
