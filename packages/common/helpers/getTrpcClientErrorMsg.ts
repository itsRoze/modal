interface ITrpcClientError {
  message: string;
}

export const getTrpcClientErrorMsg = (error: ITrpcClientError) => {
  const message = error.message;
  const errors = JSON.parse(message) as {
    message: string;
  }[];

  return errors.length === 0
    ? "Something went wrong"
    : errors[0]?.message ?? "Something went wrong";
};
