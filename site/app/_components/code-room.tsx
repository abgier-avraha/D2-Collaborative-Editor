'use client';

import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef, useState } from "react";
import { D2Preview } from "./d2-preview";

export default function CodeRoom() {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [script, setScript] = useState<string>();

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.register({
      id: 'd2',
      extensions: [".d2"],
      aliases: ["d2", "d2"],
    });

    monaco.languages.setMonarchTokensProvider('d2', {
      keywords: [
        "true",
        "false"
      ],

      selectors: /[\->|\->\*|=>|~|~\*]/,

      // we include these common regular expressions
      symbols: /[{|}|:|;]+/,

      // The main tokenizer for our languages
      tokenizer: {
        root: [
          [/[a-z_$][-\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'variable' } }],

          // whitespace
          { include: '@whitespace' },

          // delimiters and operators
          // [/[{|}|:]/, '@brackets'],
          // [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, 'operators'],
          [/@selectors/, 'attribute'],

          // numbers
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],

          // // delimiter: after number because of .\d floats
          [/[;,.]/, 'delimiter'],

          // strings
          // [/:(\w|\s)\w+$/, 'type.identifier'],
        ],
        string: [
          // [/:(\w|\s)\w+$/, 'type.identifier'],
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
      <div className="flex flex-row flex-1 overflow-hidden">
        <div className="basis-1/2">
          <Editor
            language={"d2"}
            defaultValue={"// your code here"}
            theme={"vs-dark"}
            onMount={handleEditorDidMount}
            beforeMount={handleEditorWillMount}
            onChange={v => setScript(v)}
          />
        </div>
        <div className="basis-1/2 overflow-auto">
          <D2Preview script={script} />
        </div>
      </div>
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