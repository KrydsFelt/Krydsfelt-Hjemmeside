using KrydsfeltHjemmeside.Services;
using Microsoft.AspNetCore.Components;

namespace KrydsfeltHjemmeside.Shared;

public abstract class LocalizedComponentBase : ComponentBase, IDisposable
{
    [Inject] protected LanguageService Lang { get; set; } = default!;

    protected override void OnInitialized()
    {
        Lang.OnLanguageChanged += HandleLanguageChanged;
    }

    private void HandleLanguageChanged() => InvokeAsync(StateHasChanged);

    public void Dispose()
    {
        Lang.OnLanguageChanged -= HandleLanguageChanged;
    }
}
