/**
 * Node Modules
 */
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';

interface TiptapProps {
  value: string;
  onChange: (html: string) => void;
}

const Tiptap: React.FC<TiptapProps> = ({ value, onChange }) => {
  const [isPickerOpen, setPickerOpen] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type your caption...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Synchronize values ​​from outside if they change (reset, etc.)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  useEffect(() => {
    if (isPickerOpen && emojiButtonRef.current) {
      const buttonRect = emojiButtonRef.current.getBoundingClientRect();
      const spaceAbove = buttonRect.top;
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      if (spaceBelow < 200 && spaceAbove > 200) {
        setPickerPosition('top');
      } else {
        setPickerPosition('bottom');
      }
    }
  }, [isPickerOpen]);

  const addEmoji = (emojiData: EmojiClickData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
  };

  if (!editor) return null;

  return (
    <div className="relative mb-2">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive('bold')
              ? 'tiptap-button tiptap-button-active'
              : 'tiptap-button'
          }
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive('italic')
              ? 'tiptap-button tiptap-button-active'
              : 'tiptap-button'
          }
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive('blockquote')
              ? 'tiptap-button tiptap-button-active'
              : 'tiptap-button'
          }
        >
          Blockquote
        </button>
        <button
          ref={emojiButtonRef}
          type="button"
          onClick={() => setPickerOpen(!isPickerOpen)}
          className="emoji-button"
        >
          😀
        </button>
      </div>

      {isPickerOpen && (
        <div
          className={`absolute z-550 ${
            pickerPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <EmojiPicker onEmojiClick={addEmoji} theme={Theme.DARK} />
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm h-full max-h-fit max-w-7xl rounded-xl border-none bg-dark-3 px-3 py-3 ring-offset-light-3 focus-visible:ring-1 focus-visible:ring-offset-1"
      />
    </div>
  );
};

export default Tiptap;
