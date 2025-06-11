type ErrorResponse = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

export default function isAxiosLikeError(error: unknown): error is ErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as ErrorResponse).response?.data?.message !== "undefined"
  );
}
