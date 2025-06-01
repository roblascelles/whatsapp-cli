# WhatsApp CLI Messenger

A simple command-line tool to send WhatsApp messages using [Baileys](https://github.com/WhiskeySockets/Baileys) and TypeScript.

## Features
- Send WhatsApp messages from the command line
- QR code authentication (first run)
- TypeScript, modern CLI UX
- Easily extensible for more features

## Setup

1. **Clone the repository and install dependencies:**
   ```sh
   npm install
   ```

2. **Build (optional, for JS output):**
   ```sh
   npm run build
   ```

3. **Run the CLI:**
   ```sh
   npm start -- --to <number> --message "Your message here"
   ```
   Example:
   ```sh
   npm start -- --to 15551234567 --message "Hello from CLI!"
   ```
   - The first time you run, scan the QR code with your WhatsApp app.
   - The number must include the country code (e.g., `15551234567` for US).

## Project Structure
- `src/WhatsAppClient.ts` — WhatsApp connection and messaging logic
- `src/index.ts` — CLI entry point
- `types/qrcode-terminal.d.ts` — Custom type definition for `qrcode-terminal`
- `auth/` — Stores WhatsApp session credentials (auto-created, ignored by git)

## Notes
- **Authentication:** The first run will prompt you to scan a QR code. After that, your session is saved in `auth/`.
- **Type Definitions:** Custom types for `qrcode-terminal` are in `types/`.
- **.gitignore:** Ensures `node_modules/`, `dist/`, and `auth/` are not committed.

## Extending
- Add new features (media, group messaging, etc.) by extending `WhatsAppClient`.
- For more info, see the [Baileys documentation](https://github.com/WhiskeySockets/Baileys).

---

**MIT License** 