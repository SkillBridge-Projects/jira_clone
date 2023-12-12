/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Avatar, PageError, PageLoader } from 'shared/components';
import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { ActionButton } from 'Project/UserCreate/Styles';
import UserEdit from '../UserEdit/index'; // Import UserEdit component

function Users({ fetchProject, projectsData }) {
  const [{ data, error }, fetchUsers] = useApi.get('/users');
  const { currentUser } = useCurrentUser();

  const [editingUser, setEditingUser] = React.useState(null); // State to manage editing user

  const handleEditUser = user => {
    setEditingUser(user); // Set the selected user for editing
  };

  const handleDeleteUser = async (user, modal) => {
    try {
      await api.delete(`/users/${user._id}`);
      await fetchUsers();
      await fetchProject();
      if (modal && modal.close) {
        modal.close();
      }
    } catch (localError) {
      toast.error(localError);
    }
  };

  if (editingUser) {
    return (
      <UserEdit
        user={editingUser} // Pass the user data to UserEdit
        projects={projectsData} // {data && data.projects}
        onSave={async () => {
          setEditingUser(null);
          await fetchUsers();
        }}
        modalClose={() => setEditingUser(null)}
      />
    );
  }

  if (!data) return <PageLoader />;

  if (error) {
    return (
      <div>
        {error}
        <PageError />
      </div>
    );
  }

  return (
    <div>
      {data.map(user => (
        <div
          key={user._id}
          style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex' }}>
            <Avatar name={user.name} avatarUrl={user.avatarUrl} />
            <div style={{ marginLeft: 10 }}>
              <div>
                <b>Name: </b>
                <span>{user.name}</span>
              </div>
              <div>
                <b>Email: </b>
                <span>{user.email}</span>
              </div>
              <div>
                <b>IsAdmin: </b>
                <span>{user.isAdmin.toString()}</span>
              </div>
            </div>
          </div>
          <div>
            <ActionButton variant="primary" onClick={() => handleEditUser(user)}>
              Edit
            </ActionButton>
            {currentUser && currentUser.isAdmin && currentUser._id !== user._id && (
              <ActionButton
                variant="danger"
                onClick={() => {
                  const confirmDelete = confirm(`Do You Want to Delete user: ${user.name}`);
                  if (confirmDelete) {
                    handleDeleteUser(user);
                  }
                }}
              >
                Delete
              </ActionButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Users;
