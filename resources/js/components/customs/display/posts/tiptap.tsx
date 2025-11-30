/**
 * Node Modules
 */
import { cn } from '@/lib/utils';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';

interface TiptapProps {
  value: string;
  className?: string;
  onChange: (html: string) => void;
}

const Tiptap: React.FC<TiptapProps> = ({ value, onChange, className }) => {
  const [isPickerOpen, setPickerOpen] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type the caption here...',
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
        className={cn(
          'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-blue-600',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          // 🔥 Kunci agar tingginya otomatis seperti Tiptap default:
          'prose prose-sm flex h-auto min-h-fit max-w-7xl flex-col',

          className,
        )}
      />
    </div>
  );
};

export default Tiptap;
