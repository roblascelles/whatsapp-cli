declare module 'qrcode-terminal' {
  const qrcode: {
    generate: (input: string, opts?: { small?: boolean }) => void;
  };
  export = qrcode;
} 