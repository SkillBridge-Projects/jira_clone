/* eslint-disable no-underscore-dangle */
import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import "quill-mention";

import 'quill/dist/quill.snow.css';

import { EditorCont } from './Styles';
import { useEffect } from 'react';

const propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  ignoreCacheDefaultvalue: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  getEditor: PropTypes.func,
  mentionUsers: PropTypes.array
};

const defaultProps = {
  className: undefined,
  placeholder: undefined,
  defaultValue: undefined,
  ignoreCacheDefaultvalue: false,
  value: undefined,
  onChange: () => {},
  getEditor: () => {},
  mentionUsers: [],
};

const MentionBlot = Quill.import("blots/mention");

class StyledMentionBlot extends MentionBlot {
  static render(data) {
    const element = document.createElement('span');
    element.innerText = data.value;
    element.style.color = '#989898';
    return element;
  }
}
StyledMentionBlot.blotName = "styled-mention";

Quill.register(StyledMentionBlot);

const getMentionModule = (users) => {
  return {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@"],
    source(searchTerm, renderList) {
      const values = users.map(user => ({...user, id: user._id, value: user.name}));

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < values.length; i += 1) {
          if (
            !values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
          ) {
            matches.push(values[i]);
          }
        }
        renderList(matches, searchTerm);
      }
    },
    renderItem: (data) => {
      const div = document.createElement("div");
      div.innerText = data.value;
      return div;
    },
    renderLoading: () => {
      return "Loading...";
    },
    dataAttributes: ['id', 'value', 'denotationChar', 'link', 'target', 'disabled', 'color'],
    blotName: 'styled-mention',
  }
}

const TextEditor = ({
  className,
  placeholder,
  defaultValue,
  // we're not really feeding new value to quill instance on each render because it's too
  // expensive, but we're still accepting 'value' prop as alias for defaultValue because
  // other components like <Form.Field> feed their children with data via the 'value' prop
  value: alsoDefaultValue,
  ignoreCacheDefaultvalue,
  onChange,
  getEditor,
  mentionUsers,
}) => {
  const $editorContRef = useRef();
  const $editorRef = useRef();
  const initialValueRef = useRef(defaultValue || alsoDefaultValue || '');

  useLayoutEffect(() => {
    let quill = new Quill($editorRef.current, 
        { 
          placeholder, 
          ...quillConfig, 
          modules: {
            ...quillConfig.modules,
            mention: getMentionModule(mentionUsers),
          }
      });

    const insertInitialValue = () => {
      quill.clipboard.dangerouslyPasteHTML(0, initialValueRef.current);
      quill.blur();
    };
    const handleContentsChange = () => {
      onChange(getHTMLValue());
    };
    const getHTMLValue = () => $editorContRef.current.querySelector('.ql-editor').innerHTML;

    insertInitialValue();
    getEditor({ getValue: getHTMLValue });

    quill.on('text-change', handleContentsChange);
    return () => {
      quill.off('text-change', handleContentsChange);
      quill = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ignoreCacheDefaultvalue) {
      initialValueRef.current = defaultValue;
      // Reinsert the updated initial value into the Quill instance
      if ($editorRef.current) {
        $editorRef.current.children[0].innerHTML = initialValueRef.current;
      }
    }
  }, [defaultValue, ignoreCacheDefaultvalue])

  return (
    <EditorCont className={className} ref={$editorContRef}>
      <div ref={$editorRef} />
    </EditorCont>
  );
};

const quillConfig = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  },
};

TextEditor.propTypes = propTypes;
TextEditor.defaultProps = defaultProps;

export default TextEditor;
