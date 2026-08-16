export {};

declare global {
  interface Window {
    roar: {
      selectIngestFolder: () => Promise<string | null>;
      startRun: (folderPath: string) => Promise<{ started: boolean; folderPath: string }>;
    };
  }
}
