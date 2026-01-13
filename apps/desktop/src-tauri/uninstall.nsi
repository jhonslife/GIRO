; ═══════════════════════════════════════════════════════════════════════════
; GIRO - Script de Desinstalação Customizado (NSIS)
; Descrição: Gerencia a remoção completa do aplicativo e dados
; ═══════════════════════════════════════════════════════════════════════════

!include "MUI2.nsh"
!include "LogicLib.nsh"

; ────────────────────────────────────────────────────────────────────────────
; Seção de Desinstalação
; ────────────────────────────────────────────────────────────────────────────

Section "un.Uninstall"
    ; Encerrar processo se estiver rodando
    DetailPrint "Verificando se o GIRO está em execução..."
    nsExec::ExecToLog 'taskkill /F /IM "giro-desktop.exe" /T'
    Sleep 1000

    ; Remover arquivos do programa
    DetailPrint "Removendo arquivos do programa..."
    Delete "$INSTDIR\giro-desktop.exe"
    Delete "$INSTDIR\*.dll"
    RMDir /r "$INSTDIR\resources"
    RMDir /r "$INSTDIR\_up_"
    
    ; Remover atalhos
    DetailPrint "Removendo atalhos..."
    Delete "$DESKTOP\GIRO.lnk"
    Delete "$SMPROGRAMS\GIRO\GIRO.lnk"
    Delete "$SMPROGRAMS\GIRO\Desinstalar GIRO.lnk"
    RMDir "$SMPROGRAMS\GIRO"
    
    ; Remover entradas do registro
    DetailPrint "Limpando registro do Windows..."
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\{com.arkheion.giro}"
    DeleteRegKey HKLM "Software\GIRO"
    DeleteRegKey HKCU "Software\GIRO"
    
    ; Perguntar sobre remoção de dados do usuário
    MessageBox MB_YESNO|MB_ICONQUESTION \
        "Deseja remover TODOS os dados do GIRO?$\r$\n$\r$\n\
        Isso inclui:$\r$\n\
        • Banco de dados (vendas, produtos, clientes)$\r$\n\
        • Backups automáticos$\r$\n\
        • Configurações do sistema$\r$\n\
        • Licença ativada$\r$\n$\r$\n\
        ⚠️ ATENÇÃO: Esta ação NÃO pode ser desfeita!" \
        IDYES RemoveUserData IDNO SkipUserData

    RemoveUserData:
        DetailPrint "Removendo dados do usuário..."
        
        ; Identificar diretório de dados
        ; Windows: %LOCALAPPDATA%\GIRO
        SetShellVarContext current
        
        ; Remover banco de dados
        DetailPrint "  ▶ Removendo banco de dados..."
        Delete "$LOCALAPPDATA\GIRO\giro.db"
        Delete "$LOCALAPPDATA\GIRO\giro.db-shm"
        Delete "$LOCALAPPDATA\GIRO\giro.db-wal"
        
        ; Remover backups
        DetailPrint "  ▶ Removendo backups..."
        RMDir /r "$LOCALAPPDATA\GIRO\backups"
        
        ; Remover logs
        DetailPrint "  ▶ Removendo logs..."
        Delete "$LOCALAPPDATA\GIRO\*.log"
        
        ; Remover configurações
        DetailPrint "  ▶ Removendo configurações..."
        Delete "$LOCALAPPDATA\GIRO\config.json"
        Delete "$LOCALAPPDATA\GIRO\.license"
        
        ; Remover diretório raiz (se vazio ou forçar)
        RMDir /r "$LOCALAPPDATA\GIRO"
        
        DetailPrint "✓ Todos os dados foram removidos!"
        MessageBox MB_OK|MB_ICONINFORMATION \
            "Todos os dados do GIRO foram removidos com sucesso.$\r$\n$\r$\n\
            Caso faça uma nova instalação, você precisará:$\r$\n\
            • Ativar uma nova licença$\r$\n\
            • Configurar o sistema do zero"
        
        Goto EndUserData

    SkipUserData:
        DetailPrint "Mantendo dados do usuário..."
        MessageBox MB_OK|MB_ICONINFORMATION \
            "Os dados do GIRO foram preservados.$\r$\n$\r$\n\
            Localização: $LOCALAPPDATA\GIRO$\r$\n$\r$\n\
            Se reinstalar o GIRO, seus dados serão recuperados automaticamente."

    EndUserData:

    ; Remover diretório de instalação
    DetailPrint "Removendo diretório de instalação..."
    RMDir "$INSTDIR"

    DetailPrint "Desinstalação concluída!"

SectionEnd

; ────────────────────────────────────────────────────────────────────────────
; Funções de Callback
; ────────────────────────────────────────────────────────────────────────────

Function un.onInit
    ; Verificar privilégios de administrador
    UserInfo::GetAccountType
    Pop $0
    ${If} $0 != "admin"
        MessageBox MB_OK|MB_ICONEXCLAMATION \
            "Este desinstalador requer privilégios de Administrador.$\r$\n$\r$\n\
            Clique com o botão direito e selecione 'Executar como Administrador'."
        Abort
    ${EndIf}
    
    ; Mensagem inicial
    MessageBox MB_YESNO|MB_ICONQUESTION \
        "Tem certeza de que deseja desinstalar o GIRO?$\r$\n$\r$\n\
        Sistema de Gestão Comercial" \
        IDYES +2
    Abort
FunctionEnd

Function un.onUninstSuccess
    MessageBox MB_OK|MB_ICONINFORMATION \
        "O GIRO foi desinstalado com sucesso!$\r$\n$\r$\n\
        Obrigado por usar nosso sistema.$\r$\n$\r$\n\
        Arkheion Corp - Desenvolvendo soluções inteligentes."
FunctionEnd
