export const log = (message: string, data?: any) => {
  if (import.meta.env.VITE_LOGI_ADMIN === "1") {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

export const logError = (message: string, error?: any) => {
  if (import.meta.env.VITE_LOGI_ADMIN === "1") {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }
}; 