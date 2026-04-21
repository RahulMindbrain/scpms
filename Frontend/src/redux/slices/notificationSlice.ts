import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  fetchUnreadCount,
} from "@/redux/thunks/notificationThunks";

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  entityId?: number;
  entityType?: string;
  createdAt: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n.id === action.payload.id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark All as Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      })

      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n.id === action.payload);
        if (index !== -1) {
          if (!state.items[index].read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.items.splice(index, 1);
        }
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
