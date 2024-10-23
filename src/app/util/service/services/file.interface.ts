export interface FileRecord {
    fileId: string;   // Unique identifier for the file
    fileName: string; // Name of the file
    fileData: string; // Data of the file (e.g., Base64 encoded string)
}