import AppShell from '@/components/AppShell'

export default function Page() {
  return (
    // Full-bleed on phones; a 375×812 device frame on larger screens
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="device">
        <AppShell />
      </div>
    </main>
  )
}
