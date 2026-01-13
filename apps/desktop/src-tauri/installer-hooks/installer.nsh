; ═══════════════════════════════════════════════════════════════════════════
; GIRO - Installer Hooks (NSIS)
; Descrição: Hooks customizados para instalação e desinstalação
; ═══════════════════════════════════════════════════════════════════════════

!macro customInit
    ; Executado antes da instalação
    DetailPrint "Verificando instalação anterior..."
    
    ; Verificar se já existe instalação
    ReadRegStr $0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\{com.arkheion.giro}" "UninstallString"
    ${If} $0 != ""
        MessageBox MB_YESNO|MB_ICONQUESTION \
            "Uma versão anterior do GIRO foi detectada.$\r$\n$\r$\n\
            Deseja desinstalá-la antes de continuar?" \
            IDYES UninstallPrevious IDNO SkipUninstall
        
        UninstallPrevious:
            DetailPrint "Desinstalando versão anterior..."
            ExecWait '$0 _?=$INSTDIR'
            Delete $0
            RMDir $INSTDIR
        
        SkipUninstall:
    ${EndIf}
!macroend

!macro customInstall
    ; Executado após a instalação dos arquivos
    DetailPrint "Configurando GIRO..."
    
    ; Criar diretório de dados do usuário
    SetShellVarContext current
    CreateDirectory "$LOCALAPPDATA\GIRO"
    CreateDirectory "$LOCALAPPDATA\GIRO\backups"
    
    ; Copiar banco de dados inicial (se não existir)
    ${IfNot} ${FileExists} "$LOCALAPPDATA\GIRO\giro.db"
        DetailPrint "Inicializando banco de dados..."
        ; O banco será criado na primeira execução pelo Rust
    ${EndIf}
    
    ; Criar atalho no Desktop (opcional)
    MessageBox MB_YESNO|MB_ICONQUESTION \
        "Deseja criar um atalho no Desktop?" \
        IDYES CreateDesktopShortcut IDNO SkipDesktopShortcut
    
    CreateDesktopShortcut:
        DetailPrint "Criando atalho no Desktop..."
        CreateShortcut "$DESKTOP\GIRO.lnk" "$INSTDIR\giro-desktop.exe" \
            "" "$INSTDIR\giro-desktop.exe" 0 SW_SHOWNORMAL \
            "" "GIRO - Sistema de Gestão Comercial"
    
    SkipDesktopShortcut:
    
    ; Registrar no Windows
    DetailPrint "Registrando aplicação no sistema..."
    WriteRegStr HKLM "Software\GIRO" "InstallPath" "$INSTDIR"
    WriteRegStr HKLM "Software\GIRO" "Version" "${VERSION}"
    WriteRegStr HKLM "Software\GIRO" "DataPath" "$LOCALAPPDATA\GIRO"
    
    ; Criar entrada no menu Iniciar
    CreateDirectory "$SMPROGRAMS\GIRO"
    CreateShortcut "$SMPROGRAMS\GIRO\GIRO.lnk" "$INSTDIR\giro-desktop.exe" \
        "" "$INSTDIR\giro-desktop.exe" 0 SW_SHOWNORMAL \
        "" "GIRO - Sistema de Gestão Comercial"
    CreateShortcut "$SMPROGRAMS\GIRO\Desinstalar GIRO.lnk" "$INSTDIR\uninstall.exe" \
        "" "$INSTDIR\uninstall.exe" 0 SW_SHOWNORMAL \
        "" "Desinstalar GIRO"
    
    DetailPrint "✓ Instalação concluída!"
!macroend

!macro customUnInstall
    ; Executado antes da desinstalação
    DetailPrint "Preparando desinstalação..."
    
    ; Encerrar processo se estiver rodando
    nsExec::ExecToLog 'taskkill /F /IM "giro-desktop.exe" /T'
    Sleep 2000
    
    ; Perguntar sobre dados do usuário
    MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 \
        "⚠️ ATENÇÃO - REMOÇÃO DE DADOS$\r$\n$\r$\n\
        Deseja remover TODOS os dados do GIRO?$\r$\n$\r$\n\
        Isso inclui:$\r$\n\
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n\
        ✓ Banco de dados completo$\r$\n\
        ✓ Vendas, produtos, clientes$\r$\n\
        ✓ Funcionários e configurações$\r$\n\
        ✓ Backups automáticos$\r$\n\
        ✓ Licença ativada$\r$\n\
        ✓ Histórico completo$\r$\n\
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n$\r$\n\
        ⚠️ Esta ação NÃO pode ser desfeita!$\r$\n$\r$\n\
        Clique 'Não' para manter os dados (recomendado)$\r$\n\
        Clique 'Sim' para apagar TUDO permanentemente" \
        IDYES RemoveUserData IDNO KeepUserData
    
    RemoveUserData:
        DetailPrint "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        DetailPrint "REMOVENDO TODOS OS DADOS DO GIRO"
        DetailPrint "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        SetShellVarContext current
        
        ; Banco de dados principal
        DetailPrint "  ▶ Removendo banco de dados principal..."
        Delete "$LOCALAPPDATA\GIRO\giro.db"
        Delete "$LOCALAPPDATA\GIRO\giro.db-shm"
        Delete "$LOCALAPPDATA\GIRO\giro.db-wal"
        Delete "$LOCALAPPDATA\GIRO\giro.db-journal"
        
        ; Backups
        DetailPrint "  ▶ Removendo backups ($LOCALAPPDATA\GIRO\backups)..."
        RMDir /r "$LOCALAPPDATA\GIRO\backups"
        
        ; Logs
        DetailPrint "  ▶ Removendo logs..."
        Delete "$LOCALAPPDATA\GIRO\*.log"
        Delete "$LOCALAPPDATA\GIRO\debug.log"
        Delete "$LOCALAPPDATA\GIRO\error.log"
        
        ; Configurações e cache
        DetailPrint "  ▶ Removendo configurações..."
        Delete "$LOCALAPPDATA\GIRO\config.json"
        Delete "$LOCALAPPDATA\GIRO\settings.json"
        Delete "$LOCALAPPDATA\GIRO\.env"
        Delete "$LOCALAPPDATA\GIRO\.license"
        Delete "$LOCALAPPDATA\GIRO\hardware.id"
        
        ; Arquivos temporários
        DetailPrint "  ▶ Removendo arquivos temporários..."
        Delete "$LOCALAPPDATA\GIRO\*.tmp"
        Delete "$LOCALAPPDATA\GIRO\temp\*.*"
        RMDir "$LOCALAPPDATA\GIRO\temp"
        
        ; Diretório raiz
        DetailPrint "  ▶ Removendo diretório principal..."
        RMDir /r "$LOCALAPPDATA\GIRO"
        
        ; Registro do Windows
        DetailPrint "  ▶ Limpando registro..."
        DeleteRegKey HKCU "Software\GIRO"
        DeleteRegKey HKLM "Software\GIRO"
        
        DetailPrint "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        DetailPrint "✓ TODOS OS DADOS FORAM REMOVIDOS!"
        DetailPrint "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        MessageBox MB_OK|MB_ICONINFORMATION \
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n\
            ✓ LIMPEZA COMPLETA REALIZADA$\r$\n\
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n$\r$\n\
            Todos os dados do GIRO foram removidos permanentemente.$\r$\n$\r$\n\
            Caso faça uma nova instalação:$\r$\n\
            • Você precisará ativar uma nova licença$\r$\n\
            • Será necessário configurar o sistema do zero$\r$\n\
            • Todo o histórico foi apagado$\r$\n$\r$\n\
            Obrigado por usar o GIRO!$\r$\n\
            Arkheion Corp"
        
        Goto EndDataRemoval
    
    KeepUserData:
        DetailPrint "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        DetailPrint "MANTENDO DADOS DO USUÁRIO"
        DetailPrint "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        DetailPrint "  ✓ Banco de dados preservado"
        DetailPrint "  ✓ Backups mantidos"
        DetailPrint "  ✓ Configurações salvas"
        DetailPrint "  ✓ Licença preservada"
        DetailPrint ""
        DetailPrint "Localização: $LOCALAPPDATA\GIRO"
        DetailPrint "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        MessageBox MB_OK|MB_ICONINFORMATION \
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n\
            ✓ DADOS PRESERVADOS$\r$\n\
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n$\r$\n\
            Os dados do GIRO foram mantidos em:$\r$\n\
            $LOCALAPPDATA\GIRO$\r$\n$\r$\n\
            Se reinstalar o GIRO, seus dados serão$\r$\n\
            recuperados automaticamente, incluindo:$\r$\n$\r$\n\
            ✓ Banco de dados completo$\r$\n\
            ✓ Vendas e histórico$\r$\n\
            ✓ Produtos e clientes$\r$\n\
            ✓ Configurações$\r$\n\
            ✓ Licença ativa$\r$\n$\r$\n\
            💡 Dica: Para remover manualmente os dados,$\r$\n\
            acesse a pasta acima e delete-a."
    
    EndDataRemoval:
    
    ; Remover atalhos
    DetailPrint "Removendo atalhos..."
    Delete "$DESKTOP\GIRO.lnk"
    Delete "$SMPROGRAMS\GIRO\GIRO.lnk"
    Delete "$SMPROGRAMS\GIRO\Desinstalar GIRO.lnk"
    RMDir "$SMPROGRAMS\GIRO"
    
    ; Limpar registro de desinstalação
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\{com.arkheion.giro}"
!macroend

!macro customUnInstallSuccess
    MessageBox MB_OK|MB_ICONINFORMATION \
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n\
        ✓ DESINSTALAÇÃO CONCLUÍDA$\r$\n\
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$\r$\n$\r$\n\
        O GIRO foi desinstalado com sucesso!$\r$\n$\r$\n\
        Obrigado por usar nosso sistema.$\r$\n$\r$\n\
        🏛️ Arkheion Corp$\r$\n\
        Desenvolvendo soluções inteligentes$\r$\n$\r$\n\
        www.arkheion.com"
!macroend
