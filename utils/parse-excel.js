
import XLSX from 'xlsx';

/**
 * Parses the Excel file and returns an array of records.
 * @param {Buffer} buffer - The Excel file buffer.
 * @returns {Promise<Array>} - A promise that resolves to an array of parsed records.
 */
export const parseExcel = async (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Process data here if needed (e.g., validate, transform, etc.)
  return data;
};
