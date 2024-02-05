import React from "react";
import ReactDOM from "react-dom/client";
import { isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";

import App, { Node } from "./App.tsx";
import "./index.css";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";

const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter("ws://localhost:3045")],
  storage: new IndexedDBStorageAdapter(),
});

const rootDocUrl = `${document.location.hash.substring(1)}`;
let handle;
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl);
} else {
  handle = repo.create<{ nodes?: Node[] }>();
  handle.change((d) => (d.nodes = []));
}
const docUrl = (document.location.hash = handle.url);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <App docUrl={docUrl} />
    </RepoContext.Provider>
  </React.StrictMode>
);
