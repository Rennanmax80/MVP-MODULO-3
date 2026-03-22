"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface PredictionResult {
  prediction: string;
  prediction_label: string;
  confidence: number | null;
}

const FIELDS = [
  "buying",
  "maint",
  "doors",
  "persons",
  "lug_boot",
  "safety",
] as const;

type Field = (typeof FIELDS)[number];

type FormData = Record<Field, string>;

const INITIAL_FORM: FormData = {
  buying: "",
  maint: "",
  doors: "",
  persons: "",
  lug_boot: "",
  safety: "",
};

const FIELD_LABELS: Record<(typeof FIELDS)[number], string> = {
  buying: "Preco de Compra",
  maint: "Custo de Manutencao",
  doors: "Numero de Portas",
  persons: "Capacidade de Passageiros",
  lug_boot: "Porta-Malas",
  safety: "Nivel de Seguranca",
};

const FIELD_OPTIONS: Record<Field, Array<{ value: string; label: string }>> = {
  buying: [
    { value: "low", label: "Baixo" },
    { value: "med", label: "Medio" },
    { value: "high", label: "Alto" },
    { value: "vhigh", label: "Muito Alto" },
  ],
  maint: [
    { value: "low", label: "Baixo" },
    { value: "med", label: "Medio" },
    { value: "high", label: "Alto" },
    { value: "vhigh", label: "Muito Alto" },
  ],
  doors: [
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5more", label: "5 ou mais" },
  ],
  persons: [
    { value: "2", label: "2 pessoas" },
    { value: "4", label: "4 pessoas" },
    { value: "more", label: "Mais de 4 pessoas" },
  ],
  lug_boot: [
    { value: "small", label: "Pequeno" },
    { value: "med", label: "Medio" },
    { value: "big", label: "Grande" },
  ],
  safety: [
    { value: "low", label: "Baixo" },
    { value: "med", label: "Medio" },
    { value: "high", label: "Alto" },
  ],
};

function getEvaluationTone(prediction: string): string {
  if (prediction === "vgood") return "text-emerald-700";
  if (prediction === "good") return "text-blue-700";
  if (prediction === "acc") return "text-amber-700";
  return "text-rose-700";
}

export default function Home() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (FIELDS.some((field) => form[field] === "" || form[field] === undefined)) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Falha na predição. Verifique se o backend está em execução.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-sky-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Avaliacao de Veiculos
        </h1>
        <p className="text-sm text-slate-600 mb-6 text-center">
          Informe as caracteristicas do veiculo para estimar sua classificacao de aceitacao.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {FIELD_LABELS[field]}
              </label>
              <select
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="">Selecione</option>
                {FIELD_OPTIONS[field].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition mt-2"
          >
            {loading ? "Avaliando..." : "Avaliar veiculo"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">Erro: {error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <p className={`font-semibold text-xl ${getEvaluationTone(result.prediction)}`}>
              Classe prevista: {result.prediction_label}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              Codigo da classe: {result.prediction}
            </p>
            {result.confidence !== null ? (
              <>
                <p className="text-slate-700 text-sm mt-3">
                  Confianca do modelo: {(result.confidence * 100).toFixed(2)}%
                </p>
              </>
            ) : (
              <p className="text-slate-700 text-sm mt-2">
                Probabilidade indisponível para este modelo.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}