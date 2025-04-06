# 🧠 PROAGENDIFY

Sistema SaaS para profissionais autônomos da área da beleza/estética.

## 🚀 Tecnologias

- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + Express + Prisma
- Banco de Dados: PostgreSQL
- Cache: Redis

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/proagendify.git
cd proagendify
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Inicie os containers Docker:
```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:
```bash
cd backend
npm run prisma:migrate
```

## 🚀 Executando o projeto

1. Inicie o backend:
```bash
npm run dev:backend
```

2. Inicie o frontend:
```bash
npm run dev:frontend
```

3. Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3333

## 📚 Documentação

A documentação da API está disponível em `/api/docs` quando o servidor estiver em execução.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
