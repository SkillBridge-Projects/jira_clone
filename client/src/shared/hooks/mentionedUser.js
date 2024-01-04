import { createContext, useContext } from 'react';

export const mentionedUserContext = createContext({
  mentionedUser: '',
  changeMentionedUser: () => {},
});

export const mentionedUserProvider = mentionedUserContext.Provider;

export default function useMentionedUser() {
  return useContext(mentionedUserContext);
}
