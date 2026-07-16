type CrcPreset = {
  width: number;
  poly: number;
  init: number;
  refin: boolean;
  refout: boolean;
  xorout: number;
  appendLittleEndian?: boolean;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const crcPresets: Record<string, CrcPreset> = {
  crc8: { width: 8, poly: 0x07, init: 0x00, refin: false, refout: false, xorout: 0x00 },
  crc16: { width: 16, poly: 0x1021, init: 0xffff, refin: false, refout: false, xorout: 0x0000 },
  crc16modbus: { width: 16, poly: 0x8005, init: 0xffff, refin: true, refout: true, xorout: 0x0000, appendLittleEndian: true },
  crc32: { width: 32, poly: 0x04c11db7, init: 0xffffffff, refin: true, refout: true, xorout: 0xffffffff }
};

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing element: ${id}`);
  }

  return element as T;
}

function setText(id: string, value: string) {
  byId<HTMLElement>(id).textContent = value;
}

function normalizeHexInput(input: string) {
  return input
    .replace(/0x/gi, "")
    .replace(/[^0-9a-f]/gi, "")
    .toUpperCase();
}

function parseHexBytes(input: string) {
  const normalized = normalizeHexInput(input);
  if (normalized.length === 0) {
    return new Uint8Array();
  }

  if (normalized.length % 2 !== 0) {
    throw new Error("HEX 输入长度必须为偶数。");
  }

  const bytes = new Uint8Array(normalized.length / 2);
  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = Number.parseInt(normalized.slice(index, index + 2), 16);
  }

  return bytes;
}

function bytesToHex(bytes: Uint8Array, separator = " ") {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(separator);
}

function bytesToCArray(bytes: Uint8Array) {
  return `uint8_t data[] = { ${Array.from(bytes, (byte) => `0x${byte.toString(16).padStart(2, "0").toUpperCase()}`).join(", ")} };`;
}

function reflectBits(value: number, width: number) {
  let result = 0;
  for (let bit = 0; bit < width; bit += 1) {
    if ((value >>> bit) & 0x01) {
      result |= 1 << (width - 1 - bit);
    }
  }

  return result >>> 0;
}

function computeCrc(bytes: Uint8Array, preset: CrcPreset) {
  const { width, poly, init, refin, refout, xorout } = preset;
  const topBit = width === 32 ? 0x80000000 : 1 << (width - 1);
  const mask = width === 32 ? 0xffffffff : (1 << width) - 1;
  let crc = init >>> 0;

  for (const byte of bytes) {
    const current = refin ? reflectBits(byte, 8) : byte;
    crc ^= width > 8 ? current << (width - 8) : current;

    for (let count = 0; count < 8; count += 1) {
      const hasTopBit = (crc & topBit) !== 0;
      crc = ((crc << 1) & mask) >>> 0;
      if (hasTopBit) {
        crc ^= poly;
      }
    }
  }

  if (refout) {
    crc = reflectBits(crc, width);
  }

  return (crc ^ xorout) >>> 0;
}

function checksumBytes(bytes: Uint8Array, algorithm: string) {
  switch (algorithm) {
    case "xor":
      return bytes.reduce((accumulator, byte) => accumulator ^ byte, 0) & 0xff;
    case "lrc": {
      const sum = bytes.reduce((accumulator, byte) => accumulator + byte, 0) & 0xff;
      return ((0x100 - sum) & 0xff) >>> 0;
    }
    case "sum":
      return bytes.reduce((accumulator, byte) => accumulator + byte, 0) & 0xff;
    default:
      return computeCrc(bytes, crcPresets[algorithm]);
  }
}

function checksumWidth(algorithm: string) {
  if (algorithm === "crc32") return 4;
  if (algorithm === "crc16" || algorithm === "crc16modbus") return 2;
  return 1;
}

function checksumResultToBytes(result: number, algorithm: string) {
  const width = checksumWidth(algorithm);
  const bytes = new Uint8Array(width);

  for (let index = 0; index < width; index += 1) {
    const shift = (width - 1 - index) * 8;
    bytes[index] = (result >>> shift) & 0xff;
  }

  if (algorithm === "crc16modbus") {
    return bytes.reverse();
  }

  return bytes;
}

function formatNumericResult(result: number, algorithm: string) {
  const width = checksumWidth(algorithm) * 2;
  return `0x${result.toString(16).toUpperCase().padStart(width, "0")}`;
}

function parseTextOrHex(mode: string, input: string) {
  return mode === "hex" ? parseHexBytes(input) : textEncoder.encode(input);
}

function groupBinary(value: string) {
  return value.replace(/(.{4})/g, "$1 ").trim();
}

function parseIntegerValue(raw: string, base: number) {
  const cleaned = raw.trim().replace(/^0x/i, "");
  if (!cleaned) {
    throw new Error("请输入数值。");
  }

  return BigInt(parseIntPrefix(cleaned, base));
}

function parseIntPrefix(value: string, base: number) {
  if (base === 2) return `0b${value}`;
  if (base === 8) return `0o${value}`;
  if (base === 16) return `0x${value}`;
  return value;
}

function parseBitWidth(width: string) {
  return Number.parseInt(width, 10);
}

function toSignedValue(value: bigint, width: number) {
  const max = 1n << BigInt(width);
  const signBit = 1n << BigInt(width - 1);
  return (value & signBit) !== 0n ? value - max : value;
}

function toUnsignedWithinWidth(value: bigint, width: number) {
  const mask = (1n << BigInt(width)) - 1n;
  return value & mask;
}

function formatHexBigInt(value: bigint, width: number) {
  const hexDigits = Math.ceil(width / 4);
  return `0x${value.toString(16).toUpperCase().padStart(hexDigits, "0")}`;
}

function base64ToBytes(base64: string) {
  const normalized = base64.trim();
  if (!normalized) {
    return new Uint8Array();
  }

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function md5(input: string) {
  function rotateLeft(value: number, shift: number) {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(left: number, right: number) {
    const leftLow = left & 0xffff;
    const leftHigh = left >>> 16;
    const rightLow = right & 0xffff;
    const rightHigh = right >>> 16;
    const low = leftLow + rightLow;
    const high = leftHigh + rightHigh + (low >>> 16);
    return ((high & 0xffff) << 16) | (low & 0xffff);
  }

  function f(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function g(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function h(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function i(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }
  function transform(func: (x: number, y: number, z: number) => number, a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(func(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  const bytes = textEncoder.encode(input);
  const wordCount = (((bytes.length + 8) >>> 6) + 1) * 16;
  const words = new Array<number>(wordCount).fill(0);

  for (let index = 0; index < bytes.length; index += 1) {
    words[index >>> 2] |= bytes[index] << ((index % 4) * 8);
  }

  words[bytes.length >>> 2] |= 0x80 << ((bytes.length % 4) * 8);
  words[wordCount - 2] = bytes.length * 8;

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const shifts = [
    [7, 12, 17, 22],
    [5, 9, 14, 20],
    [4, 11, 16, 23],
    [6, 10, 15, 21]
  ];

  const constants = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000));

  for (let offset = 0; offset < wordCount; offset += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;

    for (let step = 0; step < 64; step += 1) {
      let divisor = 0;
      let blockIndex = step;
      let func = f;

      if (step < 16) {
        divisor = step % 4;
        blockIndex = step;
        func = f;
      } else if (step < 32) {
        divisor = step % 4;
        blockIndex = (5 * step + 1) % 16;
        func = g;
      } else if (step < 48) {
        divisor = step % 4;
        blockIndex = (3 * step + 5) % 16;
        func = h;
      } else {
        divisor = step % 4;
        blockIndex = (7 * step) % 16;
        func = i;
      }

      const shiftGroup = Math.floor(step / 16);
      const shift = shifts[shiftGroup][divisor];

      if (step % 4 === 0) {
        a = transform(func, a, b, c, d, words[offset + blockIndex], shift, constants[step]);
      } else if (step % 4 === 1) {
        d = transform(func, d, a, b, c, words[offset + blockIndex], shift, constants[step]);
      } else if (step % 4 === 2) {
        c = transform(func, c, d, a, b, words[offset + blockIndex], shift, constants[step]);
      } else {
        b = transform(func, b, c, d, a, words[offset + blockIndex], shift, constants[step]);
      }
    }

    a = addUnsigned(a, oldA);
    b = addUnsigned(b, oldB);
    c = addUnsigned(c, oldC);
    d = addUnsigned(d, oldD);
  }

  const result = [a, b, c, d]
    .map((value) =>
      Array.from({ length: 4 }, (_, index) => ((value >>> (index * 8)) & 0xff).toString(16).padStart(2, "0")).join("")
    )
    .join("");

  return result.toUpperCase();
}

async function hashText(algorithm: string, input: string) {
  if (algorithm === "MD5") {
    return md5(input);
  }

  const buffer = await crypto.subtle.digest(algorithm, textEncoder.encode(input));
  return bytesToHex(new Uint8Array(buffer), "").toUpperCase();
}

function importKeyBytes(raw: string, encoding: string) {
  if (encoding === "hex") {
    return parseHexBytes(raw);
  }

  return textEncoder.encode(raw);
}

async function aesCbcEncrypt(plainText: string, keyRaw: string, ivRaw: string, keyEncoding: string) {
  const keyBytes = importKeyBytes(keyRaw, keyEncoding);
  const ivBytes = importKeyBytes(ivRaw, keyEncoding);
  if (![16, 24, 32].includes(keyBytes.length)) {
    throw new Error("AES Key 长度必须为 16、24 或 32 字节。");
  }
  if (ivBytes.length !== 16) {
    throw new Error("AES-CBC 的 IV 长度必须为 16 字节。");
  }

  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-CBC" }, false, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv: ivBytes }, key, textEncoder.encode(plainText));
  return new Uint8Array(encrypted);
}

async function aesCbcDecrypt(cipherBytes: Uint8Array, keyRaw: string, ivRaw: string, keyEncoding: string) {
  const keyBytes = importKeyBytes(keyRaw, keyEncoding);
  const ivBytes = importKeyBytes(ivRaw, keyEncoding);
  if (![16, 24, 32].includes(keyBytes.length)) {
    throw new Error("AES Key 长度必须为 16、24 或 32 字节。");
  }
  if (ivBytes.length !== 16) {
    throw new Error("AES-CBC 的 IV 长度必须为 16 字节。");
  }

  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-CBC" }, false, ["decrypt"]);
  const cipherBuffer = new Uint8Array(cipherBytes).buffer as ArrayBuffer;
  const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv: ivBytes }, key, cipherBuffer);
  return textDecoder.decode(new Uint8Array(decrypted));
}

function parsePrefixedNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  if (/^0x/i.test(trimmed)) return Number.parseInt(trimmed.slice(2), 16);
  if (/^0b/i.test(trimmed)) return Number.parseInt(trimmed.slice(2), 2);
  return Number.parseInt(trimmed, 10);
}

function formatRegisterBits(value: number, width: number) {
  const bits: Array<{ bit: number; value: 0 | 1 }> = [];
  for (let bit = width - 1; bit >= 0; bit -= 1) {
    bits.push({
      bit,
      value: ((value >>> bit) & 0x01) as 0 | 1
    });
  }
  return bits;
}

function parseFieldDefinitions(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, startText, widthText, description = ""] = line.split(",").map((piece) => piece.trim());
      return {
        name,
        start: Number.parseInt(startText, 10),
        width: Number.parseInt(widthText, 10),
        description
      };
    })
    .filter((field) => field.name && Number.isFinite(field.start) && Number.isFinite(field.width) && field.width > 0);
}

function candidateBaudRates(clock: number, target: number, oversampling: number) {
  const rawDivisor = clock / (oversampling * target);
  const center = Math.max(1, Math.round(rawDivisor));
  const list: Array<{ divisor: number; actual: number; error: number }> = [];

  for (let divisor = Math.max(1, center - 3); divisor <= center + 3; divisor += 1) {
    const actual = clock / (oversampling * divisor);
    const error = ((actual - target) / target) * 100;
    list.push({ divisor, actual, error });
  }

  return list.sort((left, right) => Math.abs(left.error) - Math.abs(right.error));
}

function parseOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;
  return Number.parseFloat(trimmed);
}

function initCopyButtons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const targetId = button.dataset.copyTarget;
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      const text = "value" in target ? String((target as HTMLInputElement | HTMLTextAreaElement).value) : target.textContent ?? "";
      await navigator.clipboard.writeText(text);
      const original = button.textContent ?? "复制";
      button.textContent = "已复制";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200);
    });
  });
}

function initCrcTool() {
  const mode = byId<HTMLSelectElement>("crc-input-mode");
  const algorithm = byId<HTMLSelectElement>("crc-algorithm");
  const input = byId<HTMLTextAreaElement>("crc-input");
  const error = byId<HTMLElement>("crc-error");

  const run = () => {
    try {
      error.textContent = "";
      const bytes = parseTextOrHex(mode.value, input.value);
      const result = checksumBytes(bytes, algorithm.value);
      const checksum = checksumResultToBytes(result, algorithm.value);
      const fullFrame = new Uint8Array(bytes.length + checksum.length);
      fullFrame.set(bytes);
      fullFrame.set(checksum, bytes.length);

      setText("crc-result-hex", formatNumericResult(result, algorithm.value));
      setText("crc-result-dec", `${result >>> 0}`);
      setText("crc-result-bytes", bytesToHex(checksum));
      setText("crc-result-frame", bytesToHex(fullFrame));
      setText("crc-result-c", bytesToCArray(fullFrame));
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "计算失败。";
    }
  };

  [mode, algorithm, input].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  byId<HTMLButtonElement>("crc-clear").addEventListener("click", () => {
    input.value = "";
    run();
  });

  run();
}

function initBaseConvertTool() {
  const input = byId<HTMLInputElement>("base-input");
  const format = byId<HTMLSelectElement>("base-format");
  const width = byId<HTMLSelectElement>("base-width");
  const signed = byId<HTMLSelectElement>("base-signed");
  const error = byId<HTMLElement>("base-error");

  const run = () => {
    try {
      error.textContent = "";
      const radix = Number.parseInt(format.value, 10);
      const bitWidth = parseBitWidth(width.value);
      let value = parseIntegerValue(input.value, radix);
      value = toUnsignedWithinWidth(value, bitWidth);
      const signedValue = signed.value === "signed" ? toSignedValue(value, bitWidth) : value;
      const binary = value.toString(2).padStart(bitWidth, "0");
      const byteCount = Math.ceil(bitWidth / 8);
      const bytes: string[] = [];

      for (let index = 0; index < byteCount; index += 1) {
        const shift = BigInt((byteCount - 1 - index) * 8);
        bytes.push(((value >> shift) & 0xffn).toString(16).toUpperCase().padStart(2, "0"));
      }

      setText("base-out-bin", groupBinary(binary));
      setText("base-out-dec", signedValue.toString(10));
      setText("base-out-hex", formatHexBigInt(value, bitWidth));
      setText("base-out-oct", value.toString(8));
      setText("base-out-bytes", bytes.join(" "));
      setText("base-out-note", signed.value === "signed" ? "当前以二进制补码解释为有符号整数。" : "当前按无符号整数解释。");
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "转换失败。";
    }
  };

  [input, format, width, signed].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

function initTextHexTool() {
  const mode = byId<HTMLSelectElement>("texthex-mode");
  const encoding = byId<HTMLSelectElement>("texthex-encoding");
  const input = byId<HTMLTextAreaElement>("texthex-input");
  const error = byId<HTMLElement>("texthex-error");

  const run = () => {
    try {
      error.textContent = "";
      let bytes = new Uint8Array();
      let text = "";

      if (mode.value === "text-to-hex") {
        bytes = textEncoder.encode(input.value);
        text = input.value;
      } else {
        bytes = parseHexBytes(input.value);
        text = encoding.value === "ascii" ? Array.from(bytes, (byte) => String.fromCharCode(byte)).join("") : textDecoder.decode(bytes);
      }

      setText("texthex-out-text", text);
      setText("texthex-out-hex", bytesToHex(bytes));
      setText("texthex-out-dec", Array.from(bytes).join(", "));
      setText("texthex-out-c", bytesToCArray(bytes));
      setText("texthex-out-length", `${bytes.length} bytes`);
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "转换失败。";
    }
  };

  [mode, encoding, input].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

function initHashTool() {
  const algorithm = byId<HTMLSelectElement>("hash-algorithm");
  const input = byId<HTMLTextAreaElement>("hash-input");
  const casing = byId<HTMLSelectElement>("hash-casing");
  const error = byId<HTMLElement>("hash-error");

  const run = async () => {
    try {
      error.textContent = "";
      const digest = await hashText(algorithm.value, input.value);
      const output = casing.value === "lower" ? digest.toLowerCase() : digest.toUpperCase();
      setText("hash-out-digest", output);
      setText("hash-out-length", `${output.length} chars`);
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "摘要计算失败。";
    }
  };

  [algorithm, input, casing].forEach((element) => {
    element.addEventListener("input", () => void run());
    element.addEventListener("change", () => void run());
  });

  void run();
}

function initIeee754Tool() {
  const mode = byId<HTMLSelectElement>("ieee-mode");
  const precision = byId<HTMLSelectElement>("ieee-precision");
  const endian = byId<HTMLSelectElement>("ieee-endian");
  const input = byId<HTMLInputElement>("ieee-input");
  const error = byId<HTMLElement>("ieee-error");

  const run = () => {
    try {
      error.textContent = "";
      const bits = precision.value === "32" ? 32 : 64;
      const byteLength = bits / 8;
      const buffer = new ArrayBuffer(byteLength);
      const view = new DataView(buffer);
      const littleEndian = endian.value === "little";
      let hex = "";
      let floatValue = 0;

      if (mode.value === "float-to-hex") {
        const parsed = Number.parseFloat(input.value);
        if (Number.isNaN(parsed)) {
          throw new Error("请输入合法浮点数。");
        }
        floatValue = parsed;
        if (bits === 32) {
          view.setFloat32(0, parsed, littleEndian);
        } else {
          view.setFloat64(0, parsed, littleEndian);
        }
        hex = bytesToHex(new Uint8Array(buffer), "");
      } else {
        const bytes = parseHexBytes(input.value);
        if (bytes.length !== byteLength) {
          throw new Error(`当前精度需要 ${byteLength} 字节 HEX 输入。`);
        }
        new Uint8Array(buffer).set(bytes);
        floatValue = bits === 32 ? view.getFloat32(0, littleEndian) : view.getFloat64(0, littleEndian);
        hex = bytesToHex(bytes, "");
      }

      const binary = Array.from(parseHexBytes(hex), (byte) => byte.toString(2).padStart(8, "0")).join("");
      const exponentBits = bits === 32 ? 8 : 11;
      const mantissaBits = bits === 32 ? 23 : 52;

      setText("ieee-out-float", `${floatValue}`);
      setText("ieee-out-hex", bytesToHex(parseHexBytes(hex)));
      setText("ieee-out-binary", groupBinary(binary));
      setText("ieee-out-sign", binary.slice(0, 1));
      setText("ieee-out-exponent", binary.slice(1, 1 + exponentBits));
      setText("ieee-out-mantissa", binary.slice(1 + exponentBits, 1 + exponentBits + mantissaBits));
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "转换失败。";
    }
  };

  [mode, precision, endian, input].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

function initAesTool() {
  const mode = byId<HTMLSelectElement>("aes-mode");
  const keyEncoding = byId<HTMLSelectElement>("aes-key-encoding");
  const inputEncoding = byId<HTMLSelectElement>("aes-input-encoding");
  const key = byId<HTMLInputElement>("aes-key");
  const iv = byId<HTMLInputElement>("aes-iv");
  const input = byId<HTMLTextAreaElement>("aes-input");
  const error = byId<HTMLElement>("aes-error");

  const run = async () => {
    try {
      error.textContent = "";
      if (mode.value === "encrypt") {
        const encrypted = await aesCbcEncrypt(input.value, key.value, iv.value, keyEncoding.value);
        setText("aes-out-text", bytesToBase64(encrypted));
        setText("aes-out-hex", bytesToHex(encrypted));
        setText("aes-out-base64", bytesToBase64(encrypted));
      } else {
        const cipherBytes = inputEncoding.value === "hex" ? parseHexBytes(input.value) : base64ToBytes(input.value);
        const plainText = await aesCbcDecrypt(cipherBytes, key.value, iv.value, keyEncoding.value);
        setText("aes-out-text", plainText);
        setText("aes-out-hex", bytesToHex(cipherBytes));
        setText("aes-out-base64", bytesToBase64(cipherBytes));
      }
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "AES 处理失败。";
    }
  };

  [mode, keyEncoding, inputEncoding, key, iv, input].forEach((element) => {
    element.addEventListener("input", () => void run());
    element.addEventListener("change", () => void run());
  });

  void run();
}

function initModbusTool() {
  const slave = byId<HTMLInputElement>("modbus-slave");
  const func = byId<HTMLSelectElement>("modbus-func");
  const address = byId<HTMLInputElement>("modbus-address");
  const quantity = byId<HTMLInputElement>("modbus-quantity");
  const raw = byId<HTMLTextAreaElement>("modbus-raw");
  const error = byId<HTMLElement>("modbus-error");

  const buildRequest = () => {
    const frame = new Uint8Array(6);
    frame[0] = parsePrefixedNumber(slave.value) & 0xff;
    frame[1] = parsePrefixedNumber(func.value) & 0xff;
    const register = parsePrefixedNumber(address.value) & 0xffff;
    const count = parsePrefixedNumber(quantity.value) & 0xffff;
    frame[2] = (register >>> 8) & 0xff;
    frame[3] = register & 0xff;
    frame[4] = (count >>> 8) & 0xff;
    frame[5] = count & 0xff;
    const crc = checksumResultToBytes(computeCrc(frame, crcPresets.crc16modbus), "crc16modbus");
    const full = new Uint8Array(8);
    full.set(frame);
    full.set(crc, 6);
    return full;
  };

  const parseResponse = (bytes: Uint8Array) => {
    if (bytes.length < 4) {
      throw new Error("Modbus 报文至少需要 4 字节。");
    }

    const payload = bytes.slice(0, -2);
    const givenCrc = bytes.slice(-2);
    const computed = checksumResultToBytes(computeCrc(payload, crcPresets.crc16modbus), "crc16modbus");
    const crcOk = bytesToHex(givenCrc) === bytesToHex(computed);
    const lines = [
      `Slave Address: 0x${bytes[0].toString(16).padStart(2, "0").toUpperCase()}`,
      `Function Code: 0x${bytes[1].toString(16).padStart(2, "0").toUpperCase()}`
    ];

    if (bytes.length >= 5) {
      lines.push(`Data: ${bytesToHex(bytes.slice(2, -2))}`);
    }

    lines.push(`CRC Given: ${bytesToHex(givenCrc)}`);
    lines.push(`CRC Calc : ${bytesToHex(computed)}`);
    lines.push(`CRC Match: ${crcOk ? "YES" : "NO"}`);
    return lines.join("\n");
  };

  const run = () => {
    try {
      error.textContent = "";
      const request = buildRequest();
      setText("modbus-request", bytesToHex(request));
      setText("modbus-request-c", bytesToCArray(request));
      const rawBytes = raw.value.trim() ? parseHexBytes(raw.value) : request;
      setText("modbus-response", parseResponse(rawBytes));
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "Modbus 处理失败。";
    }
  };

  [slave, func, address, quantity, raw].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

function initRegisterTool() {
  const format = byId<HTMLSelectElement>("register-format");
  const width = byId<HTMLSelectElement>("register-width");
  const input = byId<HTMLInputElement>("register-input");
  const fields = byId<HTMLTextAreaElement>("register-fields");
  const error = byId<HTMLElement>("register-error");

  const run = () => {
    try {
      error.textContent = "";
      const radix = Number.parseInt(format.value, 10);
      const bitWidth = parseBitWidth(width.value);
      const parsed = Number(parseIntegerValue(input.value, radix));
      const value = parsed & (bitWidth === 32 ? 0xffffffff : (1 << bitWidth) - 1);
      const bits = formatRegisterBits(value >>> 0, bitWidth);
      const grid = byId<HTMLElement>("register-bit-grid");
      grid.innerHTML = bits
        .map(
          (bit) =>
            `<div class="tool-bit-cell"><span>bit${bit.bit}</span><strong>${bit.value}</strong></div>`
        )
        .join("");

      const byteCount = Math.ceil(bitWidth / 8);
      const bytes: string[] = [];
      for (let index = 0; index < byteCount; index += 1) {
        bytes.push(((value >>> ((byteCount - 1 - index) * 8)) & 0xff).toString(16).toUpperCase().padStart(2, "0"));
      }

      setText("register-out-hex", `0x${(value >>> 0).toString(16).toUpperCase().padStart(byteCount * 2, "0")}`);
      setText("register-out-bytes", bytes.join(" "));

      const fieldRows = parseFieldDefinitions(fields.value)
        .map((field) => {
          const mask = ((1 << field.width) - 1) << field.start;
          const fieldValue = (value & mask) >>> field.start;
          return `<tr><td>${field.name}</td><td>${field.start}</td><td>${field.width}</td><td>0x${fieldValue.toString(16).toUpperCase()}</td><td>${field.description || "-"}</td></tr>`;
        })
        .join("");

      byId<HTMLElement>("register-field-table-body").innerHTML = fieldRows || `<tr><td colspan="5">未定义字段时，仍可通过上方 bit 视图快速检查寄存器值。</td></tr>`;
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "寄存器解析失败。";
    }
  };

  [format, width, input, fields].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

function initBaudrateTool() {
  const clock = byId<HTMLInputElement>("baud-clock");
  const target = byId<HTMLInputElement>("baud-target");
  const oversampling = byId<HTMLSelectElement>("baud-oversampling");
  const error = byId<HTMLElement>("baud-error");

  const run = () => {
    try {
      error.textContent = "";
      const clockValue = Number.parseFloat(clock.value);
      const targetValue = Number.parseFloat(target.value);
      const oversamplingValue = Number.parseInt(oversampling.value, 10);
      if (!(clockValue > 0) || !(targetValue > 0)) {
        throw new Error("时钟和目标波特率都需要大于 0。");
      }
      const list = candidateBaudRates(clockValue, targetValue, oversamplingValue);
      const best = list[0];
      setText("baud-best-divisor", `${best.divisor}`);
      setText("baud-best-actual", `${best.actual.toFixed(2)} bps`);
      setText("baud-best-error", `${best.error.toFixed(4)} %`);
      byId<HTMLElement>("baud-candidates").innerHTML = list
        .map(
          (item) =>
            `<tr><td>${item.divisor}</td><td>${item.actual.toFixed(2)}</td><td>${item.error.toFixed(4)} %</td><td>${Math.abs(item.error) <= 2 ? "推荐" : "可用性需评估"}</td></tr>`
        )
        .join("");
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "波特率计算失败。";
    }
  };

  [clock, target, oversampling].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

function initTimerTool() {
  const timerClock = byId<HTMLInputElement>("timer-clock");
  const timerPrescaler = byId<HTMLInputElement>("timer-prescaler");
  const timerArr = byId<HTMLInputElement>("timer-arr");
  const pwmCompare = byId<HTMLInputElement>("pwm-compare");
  const adcVref = byId<HTMLInputElement>("adc-vref");
  const adcBits = byId<HTMLSelectElement>("adc-bits");
  const adcCode = byId<HTMLInputElement>("adc-code");
  const adcVoltage = byId<HTMLInputElement>("adc-voltage");
  const error = byId<HTMLElement>("timer-error");

  const timerTabButtons = document.querySelectorAll<HTMLButtonElement>("[data-tool-tab]");
  const timerPanels = document.querySelectorAll<HTMLElement>("[data-tool-panel]");

  timerTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.toolTab;
      timerTabButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      timerPanels.forEach((panel) => panel.hidden = panel.dataset.toolPanel !== tab);
    });
  });

  const run = () => {
    try {
      error.textContent = "";
      const clock = Number.parseFloat(timerClock.value);
      const prescaler = Number.parseFloat(timerPrescaler.value);
      const arr = Number.parseFloat(timerArr.value);
      const compare = Number.parseFloat(pwmCompare.value);
      const vref = Number.parseFloat(adcVref.value);
      const bits = Number.parseInt(adcBits.value, 10);
      const code = Number.parseFloat(adcCode.value);
      const voltage = Number.parseFloat(adcVoltage.value);

      const counterClock = clock / (prescaler + 1);
      const pwmFrequency = counterClock / (arr + 1);
      const timerPeriod = 1 / pwmFrequency;
      const duty = ((compare + 1) / (arr + 1)) * 100;

      setText("timer-out-counter", `${counterClock.toFixed(2)} Hz`);
      setText("timer-out-frequency", `${pwmFrequency.toFixed(4)} Hz`);
      setText("timer-out-period", `${(timerPeriod * 1000).toFixed(4)} ms`);
      setText("pwm-out-frequency", `${pwmFrequency.toFixed(4)} Hz`);
      setText("pwm-out-duty", `${duty.toFixed(3)} %`);

      const fullScale = (1 << bits) - 1;
      const measuredVoltage = (code / fullScale) * vref;
      const derivedCode = Math.round((Math.min(Math.max(voltage, 0), vref) / vref) * fullScale);

      setText("adc-out-voltage", `${measuredVoltage.toFixed(6)} V`);
      setText("adc-out-code", `${derivedCode}`);
      setText("adc-out-lsb", `${(vref / fullScale).toFixed(9)} V / LSB`);
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "参数计算失败。";
    }
  };

  [timerClock, timerPrescaler, timerArr, pwmCompare, adcVref, adcBits, adcCode, adcVoltage].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

function initOhmsLawTool() {
  const voltage = byId<HTMLInputElement>("ohm-voltage");
  const current = byId<HTMLInputElement>("ohm-current");
  const resistance = byId<HTMLInputElement>("ohm-resistance");
  const power = byId<HTMLInputElement>("ohm-power");
  const error = byId<HTMLElement>("ohm-error");

  const run = () => {
    try {
      error.textContent = "";
      let v = parseOptionalNumber(voltage.value);
      let i = parseOptionalNumber(current.value);
      let r = parseOptionalNumber(resistance.value);
      let p = parseOptionalNumber(power.value);
      const knownCount = [v, i, r, p].filter((value) => Number.isFinite(value)).length;

      if (knownCount < 2) {
        throw new Error("至少输入两项已知参数。");
      }

      if (Number.isFinite(v) && Number.isFinite(i)) {
        r = v / i;
        p = v * i;
      } else if (Number.isFinite(v) && Number.isFinite(r)) {
        i = v / r;
        p = v * i;
      } else if (Number.isFinite(v) && Number.isFinite(p)) {
        i = p / v;
        r = v / i;
      } else if (Number.isFinite(i) && Number.isFinite(r)) {
        v = i * r;
        p = v * i;
      } else if (Number.isFinite(i) && Number.isFinite(p)) {
        v = p / i;
        r = v / i;
      } else if (Number.isFinite(r) && Number.isFinite(p)) {
        i = Math.sqrt(p / r);
        v = i * r;
      }

      if (![v, i, r, p].every((value) => Number.isFinite(value) && (value as number) >= 0)) {
        throw new Error("输入组合无法得到有效结果，请检查是否存在除零或负值。");
      }

      setText("ohm-out-voltage", `${v!.toFixed(6)} V`);
      setText("ohm-out-current", `${i!.toFixed(6)} A`);
      setText("ohm-out-resistance", `${r!.toFixed(6)} Ohm`);
      setText("ohm-out-power", `${p!.toFixed(6)} W`);
      setText("ohm-out-note", `负载电流约 ${(i! * 1000).toFixed(3)} mA，若长期工作建议按功耗至少预留 2x 裕量。`);
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "欧姆定律计算失败。";
    }
  };

  [voltage, current, resistance, power].forEach((element) => element.addEventListener("input", run));

  byId<HTMLButtonElement>("ohm-clear").addEventListener("click", () => {
    voltage.value = "";
    current.value = "";
    resistance.value = "";
    power.value = "";
    run();
  });

  run();
}

function initVoltageDividerTool() {
  const vin = byId<HTMLInputElement>("divider-vin");
  const r1 = byId<HTMLInputElement>("divider-r1");
  const r2 = byId<HTMLInputElement>("divider-r2");
  const target = byId<HTMLInputElement>("divider-target");
  const error = byId<HTMLElement>("divider-error");

  const run = () => {
    try {
      error.textContent = "";
      const vinValue = Number.parseFloat(vin.value);
      const r1Value = Number.parseFloat(r1.value);
      const r2Value = Number.parseFloat(r2.value);
      const targetValue = parseOptionalNumber(target.value);

      if (!(vinValue > 0) || !(r1Value > 0) || !(r2Value > 0)) {
        throw new Error("Vin、R1、R2 都需要大于 0。");
      }

      const vout = vinValue * (r2Value / (r1Value + r2Value));
      const totalCurrent = vinValue / (r1Value + r2Value);
      const ratio = vout / vinValue;
      setText("divider-out-vout", `${vout.toFixed(6)} V`);
      setText("divider-out-ratio", `${(ratio * 100).toFixed(4)} %`);
      setText("divider-out-current", `${(totalCurrent * 1000).toFixed(6)} mA`);

      if (Number.isFinite(targetValue) && targetValue > 0 && targetValue < vinValue) {
        const suggestedR2 = r1Value * (targetValue / (vinValue - targetValue));
        setText("divider-out-suggested", `当 R1 = ${r1Value} Ohm 且目标 Vout = ${targetValue} V 时，R2 约为 ${suggestedR2.toFixed(2)} Ohm。`);
      } else {
        setText("divider-out-suggested", "如需反推 R2，可填写目标输出电压（需小于 Vin）。");
      }
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "分压计算失败。";
    }
  };

  [vin, r1, r2, target].forEach((element) => element.addEventListener("input", run));

  run();
}

function initLedResistorTool() {
  const supply = byId<HTMLInputElement>("led-supply");
  const vf = byId<HTMLInputElement>("led-vf");
  const count = byId<HTMLInputElement>("led-count");
  const current = byId<HTMLInputElement>("led-current");
  const error = byId<HTMLElement>("led-error");

  const run = () => {
    try {
      error.textContent = "";
      const supplyValue = Number.parseFloat(supply.value);
      const vfValue = Number.parseFloat(vf.value);
      const countValue = Number.parseInt(count.value, 10);
      const currentValue = Number.parseFloat(current.value);

      if (!(supplyValue > 0) || !(vfValue > 0) || !(countValue > 0) || !(currentValue > 0)) {
        throw new Error("供电电压、LED 压降、串联颗数和目标电流都需要大于 0。");
      }

      const totalDrop = vfValue * countValue;
      const headroom = supplyValue - totalDrop;
      if (headroom <= 0) {
        throw new Error("供电电压不足，无法为当前串联 LED 提供压降余量。");
      }

      const resistor = headroom / currentValue;
      const resistorPower = currentValue * currentValue * resistor;
      setText("led-out-resistor", `${resistor.toFixed(2)} Ohm`);
      setText("led-out-power", `${resistorPower.toFixed(6)} W`);
      setText("led-out-drop", `${totalDrop.toFixed(4)} V`);
      setText("led-out-headroom", `${headroom.toFixed(4)} V`);
      setText("led-out-note", `常见取值可向上就近选标准阻值，并至少预留 ${(resistorPower * 2).toFixed(4)} W 级别的功率裕量。`);
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "LED 限流计算失败。";
    }
  };

  [supply, vf, count, current].forEach((element) => element.addEventListener("input", run));

  run();
}

function initRcTool() {
  const resistance = byId<HTMLInputElement>("rc-resistance");
  const capacitance = byId<HTMLInputElement>("rc-capacitance");
  const error = byId<HTMLElement>("rc-error");

  const run = () => {
    try {
      error.textContent = "";
      const r = Number.parseFloat(resistance.value);
      const cMicro = Number.parseFloat(capacitance.value);
      if (!(r > 0) || !(cMicro > 0)) {
        throw new Error("R 和 C 都需要大于 0。");
      }

      const c = cMicro * 1e-6;
      const tau = r * c;
      const fc = 1 / (2 * Math.PI * tau);
      setText("rc-out-tau", `${tau.toFixed(9)} s`);
      setText("rc-out-fc", `${fc.toFixed(6)} Hz`);
      setText("rc-out-charge", `${tau.toFixed(9)} s 达到约 63.2%`);
      setText("rc-out-settle", `${(tau * 5).toFixed(9)} s 达到约 99.3%`);
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "RC 计算失败。";
    }
  };

  [resistance, capacitance].forEach((element) => element.addEventListener("input", run));

  run();
}

function initOpampTool() {
  const topology = byId<HTMLSelectElement>("opamp-topology");
  const rin = byId<HTMLInputElement>("opamp-rin");
  const rf = byId<HTMLInputElement>("opamp-rf");
  const vin = byId<HTMLInputElement>("opamp-vin");
  const targetGain = byId<HTMLInputElement>("opamp-target-gain");
  const error = byId<HTMLElement>("opamp-error");

  const run = () => {
    try {
      error.textContent = "";
      const rinValue = Number.parseFloat(rin.value);
      const rfValue = Number.parseFloat(rf.value);
      const vinValue = Number.parseFloat(vin.value);
      const targetGainValue = parseOptionalNumber(targetGain.value);

      if (!(rinValue > 0) || !(rfValue > 0)) {
        throw new Error("输入电阻和反馈电阻都需要大于 0。");
      }

      const gain = topology.value === "non-inverting" ? 1 + rfValue / rinValue : -(rfValue / rinValue);
      const vout = vinValue * gain;
      setText("opamp-out-gain", `${gain.toFixed(6)} V/V`);
      setText("opamp-out-vout", `${vout.toFixed(6)} V`);

      if (Number.isFinite(targetGainValue) && targetGainValue !== 0) {
        const suggestedRf = topology.value === "non-inverting"
          ? rinValue * (targetGainValue - 1)
          : Math.abs(targetGainValue) * rinValue;
        setText("opamp-out-suggested", `若 Rin = ${rinValue} Ohm，目标增益 ${targetGainValue} 时，Rf 约为 ${suggestedRf.toFixed(2)} Ohm。`);
      } else {
        setText("opamp-out-suggested", "可填写目标增益，快速反推在当前 Rin 下需要的 Rf。");
      }
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : "运放增益计算失败。";
    }
  };

  [topology, rin, rf, vin, targetGain].forEach((element) => {
    element.addEventListener("input", run);
    element.addEventListener("change", run);
  });

  run();
}

export function initToolPage() {
  initCopyButtons();

  const root = document.querySelector<HTMLElement>("[data-tool-id]");
  if (!root) {
    return;
  }

  switch (root.dataset.toolId) {
    case "crc-checksum":
      initCrcTool();
      break;
    case "base-convert":
      initBaseConvertTool();
      break;
    case "text-hex-convert":
      initTextHexTool();
      break;
    case "hash":
      initHashTool();
      break;
    case "ieee754":
      initIeee754Tool();
      break;
    case "aes":
      void initAesTool();
      break;
    case "modbus-rtu":
      initModbusTool();
      break;
    case "register-parser":
      initRegisterTool();
      break;
    case "baudrate-calculator":
      initBaudrateTool();
      break;
    case "timer-pwm-adc":
      initTimerTool();
      break;
    case "ohms-law":
      initOhmsLawTool();
      break;
    case "voltage-divider":
      initVoltageDividerTool();
      break;
    case "led-resistor":
      initLedResistorTool();
      break;
    case "rc-calculator":
      initRcTool();
      break;
    case "opamp-gain":
      initOpampTool();
      break;
    default:
      break;
  }
}
