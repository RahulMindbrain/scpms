import React, { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket.config";
import { SOCKET_EVENTS } from "./socket.events";
import { toast } from "sonner";
import type { RootState } from "../redux/reducers/rootReducer";

const SocketContext = createContext<typeof socket | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user, userType } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Establish connection
            socket.connect();

            // Join user-specific rooms
            socket.emit("join", {
                userId: user.id,
                role: userType,
            });

            console.log("🔌 Socket connected and joined rooms for user:", user.id);
        } else {
            if (socket.connected) {
                socket.disconnect();
                console.log("❌ Socket disconnected (user logged out)");
            }
        }

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off(SOCKET_EVENTS.NEW_APPLICATION);
            socket.off(SOCKET_EVENTS.APPLICATION_STATUS_UPDATED);
            socket.off(SOCKET_EVENTS.OFFER_ACCEPTED);
            socket.off(SOCKET_EVENTS.SYSTEM_ALERT);
        };
    }, [isAuthenticated, user, userType]);

    useEffect(() => {
        // =========================
        // GLOBAL EVENT LISTENERS
        // =========================

        socket.on(SOCKET_EVENTS.NEW_APPLICATION, (data) => {
            console.log("📩 New Application Received:", data);
            toast.info("New Job Application!", {
                description: `${data.studentName || 'A student'} applied for a job.`,
                action: {
                    label: "View",
                    onClick: () => console.log("Navigate to application:", data.applicationId),
                },
            });
        });

        socket.on(SOCKET_EVENTS.APPLICATION_STATUS_UPDATED, (data) => {
            console.log("📝 Application Status Updated:", data);
            toast.success("Application Update", {
                description: `Your application for "${data.jobTitle}" is now ${data.status}.`,
            });
        });

        socket.on(SOCKET_EVENTS.OFFER_ACCEPTED, (data) => {
            console.log("🎊 Offer Accepted:", data);
            toast.success("Offer Accepted!", {
                description: `${data.studentName} has accepted the offer for "${data.jobTitle}".`,
            });
        });

        socket.on(SOCKET_EVENTS.SYSTEM_ALERT, (data) => {
            toast.warning("System Alert", {
                description: data.message,
            });
        });

        socket.on("connect_error", (err) => {
            console.error("🔌 Socket connection error:", err.message);
        });

        return () => {
            socket.off(SOCKET_EVENTS.NEW_APPLICATION);
            socket.off(SOCKET_EVENTS.APPLICATION_STATUS_UPDATED);
            socket.off(SOCKET_EVENTS.OFFER_ACCEPTED);
            socket.off(SOCKET_EVENTS.SYSTEM_ALERT);
            socket.off("connect_error");
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
