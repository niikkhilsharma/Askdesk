/**
 * PDF Text Extraction Test Script
 * ===============================
 *
 * A small helper script to test how well unpdf can pull text out of a PDF.
 * Useful before wiring extraction into the knowledge-base ingestion pipeline.
 *
 * How to run:
 *   npx tsx scripts/extract-test.ts path/to/your-file.pdf
 *
 * Example:
 *   npx tsx scripts/extract-test.ts "The Seven Principles for Making Marriage Work.pdf"
 *
 * What it does:
 *   1. Reads the PDF from your disk
 *   2. Extracts all text using unpdf
 *   3. Prints a summary report (speed, page count, text quality hints)
 *   4. Saves the full extracted text to samples/out/<filename>.txt
 *
 * Tip: If many pages show "0 chars", the PDF may be scanned/image-based
 * rather than text-based — those won't work well for RAG without OCR.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, extname, join, resolve } from "node:path"

import { extractText, getDocumentProxy } from "unpdf"

/** Prints usage instructions and exits when no file path is provided. */
function usage(): never {
  console.error("Usage: tsx scripts/extract-test.ts <path-to-pdf>")
  process.exit(1)
}

/**
 * Measures how much of the extracted text is whitespace.
 *
 * A healthy text-based PDF usually sits somewhere around 15–25%.
 * Very low values can mean words are run together; very high values
 * can mean lots of blank lines or formatting gaps.
 */
function whitespaceRatio(text: string): number {
  if (text.length === 0) {
    return 0
  }

  const whitespaceCount = (text.match(/\s/g) ?? []).length
  return whitespaceCount / text.length
}

/** Turns a decimal ratio (e.g. 0.174) into a readable percentage (e.g. "17.4%"). */
function formatRatio(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`
}

async function main() {
  // -------------------------------------------------------------------------
  // Step 1: Resolve the input file path from the command line
  // -------------------------------------------------------------------------
  const inputPath = process.argv[2]

  if (!inputPath) {
    usage()
  }

  // resolve() turns relative paths like "./book.pdf" into absolute paths.
  const resolvedPath = resolve(inputPath)

  // -------------------------------------------------------------------------
  // Step 2: Read the PDF bytes from disk
  // -------------------------------------------------------------------------
  let data: Uint8Array

  try {
    // Node gives us a Buffer, but unpdf specifically wants a Uint8Array.
    // Wrapping with `new Uint8Array(...)` satisfies that requirement.
    data = new Uint8Array(readFileSync(resolvedPath))
  } catch {
    console.error(`Failed to read file: ${resolvedPath}`)
    process.exit(1)
  }

  // -------------------------------------------------------------------------
  // Step 3: Extract text from the PDF (timed)
  // -------------------------------------------------------------------------
  //
  // getDocumentProxy  → parses the raw PDF bytes into a document object
  // extractText       → pulls plain text out of every page
  //
  // mergePages: true  → joins all pages into one string (good for saving to .txt)
  const startedAt = performance.now()
  const doc = await getDocumentProxy(data)
  const { totalPages, text } = await extractText(doc, { mergePages: true })
  const elapsedMs = performance.now() - startedAt

  // -------------------------------------------------------------------------
  // Step 4: Gather per-page stats for the report
  // -------------------------------------------------------------------------
  //
  // We call extractText again with mergePages: false so we get one string
  // per page. That lets us spot empty pages (often cover pages or images).
  const { text: pageTexts } = await extractText(doc, { mergePages: false })
  const perPageCounts = pageTexts.map((pageText) => pageText.length)

  const totalCharacters = text.length
  const avgCharsPerPage =
    totalPages > 0 ? (totalCharacters / totalPages).toFixed(1) : "0.0"

  // -------------------------------------------------------------------------
  // Step 5: Write the extracted text to samples/out/
  // -------------------------------------------------------------------------
  const outputDir = join(process.cwd(), "samples", "out")
  const outputName = basename(resolvedPath, extname(resolvedPath))
  const outputPath = join(outputDir, `${outputName}.txt`)

  // recursive: true creates the folder if it doesn't exist yet.
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputPath, text, "utf8")

  // -------------------------------------------------------------------------
  // Step 6: Print a human-readable report to the terminal
  // -------------------------------------------------------------------------
  console.log("")
  console.log("PDF extraction report")
  console.log("=====================")
  console.log(`File:              ${resolvedPath}`)
  console.log(`Extraction time:   ${elapsedMs.toFixed(1)} ms`)
  console.log(`Page count:        ${totalPages}`)
  console.log(`Total characters:  ${totalCharacters}`)
  console.log(`Avg chars per page: ${avgCharsPerPage}`)
  console.log(
    `Whitespace ratio:  ${formatRatio(whitespaceRatio(text))} (${totalCharacters === 0 ? 0 : (text.match(/\s/g) ?? []).length} whitespace chars)`
  )
  console.log("")
  console.log("Per-page character breakdown:")
  console.log("(Pages with 0 chars are usually images, covers, or blank pages)")
  perPageCounts.forEach((count, index) => {
    console.log(`  Page ${index + 1}: ${count} chars`)
  })
  console.log("")
  console.log(`Output written to: ${outputPath}`)
  console.log("")
}

main().catch((error) => {
  console.error("Extraction failed:", error)
  process.exit(1)
})
