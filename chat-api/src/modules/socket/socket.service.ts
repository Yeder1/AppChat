import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import ENV from "@core/configs/env";

let _socketServer: Server | null = null;

const initSocket = async (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                const isAllowedOrigin = !!origin && ENV.ALLOWED_ORIGINS.includes(origin);
                if (!isAllowedOrigin) {
                    console.log('Not allowed by CORS', origin);
                    callback(new Error('Not allowed by CORS'));
                    return;
                }
                callback(null, true);
            },
            methods: ENV.ALLOWED_METHODS,
            credentials: true,
        },
        allowUpgrades: true,
        transports: ["polling", "websocket"],
    });

    io.on("connection", (socket: Socket) => {
        socket.on("chat", (msg: string) => {
            io.emit("chat", msg);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });

    _socketServer = io;
}

const getSocketServer = () => {
    return _socketServer;
}


const SocketService = {
    initSocket,
    getSocketServer,
};

export default SocketService;