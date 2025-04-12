# Certificados SSL para Desenvolvimento

Este diretório deve conter seus certificados SSL para desenvolvimento.

## Gerar Certificados Auto-Assinados para Desenvolvimento

Para testes locais, você pode gerar certificados auto-assinados usando OpenSSL:

```bash
# Gerar chave privada
openssl genrsa -out key.pem 2048

# Gerar certificado auto-assinado
openssl req -new -x509 -key key.pem -out cert.pem -days 365 -subj "/CN=localhost"
```

**Nota**: Estes certificados auto-assinados gerarão avisos de segurança no navegador. Para ambiente de produção, use certificados válidos de uma autoridade certificadora como Let's Encrypt.

## Configuração

Para uso em produção, coloque seus certificados reais neste diretório com os nomes:
- `cert.pem` - certificado público
- `key.pem` - chave privada

Em seguida, a configuração do Nginx irá utilizar automaticamente estes arquivos. 