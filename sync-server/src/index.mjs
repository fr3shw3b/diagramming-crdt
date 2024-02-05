import express from "express"
import { WebSocketServer } from "ws"
import { Repo } from "@automerge/automerge-repo"
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket"
import { NodeFSStorageAdapter } from "@automerge/automerge-repo-storage-nodefs"

const wsServer = new WebSocketServer({ noServer: true })
const config = {
  network: [new NodeWSServerAdapter(wsServer)],
  storage: new NodeFSStorageAdapter(),
}

const PORT = 3045
const _serverRepo = new Repo(config)
const app = express()

app.get("/", (_req, res) => {
  res.send("Diagramming Tool Sync Server")
})


app.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request)
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

