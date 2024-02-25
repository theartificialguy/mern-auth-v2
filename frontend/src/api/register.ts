export const registerUser = async (payload: FormData) => {
  try {
    const response = await fetch(
      "http://localhost:5001/api/v1/users/register",
      {
        method: "POST",
        body: payload,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message ?? "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};
