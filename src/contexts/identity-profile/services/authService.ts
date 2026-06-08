import api from "./api";

export const registerUser = async (data: unknown) => {
  const response = await api.post(
    "/v1/identity/register",
    data
  );

  return response.data;
};