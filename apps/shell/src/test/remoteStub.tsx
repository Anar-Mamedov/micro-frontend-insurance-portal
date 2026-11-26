// Stands in for `policy/PolicyApp` and `claims/ClaimsApp` in tests, where no federation runtime exists.
// Tests pass their own fake loaders to <App>, so this module is never rendered.
export default function RemoteStub() {
  return null
}
