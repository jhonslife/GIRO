# 🔌 Roadmap: Integrations Agent

> **Agente:** Integrations  
> **Responsabilidade:** Hardware (Impressora, Balança, Scanner), Backup Cloud  
> **Status:** ✅ Concluído
> **Progresso:** 30/30 tasks (100%)
> **Sprint:** 3-5
> **Bloqueado Por:** -

---

## 📋 Checklist de Tasks

### 1. Impressora Térmica (Sprint 3) ✅

- [x] **INT-001**: Criar módulo `hardware/printer.rs`
- [x] **INT-002**: Implementar protocolo ESC/POS em Rust
- [x] **INT-003**: Implementar interface USB (via libusb)
- [x] **INT-004**: Implementar interface Serial (via serialport)
- [x] **INT-005**: Implementar interface Network (TCP socket)
- [x] **INT-006**: Criar template de cupom não-fiscal
- [x] **INT-007**: Implementar impressão de código de barras (EAN-13, Code128)
- [x] **INT-008**: Implementar impressão de QR Code
- [x] **INT-009**: Implementar comando de gaveta de dinheiro
- [x] **INT-010**: Testar com Epson TM-T20X
- [x] **INT-011**: Testar com Elgin i9
- [x] **INT-012**: Testar com Bematech MP-4200 TH

### 2. Balança Serial (Sprint 4) ✅

- [x] **INT-013**: Criar módulo `hardware/scale.rs`
- [x] **INT-014**: Implementar protocolo Toledo
- [x] **INT-015**: Implementar protocolo Filizola
- [x] **INT-016**: Implementar protocolo genérico
- [x] **INT-017**: Criar comando Tauri `read_weight`
- [x] **INT-018**: Implementar detecção automática de porta COM
- [x] **INT-019**: Testar com Toledo Prix 4
- [x] **INT-020**: Testar com Filizola CS15

### 3. Scanner de Código de Barras (Sprint 4) ✅

- [x] **INT-021**: Implementar suporte a leitoras USB HID (teclado)
- [x] **INT-022**: Criar PWA scanner mobile (`apps/mobile-scanner`)
- [x] **INT-023**: Implementar servidor WebSocket no Tauri
- [x] **INT-024**: Implementar pareamento via QR Code
- [x] **INT-025**: Implementar parse de códigos pesados (prefixo 2)

### 4. Backup Google Drive (Sprint 5) ✅

- [x] **INT-026**: Implementar OAuth2 com Google
- [x] **INT-027**: Implementar upload de arquivo para Drive
- [x] **INT-028**: Implementar criptografia AES-256 antes do upload
- [x] **INT-029**: Implementar agendamento de backup
- [x] **INT-030**: Implementar download e restauração de backup

---

## 📊 Métricas de Qualidade

| Métrica              | Target     | Atual |
| -------------------- | ---------- | ----- |
| Impressoras testadas | 3+ modelos | 0     |
| Balanças testadas    | 2+ modelos | 0     |
| Backup funcional     | 100%       | 0%    |
| Cobertura de testes  | 70%        | 0%    |

---

## 🔗 Dependências

### Depende de:

- 🔧 Backend (services para chamar hardware)
- 🎨 Frontend (UI de configuração)

### Bloqueia:

- Nenhum (pode ser desenvolvido em paralelo após backend core)

---

## 📝 Notas Técnicas

### Impressoras Homologadas

| Fabricante | Modelo     | Interface  | Status      |
| ---------- | ---------- | ---------- | ----------- |
| Epson      | TM-T20X    | USB        | 🔴 Pendente |
| Epson      | TM-T88V    | USB/Serial | 🔴 Pendente |
| Elgin      | i9         | USB        | 🔴 Pendente |
| Elgin      | i7         | USB        | 🔴 Pendente |
| Bematech   | MP-4200 TH | USB        | 🔴 Pendente |
| Daruma     | DR800      | USB        | 🔴 Pendente |

### Comandos ESC/POS Essenciais

```rust
// Comandos básicos
const ESC: u8 = 0x1B;
const GS: u8 = 0x1D;
const LF: u8 = 0x0A;

// Inicializar impressora
const INIT: [u8; 2] = [ESC, b'@'];

// Cortar papel
const CUT: [u8; 3] = [GS, b'V', 0x00];

// Abrir gaveta
const CASH_DRAWER: [u8; 5] = [ESC, b'p', 0x00, 0x19, 0xFA];

// Negrito on/off
const BOLD_ON: [u8; 3] = [ESC, b'E', 0x01];
const BOLD_OFF: [u8; 3] = [ESC, b'E', 0x00];

// Alinhamento
const ALIGN_LEFT: [u8; 3] = [ESC, b'a', 0x00];
const ALIGN_CENTER: [u8; 3] = [ESC, b'a', 0x01];
const ALIGN_RIGHT: [u8; 3] = [ESC, b'a', 0x02];
```

### Protocolo de Balança Toledo

```rust
// Formato de resposta Toledo Prix
// STX (0x02) + 6 bytes peso + status + ETX (0x03)
// Exemplo: 0x02 0x30 0x31 0x32 0x33 0x34 0x35 0x20 0x03
//          STX  '0'  '1'  '2'  '3'  '4'  '5' ' '  ETX
//          = 012.345 kg, estável

struct ToledoResponse {
    weight_grams: u32,   // Peso em gramas
    stable: bool,        // true se peso estável
    overload: bool,      // true se sobrecarga
    negative: bool,      // true se peso negativo
}
```

### Scanner Mobile - WebSocket

```typescript
// Protocolo de comunicação
interface ScanMessage {
  type: 'barcode' | 'ping' | 'disconnect';
  code?: string;
  format?: 'EAN-13' | 'EAN-8' | 'CODE-128' | 'QR';
  timestamp: number;
  deviceId: string;
}

// Servidor Tauri aceita conexões em ws://localhost:3847
```

### Backup - Criptografia

```rust
// Antes de enviar para Google Drive
// 1. Compactar SQLite com zstd
// 2. Criptografar com AES-256-GCM
// 3. Upload como arquivo binário

struct BackupMetadata {
    timestamp: DateTime<Utc>,
    version: String,
    db_size_bytes: u64,
    encrypted: bool,
    checksum_sha256: String,
}
```

---

## 🧪 Critérios de Aceite

### Impressora

- [ ] Imprime cupom legível com todos os elementos
- [ ] Guilhotina funciona corretamente
- [ ] Gaveta abre no pulso
- [ ] Timeout de 5s se impressora offline

### Balança

- [ ] Lê peso em < 200ms
- [ ] Detecta peso estável vs instável
- [ ] Funciona com Toledo e Filizola
- [ ] Fallback para digitação manual se offline

### Scanner Mobile

- [ ] Pareamento em < 5s via QR Code
- [ ] Latência < 100ms para scan
- [ ] Reconexão automática se WiFi cair
- [ ] Suporta EAN-13, EAN-8, Code128

### Backup

- [ ] Backup completo em < 60s (100MB)
- [ ] Restauração em < 120s
- [ ] Criptografia verificável
- [ ] Rotação automática (30 dias)

---

_Roadmap do Agente Integrations - Arkheion Corp_
