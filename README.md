# 📝 Diff Chat Editor Module (Frontend-Only with Version History)

## Project Overview  
A self-contained React + TypeScript component enabling users to chat with OpenAI directly in the browser, receive rewrite suggestions, see inline diffs, accept/reject edits, and navigate between historic versions—all without any backend.

---

## ⚙️ User Flow  
1. **User Input**: Paste or type text in the editor.  
2. **Chat Prompt**: User asks the AI—e.g. “Rewrite paragraph 2.”  
3. **OpenAI API Call**: Frontend sends prompt + current text to OpenAI.  
4. **Suggestions Returned**: Structured pairs of original text and improvements.  
5. **Diff Viewer**: Show inline diffs for suggested edits.  
6. **Accept/Reject**: User applies or skips each change.  
7. **Version Save**: Each iteration creates a new version snapshot.  
8. **History Navigation**: User can revert to any prior version, discarding newer ones if needed.

---

## 🧰 Tech Stack & Tools  

- **React** + **TypeScript**  (PURE frontend)
- **OpenAI Chat API** via fetch in frontend  
- **Diff rendering**: `react-diff-viewer-continued`  
- **Diff logic**: `diff` or `diff-match-patch`  
- **History management**: Custom or using `use-undo` or a light stack  
- **Optional**: `@monaco-editor/react` for richer diff UX

---

## 🌳 Version History (Frontend Only)  

- **State Structure**:

```ts
  interface Version {
    id: number;
    text: string;
    timestamp: Date;
    prompt: string;
  }
```

# Deliverable: Self-contained frontend code with clear README (no backend required)