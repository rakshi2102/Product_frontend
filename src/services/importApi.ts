export interface ImportRow {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  accountCode?: string;
  status?: string;
}

export interface ImportPreviewResult {
  totalRows: number;
  validRows: number;
  errorRows: number;
  rows: (ImportRow & { _status: 'Valid' | 'Error'; _errorMsg?: string })[];
}

export interface RateImportRow {
  productName: string;
  minRate: number;
  maxRate: number;
  _status: 'Valid' | 'Error';
  _errorMsg?: string;
}

export interface RateImportPreviewResult {
  totalRows: number;
  validRows: number;
  errorRows: number;
  rows: RateImportRow[];
}

export const importApi = {
  async processImportData(rawRows: Record<string, any>[]): Promise<ImportPreviewResult> {
    const processedRows = rawRows.map((row, index) => {
      const sku = String(row['SKU'] || row['sku'] || `IMP-${index + 100}`).trim();
      const name = String(row['Name'] || row['name'] || row['Product Name'] || 'Unnamed Product').trim();
      const category = String(row['Category'] || row['category'] || 'Hardware').trim();
      const price = parseFloat(row['Price'] || row['price'] || row['Unit Price'] || '0') || 0;
      const cost = parseFloat(row['Cost'] || row['cost'] || row['Unit Cost'] || '0') || 0;
      const accountCode = row['Account Code'] || row['accountCode'] || '';

      let isError = false;
      let errorMsg = '';

      if (!name || name === 'Unnamed Product') {
        isError = true;
        errorMsg = 'Missing Product Name';
      } else if (price < 0) {
        isError = true;
        errorMsg = 'Price cannot be negative';
      }

      return {
        sku,
        name,
        category,
        price,
        cost,
        accountCode,
        _status: (isError ? 'Error' : 'Valid') as 'Valid' | 'Error',
        _errorMsg: errorMsg
      };
    });

    const validRows = processedRows.filter(r => r._status === 'Valid').length;
    const errorRows = processedRows.filter(r => r._status === 'Error').length;

    return {
      totalRows: processedRows.length,
      validRows,
      errorRows,
      rows: processedRows
    };
  },

  async processRateImportData(rawRows: Record<string, any>[]): Promise<RateImportPreviewResult> {
    const processedRows: RateImportRow[] = rawRows.map(row => {
      const productName = String(row['PRODUCT'] || row['Product'] || row['productName'] || row['Item'] || '').trim();
      const minRate = parseFloat(row['MIN'] || row['Min'] || row['minRate'] || '0') || 0;
      const maxRate = parseFloat(row['MAX'] || row['Max'] || row['maxRate'] || '0') || 0;

      let isError = false;
      let errorMsg = '';

      if (!productName) {
        isError = true;
        errorMsg = 'Missing Product Name';
      } else if (minRate <= 0 || maxRate <= 0) {
        isError = true;
        errorMsg = 'Min and Max rates must be positive';
      } else if (minRate > maxRate) {
        isError = true;
        errorMsg = 'Min rate cannot exceed Max rate';
      }

      return {
        productName,
        minRate,
        maxRate,
        _status: isError ? 'Error' : 'Valid',
        _errorMsg: errorMsg
      };
    });

    const validRows = processedRows.filter(r => r._status === 'Valid').length;
    const errorRows = processedRows.filter(r => r._status === 'Error').length;

    return {
      totalRows: processedRows.length,
      validRows,
      errorRows,
      rows: processedRows
    };
  }
};
