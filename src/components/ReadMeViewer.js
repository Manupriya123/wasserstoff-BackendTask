// components/ReadmeViewer.js
import React from 'react';

const formatReadmeContent = (content) => {
  const lines = content.split('\n');
  return lines.map((line, index) => {
    // Basic formatting rules for demonstration
    if (line.startsWith('# ')) {
      return <h1 key={index}>{line.substring(2)}</h1>;
    } else if (line.startsWith('## ')) {
      return <h2 key={index}>{line.substring(3)}</h2>;
    } else if (line.startsWith('### ')) {
      return <h3 key={index}>{line.substring(4)}</h3>;
    } else if (line.startsWith('- ')) {
      return <li key={index}>{line.substring(2)}</li>;
    } else {
      return <p key={index}>{line}</p>;
    }
  });
};

const ReadmeViewer = ({ content }) => {
  return (
    <div className="p-4 border rounded bg-white shadow">
      {formatReadmeContent(content)}
    </div>
  );
};

export default ReadmeViewer;
