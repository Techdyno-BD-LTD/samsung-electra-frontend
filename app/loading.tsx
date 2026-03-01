export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-blue-100/50 backdrop-blur-sm">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
}