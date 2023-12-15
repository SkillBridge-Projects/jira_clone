import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';

import { TextEditor, Textarea } from 'shared/components';

import { Actions, FormButton } from './Styles';

const propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isWorking: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsCommentsBodyForm = ({
  value,
  onChange,
  isWorking,
  onSubmit,
  onCancel,
  projectUsers,
}) => {
  const $textareaRef = useRef();

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <Fragment>
      <TextEditor
        placeholder="Add a comment..."
        defaultValue={value}
        onChange={onChange}
        ref={$textareaRef}
        mentionUsers={projectUsers}
      />
      <Actions>
        <FormButton variant="primary" isWorking={isWorking} onClick={handleSubmit}>
          Save
        </FormButton>
        <FormButton variant="empty" onClick={onCancel}>
          Cancel
        </FormButton>
      </Actions>
    </Fragment>
  );
};

ProjectBoardIssueDetailsCommentsBodyForm.propTypes = propTypes;

export default ProjectBoardIssueDetailsCommentsBodyForm;
