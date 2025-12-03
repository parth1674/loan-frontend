import API from "./axios";

export const getAllUsers = () =>
    API.get("/auth/users", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

export const approveUser = (id: string) =>
    API.patch(`/auth/approve/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
export const getAdminSummary = () =>
    API.get("/loan/admin-summary", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

export const getAdminLoans = (query: any) =>
    API.get("/loan/admin-list", {
        params: query,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });


