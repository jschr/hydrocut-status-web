export default function isStaleMetric(metricDate: string) {
  const now = new Date();
  const createdAt = new Date(metricDate);
  // Metric is stale if created at is > 4 hours ago.
  return +now - +createdAt > 1000 * 60 * 60 * 4;
}
