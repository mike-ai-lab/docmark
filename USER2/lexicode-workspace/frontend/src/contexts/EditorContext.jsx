import React, { createContext, useContext, useRef } from 'react';

const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
    const editorRef = useRef(null);

    return (
        <EditorContext.Provider value={editorRef}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
};
