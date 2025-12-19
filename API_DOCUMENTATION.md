# Documentação de Campos - Lidera Flow ERP

Esta documentação descreve os campos do sistema, suas estruturas no Firebase Firestore e como mapeá-los para importação CSV.

---

## 📋 Índice

- [Transações (Transactions)](#transações-transactions)
- [Configurações (Settings)](#configurações-settings)
- [Contas (Accounts)](#contas-accounts)
- [Mapeamento CSV](#mapeamento-csv)
- [Estrutura do Firestore](#estrutura-do-firestore)

---

## Transações (Transactions)

### Coleção: `transactions`

Cada documento representa uma transação financeira (entrada ou saída).

### Campos

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| `id` | `string` | ✅ | ID único gerado pelo Firebase | `"abc123xyz"` |
| `issueDate` | `string` | ✅ | Data de lançamento (YYYY-MM-DD) | `"2025-10-02"` |
| `dueDate` | `string` | ✅ | Data de vencimento (YYYY-MM-DD) | `"2025-10-05"` |
| `type` | `'Entrada' \| 'Saída'` | ✅ | Tipo da transação | `"Entrada"` |
| `category` | `string` | ✅ | Categoria da transação | `"Receita de serviços"` |
| `entity` | `string` | ✅ | Cliente ou Fornecedor | `"Cia da Fruta"` |
| `productService` | `string` | ❌ | Produto ou serviço relacionado | `"Consultoria"` |
| `costCenter` | `string` | ❌ | Centro de custo | `"Consultoria"` |
| `paymentMethod` | `string` | ❌ | Forma de pagamento | `"Pix"` |
| `accountId` | `string` | ❌ | ID da conta bancária vinculada | `"acc1"` |
| `description` | `string` | ✅ | Descrição da transação | `"Consultoria Mensal"` |
| `expectedAmount` | `number` | ✅ | Valor previsto | `1100.00` |
| `actualAmount` | `number` | ❌ | Valor realizado | `1100.00` |
| `paymentDate` | `string` | ❌ | Data de pagamento/recebimento (YYYY-MM-DD) | `"2025-10-05"` |
| `accrualDate` | `string` | ❌ | Data de competência (YYYY-MM-DD) | `"2025-10-05"` |
| `status` | `TransactionStatus` | ❌ | Status da transação | `"Recebido"` |

### Status Possíveis

- `"Pago"` - Saída paga
- `"Recebido"` - Entrada recebida
- `"A pagar"` - Saída pendente
- `"A receber"` - Entrada pendente
- `"Atrasado"` - Vencido
- `"Cancelado"` - Cancelado

### Exemplo no Firestore

```json
{
  "id": "abc123xyz",
  "issueDate": "2025-10-02",
  "dueDate": "2025-10-05",
  "type": "Entrada",
  "category": "Receita de serviços",
  "entity": "Cia da Fruta",
  "productService": "Consultoria",
  "costCenter": "Consultoria",
  "paymentMethod": "Pix",
  "accountId": "acc1",
  "description": "Consultoria Mensal",
  "expectedAmount": 1100.00,
  "actualAmount": 1100.00,
  "paymentDate": "2025-10-05",
  "accrualDate": "2025-10-05",
  "status": "Recebido"
}
```

---

## Configurações (Settings)

### Coleção: `settings`
### Documento: `main` (documento único)

Armazena todas as configurações do sistema em um único documento.

### Campos

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `categories` | `CategoryItem[]` | Lista de categorias | Ver abaixo |
| `entities` | `EntityItem[]` | Lista de entidades (clientes/fornecedores) | Ver abaixo |
| `paymentMethods` | `string[]` | Formas de pagamento | `["Pix", "Boleto", "Cartão de Crédito"]` |
| `costCenters` | `string[]` | Centros de custo | `["Consultoria", "Marketing"]` |

### CategoryItem

```typescript
{
  id: string;
  name: string;
  type: 'Receita' | 'Despesa';
}
```

**Exemplo:**
```json
{
  "id": "c1",
  "name": "Receita de serviços",
  "type": "Receita"
}
```

### EntityItem

```typescript
{
  id: string;
  name: string;
  type: 'Cliente' | 'Fornecedor' | 'Ambos';
}
```

**Exemplo:**
```json
{
  "id": "e1",
  "name": "Cia da Fruta",
  "type": "Cliente"
}
```

### Exemplo Completo no Firestore

```json
{
  "categories": [
    { "id": "c1", "name": "Receita de serviços", "type": "Receita" },
    { "id": "c2", "name": "Despesas operacionais", "type": "Despesa" }
  ],
  "entities": [
    { "id": "e1", "name": "Cia da Fruta", "type": "Cliente" },
    { "id": "e2", "name": "Google Workspace", "type": "Fornecedor" }
  ],
  "paymentMethods": ["Pix", "Boleto", "Cartão de Crédito [Lidera]"],
  "costCenters": ["Consultoria", "Marketing e Publicidade", "Colaboradores"]
}
```

---

## Contas (Accounts)

### Coleção: `accounts`

Cada documento representa uma conta bancária ou caixa.

### Campos

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| `id` | `string` | ✅ | ID único gerado pelo Firebase | `"acc1"` |
| `name` | `string` | ✅ | Nome da conta | `"Banco Inter"` |
| `type` | `'Corrente' \| 'Poupança' \| 'Caixa' \| 'Investimento'` | ✅ | Tipo da conta | `"Corrente"` |
| `initialBalance` | `number` | ✅ | Saldo inicial | `5000.00` |
| `color` | `string` | ✅ | Cor em hexadecimal | `"#FF7F00"` |

### Exemplo no Firestore

```json
{
  "id": "acc1",
  "name": "Banco Inter",
  "type": "Corrente",
  "initialBalance": 5000.00,
  "color": "#FF7F00"
}
```

---

## Mapeamento CSV

### Campos do Sistema vs Colunas CSV

Ao importar CSV, você pode mapear as colunas do seu arquivo para os campos do sistema:

| Campo do Sistema | Nomes Comuns no CSV | Tipo | Obrigatório |
|-----------------|---------------------|------|--------------|
| `issueDate` | "Data Lanç.", "Data Lancamento", "Data de Lançamento" | Data (DD/MM/YYYY) | ❌ |
| `dueDate` | "Data Venc.", "Data Vencimento", "Vencimento" | Data (DD/MM/YYYY) | ✅ |
| `type` | "Tipo" | Texto ("Entrada" ou "Saída") | ✅ |
| `category` | "Categoria" | Texto | ✅ |
| `entity` | "Entidade", "Cliente", "Fornecedor" | Texto | ✅ |
| `productService` | "Produto ou Serviço", "Produto", "Serviço" | Texto | ❌ |
| `costCenter` | "Centro de custo", "Centro Custo" | Texto | ❌ |
| `paymentMethod` | "Forma de pagamento", "Pagamento" | Texto | ❌ |
| `description` | "Descrição", "Desc" | Texto | ✅ |
| `expectedAmount` | "Valor Previsto", "Valor" | Número (1.000,00) | ✅ |
| `actualAmount` | "Valor Realizado", "Valor Pago" | Número (1.000,00) | ❌ |
| `paymentDate` | "Data Pgto/Rec.", "Data Pagamento" | Data (DD/MM/YYYY) | ❌ |
| `accrualDate` | "Data Competência", "Competência" | Data (DD/MM/YYYY) | ❌ |
| `status` | "Status" | Texto | ❌ |

### Formato de Data

O sistema aceita datas nos formatos:
- `DD/MM/YYYY` (ex: `02/10/2025`)
- `YYYY-MM-DD` (ex: `2025-10-02`)

### Formato de Valor

O sistema aceita valores nos formatos brasileiros:
- `1.000,00` (com ponto para milhar e vírgula para decimal)
- `1000,00` (apenas vírgula para decimal)
- `1000.00` (formato internacional)

### Exemplo de CSV

```csv
Data Lanç.,Data Venc.,Tipo,Categoria,Entidade,Produto ou Serviço,Centro de custo,Forma de pagamento,Descrição,Valor Previsto,Valor Realizado,Data Pgto/Rec.,Data Competência,Status
02/10/2025,02/10/2025,Entrada,Receita de serviços,Cia da Fruta,Consultoria,Consultoria,Pix,Consultoria Mensal,"1100,00","1100,00",05/10/2025,05/10/2025,Recebido
22/09/2025,10/10/2025,Saída,Despesas operacionais,Google Workspace,,Ferramentas operacionais,Cartão de Crédito [Lidera],Google Workspace [2 usuários],"100,88","100,88",10/10/2025,10/10/2025,Pago
```

---

## Estrutura do Firestore

### Hierarquia de Coleções

```
lidera-flow (Projeto)
└── firestore
    ├── transactions (Coleção)
    │   ├── {transactionId} (Documento)
    │   │   ├── issueDate: string
    │   │   ├── dueDate: string
    │   │   ├── type: string
    │   │   ├── category: string
    │   │   ├── entity: string
    │   │   ├── productService: string
    │   │   ├── costCenter: string
    │   │   ├── paymentMethod: string
    │   │   ├── accountId: string
    │   │   ├── description: string
    │   │   ├── expectedAmount: number
    │   │   ├── actualAmount: number
    │   │   ├── paymentDate: string
    │   │   ├── accrualDate: string
    │   │   └── status: string
    │   └── ...
    │
    ├── settings (Coleção)
    │   └── main (Documento único)
    │       ├── categories: array
    │       ├── entities: array
    │       ├── paymentMethods: array
    │       └── costCenters: array
    │
    └── accounts (Coleção)
        ├── {accountId} (Documento)
        │   ├── name: string
        │   ├── type: string
        │   ├── initialBalance: number
        │   └── color: string
        └── ...
```

### Regras de Segurança Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Transactions
    match /transactions/{transactionId} {
      allow read, write: if true; // Para desenvolvimento
      // Para produção: allow read, write: if request.auth != null;
    }
    
    // Settings
    match /settings/{settingId} {
      allow read, write: if true; // Para desenvolvimento
    }
    
    // Accounts
    match /accounts/{accountId} {
      allow read, write: if true; // Para desenvolvimento
    }
  }
}
```

---

## Validações e Regras de Negócio

### Transações

1. **Valor Previsto**: Deve ser maior que 0
2. **Data de Vencimento**: Obrigatória
3. **Tipo**: Deve ser "Entrada" ou "Saída"
4. **Status**: Se não informado, será definido automaticamente:
   - `"Entrada"` → `"A receber"`
   - `"Saída"` → `"A pagar"`
5. **Valor Realizado**: Se não informado, assume o valor de `valorPrevisto`

### Contas

1. **Nome**: Deve ser único
2. **Saldo Inicial**: Pode ser negativo
3. **Tipo**: Deve ser um dos valores permitidos

### Configurações

1. **Categorias**: Devem ter `type` como "Receita" ou "Despesa"
2. **Entidades**: Devem ter `type` como "Cliente", "Fornecedor" ou "Ambos"

---

## Exemplos de Uso

### Buscar Transações

```typescript
import { transactionService } from './services/firebase';

const transactions = await transactionService.getAll();
```

### Adicionar Transação

```typescript
const newTransaction = {
  issueDate: "2025-10-02",
  dueDate: "2025-10-05",
  type: "Entrada",
  category: "Receita de serviços",
  entity: "Cia da Fruta",
  description: "Consultoria Mensal",
  expectedAmount: 1100.00,
  actualAmount: 1100.00,
  status: "Recebido"
};

await transactionService.add(newTransaction);
```

### Buscar Configurações

```typescript
import { settingsService } from './services/firebase';

const settings = await settingsService.get();
```

### Atualizar Configurações

```typescript
const updatedSettings = {
  ...settings,
  paymentMethods: [...settings.paymentMethods, "Nova Forma"]
};

await settingsService.save(updatedSettings);
```

---

## Suporte

Para mais informações sobre configuração do Firebase, consulte `FIREBASE_SETUP.md`.

Para dúvidas sobre importação CSV, use o botão "Baixar Modelo" no sistema para ver exemplos de formato.

