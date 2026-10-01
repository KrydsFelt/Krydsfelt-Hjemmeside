using Microsoft.JSInterop;

namespace KrydsfeltHjemmeside.Services;

public class LanguageService
{
    private const string StorageKey = "kf-language";
    private bool _initialized;

    public event Action? OnLanguageChanged;
    public string CurrentLanguage { get; private set; } = "da";

    public string T(string key)
    {
        return Translations.Da.TryGetValue(key, out var value) ? value : key;
    }

    public async Task InitializeAsync(IJSRuntime js)
    {
        if (_initialized) return;
        _initialized = true;

        await js.InvokeVoidAsync("localStorage.setItem", StorageKey, "da");
        OnLanguageChanged?.Invoke();
    }
}
