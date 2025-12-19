# Plano de Migração: Fornecedores e Clientes

## 📋 Situação Atual

Atualmente, **Fornecedores** e **Clientes** são armazenados como configurações simples no Firestore:
- Localização: `settings/main` → `entities[]`
- Estrutura: `{ id, name, type: 'Cliente' | 'Fornecedor' | 'Ambos' }`
- Uso: Apenas como lista de seleção em transações

## 🎯 Objetivo

Migrar para um **sistema de cadastro completo** com:
- Coleção dedicada no Firestore
- Campos adicionais (CNPJ, telefone, email, endereço, etc.)
- Histórico de transações vinculado
- Gestão independente (CRUD completo)

## 📊 Estrutura Proposta

### Nova Coleção: `entities` (ou `contacts`)

```typescript
interface Entity {
  id: string;
  name: string;
  type: 'Cliente' | 'Fornecedor' | 'Ambos';
  
  // Informações de Contato
  email?: string;
  phone?: string;
  website?: string;
  
  // Informações Fiscais
  document?: string; // CPF/CNPJ
  documentType?: 'CPF' | 'CNPJ';
  
  // Endereço
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  
  // Metadados
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string; // userId
  isActive: boolean;
}
```

### Estrutura no Firestore

```
entities/
  ├── {entityId}/
  │   ├── name: string
  │   ├── type: string
  │   ├── email: string
  │   ├── phone: string
  │   ├── document: string
  │   ├── address: object
  │   ├── notes: string
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   ├── createdBy: string
  │   └── isActive: boolean
```

## 🔄 Estratégia de Migração

### Fase 1: Preparação (Sem Breaking Changes)

1. **Criar nova coleção `entities` no Firestore**
2. **Criar serviço `entityService` no código**
3. **Manter compatibilidade**: Continuar usando `settings.entities` temporariamente
4. **Criar componente de cadastro** (sem remover o antigo)

### Fase 2: Migração de Dados

1. **Script de migração**:
   ```typescript
   // Migrar entities de settings para nova coleção
   const migrateEntities = async () => {
     const settings = await settingsService.get();
     if (settings?.entities) {
       for (const entity of settings.entities) {
         await entityService.add({
           ...entity,
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString(),
           isActive: true
         });
       }
     }
   };
   ```

2. **Validação**: Verificar se todas as entidades foram migradas
3. **Backup**: Manter `settings.entities` como backup por 30 dias

### Fase 3: Atualização do Código

1. **Atualizar componente Settings**:
   - Remover seção de entidades
   - Adicionar link para novo módulo de cadastro

2. **Criar novo módulo "Cadastros"**:
   - Lista de entidades
   - Formulário completo de cadastro
   - Filtros e busca
   - Histórico de transações por entidade

3. **Atualizar componente Transactions**:
   - Buscar entidades da nova coleção
   - Manter compatibilidade com IDs antigos

### Fase 4: Limpeza

1. **Remover `entities` de `settings`** (após validação)
2. **Atualizar documentação**
3. **Remover código legado**

## 📝 Implementação Técnica

### Novo Serviço: `entityService`

```typescript
export const entityService = {
  getAll: async (): Promise<Entity[]> => {
    const querySnapshot = await getDocs(collection(db, ENTITIES_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Entity));
  },
  
  getByType: async (type: 'Cliente' | 'Fornecedor' | 'Ambos'): Promise<Entity[]> => {
    const all = await entityService.getAll();
    return all.filter(e => 
      e.type === type || 
      e.type === 'Ambos' || 
      type === 'Ambos'
    );
  },
  
  add: async (entity: Omit<Entity, 'id'>) => {
    return await addDoc(collection(db, ENTITIES_COLLECTION), entity);
  },
  
  update: async (id: string, data: Partial<Entity>) => {
    return await updateDoc(doc(db, ENTITIES_COLLECTION, id), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },
  
  delete: async (id: string) => {
    // Soft delete
    return await entityService.update(id, { isActive: false });
  }
};
```

### Novo Componente: `Entities.tsx`

- Lista de entidades com filtros
- Modal de cadastro/edição completo
- Busca e ordenação
- Integração com transações

## ⚠️ Considerações Importantes

### Compatibilidade

- **Manter IDs antigos**: Se possível, usar mesmo ID ao migrar
- **Fallback**: Se nova coleção vazia, usar `settings.entities`
- **Período de transição**: 30-60 dias com ambos funcionando

### Performance

- **Índices**: Criar índices no Firestore para `type`, `isActive`
- **Cache**: Cachear lista de entidades no cliente
- **Paginação**: Se muitas entidades, implementar paginação

### Segurança

- **Regras Firestore**: Atualizar regras para nova coleção
- **Validação**: Validar dados antes de salvar
- **Permissões**: Apenas usuários autenticados podem criar/editar

## 📅 Timeline Sugerido

1. **Semana 1-2**: Criar estrutura e serviços (Fase 1)
2. **Semana 3**: Migração de dados e validação (Fase 2)
3. **Semana 4-5**: Atualizar componentes (Fase 3)
4. **Semana 6**: Testes e ajustes
5. **Semana 7**: Limpeza e documentação (Fase 4)

## 🔍 Benefícios da Migração

1. ✅ **Escalabilidade**: Suporta milhares de entidades
2. ✅ **Funcionalidades**: Campos adicionais (CNPJ, endereço, etc.)
3. ✅ **Histórico**: Rastreamento de transações por entidade
4. ✅ **Organização**: Separação clara entre configurações e dados
5. ✅ **Performance**: Consultas mais eficientes
6. ✅ **Manutenibilidade**: Código mais organizado

## 📌 Próximos Passos

1. Revisar e aprovar este plano
2. Criar branch `feature/entity-migration`
3. Implementar Fase 1 (estrutura básica)
4. Testar com dados de desenvolvimento
5. Migrar dados de produção
6. Atualizar componentes gradualmente

