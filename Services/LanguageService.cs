using Microsoft.JSInterop;

namespace KrydsfeltHjemmeside.Services;

public class LanguageService
{
    private const string StorageKey = "kf-language";
    private static readonly string[] SupportedLanguages = ["da", "en", "ar", "vi"];
    private bool _initialized;

    public event Action? OnLanguageChanged;
    public string CurrentLanguage { get; private set; } = "da";

    public string T(string key)
    {
        var dict = CurrentLanguage == "en" ? Translations.En : Translations.Da;
        return dict.TryGetValue(key, out var value) ? value : key;
    }

    public async Task InitializeAsync(IJSRuntime js)
    {
        if (_initialized) return;
        _initialized = true;

        var stored = await js.InvokeAsync<string?>("localStorage.getItem", StorageKey);
        if (stored != null && SupportedLanguages.Contains(stored) && stored != CurrentLanguage)
        {
            CurrentLanguage = stored;
            OnLanguageChanged?.Invoke();
        }
    }

    public async Task SetLanguageAsync(string code, IJSRuntime js)
    {
        if (!SupportedLanguages.Contains(code) || code == CurrentLanguage) return;
        CurrentLanguage = code;
        await js.InvokeVoidAsync("localStorage.setItem", StorageKey, code);
        OnLanguageChanged?.Invoke();
    }
}
