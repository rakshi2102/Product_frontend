export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateString;
  }
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'mapped':
    case 'resolved':
      return 'badge badge-success';
    case 'pending':
    case 'draft':
    case 'warning':
    case 'medium':
      return 'badge badge-warning';
    case 'inactive':
    case 'unmapped':
    case 'critical':
    case 'unresolved':
      return 'badge badge-danger';
    default:
      return 'badge badge-neutral';
  }
}

export function parseExcelBuffer(data: ArrayBuffer): Record<string, any>[] {
  // Utility wrapper for SheetJS XLSX parsing
  const XLSX = (window as any).XLSX;
  if (!XLSX) {
    throw new Error('SheetJS library is not loaded');
  }
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
}
