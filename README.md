<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1oFFWO9ohq18UWXb0CW8md6xwvm0LkLdl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# UPT UFBA

## Supabase — configuração rápida

1. Crie um projeto no Supabase e configure as tabelas (o arquivo `config/schema.sql` contém o esquema sugerido).
2. Copie `.env.local.example` para `.env` na raiz do projeto e preencha:

   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - API_KEY (Google GenAI)

3. Instale dependências e rode o servidor de desenvolvimento:

```powershell
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

4. Para verificar a integração com Supabase (leitura segura):

```powershell
# exporte as variáveis (PowerShell)
$env:VITE_SUPABASE_URL = "https://your-project.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "your-anon-key"

# então execute:
npm run supabase:check
```

O script fará um SELECT limitado na tabela `students` e retornará um código de saída 0 em caso de sucesso.
