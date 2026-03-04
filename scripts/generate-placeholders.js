/**
 * generate-placeholders.js
 *
 * Creates minimal valid PNG placeholder images for the Expo app.
 * Each file is a 1x1 black pixel PNG built from raw bytes --
 * no external dependencies required.
 *
 * Usage:  node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Build a minimal valid PNG file buffer for a single-color 1x1 pixel.
 *
 * PNG structure (in order):
 *   1. 8-byte signature
 *   2. IHDR chunk  (image header)
 *   3. IDAT chunk  (compressed image data)
 *   4. IEND chunk  (image end)
 *
 * @param {number} r  Red   0-255
 * @param {number} g  Green 0-255
 * @param {number} b  Blue  0-255
 * @returns {Buffer}
 */
function createPng(r, g, b) {
  // --- PNG signature ---
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // --- Helper: wrap chunk data with length + type + CRC ---
  function makeChunk(type, data) {
    const typeBuffer = Buffer.from(type, 'ascii');
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);

    // CRC covers type + data
    const crcInput = Buffer.concat([typeBuffer, data]);
    const crcValue = crc32(crcInput);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crcValue >>> 0, 0);

    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }

  // --- IHDR: 1x1, 8-bit RGB, no interlace ---
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(1, 0);  // width
  ihdrData.writeUInt32BE(1, 4);  // height
  ihdrData[8] = 8;               // bit depth
  ihdrData[9] = 2;               // color type: RGB
  ihdrData[10] = 0;              // compression
  ihdrData[11] = 0;              // filter
  ihdrData[12] = 0;              // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // --- IDAT: one row, filter byte 0 + RGB pixel ---
  const rawRow = Buffer.from([0, r, g, b]); // filter=None, then pixel
  const compressed = zlib.deflateSync(rawRow);
  const idat = makeChunk('IDAT', compressed);

  // --- IEND ---
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

/**
 * CRC-32 (ISO 3309 / ITU-T V.42) used by PNG.
 * Computed from scratch -- no native addon needed.
 */
function crc32(buf) {
  // Build table once
  if (!crc32.table) {
    crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crc32.table[n] = c;
    }
  }

  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crc32.table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const assetsDir = path.resolve(__dirname, '..', 'app', 'assets');

// Ensure the directory exists
fs.mkdirSync(assetsDir, { recursive: true });

const files = [
  { name: 'icon.png',          r: 0,   g: 0,   b: 0   },  // black
  { name: 'splash.png',        r: 0,   g: 0,   b: 0   },  // black
  { name: 'adaptive-icon.png', r: 0,   g: 0,   b: 0   },  // black
];

files.forEach(({ name, r, g, b }) => {
  const filePath = path.join(assetsDir, name);
  const png = createPng(r, g, b);
  fs.writeFileSync(filePath, png);
  console.log('Created ' + filePath + '  (' + png.length + ' bytes)');
});

console.log('\nAll placeholder PNGs generated successfully.');
