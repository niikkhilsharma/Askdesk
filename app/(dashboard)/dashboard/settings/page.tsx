import { ThemeSelector } from "@/components/dashboard/settings/theme-selector"

/** Shows dashboard preferences, including appearance. */
export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your dashboard preferences.
        </p>
      </div>

      <section className="max-w-3xl space-y-4">
        <div>
          <h2 className="text-lg font-medium">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a light, dark, or system theme.
          </p>
        </div>
        <ThemeSelector />
      </section>
    </div>
  )
}
