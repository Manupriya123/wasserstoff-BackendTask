const Editor = ({ content, onChange }) => (
  <textarea value={content} onChange={(e) => onChange(e.target.value)} />
);
export default Editor;
