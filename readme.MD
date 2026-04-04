# MVP - Classificacao de Aceitacao de Veiculos

Este repositorio implementa um MVP de classificacao de veiculos com Machine Learning, com fluxo completo entre treinamento, API e interface web.

## Visao Geral

O sistema classifica a aceitacao de um veiculo com base em 6 atributos categoricos:

- preco de compra (`buying`)
- custo de manutencao (`maint`)
- numero de portas (`doors`)
- capacidade de passageiros (`persons`)
- tamanho do porta-malas (`lug_boot`)
- nivel de seguranca (`safety`)

Classes previstas pelo modelo:

- `unacc`: Inaceitavel
- `acc`: Aceitavel
- `good`: Bom
- `vgood`: Muito Bom

Dataset utilizado: UCI Car Evaluation Database.

## Arquitetura

```text
Diabetes-ML-Project/
|- backend/
|  |- main.py                  # API FastAPI e endpoint /predict
|  |- schemas.py               # validacao de entrada com Pydantic
|  |- model.pkl                # modelo treinado
|  |- requirements.txt
|  \- tests/
|     \- test_model.py         # validacao de desempenho do modelo
|- frontend/
|  |- app/
|  |  \- page.tsx              # formulario e exibicao de resultado
|  |- package.json
|  \- ...
|- ML/
|  \- notebook.ipynb           # treinamento e comparacao de modelos
|- .github/workflows/
|  \- ci.yml
|- mvp_puc_notebook.ipynb
|- requirements.txt
\- readme.MD
```

Nota: o nome da pasta raiz ainda contem `Diabetes-ML-Project`, mas o dominio funcional do projeto e avaliacao de veiculos.

## Fluxo da Aplicacao

1. Usuario preenche o formulario no frontend (Next.js).
2. Frontend envia `POST /predict` para o backend (FastAPI).
3. Backend valida os dados via `CarEvaluationData`.
4. API carrega `model.pkl` e executa `predict` (e `predict_proba`, quando disponivel).
5. Backend retorna JSON com:
	 - `prediction`
	 - `prediction_label`
	 - `confidence`
6. Frontend exibe classe e confianca para o usuario.

## Requisitos

- Python 3.12
- Node.js 20+
- npm

## Setup do Ambiente Python

Na raiz do projeto:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Executar Backend

```powershell
venv\Scripts\Activate.ps1
cd backend
python main.py
```

API: `http://127.0.0.1:8000`

Rotas principais:

- `GET /`
- `POST /predict`

Exemplo de payload para `POST /predict`:

```json
{
	"buying": "low",
	"maint": "low",
	"doors": "4",
	"persons": "4",
	"lug_boot": "big",
	"safety": "high"
}
```

## Executar Frontend

```powershell
cd frontend
npm install
npm run dev
```

Aplicacao: `http://localhost:3000`

## Testes

Com ambiente Python ativado:

```powershell
cd backend
python -m pytest tests -q
```

O teste em `backend/tests/test_model.py` valida os thresholds minimos:

- accuracy >= `0.95`
- macro F1 >= `0.95`

## Treinamento do Modelo

Notebook principal: `ML/notebook.ipynb`

Notebook Colab (referencia):

https://colab.research.google.com/drive/16TfnY7MqW_mlUc1ukQv54tabZlyLjRqn

Etapas cobertas no notebook:

- carga do dataset
- split treino/teste
- preprocessamento de variaveis categoricas
- treinamento de modelos (KNN, Arvore, Naive Bayes, SVM)
- ajuste de hiperparametros com GridSearchCV
- exportacao do melhor modelo para `backend/model.pkl`

## CI

Pipeline: `.github/workflows/ci.yml`

Executa em `push` e `pull_request` na branch `main`, incluindo instalacao de dependencias e execucao dos testes do backend.

## Entrega (MVP da Pos)

Checklist sugerido:

- [ ] notebook executa do inicio ao fim
- [ ] `backend/model.pkl` atualizado
- [ ] backend sobe sem erros
- [ ] frontend sobe sem erros
- [ ] predicao funciona na interface
- [ ] testes passam localmente
- [ ] CI executa com sucesso
- [ ] repositorio publico
- [ ] link do Colab valido
- [ ] link do video incluido abaixo

Video de apresentacao (ate 3 min):

- [`VIDEO_LINK_AQUI`](https://drive.google.com/file/d/1uPiDQKOfTpemPAZycV000xeqXhEJMVC1/view?usp=sharing)