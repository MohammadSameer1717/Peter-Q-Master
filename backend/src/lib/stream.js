 // backend/src/lib/stream.js
import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

// Load keys from the ENV file
const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

// Check for missing keys
if (!apiKey || !apiSecret) {
  console.error("❌ STREAM_API_KEY or STREAM_API_SECRET is missing. Stream services disabled.");
}

// Create a safe fallback client to avoid server crash
const createSafeClient = () => {
  const noop = async () => {};
  console.warn("⚠️ Using dummy Stream client (no real Stream operations).");

  return {
    upsertUser: noop,
    deleteUser: noop,
    feed: () => ({ addActivity: noop, get: async () => ({ results: [] }) }),
  };
};

// Chat Client
export const chatClient =
  apiKey && apiSecret
    ? StreamChat.getInstance(apiKey, apiSecret)
    : createSafeClient();

// Video/Call Client
export const streamClient =
  apiKey && apiSecret
    ? new StreamClient(apiKey, apiSecret)
    : createSafeClient();

// Create User
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted:", userData);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

// Delete User
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted:", userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

