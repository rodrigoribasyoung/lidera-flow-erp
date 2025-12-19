# Mapeamento de Migração de Campos

Este documento descreve a padronização de campos para um padrão universal (inglês + camelCase).

## Padronização Aplicada

### Transaction Fields

| Campo Antigo (PT) | Campo Novo (EN) | Tipo | Descrição |
|-------------------|-----------------|------|-----------|
| `dataLancamento` | `issueDate` | `string` | Data de lançamento |
| `dataVencimento` | `dueDate` | `string` | Data de vencimento |
| `dataPagamento` | `paymentDate` | `string?` | Data de pagamento/recebimento |
| `dataCompetencia` | `accrualDate` | `string` | Data de competência |
| `tipo` | `type` | `TransactionType` | Tipo (Entrada/Saída) |
| `categoria` | `category` | `string` | Categoria |
| `entidade` | `entity` | `string` | Entidade (Cliente/Fornecedor) |
| `produtoServico` | `productService` | `string` | Produto ou Serviço |
| `centroCusto` | `costCenter` | `string` | Centro de Custo |
| `formaPagamento` | `paymentMethod` | `string` | Forma de Pagamento |
| `descricao` | `description` | `string` | Descrição |
| `valorPrevisto` | `expectedAmount` | `number` | Valor Previsto |
| `valorRealizado` | `actualAmount` | `number` | Valor Realizado |
| `accountId` | `accountId` | `string?` | ID da Conta (mantido) |
| `status` | `status` | `TransactionStatus` | Status (mantido) |

### Account Fields

| Campo Antigo | Campo Novo | Tipo | Descrição |
|--------------|------------|------|-----------|
| `name` | `name` | `string` | Nome (mantido) |
| `type` | `type` | `AccountType` | Tipo (mantido) |
| `initialBalance` | `initialBalance` | `number` | Saldo Inicial (mantido) |
| `color` | `color` | `string` | Cor (mantido) |

### Settings Fields

| Campo Antigo | Campo Novo | Tipo | Descrição |
|--------------|------------|------|-----------|
| `categories` | `categories` | `CategoryItem[]` | Categorias (mantido) |
| `entities` | `entities` | `EntityItem[]` | Entidades (mantido) |
| `paymentMethods` | `paymentMethods` | `string[]` | Métodos de Pagamento (mantido) |
| `costCenters` | `costCenters` | `string[]` | Centros de Custo (mantido) |

## Convenções Aplicadas

1. **Nomes de campos**: camelCase em inglês
2. **Valores de enum**: Mantidos em português (para UI brasileira)
3. **Datas**: Sufixo `Date` (ex: `issueDate`, `dueDate`)
4. **Valores monetários**: Sufixo `Amount` (ex: `expectedAmount`, `actualAmount`)
5. **IDs**: Mantidos com sufixo `Id` (ex: `accountId`)

## Benefícios

- ✅ Padrão universal (inglês)
- ✅ Consistência com convenções JavaScript/TypeScript
- ✅ Facilita integração com APIs internacionais
- ✅ Melhor para colaboração com desenvolvedores internacionais
- ✅ Nomes mais descritivos e profissionais


