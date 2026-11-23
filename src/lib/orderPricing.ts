export function deliveryFeePaise(deliveryType: 'EXPRESS' | 'BULK_HUB') {
  return deliveryType === 'EXPRESS' ? 3500 : 2000;
}
