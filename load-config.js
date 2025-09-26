// load-config.js - универсальный загрузчик конфигурации
(async function() {
    console.log('🔄 Loading configuration...');
    
    const configSources = [
        // Источник 1: Прямые значения (высший приоритет)
        async () => {
            if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
                return { source: 'inline', config: { SUPABASE_URL: window.SUPABASE_URL, SUPABASE_ANON_KEY: window.SUPABASE_ANON_KEY } };
            }
            return null;
        },
        
        // Источник 2: API endpoint (для Vercel)
        async () => {
            try {
                const response = await fetch('/api/config');
                if (response.ok) {
                    const jsCode = await response.text();
                    eval(jsCode); // Безопасно, так как мы контролируем API
                    return { source: 'api', config: { SUPABASE_URL: window.SUPABASE_URL, SUPABASE_ANON_KEY: window.SUPABASE_ANON_KEY } };
                }
            } catch (error) {
                console.log('API config not available:', error.message);
            }
            return null;
        },
        
        // Источник 3: Статический config.js
        async () => {
            try {
                // Пытаемся загрузить стандартный config.js
                if (typeof window.loadConfig === 'undefined') {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = '/config.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }
                if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
                    return { source: 'static', config: { SUPABASE_URL: window.SUPABASE_URL, SUPABASE_ANON_KEY: window.SUPABASE_ANON_KEY } };
                }
            } catch (error) {
                console.log('Static config not available:', error.message);
            }
            return null;
        },
        
        // Источник 4: Резервные значения
        async () => {
            const fallbackConfig = {
                SUPABASE_URL: 'https://dtjhlanmwjpdcdxgzzyo.supabase.co',
                SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0amhsYW5td2pwZGNkeGd6enlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDUwOTIsImV4cCI6MjA3MjM4MTA5Mn0.jS4DXQSOBawRFtnzjsmF5AzzltDYAG0AXrwrY1B0UpY'
            };
            
            window.SUPABASE_URL = fallbackConfig.SUPABASE_URL;
            window.SUPABASE_ANON_KEY = fallbackConfig.SUPABASE_ANON_KEY;
            
            return { source: 'fallback', config: fallbackConfig };
        }
    ];
    
    // Пробуем все источники по порядку
    for (const source of configSources) {
        try {
            const result = await source();
            if (result) {
                console.log(`✅ Configuration loaded from: ${result.source}`);
                console.log('🔧 Supabase URL:', result.config.SUPABASE_URL ? '✅' : '❌');
                
                // Создаем событие, что конфигурация загружена
                window.dispatchEvent(new CustomEvent('configLoaded', { 
                    detail: result 
                }));
                
                return;
            }
        } catch (error) {
            console.log(`Config source failed:`, error.message);
            continue;
        }
    }
    
    console.error('❌ All configuration sources failed!');
})();