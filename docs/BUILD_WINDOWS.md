# Como Gerar o Instalador Windows (.exe) do GIRO

Como estamos em um ambiente Linux sem as ferramentas de cross-compilation (NSIS) instaladas, você precisará gerar o `.exe` em uma máquina Windows ou configurar um ambiente CI/CD.

## Pré-requisitos (Windows)

1.  **Node.js** (v18+)
2.  **Rust** (via rustup-init.exe)
3.  **Visual Studio Build Tools** (C++ Workload)

## Passos

1.  Abra o terminal (PowerShell ou CMD) na pasta do projeto:
    ```powershell
    cd apps/desktop
    ```

2.  Instale as dependências (se ainda não fez):
    ```powershell
    npm install
    ```

3.  Execute o comando de build:
    ```powershell
    npm run tauri:build
    ```

## Resultado

O instalador será gerado em:
`src-tauri/target/release/bundle/nsis/`

Você verá um arquivo chamado `giro-desktop_1.0.0_x64-setup.exe`.

---

## Solução de Problemas Comuns

- **Erro de Ícone:** Se houver erro de ícone, o projeto já está configurado com ícones RGBA corretos em `src-tauri/icons/`.
- **Erro de Assinatura:** O instalador não é assinado digitalmente por padrão. O Windows pode exibir "SmartScreen protected PC". Isso é normal para builds de desenvolvimento.
