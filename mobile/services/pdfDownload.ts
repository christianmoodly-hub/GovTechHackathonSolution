import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export function escapePdfHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function sanitizePdfFileName(name: string): string {
  return name
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function asFileUri(uri: string): string {
  if (!uri) return uri;
  if (uri.startsWith("file://")) return uri;
  if (uri.startsWith("content://")) return uri;
  // Android paths sometimes come back without a scheme.
  if (uri.startsWith("/")) return `file://${uri}`;
  return `file://${uri}`;
}

/**
 * Write PDF bytes into the app cache/documents folder.
 * Expo Sharing on Android only accepts file:// URIs that the app is allowed
 * to read — expo-print's temp path is often rejected ("Not allowed to read
 * file under given URL"), so we always rewrite into our own directory.
 */
async function writePdfIntoAppStorage(
  printed: { uri: string; base64?: string | null },
  dest: string,
): Promise<string> {
  const to = asFileUri(dest);

  try {
    const existing = await FileSystem.getInfoAsync(to);
    if (existing.exists) {
      await FileSystem.deleteAsync(to, { idempotent: true });
    }
  } catch {
    // continue
  }

  if (printed.base64) {
    await FileSystem.writeAsStringAsync(to, printed.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return to;
  }

  const from = asFileUri(printed.uri);
  const base64 = await FileSystem.readAsStringAsync(from, {
    encoding: FileSystem.EncodingType.Base64,
  });
  await FileSystem.writeAsStringAsync(to, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return to;
}

/**
 * Share a local file:// PDF. Do NOT pass content:// — Expo Sharing rejects
 * non-file schemes and creates its own FileProvider URI internally.
 */
async function sharePdfUri(
  uri: string,
  options: { dialogTitle?: string },
): Promise<void> {
  const fileUri = asFileUri(uri);
  if (!fileUri.startsWith("file://")) {
    throw new Error("PDF share requires a local file on this device.");
  }

  const info = await FileSystem.getInfoAsync(fileUri);
  if (!info.exists || ("size" in info && (info.size ?? 0) < 64)) {
    throw new Error("PDF file is missing or empty. Please try again.");
  }

  if (await Sharing.isAvailableAsync()) {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: options.dialogTitle ?? "Save PDF",
        UTI: "com.adobe.pdf",
      });
      return;
    } catch (err) {
      console.warn("[pdf] shareAsync failed, falling back to print", err);
    }
  }

  // Fallback: system print UI (Save as PDF / print).
  await Print.printAsync({ uri: fileUri });
}

/**
 * Render HTML to a PDF in app storage, then open the system share sheet
 * so the learner can save to Files / Downloads / Drive / WhatsApp.
 */
export async function writeAndSharePdf(options: {
  html: string;
  fileName: string;
  dialogTitle?: string;
}): Promise<{ uri: string; fileName: string }> {
  const safeBase = sanitizePdfFileName(
    options.fileName.replace(/\.pdf$/i, ""),
  );
  const fileName = `${safeBase}-${Date.now()}.pdf`;

  // base64:true lets us rewrite into an app-owned path Expo Go can share.
  const printed = await Print.printToFileAsync({
    html: options.html,
    base64: true,
  });
  if (!printed?.uri && !printed?.base64) {
    throw new Error("PDF generation produced no file.");
  }

  const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!dir) {
    throw new Error("Device storage is unavailable for PDF downloads.");
  }

  // Prefer a subfolder, but fall back to the cache root if mkdir fails.
  let dest = `${dir}${fileName}`;
  try {
    const folder = `${dir}khetha-pdf`;
    const folderInfo = await FileSystem.getInfoAsync(folder);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
    }
    dest = `${folder}/${fileName}`;
  } catch (err) {
    console.warn("[pdf] makeDirectoryAsync, using cache root", err);
  }

  const uri = await writePdfIntoAppStorage(
    { uri: printed.uri, base64: printed.base64 },
    dest,
  );
  await sharePdfUri(uri, { dialogTitle: options.dialogTitle });

  return { uri, fileName };
}

/** Re-open a previously saved PDF via the share sheet. */
export async function shareExistingPdf(
  uri: string,
  options?: { dialogTitle?: string },
): Promise<void> {
  await sharePdfUri(uri, { dialogTitle: options?.dialogTitle });
}
