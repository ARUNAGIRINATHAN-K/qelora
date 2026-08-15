import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

const text = "[Western Roman Empire](Western%20Roman%20Empire)";
const html = renderToString(React.createElement(ReactMarkdown, {
  components: {
    a: ({ node, ...props }) => React.createElement('button', { className: 'bold underline' }, props.children)
  }
}, text));

console.log(html);
