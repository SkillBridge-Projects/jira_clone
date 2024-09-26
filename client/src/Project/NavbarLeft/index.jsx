import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { Icon } from 'shared/components';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import useCurrentUser from 'shared/hooks/currentUser';

import { resetCache } from 'shared/hooks/api/query';
import { NavLeft, LogoLink, StyledLogo, Item, ItemText } from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  issueSearchModalOpen: PropTypes.func.isRequired,
  userCreateModalOpen: PropTypes.func.isRequired,
  projectCreateModalOpen: PropTypes.func.isRequired,
};

const ProjectNavbarLeft = ({ 
  project, 
  issueSearchModalOpen,
  userCreateModalOpen,
  projectCreateModalOpen,
}) => {
  const history = useHistory();
  const { currentUser } = useCurrentUser();

  return (
    <NavLeft data-testid="Navbar:left">
    <LogoLink to="/">
      <StyledLogo color="#fff" />
    </LogoLink>

    {currentUser && currentUser.isAdmin && (
      <Item data-testid="Navbar:create-project" onClick={projectCreateModalOpen}>
        <Icon type="plus" size={27} />
        <ItemText>Create Project</ItemText>
      </Item>
    )}

    {project && (
      <Item onClick={issueSearchModalOpen}>
        <Icon type="search" size={22} top={1} left={3} />
        <ItemText>Search issues</ItemText>
      </Item>
    )}

    {currentUser && currentUser.isAdmin && (
      <Item onClick={userCreateModalOpen}>
        <Icon type="plus" size={27} />
        <ItemText>Create User</ItemText>
      </Item>
    )}

    <Item onClick={() => {
      removeStoredAuthToken();
      resetCache();
      history.push('/');
    }}>
      <Icon type="close" size={27} />
      <ItemText data-testid="Navbar:logout">LogOut</ItemText>
    </Item>

  </NavLeft>
  )
};

ProjectNavbarLeft.propTypes = propTypes;

export default ProjectNavbarLeft;
