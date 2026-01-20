/**
 * Formats an API error object into a user-friendly string.
 * @param {Object} error - The error object from axios/api.
 * @returns {String} A friendly error message.
 */
export const getFriendlyErrorMessage = (error) => {
    if (!error) return "An unexpected error occurred.";

    if (error.response) {
        const data = error.response.data;
        const status = error.response.status;

        // 1. Handle specific error formats
        // DRF 'detail' key
        if (data?.detail) {
            return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        }
        // DRF 'non_field_errors'
        if (data?.non_field_errors) {
            return Array.isArray(data.non_field_errors)
                ? data.non_field_errors.join(' ')
                : String(data.non_field_errors);
        }
        // Generic 'error' key
        if (data?.error) {
            return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        }

        // 2. Handle Field Errors (e.g. { username: ["This field is required."] })
        if (typeof data === 'object') {
            const messages = [];
            for (const key in data) {
                if (Array.isArray(data[key])) {
                    messages.push(`${key}: ${data[key].join(' ')}`);
                } else if (typeof data[key] === 'string') {
                    messages.push(`${key}: ${data[key]}`);
                }
            }
            if (messages.length > 0) {
                // Capitalize first letter of field names for better look
                return messages.map(msg => msg.charAt(0).toUpperCase() + msg.slice(1)).join('\n');
            }
        }

        // 3. Status Fallbacks
        if (status === 401) return "Unauthorized. Please log in again.";
        if (status === 403) return "You do not have permission to perform this action.";
        if (status === 404) return "Resource not found.";
        if (status === 500) return "Internal Server Error. Please try again later.";

        return `Error: ${status}`;
    } else if (error.request) {
        // Request was made but no response received
        return "Network error. Please check your connection.";
    } else {
        // Something happened in setting up the request
        return error.message || "An unexpected error occurred.";
    }
};
