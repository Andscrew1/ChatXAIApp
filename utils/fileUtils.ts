const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const SUPPORTED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'text/markdown',
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'application/xml',
    'text/x-python',
    'application/x-sh',
];

export function validateFile(file: File): { isValid: boolean, error?: string } {
    if (file.size > MAX_FILE_SIZE) {
        return { isValid: false, error: `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` };
    }
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
        return { isValid: false, error: `Unsupported file type: ${file.type}.` };
    }
    return { isValid: true };
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}
