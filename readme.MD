# MVP - Classificacao de Aceitacao de Veiculos

Este projeto implementa um MVP completo de classificacao com machine learning usando o dataset Car Evaluation, contemplando:

- notebook de treinamento e comparacao de modelos no Google Colab
- backend em FastAPI com modelo embarcado
- frontend em Next.js para entrada de dados e exibicao da predicao
- teste automatizado com PyTest para validar o desempenho minimo do modelo
- workflow de CI no GitHub Actions

## Tema do Problema

O objetivo do projeto e classificar a aceitacao de um veiculo com base em atributos categoricos como preco de compra, custo de manutencao, numero de portas, capacidade de passageiros, porta-malas e nivel de seguranca.

As classes previstas pelo modelo sao:

- `unacc`: Inaceitavel
- `acc`: Aceitavel
- `good`: Bom
- `vgood`: Muito Bom

## Estrutura do Projeto

```text
Diabetes-ML-Project/
|- backend/
|  |- main.py
|  |- model.pkl
|  |- schemas.py
|  \- tests/
|- frontend/
|  \- app/
|- ML/
|  \- notebook.ipynb
|- .github/workflows/
|  \- ci.yml
|- requirements.txt
\- readme.MD
```

## Notebook do Google Colab

Link atual do notebook:

https://colab.research.google.com/drive/16TfnY7MqW_mlUc1ukQv54tabZlyLjRqn

O notebook em [ML/notebook.ipynb](ML/notebook.ipynb) executa:

- carga do dataset via URL publica
- separacao holdout entre treino e teste
- preprocessamento de variaveis categoricas
- treinamento com KNN, Arvore de Classificacao, Naive Bayes e SVM
- otimizacao de hiperparametros com GridSearchCV
- comparacao dos resultados com metricas
- exportacao do melhor modelo para `model.pkl`

## Requisitos

- Python 3.12
- Node.js 20+
- npm

## Configuracao do Ambiente Python

Na raiz do projeto:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Como Rodar o Backend

```powershell
venv\Scripts\Activate.ps1
cd backend
python main.py
```

API disponivel em:

`http://127.0.0.1:8000`

Endpoint principal:

- `POST /predict`

## Como Rodar o Frontend

```powershell
cd frontend
npm install
npm run dev
```

Aplicacao disponivel em:

`http://localhost:3000`

## Como Executar os Testes

Com o ambiente Python ativado:

```powershell
cd backend
python -m pytest tests -q
```

O teste automatizado em [backend/tests/test_model.py](backend/tests/test_model.py) verifica se o modelo atende aos thresholds minimos definidos para o projeto.

Thresholds atuais:

- accuracy minima: `0.95`
- macro F1 minima: `0.95`

## Workflow CI

O workflow de integracao continua esta em [.github/workflows/ci.yml](.github/workflows/ci.yml).

Ele executa automaticamente em `push` e `pull_request` na branch `main` e realiza:

- checkout do repositorio
- instalacao do Python 3.12
- instalacao das dependencias do projeto
- execucao do PyTest no backend

## Exemplo de Entrada no Frontend

Um exemplo que tende a gerar boa avaliacao:

- Preco de Compra: `Baixo`
- Custo de Manutencao: `Baixo`
- Numero de Portas: `4`
- Capacidade de Passageiros: `4 pessoas`
- Porta-Malas: `Grande`
- Nivel de Seguranca: `Alto`

## Reflexao Sobre Software Seguro

Apesar de este dataset nao conter dados pessoais, em um problema real de avaliacao de veiculos seria importante aplicar boas praticas de software seguro, como:

- validacao estrita das entradas recebidas pela API
- controle de acesso aos dados utilizados no treinamento
- rastreabilidade da origem dos dados
- protecao contra alteracoes indevidas no arquivo do modelo
- anonimização de identificadores caso o problema envolva clientes, placas ou historico de uso

## Entrega no GitHub

Para a entrega, o repositorio publico deve conter:

- notebook executavel no Google Colab
- codigo completo da aplicacao full stack
- teste automatizado do modelo
- arquivos auxiliares necessarios para execucao
- link do video de apresentacao

## Video de Apresentacao

Adicionar aqui o link final do video de ate 3 minutos:

- `VIDEO_LINK_AQUI`

## Checklist Final de Submissao

- [ ] notebook executa do inicio ao fim no Colab
- [ ] modelo exportado corretamente para `backend/model.pkl`
- [ ] backend sobe sem erros
- [ ] frontend sobe sem erros
- [ ] predicao funciona pela interface
- [ ] PyTest passa localmente
- [ ] workflow do GitHub Actions executa com sucesso
- [ ] repositorio esta publico
- [ ] link do notebook no Colab esta valido
- [ ] link do video foi incluido no README