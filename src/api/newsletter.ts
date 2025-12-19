// src/api/newsletter.ts (ya /api/newsletter.ts jo tum structure use kar rahe ho)
import API from "./axios";

// GET all subscribers (ADMIN)
export const getSubscribers = () => API.get("/newsletter");

// DELETE subscriber
export const deleteSubscriber = (id: number | string) =>
  API.delete(`/newsletter/${id}`);
