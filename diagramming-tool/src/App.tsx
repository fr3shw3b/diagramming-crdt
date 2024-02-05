import "./App.css";
import { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { nanoid } from "nanoid";
import Draggable from "react-draggable";
import { useRef } from "react";

type Props = {
  docUrl: AutomergeUrl;
};

export type DiagramDoc = {
  nodes: Node[];
};

export type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
};

function App({ docUrl }: Readonly<Props>) {
  const [doc, changeDoc] = useDocument<DiagramDoc>(docUrl);
  const nodeRef = useRef(null);

  return (
    <>
      <h1>Diagramming Tool</h1>
      <p>This is a simple diagramming tool built with Automerge and React.</p>
      <div className="block">
        <button
          onClick={() =>
            changeDoc((d) =>
              d.nodes.push({
                id: nanoid(),
                label: `Node ${d.nodes.length}`,
                x: 100,
                y: 100,
              })
            )
          }
        >
          Add node
        </button>
        <div className="canvas">
          {doc?.nodes?.map((node) => (
            <Draggable
              key={node.id}
              nodeRef={nodeRef}
              defaultPosition={{ x: node.x, y: node.y }}
              scale={1}
              onStop={(_e, data) => {
                changeDoc((d) => {
                  const idx = d.nodes.findIndex((n) => n.id === node.id);
                  d.nodes[idx].x = data.x;
                  d.nodes[idx].y = data.y;
                });
              }}
            >
              <div className="node" ref={nodeRef}>
                {node.label}
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
