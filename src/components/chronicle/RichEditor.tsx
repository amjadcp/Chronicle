import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { marked } from "marked";
import TurndownService from "turndown";
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";

const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });

interface Props {
  valueMarkdown: string;
  onChangeMarkdown: (md: string) => void;
}

export function RichEditor({ valueMarkdown, onChangeMarkdown }: Props) {
  const initialHTML = useMemo(
    () => (valueMarkdown ? (marked.parse(valueMarkdown) as string) : "<p></p>"),
    // only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false, autolink: true })],
    content: initialHTML,
    editorProps: { attributes: { class: "tiptap prose prose-sm max-w-none focus:outline-none" } },
    onUpdate: ({ editor }) => {
      const md = td.turndown(editor.getHTML());
      onChangeMarkdown(md);
    },
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
    }`;

  return (
    <div className="rounded-md border border-border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
        <button
          type="button"
          aria-label="Bold"
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Italic"
          className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Underline"
          className={btn(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Heading"
          className={btn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Bulleted list"
          className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Link"
          className={btn(editor.isActive("link"))}
          onClick={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <div className="ml-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              editor.chain().focus().clearContent().run();
              onChangeMarkdown("");
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
