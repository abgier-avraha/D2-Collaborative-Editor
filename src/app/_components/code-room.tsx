'use client';

import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useMemo, useRef } from "react";

export default function CodeRoom() {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.register({
      id: 'd2'
    });
    monaco.languages.setMonarchTokensProvider('d2', {
      keywords: [
      ],

      typeKeywords: [
      ],

      selectors: ["->", "->*", "=>", "~", "~*"],

      // we include these common regular expressions
      symbols: /[{|}|:|;|\->]+/,

      // The main tokenizer for our languages
      tokenizer: {
        root: [
          [/.*:/, 'type.identifier'],  // to show class names nicely

          // whitespace
          { include: '@whitespace' },

          // delimiters and operators
          // [/[{|}|:]/, '@brackets'],
          // [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, {
            cases: {
              '@selectors': 'operator',
              '@default': ''
            }
          }],

          // numbers
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],

          // // delimiter: after number because of .\d floats
          [/[;,.]/, 'delimiter'],

          // strings
          [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        ],
        string: [
          // [/[^\\"]+/, 'string'],
          // [/@escapes/, 'string.escape'],
          // [/\\./, 'string.escape.invalid'],
          // [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/#.*$/, 'comment'],
        ],

      },
    });

  }

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.getModel()?.setValue(TEST_STRING)
  }

  return (
    <div className="h-full flex flex-col">
      <div>test header</div>
      <Editor
        className="flex-1"
        language={"d2"}
        defaultValue={"// your code here"}
        theme={"vs-dark"}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
      />
      <div>test footer</div>
    </div>
  );
}

const TEST_STRING = `vars: {
  d2-config: {
    layout-engine: elk
    # Terminal theme code
    theme-id: 300
  }
}
network: {
  cell tower: {
    satellites: {
      shape: stored_data
      style.multiple: true
    }

    transmitter

    satellites -> transmitter: send
    satellites -> transmitter: send
    satellites -> transmitter: send
  }

  online portal: {
    ui: {shape: hexagon}
  }

  data processor: {
    storage: {
      shape: cylinder
      style.multiple: true
    }
  }

  cell tower.transmitter -> data processor.storage: phone logs
}

user: {
  shape: person
  width: 130
}

user -> network.cell tower: make call
user -> network.online portal.ui: access {
  style.stroke-dash: 3
}

api server -> network.online portal.ui: display
api server -> logs: persist
logs: {shape: page; style.multiple: true}

network.data processor -> api server
`