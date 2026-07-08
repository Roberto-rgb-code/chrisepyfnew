export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getFirstCustomItem<T extends { customImage?: string | null }>(items: T[] = []) {
  return items.find((item) => Boolean(item.customImage?.startsWith('data:image')));
}
