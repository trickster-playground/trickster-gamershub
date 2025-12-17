export function formatRupiah(value?: number | '') {
  if (!value) return 'Prize Pool';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value));
}
