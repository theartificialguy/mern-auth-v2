type TPayload = {
  email: string;
  otp: string;
};

export const verifyUserAccount = async (payload: TPayload) => {
  try {
    const response = await fetch("http://localhost:5001/api/v1/users/verify", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

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
